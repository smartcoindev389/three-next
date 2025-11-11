import clsx from "clsx";
import styles from "./index.module.scss";
import { FC, useEffect, useRef, useState } from "react";
import gsap from "gsap";
// import {DecryptedText} from "shared/components/DecryptedText";

interface IItem {
  text: string;
  title: string;
}

export const Item: FC<IItem> = ({ text, title }) => {
  const [visible, setVisible] = useState(false);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const itemRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!contentRef.current) return;
    gsap.to(contentRef.current, {
      height: visible ? "auto" : 0,
      opacity: visible ? 1 : 0,
      duration: 0.5,
      ease: "power4.inOut",
      marginTop: visible ? 12 : 0,
    });
  }, [visible]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (itemRef.current && !itemRef.current.contains(e.target as Node)) {
        setVisible(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div
      ref={itemRef}
      className={clsx(styles.item)}
      onClick={() => setVisible(!visible)}
    >
      <div className={clsx(styles.top)}>
        <h4 className={clsx(styles.title)}>{title}</h4>
        <div className={clsx(styles.icon, visible && styles.active)} />
      </div>
      <div ref={contentRef} className={clsx(styles.content)}>
        <p className={clsx(styles.text)}>
          {/* <DecryptedText
            trigger={visible}
            text={text}
            speed={80}
            maxIterations={20}
          /> */}
          {text}
        </p>
      </div>
    </div>
  );
};
