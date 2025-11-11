import { FC } from "react";
import { Controller } from "react-hook-form";

import { InputPhone } from "@/shared/components/(common)/ui/input-phone";

interface PhoneControllerProps {
  control: any;
  error: boolean;
  loading: boolean;
  dirty?: boolean;
}

const PhoneController: FC<PhoneControllerProps> = ({
  control,
  error,
  loading,
  dirty,
}) => (
  <Controller
    control={control}
    name="phone"
    render={({ field: { onChange, value } }) => (
      <InputPhone
        className={`py-1 bg-white ${error ? "border-[#F46A6A]" : "border-[#ced4dA]"}`}
        countrySelectorStyleProps={{ buttonClassName: "!bg-transparent" }}
        defaultCountry={(localStorage.getItem("lang") || "en_US")
          .split("_")[1]
          .toLowerCase()}
        disabled={loading}
        inputProps={{
          className: `border-0 bg-transparent p-0 focus:!ring-0 focus:text-inherit ${dirty ? "text-inherit" : "text-[#c2c2c2]"}`,
        }}
        value={value}
        onChange={onChange}
      />
    )}
    rules={{
      required: true,
      minLength: 8,
    }}
  />
);

export default PhoneController;
