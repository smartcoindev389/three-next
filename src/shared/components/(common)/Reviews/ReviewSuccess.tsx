import { useTranslation } from "react-i18next";
import Image from "next/image";
import { FC } from "react";

const ReviewSuccess: FC = () => {
  const { t } = useTranslation();

  return (
    <section className="flex items-center justify-center w-full mt-24">
      <div>
        <div className="rounded py-12 max-w-[600px]">
          <div className="w-fit mx-auto mt-[22px]">
            <Image
              alt="success"
              height={150}
              src="/assets/success.svg"
              width={150}
            />
          </div>
          <h3 className="text-3xl font-bold text-center text-gray-700 py-6 font-sf-pro-display">
            {t("Thank you for your review!")}
          </h3>
          <p className="max-w-[646px] w-full mb-[60px] font-medium text-[20px] leading-[100%] tracking-[0%] text-center text-[#74788D] font-sf-pro">
            {t("We appreciate your contribution and your valuable feedback.")}
          </p>
        </div>
      </div>
    </section>
  );
};

export default ReviewSuccess;
