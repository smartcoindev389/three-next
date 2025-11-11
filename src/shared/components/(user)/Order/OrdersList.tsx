import { FC } from "react";

import Loader from "@/shared/components/(common)/Loader/Loader";
import OrderTable from "@/shared/components/(user)/Order/Table/Table";
import useMobile from "@/hooks/useMobile";
import OrdersCards from "@/shared/components/(user)/Order/OrdersCards/OrdersCards";
import { Order } from "@/types/types";

interface OrdersListProps {
  orders: Order[];
  loading: boolean;
  shortView?: boolean;
  className?: string;
}

const OrdersList: FC<OrdersListProps> = ({
  orders = [],
  loading,
  shortView = false,
  className = "",
}) => {
  const isMobile = useMobile();

  return (
    <section className={`rounded-[5px] ${className}`}>
      <div className="w-full">
        <div className="flex flex-wrap">
          <div className="w-full">
            <div className="max-w-full overflow-x-auto">
              {isMobile ? (
                <OrdersCards data={orders} shortView={shortView} />
              ) : (
                <OrderTable data={orders} shortView={shortView} />
              )}
              {loading && <Loader className="h-96 w-full" />}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OrdersList;
