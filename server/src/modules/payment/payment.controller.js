import asyncHandler from "../../utils/asyncHandler.js";
import { AppError } from "../../utils/appError.js";
import { createPaymentIntentService, updatePaymentStatusService } from "./payment.service.js";
import stripe from "../../config/stripe.js";
import { enrollCourseService } from "../enrollments/enrollment.service.js";

/**
 * POST /api/payments/create-intent
 * Frontend calls this before payment
 */
export const createPaymentIntent = asyncHandler(async (req, res) => {
  const studentId = req.user.id;
  const { courseId, amount } = req.body;

  if (!courseId || !amount) {
    throw new AppError("Course ID and amount are required", 400);
  }

  // ✅ Create or reuse existing PaymentIntent
  const data = await createPaymentIntentService({ studentId, courseId, amount });

  res.status(201).json({
    success: true,
    message: "Payment intent created",
    data,
  });
});

/**
 * POST /api/payments/confirm
 * Called by frontend after payment confirmation
 */
export const confirmPayment = asyncHandler(async (req, res) => {
  const { paymentIntentId, courseId } = req.body;
  const studentId = req.user.id;

  if (!paymentIntentId || !courseId) {
    throw new AppError("Missing required info", 400);
  }


  // 🔐 Verify payment from Stripe
  const intent = await stripe.paymentIntents.retrieve(paymentIntentId);

  if (intent.status !== "succeeded") {
    throw new AppError("Payment not successful", 400);
  }

  // ✅ Update payment status in DB
  const payment = await updatePaymentStatusService(paymentIntentId, "success");

  // 🔒 Idempotent enrollment creation
  const enrollment = await enrollCourseService({
    studentId,
    courseId,
    paymentId: payment._id,
  });

  res.status(200).json({
    success: true,
    message: "Payment successful & course enrolled",
    data: { payment, enrollment },
  });
});
