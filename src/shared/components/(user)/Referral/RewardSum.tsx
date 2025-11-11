"use client";

import { FC, useEffect, useState } from "react";
import { useQuery } from "@apollo/client";

import Loader from "@/shared/components/(common)/Loader/Loader";
import { REFERRAL_REWARD_SUM } from "@/lib/apollo/queryes/referral";
import Price from "@/shared/components/(common)/Currency/Price";

interface ComponentProps {
  type: string;
}
interface RewardResponse {
  referralFactoryRewardSum: {
    value: string;
  };
}

const RewardSum: FC<ComponentProps> = ({ type }) => {
  const { data, loading } = useQuery<RewardResponse>(REFERRAL_REWARD_SUM, {
    variables: { type: type },
  });
  const [rewardAmount, setRewardAmount] = useState<number>(0);

  useEffect(() => {
    if (!loading && data) {
      const value = data?.referralFactoryRewardSum?.value;

      setRewardAmount(Number(value));
    }
  }, [data, setRewardAmount]);

  return (
    <>
      {loading ? (
        <Loader className="h-6" />
      ) : (
        <div>
          <Price
            amount={rewardAmount}
            orderCurrency="USD"
            storeCurrency="USD"
          />
        </div>
      )}
    </>
  );
};

export default RewardSum;
