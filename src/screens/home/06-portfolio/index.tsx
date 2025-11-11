"use client";
import clsx from "clsx";
import { FC, useEffect } from "react";
import styles from "./index.module.scss";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);
import { IStrapiImage } from "interfaces/strapi";
import { chunkArray } from "utils/chunkArray";
import { PortfolioItem } from "./PortfolioItem";

export interface IPortfolioItemProps {
  title?: string;
  description?: string;
  image?: IStrapiImage;
  link?: string;
}

export interface IPortfolioProps {
  title?: string;
  description?: string;
  items?: IPortfolioItemProps[];
}

export const Portfolio: FC<{ portfolio: IPortfolioProps }> = ({ portfolio }) => {
  const title = portfolio?.title || "Our Portfolio";
  const description = portfolio?.description || "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.";
  const items = portfolio?.items || [];

  useGSAP(() => {
    const tl = gsap.timeline({
      defaults: {
        ease: "power2.out",
        duration: 2,
      },
      scrollTrigger: {
        trigger: `.${styles.Portfolio}`,
        start: "top+=25% bottom",
        end: "bottom bottom",
        toggleActions: "play none none none",
      },
    });

    tl.from(`.${styles.Portfolio} h2`, { xPercent: 100, opacity: 0 }, 0)
      .from(
        `.${styles.Portfolio} .description`,
        { xPercent: -100, opacity: 0 },
        0,
      )
      .from(
        `.${styles.beforeVisible}`,
        { opacity: 0, duration: 8, ease: "back.out(1.7)" },
        0,
      );

    document.querySelectorAll(`.${styles.item}`).forEach((item, index) => {
      tl.from(
        item,
        { xPercent: index % 2 === 0 ? -100 : 100, opacity: 0 },
        0.25 * index,
      )
        .from(
          item.querySelector(`.${styles.name}`),
          { yPercent: -100, opacity: 0 },
          0.5 * index,
        )
        .from(
          item.querySelector(`.${styles.text}`),
          { yPercent: 100, opacity: 0 },
          0.5 * index,
        );
    });
  }, []);

  useEffect(() => {
    const beforeHidden = document.querySelector(
      `.${styles.beforeHidden}`,
    ) as HTMLDivElement;
    const beforeVisible = document.querySelector(
      `.${styles.beforeVisible}`,
    ) as HTMLDivElement;
    function getDistanceFromTop(element: HTMLElement) {
      let distance = 0;
      let currentElement: HTMLElement = element;

      while (currentElement) {
        distance += currentElement.offsetTop;
        currentElement = currentElement.offsetParent as HTMLElement;
      }

      return distance;
    }
    const beforeHiddenOffsetTop = getDistanceFromTop(beforeHidden);
    beforeVisible.style.top = `${beforeHiddenOffsetTop}px`;
    beforeVisible.style.display = "block";
  }, []);

  return (
    <>
      <div
        style={{ display: "none" }}
        className={clsx(styles.before, styles.beforeVisible)}
      ></div>
      <section className={clsx(styles.Portfolio, "shake")}>
        <h2 className={clsx("title-2")}>{title}</h2>
        <p className="description">{description}</p>
        {chunkArray(items, 4).map((item, index: number) => (
          <div key={index} className={clsx(styles.items)}>
            {item?.length &&
              item.map((item, i) => (
                <PortfolioItem key={`${portfolio.title}-${index}-${i}`} item={item} />
              ))}
          </div>
        ))}
        <div className={clsx(styles.before, styles.beforeHidden)}></div>
      </section>
    </>
  );
};
