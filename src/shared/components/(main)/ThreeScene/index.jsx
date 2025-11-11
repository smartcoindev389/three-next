"use client";
import { Canvas } from "@react-three/fiber";
import { Suspense, useState, useRef, useEffect } from "react";
import { Leva } from "leva";
import NebulaV2 from "./Nebula/v2";
import style from "./style.module.scss";
import CursorTrail from "./CursorTrail";
import clsx from "clsx";
import MovingLightV2 from "./MovingLight/v2";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useResponsiveFov } from "@/hooks/use-responsive-fov";
import {
  useMovingLightControls,
  useNebulaControls,
  useAmbientControls,
  lights,
} from "@/shared/components/(main)/ThreeScene/utils";
gsap.registerPlugin(ScrollTrigger);

import { RobotModel } from "./Robot2";
import * as InitPreset from "./Robot2/dataPresetTrigger";

export function ThreeScene() {
  const fov = useResponsiveFov();
  const mainLayer = 0;
  const movingLight = useMovingLightControls();
  const nebula = useNebulaControls();
  const { ambientColor, ambientIntensity } = useAmbientControls();
  const [triggerExplosion, setTriggerExplosion] = useState(false);
  const sceneRef = useRef();
  const robotApiRef = useRef(null);
  const ambientLightRef = useRef();
  const MovingLightV2Ref = useRef();

  useEffect(() => {
    function percentOfPage(pct) {
      return document.body.scrollHeight * pct + "px top";
    }

    const triggers = [
      {
        start: percentOfPage(0.01),
        end: percentOfPage(0.01),
        cb: async () => {
          console.log("актив 10%");

          setTriggerExplosion(true);
          MovingLightV2Ref?.current?.lights?.forEach((light) => {
            light.visible = false;
          });
          gsap.to(ambientLightRef?.current, {
            intensity: 0,
            duration: 1,
          });

          await robotApiRef.current?.playTargetPreset?.("CreateTemplatePreset1");
        },
        cBottom: async () => {
          console.log("вниз 0.01");
          await robotApiRef.current?.playTargetPreset?.(
            "CreateTemplatePreset2Bottom",
          );
        },
      },

      {
        start: percentOfPage(0.07),
        end: percentOfPage(0.07),
        cb: async () => {
          console.log("актив 30%");
          await robotApiRef.current?.playTargetPreset?.("CreateTemplatePreset2");
        },
        cBottom: () => {
          console.log("вниз 0.07");
        },
      },

      {
        start: percentOfPage(0.2),
        end: percentOfPage(0.2),
        cb: async () => {
          console.log("актив 50%");
          await robotApiRef.current?.playTargetPreset?.("CreateTemplatePreset4");
        },
        cBottom: () => {
          console.log("вниз");
        },
      },
      {
        start: percentOfPage(0.335),
        end: percentOfPage(0.335),
        cb: async () => {
          console.log("актив 60%");
          await robotApiRef.current?.playTargetPreset?.("CreateTemplatePreset5");
        },
        cBottom: () => {
          console.log("вниз");
        },
      },

      {
        start: percentOfPage(0.5),
        end: percentOfPage(0.5),
        cb: async () => {
          console.log("актив 80%");
          await robotApiRef.current?.playTargetPreset?.("CreateTemplatePreset6");
        },
        cBottom: () => {
          console.log("вниз");
        },
      },

      {
        start: percentOfPage(0.58),
        end: percentOfPage(0.58),
        cb: async () => {
          console.log("актив 80%");
          await robotApiRef.current?.playTargetPreset?.("CreateTemplatePreset7");
        },
        cBottom: () => {
          console.log("вниз");
        },
      },

      {
        start: percentOfPage(0.7),
        end: percentOfPage(0.7),
        cb: async () => {
          console.log("актив 80%");
          await robotApiRef.current?.playTargetPreset?.("CreateTemplatePreset8");
        },
        cBottom: () => {
          console.log("вниз");
        },
      },
    ];

    const instances = triggers.map(({ start, end, cb, cBottom }) =>
      ScrollTrigger.create({
        trigger: document.body,
        start,
        end,
        onEnter: cb,
        onEnterBack: cBottom,
        //markers: true,
        toggleActions: "play none play none",
      }),
    );

    return () => {
      instances.forEach((st) => st.kill());
    };
  }, []);

  return (
    fov && (
      <div className={style.blockNebula} ref={sceneRef}>
        <Leva collapsed hidden />
        <Canvas
          camera={{ position: [0, 0, 40], fov }}
          className={clsx("three-shake", style.scene)}
          onCreated={({ camera }) => {
            camera.layers.enable(0);
            camera.layers.enable(1);
          }}
        >
          <ambientLight
            layers={mainLayer}
            color={ambientColor}
            intensity={ambientIntensity}
            ref={ambientLightRef}
          />
          <MovingLightV2
            ref={MovingLightV2Ref}
            layers={mainLayer}
            {...movingLight}
          />

          <Suspense fallback={null}>
            <RobotModel InitPreset={InitPreset} ref={robotApiRef} />
            {lights.map((pos, i) => (
              <directionalLight
                key={i}
                layers={mainLayer}
                position={pos}
                intensity={1}
                color={"#fff"}
              />
            ))}
            <NebulaV2
              {...nebula}
              layers={mainLayer}
              triggerExplosion={triggerExplosion}
              defaultState="normal"
            />
          </Suspense>
          <CursorTrail />
        </Canvas>
      </div>
    )
  );
}
