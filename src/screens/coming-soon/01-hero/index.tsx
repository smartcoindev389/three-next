"use client";
import clsx from "clsx";
import { FC } from "react";
import styles from "./index.module.scss";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);
import Image from "next/image";
import Logo from "./assets/logo.svg";
import Line from "./assets/line.png";
import { Paragraph } from "shared/components/(main)/Paragraph";

type IHero = object;

export const Hero: FC<IHero> = () => {
  useGSAP(() => {
    const tl = gsap.timeline({
      defaults: {
        ease: "power2.out",
        duration: 1,
      },
      scrollTrigger: {
        trigger: `.${styles.Hero}`,
        start: "top center",
        end: "bottom bottom",
        toggleActions: "play none none none",
      },
    });
    tl.fromTo(
      `.${styles.text} span`,
      {
        y: 30,
        opacity: 0,
        stagger: 0.25,
      },
      {
        y: 0,
        opacity: 1,
        stagger: 0.25,
      },
      0,
    )
      .from(
        `.${styles.title} span`,
        {
          y: 10,
          opacity: 0,
          stagger: 0.25,
          duration: 3,
        },
        1,
      )
      .to(
        `.${styles.Hero}`,
        {
          y: 10,
          "--opacity": 1,
          "--transform": 0,
          duration: 5,
        },
        1,
      )
      .fromTo(
        `.${styles.logo}`,
        {
          y: -20,
          opacity: 0,
          duration: 5,
        },
        {
          y: 0,
          opacity: 1,
          duration: 5,
        },
        1,
      )
      .to(
        `.${styles.title}`,
        {
          opacity: 1,
          duration: 3,
        },
        1,
      )
      .fromTo(
        `.${styles.line}`,
        {
          maskImage: "radial-gradient(circle at 0 0, #000 0%, transparent 0%)",
          duration: 3,
        },
        {
          maskImage: "radial-gradient(circle at 0 100%, #000 0%, #fff 100%)",
          duration: 3,
        },
        4,
      )
      .fromTo(
        `.${styles.bottom}`,
        {
          yPercent: 100,
          opacity: 0,
          duration: 2,
          ease: "sine.inOut",
        },
        {
          yPercent: 0,
          opacity: 1,
          duration: 2,
          ease: "sine.inOut",
        },
        2,
      );
    return () => {
      tl.kill();
    };
  }, []);

  return (
    <section className={clsx(styles.Hero)}>
      <Image src={Logo} alt="logo" className={clsx(styles.logo)} />
      <div className={clsx(styles.text)}>
        <span className={clsx(styles.span_1)}>We Build</span>
        <span className={clsx(styles.span_2)}>the Backbone</span>
        <span className={clsx(styles.span_3)}>of Bold Brands</span>
      </div>
      <h1 className={clsx(styles.title)}>
        <span data-text="Coming">
          <Image className={clsx(styles.line)} src={Line} alt="line"></Image>
          <b>Coming</b>
          <Image className={clsx(styles.line)} src={Line} alt="line"></Image>
        </span>
        <span>Soon</span>
      </h1>
      <div className={clsx(styles.bottom)}>
        <h2>Platformz is not just an agency</h2>
        <Paragraph text="We’re your end-to-end build partner, engineering enterprise-class infrastructure from the ground up. From premium pet tech like FUR4, to raw food delivery logistics for DMVRawFeeders.com, to customizable sports gear on Rockerz.com - we’ve built fully scalable ecosystems that drive results."></Paragraph>
      </div>
    </section>
  );
};
