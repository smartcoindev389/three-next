"use client";

import { useState, useEffect, FC } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { useRouter } from "next/navigation";
import { useMutation, useQuery } from "@apollo/client";
import { Trans, useTranslation } from "react-i18next";

import DefaultCard from "@/shared/components/(user)/PaymentCard/DefaultCard";
import CardItem from "@/shared/components/(user)/PaymentCard/CardItem";

import Loader from "@/shared/components/(common)/Loader/Loader";
import { useToast } from "@/shared/components/(common)/ui/use-toast";
import { SET_DEFAULT_PAYMENT_METHOD } from "@/lib/apollo/queryes/customer";
import Title from "@/shared/components/(common)/Title/Title";
import { getCustomerCustomAttribute } from "@/utils/utils-old";
import { GET_SHORT_CUSTOMER_DATA as GET_CUSTOMER_DATA } from "@/lib/apollo/queryes/customer";
import {
  DELETE_PAYMENT_METHOD,
  LIST_PAYMENT_METHODS,
} from "@/lib/apollo/queryes/payment/stripe";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY || "");

interface StripePaymentMethod {
  id: string;
  created: string;
  type: string;
  fingerprint: string;
  label: string;
  icon: string;
  cvc: string;
  brand: string;
  exp_month: number;
  exp_year: number;
}

interface StripePaymentMethodsResponse {
  listStripePaymentMethods: StripePaymentMethod[];
}

const PaymentComponent: FC = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [defaultCardDetails, setDefaultCardDetails] =
    useState<StripePaymentMethod | null>(null);
  const router = useRouter();

  const { data: customerData, refetch: refetchCustomer } = useQuery(
    GET_CUSTOMER_DATA,
    { fetchPolicy: "no-cache" },
  );
  const [listStripePaymentMethods, { loading, data }] =
    useMutation<StripePaymentMethodsResponse>(LIST_PAYMENT_METHODS);
  const [deleteStripePaymentMethod] = useMutation(DELETE_PAYMENT_METHOD);
  const [setDefaultPaymentMethod] = useMutation(SET_DEFAULT_PAYMENT_METHOD);
  const stripeMethods = data?.listStripePaymentMethods || [];

  useEffect(() => {
    void listStripePaymentMethods();
  }, [listStripePaymentMethods]);

  useEffect(() => {
    const defaultPaymentId = getCustomerCustomAttribute(
      customerData?.customer,
      "default_payment",
    );

    if (defaultPaymentId && defaultPaymentId !== "0") {
      const defaultCardObj = stripeMethods.find(
        ({ id }) => id === defaultPaymentId,
      );

      if (defaultCardObj) setDefaultCardDetails(defaultCardObj);
    } else if (defaultPaymentId === "0" && stripeMethods.length === 1) {
      handleDefault(stripeMethods[0].id).then(async () => {
        await refetchCustomer();

        setDefaultCardDetails(stripeMethods[0]);
      });
    }
  }, [customerData?.customer, stripeMethods]);

  const handleDelete = async (id: string) => {
    try {
      await deleteStripePaymentMethod({ variables: { paymentMethodId: id } });
      await setDefaultPaymentMethod({ variables: { default_payment: "" } });
      await listStripePaymentMethods({ fetchPolicy: "no-cache" });

      toast({
        type: "success",
        description: t("Payment Method Deleted Successfully!"),
      });
    } catch (error) {
      toast({ type: "error", description: error.message });
    }
  };

  const handleDefault = async (id: string) => {
    try {
      const { data } = await setDefaultPaymentMethod({
        variables: { default_payment: id },
      });

      if (data) {
        await listStripePaymentMethods({ fetchPolicy: "no-cache" });

        toast({
          type: "success",
          description: t("Default Payment Method Updated Successfully!"),
        });
      }
    } catch (mutationError) {
      toast({
        type: "error",
        description: t("Default Payment Method can't be updated, try again"),
      });
    }
  };

  return (
    <div className="bg-[#F8F8FB] min-h-[calc(100vh-135px)]">
      <div className="bg-[#F8F8FB] md:bg-white px-6 sm:px-7 py-7 rounded-md">
        <Title className="text-paragraph text-[1.75rem]">
          {t("Payment Methods")}
        </Title>
        <button
          aria-label={"Add Payment Method"}
          className="bg-opacity-10 bg-[#00C0F3] mt-4 border-dashed border border-blue rounded-[5px] flex items-center gap-2 md:gap-5 px-6 py-2 md:p-8"
          onClick={() =>
            router.push("/customer/dashboard/payments/methods/add-new-method")
          }
        >
          <svg
            className="max-md:w-[1rem] max-md:h-[1rem]"
            fill="none"
            height="30"
            viewBox="0 0 30 30"
            width="30"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect
              fill="#00C0F3"
              height="30"
              rx="1.25"
              width="2.5"
              x="13.7495"
            />
            <rect
              fill="#00C0F3"
              height="30"
              rx="1.25"
              transform="rotate(90 30 13.75)"
              width="2.5"
              x="30"
              y="13.75"
            />
          </svg>
          <div className="md:text-xl font-medium text-[#74788D]">
            <Trans t={t}>Add New Card</Trans>
          </div>
        </button>
        {!loading && data ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
            <div>
              <div className="max-sm:hidden md:text-lg text-[#495057] font-bold">
                <Trans t={t}>My Cards</Trans>
              </div>
              <div className="flex flex-col gap-5 mt-3">
                {stripeMethods.map(({ brand, icon, id, label }) => (
                  <CardItem
                    key={id}
                    brand={brand}
                    handleDefault={handleDefault}
                    handleDelete={handleDelete}
                    icon={icon}
                    id={id}
                    isDefault={defaultCardDetails?.id === id}
                    label={label}
                    lastNumber="3456"
                    type={brand}
                  />
                ))}
              </div>
            </div>
            <div>
              {defaultCardDetails && (
                <div>
                  <div className="text-lg text-[#495057] font-bold">
                    <Trans t={t}>Default Card</Trans>
                  </div>
                  <DefaultCard
                    date={
                      defaultCardDetails?.exp_month
                        ? defaultCardDetails?.exp_month +
                          "/" +
                          defaultCardDetails?.exp_year
                        : ""
                    }
                    defaultCard={defaultCardDetails}
                    lastNumber={
                      defaultCardDetails?.label ? defaultCardDetails?.label : ""
                    }
                    name={
                      customerData?.customer?.firstname
                        ? customerData?.customer?.firstname +
                          " " +
                          customerData?.customer?.lastname
                        : ""
                    }
                  />
                </div>
              )}
            </div>
          </div>
        ) : (
          <Loader className="h-[calc(100vh-400px)] !bg-transparent" />
        )}
      </div>
    </div>
  );
};

export default function PaymentMethod() {
  return (
    <Elements stripe={stripePromise}>
      <PaymentComponent />
    </Elements>
  );
}
