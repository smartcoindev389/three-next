"use client";
import clsx from "clsx";
import { FC } from "react";
import styles from "./index.module.scss";
import { Paragraph } from "shared/components/(main)/Paragraph";
import { Title2 } from "shared/components/(main)/title-2";
import { Blur } from "shared/components/(main)/blur";
import { data } from "./data/data";
import Image from "next/image";
type IHow = object;

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

export const How: FC<IHow> = () => {
  useGSAP(() => {
    const tl = gsap.timeline({
      defaults: {
        ease: "power2.out",
        duration: 1,
      },
      scrollTrigger: {
        trigger: `.${styles.How}`,
        start: "top center",
        end: "bottom bottom",
        toggleActions: "play none none none",
      },
    });

    const items = document.querySelectorAll(`.${styles.item}`);

    tl.from(`.${styles.blur}`, { yPercent: 100, opacity: 0 }, 0).from(
      `.${styles.blur} h2`,
      { xPercent: 50, opacity: 0 },
      0,
    );

    items?.forEach((item, i) => {
      const index = i * 0.25 + 0.5;
      tl.from(
        item.querySelector("img"),
        { rotate: 360, opacity: 0, scale: 0 },
        index,
      )
        .from(item.querySelector("h3"), { xPercent: -50, opacity: 0 }, index)
        .from(item, { yPercent: 100, opacity: 0 }, index)
        .from(
          item.querySelectorAll(`.char`),
          { yPercent: 100, opacity: 0, stagger: 0.01 },
          index,
        );
    });
  }, []);

  return (
    <section className={clsx(styles.How)}>
      <Blur isAnimation className={clsx(styles.blur)}>
        <Title2 title="How It Works?"></Title2>
        <div className={clsx(styles.items)}>
          {data.map((item, index) => (
            <div className={clsx(styles.item)} key={index}>
              <Image
                src={item.icon}
                alt={item.title}
                width={52}
                height={52}
              ></Image>
              <h3>{item.title}</h3>
              <Paragraph isBig text={item.text} />
            </div>
          ))}
        </div>
      </Blur>
    </section>
  );
};
