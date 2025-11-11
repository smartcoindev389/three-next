"use client";
import React, { Suspense, useState, useEffect, useMemo, useCallback } from "react";
import clsx from "clsx";
import { Canvas } from "@react-three/fiber";
import styles from "./index.module.scss";
import styleScene from "@/shared/components/(main)/ThreeScene/style.module.scss";
import NebulaV2 from "@/shared/components/(main)/ThreeScene/Nebula/v2";
import MovingLightV2 from "@/shared/components/(main)/ThreeScene/MovingLight/v2";
import CursorTrail from "@/shared/components/(main)/ThreeScene/CursorTrail";
import { useResponsiveFov } from "@/hooks/use-responsive-fov";
import { Paragraph } from "shared/components/(main)/Paragraph";
import { gsap } from "gsap";
import { Blur } from "shared/components/(main)/blur";
import { CursorParticlesImage } from "@/screens/project/01-single/ui/CursorParticlesImage";
import { dataTexts } from "./data/dataTexts";
import { BigLink } from "../../project/01-single/ui/BigLink";
import { strapi } from "@/lib/strapi/strapi";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

// Memoized image component to prevent unnecessary re-renders
const MemoizedCursorParticlesImage = React.memo(({ src, alt, width, height }) => (
  <CursorParticlesImage
    src={src}
    alt={alt}
    width={width}
    height={height}
  />
));

export function Single({ service, nextServiceSlug }) {
  const fov = useResponsiveFov();
  const [animated, setAnimated] = useState(false);

  const ambient = useMemo(() => ({
    color: "#5500aa",
    intensity: 50,
  }), []);

  useEffect(() => {
    setTimeout(() => {
      setAnimated(true);
    }, 1000);
  }, []);

  const startAnimation = useCallback(() => {
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
  }, []);

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
      `.${styles.Single} .blur`,
      { opacity: 0, stagger: 0.25 },
      { x: 0, y: 0, opacity: 1, stagger: 0.25 },
      0,
    ).fromTo(
      `.${styles.Text}`,
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
  }, [startAnimation]);

  // Memoize expensive calculations
  const processedSections = useMemo(() => {
    const sections = service?.sections || [];
    if (sections.length === 0) return null;
    
    // Calculate layout based on number of sections
    const renderIndexed = sections.length <= 3
      ? [[0], [1, 2]]
      : sections.length <= 6
        ? [[0], [1, 2, 3], [4, 5]]
        : [[0], [1, 2, 3], [4, 5, 6]];
    
    return { sections, renderIndexed };
  }, [service?.sections]);

  // Memoize gallery processing
  const processedGalleries = useMemo(() => {
    return {
      firstGallery: service?.first_gallery?.filter(gallery => 
        gallery && gallery.url && gallery.width && gallery.height
      ) || [],
      secondGallery: service?.second_gallery?.filter(gallery => 
        gallery && gallery.url && gallery.width && gallery.height
      ) || []
    };
  }, [service?.first_gallery, service?.second_gallery]);

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
      <div className={clsx(styles.Content)}>
        {service?.visual?.url && (
          <Blur className={styles.image}>
            <MemoizedCursorParticlesImage
              src={strapi.getStrapiMediaUrl(service.visual.url)}
              alt={service?.name || 'Service'}
              width={service.visual.width || 1920}
              height={service.visual.height || 1080}
            />
          </Blur>
        )}
        <Paragraph
          includeChars={false}
          text={service?.description || "At Platformz, we offer comprehensive services designed to bring your ideas to life."}
        />
        {processedSections && (() => {
          const { sections, renderIndexed } = processedSections;
          
          return renderIndexed.map((arr, sectionIndex) => {
            return (
              <div className={clsx(styles.Section)} key={sectionIndex}>
                {arr.map(i => {
                  if (!sections[i]) return null;
                  const isEven = i % 2 !== 0;
                  return (
                    <div
                      key={`${sectionIndex}-${i}`}
                      className={clsx(styles.Wrapper, isEven && styles.isEven)}
                    >
                      <div className={clsx(styles.Text)}>
                        <h2>{sections[i]?.title || "Title"}</h2>
                        <Paragraph includeChars={false} text={sections[i]?.description || "Text"} />
                      </div>
                      <Blur className={clsx(styles.blur)}>
                        {sections[i].visual && sections[i].visual.url && (
                          <MemoizedCursorParticlesImage
                            src={strapi.getStrapiMediaUrl(sections[i].visual.url)}
                            alt={sections[i]?.title || 'Section'}
                            width={sections[i].visual.width || 1920}
                            height={sections[i].visual.height || 1080}
                          />
                        )}
                      </Blur>
                    </div>
                  );
                })}
                {sectionIndex < renderIndexed.length - 1 && (
                  <div className={clsx(styles.Grid)}>
                    {(sectionIndex > 1 ? processedGalleries.firstGallery : processedGalleries.secondGallery).map((gallery, galleryIndex) => (
                      <Blur className={clsx(styles.blur)} key={galleryIndex}>
                        <MemoizedCursorParticlesImage
                          src={strapi.getStrapiMediaUrl(gallery.url)}
                          alt={gallery?.name || 'Gallery'}
                          width={gallery.width}
                          height={gallery.height}
                        />
                      </Blur>
                    ))}
                  </div>
                )}
              </div>
            );
          });
        })()}
        {nextServiceSlug && <BigLink href={`/services/${nextServiceSlug}`} text="next" />}
      </div>
    </section>
  );
}
