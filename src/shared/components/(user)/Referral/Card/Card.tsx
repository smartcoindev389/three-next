import { FC, PropsWithChildren } from "react";

const Card: FC<PropsWithChildren<{ className?: string }>> = ({
  children,
  className = "",
}) => {
  return (
    <div
      className={`relative gap-4 rounded-sm bg-white p-5 shadow-sm ${className}`}
    >
      {children}
    </div>
  );
};

export default Card;
