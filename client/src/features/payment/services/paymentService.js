import api from "@/services/api";

// ✅ Create Stripe PaymentIntent
export const createPaymentIntent = (courseId, amount) =>
  api.post("/payments/create-intent", { courseId, amount });

// ✅ Confirm payment and enroll course
export const confirmPayment = async (stripe, elements, clientSecret, courseId) => {
  if (!stripe || !elements) throw new Error("Stripe not loaded");

  // 1️⃣ Confirm card payment with Stripe
  const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
    payment_method: {
      card: elements.getElement("card"),
    },
  });

  if (error) {
    throw new Error(error.message || "Payment failed");
  }

  if (paymentIntent.status !== "succeeded") {
    throw new Error("Payment not successful");
  }

  // 2️⃣ Call backend to enroll user after payment success
  const response = await api.post(`/enrollments/${courseId}`);
  return response.data; // { success, message, data: enrollment }
};
