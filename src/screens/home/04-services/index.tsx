"use client";
import clsx from "clsx";
import { FC } from "react";
import styles from "./index.module.scss";
import { Item } from "./ui/Item";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);
import { Socials } from "shared/components/(main)/socials";

type IServices = {
  title?: string;
  items?: { description?: string; title?: string }[];
};

export const Services: FC<{ services: IServices }> = ({ services }) => {
  const title = services?.title || "services";
  const items = services?.items || [];
  
  useGSAP(() => {
    const tl = gsap.timeline({
      defaults: {
        ease: "power1.out",
        duration: 2,
      },
      scrollTrigger: {
        trigger: `.${styles.Services}`,
        start: "top center",
        end: "bottom bottom",
        toggleActions: "play none none none",
        scrub: 3,
      },
    });

    tl.from(`.${styles.title}`, { yPercent: -100, opacity: 0 }, 0)
      .from(`.${styles.content}`, { borderColor: "transparent" }, 0)
      .from(
        `.${styles.Services} .item`,
        { yPercent: 100, opacity: 0, stagger: 1 },
        1,
      )
      .from(`.${styles.Services} .item .title`, { x: -250, stagger: 1 }, 1)
      .from(
        `.${styles.before}`,
        {
          opacity: 0,
          scale: 0,
          transformOrigin: "bottom right",
          duration: 8,
          ease: "back.out(1.7)",
        },
        2,
      );
  }, []);

  return (
    <section className={clsx(styles.Services, "shake")}>
      <div className={clsx(styles.aside)}>
        <Socials className={clsx(styles.socials)} />
        <div className={clsx(styles.dot)}></div>
        <div className={clsx(styles.text)}>
          <h4>let&apos;s work together</h4>
        </div>
      </div>
      <div className={clsx(styles.content)}>
        <h2 className={clsx(styles.title)}>{title}</h2>
        {items.map((item: { description?: string; title?: string }, i: number) => (
          <Item
            isLast={i === items.length - 1}
            key={i}
            text={item?.description || ""}
            title={item?.title || ""}
          />
        ))}
        <div className={clsx(styles.before)}></div>
      </div>
    </section>
  );
};
