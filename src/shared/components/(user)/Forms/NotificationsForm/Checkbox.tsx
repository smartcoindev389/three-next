import { FC } from "react";
import { UseFormRegisterReturn } from "react-hook-form";

interface CheckboxProps {
  label: string;
  inputProps: UseFormRegisterReturn;
}

const Checkbox: FC<CheckboxProps> = ({ label, inputProps }) => {
  return (
    <label className="w-full flex cursor-pointer select-none items-center gap-5 mb-5">
      <div className="text-base text-primary">{label}</div>
      <div className="relative">
        <input {...inputProps} className="sr-only peer" type="checkbox" />
        <div className="box block h-8 w-14 rounded-full peer bg-[#CED4DA] peer-checked:bg-blue" />
        <div className="absolute left-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-white transition peer peer-checked:translate-x-full" />
      </div>
    </label>
  );
};

export default Checkbox;
