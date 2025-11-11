import { FC, PropsWithChildren } from "react";

import Icon from "./Icon";

import Card from "@/shared/components/(user)/Referral/Card/Card";
import Loader from "@/shared/components/(common)/Loader/Loader";

interface StatsCardProps {
  name: string;
  loading: boolean;
  title: string;
  description: string;
  className?: string;
}

const StatsCard: FC<PropsWithChildren<StatsCardProps>> = ({
  name,
  title,
  description,
  loading,
  className = "",
}) => {
  if (loading)
    return <Loader className="rounded-sm bg-white shadow-sm h-full" />;

  return (
    <Card
      className={`flex flex-col xl:flex-row xl:justify-between items-center text-center h-full ${className}`}
    >
      <div className="max-lg:order-2 xl:text-left">
        <div className="text-[28px] xl:text-[48px] text-[#00C0F3] font-normal">
          {title}
        </div>
        <div className="text-sm lg:text-lg">{description}</div>
      </div>
      <div className="self-center">
        <Icon name={name} />
      </div>
    </Card>
  );
};

export default StatsCard;
