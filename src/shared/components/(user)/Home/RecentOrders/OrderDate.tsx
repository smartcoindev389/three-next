import { FC } from "react";

interface OrderDateProps {
  orderdate: string;
  locale?: string;
}

/**
 * A functional component that formats and displays the order date in a medium date style.
 *
 * @param {Object} props - The component's props.
 * @param {string | number} props.orderdate - The order date as a string or number to be formatted.
 *
 * @returns {string} The formatted order date as a string in the defined locale.
 *
 * @example
 * <OrderDate orderdate="2023-10-15T14:30:00Z" />
 */
const OrderDate: FC<OrderDateProps> = ({
  orderdate,
  locale,
}: OrderDateProps): string => {
  const date = new Date(orderdate);
  const options: Intl.DateTimeFormatOptions = {
    dateStyle: "medium",
  };

  return date.toLocaleDateString(locale ?? "en-US", options);
};

export default OrderDate;
