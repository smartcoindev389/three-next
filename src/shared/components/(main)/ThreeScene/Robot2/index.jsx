"use client";
import { gsap } from "gsap";
import {
  forwardRef,
  useImperativeHandle,
  useMemo,
} from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

import { useAnimations, useGLTF } from "@react-three/drei";

import { HolographicMaterial } from "@/shared/components/(main)/ThreeScene/Robot/HolographicMaterial";

gsap.registerPlugin(ScrollTrigger);

/////////////////////////////////////////////////////////////////////////////////////
export const RobotModel = forwardRef((props, ref) => {
  const { InitPreset } = props;

  const { viewport } = useThree();

  const { scene, animations } = useGLTF(
    "/models/robot/анімація 2.2.glb",
  );
  const robotScene = scene;
  const { actions } = useAnimations(animations, scene);

  const activeFramePreset = useRef(null);

  const lookTarget3d = useRef();
  const robotRef = useRef();
  const tRef = useRef(0);
  const onUpdateScroll = useRef(0);
  const activeTriger = useRef(0);
  const deInitActivePreset = useRef(new Map());
  const nowUnitRobot = useRef({
    positionRobot: { x: 0, y: 0, z: 0 },
    rotationRobot: { x: 0, y: 0, z: 0 },
    positionLookAtTarget: { x: 0, y: 0, z: 0 },
  });
  //const headerBone = useRef(null);
  const robotHolog = useRef(null);

  const { sceneObjects } = useMemo(() => {
    const normalScene = robotScene;

    const objects = [];

    normalScene.traverse((child) => {
      if (child.isMesh) {
        const mesh = {
          geometry: child.geometry,
          material: child.material.clone(),
          skeleton: child.skeleton,
          position: child.position,
        };
        objects.push(mesh);

        // if (!props.onlyOne) {
        child.material.transparent = true;
        child.material.opacity = 0;
        //}
      }
    });

    return {
      sceneObjects: objects,
    };
  }, [robotScene]);

  const headerBone = useMemo(() => {
    let headerBone = null;
    robotScene.traverse((child) => {
      console.log(child.name, child.type);
      if (child.name === "Head") {
        headerBone = child;
        console.log("знайшли ", child);
      }
    });
    return headerBone;
  }, [scene]);

  const paramPreset = {
    gltf: robotScene,
    lookTarget3d: lookTarget3d,
    tRef: tRef,
    nowUnitRobot: nowUnitRobot,
    onUpdateScroll: onUpdateScroll,
    width: viewport.width,
    height: viewport.height,
    headerBone: headerBone,
    actions: actions,
    deInitActivePreset: deInitActivePreset,
    refApi: ref,
    viewport: viewport,
    activeTriger: activeTriger,
    activeFramePreset: activeFramePreset,
    robotHolographic: robotHolog,
  };

  // API для батька
  // черга
  const queueRef = useRef(Promise.resolve());

  function enqueue(fn) {
    queueRef.current = queueRef.current
      .then(() => {
        return Promise.resolve().then(fn);
      })
      .catch((err) => {
        console.error("[queue] internal error", err);
      });

    return queueRef.current;
  }

  useImperativeHandle(ref, () => ({
    playTargetPreset(name, callback) {
      return enqueue(async () => {
        if (deInitActivePreset.current && deInitActivePreset.current.size) {
          const de = Array.from(deInitActivePreset.current.values());
          deInitActivePreset.current.clear();

          for (const elem of de) {
            // гарантовано чекаємо, навіть якщо elem() sync
            await Promise.resolve(elem());
          }
        }

        // ініціалізація — якщо клас робить async init, чекай явно
        if (InitPreset[name]) {
          const tmpl = new InitPreset[name](name, paramPreset, callback);
          if (tmpl && typeof tmpl.init === "function") {
            await Promise.resolve(tmpl.init());
          }
          activeFramePreset.current = tmpl;
        }
      });
    },

    onUpdateScroll(p) {
      onUpdateScroll.current = p.progress;
      console.log("onUpdateScroll.current ", onUpdateScroll.current);
    },
  }));

  /////// малюєм кадр
  useFrame((state, delta) => {
    if (
      activeFramePreset.current &&
      null === activeFramePreset.current.frame({ state, delta })
    )
      return (activeFramePreset.current = null);
  });

  useEffect(() => {
    (async () => {
      await ref?.current.playTargetPreset?.("startPosition");
    })();
  }, []);

  return (
    <>
      <primitive
        object={lookTarget3d.current || new THREE.Object3D()}
        ref={lookTarget3d}
      />
      <primitive object={robotScene} scale={[30, 30, 30]} ref={robotRef} />

      <group ref={robotHolog}>
        {sceneObjects.map((obj, i) => (
          <mesh
            scale={[30, 30, 30]}
            key={`holo-${i}`}
            geometry={obj.geometry}
            position={obj.position}
            rotation={obj.rotation}
            skeleton={obj.skeleton}
            matrixWorld={obj.matrixWorld}
          >
            <HolographicMaterial
              hologramColor={"#51a4de"}
              hologramOpacity={1}
              scanlineSize={8}
              signalSpeed={0.5}
            />
          </mesh>
        ))}
      </group>
    </>
  );
});
