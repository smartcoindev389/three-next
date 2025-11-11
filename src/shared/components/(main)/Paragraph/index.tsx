import styles from "./styles.module.scss";
import clsx from "clsx";
import { FC } from "react";
import { Chars } from "utils/chars";

interface IParagraph {
  className?: string;
  text: string;
  includeChars?: boolean;
  isBig?: boolean;
}

export const Paragraph: FC<IParagraph> = ({
  className,
  text,
  includeChars = true,
  isBig,
}) => {
  return (
    <p
      className={clsx(
        styles.paragraph,
        className,
        "paragraph",
        isBig && styles.big,
      )}
    >
      {includeChars ? <Chars str={text}></Chars> : text}
    </p>
  );
};
