import Quiz from "./quiz.model.js";
import Course from "../courses/course.model.js";
import Section from "../sections/section.model.js";
import Enrollment from "../enrollments/enrollment.model.js";
import QuizAttempt from "./quizAttempt.model.js";
import { AppError } from "../../utils/appError.js";
import Question from "./question.model.js";
import mongoose from "mongoose";

export const createQuizService = async (data) => {
  // 1️⃣ Validate course exists
  const course = await Course.findById(data.course);
  if (!course) throw new AppError("Course not found", 404);

  // 2️⃣ Only trainer can create quiz
  if (course.trainer.toString() !== data.createdBy.toString()) {
    throw new AppError("Not authorized to add quiz to this course", 403);
  }

  // 3️⃣ Validate section exists
  const section = await Section.findById(data.section);
  if (!section) throw new AppError("Section not found", 404);

  // 4️⃣ Auto order (next available order in section)
  const lastQuiz = await Quiz.findOne({ section: data.section })
    .sort({ order: -1 })
    .select("order");

  const nextOrder = lastQuiz ? lastQuiz.order + 1 : 1;

  // 5️⃣ Create quiz
  const quiz = await Quiz.create({
    ...data,
    order: nextOrder,
    isPublished: false, // default draft
  });

  if (course.status === "published") {
  course.needsRepublish = true;
  await course.save();
}

  return quiz;
};

export const getQuizForStudentService = async (quizId) => {
  // 🛑 HARD GUARD
  if (!quizId || !mongoose.Types.ObjectId.isValid(quizId)) {
    throw new AppError("Invalid or missing quiz ID", 400);
  }

  const quiz = await Quiz.findOne({
    _id: quizId,
    isPublished: true,
  }).select(
    "title description timeLimit totalMarks passMarks allowedAttempts shuffleQuestions"
  );

  if (!quiz) {
    throw new AppError("Quiz not found or not published", 404);
  }

  const questions = await Question.find({ quiz: quizId })
    .sort({ order: 1 })
    .select("text options marks order")
    .lean();

  // 🔒 REMOVE correct answers
  const safeQuestions = questions.map((q) => ({
    _id: q._id,
    text: q.text,
    marks: q.marks,
    order: q.order,
    options: q.options.map((o) => ({
      _id: o._id,
      text: o.text,
    })),
  }));

  return {
    quiz,
    questions: safeQuestions,
  };
};

export const deleteQuizService = async ({
  quizId,
  courseId,
  deletedBy,
}) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // 1️⃣ Validate course
    const course = await Course.findById(courseId).session(session);
    if (!course) throw new AppError("Course not found", 404);

    // 2️⃣ Ownership check
    if (course.trainer.toString() !== deletedBy.toString()) {
      throw new AppError("Not authorized to delete quiz", 403);
    }

    // 3️⃣ Find quiz
    const quiz = await Quiz.findById(quizId).session(session);
    if (!quiz) throw new AppError("Quiz not found", 404);

    // 4️⃣ Safety: quiz belongs to course
    if (quiz.course.toString() !== courseId.toString()) {
      throw new AppError("Quiz does not belong to this course", 400);
    }

    // 5️⃣ Delete related questions
    await Question.deleteMany({ quiz: quizId }).session(session);

    // 6️⃣ Delete related attempts
    await QuizAttempt.deleteMany({ quiz: quizId }).session(session);

    // 7️⃣ Remove quiz from section.contents (if stored there)
    await Section.findByIdAndUpdate(
      quiz.section,
      { $pull: { contents: quiz._id } },
      { session }
    );

    // 8️⃣ Delete quiz itself
    await Quiz.findByIdAndDelete(quizId).session(session);

    // 9️⃣ Mark course for republish
    if (course.status === "published") {
      course.needsRepublish = true;
      await course.save({ session });
    }

    await session.commitTransaction();
    session.endSession();

    return true;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};


export const getQuizWithAnswersService = async (quizId) => {
  // 🛑 HARD GUARD
  if (!quizId || !mongoose.Types.ObjectId.isValid(quizId)) {
    throw new AppError("Invalid or missing quiz ID", 400);
  }

  const quiz = await Quiz.findOne({
    _id: quizId,
    isPublished: true,
  }).select(
    "title description timeLimit totalMarks passMarks allowedAttempts shuffleQuestions"
  );

  if (!quiz) {
    throw new AppError("Quiz not found or not published", 404);
  }

  const questions = await Question.find({ quiz: quizId })
    .sort({ order: 1 })
    .select("text options marks order")
    .lean();

  // ✅ INCLUDE correct answers (only for showing results)
  const questionsWithAnswers = questions.map((q) => ({
    _id: q._id,
    text: q.text,
    marks: q.marks,
    order: q.order,
    options: q.options.map((o) => ({
      text: o.text,
      isCorrect: o.isCorrect,
    })),
  }));

  return {
    quiz,
    questions: questionsWithAnswers,
  };
};

/**
 * Get quizzes for a student from their enrolled courses
 */
export const getStudentQuizzesService = async (studentId) => {
  try {
    // Get all enrolled courses for the student
    const enrollments = await Enrollment.find({
      student: new mongoose.Types.ObjectId(studentId),
      status: "active",
    }).select("course");

    const enrolledCourseIds = enrollments.map((e) => e.course);

    if (enrolledCourseIds.length === 0) {
      return { active: [], completed: [] };
    }

    // Get all published quizzes from enrolled courses
    const quizzes = await Quiz.find({
      course: { $in: enrolledCourseIds },
      isPublished: true,
    })
      .populate("course", "title")
      .populate("section", "title")
      .sort({ createdAt: -1 })
      .lean();

    // Get all quiz attempts for the student to determine status
    const studentAttempts = await QuizAttempt.find({
      student: new mongoose.Types.ObjectId(studentId),
      quiz: { $in: quizzes.map((q) => q._id) },
    })
      .select("quiz status totalMarksObtained submittedAt")
      .lean();

    // Create a map of quiz attempts
    const attemptsMap = {};
    studentAttempts.forEach((attempt) => {
      const quizId = attempt.quiz.toString();
      if (!attemptsMap[quizId]) {
        attemptsMap[quizId] = [];
      }
      attemptsMap[quizId].push(attempt);
    });

    // Separate active and completed quizzes
    const active = [];
    const completed = [];

    quizzes.forEach((quiz) => {
      const quizId = quiz._id.toString();
      const attempts = attemptsMap[quizId] || [];
      const completedAttempts = attempts.filter((a) => a.status === "submitted" || a.status === "evaluated");
      const isCompleted = completedAttempts.length > 0;

      const quizData = {
        id: quiz._id,
        title: quiz.title,
        description: quiz.description,
        course: quiz.course,
        section: quiz.section,
        timeLimit: quiz.timeLimit,
        totalMarks: quiz.totalMarks,
        passMarks: quiz.passMarks,
        allowedAttempts: quiz.allowedAttempts,
        attemptsTaken: completedAttempts.length,
        bestScore: completedAttempts.length > 0 
          ? Math.max(...completedAttempts.map((a) => a.totalMarksObtained))
          : null,
        lastAttemptScore: completedAttempts.length > 0 
          ? completedAttempts[completedAttempts.length - 1].totalMarksObtained
          : null,
        lastAttemptDate: completedAttempts.length > 0 
          ? completedAttempts[completedAttempts.length - 1].submittedAt
          : null,
        createdAt: quiz.createdAt,
      };

      if (isCompleted) {
        completed.push(quizData);
      } else {
        active.push(quizData);
      }
    });

    return { active, completed };
  } catch (error) {
    throw error;
  }
};
