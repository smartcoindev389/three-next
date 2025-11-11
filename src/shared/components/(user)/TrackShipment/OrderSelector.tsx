import { FC } from "react";
import { useTranslation } from "react-i18next";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/(common)/ui/select";

interface OrderSelectorProps {
  orderId: string;
  orderIds: string[];
  handleOrderId: (value: string) => void;
}

const OrderSelector: FC<OrderSelectorProps> = ({
  orderId,
  orderIds,
  handleOrderId,
}) => {
  const { t } = useTranslation();

  return (
    <Select value={orderId} onValueChange={(value) => handleOrderId(value)}>
      <SelectTrigger className="flex relative mt-3 text-white rounded-[50px] w-auto max-w-full gap-4 mx-auto">
        <SelectValue className="text-sm font-medium" placeholder="Order ID: " />
      </SelectTrigger>
      <SelectContent>
        {orderIds?.map((id) => (
          <SelectGroup key={id}>
            <SelectItem value={id}>
              {t("Order ID")}: #{id}
            </SelectItem>
          </SelectGroup>
        ))}
      </SelectContent>
    </Select>
  );
};

export default OrderSelector;
