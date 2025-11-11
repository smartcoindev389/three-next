import React, { FC } from "react";
import {
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
} from "@stripe/react-stripe-js";
import { Trans, useTranslation } from "react-i18next";
import Image from "next/image";

import cvcicon from "@/assets/icons/cvcicon.png";

const inputStyle = {
  base: {
    fontSize: "16px",
    color: "#424770",
    "::placeholder": { color: "#aab7c4" },
  },
  invalid: { color: "#9e2146" },
};

const CardDetails: FC = (): React.JSX.Element => {
  const { t } = useTranslation();

  return (
    <div className="mb-[12px] text-[15px] font-[400] text-[#545454]">
      <p className="pb-[4px]">
        <Trans t={t}>Card Number</Trans>
      </p>
      <div className="relative border border-[#E6E6E6] rounded-[5px] py-2 pl-1">
        <CardNumberElement
          className="shadow-boxShadowWM"
          options={{ style: inputStyle, showIcon: true }}
        />
      </div>
      <div className="flex">
        <div className="w-1/2 mt-2">
          <p className="mb-0 pb-1 pt-2">
            <Trans t={t}>Expiration</Trans>
          </p>
          <div className="w-full border border-[#E6E6E6] rounded-[5px] py-2 pl-1">
            <CardExpiryElement
              className="w-full shadow-boxShadowWM"
              options={{ style: inputStyle }}
            />
          </div>
        </div>
        <div className="w-1/2 mt-2 ml-2">
          <p className="mb-0 pb-1 pt-2">
            <Trans t={t}>CVC</Trans>
          </p>
          <div className="w-full relative border border-[#E6E6E6] rounded-[5px] py-2 pl-1">
            <CardCvcElement
              className="w-full shadow-boxShadowWM"
              options={{ style: inputStyle }}
            />
            <Image
              alt="cvcicon"
              className="absolute right-[18px] top-[8px]"
              src={cvcicon}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardDetails;
