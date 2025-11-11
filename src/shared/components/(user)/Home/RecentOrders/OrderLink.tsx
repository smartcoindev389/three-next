import React, { FC } from "react";
import Link from "next/link";

import { Order } from "@/types/types";

interface OrderLinkProps {
  className: string;
  order: Order;
}

/**
 * A functional component that generates a clickable link to an order's page in the customer dashboard.
 *
 * @param {Object} props - The component's props.
 * @param {string} [props.className] - Optional custom class name for styling the link.
 * @param {Object} props.order - The order object containing information about the order.
 * @param {string} props.order.increment_id - The unique identifier of the order, used to construct the link.
 *
 * @returns {React.JSX.Element} A clickable link element that navigates to the order details page.
 *
 * @example
 * <OrderLink className="order-link" order={orderData} />
 */
const OrderLink: FC<OrderLinkProps> = ({
  className,
  order,
}: OrderLinkProps): React.JSX.Element => {
  return (
    <Link href={`/customer/dashboard/orders/${order.increment_id}`}>
      <span className={`${className}`}>#{order.increment_id}</span>
    </Link>
  );
};

export default OrderLink;
