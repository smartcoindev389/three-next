import React, { FC } from "react";
import { Trans, useTranslation } from "react-i18next";

import ReviewButton from "@/shared/components/(common)/Reviews/ReviewButton";
import Price from "@/shared/components/(common)/Currency/Price";

interface ItemProps {
  index: number;
  order: any;
  item: {
    product_name: string;
    quantity_ordered: string;
    product_sku: string;
    product: {
      mp_pre_order: {
        stock_notice: string;
      };
    };
    product_sale_price: {
      value: any;
      currency: string;
    };
  };
}

/**
 * Item component renders an individual order item within the order summary.
 * Displays product name, quantity, pricing, and any additional item-related information.
 *
 * @component
 * @example
 * <Item index={0} item={itemData} order={orderData} />
 *
 * @param {Object} props - Props for the Item component.
 * @param {number} props.index - The index of the item in the list.
 * @param {Object} props.item - The item data to render.
 * @param {string} props.item.name - Product name.
 * @param {number} props.item.qty - Quantity of the product ordered.
 * @param {Object} props.item.price - Pricing info for the item.
 * @param {Object} props.order - The full order object, used to provide context (e.g., currency, settings).
 *
 * @returns {JSX.Element} A component displaying a single product in the order list.
 */
const Item: FC<ItemProps> = ({ index, order, item }): React.JSX.Element => {
  const { t } = useTranslation();

  return (
    <div
      key={index}
      className="px-0 grid grid-flow-col grid-cols-5 sm:grid-cols-6 gap-2 text-base font-normal py-2 border-solid border-b border-[#EFF2F7]"
    >
      <span className="max-sm:hidden col-span-1">{index + 1}</span>
      <span className="col-span-3">
        {item.product_name}
        {item?.product?.mp_pre_order?.stock_notice && (
          <span>
            <br />
            <strong>
              <Trans t={t}>Notice</Trans>:{" "}
            </strong>{" "}
            {item?.product?.mp_pre_order?.stock_notice}
          </span>
        )}
        <ReviewButton order={order} product={item} />
      </span>
      <span className="col-span-1 text-center">{item.quantity_ordered}</span>
      <span className="col-span-1 text-right">
        <Price
          amount={item.product_sale_price.value}
          orderCurrency={item.product_sale_price.currency}
          storeCurrency={null}
        />
      </span>
    </div>
  );
};

export default Item;
