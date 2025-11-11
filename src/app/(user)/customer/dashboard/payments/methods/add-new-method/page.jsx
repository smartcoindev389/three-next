"use client";

import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

import PaymentCardForm from "@/shared/components/(user)/PaymentCardForm/PaymentCardForm";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY);

/**
 * Renders the Stripe payment form wrapped with Stripe Elements provider.
 *
 * This component initializes Stripe with the public key and wraps the custom
 * `PaymentCardForm` inside Stripe's `<Elements>` provider, enabling Stripe Elements functionality.
 *
 * @returns {JSX.Element} The rendered payment form with Stripe integration.
 */
const PaymentForm = () => {
  return (
    <Elements stripe={stripePromise}>
      <PaymentCardForm />
    </Elements>
  );
};

export default PaymentForm;
