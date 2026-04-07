import Quiz from "../quiz/quiz.model.js";
import Question from "../question/question.model.js";
import QuizAttempt from "./quizAttempt.model.js";
import { AppError } from "../../utils/appError.js";

export const startQuizAttemptService = async (quizId, studentId) => {
  // 1️⃣ Check quiz exists
  const quiz = await Quiz.findById(quizId);
  if (!quiz) throw new AppError("Quiz not found", 404);

  // 2️⃣ Check allowed attempts
  const attemptsCount = await QuizAttempt.countDocuments({
    quiz: quizId,
    student: studentId,
  });
  if (attemptsCount >= quiz.allowedAttempts) {
    throw new AppError("Maximum attempts reached", 400);
  }

  // 3️⃣ Create attempt
  const attempt = await QuizAttempt.create({
    quiz: quizId,
    student: studentId,
    status: "in_progress",
  });

  return attempt;
};

export const submitQuizAttemptService = async (attemptId, studentId, answers) => {
  // 1️⃣ Fetch attempt
  const attempt = await QuizAttempt.findById(attemptId);
  if (!attempt) throw new AppError("Quiz attempt not found", 404);
  if (attempt.student.toString() !== studentId.toString()) {
    throw new AppError("Not authorized to submit this attempt", 403);
  }

  if (attempt.status !== "in_progress") {
    throw new AppError("Quiz already submitted", 400);
  }

  // 2️⃣ Fetch questions
  const questionIds = answers.map((a) => a.question);
  const questions = await Question.find({ _id: { $in: questionIds } });

  let totalMarksObtained = 0;

  // 3️⃣ Evaluate answers
  const evaluatedAnswers = answers.map((ans) => {
    const question = questions.find(
      (q) => q._id.toString() === ans.question.toString()
    );
    if (!question) throw new AppError("Question not found", 400);

    let isCorrect = false;
    let marksObtained = 0;

    if (question.type === "true_false") {
      // single option
      isCorrect =
        ans.selectedOptions[0] ===
        question.options.findIndex((o) => o.isCorrect === true);
      marksObtained = isCorrect ? question.marks : 0;
    } else {
      // MCQ / Multi-select
      const correctIndexes = question.options
        .map((o, i) => (o.isCorrect ? i : -1))
        .filter((i) => i !== -1);

      // Compare arrays
      isCorrect =
        correctIndexes.length === ans.selectedOptions.length &&
        correctIndexes.every((v) => ans.selectedOptions.includes(v));

      marksObtained = isCorrect ? question.marks : 0;
    }

    totalMarksObtained += marksObtained;

    return {
      question: question._id,
      selectedOptions: ans.selectedOptions,
      isCorrect,
      marksObtained,
    };
  });

  // 4️⃣ Update attempt
  attempt.answers = evaluatedAnswers;
  attempt.submittedAt = new Date();
  attempt.totalMarksObtained = totalMarksObtained;
  attempt.status = "submitted";

  await attempt.save();

  return attempt;
};
