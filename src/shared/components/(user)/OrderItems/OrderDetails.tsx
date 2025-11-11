import React, { FC } from "react";
import { Trans, useTranslation } from "react-i18next";
import Link from "next/link";

import PaymentMethod from "@/shared/components/(user)/OrderItems/PaymentMethod";
import Title from "@/shared/components/(common)/Title/Title";

interface OrderDetailsProps {
  order: {
    increment_id: string;
    billing_address: any;
    shipping_address: any;
    payment_methods: any;
    status: any;
    order_date: string;
  };
  customerData: any;
}

/**
 * OrderDetails component displays detailed information about a specific customer order.
 * It shows billing and shipping addresses, payment method, order date, and order status.
 * Also includes a responsive header and a "Back to Orders" link for navigation.
 *
 * @component
 * @example
 * <OrderDetails order={orderData} customerData={customerData} />
 *
 * @param {Object} props - Component props.
 * @param {Object} props.order - The order object containing order-specific details.
 * @param {string} props.order.increment_id - The unique order ID.
 * @param {Object} props.order.billing_address - Billing address object.
 * @param {Object} props.order.shipping_address - Shipping address object.
 * @param {Array} props.order.payment_methods - Array of payment method objects.
 * @param {string} props.order.status - Current status of the order (e.g., "Delivered").
 * @param {string} props.order.order_date - ISO date string representing when the order was placed.
 * @param {Object} props.customerData - Customer information (e.g., email).
 *
 * @returns {JSX.Element} A responsive component displaying order details in a structured layout.
 */
const OrderDetails: FC<OrderDetailsProps> = ({
  order,
  customerData,
}): React.JSX.Element => {
  const { t } = useTranslation();

  return (
    <>
      <div className="md:hidden flex items-center gap-10">
        <div className="text-[#434345] text-3xl font-bold font-din-condensed" />
        <Title className="text-paragraph text-[1.75rem]">
          <Trans t={t}>Order Details</Trans>
        </Title>
        <Link
          className="flex items-center gap-1.5"
          href="/customer/dashboard/orders"
        >
          <svg
            fill="none"
            height="14"
            viewBox="0 0 14 14"
            width="14"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M14 6.125H3.35125L8.2425 1.23375L7 0L0 7L7 14L8.23375 12.7663L3.35125 7.875H14V6.125Z"
              fill="#00C0F3"
            />
          </svg>
          <div className="text-blue text-sm font-semibold">
            <Trans t={t}>Back to Orders</Trans>
          </div>
        </Link>
      </div>
      <div className="p-5 md:p-7 bg-white rounded-md shadow-sm">
        <div className="max-md:hidden flex items-center gap-10 mb-6">
          <div className="text-[#434345] text-3xl font-bold font-din-condensed">
            <Trans t={t}>Order Details</Trans>
          </div>
          <Link
            className="flex items-center gap-1.5"
            href="/customer/dashboard/orders"
          >
            <svg
              fill="none"
              height="14"
              viewBox="0 0 14 14"
              width="14"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M14 6.125H3.35125L8.2425 1.23375L7 0L0 7L7 14L8.23375 12.7663L3.35125 7.875H14V6.125Z"
                fill="#00C0F3"
              />
            </svg>
            <div className="text-blue text-sm font-semibold">
              <Trans t={t}>Back to Orders</Trans>
            </div>
          </Link>
        </div>

        <h3 className="text-[#74788D] relative text-lg font-bold">
          <Trans t={t}>Order ID</Trans>:{" "}
          <span className="font-normal">#{order?.increment_id}</span>
        </h3>

        <div className="flex flex-col 2xl:flex-row mt-4">
          <div className="w-full 2xl:w-1/3 pb-4 2xl:pr-10">
            <h3 className="text-[#495057] text-lg font-bold">
              <Trans t={t}>Billing Address</Trans>
            </h3>
            <div className="text-base text-[#74788D] mt-1.5 flex flex-col">
              <span>{`${order?.billing_address?.firstname ? order?.billing_address?.firstname : ""} ${
                order?.billing_address?.lastname
                  ? order?.billing_address?.lastname
                  : ""
              }`}</span>
              <span>{`${order?.billing_address?.street[0] ? order?.billing_address?.street[0] : ""} ${
                order?.billing_address?.city ? order?.billing_address?.city : ""
              } ${order?.billing_address?.region ? order?.billing_address?.region : ""} ${
                order?.billing_address?.country_code
                  ? order?.billing_address?.country_code + ","
                  : ""
              } ${order?.billing_address?.postcode ? order?.billing_address?.postcode : ""}`}</span>
            </div>
            <div className="mt-4">
              <div className="text-base font-bold text-[#74788D] flex items-center">
                <Trans t={t}>Email</Trans>:&nbsp;{" "}
                <span className="font-normal">{customerData?.email}</span>
              </div>
              <div className="text-base font-bold text-[#74788D] flex items-center mt-1">
                <Trans t={t}>Phone</Trans>:&nbsp;{" "}
                <span className="font-normal">
                  {order?.billing_address?.telephone}
                </span>
              </div>
            </div>
          </div>
          <div className="w-full 2xl:w-1/3 py-4 2xl:px-10 max-2xl:border-y 2xl:border-x border-[#EBEBEB]">
            <h3 className="text-[#495057] text-lg font-bold">
              <Trans t={t}>Shipping Address</Trans>
            </h3>
            <div className="text-base text-[#74788D] mt-1.5 flex flex-col">
              <span>{`${order?.shipping_address?.firstname ? order?.shipping_address?.firstname : ""} ${
                order?.shipping_address?.lastname
                  ? order?.shipping_address?.lastname
                  : ""
              }`}</span>
              <span>{`${order?.shipping_address?.street[0] ? order?.shipping_address?.street[0] : ""} ${
                order?.shipping_address?.city
                  ? order?.shipping_address?.city
                  : ""
              } ${order?.shipping_address?.region ? order?.shipping_address?.region : ""} ${
                order?.shipping_address?.country_code
                  ? order?.shipping_address?.country_code + ","
                  : ""
              } ${order?.shipping_address?.postcode ? order?.shipping_address?.postcode : ""}`}</span>
            </div>
            <div className="mt-4">
              <div className="text-base font-bold text-[#74788D] flex items-center mt-1">
                <Trans t={t}>Phone</Trans>:&nbsp;{" "}
                <span className="font-normal">
                  {order?.shipping_address?.telephone}
                </span>
              </div>
            </div>
          </div>
          <div className="w-full 2xl:w-1/3 py-4 2xl:px-10">
            <h3 className="text-[#495057] text-lg font-bold">
              <Trans t={t}>Payment Method</Trans>
            </h3>
            <div className="text-[#74788D] text-base leading-7 flex flex-col mt-1.5">
              <span>
                <PaymentMethod order={order} />
              </span>
            </div>
            <h3 className="text-[#495057] text-lg font-bold mt-3">
              <Trans t={t}>Order Date</Trans>
            </h3>
            <div className="text-[#74788D] text-base leading-7 flex flex-col mt-1.5">
              <span>
                {new Date(order?.order_date).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>
            <div className="mt-6 flex items-center gap-3.5">
              <h3 className="text-[#495057] text-lg font-bold">
                <Trans t={t}>Status</Trans>
              </h3>
              <div
                className={`text-sm text-white px-3 py-1 w-fit rounded-full ${
                  order?.status === "Delivered" ? "bg-[#34C38F]" : "bg-blue"
                }`}
              >
                {order?.status}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default OrderDetails;
