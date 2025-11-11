"use client";

import { Suspense, useState, useEffect, useRef, useCallback } from "react";
import clsx from "clsx";
import { Canvas } from "@react-three/fiber";
import { useRouter } from "next/navigation";

import styles from "./index.module.scss";
import styleScene from "@/shared/components/(main)/ThreeScene/style.module.scss";

import NebulaV2 from "@/shared/components/(main)/ThreeScene/Nebula/v2";
import MovingLightV2 from "@/shared/components/(main)/ThreeScene/MovingLight/v2";
import CursorTrail from "@/shared/components/(main)/ThreeScene/CursorTrail";
import { useResponsiveFov } from "@/hooks/use-responsive-fov";
import { Hero } from "@/screens/home/01-hero";
import styleNebula from "@/shared/components/(main)/ThreeScene/style.module.scss";
import stylesHeader from "@/widgets/header/index.module.scss";
import stylesFooter from "@/widgets/footer/index.module.scss";
import { dataServices } from "@/data/dataLists";
import { useFadeInByClass } from "@/hooks/use-fade-in-by-class";
import { useDoubleScrollDirection } from "@/hooks/use-double-scroll-direction";
import { useOnVisiblePercentage } from "@/hooks/use-on-visible-percentage";
import { boardControlsConfig } from "shared/config/boardControlsConfig";
import { Leva, useControls } from "leva";
import { BoardGroup } from "shared/components/(main)/ThreeScene/BoardGroup";
import { BoardData } from "@/types";

export function Services({ services, pageData }: { services: any, pageData: any }) {
  useFadeInByClass([stylesHeader.Header, stylesFooter.Footer], true);

  const [isPhone, setIsPhone] = useState(false);

  useEffect(() => {
    setIsPhone(window.innerWidth < 768);
  }, []);

  const gridCols = isPhone ? 1 : 3;
  const gridRows = dataServices.length / gridCols;

  const fov = useResponsiveFov();
  const router = useRouter();
  const [animateFinished, setAnimateFinished] = useState(false);
  const [triggerExplosion, setTriggerExplosion] = useState(false);
  const [triggerAssemble, setTriggerAssemble] = useState(true);
  const servicesRef = useRef<HTMLCanvasElement>(null);
  const ambient = {
    color: "#5500aa",
    intensity: 50,
  };
  const sceneRef = useRef(null);
  const [active, setActive] = useState<boolean[]>(
    Array(services.length).fill(false),
  );

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
    timeout: 1500,
    minInterval: 100,
    longScrollDistance: 200,
  });

  const handleToggle = useCallback(
    (idx: number) => {
      const service = services[idx];
      if (service) {
        const slug = service.documentId || service.slug || service.id;
        router.push(`/services/${slug}`);
      }
    },
    [router, services],
  );

  const c = useControls(boardControlsConfig);
  c.boardWidth = isPhone ? 1.8 : 1.5;
  c.boardHeight = c.boardWidth * 0.9;
  c.spacing = isPhone ? 1.8 : 2.5;
  c.boardDepth = 0.01;
  const BOARD_SIZE: [number, number, number] = [
    c.boardWidth,
    c.boardHeight,
    c.boardDepth,
  ];

  // const getPosition = (row: number, col: number): [number, number, number] => {
  //   const x = !isPhone ? ((col - 1.5) * (c.boardWidth + c.spacing)) : ((col - 1.5) * (c.boardWidth + c.spacing) * Math.random() * 2);
  //   const y = !isPhone ? ((row - 1) * (c.boardHeight + c.spacing)) : (c.boardHeight + c.spacing);
  //   return [x, y, 0];
  // };

  const boards: BoardData[] = dataServices.map((item, i) => ({
    id: item.id,
    position: isPhone ? [0, -3, 0] : [0, 0, 0],
    isActive: active[i],
    mainText: item.mainText,
    subText: item.subText,
  }));

  const handleActiveChange = useCallback(() => {
    services.forEach((_: any, index: number) => {
      setTimeout(() => {
        setActive((prev) => {
          const next = [...prev];
          next[index] = true;
          return next;
        });
      }, index * 100);
    });
  }, []);

  return (
    <>
      <Leva collapsed={true} hidden={true} />
      <section className={clsx(styleNebula.blockNebula)} ref={sceneRef}>
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
      <Hero hero={{ title: pageData?.title || "Services" }} />
      <Canvas
        camera={{ position: [0, 0, 8.5], fov }}
        ref={servicesRef}
        style={{
          width: "100vw",
          height: !isPhone ? `250vh` : `500vh`,
          position: "relative",
          zIndex: 999,
          minHeight: "100vh",
          minWidth: "100vw",
        }}
      >
        <group position={[0, 3, 0]}>
          <BoardGroup
            id="services-board-group"
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
            layoutMode={isPhone ? "circle" : "checkerboard"}
            gridCols={gridCols}
            gridRows={gridRows}
            spacing={{ x: c.spacing, y: isPhone ? c.spacing : c.spacing * 0.9 }}
            randomOffset={{ x: 0, y: 1 }}
            triggerAnimation={animateFinished}
            onAnimationComplete={() => handleActiveChange()}
            mainFontSize={c.boardHeight * 0.07}
            subFontSize={c.boardHeight * 0.05}
          />
        </group>
      </Canvas>
      <section className={styles.Services}>
        <div className={styles.content}>
          <h2>
            {pageData?.footer_heading || "Lorem Ipsum "}
          </h2>
          <p>
            {pageData?.footer_content || "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."}
          </p>
        </div>
      </section>
    </>
  );
}
