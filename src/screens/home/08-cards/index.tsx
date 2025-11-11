"use client";
import clsx from "clsx";
import { FC } from "react";
import Image from "next/image";
import styles from "./index.module.scss";
import { Paragraph } from "shared/components/(main)/Paragraph";
import { useGSAP } from "@gsap/react";
import { Swiper, SwiperSlide } from "swiper/react";
import { IStrapiImage } from "interfaces/strapi";
import { strapi } from "@/lib/strapi/strapi";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

type ICards = {
  title?: string;
  description?: string;
  items?: { image?: IStrapiImage; title?: string; description?: string }[];
};

gsap.registerPlugin(ScrollTrigger);

export const Cards: FC<{innovation: ICards}> = ({ innovation }) => {
  const title = innovation?.title || "A collective of talents dedicated to innovation";
  const description = innovation?.description || "We collaborate with hundreds of expert developers and agencies worldwide to deliver the highest quality work at competitive offshore rates. ";
  const items = innovation?.items || [];
  useGSAP(() => {
    const tl = gsap.timeline({
      defaults: {
        ease: "power2.out",
        duration: 2,
      },
      scrollTrigger: {
        trigger: `.${styles.Cards}`,
        start: "top center",
        end: "bottom bottom",
        toggleActions: "play none none none",
      },
    });
    tl.from(`.${styles.top} h2`, { xPercent: 100, opacity: 0 }, 0)
      .from(`.${styles.top} p`, { xPercent: -100, opacity: 0 }, 0)
      .from(
        `.${styles.item}`,
        { yPercent: 100, opacity: 0, stagger: 0.25, rotate: 10, scale: 0 },
        0,
      );
  }, []);
  return (
    <section className={clsx(styles.Cards, "shake")}>
      <div className={clsx(styles.top)}>
        <h2 className="title-2">
          {title}
        </h2>
        <Paragraph text={description}></Paragraph>
      </div>
      <Swiper
        slidesPerView={1}
        spaceBetween={10}
        className={clsx(styles.swiper)}
        breakpoints={{
          1024: {
            slidesPerView: 4,
          },
          768: {
            slidesPerView: 3,
          },
          640: {
            slidesPerView: 2,
          },
          320: {
            slidesPerView: 1,
          },
        }}
      >
        {items.map((item, i) => (
          <SwiperSlide key={i}>
            <div className={clsx(styles.item)}>
              <Image 
                src={item?.image?.url ? strapi.getStrapiMediaUrl(item.image.url) : "/assets/projects/preview.png"} 
                alt={item?.image?.alternativeText || item?.title || "Innovation card"} 
                width={item?.image?.width || 400} 
                height={item?.image?.height || 600} 
                className={clsx(styles.image)}
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};
