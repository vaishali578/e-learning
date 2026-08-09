import { CardElement } from "@stripe/react-stripe-js";

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      color: "#ffffff",
      fontFamily: '"Outfit", "Inter", system-ui, sans-serif',
      fontSmoothing: "antialiased",
      fontSize: "16px",
      "::placeholder": {
        color: "#94a3b8",
      },
    },
    invalid: {
      color: "#f87171",
      iconColor: "#f87171",
    },
  },
};

export default function CardField() {
  return (
    <div className="border border-slate-800 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20 rounded-2xl p-4 bg-slate-950/60 transition-all">
      <CardElement options={CARD_ELEMENT_OPTIONS} />
    </div>
  );
}

