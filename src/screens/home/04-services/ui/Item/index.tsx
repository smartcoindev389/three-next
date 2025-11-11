import clsx from "clsx";
import styles from "./index.module.scss";
import { FC, useEffect, useRef, useState } from "react";
import gsap from "gsap";

interface IItem {
  text: string;
  isLast?: boolean;
  title: string;
}

export const Item: FC<IItem> = ({ text, title, isLast }) => {
  const [visible, setVisible] = useState(false);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const itemRef = useRef<HTMLDivElement | null>(null);
  const EASE = "power4.inOut";
  const DURATION = 0.5;

  useEffect(() => {
    if (!contentRef.current) return;
    gsap.to(contentRef.current, {
      height: visible ? "auto" : 0,
      opacity: visible ? 1 : 0,
      duration: DURATION,
      ease: EASE,
      marginTop: visible ? 12 : 0,
    });
    if (itemRef.current?.querySelector(`.${styles.arrow}`)) {
      gsap.to(itemRef.current?.querySelector(`.${styles.arrow}`), {
        duration: DURATION,
        ease: EASE,
        rotate: visible ? 180 : 0,
      });
    }
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
      className={clsx(styles.item, "item", isLast && styles.last)}
      onClick={() => setVisible(!visible)}
    >
      <div className={clsx(styles.top)}>
        <h4 className={clsx(styles.title, "title")}>{title}</h4>
        <div className={clsx(styles.arrow, visible && styles.active)} />
      </div>
      <div ref={contentRef} className={clsx(styles.content)}>
        <p className={clsx(styles.text)}>{text}</p>
      </div>
    </div>
  );
};
