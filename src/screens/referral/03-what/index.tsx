"use client";
import clsx from "clsx";
import { FC } from "react";
import styles from "./index.module.scss";
import { Title2 } from "shared/components/(main)/title-2";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);
import { useGSAP } from "@gsap/react";
import { Swiper, SwiperSlide } from "swiper/react";
type IWhat = object;
import { Item } from "./ui/Item";
import { dataItems } from "./data/dataItems";
import { Pagination } from "swiper/modules";
import "swiper/css/pagination";

export const What: FC<IWhat> = () => {
  useGSAP(() => {
    const tl = gsap.timeline({
      defaults: {
        ease: "power2.out",
        duration: 1,
      },
      scrollTrigger: {
        trigger: `.${styles.What}`,
        start: "top center",
        end: "bottom bottom",
        toggleActions: "play none none none",
      },
    });
    tl.from(`.${styles.What}`, { opacity: 0 }, 0).from(
      `.${styles.What} h2`,
      { opacity: 0, x: 100 },
      0,
    );
  }, []);

  return (
    <section className={clsx(styles.What)}>
      <Title2 title="What Others Say"></Title2>
      <Swiper
        modules={[Pagination]}
        className={clsx(styles.swiper)}
        spaceBetween={10}
        pagination={{ clickable: true }}
        slidesPerView={1}
        breakpoints={{
          768: {
            slidesPerView: 2,
            spaceBetween: 20,
          },
          1024: {
            slidesPerView: 3,
            spaceBetween: 40,
          },
        }}
      >
        {dataItems.length &&
          dataItems.map((item, index) => (
            <SwiperSlide key={index}>
              <Item {...item}></Item>
            </SwiperSlide>
          ))}
      </Swiper>
    </section>
  );
};
