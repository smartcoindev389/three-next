"use client";
import clsx from "clsx";
import { FC } from "react";
import styles from "./index.module.scss";
import { Paragraph } from "shared/components/(main)/Paragraph";
type IAmbition = {
  description?: string;
};
import { Chars } from "utils/chars";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

export const Text: FC<{ambition: IAmbition}> = ({ ambition }) => {
  const description = ambition?.description || "We combine technical expertise and strategic vision to deliver customized solutions that optimize your operations.";

  useGSAP(() => {
    const tl = gsap.timeline({
      defaults: {
        ease: "power2.out",
        duration: 1,
      },
      scrollTrigger: {
        trigger: `.${styles.Text}`,
        start: "top center",
        end: "bottom bottom",
        toggleActions: "play none none none",
      },
    });
    tl.from(`.${styles.Text} h2 .char`, { opacity: 0, stagger: 0.01 }, 0).from(
      `.${styles.content} p .charBig`,
      { yPercent: 100, opacity: 0, stagger: 0.1 },
      0,
    );
  }, []);
  return (
    <>
      <section className={clsx(styles.Text, "shake")}>
        <h2 className={clsx("title-2")}>
          <Chars
            str={`<span>Let&apos;s turn your ambitions</span>into inspiring standards with the <b className='${clsx("color")}'>best technology</b> available`}
          ></Chars>
        </h2>
        <div className={clsx(styles.content)}>
          <Paragraph text={description}></Paragraph>
        </div>
      </section>
    </>
  );
};
