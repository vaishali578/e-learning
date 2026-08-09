import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import CardField from "./CardField";
import { enrollCourse } from "../services/enrollmentService";
import { Lock, Sparkles, CheckCircle2, AlertCircle } from "lucide-react";

export default function CheckoutForm({ clientSecret, courseId }) {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handlePay = async (e) => {
    e.preventDefault();

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
      await enrollCourse(courseId, paymentIntentId);

      setSuccess(true);
      setTimeout(() => {
        navigate("/student/my-courses");
      }, 2500);
    } catch (err) {
      console.error("❌ Payment / Enrollment failed", err);
      setError(err.message || "Payment failed. Please verify your details.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-center animate-fade-in">
        <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/30 rounded-full flex items-center justify-center mb-6">
          <CheckCircle2 className="w-10 h-10 text-emerald-400 animate-bounce" />
        </div>
        <h3 className="text-2xl font-bold text-white mb-2">Enrollment Successful!</h3>
        <p className="text-slate-400 text-sm max-w-xs">
          Thank you! You are now enrolled. Redirecting you to your courses dashboard...
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handlePay} className="space-y-6">
      <div className="space-y-2">
        <label className="text-sm font-semibold text-slate-300 block">Card Details</label>
        <CardField />
      </div>

      {error && (
        <div className="flex items-start gap-3 bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-2xl text-sm">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      <button
        type="submit"
        aria-label="Complete Payment and Enroll in Course"
        disabled={loading || !stripe}
        className="w-full relative group overflow-hidden bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 active:scale-[0.98] text-white py-3.5 px-4 rounded-2xl font-bold shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-300 disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2 cursor-pointer"
      >
        {loading ? (
          <>
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            <span>Processing Securely...</span>
          </>
        ) : (
          <>
            <Lock className="w-4 h-4 text-blue-200 group-hover:scale-110 transition-transform" />
            <span>Pay & Enroll</span>
            <Sparkles className="w-4 h-4 text-yellow-300 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
          </>
        )}
      </button>

      <p className="text-center text-xs text-slate-500 flex items-center justify-center gap-1.5 mt-4">
        Payments are secure and encrypted. Powered by Stripe.
      </p>
    </form>
  );
}

