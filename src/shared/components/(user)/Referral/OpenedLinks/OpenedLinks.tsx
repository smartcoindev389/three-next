import { useQuery } from "@apollo/client";
import { useTranslation } from "react-i18next";
import dynamic from "next/dynamic";
import { FC } from "react";

import Title from "@/shared/components/(common)/Title/Title";
import { GET_REFERRAL_DEVICE_STATISTICS } from "@/lib/apollo/queryes/referral";
import Loader from "@/shared/components/(common)/Loader/Loader";
import Card from "@/shared/components/(user)/Referral/Card/Card";

// const DeviceChart = dynamic(
//   () => import("@/shared/components/(user)/DeviceChart"),
//   { ssr: false },
// );

const DeviceChart = (props: any) => <div>Chart Loading...</div>;

const OpenedLinks: FC = () => {
  const { t } = useTranslation();
  const { data, loading } = useQuery(GET_REFERRAL_DEVICE_STATISTICS);

  if (loading)
    return <Loader className="rounded-sm bg-white shadow-sm h-full" />;

  return (
    <Card className="h-full">
      <Title>{t("Links Opened In")}</Title>
      <DeviceChart
        className="-ml-4"
        legendOffsetX={0}
        legendOffsetY={0}
        series={data?.referralFactoryStatisticsDevices?.items}
      />
    </Card>
  );
};

export default OpenedLinks;
