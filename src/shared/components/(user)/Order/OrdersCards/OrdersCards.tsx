"use client";

import { useTranslation } from "react-i18next";
import React, { FC, PropsWithChildren } from "react";
import Image from "next/image";
import Link from "next/link";

import Price from "@/shared/components/(common)/Currency/Price";
import PaymentInvoice from "@/shared/components/(common)/Invoices/PaymentInvoice";
import TrackingInfo from "@/shared/components/(user)/Order/TrackingInfo";
import { Order } from "@/types/types";
import OrderDate from "@/shared/components/(user)/Home/RecentOrders/OrderDate";
import CustomerName from "@/shared/components/(user)/CustomerName/CustomerName";
import BillingAddress from "@/shared/components/(user)/BillingAddress/BillingAddress";

interface OrdersCardsProps {
  data: Order[];
  shortView: boolean;
}

interface RowProps extends PropsWithChildren {
  name: string;
}

const Row: FC<RowProps> = ({ name, children }) => {
  const { t } = useTranslation();

  return (
    <p className="pb-1">
      <b className="pr-2 text-paragraph">{t(name)}</b>
      {children}
    </p>
  );
};

const OrdersCards: FC<OrdersCardsProps> = ({ data, shortView }) => {
  const { t } = useTranslation();

  return (
    <div className="text-sm text-slategray-400">
      {data.map((order) => (
        <div
          key={order.number}
          className="mb-4 p-4 bg-[#001322] text-white shadow border border-whitesmoke-100 rounded "
        >
          <Row name="Order ID">
            <Link
              className="hover:text-blue"
              href={`/customer/dashboard/orders/${order.number}`}
            >
              {order.number}
            </Link>
          </Row>
          <Row name="Billing Name">
            <CustomerName
              billing_address={order.billing_address}
              billing_name={order.billing_name}
            />
          </Row>
          {!shortView && (
            <Row name="Billing Address">
              <BillingAddress billing_address={order.billing_address} />
            </Row>
          )}
          <Row name="Date of Purchase">
            <OrderDate orderdate={order.order_date} />
          </Row>
          <Row name="Order Total">
            <Price
              amount={order.grand_total}
              orderCurrency={order.order_currency_code}
            />
          </Row>
          <Row name="Payment Method">
            {order.stripe_payment.label ? (
              <span className="inline-flex gap-1 relative -bottom-1">
                <Image
                  alt="icon"
                  className="w-[32px] h-[20px]"
                  height={32}
                  src={order.stripe_payment.icon}
                  width={32}
                />
                <span>{order.stripe_payment.label}</span>
              </span>
            ) : (
              <span>{order.payment_methods[0]?.name}</span>
            )}
          </Row>
          <Row name="Order Status">
            <span
              className={`text-sm ${order.status === "Successful" ? "text-[#34C38F]" : "text-[#F46A6A]"}`}
            >
              {order.status}
            </span>
          </Row>
          <Row name="Tracking Info">
            <TrackingInfo data={order.shipments} />
          </Row>

          {!shortView && (
            <div className="flex gap-4 pt-4">
              <Link
                className="text-blue flex items-center font-medium"
                href={`/customer/dashboard/orders/${order.number}`}
              >
                <svg
                  className="mr-1"
                  fill="none"
                  height="15"
                  viewBox="0 0 16 15"
                  width="16"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M6.50005 0.5C3.46752 0.5 1 2.9675 1 6C1 9.0325 3.46752 11.5 6.50005 11.5C9.53258 11.5 12.0001 9.0325 12.0001 6C12.0001 2.9675 9.53258 0.5 6.50005 0.5ZM6.50005 10.5C4.01903 10.5 2.00001 8.4815 2.00001 6C2.00001 3.519 4.01903 1.5 6.50005 1.5C8.98157 1.5 11.0001 3.519 11.0001 6C11.0001 8.4815 8.98157 10.5 6.50005 10.5Z"
                    fill="#00C0F3"
                    stroke="#00C0F3"
                    strokeWidth="0.5"
                  />
                  <path
                    d="M14.8536 13.6465L11.8531 10.6465C11.6576 10.451 11.3416 10.451 11.1461 10.6465C10.9506 10.842 10.9506 11.158 11.1461 11.3535L14.1466 14.3535C14.2441 14.451 14.3721 14.5 14.5001 14.5C14.6281 14.5 14.7561 14.451 14.8536 14.3535C15.0491 14.158 15.0491 13.842 14.8536 13.6465Z"
                    fill="#00C0F3"
                    stroke="#00C0F3"
                    strokeWidth="0.5"
                  />
                </svg>

                {t("View Details")}
              </Link>
              <PaymentInvoice
                className="bg-transparent !text-blue"
                orderId={order.order_number}
              >
                {t("Invoice")}
              </PaymentInvoice>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default OrdersCards;
