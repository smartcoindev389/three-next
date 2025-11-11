import { FC } from "react";
import { useTranslation } from "react-i18next";

interface ReferralStatusProps {
  isComplete: boolean;
}

const ReferralStatus: FC<ReferralStatusProps> = ({ isComplete }) => {
  const { t } = useTranslation();

  return (
    <span
      className={`m-auto px-2 py-0.5 md:py-1 text-base font-medium rounded md:rounded-lg`}
    >
      {t(isComplete ? "YES" : "NO")}
    </span>
  );
};

export default ReferralStatus;
