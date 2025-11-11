"use client";

import { ChangeEvent, FC, useEffect } from "react";
import { useTranslation } from "react-i18next";
import Image from "next/image";

import PaymentCard from "@/shared/components/(user)/Checkout/Steps/Payment/PaymentCard";
import Title from "@/shared/components/(common)/Title/Title";

interface PaymentProps {
  selectedMethod: string;
  setSelectedMethod: (method: string) => void;
  defaultCard: string;
  savedMethods: [];
  isEditable: boolean;
  paymentId: string;
  setPaymentId: (method: string) => void;
  toggleEditable: () => void;
  setOrderProcessing: (value: boolean) => void;
  orderProcessing: boolean;
}

const Payment: FC<PaymentProps> = ({
  selectedMethod,
  setSelectedMethod,
  defaultCard,
  savedMethods = [],
  isEditable,
  paymentId,
  setPaymentId,
  toggleEditable,
  setOrderProcessing,
  orderProcessing,
}) => {
  const { t } = useTranslation();

  useEffect(() => {
    if (defaultCard && defaultCard !== "0") {
      setSelectedMethod(defaultCard);
    }
  }, [defaultCard]);

  const handleSelectedPaymentMethod = (e: ChangeEvent<HTMLInputElement>) => {
    let clickedId = e.target.id;

    setSelectedMethod(clickedId);
    if (clickedId === "add-new-card") {
      setPaymentId("");
    } else {
      setPaymentId(clickedId);
    }
  };

  return (
    <div className="w-full h-fit rounded-[8px] border border-[#CACBCF] shadow py-4 px-5 mt-3.5">
      <div className="flex items-center justify-between">
        <Title>{t("Select a Payment Method")}</Title>
        <button
          className={`text-blue font-din-condensed text-3xl font-bold${!isEditable ? " cursor-pointer flex items-center justify-between" : ""}`}
          type="button"
          onClick={toggleEditable}
        >
          {!isEditable && <Image alt="show more" height={15} src="/assets/arrow-bottom.svg" width={27} />}
        </button>
      </div>
      <PaymentCard
        handleSelectedPaymentMethod={handleSelectedPaymentMethod}
        isEditable={isEditable}
        orderProcessing={orderProcessing}
        paymentId={paymentId}
        savedMethods={savedMethods}
        selectedMethod={selectedMethod}
        setOrderProcessing={setOrderProcessing}
      />
    </div>
  );
};

export default Payment;
