import React, { FC } from "react";
import Image from "next/image";

interface PaymentMethodProps {
  order: {
    stripe_payment?: {
      icon: string;
      label: string;
    };
    payment_methods: [any];
  };
}

/**
 * Displays the selected payment method for an order.
 *
 * If Stripe payment information is available, it shows the Stripe icon and label.
 * Otherwise, it falls back to displaying the name of the first payment method in the list.
 *
 * @param {PaymentMethodProps} props - The props for the component, including the order data.
 * @returns {JSX.Element} The rendered payment method UI.
 */
const PaymentMethod: FC<PaymentMethodProps> = ({
  order,
}): React.JSX.Element => {
  return (
    <>
      {order?.stripe_payment && order.stripe_payment?.icon ? (
        <p className="text-sm text-body-color flex items-center gap-1">
          <Image
            alt={order.stripe_payment.label}
            height={32}
            src={order.stripe_payment.icon}
            width={32}
          />
          <span>{order.stripe_payment.label}</span>
        </p>
      ) : (
        <span>{order?.payment_methods[0]?.name}</span>
      )}
    </>
  );
};

export default PaymentMethod;
