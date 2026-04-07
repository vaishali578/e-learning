import asyncHandler from "../../utils/asyncHandler.js";
import { AppError } from "../../utils/appError.js";
import {
  startQuizAttemptService,
  submitQuizAttemptService,
} from "./quizAttempt.service.js";

// ================= START ATTEMPT =================
export const startQuizAttempt = asyncHandler(async (req, res) => {
  const { quizId } = req.body;
  if (!quizId) throw new AppError("Quiz ID is required", 400);

  const attempt = await startQuizAttemptService(quizId, req.user.id);

  res.status(201).json({
    success: true,
    message: "Quiz attempt started",
    data: attempt,
  });
});

// ================= SUBMIT ATTEMPT =================
export const submitQuizAttempt = asyncHandler(async (req, res) => {
  const { attemptId, answers } = req.body;

  if (!attemptId) throw new AppError("Attempt ID is required", 400);
  if (!answers || !Array.isArray(answers))
    throw new AppError("Answers are required", 400);

  const submittedAttempt = await submitQuizAttemptService(
    attemptId,
    req.user.id,
    answers
  );

  res.status(200).json({
    success: true,
    message: "Quiz submitted successfully",
    data: submittedAttempt,
  });
});
