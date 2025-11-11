/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useEffect, useRef, useMemo } from "react";
import styles from "./index.module.scss";
import { Canvas } from "@react-three/fiber";
import { AnimatedText } from "./01-hello-text";
import { AnimatedBoard } from "./02-hello-bords";
import { AnimatedTunnel } from "./03-tunnel";
import { AnimatedPerson } from "./04-Person";
import { AnimationController } from "@/utils/AnimationScrollController";
import { LoadNebulaV2 } from "./load";
import createPresetTunnel from "./_presets-data/animationPresets-tunnel";
import { SectionFinish2 } from "./05-section-finish2";
import { generatePersonSections, generateScrollTriggers } from "./_presets-data/personSectionsGenerator";
import { TEAM_CONFIG } from "./_presets-data/teamConfig";


interface ScrollTarget {
  top: () => boolean;
  bottom: () => boolean;
}

export function About({ aboutPage, ourTeams }: { aboutPage: any, ourTeams: any }) {
  const triggerFocus = useRef(0);
  AnimationController.blockDelay(true);

  // Generate person sections dynamically based on team members
  const personSections = useMemo(() => {
    const config = {
      membersPerScreen: TEAM_CONFIG.membersPerScreen,
      breakpoints: TEAM_CONFIG.breakpoints,
      positions: TEAM_CONFIG.positions,
    };
    return generatePersonSections(ourTeams || [], config);
  }, [ourTeams]);

  const animationMode = useRef(true);
  const animationZoneHeight = useRef(0);
  const freeScrollThreshold = useRef(0);
  const totalPersonSections = personSections.length;

  useEffect(function () {
    const scrollDataTarget: ScrollTarget[] = [
      {
        top: () => {
          return true;
        },
        bottom: () => {
          // нічого
          return true;
        },
      },
      {
        top: () => {
          AnimationController.play("section Tunnel closed");
          AnimationController.play("section 1 open");
          AnimationController.play("section Text open");
          return true;
        },
        bottom: () => {
          return true;
        },
      },
      {
        top: () => {
          AnimationController.play("section Tunnel open");
          if (totalPersonSections > 0) {
            AnimationController.play("section Person1 closed");
          }
          return true;
        },
        bottom: () => {
          AnimationController.play("section Text closed");
          AnimationController.play("section 1 forward");
          AnimationController.play("section Tunnel open");
          return true;
        },
      },
      {
        top: () => {
          if (totalPersonSections > 0) {
            AnimationController.play("section Person1 open");
          }
          const nextSection = totalPersonSections > 1 ? "section Person2" : "section finish 2";
          AnimationController.play(`${nextSection} closed`);
          return true;
        },
        bottom: () => {
          AnimationController.play("section Tunnel forward");
          if (totalPersonSections > 0) {
            AnimationController.play("section Person1 open");
          }
          return true;
        },
      },
      ...generateScrollTriggers(totalPersonSections).slice(1),
      {
        top: () => {
          AnimationController.play("section finish 3 closed");
          AnimationController.play("section finish 2 open");
          return true;
        },
        bottom: () => {
          if (totalPersonSections > 0) {
            const lastSection = `section Person${totalPersonSections}`;
            AnimationController.play(`${lastSection} forward`);
          }
          AnimationController.play("section finish 2 open");
          return true;
        },
      },
      {
        top: () => {
          AnimationController.play("section finish 4 closed");
          AnimationController.play("section finish 3 open");
          return true;
        },
        bottom: () => {
          AnimationController.play("section finish 2 forward");
          AnimationController.play("section finish 3 open");
          return true;
        },
      },
      {
        top: () => {
          AnimationController.play("section finish 4 open");
          return true;
        },
        bottom: () => {
          AnimationController.play("section finish 3 forward");
          AnimationController.play("section finish 4 open");
          return true;
        },
      },
      {
        top: () => {
          return true;
        },
        bottom: () => {
          AnimationController.play("section finish 4 forward");
          setTimeout(() => {
            document.body.scrollIntoView({ behavior: "smooth", block: "end" });
          }, 150)
          return true;
        },
      },
      {
        top: () => {
          return true;
        },
        bottom: () => {
          return true;
        },
      },
    ];

    // Track animation mode and scroll position
    const lastTriggerIndex = scrollDataTarget.length - 1;

    // Calculate thresholds once DOM is ready
    setTimeout(() => {
      const box1Element = document.querySelector(`.${styles.box1}`) as HTMLElement;
      if (box1Element) {
        const totalHeight = box1Element.offsetHeight;
        // Animation zone is 85% of total height, last 15% is free scroll to footer
        animationZoneHeight.current = totalHeight * 0.85;
        // Need to scroll back above 75% to re-enable animation mode
        freeScrollThreshold.current = totalHeight * 0.75;
      }
    }, 100);

    const checkScrollMode = () => {
      const scrollTop = window.scrollY;

      if (animationMode.current && scrollTop > animationZoneHeight.current) {
        // Exiting animation zone - enable free scroll
        animationMode.current = false;
      } else if (!animationMode.current && scrollTop < freeScrollThreshold.current) {
        // Scrolled back into animation zone - re-enable controlled scroll
        animationMode.current = true;
      }
    };

    const moveBy = (deltaY: number) => {
      // Block if animation is playing
      if (AnimationController.scrollBlock) return;

      const previousTrigger = triggerFocus.current;

      if (deltaY > 0) {
        // Scrolling down
        triggerFocus.current = Math.min(triggerFocus.current + 1, lastTriggerIndex);
        if (triggerFocus.current !== previousTrigger) {
          scrollDataTarget[triggerFocus.current]?.bottom();
        }
      } else if (deltaY < 0) {
        // Scrolling up
        triggerFocus.current = Math.max(triggerFocus.current - 1, 0);
        if (triggerFocus.current !== previousTrigger) {
          scrollDataTarget[triggerFocus.current]?.top();
        }
      }

      // Check if we should transition modes after animation
      checkScrollMode();
    };

    const handleWheel = (e: WheelEvent) => {
      checkScrollMode();
      if (!animationMode.current) return; // Allow normal scrolling in free scroll zone
      e.preventDefault();
      e.stopPropagation();
      moveBy(e.deltaY);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      checkScrollMode();
      if (!animationMode.current) return;
      if (e.code === "ArrowDown" || e.code === "ArrowUp") {
        e.preventDefault();
        moveBy(e.code === "ArrowDown" ? 1 : -1);
      }
    };

    let touchStartY: number | null = null;
    const THRESHOLD = 20;

    const handleTouchStart = (e: TouchEvent) => {
      checkScrollMode();
      if (!animationMode.current) return;
      touchStartY = e.touches[0].clientY;
    };

    const handleTouchMove = (e: TouchEvent) => {
      checkScrollMode();
      if (!animationMode.current) return;
      if (touchStartY === null) return;
      const deltaY = touchStartY - e.touches[0].clientY;
      if (Math.abs(deltaY) > THRESHOLD) {
        e.preventDefault();
        moveBy(deltaY);
        touchStartY = e.touches[0].clientY;
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: false });

    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
    };
  }, [totalPersonSections]);

  return (
    <main className="page" style={{ position: 'relative' }}>
      <div className="bar" />
      <Canvas
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          zIndex: -1,
        }}
        camera={{ position: [0, 0, 40], fov: 75 }}
      >

        <LoadNebulaV2 />

        <AnimatedBoard items={aboutPage?.item} />

        <AnimatedTunnel
          createPreset={createPresetTunnel}
          items={aboutPage?.item}
        />

        {personSections.map((preset, index) => (
          <AnimatedPerson
            key={`person-section-${index}`}
            createPreset={preset}
            persons={ourTeams}
          />
        ))}

        <SectionFinish2 key="finish-2" items={aboutPage?.products} sectionName="finish 2" title="we've built real products" />
        <SectionFinish2 key="finish-3" items={aboutPage?.businesses} sectionName="finish 3" title="we have unique technical capabilities" />
        <SectionFinish2 key="finish-4" items={aboutPage?.capabilities} sectionName="finish 4" title="we scale real businesses" />

      </Canvas>

      <div className={styles.box1} >
        <AnimatedText aboutPage={aboutPage} />
      </div>

    </main>
  );
}
