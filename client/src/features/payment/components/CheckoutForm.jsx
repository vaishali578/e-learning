import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import { useState } from "react";
import CardField from "./CardField";
import { enrollCourse } from "../services/enrollmentService";

export default function CheckoutForm({ clientSecret, courseId }) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handlePay = async () => {
    if (!stripe || !elements || !clientSecret || !courseId) {
      console.warn("❌ Missing Stripe data", {
        stripe,
        elements,
        clientSecret,
        courseId,
      });
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // ✅ 1️⃣ Confirm payment with Stripe
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
        },
      });

      if (result.error) {
        throw new Error(result.error.message);
      }

      // ✅ 2️⃣ Extract paymentIntentId
      const paymentIntentId = result.paymentIntent.id;

      // ✅ 3️⃣ Call backend confirm + enroll API
      const response = await enrollCourse(courseId, paymentIntentId);

      alert("Payment successful & Course enrolled 🎉");
    } catch (err) {
      console.error("❌ Payment / Enrollment failed", err);
      setError(err.message || "Payment failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <CardField />

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <button
      aria-label="Complete Payment and Enroll in Course"
        onClick={handlePay}
        disabled={loading}
        className="w-full bg-blue-600 text-white py-2 rounded-md"
      >
        {loading ? "Processing..." : "Pay & Enroll"}
      </button>
    </div>
  );
}
