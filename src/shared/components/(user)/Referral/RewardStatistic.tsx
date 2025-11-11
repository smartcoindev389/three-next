"use client";

import React, { FC, useEffect, useState } from "react";
import { useQuery } from "@apollo/client";

import { REFERRAL_STATISTIC } from "@/lib/apollo/queryes/referral";
import Price from "@/shared/components/(common)/Currency/Price";

interface ComponentProps {
  type: string;
}

interface RewardResponse {
  referralFactoryStatistics: {
    clicks: string;
    complete: string;
    paid: string;
    earned: string;
  };
}

/**
 * RewardStatistic component displays referral statistics including:
 * - total referral clicks,
 * - completed referral purchases,
 * - and total referral fees earned.
 *
 * It fetches data using the `REFERRAL_STATISTIC` GraphQL query and updates the display
 * accordingly. If data is still loading or not available, placeholders (`"-"` or `-1`)
 * are shown.
 *
 * @component
 *
 * @param {Object} props - Component props
 * @param {"0" | "1"} props.type - The type of customer to query statistics for.
 *
 * @example
 * <RewardStatistic type="1" />
 *
 * @returns {JSX.Element} A UI block showing three rows of referral statistics.
 */
const RewardStatistic: FC<ComponentProps> = ({ type }): React.JSX.Element => {
  const { data, loading } = useQuery<RewardResponse>(REFERRAL_STATISTIC, {
    variables: { type: type },
  });
  const [clicks, setClicks] = useState<string>("-");
  const [complete, setComplete] = useState<string>("-");
  const [earned, setEarned] = useState<number>(-1);

  useEffect(() => {
    if (!loading && data) {
      setClicks(data?.referralFactoryStatistics?.clicks);
      setComplete(data?.referralFactoryStatistics?.complete);
      setEarned(Number(data?.referralFactoryStatistics?.earned));
    }
  }, [data, setClicks]);

  return (
    <>
      <div className="mt-10 mr-4 text-white max-md:max-w-full text-sm md:text-base font-semibold font-sf-pro-display">
        <div className="flex justify-between border-b-[1px] border-[#EBEBEB] py-[16px]">
          <div className="text-white">Total Referral Clicks</div>
          <div className="text-base md:text-xl font-normal">{clicks}</div>
        </div>
        <div className="flex justify-between border-b-[1px] border-[#EBEBEB] py-[16px]">
          <div className="text-white">Total Referral Purchases</div>
          <div className="text-base md:text-xl font-normal">{complete}</div>
        </div>
        <div className="flex justify-between py-[16px]">
          <div className="text-white">Total Referral Fees Earned</div>
          <div className="text-base md:text-xl font-normal">
            {earned !== -1 ? (
              <Price amount={earned} orderCurrency="USD" storeCurrency="USD" />
            ) : (
              <div>-</div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default RewardStatistic;
