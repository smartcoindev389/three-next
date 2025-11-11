import { useQuery } from "@apollo/client";
import { useTranslation } from "react-i18next";
import dynamic from "next/dynamic";
import { FC } from "react";

import Title from "@/shared/components/(common)/Title/Title";
import { GET_REFERRAL_LINKS_STATISTICS } from "@/lib/apollo/queryes/referral";
import Loader from "@/shared/components/(common)/Loader/Loader";
import Card from "@/shared/components/(user)/Referral/Card/Card";

const SharedChart = dynamic(
  () => import("@/shared/components/(user)/SharedChart"),
  { ssr: false },
);

const SharedLinks: FC = () => {
  const { t } = useTranslation();
  const { data, loading } = useQuery(GET_REFERRAL_LINKS_STATISTICS);

  if (loading)
    return <Loader className="rounded-sm bg-white shadow-sm h-full" />;

  return (
    <Card className="h-full">
      <Title>{t("Links Shared On")}</Title>
      <SharedChart series={data?.referralFactoryStatisticsLinks?.items} />
    </Card>
  );
};

export default SharedLinks;
