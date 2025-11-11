import { FC, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import Loader from "@/shared/components/(common)/Loader/Loader";
import TrackShipmentWrapper from "@/shared/components/(user)/TrackShipment/TrackShipmentWrapper";
import Timeline from "@/shared/components/(user)/TrackShipment/Timeline";
import OrderSelector from "@/shared/components/(user)/TrackShipment/OrderSelector";
import { Order, ShipmentLog } from "@/types/types";
import TimelineStatus from "@/shared/components/(user)/TrackShipment/TimelineStatus";

interface TrackShipmentProps {
  isLoading: boolean;
  orders: Order[];
}

const TrackShipment: FC<TrackShipmentProps> = ({ isLoading, orders = [] }) => {
  const { t } = useTranslation();
  const [orderId, setOrderId] = useState("");
  const timelineLogsMap = useMemo(
    () =>
      orders.reduce((acc: Record<string, ShipmentLog | null>, order) => {
        acc[order.order_number] = order.aftership_shipment_time_line;

        return acc;
      }, {}),
    [orders],
  );
  const orderIds = useMemo(
    () => Object.keys(timelineLogsMap),
    [timelineLogsMap],
  );
  const shipmentData = timelineLogsMap[orderId];

  useEffect(() => {
    if (orders.length) setOrderId(orders[0].order_number);
  }, [orders]);

  if (!orders.length || !orderId) {
    return (
      <TrackShipmentWrapper>
        <div className="text-center py-8 font-semibold md:text-lg text-slategray-400 text-white">
          {t("Currently, there are no orders in your account.")}
        </div>
      </TrackShipmentWrapper>
    );
  }

  if (isLoading) {
    return (
      <TrackShipmentWrapper>
        <Loader className="h-96 w-full" />
      </TrackShipmentWrapper>
    );
  }

  return (
    <TrackShipmentWrapper>
      <OrderSelector
        handleOrderId={setOrderId}
        orderId={orderId}
        orderIds={orderIds}
      />
      {shipmentData ? (
        <>
          <TimelineStatus {...shipmentData} />
          <Timeline
            {...shipmentData}
            className="w-full lg:w-full h-full pt-6 lg:pt-12 bg-white"
          />
        </>
      ) : (
        <div className="text-center py-8 font-semibold md:text-lg text-slategray-400 text-white">
          {t("Shipment being prepared")}
        </div>
      )}
    </TrackShipmentWrapper>
  );
};

export default TrackShipment;
