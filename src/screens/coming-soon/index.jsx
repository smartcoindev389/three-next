"use client";

export * from "./01-hero";
export * from "./02-what";
export * from "./03-at";

import { Screens } from "screens";
import { useState, useRef } from "react";
import clsx from "clsx";
import { Canvas } from "@react-three/fiber";
import styleScene from "@/shared/components/(main)/ThreeScene/style.module.scss";
import CursorTrail from "@/shared/components/(main)/ThreeScene/CursorTrail";
import { useResponsiveFov } from "@/hooks/use-responsive-fov";
import { Robot } from "@/shared/components/(main)/ThreeScene/Robot";
import {
  lights,
  addRobotAnimation,
} from "@/shared/components/(main)/ThreeScene/utils";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import useMobile from "@/hooks/useMobile";

export function Coming() {
  const fov = useResponsiveFov();
  const [robotReady, setRobotReady] = useState(false);
  const robotRef = useRef();
  const robotScale = 30;
  const isMobileView = useMobile();

  useGSAP(() => {
    if (!robotReady) return;

    const robot = robotRef.current.robot;
    const startPos = { x: 0, y: 0, z: 0 };

    const flightData1 = { progress: 0 };

    const tl = gsap.timeline({
      defaults: {
        ease: "sine.inOut",
        duration: 1,
      },
      scrollTrigger: {
        trigger: "body",
        start: "top top",
        end: "bottom bottom",
        scrub: 1,
      },
    });

    addRobotAnimation({
      flightData: flightData1,
      controlPoints: [
        { x: isMobileView?19:25, y: isMobileView?-8:-7, z: 0 },
        { x: -5, y: 8, z: 0 },
        { x: -10, y: -25, z: 0 },
        { x: -20, y: -6, z: 0 },
      ],
      rotationPoints: [
        { x: 0, y: -Math.PI / 8, z: Math.PI / 7 },
        { x: Math.PI / 2, y: 0, z: -Math.PI / 2 },
        { x: Math.PI / 2, y: -Math.PI / 2, z: Math.PI / 2 },
        { x: 0, y: Math.PI / 4, z: 0 },
      ],
      scalePoints: [1, 0.6, 0.8, 1],
      tlConfig: {
        progress: 1,
        duration: 2,
        ease: "power2.inOut",
      },
      whenSecond: 0,
      tl,
      robot,
      startPos,
      robotScale,
    });

    tl.to(robot.position, {
      y: 100,
      duration: 5,
    }, 2);

    tl.to({}, {
      duration: 1,
    }, 10)
  }, [robotReady]);

  return (
    <main className="page">
      <Canvas
        camera={{ position: [0, 0, 40], fov }}
        className={clsx(styleScene.scene)}
      >
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
          // position={[25, -7, 0]}
          position={[isMobileView?19:25, isMobileView?-8:-7, 0]}
          rotation={[0, -Math.PI / 8, Math.PI / 7]}
          showNormal={true}
          showHolographic={false}
          onlyOne={true}
          onReady={() => {
            setRobotReady(true);
          }}
        />
        <CursorTrail />
      </Canvas>
      <Screens.ComingSoon.Hero />
      <Screens.ComingSoon.What />
      <Screens.ComingSoon.At />
    </main>
  );
}
