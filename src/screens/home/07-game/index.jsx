"use client";
import clsx from "clsx";
import { Suspense, useState, useRef, useEffect, useCallback } from "react";
import styles from "./index.module.scss";
import { Canvas } from "@react-three/fiber";
import MovingLightV2 from "@/shared/components/(main)/ThreeScene/MovingLight/v2";
import NebulaV2 from "@/shared/components/(main)/ThreeScene/Nebula/v2";
import { useResponsiveFov } from "@/hooks/use-responsive-fov";
import { useOnVisiblePercentage } from "@/hooks/use-on-visible-percentage";
import gsap from "gsap";

export const Game = ({ onButtonClick }) => {
  const [triggerExplosion, setTriggerExplosion] = useState(false);
  const [triggerAssemble, setTriggerAssemble] = useState(false);
  const gameRef = useRef();
  const fov = useResponsiveFov();
  const containerRef = useRef(null);

  const ambient = {
    color: "#5500aa",
    intensity: 50,
  };

  useOnVisiblePercentage(
    gameRef,
    () => {
      setTriggerAssemble(true);
      setTriggerExplosion(false);
    },
    0.6,
    () => {
      setTriggerExplosion(true);
      setTriggerAssemble(false);
    },
    0.1,
  );

  const scrollToBottomAdvanced = useCallback(() => {
    const scrollHeight = Math.max(
      document.body.scrollHeight,
      document.body.offsetHeight,
      document.documentElement.clientHeight,
      document.documentElement.scrollHeight,
      document.documentElement.offsetHeight,
    );
    window.scrollTo({
      top: scrollHeight,
      behavior: "smooth",
    });
  });

  const closeGame = useCallback(() => {
    const container = containerRef.current;
    container.remove();
  }, []);

  const openGameFullscreen = useCallback(function (url) {
    try {
      const iframe = document.createElement("iframe");
      iframe.id = "game-iframe";
      iframe.src = url;
      iframe.style.border = "none";
      iframe.style.width = "100vw";
      iframe.style.height = "100vh";
      iframe.title = "Game";
      iframe.tabIndex = 0;
      containerRef.current = document.createElement("div");
      const container = containerRef.current;
      container.style.width = "100vw";
      container.style.height = "100vh";
      container.style.background = "#001322";
      container.style.zIndex = "999999";
      container.style.position = "fixed";
      container.style.top = "0";
      container.style.left = "0";
      container.style.display = "flex";
      container.style.justifyContent = "center";
      container.style.alignItems = "center";

      iframe.onload = () => {
        iframe.contentWindow.parentCallback = () => {
          closeGame();
        };
      };

      container.appendChild(iframe);
      document.body.appendChild(container);
      iframe.focus();

      const btn = document.querySelector(".exit-container button");
      btn?.addEventListener("click", closeGame);
    } catch (error) {
      console.error(error);
      closeGame();
    }
  }, []);

  useEffect(() => {
    const fn = function () {
      closeGame();
      scrollToBottomAdvanced();
    };

    window.addEventListener("message", (event) => {
      if (event.data?.action === "closeIframe") {
        fn(event);
      }
    });

    return () => {
      window.removeEventListener("message", (event) => {
        if (event.data?.action === "closeIframe") {
          fn(event);
        }
      });
    };
  }, []);

  return (
    <section className={clsx(styles.Game, "three-shake")}>
      <Canvas
        camera={{ position: [0, 0, 40], fov }}
        style={{ height: "100vh", width: "100vw" }}
        ref={gameRef}
      >
        <ambientLight color={ambient.color} intensity={ambient.intensity} />
        <MovingLightV2 />
        <Suspense fallback={null}>
          <directionalLight position={[5, 10, 5]} intensity={1} />
          <NebulaV2
            triggerExplosion={triggerExplosion}
            triggerAssemble={triggerAssemble}
            enableMouse={true}
            enableSway={false}
            explosionDuration={1}
            hideNegativeZCount={4400}
            floatingCount={0}
            defaultState="exploding"
          />
        </Suspense>
      </Canvas>
      <button
        className={clsx(styles.button)}
        onClick={() => {
          onButtonClick?.();
          setTriggerExplosion(true);
          setTriggerAssemble(false);
          openGameFullscreen("/playground");
          gsap.to(
            ".three-shakePin",
            {
              opacity: 1,
              pointerEvents: "all",
              duration: 1,
              ease: "power2.out",
              onComplete: () => {
                gsap.to(
                  ".three-shakePin",
                  {
                    zIndex: "9999",
                  },
                  "<",
                );
              },
            },
            "<",
          );
        }}
      >
        Click <br /> here
      </button>
    </section>
  );
};
