"use client";
import clsx from "clsx";
import { FC } from "react";
import styles from "./index.module.scss";
import { Paragraph } from "shared/components/(main)/Paragraph";
import { Button } from "shared/components/(main)/button";
type IHero = object;

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

import { Chars } from "utils/chars";

export const Hero: FC<IHero> = () => {
  useGSAP(() => {
    const tl = gsap.timeline({
      defaults: {
        ease: "power2.inOut",
        duration: 1,
      },
      scrollTrigger: {
        trigger: `.${styles.Hero}`,
        start: "top+=20% center",
        end: "bottom bottom",
        toggleActions: "play none none none",
      },
    });

    tl.from(
      `.${styles.Hero} h1 .charBig`,
      { stagger: 0.15, opacity: 0, y: 50, x: 50 },
      0,
    )
      .from(
        `.${styles.Hero} .paragraph .char`,
        { yPercent: 50, opacity: 0, stagger: 0.01 },
        0,
      )
      .from(
        `.${styles.Hero} .button`,
        {
          yPercent: 200,
          opacity: 0,
          scale: 0,
          transformOrigin: "bottom center",
        },
        0,
      );
  }, []);
  return (
    <section className={clsx(styles.Hero)}>
      <div className={clsx(styles.content)}>
        <h1>
          <Chars str="Earn $5 for every person you Refer"></Chars>
        </h1>
        <Paragraph text="LLorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book." />
        <Button className={clsx(styles.button)} isBlueBtn>
          Get a link
        </Button>
      </div>
    </section>
  );
};
