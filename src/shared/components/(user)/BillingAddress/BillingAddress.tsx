import { FC } from "react";

import { Address } from "@/types/types";

interface BillingAddressProps {
  billing_address: Address | string;
}

const BillingAddress: FC<BillingAddressProps> = ({ billing_address }) => {
  if (typeof billing_address === "string") return billing_address;

  return Object.values(billing_address)
    .filter((value) => !value)
    .join(", ");
};

export default BillingAddress;
