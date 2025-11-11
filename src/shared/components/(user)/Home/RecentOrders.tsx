import React, { FC, useMemo, useState } from "react";
import { Trans, useTranslation } from "react-i18next";

import Loader from "@/shared/components/(common)/Loader/Loader";
import { Order } from "@/types/types";
import Pagination from "@/shared/components/(user)/Home/RecentOrders/Pagination";
import OrdersList from "@/shared/components/(user)/Order/OrdersList";

interface RecentOrdersProps {
  orders: Order[];
  isLoading: boolean;
}

const ORDERS_PER_PAGE = 5;

const RecentOrders: FC<RecentOrdersProps> = ({
  orders = [],
  isLoading,
}: RecentOrdersProps) => {
  const { t } = useTranslation();
  const [current, setCurrent] = useState(1);
  const tableData = useMemo(
    () =>
      orders.slice(ORDERS_PER_PAGE * (current - 1), ORDERS_PER_PAGE * current),
    [orders, current],
  );

  if (isLoading) return <Loader className="h-96 w-full" />;

  if (!orders.length)
    return (
      <div className="text-center text-white flex justify-center m-auto w-auto py-6">
        <Trans t={t}>Currently there are no orders in your account</Trans>
      </div>
    );

  return (
    <div>
      <OrdersList
        className="mt-8"
        loading={isLoading}
        orders={tableData}
        shortView={true}
      />
      <Pagination
        countPerPage={ORDERS_PER_PAGE}
        current={current}
        setCurrent={setCurrent}
        totalItems={orders.length}
      />
    </div>
  );
};

export default RecentOrders;
