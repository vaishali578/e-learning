import asyncHandler from "../../utils/asyncHandler.js";
import { AppError } from "../../utils/appError.js";
import { createQuestionService } from "./question.service.js";

export const createQuestion = asyncHandler(async (req, res) => {
  const { quizId } = req.params; // ✅ params se lo
  const { text, type, options, marks } = req.body;

  // 1️⃣ Validations
  if (!quizId) throw new AppError("Quiz ID is required", 400);
  if (!text?.trim()) throw new AppError("Question text is required", 400);
  if (!type) throw new AppError("Question type is required", 400);
  if (marks === undefined || marks <= 0) {
    throw new AppError("Marks must be greater than 0", 400);
  }

  // 2️⃣ MCQ / Multi-select validation
  if (
    (type === "mcq" || type === "multi_select") &&
    (!Array.isArray(options) || options.length < 2)
  ) {
    throw new AppError(
      "At least 2 options are required for MCQ or Multi-select questions",
      400
    );
  }

  // 3️⃣ Create question
  const question = await createQuestionService({
    quiz: quizId,
    text: text.trim(),
    type,
    options,
    marks,
    createdBy: req.user.id, // trainer
  });

  res.status(201).json({
    success: true,
    message: "Question created successfully",
    data: {
      id: question._id,
      text: question.text,
      type: question.type,
      order: question.order,
    },
  });
});
