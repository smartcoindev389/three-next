import React, { FC } from "react";
import Image from "next/image";

import { ShipmentLog } from "@/types/types";
import statuses from "@/shared/components/(user)/TrackShipment/TimelineStatuses";
import { getFormattedDate } from "@/utils/utils";

interface TimelineProps extends ShipmentLog {
  className?: string;
}

const Timeline: FC<TimelineProps> = ({
  className = "",
  checkpoints,
  origin,
  destination,
}) => {
  return (
    <div className={className}>
      <p className="font-semibold">Route</p>
      <div className="flex text-slategray-400 text-sm pt-2">
        <span>{origin?.city}</span>
        {destination?.city && (
          <>
            <Image
              alt="to"
              className="mx-2"
              height={9}
              src="/assets/arrow-right-long.svg"
              width={14}
            />
            <span>{destination.city}</span>
          </>
        )}
      </div>

      <ul className="relative pt-4">
        {[...(checkpoints || [])]
          .reverse()
          .map(
            (
              { time, status, location, city, state, message, slug, subtag },
              index,
            ) => (
              <li
                key={index}
                className="flex ml-3 pb-4 border-l last:border-l-0 border-slategray-600"
              >
                <div
                  className="shrink-0 -ml-3 w-6 h-6 rounded-full flex justify-center items-center bg-[#6FACD7]"
                  style={{ background: statuses[status]?.color }}
                >
                  <Image
                    alt="icon"
                    className="w-3.5"
                    height={30}
                    src={
                      statuses[status]?.iconSrc ||
                      "/assets/shipment-timeline/delivered.svg"
                    }
                    width={30}
                  />
                </div>
                <div className="grow pl-3">
                  <span className="font-semibold">{status}</span>
                  <div className=" text-slategray-400 bg-whitesmoke-100 text-sm p-4 mt-1 rounded-lg">
                    <p className="text-paragraph font-medium pb-1">{message}</p>
                    <p className="text-slategray-200 font-medium pb-1">
                      {location}, {city}, {state}
                    </p>
                    <p className="text-slategray-200">
                      {getFormattedDate(time, "MMM d, yyyy 'at' h:mm a")}
                    </p>
                  </div>
                </div>
              </li>
            ),
          )}
      </ul>
    </div>
  );
};

export default Timeline;
