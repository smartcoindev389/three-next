import clsx from "clsx";
import styles from "../../index.module.scss";
import { Blur } from "shared/components/(main)/blur";
import Link from "next/link";
import { FC } from "react";
import { Chars } from "utils/chars";

export const BigLink: FC<{ href: string; text: string }> = ({ href, text }) => {
  return (
    <Blur isBorder className={styles.bigLink}>
      <Link href={href} className={clsx("link-next")}>
        <span>
          <Chars str={text} />
        </span>
      </Link>
    </Blur>
  );
};
