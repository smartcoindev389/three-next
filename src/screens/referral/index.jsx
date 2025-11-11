/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
export * from "./01-hero";
export * from "./02-how-it-works";
export * from "./03-what";
export * from "./04-faq";
import gsap from "gsap";
import { Screens } from "screens";
import { Suspense, useState, useEffect, useRef } from "react";
import clsx from "clsx";
import { Canvas } from "@react-three/fiber";
import styleScene from "@/shared/components/(main)/ThreeScene/style.module.scss";
import NebulaV2 from "@/shared/components/(main)/ThreeScene/Nebula/v2";
import MovingLightV2 from "@/shared/components/(main)/ThreeScene/MovingLight/v2";
import CursorTrail from "@/shared/components/(main)/ThreeScene/CursorTrail";
import { useResponsiveFov } from "@/hooks/use-responsive-fov";
import {
  lights,
  addRobotAnimation,
} from "@/shared/components/(main)/ThreeScene/utils";
import { useGSAP } from "@gsap/react";
import { Robot } from "@/shared/components/(main)/ThreeScene/Robot";

export const Referral = () => {
  const fov = useResponsiveFov();
  const [animated, setAnimated] = useState(false);
  const robotRef = useRef(null);
  const [robotReady, setRobotReady] = useState(false);
  const robotScale = 60;
  const ambientLightRef = useRef();
  const MovingLightV2Ref = useRef();
  const robotIsStart = useRef(false);
  const ambient = {
    color: "#5500aa",
    intensity: 50,
  };

  useGSAP(() => {
    if (!robotReady) return;
    const robot = robotRef.current.robot;
    const startPos = { x: 0, y: 0, z: 0 };
    const flightData1 = { progress: 0 };
    const flightData2 = { progress: 0 };

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
          setAnimated(true);

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
        // Начальная позиция - далеко справа за экраном
        { x: 60, y: 15, z: 0 },
        // Влетает в кадр сверху
        { x: 30, y: 25, z: 0 },
        // Начало петли - верх
        { x: 10, y: 20, z: 5 },
        // Середина петли - бок
        { x: 5, y: 5, z: 0 },
        // Низ петли
        { x: 10, y: -10, z: -5 },
        // Завершение петли
        { x: 20, y: 0, z: 0 },
        // Финальная позиция
        { x: 25, y: 0, z: 0 },
      ],
      rotationPoints: [
        // Начальный поворот - летит боком
        { x: 0, y: 0, z: Math.PI / 6 },
        // Начинает поворачиваться для петли
        { x: Math.PI / 8, y: 0, z: Math.PI / 3 },
        // Верх петли - переворот
        { x: Math.PI / 6, y: 0, z: Math.PI },
        // Бок петли - продолжает кружиться
        { x: Math.PI / 4, y: 0, z: Math.PI },
        // Низ петли - почти полный оборот
        { x: Math.PI / 2, y: 0, z: Math.PI },
        // Выравнивается после петли
        { x: 0, y: 0, z: Math.PI * 2 },
        // Финальная ровная позиция
        { x: 0, y: -Math.PI / 8, z: Math.PI * 2 + 0.2 },
      ],
      scalePoints: [
        // Начинает маленьким (далеко)
        0.3,
        // Увеличивается при приближении
        0.6,
        // Во время петли немного меняется размер для динамики
        0.8, 1.1, 0.9, 1.0,
        // Финальный размер
        1.0,
      ],
      tlConfig: {
        progress: 1,
        duration: 6,
        ease: "power2.inOut",
      },
      whenSecond: 0,
      tl,
      robot,
      startPos,
      robotScale,
    });

    addRobotAnimation({
      flightData: flightData2,
      controlPoints: [
        // Текущая позиция
        { x: 25, y: 0, z: 0 },
        // Легкий подъем с поворотом (как EVE готовится к полету)
        { x: 20, y: 8, z: 1 },
        // Плавная дуга влево
        { x: 10, y: 12, z: 0 },
        // Элегантное скольжение
        { x: -5, y: 15, z: -1 },
        // Продолжает плавную траекторию
        { x: -20, y: 18, z: 0 },
        // Легкий подъем перед финальным ускорением
        { x: -35, y: 25, z: 1 },
        // Уходит за пределы экрана
        { x: -60, y: 35, z: 0 },
      ],
      rotationPoints: [
        // Начальная позиция
        { x: 0, y: -Math.PI / 8, z: Math.PI * 2 + 0.2 },
        // Легкий наклон для поворота (как EVE готовится лететь)
        { x: -Math.PI / 12, y: -Math.PI / 2, z: Math.PI * 2 + 0.2 },
        // Плавный поворот влево
        { x: 0, y: -Math.PI / 2, z: Math.PI * 2 + 0.2 },
        // Продолжает элегантный поворот
        { x: Math.PI / 16, y: -Math.PI / 2, z: Math.PI * 2 + 0.2 },
        // Стабилизируется в полете
        { x: 0, y: -Math.PI / 2, z: Math.PI * 2 + 0.2 },
        // Финальный наклон для ускорения
        { x: -Math.PI / 8, y: -Math.PI / 2, z: Math.PI * 2 + 0.2 },
        // Улетает с элегантным наклоном
        { x: -Math.PI / 6, y: -Math.PI / 2, z: Math.PI * 2 + 0.2 },
      ],
      scalePoints: [
        // Стартовый размер
        1.0,
        // Остается стабильным
        1.0,
        // Легкое увеличение при подъеме
        1.05,
        // Стабильный полет
        1.0, 1.0,
        // Постепенно уменьшается с расстоянием
        0.8,
        // Исчезает вдали
        0.4,
      ],
      tlConfig: {
        progress: 1,
        duration: 8, // Более медленная, грациозная анимация
        ease: "power1.inOut", // Плавное ускорение и замедление
      },
      whenSecond: 6,
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
      32,
    );
  }, [robotReady]);

  return (
    <main className="page">
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
            enableMouse={true}
            enableSway={false}
            triggerExplosion={animated}
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
            position={[100, 0, 0]}
            rotation={[0, 0, 0]}
            showNormal={true}
            onlyOne={true}
            showHolographic={false}
            onReady={() => {
              setRobotReady(true);
            }}
          />
        </Suspense>
        <CursorTrail />
      </Canvas>
      <Screens.Home.Hero isCenter isLittle title="referral" />
      <Screens.Referral.Hero />
      <Screens.Referral.How />
      <Screens.Referral.What />
      <Screens.Referral.Faq />
    </main>
  );
};
