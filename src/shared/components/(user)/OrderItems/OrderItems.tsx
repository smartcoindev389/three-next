import React, { FC } from "react";
import { Trans, useTranslation } from "react-i18next";

import Item from "./Item";
import Total from "./Total";

interface OrderItemsProps {
  order: {
    mp_pre_order_notice: string;
    increment_id: string;
    billing_address: any;
    shipping_address: any;
    payment_methods: any;
    status: any;
    order_date: string;
    total: any;
    items: [product: any];
  };
}

/**
 * OrderItems component renders the detailed list of items in an order, including product information,
 * quantities, individual prices, and subtotal calculations. It also handles display of notices such as
 * pre-order warnings and is localized using `react-i18next`.
 *
 * @component
 * @example
 * <OrderItems order={orderData} customerData={customerData} />
 *
 * @param {Object} props - Props for the OrderItems component.
 * @param {Object} props.order - The order data to display.
 * @param {string} props.order.mp_pre_order_notice - Optional notice message for pre-orders.
 * @param {string} props.order.increment_id - Unique order ID.
 * @param {any} props.order.billing_address - Customer billing address.
 * @param {any} props.order.shipping_address - Customer shipping address.
 * @param {any} props.order.payment_methods - Payment methods used.
 * @param {any} props.order.status - Current order status.
 * @param {string} props.order.order_date - Date when the order was placed.
 * @param {any} props.order.total - Detailed total breakdown (e.g., subtotal, tax, shipping).
 * @param {Array<Object>} props.order.items - List of ordered items.
 *
 * @returns {JSX.Element} A component rendering order items and total cost breakdown.
 */
