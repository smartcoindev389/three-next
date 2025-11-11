import { PhoneInput } from "react-international-phone";
import { parsePhoneNumber } from "react-phone-number-input";
import { forwardRef } from "react";

import { cn } from "@/utils/utils-old";

const InputPhone = forwardRef(
  (
    {
      defaultCountry = "us",
      value,
      onChange = () => {},
      className,
      inputProps,
      ...props
    },
    ref,
  ) => {
    return (
      <div className={"w-full"} data-lenis-prevent="true">
        <PhoneInput
          ref={ref}
          className={cn(
            "border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-0 focus:border-gray-300 hover:border-gray-300 active:border-gray-300",
            className,
          )}
          defaultCountry={defaultCountry}
          forceDialCode="true"
          inputProps={{
            onPaste: (event) => {
              event?.preventDefault();

              return false;
            },
            ...inputProps,
          }}
          value={value}
          onChange={onChange}
          {...props}
        />
      </div>
    );
  },
);

InputPhone.displayName = "InputPhone";

export { InputPhone };
