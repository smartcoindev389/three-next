"use client";

import clsx from "clsx";
import Image from "next/image";
import styles from "./index.module.scss";
import Link from "next/link";
import { strapi } from "@/lib/strapi/strapi";
import { useResponsiveImageSize } from "@/hooks/useResponsiveImageSize";
import { normalizeStrapiImage } from "@/utils/strapiImageHelpers";

export default function ProjectCard({ project }) {
  // Normalize Strapi image shape
  const normalizedImage = normalizeStrapiImage(project.image, project.name);
  
  const imageUrl = normalizedImage.url
    ? strapi.getStrapiMediaUrl(normalizedImage.url) 
    : "/assets/projects/project.svg";

  // Use responsive image dimensions based on viewport
  const { width: imageWidth, height: imageHeight } = useResponsiveImageSize(
    'projectCard',
    normalizedImage.width,
    normalizedImage.height
  );

  return (
    <Link href={`/projects/${project.slug}`} className={styles.projectCard}>
      <Image 
        src={imageUrl}
        alt={normalizedImage.alternativeText} 
        width={imageWidth}
        height={imageHeight}
        quality={85}
        className="w-full h-auto"
        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, (max-width: 1440px) 50vw, 33vw"
      />
      <div className={clsx(styles["project-info"])}>
        <span className={clsx(styles.title)}>{project.name}</span>
        <span className={clsx(styles.description)}>{project.short_bio || project.description}</span>
      </div>
    </Link>
  );
}