const OrderItems: FC<OrderItemsProps> = ({ order }): React.JSX.Element => {
  const { t } = useTranslation();

  return (
    <>
      <h4 className="md:hidden m-0 relative text-3xl font-bold text-[#434345] font-din-condensed inline-flex items-center mt-2">
        <Trans t={t}>Order Items</Trans>
        {order?.mp_pre_order_notice && (
          <span
            className={
              "bg-[#f25454] bg-opacity-20 font-[400] gap-x-2 inline-flex items-center ml-3 px-6 py-3 rounded-[5px] text-[18px]"
            }
          >
            <span>
              <svg
                fill="none"
                height="22"
                viewBox="0 0 25 22"
                width="25"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M23.9006 14.9531L16.4637 2.55738C15.4876 0.930871 13.9944 0 12.3641 0C10.7338 0 9.24067 0.930871 8.26451 2.55486L0.827606 14.9531C-0.161129 16.5997 -0.269312 18.3558 0.531992 19.7709C1.33204 21.1874 2.89439 22 4.81651 22H19.9117C21.8338 22 23.3962 21.1874 24.1962 19.7722C24.9975 18.357 24.8894 16.6009 23.9006 14.9531ZM12.3641 17.6589C11.2898 17.6589 10.4143 16.7846 10.4143 15.7103C10.4143 14.6348 11.2886 13.7593 12.3641 13.7593C13.4396 13.7593 14.3139 14.6348 14.3139 15.7103C14.3139 16.7846 13.4384 17.6589 12.3641 17.6589ZM14.4183 8.31997C14.4045 8.35897 12.656 12.6825 12.656 12.6825C12.6082 12.8007 12.4924 12.8787 12.3654 12.8787C12.2383 12.8787 12.1226 12.8007 12.0748 12.6825L10.325 8.35771C10.2118 8.06461 10.1627 7.80045 10.1627 7.53376C10.1627 6.31986 11.1502 5.33238 12.3641 5.33238C13.578 5.33238 14.5655 6.31986 14.5655 7.53376C14.5655 7.80045 14.5164 8.06461 14.4183 8.31997Z"
                  fill="#545454"
                />
              </svg>
            </span>
            <span className={"leading-none"}>{order.mp_pre_order_notice}</span>
          </span>
        )}
      </h4>
      <div className="bg-white p-5 md:p-7 max-lg:overflow-x-auto rounded-md shadow-sm">
        <div className="bg-white rounded-lg min-w-[320px]">
          <h4 className="max-md:hidden m-0 relative text-3xl font-bold text-[#434345] font-din-condensed inline-flex items-center pb-[14px]">
            <Trans t={t}>Order Items</Trans>
            {order?.mp_pre_order_notice && (
              <span
                className={
                  "bg-[#f25454] bg-opacity-20 font-[400] gap-x-2 inline-flex items-center ml-3 px-6 py-3 rounded-[5px] text-[18px]"
                }
              >
                <span>
                  <svg
                    fill="none"
                    height="22"
                    viewBox="0 0 25 22"
                    width="25"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M23.9006 14.9531L16.4637 2.55738C15.4876 0.930871 13.9944 0 12.3641 0C10.7338 0 9.24067 0.930871 8.26451 2.55486L0.827606 14.9531C-0.161129 16.5997 -0.269312 18.3558 0.531992 19.7709C1.33204 21.1874 2.89439 22 4.81651 22H19.9117C21.8338 22 23.3962 21.1874 24.1962 19.7722C24.9975 18.357 24.8894 16.6009 23.9006 14.9531ZM12.3641 17.6589C11.2898 17.6589 10.4143 16.7846 10.4143 15.7103C10.4143 14.6348 11.2886 13.7593 12.3641 13.7593C13.4396 13.7593 14.3139 14.6348 14.3139 15.7103C14.3139 16.7846 13.4384 17.6589 12.3641 17.6589ZM14.4183 8.31997C14.4045 8.35897 12.656 12.6825 12.656 12.6825C12.6082 12.8007 12.4924 12.8787 12.3654 12.8787C12.2383 12.8787 12.1226 12.8007 12.0748 12.6825L10.325 8.35771C10.2118 8.06461 10.1627 7.80045 10.1627 7.53376C10.1627 6.31986 11.1502 5.33238 12.3641 5.33238C13.578 5.33238 14.5655 6.31986 14.5655 7.53376C14.5655 7.80045 14.5164 8.06461 14.4183 8.31997Z"
                      fill="#545454"
                    />
                  </svg>
                </span>
                <span className={"leading-none"}>
                  {order.mp_pre_order_notice}
                </span>
              </span>
            )}
          </h4>
          <div className="text-[#495057]">
            <div className="px-0 grid grid-flow-col grid-cols-5 sm:grid-cols-6 gap-2 text-base font-semibold pb-[9px] border-b-2 border-[#EFF2F7] border-solid">
              <span className="max-sm:hidden col-span-1">
                <Trans t={t}>Item No.</Trans>
              </span>
              <span className="col-span-3">
                <Trans t={t}>Product</Trans>
              </span>
              <span className="col-span-1 text-center">
                <Trans t={t}>Quantity</Trans>
              </span>
              <span className="col-span-1 text-right">
                <Trans t={t}>Price</Trans>
              </span>
            </div>
            {order?.items?.map((item, index) => {
              return (
                <div key={index}>
                  <Item index={index} item={item} order={order} />
                </div>
              );
            })}
            <Total
              amount={order?.total?.subtotal?.value}
              className="text-base font-semibold pt-3"
              currency={order?.total?.subtotal?.currency}
              title="Sub Total"
            />
            <Total
              amount={order?.total?.shipping_handling?.total_amount?.value}
              className="text-base font-semibold pt-4"
              currency={order?.total?.shipping_handling?.total_amount?.currency}
              title="Shipping Cost"
            />
            <Total
              amount={order?.total?.payment_fee?.value}
              className="text-base font-semibold pt-4"
              currency={order?.total?.payment_fee?.currency}
              title="Processing Fee"
            />
            {order?.total?.discounts?.length > 0 && (
              <Total
                amount={order?.total?.discounts?.[0]?.amount?.value}
                className="text-base font-semibold pt-4"
                currency={order?.total?.subtotal?.currency}
                title="Discounts"
              />
            )}
            <Total
              amount={order?.total?.total_tax?.value}
              className="text-base font-semibold pt-4"
              currency={order?.total?.total_tax?.currency}
              title="Tax"
            />
            <Total
              amount={order?.total?.grand_total?.value}
              className="text-lg font-bold pt-4"
              currency={order?.total?.grand_total?.currency}
              title="Total"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default OrderItems;
