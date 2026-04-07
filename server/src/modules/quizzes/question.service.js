import Question from "./question.model.js";
import Quiz from "./quiz.model.js";
import { AppError } from "../../utils/appError.js";

export const createQuestionService = async (data) => {
  // 1️⃣ Check if quiz exists
  const quiz = await Quiz.findById(data.quiz);
  if (!quiz) throw new AppError("Quiz not found", 404);

  // 2️⃣ Only trainer who created quiz can add questions
  if (quiz.createdBy.toString() !== data.createdBy.toString()) {
    throw new AppError("Not authorized to add question to this quiz", 403);
  }

  // 3️⃣ Auto-calculate order
  const lastQuestion = await Question.findOne({ quiz: data.quiz })
    .sort({ order: -1 })
    .select("order");

  const nextOrder = lastQuestion ? lastQuestion.order + 1 : 1;

  // 4️⃣ Create question
  const question = await Question.create({
    ...data,
    order: nextOrder,
  });

  return question;
};
