import { FC } from "react";
import clsx from "clsx";
import styles from "../../index.module.scss";

interface IItem {
  date: string;
  name: string;
  text: string;
}

export const Item: FC<IItem> = ({ date, name, text }) => {
  return (
    <div className={clsx(styles.item)}>
      <span className={clsx(styles.date)}>{date}</span>
      <h4 className={clsx(styles.name)}>{name}</h4>
      <p className={clsx(styles.text)}>{text}</p>
    </div>
  );
};
