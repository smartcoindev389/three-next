import { useTranslation } from "react-i18next";
import { FC, PropsWithChildren } from "react";

import {
  CouponSvgIcon,
  SecureSvgIcon,
} from "@/shared/components/(common)/Icons/svgIcons";

const IconColumn: FC<PropsWithChildren> = ({ children }) => (
  <span className="justify-self-center">
    <SecureSvgIcon />
  </span>
);

const Benefits: FC = () => {
  const { t } = useTranslation();

  return (
    <div className="w-full grid grid-cols-[auto_minmax(0,1fr)] gap-x-2.5 gap-y-3.5 pt-6">
      <div>
        <CouponSvgIcon />
      </div>
      <div>
        <p className="text-darkslategray-300 text-xl font-medium">
          {t("Shop with Confidence")}
        </p>
        <p className="text-paragraph md:text-lg mb-1">
          {t("Your orders are safe and secure with FUR4!")}
        </p>
      </div>
      <IconColumn />
      <div className="text-paragraph text-md">{t("No-Hassle Returns")}</div>
      <IconColumn />
      <div className="text-paragraph text-md">{t("Secured Transactions")}</div>
      <IconColumn />
      <div className="text-paragraph text-md">{t("24/7 Customer Service")}</div>
    </div>
  );
};

export default Benefits;
