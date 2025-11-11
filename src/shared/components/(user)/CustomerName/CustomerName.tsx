import { FC } from "react";

import { Address } from "@/types/types";

interface CustomerNameProps {
  billing_address: Address | string;
  billing_name?: string;
}

const CustomerName: FC<CustomerNameProps> = ({
  billing_address,
  billing_name,
}) => {
  if (typeof billing_name === "string") return billing_name;
  if (typeof billing_address === "string") return "N/A";

  const customerName = [billing_address?.firstname, billing_address?.lastname];

  return customerName.join(" ");
};

export default CustomerName;
