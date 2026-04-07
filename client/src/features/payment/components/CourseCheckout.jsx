import { useEffect, useRef, useState } from "react";
import { Elements } from "@stripe/react-stripe-js";
import { stripePromise } from "@/config/stripe";
import CheckoutForm from "./CheckoutForm";
import { createPaymentIntent } from "../services/paymentService";

export default function CourseCheckout({ course }) {
  const [clientSecret, setClientSecret] = useState(null);
  const hasCreatedRef = useRef(false);

  useEffect(() => {
    if (!course?._id) return;
    if (hasCreatedRef.current) return;

    hasCreatedRef.current = true;

    const fetchClientSecret = async () => {
      try {
        const res = await createPaymentIntent(course._id, course.price);
        setClientSecret(res.data.data.clientSecret);
      } catch (err) {
        console.error("PaymentIntent fetch failed", err);
        hasCreatedRef.current = false;
      }
    };

    fetchClientSecret();
  }, [course?._id]);

  if (!course) return <div>Loading course...</div>;
  if (!clientSecret) return <div>Preparing payment...</div>;

  return (
    <Elements stripe={stripePromise} options={{ clientSecret }}>
      <CheckoutForm courseId={course._id} clientSecret={clientSecret} />
    </Elements>
  );
}
