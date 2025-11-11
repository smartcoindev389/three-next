import { useEffect, useState } from "react";
import {
  CardNumberElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { useRouter } from "next/navigation";
import { useMutation, useQuery } from "@apollo/client";
import { useTranslation } from "react-i18next";

import Header from "./Header";
import CardDetails from "./CardDetails";
import CountryZipFields from "./CountryZipFields";
import Submit from "./Submit";

import { useToast } from "@/shared/components/(common)/ui/use-toast";
import { SET_DEFAULT_PAYMENT_METHOD } from "@/lib/apollo/queryes/customer";
import { AVAILABLE_STORES_REQUEST } from "@/lib/apollo/queryes/availableStores";
import {
  ADD_PAYMENT_METHOD,
  DELETE_PAYMENT_METHOD,
  LIST_PAYMENT_METHODS,
} from "@/lib/apollo/queryes/payment/stripe";

/**
 * Renders a form for adding a new payment card using Stripe elements.
 * @example
 * PaymentCardForm()
 * // Returns a React component rendering a form for managing payment methods.
 * @returns {JSX.Element} JSX structure of the payment card form.
 * @description
 *   - Requires Stripe.js elements and handles integration with Stripe for creating payment methods.
 *   - Allows users to set a payment method as the default method, and checks for already saved cards.
 *   - Utilizes a mutation to add, delete, and list payment methods.
 *   - Uses a `useEffect` hook to format and set available store lists upon fetching data.
 */
export default function PaymentCardForm() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const [storeList, setStoreList] = useState({});

  const [deleteStripePaymentMethod, { loading: deleteLoading }] = useMutation(
    DELETE_PAYMENT_METHOD,
  );
  const [addStripePaymentMethod, { loading }] = useMutation(ADD_PAYMENT_METHOD);
  const [listStripePaymentMethods, { data }] =
    useMutation(LIST_PAYMENT_METHODS);
  const { data: availableStores } = useQuery(AVAILABLE_STORES_REQUEST);
  const [setDefaultPaymentMethod] = useMutation(SET_DEFAULT_PAYMENT_METHOD);

  useEffect(() => {
    listStripePaymentMethods();
  }, [listStripePaymentMethods]);

  useEffect(() => {
    if (availableStores) {
      const storeListFormatted = [];

      (availableStores?.availableStores ?? []).forEach(function (store) {
        if (store.store_code === "default") {
          return;
        }
        storeListFormatted.push({
          code: store.store_code.split("_")[1],
          name: store.store_name,
        });
      });

      if (
        storeListFormatted.length > 0 &&
        JSON.stringify(storeListFormatted) !== JSON.stringify(storeList)
      ) {
        setStoreList(storeListFormatted);
      }
    }
  }, [availableStores]);

  const isCardSaved = (fingerPrint) => {
    const isSavedCard = data?.listStripePaymentMethods.find(
      (paymentMethod) => paymentMethod.fingerprint === fingerPrint,
    );

    return isSavedCard !== undefined;
  };

  const handleDefault = async (id) => {
    await setDefaultPaymentMethod({
      variables: { default_payment: id },
    });
  };

  /**
   * Handles the payment method synchronization process by creating and adding a payment method using Stripe.
   * @example
   * sync(event)
   * undefined
   * @param {object} event - Event object that triggers the form submission.
   * @returns {undefined} No return value is expected from this function.
   * @description
   *   - Prevents the default form submission behavior.
   *   - Uses the Stripe API to create a payment method and handle errors during this process.
   *   - Checks if the card is already saved, if so, deletes the duplicate payment method and shows an error message.
   *   - Adds a new payment method, sets it as default, shows a success message, and redirects the user.
   */
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    const cardNumberElement = elements.getElement(CardNumberElement);

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card: cardNumberElement,
      billing_details: {
        address: {
          country: event.target.country.value,
          postal_code: event.target.zip.value,
        },
      },
    });

    if (error) {
      console.error("[error]", error);
    } else {
      try {
        const { data } = await addStripePaymentMethod({
          variables: { paymentMethodId: paymentMethod.id },
        });

        if (data) {
          const cardFingerPrint = data.addStripePaymentMethod.fingerprint;

          if (isCardSaved(cardFingerPrint)) {
            const { data } = await deleteStripePaymentMethod({
              variables: { paymentMethodId: paymentMethod.id },
            });

            toast({
              type: "error",
              description: t("This Card is already saved, add new card."),
            });
          } else {
            handleDefault(data.addStripePaymentMethod.id);
            toast({
              type: "success",
              description: t("Payment Method Added Successfully!"),
            });
            setTimeout(() => {
              router.push("/customer/dashboard/payments/methods");
            }, 2000);
          }
        }
      } catch (mutationError) {
        toast({
          type: "error",
          description: t(
            "Card details are invalid, try again with correct information.",
          ),
        });
      }
    }
  };

  return (
    <div className="w-full h-full bg-transparent pt-8 px-6">
      <Header className="md:hidden" />
      <form
        className="max-w-2xl mx-auto bg-white px-4 md:px-16 pt-4 pb-6 md:py-8 rounded-md shadow-sm"
        onSubmit={handleSubmit}
      >
        <Header className="max-md:hidden" />
        <CardDetails />
        <CountryZipFields storeList={storeList} />
        <Submit loading={loading || deleteLoading} />
      </form>
    </div>
  );
}
