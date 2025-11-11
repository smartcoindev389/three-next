import React from "react";
import { Trans, useTranslation } from "react-i18next";

import RewardSum from "@/shared/components/(user)/Referral/RewardSum";
import RewardStatistic from "@/shared/components/(user)/Referral/RewardStatistic";
import Title from "@/shared/components/(common)/Title/Title";

/**
 * `DiscountEarned` component renders a section showing the earned discount
 * with an SVG illustration, a title, the reward sum, and a message prompting
 * the user to refer more to earn more discounts.
 * @example
 * // Usage of DiscountEarned component
 * <DiscountEarned />
 *
 * @returns {React.JSX.Element} A JSX element representing the discount section with
 * an SVG illustration, reward sum, and a message.
 */
const DiscountEarned = (): React.JSX.Element => {
  const { t } = useTranslation();

  return (
    <>
      <svg
        fill="none"
        height="60"
        viewBox="0 0 58 60"
        width="58"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M50 14.9619C50 14.9619 14.4442 14.9619 8 14.9619C3.6936 14.9619 1 19.1619 1 21.9619V51.8995C1 55.4695 3.8924 58.3619 7.4624 58.3619H50.5376C54.1062 58.3619 57 55.4695 57 51.8995V21.7463C57 18.1805 53.5686 14.9619 50 14.9619Z"
          stroke="#00C0F3"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeMiterlimit="10"
          strokeWidth="2"
        />
        <path
          d="M45.8 10.7617V6.08291C45.8 1.41951 44.7934 0.0741124 39.0072 1.60011C34.7568 2.72151 9.8858 9.61651 9.8858 9.61651C2.2264 12.5033 1.0574 14.9603 1.0574 20.5589L1 23.9959"
          stroke="#00C0F3"
          strokeLinejoin="round"
          strokeMiterlimit="10"
          strokeWidth="2"
        />
        <path
          d="M47.9032 40.1616C45.9698 40.1616 44.4004 38.5964 44.4004 36.663C44.4004 34.7296 45.9698 33.1616 47.9032 33.1616C49.831 33.1616 51.4004 34.7296 51.4004 36.663C51.4004 38.5964 49.831 40.1616 47.9032 40.1616Z"
          fill="#00C0F3"
        />
      </svg>
      <Title className="mt-6 text-paragraph text-white">
        <Trans t={t}>Discount Available</Trans>
      </Title>
      <div className="mt-4 mb-4 text-[36px] font-semibold text-[#3F65FD] max-md:max-w-full font-sf-pro-display">
        <RewardSum type="1" />
      </div>
      <div className="mt-1 text-slategray-400 max-md:max-w-full text-base md:text-lg font-normal text-white">
        <Trans t={t}>Refer more to Earn more </Trans>
        <br /> Available discount{" "}
        <b>
          <Trans t={t}>on your next purchase</Trans>
        </b>
      </div>
      <RewardStatistic type="1" />
    </>
  );
};

export default DiscountEarned;
