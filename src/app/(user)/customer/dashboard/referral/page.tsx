"use client";

import { Trans, useTranslation } from "react-i18next";
import { useQuery } from "@apollo/client";
import { FC, useMemo } from "react";

import Title from "@/shared/components/(common)/Title/Title";
// import HowItWorks from "@/shared/components/(user)/HowItWorks/HowItWorks";
// import ReferralLinks from "@/shared/components/(user)/Referral/ReferralLinks/ReferralLinks";
import {
  GET_REFERRAL,
  REFERRAL_REWARD_SUM,
} from "@/lib/apollo/queryes/referral";
// import StatsCard from "@/shared/components/(user)/Referral/StatsCard/StatsCard";
// import SharedLinks from "@/shared/components/(user)/Referral/SharedLinks/SharedLinks";
// import OpenedLinks from "@/shared/components/(user)/Referral/OpenedLinks/OpenedLinks";
// import PurchaseRatio from "@/shared/components/(user)/Referral/PurchaseRatio/PurchaseRatio";
// import ReferralsList from "@/shared/components/(user)/Referral/ReferralsList/ReferralsList";

const TYPE_CUSTOMER = 1;
const defaultReferral = {
  clicks: 0,
  conversion_rate: 0,
  paid: 0,
  complete: 0,
};

const ReferralPage: FC = () => {
  const { t } = useTranslation();
  const { data: rewardData, loading: rewardLoading } = useQuery(
    REFERRAL_REWARD_SUM,
    {
      variables: { type: TYPE_CUSTOMER },
    },
  );
  const { data: referralData, loading: referralLoading } = useQuery(
    GET_REFERRAL,
    {
      variables: { type: TYPE_CUSTOMER },
    },
  );

  const { clicks, conversion_rate, complete } =
    referralData?.referralFactoryStatistics || defaultReferral;
  const conversationRatio = useMemo(
    () => (conversion_rate ? (conversion_rate * 100).toFixed(1) : 0),
    [conversion_rate],
  );

  return (
    <div className="w-full min-h-full bg-whitesmoke-100 overflow-hidden tracking-[normal] text-left text-11xl text-black font-sf-pro-display">
      <div className="flex">
        <main className="w-full">
          <Title className="text-paragraph mt-0 mb-4 md:mb-10 text-[1.75rem]">
            <Trans t={t}>Referrals</Trans>
          </Title>

          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-12 xl:col-span-9">
              <div className="bg-white p-6 rounded-lg">
                <h2>Referral Links - Temporarily Disabled</h2>
              </div>
            </div>
            <div className="col-span-12 xl:col-span-3 row-span-2">
              <div className="bg-white p-6 rounded-lg">
                <h2>How It Works - Temporarily Disabled</h2>
              </div>
            </div>
            <div className="col-span-12 md:col-span-4 xl:col-span-3">
              <div className="bg-white p-6 rounded-lg">
                <h2>Stats Card - Temporarily Disabled</h2>
                <p>Total Clicks: {clicks}</p>
              </div>
            </div>
            <div className="col-span-12 md:col-span-4 xl:col-span-3">
              <div className="bg-white p-6 rounded-lg">
                <h2>Stats Card - Temporarily Disabled</h2>
                <p>Conversion Rate: {conversationRatio}%</p>
              </div>
            </div>
            <div className="col-span-12 md:col-span-4 xl:col-span-3">
              <div className="bg-white p-6 rounded-lg">
                <h2>Stats Card - Temporarily Disabled</h2>
                <p>Discount Owned: ${rewardData?.referralFactoryRewardSum.value}</p>
              </div>
            </div>
            <div className="col-span-12 md:col-span-4">
              <div className="bg-white p-6 rounded-lg">
                <h2>Shared Links - Temporarily Disabled</h2>
              </div>
            </div>
            <div className="col-span-12 md:col-span-4">
              <div className="bg-white p-6 rounded-lg">
                <h2>Opened Links - Temporarily Disabled</h2>
              </div>
            </div>
            <div className="col-span-12 md:col-span-4">
              <div className="bg-white p-6 rounded-lg">
                <h2>Purchase Ratio - Temporarily Disabled</h2>
              </div>
            </div>
            <div className="col-span-12">
              <div className="bg-white p-6 rounded-lg">
                <h2>Referrals List - Temporarily Disabled</h2>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ReferralPage;
