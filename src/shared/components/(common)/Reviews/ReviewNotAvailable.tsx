import { useTranslation } from "react-i18next";
import { FC } from "react";

const ReviewNotAvailable: FC = () => {
  const { t } = useTranslation();

  return (
    <section className="flex items-center justify-center w-full mt-24">
      <div>
        <div className="rounded py-12 max-w-[600px]">
          <h3 className="text-3xl font-bold text-center text-gray-700 py-6 font-sf-pro-display">
            {t("Review is not available")}
          </h3>
          <p className="max-w-[646px] w-full mb-[60px] font-medium text-[20px] leading-[100%] tracking-[0%] text-center text-[#74788D] font-sf-pro">
            {t("Your link is already used or expired.")}
          </p>
        </div>
      </div>
    </section>
  );
};

export default ReviewNotAvailable;
