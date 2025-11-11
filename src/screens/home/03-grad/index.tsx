"use client";
import clsx from "clsx";
import { FC } from "react";
import styles from "./index.module.scss";
import { Paragraph } from "shared/components/(main)/Paragraph";
import Link from "next/link";
import { Button } from "shared/components/(main)/button";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);
import { Chars } from "utils/chars";
import Image from "next/image";

type IExpertise = {
  title?: string;
  description?: string;
  button?: string;
};

export const Grad: FC<{ expertise: IExpertise }> = ({ expertise }) => {
  const title = expertise?.title || "Our expertise at your fingertips";
  const description = expertise?.description || "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.";
  const button = expertise?.button || "let's work together";

  useGSAP(() => {
    const tl = gsap.timeline({
      defaults: {
        ease: "power2.out",
        duration: 1,
      },
      scrollTrigger: {
        trigger: `.${styles.Grad}`,
        start: "top center",
        end: "bottom bottom",
        toggleActions: "play none none none",
      },
    });

    tl.from(
      `.${styles.Grad} h2 .char`,
      { yPercent: 100, opacity: 0, stagger: { amount: 0.25, from: "center" } },
      0,
    )
      .from(`.${styles.Grad} p`, { yPercent: 100, opacity: 0 }, 0)
      .from(
        `.${styles.Grad} .button`,
        {
          yPercent: 100,
          opacity: 0,
          rotate: 90,
          ease: "back.out(1.7)",
          scale: 1.4,
        },
        0,
      );
  }, []);
  return (
    <section className={clsx(styles.Grad, "shake")}>
      <Image
        className={clsx(styles.image)}
        src="/assets/home/03-grad/grad.png"
        alt="image"
        width={1920}
        height={2000}
      ></Image>
      <h2 className={clsx("title-2")}>
        <Chars str={title} isSpace></Chars>
      </h2>
      <Paragraph
        includeChars={false}
        text={description}
      ></Paragraph>
      <Link href="/contact" className={styles.buttonLink}><Button>{button}</Button></Link>
    </section>
  );
};
