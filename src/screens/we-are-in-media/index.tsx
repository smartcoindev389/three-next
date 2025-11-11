"use client";

import { Suspense, useState, useRef, useCallback, useEffect } from "react";
import clsx from "clsx";
import { Canvas } from "@react-three/fiber";
import { useRouter } from "next/navigation";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import gsap from "gsap";
import styles from "./index.module.scss";
import styleScene from "@/shared/components/(main)/ThreeScene/style.module.scss";
import NebulaV2 from "@/shared/components/(main)/ThreeScene/Nebula/v2";
import MovingLightV2 from "@/shared/components/(main)/ThreeScene/MovingLight/v2";
import CursorTrail from "@/shared/components/(main)/ThreeScene/CursorTrail";
import { Hero } from "@/screens/home/01-hero";
import { useDoubleScrollDirection } from "@/hooks/use-double-scroll-direction";
import { useOnVisiblePercentage } from "@/hooks/use-on-visible-percentage";
import { boardControlsConfig } from "shared/config/boardControlsConfig";
import { Leva, useControls } from "leva";
import { BoardGroup } from "shared/components/(main)/ThreeScene/BoardGroup";
import { BoardData } from "@/types";
gsap.registerPlugin(ScrollTrigger);

export function WeAreInMedia({ pageData }: { pageData: any }) {
  const router = useRouter();
  const [animateFinished, setAnimateFinished] = useState(false);
  const [triggerExplosion, setTriggerExplosion] = useState(false);
  const [triggerAssemble, setTriggerAssemble] = useState(true);
  const servicesRef = useRef<HTMLCanvasElement>(null);
  const sceneRef = useRef(null);
  const [isPhone, setIsPhone] = useState(false);
  const [cameraPosition, setCameraPosition] = useState<
    [number, number, number]
  >([0, 0, 8.5]);
  const [fov, setFov] = useState(75);
  const [active, setActive] = useState<boolean[]>(
    Array(pageData?.items?.length || 0).fill(false),
  );

  const ambient = {
    color: "#5500aa",
    intensity: 50,
  };

  // Функция для пересчета камеры и FOV
  const updateCameraSettings = useCallback(() => {
    const width = window.innerWidth;
    const isPhoneNow = width < 768;

    setIsPhone(isPhoneNow);

    // Динамически вычисляем FOV и позицию камеры
    if (isPhoneNow) {
      setCameraPosition([0, 0, 13]);
      setFov(85); // Больше FOV для телефона
    } else {
      setCameraPosition([0, 0, 8.5]);
      setFov(75); // Стандартный FOV для десктопа
    }
  }, []);

  useOnVisiblePercentage(
    sceneRef,
    () => {
      setTriggerExplosion(false);
      setTriggerAssemble(true);
    },
    0.1,
  );

  useDoubleScrollDirection({
    onDoubleScroll: (dir) => {
      if (dir === "down") {
        setTriggerExplosion(true);
        setTriggerAssemble(false);
      }
    },
    className: styles.Sevices,
    timeout: 1000,
    minInterval: 300,
    longScrollDistance: 200,
  });

  useEffect(() => {
    // Инициализация
    updateCameraSettings();

    // Обработчик изменения размера
    const handleResize = () => {
      updateCameraSettings();
      // Обновляем ScrollTrigger после изменения размера
      setTimeout(() => {
        ScrollTrigger.refresh();
      }, 100);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [updateCameraSettings]);

  const handleToggle = useCallback(
    (idx: number) => {
      const item = pageData?.items[idx];
      if (item?.link) {
        router.push(`${item.link}`);
      }
    },
    [router, pageData],
  );

  const c = useControls(boardControlsConfig);

  // Адаптивные размеры досок
  const boardScale = isPhone ? 0.8 : 1;
  c.boardWidth = 3.6 * boardScale;
  c.boardHeight = c.boardWidth * 0.9;
  c.spacing = 4 * boardScale;
  c.boardDepth = 0.01;

  const spacing = { x: c.spacing, y: 3.6 * boardScale };
  const BOARD_SIZE: [number, number, number] = [
    c.boardWidth,
    c.boardHeight,
    c.boardDepth,
  ];

  const getPosition = (row: number, col: number): [number, number, number] => {
    const x = (col - 1.5) * (c.boardWidth + c.spacing);
    const y = (row - 1) * (c.boardHeight + c.spacing);
    return [x, y, 0];
  };

  const boards: BoardData[] = pageData?.items?.map((item: any, i: number) => ({
    id: item.id,
    position: getPosition(0, 0),
    isActive: active[i],
    mainText: item.title,
    subText: item.description,
    link: item.link,
  }));

  const handleActiveChange = useCallback(() => {
    pageData?.items?.forEach((item: any, index: number) => {
      setTimeout(() => {
        setActive((prev) => {
          const next = [...prev];
          next[index] = true;
          return next;
        });
      }, index * 100);
    });
  }, []);

  useEffect(() => {
    setTimeout(() => {
      ScrollTrigger.refresh();
    }, 100);
  }, []);

  return (
    <>
      <Leva collapsed={true} hidden={true} />
      <section className={clsx(styleScene.blockNebula)} ref={sceneRef}>
        <Canvas
          camera={{ position: [0, 0, 40], fov }}
          className={clsx(styleScene.scene)}
        >
          <ambientLight color={ambient.color} intensity={ambient.intensity} />
          <MovingLightV2 />
          <Suspense fallback={null}>
            <directionalLight position={[5, 10, 5]} intensity={1} />
            <NebulaV2
              triggerExplosion={triggerExplosion}
              triggerAssemble={triggerAssemble}
              onExplosionEnd={() => {
                setAnimateFinished(true);
              }}
              defaultState="exploding"
            ></NebulaV2>
          </Suspense>
          <CursorTrail />
        </Canvas>
      </section>
      <Hero hero={{ title: pageData?.title || "we are in media" }} />
      <Canvas
        key={`${isPhone}-${cameraPosition.join("-")}`} // Принудительный ререндер при смене устройства
        camera={{ position: cameraPosition, fov }}
        ref={servicesRef}
        style={{
          width: "100vw",
          height: isPhone ? "160vh" : `100vh`,
          position: "relative",
          zIndex: 999,
          minHeight: isPhone ? "160vh" : `100vh`,
          minWidth: "100vw",
        }}
      >
        <group position={[0, 1.5, 0]}>
          <BoardGroup
            id="media-board-group"
            boards={boards}
            BOARD_SIZE={BOARD_SIZE}
            boardHeight={c.boardHeight}
            boardWidth={c.boardWidth}
            handleToggle={handleToggle}
            gradientMaterial={c}
            glowMaterial={c}
            edgeActiveColor={c.edgeActiveColor}
            edgeColor={c.edgeColor}
            glowBoxScaleX={c.glowBoxScaleX}
            glowBoxScaleY={c.glowBoxScaleY}
            glowBoxScaleZ={c.glowBoxScaleZ}
            layoutMode="grid"
            gridCols={isPhone ? 2 : 4}
            gridRows={!isPhone ? 2 : 4}
            spacing={spacing}
            randomOffset={{ x: 0, y: 1 }}
            triggerAnimation={animateFinished}
            onAnimationComplete={() => handleActiveChange()}
            mainFontSize={c.boardHeight * 0.07}
            subFontSize={c.boardHeight * 0.04}
            showReadMore={true}
          />
        </group>
      </Canvas>
    </>
  );
}
