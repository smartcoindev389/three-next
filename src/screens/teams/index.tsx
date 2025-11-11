/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useEffect, useRef, useMemo } from "react";
import styles from "../about/index.module.scss";
import { Canvas } from "@react-three/fiber";
import { AnimatedText } from "../about/01-hello-text";
import { AnimatedPerson } from "../about/04-Person";
import { AnimationController } from "@/utils/AnimationScrollController";
import { LoadNebulaV2 } from "../about/load";
import { generatePersonSections, generateScrollTriggers } from "../about/_presets-data/personSectionsGenerator";
import { TEAM_CONFIG } from "../about/_presets-data/teamConfig";
import { HeroText } from "./hero";


interface ScrollTarget {
  top: () => boolean;
  bottom: () => boolean;
}

export function Teams({ ourTeams }: { ourTeams: any }) {
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

  // Calculate total person sections
  const totalPersonSections = personSections.length;

  useEffect(function () {
    ///////////////////////////////// трігери скролу
    const scrollDataTarget: ScrollTarget[] = [
      {
        top: () => {
          return true;
        },
        bottom: () => {
          return true;
        },
      },
      {
        top: () => { ///////////1
          AnimationController.play("section 1 open");
          AnimationController.play("section Text open");
          return true;
        },
        bottom: () => { ///////////1
          return true;
        },
      },
      {
        top: () => { /////////////////2
          AnimationController.play("section Tunnel open");
          AnimationController.play("section Person1 closed");
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
        top: () => { ///////////////3
          AnimationController.play("section Person1 open");
          const nextSection = totalPersonSections > 1 ? "section Person2" : "section finish 2";
          AnimationController.play(`${nextSection} closed`);
          return true;
        },
        bottom: () => {
          AnimationController.play("section Tunnel forward");
          AnimationController.play("section Person1 open");
          return true;
        },
      },
      // Dynamically generated person section triggers
      ...generateScrollTriggers(totalPersonSections).slice(1), // Skip first one as it's handled above
      {
        top: () => { /////////////////Finish section
          //console.log("target finish");
          document.body.scrollIntoView({ behavior: "smooth", block: "start" });
          AnimationController.play("section finish 2 open");
          return true;
        },
        bottom: () => {
          //console.log("target finish");
          const lastSection = `section Person${totalPersonSections}`;
          AnimationController.play(`${lastSection} forward`);
          AnimationController.play("section finish 2 open");
          return true;
        },
      },
      {
        top: () => { //////////////////10
          //console.log("target 10");
          // нічого у top
          return true;
        },
        bottom: () => {
          //console.log("target 10");
          AnimationController.play("section finish 2 forward");
          setTimeout(() => {
            document.body.scrollIntoView({ behavior: "smooth", block: "end" });
          }, 150)
          return true;
        },
      },
      {
        top: () => { ////////////////////11
          // console.log("target 11");
          // нічого
          return true;
        },
        bottom: () => {
          //console.log("target 11");
          // нічого
          return true;
        },
      },
    ];

    //////////////////////////// таргет скрол
    // === 2) Функція перемикання по deltaY ===
    const moveBy = (deltaY: number) => {
      if (deltaY > 0) {
        triggerFocus.current = Math.min(triggerFocus.current + 1, scrollDataTarget.length - 1);
        scrollDataTarget[triggerFocus.current]?.bottom();
      } else if (deltaY < 0) {
        triggerFocus.current = Math.max(triggerFocus.current - 1, 0);
        scrollDataTarget[triggerFocus.current]?.top();
      }
    };

    // === 3) Обробник колеса мишки ===
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (AnimationController.scrollBlock) return false;
      moveBy(e.deltaY);
      return false;
    };

    // === 4) Обробник стрілок клавіатури ===
    const handleKeyDown = (e: KeyboardEvent) => {
      if (AnimationController.scrollBlock) return;
      if (e.code === "ArrowDown" || e.code === "ArrowUp") {
        e.preventDefault();
        moveBy(e.code === "ArrowDown" ? 1 : -1);
      }
    };

    // === 5) Обробники тачів ===
    let touchStartY: number | null = null;
    const THRESHOLD = 20;

    const handleTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
    };
    const handleTouchMove = (e: TouchEvent) => {
      if (AnimationController.scrollBlock || touchStartY === null) return;
      const deltaY = touchStartY - e.touches[0].clientY;
      if (Math.abs(deltaY) > THRESHOLD) {
        moveBy(deltaY);
        touchStartY = e.touches[0].clientY;
      }
    };

    // === 6) Підписка та відписка ===
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
    <main className="page">
      <div className="bar" />
      <Canvas
        //frameloop="demand"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          zIndex: 0,
        }}
        camera={{ position: [0, 0, 40], fov: 75 }}
      >

        <LoadNebulaV2 />
        
        {/* Dynamically generated person sections */}
        {personSections.map((preset, index) => (
          <AnimatedPerson
            key={`person-section-${index}`}
            createPreset={preset}
            persons={ourTeams}
          />
        ))}

      </Canvas>

      <div className={styles.box1} >
        <HeroText title="Our Team" />
      </div>

    </main>
  );
}
