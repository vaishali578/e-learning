import { CardElement } from "@stripe/react-stripe-js";

export default function CardField() {
  return (
    <div className="border rounded-md p-3">
      <CardElement />
    </div>
  );
}
