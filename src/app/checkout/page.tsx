import { Suspense } from "react";
import CheckoutForm from "./checkout-form";

export const metadata = {
  title: "Checkout – FoxGlobe",
};

export default function CheckoutPage() {
  return (
    <Suspense>
      <CheckoutForm />
    </Suspense>
  );
}
