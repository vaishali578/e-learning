import asyncHandler from "../../utils/asyncHandler.js";
import { AppError } from "../../utils/appError.js";
import { createQuizService, getQuizForStudentService, getQuizWithAnswersService, getStudentQuizzesService, deleteQuizService } from "./quiz.service.js";

export const createQuiz = asyncHandler(async (req, res) => {
  const {
    title,
    description,
    courseId,
    sectionId,
    timeLimit,
    totalMarks,
    passMarks,
    allowedAttempts,
    shuffleQuestions,
  } = req.body;

  // 🔁 Convert to numbers (VERY IMPORTANT)
  const total = Number(totalMarks);
  const pass = Number(passMarks);
  const time = timeLimit !== undefined ? Number(timeLimit) : undefined;
  const attempts =
    allowedAttempts !== undefined ? Number(allowedAttempts) : undefined;

  // 1️⃣ Basic validations
  if (!title?.trim())
    throw new AppError("Quiz title is required", 400);

  if (!courseId || !sectionId)
    throw new AppError("Course and section are required", 400);

  if (!Number.isFinite(total) || total <= 0)
    throw new AppError("Total marks must be greater than 0", 400);

  if (!Number.isFinite(pass))
    throw new AppError("Pass marks required", 400);

  if (pass > total)
    throw new AppError("Pass marks cannot exceed total marks", 400);

  if (time !== undefined && (!Number.isFinite(time) || time <= 0))
    throw new AppError("Time limit must be a positive number", 400);

  if (attempts !== undefined && (!Number.isFinite(attempts) || attempts <= 0))
    throw new AppError("Allowed attempts must be a positive number", 400);

  // 2️⃣ Call service
  const quiz = await createQuizService({
    title: title.trim(),
    description,
    course: courseId,
    section: sectionId,
    timeLimit: time,
    totalMarks: total,
    passMarks: pass,
    allowedAttempts: attempts,
    shuffleQuestions: Boolean(shuffleQuestions),
    createdBy: req.user.id,
  });

  // 3️⃣ Response
  res.status(201).json({
    success: true,
    message: "Quiz created successfully",
    data: {
      id: quiz._id,
      title: quiz.title,
      order: quiz.order,
      isPublished: quiz.isPublished,
    },
  });
});

export const deleteQuiz = asyncHandler(async (req, res) => {
  const { quizId } = req.params;
  const { courseId } = req.query;

  if (!quizId || !courseId) {
    throw new AppError("Quiz id and course id are required", 400);
  }

  await deleteQuizService({
    quizId,
    courseId,
    deletedBy: req.user.id,
  });

  res.status(200).json({
    success: true,
    message: "Quiz deleted successfully",
  });
});


export const getQuizForStudent = asyncHandler(async (req, res) => {
  const { quizId } = req.params;

  // 🛑 HARD GUARD (very important)
  if (!quizId) {
    throw new AppError("Quiz ID is required", 400);
  } 

  const data = await getQuizForStudentService(quizId);

  res.status(200).json({
    success: true,
    data,
  });
});

export const getQuizWithAnswers = asyncHandler(async (req, res) => {
  const { quizId } = req.params;

  // 🛑 HARD GUARD (very important)
  if (!quizId) {
    throw new AppError("Quiz ID is required", 400);
  } 

  const data = await getQuizWithAnswersService(quizId);

  res.status(200).json({
    success: true,
    data,
  });
});

/**
 * GET /api/quizzes/my-quizzes
 * Get all quizzes for logged-in student from their enrolled courses
 */
export const getStudentQuizzes = asyncHandler(async (req, res) => {
  const studentId = req.user.id;

  const quizzes = await getStudentQuizzesService(studentId);

  res.status(200).json({
    success: true,
    data: quizzes,
  });
});
