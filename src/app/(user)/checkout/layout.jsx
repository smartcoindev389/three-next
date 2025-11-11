"use client";

import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

import ErrorProvider from "@/providers/ErrorProvider/ErrorProvider";
import Header from "@/shared/components/(common)/Header/Header";
import Footer from "@/shared/components/(common)/Footer/Footer";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY);

export default function Layout({ children }) {
  return (
    <>
      <Header />
      <ErrorProvider>
        <Elements stripe={stripePromise}>{children}</Elements>
      </ErrorProvider>
      <Footer />
    </>
  );
}
