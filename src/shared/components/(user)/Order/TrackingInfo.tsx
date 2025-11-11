import { FC } from "react";
import Link from "next/link";

import { cn } from "@/utils/cn";

interface TrackingInfoProps {
  data: { number?: number }[];
}

const TrackingInfo: FC<TrackingInfoProps> = ({ data = [] }) => {
  const baseClass =
    "font-medium text-slategray-400 bg-gray-100 rounded-full px-4 py-1 text-sm w-fit mx-auto";

  if (!data.length) {
    return (
      <span className={cn(baseClass, "bg-[#EBEBEB] text-[#74788D]")}>N/A</span>
    );
  }

  return data.map(({ number }) => (
    <Link
      key={number}
      className={baseClass}
      href={`https://fur4aftershipper.aftership.com/${number}`}
      target="_blank"
    >
      {number}
    </Link>
  ));
};

export default TrackingInfo;
