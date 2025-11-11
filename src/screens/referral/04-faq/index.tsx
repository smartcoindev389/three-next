"use client";
import clsx from "clsx";
import styles from "./index.module.scss";
import { Paragraph } from "shared/components/(main)/Paragraph";
import { FC } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);
type IFaq = object;
import { Title2 } from "shared/components/(main)/title-2";
import { useGSAP } from "@gsap/react";
import { Item } from "./ui/Item";

export const Faq: FC<IFaq> = () => {
  useGSAP(() => {
    const tl = gsap.timeline({
      defaults: {
        ease: "power3.inOut",
        duration: 1,
      },
      scrollTrigger: {
        trigger: `.${styles.Faq}`,
        start: "top center",
        toggleActions: "play none none none",
      },
    });

    tl.fromTo(
      `.${styles.Faq} .${styles.top} h2`,
      {
        opacity: 0,
        yPercent: 50,
      },
      { opacity: 1, yPercent: 0 },
      0,
    )
      .fromTo(
        `.${styles.Faq} .${styles.top} p`,
        {
          opacity: 0,
          yPercent: 50,
        },
        { opacity: 1, yPercent: 0 },
        0.2,
      )
      .fromTo(
        `.${styles.items} > *`,
        {
          opacity: 0,
          yPercent: 50,
          stagger: 0.2,
        },
        { opacity: 1, yPercent: 0, stagger: 0.2 },
        0.2,
      );
  }, []);

  return (
    <section className={clsx(styles.Faq)}>
      <div className={clsx(styles.top)}>
        <Title2 title="FAQ"></Title2>
        <Paragraph text="LLorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book."></Paragraph>
      </div>
      <div className={clsx(styles.items)}>
        {new Array(10).fill(0).map((_, i) => {
          return (
            <Item
              key={i}
              title={`Lorem ipsum dolor sit amet consectetur. Consequat ut ultrices proin sit. Nunc enim scelerisque scelerisque viverra purus? ${i + 1}`}
              text={`Lorem ipsum dolor sit amet consectetur. Consequat ut ultrices proin sit. Nunc enim scelerisque scelerisque viverra purus Lorem ipsum dolor sit amet consectetur. Consequat ut ultrices proin sit. Nunc enim scelerisque scelerisque viverra purus? Lorem ipsum dolor sit amet consectetur. Consequat ut ultrices proin sit. Nunc enim scelerisque scelerisque viverra purus? ${i + 1}`}
            />
          );
        })}
      </div>
    </section>
  );
};
