import CourseProgress from "./courseProgress.model.js";
import Lesson from "../lessons/lesson.model.js";
import Quiz from "../quizzes/quiz.model.js";
import Assignment from "../assignments/assignment.model.js";
import Enrollment from "../enrollments/enrollment.model.js";

/* ===============================
   MARK ITEM COMPLETE
================================= */
export const markItemCompleteService = async ({
  studentId,
  courseId,
  itemId,
  itemType,
}) => {
  // 1️⃣ Add item if not already completed
  await CourseProgress.updateOne(
    { student: studentId, course: courseId },
    {
      $addToSet: {
        completedItems: {
          itemId,
          itemType,
          completedAt: new Date(),
        },
      },
    },
    { upsert: true }
  );

  // 2️⃣ Recalculate progress
  await recalculateProgress(studentId, courseId);
};

/* ===============================
   RECALCULATE PROGRESS
================================= */
export const recalculateProgress = async (studentId, courseId) => {
  const [
    totalLessons,
    totalQuizzes,
    totalAssignments,
    progressDoc,
  ] = await Promise.all([
    Lesson.countDocuments({ course: courseId, isPublished: true }),
    Quiz.countDocuments({ course: courseId, isPublished: true }),
    Assignment.countDocuments({ course: courseId, isPublished: true }),
    CourseProgress.findOne({ student: studentId, course: courseId }),
  ]);

  const totalItems = totalLessons + totalQuizzes + totalAssignments;

  const completedCount = progressDoc?.completedItems.length || 0;

  const percentage =
    totalItems === 0
      ? 0
      : Math.round((completedCount / totalItems) * 100);

  // Update enrollment
  await Enrollment.findOneAndUpdate(
    { student: studentId, course: courseId },
    {
      progressPercentage: percentage,
      ...(percentage === 100 && { status: "completed" }),
    }
  );

  return percentage;
};

/* ===============================
   GET COURSE PROGRESS
================================= */
export const getCourseProgressService = async (studentId, courseId) => {
  const progress = await CourseProgress.findOne({
    student: studentId,
    course: courseId,
  });

  const enrollment = await Enrollment.findOne({
    student: studentId,
    course: courseId,
  });

  return {
    completedItems: progress?.completedItems || [],
    progressPercentage: enrollment?.progressPercentage || 0,
  };
};