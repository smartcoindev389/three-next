"use client";
import clsx from "clsx";
import { FC } from "react";
import styles from "./index.module.scss";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);
import { Paragraph } from "shared/components/(main)/Paragraph";
import Link from "next/link";
import SvgIcon from "./svg";

type IAt = object;

export const At: FC<IAt> = () => {
  useGSAP(() => {
    const tl = gsap.timeline({
      defaults: {
        ease: "power2.out",
        duration: 2,
      },
      scrollTrigger: {
        trigger: `.${styles.At}`,
        start: "top center",
        end: "bottom bottom",
        toggleActions: "play none none none",
      },
    });
    tl.from(`.${styles.At} p`, { y: 30, opacity: 0 }, 0)
      .from(`.${styles.span_1}`, { y: 30, opacity: 0 }, 1)
      .from(`.${styles.span_2}`, { y: 30, opacity: 0 }, 2)
      .from(`.${styles.span_3}`, { y: 30, opacity: 0 }, 3)
      .from(`.${styles.link}`, { y: 30, opacity: 0 }, 4)
      .from(`.${styles.line}`, { width: 0, opacity: 0 }, 0)
      .from(`.${styles.At} svg`, { opacity: 0 }, 0);
    return () => {
      tl.kill();
    };
  }, []);

  return (
    <section className={clsx(styles.At)}>
      <SvgIcon></SvgIcon>
      <h2>
        At <b>Platformz,</b>
      </h2>
      <Paragraph
        isBig
        text="every system we build is modular, owner-controlled, and ready to scale globally."
      ></Paragraph>
      <div className={clsx(styles.line)}></div>
      <span className={clsx(styles.span_1)}>don’t just launch websites</span>
      <span className={clsx(styles.span_2)}>we engineer ecosystems</span>
      <span className={clsx(styles.span_3)}>
        that make your team faster, leaner, and more profitable.
      </span>
      <Link className={clsx(styles.link)} href="mailto:info@platformz.us">
        For any queries please email us at <b>info@platformz.us</b>
      </Link>
    </section>
  );
};
