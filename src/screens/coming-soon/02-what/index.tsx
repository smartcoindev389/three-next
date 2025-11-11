"use client";
import clsx from "clsx";
import { FC, Fragment } from "react";
import styles from "./index.module.scss";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);
import Image from "next/image";
import { Paragraph } from "shared/components/(main)/Paragraph";
import { items } from "./data/data";

function halfArray<T>(array: T[]): T[][] {
  const oddItems = [];
  const evenItems = [];

  for (let i = 0; i < array.length; i++) {
    if (i % 2 === 0) {
      evenItems.push(array[i]);
    } else {
      oddItems.push(array[i]);
    }
  }
  return [evenItems, oddItems];
}

type IWhat = object;

export const What: FC<IWhat> = () => {
  useGSAP(() => {
    const tl = gsap.timeline({
      defaults: {
        ease: "power1.out",
        duration: 1,
      },
      scrollTrigger: {
        trigger: `.${styles.What}`,
        start: "top center",
        end: "bottom bottom",
        toggleActions: "play none none none",
      },
    });
    tl.fromTo(
      `.${styles.item}`,
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
      1,
    )
      .from(
        `.${styles.line}`,
        { height: 0, duration: 1, ease: "power1.out", opacity: 0 },
        1,
      )
      .fromTo(
        `.${styles.What} h2`,
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
      );
    return () => {
      tl.kill();
    };
  }, []);

  return (
    <section className={clsx(styles.What)}>
      <h2>What We Do</h2>
      <div className={clsx(styles.content)}>
        {halfArray(items).map((item, index) => (
          <Fragment key={index}>
            <div className={clsx(styles.items, styles[`items-${index}`])}>
              {item.map((item, i) => (
                <div className={clsx(styles.item)} key={i}>
                  <div className={clsx(styles.top)}>
                    <Image
                      src={item.icon}
                      alt={`${item.title}`}
                      width={48}
                      height={48}
                      className={clsx(styles.icon)}
                    />
                    <h3 className={clsx(styles.title)}>{item.title}</h3>
                  </div>
                  <Paragraph
                    text={item.text}
                    className={clsx(styles.text)}
                  ></Paragraph>
                </div>
              ))}
            </div>
            {index === 0 ? <div className={clsx(styles.line)}></div> : null}
          </Fragment>
        ))}
      </div>
    </section>
  );
};
