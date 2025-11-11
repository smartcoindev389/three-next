"use client";

import { ChangeEvent, FC, Fragment } from "react";
import Image from "next/image";

import CheckoutForm from "@/shared/components/(user)/Forms/CheckoutForm/CheckoutForm";
import ZeroSubtotalPaymentMethod from "@/shared/components/(user)/Forms/ZeroSubtotalPaymentMethod/ZeroSubtotalPaymentMethod";
import { useCart } from "@/providers/CartProvider/useCart";

interface Methods {
  id: string;
  brand: string;
  icon: string;
  label: string;
}

interface PaymentCardProps {
  handleSelectedPaymentMethod: (e: ChangeEvent<HTMLInputElement>) => void;
  selectedMethod: string;
  isEditable: boolean;
  paymentId: string;
  savedMethods: Methods[];
  setOrderProcessing: (orderProcessing: boolean) => void;
  orderProcessing: boolean;
}

const PaymentCard: FC<PaymentCardProps> = ({
  handleSelectedPaymentMethod,
  selectedMethod,
  isEditable,
  paymentId,
  savedMethods,
  setOrderProcessing,
  orderProcessing,
}) => {
  const { cart } = useCart();

  return (
    <>
      {isEditable ? (
        (cart?.prices?.grand_total?.value ?? 0) > 0 ? (
          <div className="border mt-3 p-3 rounded-[8px] w-full">
            {savedMethods && (
              <>
                {savedMethods.map((method) => (
                  <Fragment key={method.id}>
                    <label className="border cursor-pointer gap-5 inline-flex items-center mb-3 p-3 rounded-[8px] w-full">
                      <input
                        checked={selectedMethod === method.id}
                        className="sr-only peer"
                        id={method.id}
                        name="select-payment-method"
                        type="radio"
                        onChange={handleSelectedPaymentMethod}
                      />
                      <div className="after:absolute after:bg-white after:border after:border-gray-300 after:content-[''] after:h-5 after:rounded-full after:start-[2px] after:top-[2px] after:transition-all after:w-5 bg-gray-200 h-6 peer peer-checked:after:border-white peer-checked:after:translate-x-full peer-checked:bg-blue peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 relative rounded-full w-11" />
                      <span className="flex text-sm font-medium text-[#545454]">
                        <Image
                          alt={method.brand}
                          className="shrink-0 w-8 mr-2"
                          height={8}
                          src={method.icon}
                          width={8}
                        />
                        <span className="block font-din-condensed mt-2 text-[#545454] text-[24px]">
                          {"**** **** **** " + method.label.slice(5, 9)}
                        </span>
                      </span>
                    </label>
                  </Fragment>
                ))}
              </>
            )}
            <label className="cursor-pointer gap-5 inline-flex items-start">
              <input
                checked={selectedMethod === "add-new-card"}
                className="sr-only peer"
                id="add-new-card"
                name="select-payment-method"
                type="radio"
                onChange={handleSelectedPaymentMethod}
              />
              <div className="flex-[0_0_20px] mt-[4px] border after:absolute after:bg-white after:content-[''] after:h-3 after:rounded-full after:start-[3px] after:top-[3px] after:transition-all after:w-3 h-5 peer peer-checked:border-blue peer-checked:after:bg-blue peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 relative rounded-full w-5" />
              <span className="text-[22px] text-[#545454] font-[500]">Credit / Debit card</span>
            </label>
            <CheckoutForm
              orderProcessing={orderProcessing}
              paymentId={paymentId}
              selectedMethod={selectedMethod}
              setOrderProcessing={setOrderProcessing}
            />
          </div>
        ) : (
          <ZeroSubtotalPaymentMethod orderProcessing={orderProcessing} setOrderProcessing={setOrderProcessing} />
        )
      ) : null}
    </>
  );
};

export default PaymentCard;
