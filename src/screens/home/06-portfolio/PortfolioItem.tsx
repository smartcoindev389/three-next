"use client";
import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";
import { strapi } from "@/lib/strapi/strapi";
import { useResponsiveImageSize } from "@/hooks/useResponsiveImageSize";
import styles from "./index.module.scss";
import { IPortfolioItemProps } from "./index";

export function PortfolioItem({ item }: { item: IPortfolioItemProps }) {
  const { width, height } = useResponsiveImageSize(
    'portfolio',
    item?.image?.width,
    item?.image?.height
  );
  
  return (
    <Link href={item.link || ""} className={clsx(styles.item)}>
      <Image
        src={item.image?.url ? strapi.getStrapiMediaUrl(item.image.url) : "/assets/home/06-portfolio/image.png"}
        alt={item.image?.alternativeText || item.title || "Project image"}
        width={width}
        height={height}
      ></Image>
      <h3 className={clsx(styles.name)}>{item.title || ""}</h3>
      <p className={clsx(styles.text)}>
        {item.description?.slice(0, 100) || ""}
      </p>
    </Link>
  );
}

