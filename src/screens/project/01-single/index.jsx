"use client";
import { Suspense, useState, useEffect } from "react";
import clsx from "clsx";
import { Canvas } from "@react-three/fiber";
import styles from "./index.module.scss";
import styleScene from "@/shared/components/(main)/ThreeScene/style.module.scss";
import NebulaV2 from "@/shared/components/(main)/ThreeScene/Nebula/v2";
import MovingLightV2 from "@/shared/components/(main)/ThreeScene/MovingLight/v2";
import CursorTrail from "@/shared/components/(main)/ThreeScene/CursorTrail";
import { useResponsiveFov } from "@/hooks/use-responsive-fov";
import { CursorParticlesImage } from "./ui/CursorParticlesImage";
import { Paragraph } from "shared/components/(main)/Paragraph";
import { gsap } from "gsap";
import { Blur } from "shared/components/(main)/blur";
import { BigLink } from "./ui/BigLink";
import { strapi } from "@/lib/strapi/strapi";
import { useResponsiveImageSize } from "@/hooks/useResponsiveImageSize";

import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

export function Single({ project, nextProjectSlug }) {
  const fov = useResponsiveFov();
  const [animated, setAnimated] = useState(false);

  // Map Strapi data to component expectations
  const projectData = {
    ...project,
    heroImage: project?.visual,
    heroImage2: project?.visual2,
    descriptionImage: project?.description_visual,
    bannerImage: project?.visual4,
    title: project?.title || project?.name,
  };

  // Generate image URLs
  const heroImageUrl = projectData.heroImage?.url
    ? strapi.getStrapiMediaUrl(projectData.heroImage.url)
    : "/assets/projects/unsplash_Zw2nRt2z5f0 (1).png";
  const heroImage2Url = projectData.heroImage2?.url
    ? strapi.getStrapiMediaUrl(projectData.heroImage2.url)
    : "/assets/projects/unsplash_Zw2nRt2z5f0 (1).png";
  const descriptionImageUrl = projectData.descriptionImage?.url
    ? strapi.getStrapiMediaUrl(projectData.descriptionImage.url)
    : "/assets/projects/unsplash_Zw2nRt2z5f0 (1).png";
  const bannerImageUrl = projectData.bannerImage?.url
    ? strapi.getStrapiMediaUrl(projectData.bannerImage.url)
    : "/assets/projects/unsplash_Zw2nRt2z5f0 (1).png";

  // Use responsive image dimensions based on viewport
  const { width: imageWidth, height: imageHeight } = useResponsiveImageSize(
    'projectHero',
    projectData.heroImage?.width,
    projectData.heroImage?.height
  );
  const { width: heroImage2Width, height: heroImage2Height } = useResponsiveImageSize(
    'projectHero2',
    projectData.heroImage2?.width,
    projectData.heroImage2?.height
  );
  const { width: descriptionImageWidth, height: descriptionImageHeight } = useResponsiveImageSize(
    'projectDescription',
    projectData.descriptionImage?.width,
    projectData.descriptionImage?.height
  );
  const { width: bannerImageWidth, height: bannerImageHeight } = useResponsiveImageSize(
    'projectBanner',
    projectData.bannerImage?.width,
    projectData.bannerImage?.height
  );

  const ambient = {
    color: "#5500aa",
    intensity: 50,
  };

  useEffect(() => {
    setTimeout(() => {
      setAnimated(true);
    }, 1000);
  }, []);

  const startAnimation = () => {
    const blurElements = document.querySelectorAll(`.${styles.Single} .blur`);
    if (blurElements.length === 0) return;

    blurElements?.forEach((element, index) => {
      const xRange = 15 + Math.random() * 40;
      const yRange = 10 + Math.random() * 30;
      const duration = 3 + Math.random() * 2;
      const delay = index * 0.5;

      gsap.fromTo(
        element,
        {
          "--x": "0px",
          "--y": "0px",
          "--opacity": "1",
          x: 0,
          y: 0,
        },
        {
          "--x": `${-xRange}px`,
          "--y": `${-yRange}px`,
          x: `${-xRange / 6}px`,
          y: `${-yRange / 6}px`,
          "--opacity": "0",
          duration: duration,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
          delay: delay,
        },
      );

      gsap.to(element, {
        "--y": `${yRange}px`,
        duration: duration * 0.7,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
        delay: delay + duration * 0.3,
      });
    });
  };

  useEffect(() => {
    const tl = gsap.timeline({
      defaults: {
        ease: "power2.out",
        duration: 1,
      },
      scrollTrigger: {
        trigger: `.${styles.Single}`,
        start: "top top",
        end: "bottom bottom",
      },
    });

    tl.fromTo(
      `.blur`,
      { opacity: 0, stagger: 0.25 },
      { x: 0, y: 0, opacity: 1, stagger: 0.25 },
      0,
    )
      .fromTo(
        `.${styles.Info}`,
        { y: 100, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.25 },
        0,
      )
      .fromTo(
        `.${styles.Wrapper}`,
        { y: 100, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.25, onComplete: startAnimation },
        0,
      );

    const tl2 = gsap.timeline({
      defaults: {
        ease: "power2.out",
        duration: 1,
        stagger: {
          amount: 0.25,
          from: "center",
        },
      },
      scrollTrigger: {
        trigger: `.link-next`,
        start: "top center",
      },
    });

    tl2.fromTo(
      `.link-next .char`,
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1 },
      0,
    );
  }, []);

  return (
    <section className={clsx(styles.Single)}>
      <Canvas
        camera={{ position: [0, 0, 40], fov }}
        className={clsx(styleScene.scene)}
      >
        <ambientLight color={ambient.color} intensity={ambient.intensity} />
        <MovingLightV2 />
        <Suspense fallback={null}>
          <directionalLight position={[5, 10, 5]} intensity={1} />
          <NebulaV2
            enableMouse={true}
            enableSway={false}
            triggerExplosion={animated}
          />
        </Suspense>
        <CursorTrail />
      </Canvas>
        <div className={styles.Content}>
          <Blur className={styles.image}>
            <CursorParticlesImage
              src={heroImageUrl}
              alt={projectData.title}
              width={imageWidth}
              height={imageHeight}
            />
          </Blur>
          <div className={styles.Info}>
            <Blur className={styles.blur1}>
              <CursorParticlesImage
                src={heroImage2Url}
                alt={projectData.title}
                width={heroImage2Width}
                height={heroImage2Height}
              />
            </Blur>
          </div>
          <div className={styles.Wrapper}>
            <div className={styles.Text}>
              <h2>{projectData.title || projectData.name}</h2>
              <Paragraph
                isBig
                includeChars={false}
                text={
                  projectData.description || "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy"
                }
              ></Paragraph>
            </div>
            <Blur className={clsx(styles.blur2)}>
              <CursorParticlesImage
                src={descriptionImageUrl}
                alt={projectData.title}
                width={descriptionImageWidth}
                height={descriptionImageHeight}
              />
            </Blur>
          </div>
          <Blur className={clsx(styles.blur3)}>
            <CursorParticlesImage
              src={bannerImageUrl}
              alt={projectData.title}
              width={bannerImageWidth}
              height={bannerImageHeight}
            />
          </Blur>
        <div className={clsx(styles.GridText)}>
          <Paragraph
            isBig
            includeChars={false}
            text={
              projectData.left_description || "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries,"
            }
          ></Paragraph>
          <Paragraph
            isBig
            includeChars={false}
            text={
              projectData.right_description || "but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."
            }
          ></Paragraph>
        </div>
        {nextProjectSlug && (
          <BigLink href={`/projects/${nextProjectSlug}`} text="next project" />
        )}
        {!nextProjectSlug && (
          <BigLink href="/projects" text="view all projects" />
        )}
      </div>
    </section>
  );
}
