import { FC } from "react";
import { useTranslation } from "react-i18next";

import ProgressBar from "@/shared/components/(user)/ProgressBar/ProgressBar";
import { getFormattedDate } from "@/utils/utils";
import { ShipmentLog } from "@/types/types";

const TimelineStatus: FC<ShipmentLog> = ({
  transitTime,
  deliveredDate,
  pickedUpDate,
  origin,
  destination,
  status,
}) => {
  const { t } = useTranslation();

  if (!origin) return null;

  return (
    <>
      <div className="flex items-baseline py-4">
        {deliveredDate && (
          <span className="font-semibold md:text-lg">{`${destination.city} ${t("on")} ${getFormattedDate(deliveredDate, "MMM d")}`}</span>
        )}
      </div>
      <div className="bg-whitesmoke-100 text-sm md:text-base font-semibold p-4 rounded-sm">
        {transitTime && (
          <p className="pb-2 ">{`${t("Transit time")}: ${transitTime} ${transitTime > 1 ? t("days") : t("day")}`}</p>
        )}
        <ProgressBar percent={100} />
        <div className="flex justify-between py-2">
          <div>
            <p className="">
              {origin.city}, {origin.state}, {origin.country}
            </p>
            {pickedUpDate && (
              <p className="font-normal">
                {getFormattedDate(pickedUpDate, "MMM d")}
              </p>
            )}
          </div>

          <div className="text-right">
            <p className="">
              {destination.city}, {destination.state}, {destination.country}
            </p>
            {deliveredDate && (
              <p className="font-normal">
                {getFormattedDate(deliveredDate, "MMM d")}
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default TimelineStatus;
