import * as React from "react";
import { useState } from "react";

import { cn } from "@/utils/utils-old";
const Input = React.forwardRef(
  ({ className, type, containerClassName, showIcon, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);

    return (
      <div
        className={containerClassName ? containerClassName : `relative w-full`}
      >
        <input
          ref={ref}
          className={cn(
            "flex h-10 w-full bg-background px-3 placeholder:font-light py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-[#A4A4A4] focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 text-gray-100",
            className,
          )}
          type={
            type === "password" ? (showPassword ? "text" : "password") : type
          }
          {...props}
        />
        {showIcon && (
          <div
            className={`absolute right-4 top-[50%] -translate-y-[50%] ${props.iconClass}`}
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
              <svg
                fill="none"
                height="12"
                viewBox="0 0 21 12"
                width="21"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M10.2494 4.44287C11.9954 4.44287 13.4114 5.85787 13.4114 7.60487C13.4114 9.35087 11.9954 10.7659 10.2494 10.7659C8.50338 10.7659 7.08838 9.35087 7.08838 7.60487"
                  stroke="#74788D"
                  strokeLinecap="square"
                  strokeWidth="1.5"
                />
                <path
                  d="M19.5 7.604C17.539 3.476 14.056 1 10.248 1H10.252C6.444 1 2.961 3.476 1 7.604"
                  stroke="#74788D"
                  strokeLinecap="square"
                  strokeWidth="1.5"
                />
              </svg>
            ) : (
              <svg
                fill="none"
                height="17"
                viewBox="0 0 21 17"
                width="21"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M10.2494 5.44287C11.9954 5.44287 13.4114 6.85787 13.4114 8.60487C13.4114 10.3509 11.9954 11.7659 10.2494 11.7659C8.50338 11.7659 7.08838 10.3509 7.08838 8.60487"
                  stroke="#74788D"
                  strokeLinecap="square"
                  strokeWidth="1.5"
                />
                <path
                  d="M19.5 8.604C17.539 4.476 14.056 2 10.248 2H10.252C6.444 2 2.961 4.476 1 8.604"
                  stroke="#74788D"
                  strokeLinecap="square"
                  strokeWidth="1.5"
                />
                <line
                  stroke="#F46A6A"
                  strokeWidth="1.5"
                  x1="18.5303"
                  x2="3.53033"
                  y1="0.53033"
                  y2="15.5303"
                />
              </svg>
            )}
          </div>
        )}
      </div>
    );
  },
);

Input.displayName = "Input";

const InputWithoutLabel = React.forwardRef(
  (
    { className, type, containerClassName, placeholder, isRequired, ...props },
    ref,
  ) => {
    return (
      <div
        className={containerClassName ? containerClassName : `relative w-full`}
      >
        <input
          ref={ref}
          className={cn(
            "flex h-10 w-full relative bg-transparent z-10 px-3 placeholder:font-light py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium text-white placeholder:text-white focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
            className,
          )}
          type={type}
          {...props}
        />
        <label
          className={`transition-all ease-in-out bg-[#97E3FF1C] absolute leading-[1.2] left-3 px-2 transform  ${props.value ? "top-0 -translate-y-2 -translate-x-1 z-20" : "top-1/2 translate-y-[-50%]"}`}
        >
          <span className="text-[#949390]">{placeholder}</span>
          {isRequired && <span className="ml-1 text-[#F25454]">*</span>}
        </label>
      </div>
    );
  },
);

InputWithoutLabel.displayName = "InputWithoutLabel";

export { Input, InputWithoutLabel };
