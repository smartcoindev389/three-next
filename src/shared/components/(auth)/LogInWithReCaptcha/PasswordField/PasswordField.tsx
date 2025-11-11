import { FC, useState } from "react";
import { useTranslation } from "react-i18next";
import { ControllerRenderProps } from "react-hook-form";

import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/shared/components/(common)/ui/form";
import { Input } from "@/shared/components/(common)/ui/input";

interface PasswordFieldProps {
  control: any;
}

interface FieldType {
  field: ControllerRenderProps<{ password: string }, "password">;
}

const PasswordField: FC<PasswordFieldProps> = ({ control }) => {
  const { t } = useTranslation();
  const [showPassword, setShowPassword] = useState(false);
  const toggleVisibilityPassword = () =>
    setShowPassword((prevState) => !prevState);

  return (
    <FormField
      control={control}
      name="password"
      render={({ field }: FieldType): any => (
        <FormItem className="space-y-0 relative" suppressHydrationWarning {...({} as any)}>
          <FormControl {...({} as any)}>
            <Input
              placeholder={t("Password")}
              type={showPassword ? "text" : "password"}
              {...field}
              className="w-full px-3.5 border border-[#ABABAB] focus:border-[#545454] focus:ring-0 py-[26px] font-sf-pro-display placeholder:text-[#74788D] rounded-[5px] text-base"
              {...({} as any)}
            />
          </FormControl>
          <button
            className="absolute right-4 top-5"
            type="button"
            onClick={toggleVisibilityPassword}
          >
            {showPassword ? (
              <svg
                fill="none"
                height="16"
                viewBox="0 0 20 16"
                width="20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M6.13684 10.0353C5.56507 7.90144 6.8314 5.70809 8.96527 5.13632C9.60358 4.96529 10.2472 4.95873 10.8512 5.09067M13.3311 6.78285C13.5661 7.13584 13.7484 7.5325 13.8642 7.96475C14.436 10.0986 13.1697 12.292 11.0358 12.8637C9.57913 13.254 8.09472 12.7878 7.11738 11.7737"
                  stroke="#74788D"
                  strokeLinecap="round"
                  strokeWidth="1.2"
                />
                <path
                  d="M1 9C1 9 2.94595 2 10 2C11.3451 2 12.5044 2.25452 13.5 2.6665M19 9C19 9 18.4793 7.12675 17 5.31834"
                  stroke="#74788D"
                  strokeLinecap="round"
                  strokeWidth="1.2"
                />
                <path
                  d="M18 1.5L3.5 15"
                  stroke="#74788D"
                  strokeLinecap="round"
                  strokeWidth="1.2"
                />
              </svg>
            ) : (
              <svg
                fill="none"
                height="13"
                viewBox="0 0 20 13"
                width="20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle
                  cx="10"
                  cy="8.34998"
                  r="3.4"
                  stroke="#74788D"
                  strokeWidth="1.2"
                />
                <path
                  d="M1 8.34998C1 8.34998 2.94595 1.34998 10 1.34998C17.0541 1.34998 19 8.34998 19 8.34998"
                  stroke="#74788D"
                  strokeLinecap="round"
                  strokeWidth="1.2"
                />
              </svg>
            )}
          </button>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default PasswordField;
