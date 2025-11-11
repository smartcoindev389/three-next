import { FC, PropsWithChildren } from "react";
import { UseFormRegisterReturn } from "react-hook-form";

interface InputProps extends PropsWithChildren {
  label?: string;
  error: boolean;
  errorMsg?: string;
  inputProps: UseFormRegisterReturn;
  dirty?: boolean;
  loading?: boolean;
}

const Input: FC<InputProps> = ({
  label,
  inputProps,
  dirty,
  error,
  errorMsg = "",
  loading,
  children,
}) => {
  return (
    <div className={"w-full md:max-w-[calc(50%_-_8px)] mb-6"}>
      <label className={"inline-block leading-[1.2] mb-1 text-[#434345]"}>
        {label}
      </label>
      {children ? (
        children
      ) : (
        <input
          {...inputProps}
          className={`px-4 py-2.5 w-full ${error ? "border-[#F46A6A]" : "border-[#ced4dA]"} rounded-md ${dirty ? "text-inherit" : "text-[#c2c2c2]"} focus:text-inherit`}
          disabled={loading}
        />
      )}
      {errorMsg && (
        <p className={"text-sm font-medium text-destructive"}>{errorMsg}</p>
      )}
    </div>
  );
};

export default Input;
