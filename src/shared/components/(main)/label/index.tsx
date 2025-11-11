import clsx from "clsx";
import { FC, PropsWithChildren, useRef } from "react";
import styles from "./index.module.scss";

interface ILabel {
  className?: string;
  children: React.ReactNode;
}

export const Label: FC<PropsWithChildren<ILabel>> = ({
  children,
  className,
}) => {
  const refRoot = useRef<HTMLDivElement>(null);

  return (
    <div className={clsx(styles.label, className, "label")} ref={refRoot}>
      <span>{children}</span>
    </div>
  );
};
