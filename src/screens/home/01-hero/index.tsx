"use client";
import clsx from "clsx";
import { FC } from "react";
import styles from "./index.module.scss";
import { Paragraph } from "shared/components/(main)/Paragraph";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);
import { Socials } from "shared/components/(main)/socials";

type IHero = {
  title?: string;
  description?: string;
  isLittle?: boolean;
  isCenter?: boolean;
};

export const Hero: FC<{hero: IHero}> = ({
  hero,
}) => {
  const title = hero?.title || "Platformz";
  const description = hero?.description || "";
  const isLittle = hero?.isLittle || false;
  const isCenter = hero?.isCenter || false;
  useGSAP(() => {
    const tl = gsap.timeline({
      defaults: {
        ease: "power2.out",
        duration: 1,
      },
    });
    tl.to(
      `.${styles.Hero} h1`,
      {
        x: 0,
        opacity: 1,
        duration: isCenter ? 5 : 1,
      },
      0,
    )

      .to(
        `.${styles.Hero} p`,
        {
          y: 0,
          opacity: 1,
        },
        0,
      )

      .to(
        `.${styles.Hero} .icon img`,
        {
          scale: 1,
          stagger: {
            from: "end",
            amount: 0.5,
          },
        },
        0,
      )

      .from(
        `.${styles.scroll}`,
        {
          yPercent: 100,
          opacity: 0,
        },
        1,
      );

    const tl2 = gsap
      .timeline({
        scrollTrigger: {
          trigger: `.${styles.Hero}`,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      })
      .to(
        `.${styles.scrollBar} span`,
        {
          top: "75%",
        },
        0,
      );

    return () => {
      tl.kill();
      tl2.kill();
    };
  }, [isCenter]);
  return (
    <section
      className={clsx(
        styles.Hero,
        "shake",
        isLittle && styles.little,
        isCenter && styles.isCenter,
      )}
    >
      <div className={clsx(styles.container)}>
        <h1>{title}</h1>
        <Paragraph includeChars={false} text={description} />
        <span className={styles.scroll}>just scrolling</span>
        <Socials className={styles.socials} zero />
        <div className={styles.scrollBar}>
          <span></span>
        </div>
      </div>
    </section>
  );
};
