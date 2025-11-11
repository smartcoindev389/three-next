"use client";

import React, { FC, useEffect, useState } from "react";
import { useMutation } from "@apollo/client";
import { useTranslation } from "react-i18next";
import Image from "next/image";

import { useToast } from "@/shared/components/(common)/ui/use-toast";
import { SET_SHIPPING_METHODS } from "@/lib/apollo/queryes/checkout";
import Price from "@/shared/components/(common)/Currency/Price";
import BaseButton from "@/shared/components/(main)/BaseButton/BaseButton";
import Title from "@/shared/components/(common)/Title/Title";
import { useCart } from "@/providers/CartProvider/useCart";

interface ShippingMethod {
  method_title: string;
  method_code: string;
  carrier_code: string;
  price_incl_tax: {
    value: number;
    currency: string;
  };
}
interface ShippingProps {
  availableShippingMethods: ShippingMethod[];
  isEditable: boolean;
  toggleEditable: () => void;
  onSetShippingMethod: () => void;
}

const Shipping: FC<ShippingProps> = ({
  availableShippingMethods = [],
  isEditable,
  toggleEditable,
  onSetShippingMethod,
}) => {
  const { cart } = useCart();
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();
  const { toast } = useToast();
  const [selectedShippingMethod, setSelectedShippingMethod] = useState<ShippingMethod>();
  const [setShippingMethods] = useMutation(SET_SHIPPING_METHODS);

  useEffect(() => {
    if (availableShippingMethods.length && isEditable && !selectedShippingMethod) {
      setSelectedShippingMethod(availableShippingMethods[0]);
    }
  }, [availableShippingMethods, isEditable]);

  const setShippingMethod = async () => {
    setLoading(true);

    try {
      await setShippingMethods({
        variables: {
          cart_id: cart?.id,
          method_code: selectedShippingMethod?.method_code,
          carrier_code: selectedShippingMethod?.carrier_code,
        },
      });

      onSetShippingMethod();
    } catch (error) {
      toast({ type: "error", error });
      console.error(error);
    }

    setLoading(false);
  };

  const getLabel = () => {
    const label =
      cart?.shipping_addresses?.[0]?.selected_shipping_method?.method_title || selectedShippingMethod?.method_title;

    return label ? <div className="text-base text-[#545454] leading-normal mt-2">{label}</div> : null;
  };

  return (
    <>
      <div className="w-full h-fit rounded-[8px] border border-[#CACBCF] shadow py-4 px-5 mt-3.5">
        <div className="flex items-center justify-between">
          <Title>{t("Select a Shipping Method")}</Title>
          <button
            className={`text-blue font-din-condensed text-3xl font-bold${!isEditable ? "cursor-pointer flex items-center justify-between" : ""}`}
            type="button"
            onClick={toggleEditable}
          >
            {!isEditable && <Image alt="show more" height={15} src="/assets/arrow-bottom.svg" width={27} />}
          </button>
        </div>

        {isEditable ? (
          <>
            {availableShippingMethods.length ? (
              <>
                {availableShippingMethods.map((method) => (
                  <React.Fragment key={method.method_code}>
                    <label className="border border-[#CACBCF] cursor-pointer gap-5 inline-flex items-center mt-3 p-4 rounded-[8px] w-full">
                      <input
                        checked={selectedShippingMethod?.method_code === method.method_code}
                        className="sr-only peer"
                        id={method.method_code}
                        name="select-shipping-method"
                        type="radio"
                        onChange={() => setSelectedShippingMethod(method)}
                      />
                      <div className="flex-[0_0_20px] border border-[#CACBCF] after:absolute after:bg-white after:content-[''] after:h-3 after:rounded-full after:start-[3px] after:top-[3px] after:transition-all after:w-3 h-5 peer peer-checked:border-blue peer-checked:after:bg-blue peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 relative rounded-full w-5" />
                      <span className="text-sm font-medium text-[#545454] inline-flex items-center gap-x-[30px] gap-y-[10px]">
                        <Price
                          amount={method.price_incl_tax?.value || 0}
                          className="text-[18px] text-[600] text-[#727272]"
                        />
                        <span className={"block text-[#545454] text-[16px]"}>{method.method_title}</span>
                      </span>
                    </label>
                  </React.Fragment>
                ))}

                <BaseButton className="mt-6 w-full md:max-w-[300px]" onClick={setShippingMethod}>
                  {loading ? t("Processing...") : t("Continue")}
                </BaseButton>
              </>
            ) : (
              <div className="pt-2">{t("No shipping methods available for selected address")}</div>
            )}
          </>
        ) : (
          getLabel()
        )}
      </div>
    </>
  );
};

export default Shipping;
