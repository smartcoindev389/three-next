"use client";
import { useRef, useMemo, useState, useEffect } from "react";
import { useLoader, useFrame, useThree } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";
import {
  Vector3,
  BufferAttribute,
  MeshStandardMaterial,
  Object3D,
  Raycaster,
} from "three";

import {
  generateNearTransforms,
  generateFarTransforms,
} from "./cubeTransforms";
import { useMouseRotation } from "./useMouseRotation";
import { useAnimatedCursorRadius } from "./useAnimatedCursorRadius";
import { usePointerOnSphere } from "./usePointerOnSphere";
import { applyLevitation } from "./applyLevitation";

export default function NebulaV2({
  children = null,
  bigCount = 5, // Кількість кубиків усього
  //bigCount = 1900, // Кількість кубиків усього
  farCount = 2500, // Кількість "відлетілих" кубиків (далі від сфери)
  scaleMin = 0.01, // Мінімальний розмір кубика
  scaleMax = 0.41, // Максимальний розмір кубика
  surfaceJitter = 3, // Розкид "відлетілих" кубиків відносно сфери
  moveStrengthX = 0.01, // Сила обертання сфери по X від миші
  moveStrengthY = 0.01, // Сила обертання сфери по Y від миші
  levitateStrength = 2, // Сила "левітації" кубиків (амплітуда коливань)
  enableSway = true, // Чи вмикати легке похитування сфери
  enableMouse = true, // Чи реагувати на мишу
  sphereRadius = 10, // Радіус сфери (центральної)
  cursorRadiusMax = 3.5, // Максимальний радіус дії курсора (сфера впливу)
  cursorRadiusLerp = 1.1, // Швидкість анімації радіусу дії курсора (чим більше — тим швидше)
  shakeDuration = 0.7, // Тривалість дрижання (сек)
  shakeAmplitude = 0.4, // Амплітуда дрижання
  shakeFrequency = 40, // Частота дрижання (швидкість)
  compressDuration = 0.5, // Тривалість стискання сфери (сек)
  compressScale = 0.7, // Коефіцієнт стискання сфери (0.6 = 60% від початкового розміру)
  explosionDuration = 0.5, // Тривалість вибуху (сек)
  explosionRadius = 150, // Максимальний радіус під час вибуху
  explosionEase = (t) => 1 - Math.pow(1 - t, 3), // easing-функція (easeOutCubic)
  enableCompress = true, // Чи вмикати анімацію стискання
  enableShake = true, // Чи вмикати трясіння
  enableExplosion = true, // Чи вмикати вибух
  compressCount = 4000, // новий пропс
  hideNegativeZCount = 2000, // скільки кубиків із -z сховати після вибуху
  floatingCount = 350, // кількість вільних кубів
  floatingMinDist = 120, // мінімальна відстань від центру
  floatingMaxDist = 60, // максимальна відстань від центру
  onExplosionStart = () => {}, // функція, яка викликається на початку вибуху
  onExplosionEnd = () => {}, // функція, яка викликається після вибуху
  triggerAssemble = false, // тригер для повернення до нормального стану
  triggerExplosion = false, // тригер для початку вибуху
  defaultState = "normal", // "normal" або "exploding"
  layers = 1,
}) {
  const groupRef = useRef(null);
  const bigMeshRef = useRef(null);
  const mouse = useRef({ x: 0, y: 0 });
  const targetRotation = useRef({ x: 0, y: 0 });
  const [isPointerActive, setIsPointerActive] = useState(false);
  const [isShaking, setIsShaking] = useState(false);
  const shakeTime = useRef(0);
  const [currentRadius, setCurrentRadius] = useState(sphereRadius);
  const animationRef = useRef({
    from: sphereRadius,
    to: sphereRadius,
    time: 0,
    active: false,
  });
  const [sphereState, setSphereState] = useState(defaultState); // "normal" | "compressing" | "exploding"
  const { camera } = useThree();
  const explosionFromPositions = useRef([]);
  const [explosionStarted, setExplosionStarted] = useState(false);
  const fadeTimers = useRef({});
  const fadeDuration = 0.1;
  const floatingMeshRef = useRef(null);

  // Завантаження моделі
  const gltf = useLoader(GLTFLoader, "/models/cube/Cube L.glb", (loader) => {
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath("/draco/");
    loader.setDRACOLoader(dracoLoader);
  });

  // Геометрія та матеріал кубика (MeshStandardMaterial для підтримки світла)
  const { geometry, material } = useMemo(() => {
    const firstMesh = gltf.scene.getObjectByProperty("type", "Mesh");
    const geom = firstMesh?.geometry.clone() ?? null;
    let mat = firstMesh?.material.clone() ?? null;
    if (geom && !geom.getAttribute("color")) {
      const count = geom.getAttribute("position").count;
      const color = new Float32Array(count * 3);
      geom.setAttribute("color", new BufferAttribute(color, 3));
    }
    if (mat && mat.type !== "MeshStandardMaterial") {
      mat = new MeshStandardMaterial({ color: mat.color || 0xffffff });
    }
    return { geometry: geom, material: mat };
  }, [gltf]);

  const floatingTransforms = useMemo(() => {
    const arr = [];
    for (let i = 0; i < floatingCount; i++) {
      // Випадковий напрямок
      const dir = new Vector3(
        Math.random() * 2 - 1,
        Math.random() * 2 - 1,
        Math.random() * 2 - 1,
      ).normalize();
      // Випадкова відстань
      const dist =
        floatingMinDist + Math.random() * (floatingMaxDist - floatingMinDist);
      // Випадковий scale
      const scale = scaleMin + Math.random() * (scaleMax - scaleMin);
      // Випадкові кути обертання
      const randomX = Math.random() * Math.PI * 2;
      const randomY = Math.random() * Math.PI * 2;
      const randomZ = Math.random() * Math.PI * 2;
      // Випадковий параметр для левітації
      const levitate = Math.random() * 1000;
      arr.push({
        position: dir.multiplyScalar(dist),
        scale,
        randomX,
        randomY,
        randomZ,
        levitate,
      });
    }
    return arr;
  }, [floatingCount, floatingMinDist, floatingMaxDist, scaleMin, scaleMax]);

  // Генерація позицій кубиків з рандомним scale
  const nearTransforms = useMemo(
    () => generateNearTransforms(bigCount, sphereRadius, scaleMin, scaleMax),
    [bigCount, sphereRadius, scaleMin, scaleMax],
  );

  const farTransforms = useMemo(
    () =>
      generateFarTransforms(
        farCount,
        sphereRadius,
        surfaceJitter,
        levitateStrength,
        scaleMin,
        scaleMax,
      ),
    [
      farCount,
      sphereRadius,
      surfaceJitter,
      levitateStrength,
      scaleMin,
      scaleMax,
    ],
  );

  const bigTransforms = useMemo(
    () => [...nearTransforms, ...farTransforms],
    [nearTransforms, farTransforms],
  );

  // Обробка руху миші
  useMouseRotation(
    enableMouse,
    mouse,
    targetRotation,
    moveStrengthX,
    moveStrengthY,
  );

  // Порахуй максимальну відстань для всіх bigTransforms
  const maxFarDist = useMemo(
    () => Math.max(...bigTransforms.map((tr) => tr.basePosition.length())),
    [bigTransforms],
  );

  // Додаємо запас, щоб область була ще більшою
  const pointerActiveRadius = Math.max(sphereRadius, maxFarDist + 10);

  // Обробка позиції ballPos під курсором (для ефекту відштовхування)
  usePointerOnSphere(pointerActiveRadius, camera, setIsPointerActive);

  // --- Анімований радіус дії курсора ---
  const maxRadius =
    cursorRadiusMax !== undefined
      ? cursorRadiusMax
      : sphereRadius * 0.35 + sphereRadius * 2 * 0.3;

  const [animatedRadius] = useAnimatedCursorRadius(
    enableMouse,
    isPointerActive,
    maxRadius,
    cursorRadiusLerp,
  );

  useFrame((state, delta) => {
    if (!geometry) return;
    const t = state.clock.getElapsedTime();
    const swayX = enableSway ? Math.sin(t * 0.23) * 0.009 : 0;
    const swayY = enableSway ? Math.cos(t * 0.17) * 0.009 : 0;

    // --- Дрижання сфери ---
    if (enableShake && isShaking && groupRef.current) {
      shakeTime.current += delta;
      groupRef.current.rotation.x +=
        Math.sin(t * shakeFrequency) * shakeAmplitude * delta;
      groupRef.current.rotation.y +=
        Math.cos(t * shakeFrequency) * shakeAmplitude * delta;
      groupRef.current.rotation.z +=
        Math.sin(t * shakeFrequency * 0.7) * shakeAmplitude * delta;
      if (shakeTime.current >= shakeDuration) {
        setIsShaking(false);
        shakeTime.current = 0;
      }
    } else if (groupRef.current) {
      if (enableMouse) {
        groupRef.current.rotation.y +=
          (targetRotation.current.y - groupRef.current.rotation.y) * 0.08;
        groupRef.current.rotation.x +=
          (targetRotation.current.x - groupRef.current.rotation.x) * 0.08;
      }
      groupRef.current.rotation.x += swayX;
      groupRef.current.rotation.y += swayY;
    }

    if (animationRef.current.active) {
      animationRef.current.time += delta;
      let t, ease, newRadius;

      if (animationRef.current.mode === "explosion") {
        if (enableExplosion) {
          t = Math.min(animationRef.current.time / explosionDuration, 1);
          ease = explosionEase(t);
          newRadius =
            animationRef.current.from +
            (animationRef.current.to - animationRef.current.from) * ease;
          setCurrentRadius(newRadius);

          if (t >= 1) {
            animationRef.current.active = false;
            setCurrentRadius(explosionRadius);
            setSphereState("exploding");
            // --- ВИКЛИК ПОДІЇ ---
            if (typeof onExplosionEnd === "function") {
              onExplosionEnd();
            }
          }
        } else {
          animationRef.current.active = false;
          setCurrentRadius(explosionRadius);
          setSphereState("exploding");
          // --- ВИКЛИК ПОДІЇ ---
          if (typeof onExplosionEnd === "function") {
            onExplosionEnd();
          }
        }
      } else {
        if (enableCompress) {
          t = Math.min(animationRef.current.time / compressDuration, 1);
          newRadius =
            animationRef.current.from +
            (animationRef.current.to - animationRef.current.from) * t;
          setCurrentRadius(newRadius);

          if (t >= 1) {
            animationRef.current.active = false;
            setCurrentRadius(animationRef.current.to);
            // --- ВИБУХ після стискання ---
            if (
              animationRef.current.to === sphereRadius * compressScale &&
              enableExplosion
            ) {
              startExplosion();
              setSphereState("exploding");
            } else {
              setSphereState("normal");
            }
          }
        } else {
          animationRef.current.active = false;
          setCurrentRadius(animationRef.current.to);
          setSphereState("normal");
        }
      }
    }

    // --- Збираємо індекси кубиків з від’ємним z після вибуху ---
    let negativeZIndices = [];
    if (
      sphereState === "exploding" &&
      animationRef.current.mode === "explosion"
      // !animationRef.current.active // вибух завершився
    ) {
      for (let i = 0; i < bigTransforms.length; i++) {
        if (bigTransforms[i].position.z < 0) {
          negativeZIndices.push(i);
        }
      }
      negativeZIndices = negativeZIndices.slice(0, hideNegativeZCount);
    }

    if (bigMeshRef.current) {
      const dummy = new Object3D();

      // Отримуємо ray від камери через курсор
      const x = mouse.current.x;
      const y = mouse.current.y;
      const raycaster = new Raycaster();
      raycaster.setFromCamera({ x, y }, camera);
      const rayOrigin = raycaster.ray.origin.clone();
      const rayDir = raycaster.ray.direction.clone().normalize();

      for (let i = 0; i < bigTransforms.length; i++) {
        let pos;
        let scale = bigTransforms[i].scale;
        let scaleZ = scale;

        // --- Вибух ---
        if (
          sphereState === "exploding" &&
          animationRef.current.mode === "explosion" &&
          explosionStarted
        ) {
          const t = Math.min(animationRef.current.time / explosionDuration, 1);
          const easeT = explosionEase(t);
          const from = explosionFromPositions.current[i];
          const direction = bigTransforms[i].basePosition.clone().normalize();
          const to = direction.clone().multiplyScalar(explosionRadius);
          pos = from.clone().lerp(to, easeT);
          scaleZ = scale;
        }
        // --- Стиснення: compressCount будь-яких кубиків летять у центр ---
        else if (sphereState === "compressing" && i < compressCount) {
          const delay = (i / compressCount) * compressDuration;
          const animTime = animationRef.current.time;
          let t = 0;
          if (animTime > delay) {
            t = Math.min((animTime - delay) / (compressDuration - delay), 1);
          }
          pos = bigTransforms[i].basePosition
            .clone()
            .lerp(new Vector3(0, 0, 0), t)
            .add(
              i >= bigCount
                ? bigTransforms[i].jitterDirection
                    .clone()
                    .multiplyScalar(surfaceJitter)
                : new Vector3(0, 0, 0),
            );
        }
        // --- Решта кубиків залишаються на місці ---
        else {
          let radius = sphereRadius;
          pos = bigTransforms[i].basePosition
            .clone()
            .normalize()
            .multiplyScalar(radius)
            .add(
              i >= bigCount
                ? bigTransforms[i].jitterDirection
                    .clone()
                    .multiplyScalar(surfaceJitter)
                : new Vector3(0, 0, 0),
            );
          if (groupRef.current) {
            groupRef.current.position.z = 0;
          }
        }

        if (animatedRadius > 0 && isPointerActive) {
          const v = pos.clone().sub(rayOrigin);
          const t_proj = v.dot(rayDir);
          const closest = rayOrigin
            .clone()
            .add(rayDir.clone().multiplyScalar(t_proj));
          const dist = pos.distanceTo(closest);

          if (dist < animatedRadius) {
            const repelDir = pos.clone().sub(closest).normalize();
            pos.add(repelDir.multiplyScalar((animatedRadius - dist) * 0.7));
          }
        }

        bigTransforms[i].position.lerp(pos, 0.14);

        // --- Плавне зникнення кубиків з -z після вибуху ---
        let visible = true;
        let fade = 1;
        if (
          sphereState === "exploding" &&
          animationRef.current.mode === "explosion" &&
          // !animationRef.current.active &&
          negativeZIndices.includes(i)
        ) {
          if (!fadeTimers.current[i]) fadeTimers.current[i] = 0;
          fadeTimers.current[i] += delta;
          fade = Math.max(0, 1 - fadeTimers.current[i] / fadeDuration);
          if (fade === 0) visible = false;
        } else {
          fadeTimers.current[i] = 0;
        }

        if (visible) {
          dummy.position.copy(bigTransforms[i].position);
          dummy.matrix.copy(bigTransforms[i].matrix);
          dummy.rotation.set(
            bigTransforms[i].randomX || 0,
            bigTransforms[i].randomY || 0,
            bigTransforms[i].randomZ || 0,
          );
          dummy.scale.set(
            bigTransforms[i].scale * fade,
            bigTransforms[i].scale * fade,
            scaleZ * fade,
          );
          applyLevitation(
            dummy,
            bigTransforms[i].levitate,
            t,
            levitateStrength,
          );
          dummy.updateMatrix();
          bigMeshRef.current.setMatrixAt(i, dummy.matrix);
        } else {
          dummy.position.set(9999, 9999, 9999);
          dummy.scale.set(0, 0, 0);
          dummy.updateMatrix();
          bigMeshRef.current.setMatrixAt(i, dummy.matrix);
        }
      }
      bigMeshRef.current.instanceMatrix.needsUpdate = true;
    }

    // --- Floating cubes ---
    if (floatingMeshRef.current) {
      const dummy = new Object3D();
      for (let i = 0; i < floatingTransforms.length; i++) {
        const tr = floatingTransforms[i];
        // Левітація
        const levitateOffset =
          Math.sin(t * 0.7 + tr.levitate) * levitateStrength;
        dummy.position
          .copy(tr.position)
          .addScaledVector(new Vector3(0, 1, 0), levitateOffset);
        dummy.rotation.set(
          tr.randomX + t * 0.2,
          tr.randomY + t * 0.15,
          tr.randomZ + t * 0.1,
        );
        dummy.scale.set(tr.scale, tr.scale, tr.scale);
        dummy.updateMatrix();
        floatingMeshRef.current.setMatrixAt(i, dummy.matrix);
      }
      floatingMeshRef.current.instanceMatrix.needsUpdate = true;
    }
  });

  function startExplosion() {
    // --- ВИКЛИК ПОДІЇ ПОЧАТКУ ВИБУХУ ---
    if (typeof onExplosionStart === "function") {
      onExplosionStart();
    }
    explosionFromPositions.current = bigTransforms.map((tr, i) => {
      if (i < bigCount) {
        return tr.basePosition
          .clone()
          .normalize()
          .multiplyScalar(sphereRadius * compressScale);
      } else {
        return tr.basePosition
          .clone()
          .normalize()
          .multiplyScalar(sphereRadius)
          .add(tr.jitterDirection.clone().multiplyScalar(surfaceJitter));
      }
    });
    setExplosionStarted(true);
    animationRef.current = {
      from: 0,
      to: 1,
      time: 0,
      active: true,
      mode: "explosion",
    };
  }

  function startRadiusAnimation(toRadius) {
    animationRef.current = {
      from: currentRadius,
      to: toRadius,
      time: 0,
      active: true,
      mode: undefined,
    };
  }

  useEffect(() => {
    setSphereState(defaultState);
    if (defaultState === "exploding") {
      setCurrentRadius(explosionRadius);
      setExplosionStarted(true);

      // Заповнюємо explosionFromPositions, як у startExplosion
      explosionFromPositions.current = bigTransforms.map((tr, i) => {
        if (i < bigCount) {
          return tr.basePosition
            .clone()
            .normalize()
            .multiplyScalar(sphereRadius * compressScale);
        } else {
          return tr.basePosition
            .clone()
            .normalize()
            .multiplyScalar(sphereRadius)
            .add(tr.jitterDirection.clone().multiplyScalar(surfaceJitter));
        }
      });

      // Ставимо animationRef у "завершений вибух"
      animationRef.current = {
        from: 0,
        to: 1,
        time: explosionDuration,
        active: false,
        mode: "explosion",
      };
    } else {
      setCurrentRadius(sphereRadius);
      setExplosionStarted(false);
      animationRef.current = {
        from: sphereRadius,
        to: sphereRadius,
        time: 0,
        active: false,
        mode: undefined,
      };
    }
    // eslint-disable-next-line
  }, [
    defaultState,
    explosionRadius,
    sphereRadius,
    bigTransforms,
    bigCount,
    compressScale,
    surfaceJitter,
  ]);

  useEffect(() => {
    if (
      triggerExplosion &&
      sphereState !== "compressing" &&
      sphereState !== "exploding"
    ) {
      if (enableShake) setIsShaking(true);
      shakeTime.current = 0;

      setSphereState("compressing");
      startRadiusAnimation(sphereRadius * compressScale);
    }
  }, [triggerExplosion]);

  useEffect(() => {
    if (triggerAssemble && sphereState === "exploding") {
      setSphereState("normal");
      startRadiusAnimation(sphereRadius);
    }
  }, [triggerAssemble]);

  useEffect(() => {
    // Якщо вимкнули стискання — повертаємо у normal
    if (!enableCompress && sphereState === "compressing") {
      setSphereState("normal");
      setCurrentRadius(sphereRadius);
      animationRef.current.active = false;
    }
    // Якщо вимкнули вибух — повертаємо у normal
    if (!enableExplosion && sphereState === "exploding") {
      setSphereState("normal");
      setCurrentRadius(sphereRadius);
      animationRef.current.active = false;
    }
    // Якщо вимкнули трясіння — вимикаємо його
    if (!enableShake && isShaking) {
      setIsShaking(false);
      shakeTime.current = 0;
    }
  }, [
    enableCompress,
    enableExplosion,
    enableShake,
    sphereRadius,
    sphereState,
    isShaking,
  ]);

  if (!geometry || !material) return null;

  return (
    <group ref={groupRef} layers={layers}>
      <instancedMesh
        ref={bigMeshRef}
        args={[geometry, material, bigTransforms.length]}
        frustumCulled={true}
      />
      <instancedMesh
        ref={floatingMeshRef}
        args={[geometry, material, floatingTransforms.length]}
        frustumCulled={true}
      />
      {/* Додаємо HTML-блоки та інші компоненти */}
      {children}
    </group>
  );
}
