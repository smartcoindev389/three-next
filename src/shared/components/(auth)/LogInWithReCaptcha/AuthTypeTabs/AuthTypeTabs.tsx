import React, { FC } from "react";
import clsx from "clsx";

interface AuthTypeTabsProps {
  type: string;
  setType: (type: string) => void;
}

const AuthTypeTabs: FC<AuthTypeTabsProps> = ({ type, setType }) => {
  return (
    <div className="flex items-center bg-[#97E3FF33] rounded-lg p-2">
      <button
        aria-label={"Enter your Email"}
        className={clsx(
          "w-1/2 p-2.5 text-center text-base font-medium",
          type === "email" ? "text-[#3F65FD]" : "text-white",
          type === "email" ? "bg-white rounded-md" : "",
        )}
        onClick={() => setType("email")}
      >
        Enter your Email
      </button>
      <div className="w-px h-[30px] " />
      <button
        aria-label={"Enter your Phone"}
        className={clsx(
          "w-1/2 p-2.5 text-center text-base font-medium",
          type === "phone" ? "text-[#3F65FD]" : "text-white",
          type === "phone" ? "bg-white rounded-md" : "",
        )}
        onClick={() => setType("phone")}
      >
        Enter your Phone
      </button>
    </div>
  );
};

export default AuthTypeTabs;
