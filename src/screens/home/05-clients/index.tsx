"use client";
import clsx from "clsx";
import { FC } from "react";
import styles from "./index.module.scss";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);
import Image from "next/image";
import { strapi } from "@/lib/strapi/strapi";
import { IStrapiImage } from "interfaces/strapi";

type IClients = {
  title?: string;
  description?: string;
  items?: { name?: string; logo?: IStrapiImage; }[];
};

export const Clients: FC<{ clients: IClients }> = ({ clients }) => {
  const title = clients?.title || "Our clients";
  const description = clients?.description || "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.";
  const items = clients?.items || [];
  
  useGSAP(() => {
    const tl = gsap.timeline({
      defaults: {
        ease: "power2.out",
        duration: 2,
      },
      scrollTrigger: {
        trigger: `.${styles.Clients}`,
        start: "center center",
        end: "bottom bottom",
        toggleActions: "play none none none",
      },
    });

    tl.from(
      `.${styles.items} img`,
      { yPercent: 100, opacity: 0, stagger: 0.1 },
      0,
    )
      .from(`.${styles.Clients} h2`, { xPercent: 100, opacity: 0 }, 0)
      .from(
        `.${styles.Clients} .description`,
        { xPercent: -100, opacity: 0 },
        0,
      );
  }, []);
  return (
    <section className={clsx(styles.Clients, "shake")}>
      <h2 className={clsx("title-2")}>{title}</h2>
      <p className="description">{description}</p>
      <div className={clsx(styles.items)}>
        {items?.length &&
          items.map((item: { name?: string; logo?: IStrapiImage; }, index: number) => (
            <Image
              key={index}
              src={item?.logo?.url ? strapi.getStrapiMediaUrl(item.logo.url) : "/assets/home/05-clients/logo-1.svg"}
              alt={item?.logo?.alternativeText || item?.name || "Client logo"}
              width={item?.logo?.width || 100}
              height={item?.logo?.height || 100} 
            ></Image>
          ))}
      </div>
    </section>
  );
};
