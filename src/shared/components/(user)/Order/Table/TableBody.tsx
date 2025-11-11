import Link from "next/link";
import React, { FC } from "react";
import Image from "next/image";
import { useTranslation } from "react-i18next";

import Price from "@/shared/components/(common)/Currency/Price";
import PaymentInvoice from "@/shared/components/(common)/Invoices/PaymentInvoice";
import TrackingInfo from "@/shared/components/(user)/Order/TrackingInfo";
import { Order } from "@/types/types";
import OrderDate from "@/shared/components/(user)/Home/RecentOrders/OrderDate";
import OrderLink from "@/shared/components/(user)/Home/RecentOrders/OrderLink";
import CustomerName from "@/shared/components/(user)/CustomerName/CustomerName";
import BillingAddress from "@/shared/components/(user)/BillingAddress/BillingAddress";

interface TableBodyProps {
  data: Order[];
  shortView: boolean;
}

const tdClassName = "px-4 py-2 border-r last:border-r-0 border-stroke";

const TableBody: FC<TableBodyProps> = ({ data, shortView }) => {
  const { t } = useTranslation();

  return (
    <tbody>
      {data.map((order, index) => (
        <tr key={index} className="border-t border-stroke">
          <td className={tdClassName}>
            <h5 className="text-sm text-body-color text-center">
              <OrderLink
                className="bg-gray-100 text-gray-500 px-3 py-2 rounded-md text-sm font-medium transition duration-200 hover:bg-gray-300 hover:text-gray-700"
                order={order}
              />
            </h5>
          </td>
          <td className={tdClassName}>
            <p className="text-sm text-body-color">
              <CustomerName
                billing_address={order.billing_address}
                billing_name={order.billing_name}
              />
            </p>
          </td>
          {!shortView && (
            <td className={tdClassName}>
              <p className="text-sm text-body-color">
                <BillingAddress billing_address={order.billing_address} />
              </p>
            </td>
          )}
          <td className={tdClassName}>
            <p className="text-sm text-body-color">
              <OrderDate orderdate={order.order_date} />
            </p>
          </td>
          <td className={tdClassName}>
            <p className="text-sm text-body-color">
              <Price
                amount={order.grand_total}
                orderCurrency={order.order_currency_code}
              />
            </p>
          </td>
          <td className={tdClassName}>
            {order.stripe_payment.label ? (
              <p className="text-sm text-body-color flex items-center gap-1">
                <Image
                  alt="icon"
                  className="w-[32px] h-[32px]"
                  height={32}
                  src={order.stripe_payment.icon}
                  width={32}
                />
                <span>{order.stripe_payment.label}</span>
              </p>
            ) : (
              <span>{order.payment_methods[0]?.name}</span>
            )}
          </td>
          <td className={tdClassName}>
            <p
              className={`text-sm ${order.status === "Successful" ? "text-[#34C38F]" : "text-[#F46A6A]"}`}
            >
              {order.status}
            </p>
          </td>
          <td className={tdClassName}>
            <TrackingInfo data={order.shipments} />
          </td>
          {!shortView && (
            <td className={`${tdClassName} text-center`}>
              <Link
                className="text-sm w-fit font-medium text-white bg-blue rounded-[50px] flex items-center justify-center px-4 py-1 gap-1 mx-auto"
                href={`/customer/dashboard/orders/${order.number}`}
              >
                {t("View")} & {t("Review")}
              </Link>
            </td>
          )}
          {!shortView && (
            <td className={`${tdClassName} text-center`}>
              <PaymentInvoice orderId={order.order_number} />
            </td>
          )}
        </tr>
      ))}
    </tbody>
  );
};

export default TableBody;
