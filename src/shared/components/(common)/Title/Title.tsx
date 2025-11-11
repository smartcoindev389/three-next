import { FC, PropsWithChildren } from "react";

interface TitleProps extends PropsWithChildren {
  className?: string;
}

const Title: FC<TitleProps> = ({ children, className = "" }) => {
  return (
    <h3
      className={`text-blue font-din-condensed text-2xl md:text-3xl font-bold ${className}`}
    >
      {children}
    </h3>
  );
};

export default Title;
