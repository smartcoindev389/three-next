import { useTranslation } from "react-i18next";
import dynamic from "next/dynamic";
import { FC } from "react";

import Title from "@/shared/components/(common)/Title/Title";
import Card from "@/shared/components/(user)/Referral/Card/Card";
import Loader from "@/shared/components/(common)/Loader/Loader";

// const DeviceChart = dynamic(
//   () => import("@/shared/components/(user)/DeviceChart"),
//   { ssr: false },
// );

const DeviceChart = (props: any) => <div>Chart Loading...</div>;

interface PurchaseRatioProps {
  clicks: number;
  complete: number;
  loading: boolean;
}

const PurchaseRatio: FC<PurchaseRatioProps> = ({
  clicks,
  complete,
  loading,
}) => {
  const { t } = useTranslation();

  if (loading)
    return <Loader className="rounded-sm bg-white shadow-sm h-full" />;

  return (
    <Card className="h-full">
      <Title>{t("Purchase Ratio")}</Title>
      <DeviceChart
        className="-ml-4"
        legendOffsetX={0}
        legendOffsetY={0}
        series={[
          { title: "Total clicks", percent: clicks, isTotal: true },
          { title: "Total purchases", percent: complete, isTotal: true },
        ]}
      />
    </Card>
  );
};

export default PurchaseRatio;
