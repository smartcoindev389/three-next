import React, { FC } from "react";
import { Trans, useTranslation } from "react-i18next";

import { cn } from "@/utils/cn";
import Price from "@/shared/components/(common)/Currency/Price";

interface TotalProps {
  className: string;
  title: string;
  amount: number;
  currency: string;
}

/**
 * Total component displays a labeled amount with currency formatting.
 *
 * @component
 * @example
 * <Total
 *   className="class-subtotal"
 *   title="Subtotal"
 *   amount={199.99}
 *   currency="USD"
 * />
 *
 * @param {Object} props - Props for the Total component.
 * @param {string} props.className - Additional CSS classes for layout/styling.
 * @param {string} props.title - The label/title to display (e.g., "Subtotal", "Tax").
 * @param {number} props.amount - The numerical amount to display.
 * @param {string} props.currency - The currency code (e.g., "USD", "EUR") used for formatting.
 *
 * @returns {JSX.Element} A row displaying the title and the formatted price.
 */
const Total: FC<TotalProps> = ({
  className,
  title,
  amount,
  currency,
}): React.JSX.Element => {
  const { t } = useTranslation();

  return (
    <div className={cn(`${className}`, `gap-2 px-0 flex flex-row`)}>
      <span className="w-2/3 text-start">
        <Trans t={t}>{title}</Trans>
      </span>
      <span className="w-1/3 text-right">
        <Price amount={amount} orderCurrency={currency} storeCurrency={null} />
      </span>
    </div>
  );
};

export default Total;
