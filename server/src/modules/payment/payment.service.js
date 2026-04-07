import stripe from "../../config/stripe.js";
import Payment from "./payment.model.js";
import Enrollment from "../enrollments/enrollment.model.js";
import { AppError } from "../../utils/appError.js";
import mongoose from "mongoose";

/**
 * Create Stripe PaymentIntent
 * Only create a new Payment record if no pending payment exists for this student/course
 */
export const createPaymentIntentService = async ({ studentId, courseId, amount }) => {
  if (!studentId || !courseId || !amount) {
    throw new AppError("Missing required payment info", 400);
  }

  const studentObjectId = new mongoose.Types.ObjectId(studentId);
  const courseObjectId = new mongoose.Types.ObjectId(courseId);

  // ✅ Proper matching
  const existingPayment = await Payment.findOne({
    student: studentObjectId,
    course: courseObjectId,
    status: "pending",
  });

  if (existingPayment) {
    return {
      clientSecret: existingPayment.clientSecret,
      paymentId: existingPayment._id,
    };
  }

  // ✅ Create Stripe Intent
  const paymentIntent = await stripe.paymentIntents.create({
    amount: amount * 100,
    currency: "inr",
    metadata: { studentId, courseId },
  });

  // ✅ Save with clientSecret
  const payment = await Payment.create({
    student: studentObjectId,
    course: courseObjectId,
    paymentIntentId: paymentIntent.id,
    clientSecret: paymentIntent.client_secret,
    amount,
    status: "pending",
  });

  return {
    clientSecret: payment.clientSecret,
    paymentId: payment._id,
  };
};

/**
 * Update Payment Status after Stripe webhook
 */
export const updatePaymentStatusService = async (paymentIntentId, status) => {
  if (!paymentIntentId || !status) {
    throw new AppError("Missing paymentIntentId or status", 400);
  }

  const payment = await Payment.findOne({ paymentIntentId });

  if (!payment) {
    throw new AppError("Payment not found", 404);
  }

  // ✅ Prevent duplicate processing
  if (payment.status === "success") {
    return payment;
  }

  payment.status = status;
  await payment.save();

  // ✅ Only create enrollment if payment succeeded
  if (status === "success") {
    // Check if enrollment already exists to avoid duplicates
    const existingEnrollment = await Enrollment.findOne({
      student: payment.student,
      course: payment.course,
    });

    if (!existingEnrollment) {
      await Enrollment.create({
        student: payment.student,
        course: payment.course,
        payment: payment._id,
      });
    }
  }

  return payment;
};
