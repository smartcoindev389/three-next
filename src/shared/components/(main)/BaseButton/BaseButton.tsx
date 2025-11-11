import { ButtonHTMLAttributes, FC } from "react";

const BaseButton: FC<ButtonHTMLAttributes<HTMLButtonElement>> = ({
  children,
  className = "",
  ...props
}) => (
  <button
    className={`rounded-[5px] text-white text-base md:text-xl py-2 px-4 bg-blue font-semibold ${className}`}
    {...props}
  >
    {children}
  </button>
);

export default BaseButton;
