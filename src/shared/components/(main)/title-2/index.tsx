import clsx from "clsx";
import styles from "./index.module.scss";
import { FC } from "react";

interface Props {
  title: string;
}

export const Title2: FC<Props> = ({ title }) => {
  return <h2 className={clsx(styles.title)}>{title}</h2>;
};
