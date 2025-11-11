"use client";
import { Suspense, useState, useRef } from "react";
import clsx from "clsx";
import { Canvas } from "@react-three/fiber";
import styles from "./index.module.scss";
import styleScene from "@/shared/components/(main)/ThreeScene/style.module.scss";
import NebulaV2 from "@/shared/components/(main)/ThreeScene/Nebula/v2";
import MovingLightV2 from "@/shared/components/(main)/ThreeScene/MovingLight/v2";
import CursorTrail from "@/shared/components/(main)/ThreeScene/CursorTrail";
import { useResponsiveFov } from "@/hooks/use-responsive-fov";
import { Hero } from "@/screens/home/01-hero";
import styleNebula from "@/shared/components/(main)/ThreeScene/style.module.scss";
import { dataOurProgress } from "@/data/dataLists";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Robot } from "@/shared/components/(main)/ThreeScene/Robot";
import {
  lights,
  addRobotAnimation,
} from "@/shared/components/(main)/ThreeScene/utils";
gsap.registerPlugin(ScrollTrigger);

export function OurProgress({ pageData }) {
  const fov = useResponsiveFov();
  const [triggerExplosion, setTriggerExplosion] = useState(false);
  const robotScale = 50;
  const robotRef = useRef();
  const ambientLightRef = useRef();
  const robotIsStart = useRef(false);
  const MovingLightV2Ref = useRef();
  const [robotReady, setRobotReady] = useState(false);
  const sceneRef = useRef();
  const ambient = {
    color: "#5500aa",
    intensity: 50,
  };

  // Use Strapi data or fallback to default data
  const progressSteps = pageData?.step || dataOurProgress.map(item => ({ step: item.description }));

  useGSAP(() => {
    const tl = gsap.timeline({
      defaults: {
        ease: "power2.out",
        duration: 3,
      },
      scrollTrigger: {
        trigger: `.${styles.History}`,
        start: "top top",
        end: "bottom bottom",
        toggleActions: "play none none none",
      },
    });

    tl.from(`.${styles.Item}`, { yPercent: 100, opacity: 0, stagger: 0.25 }, 0);
  }, []);

  useGSAP(() => {
    if (!robotReady) return;

    const robot = robotRef.current.robot;
    const startPos = { x: 0, y: 0, z: 0 };

    const flightData1 = { progress: 0 };
    const flightData2 = { progress: 0 };
    const flightData3 = { progress: 0 };

    const tl = gsap.timeline({
      defaults: {
        ease: "sine.inOut",
        duration: 1,
      },
      scrollTrigger: {
        trigger: "body",
        start: "top top",
        end: "bottom bottom",
        scrub: 3,
      },
    });

    tl.to(
      {},
      {
        duration: 1,
        onStart: () => {
          if (robotIsStart.current || !robotRef.current) return;
          setTriggerExplosion(true);
          gsap.to(ambientLightRef?.current, {
            intensity: 0,
            duration: 1,
          });
          MovingLightV2Ref?.current?.lights?.forEach((light) => {
            light.visible = false;
          });
          robotIsStart.current = true;
        },
      },
      0,
    );

    addRobotAnimation({
      flightData: flightData1,
      controlPoints: [
        { x: -100, y: 0, z: 0 },
        { x: -5, y: 8, z: 0 },
        { x: -10, y: -25, z: 0 },
        { x: -20, y: -6, z: 0 },
      ],
      rotationPoints: [
        { x: Math.PI / 2, y: 0, z: -Math.PI / 2 },
        { x: Math.PI / 2, y: 0, z: -Math.PI / 2 },
        { x: Math.PI / 2, y: -Math.PI / 2, z: Math.PI / 2 },
        { x: 0, y: Math.PI / 4, z: 0 },
      ],
      scalePoints: [1, 0.6, 0.8, 1],
      tlConfig: {
        progress: 1,
        duration: 5,
        ease: "power2.inOut",
      },
      whenSecond: 3,
      tl,
      robot,
      startPos,
      robotScale,
    });

    addRobotAnimation({
      flightData: flightData2,
      controlPoints: [
        { x: -20, y: -6, z: 0 },
        { x: 5, y: -6, z: 0 },
        { x: 5, y: -6, z: 0 },
        { x: 6, y: -6, z: 0 },
      ],
      rotationPoints: [
        { x: 0, y: Math.PI / 4, z: 0 },
        { x: 0, y: 0, z: Math.PI / 8 },
        { x: 0, y: 0, z: Math.PI / 8 },
        { x: 0, y: -Math.PI / 8, z: 0 },
      ],
      scalePoints: [1, 1, 1, 1],
      tlConfig: {
        progress: 1,
        duration: 5,
        ease: "power2.inOut",
      },
      whenSecond: 8,
      tl,
      robot,
      startPos,
      robotScale,
    });

    addRobotAnimation({
      flightData: flightData3,
      controlPoints: [
        { x: 6, y: -6, z: 0 },
        { x: -20, y: -6, z: 0 },
        { x: -10, y: -6, z: 0 },
        { x: 100, y: -6, z: 0 },
      ],
      rotationPoints: [
        { x: 0, y: -Math.PI / 8, z: 0 },
        { x: 0, y: 0, z: -Math.PI / 8 },
        { x: 0, y: 0, z: 0 },
        { x: Math.PI / 2, y: 0, z: -Math.PI / 2 },
      ],
      scalePoints: [1, 1, 1, 1],
      tlConfig: {
        progress: 1,
        duration: 4,
        ease: "power2.inOut",
      },
      whenSecond: 13,
      tl,
      robot,
      startPos,
      robotScale,
    });

    tl.to(
      {},
      {
        duration: 1,
      },
      19,
    );
  }, [robotReady]);

  return (
    <>
      <section className={clsx(styleNebula.blockNebula)} ref={sceneRef}>
        <Canvas
          camera={{ position: [0, 0, 40], fov }}
          className={clsx(styleScene.scene)}
        >
          <ambientLight
            ref={ambientLightRef}
            color={ambient.color}
            intensity={ambient.intensity}
          />
          <MovingLightV2 ref={MovingLightV2Ref} />
          <Suspense fallback={null}>
            <directionalLight position={[5, 10, 5]} intensity={1} />
            <NebulaV2
              triggerExplosion={triggerExplosion}
              defaultState="normal"
            />
            {lights.map((pos, i) => (
              <directionalLight
                key={i}
                position={pos}
                intensity={1}
                color={"#fff"}
              />
            ))}
            <Robot
              ref={robotRef}
              scale={robotScale}
              position={[-100, 0, 0]}
              rotation={[0, 0, 0]}
              showNormal={true}
              showHolographic={false}
              onlyOne={true}
              onReady={() => {
                setRobotReady(true);
              }}
            />
          </Suspense>
          <CursorTrail />
        </Canvas>
      </section>
      <Hero
        hero={{ title: pageData?.title || "our progress" }}
      />
      <section className={styles.History}>
        {progressSteps.map((item, i) => (
          <div key={i} className={styles.Item} style={{ ...dataOurProgress[i]?.style }}>
            <div className={styles.Title}>{i + 1}</div>
            <div className={styles.Description}>{item.step}</div>
          </div>
        ))}
      </section>
    </>
  );
}
