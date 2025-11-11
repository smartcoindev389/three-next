import { useEffect, useMemo, useRef, useState } from "react";
import { useLoader, useFrame, useThree } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { Vector3, Object3D, Raycaster } from "three";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";
import { useHome } from "providers/home";
import { gsapAsync } from "utils/gsapAsync";
import gsap from "gsap";
import * as THREE from "three";

const ANIMATION_STATE = {
  IDLE: "IDLE",
  SHAKING: "SHAKING",
  EXPLODING: "EXPLODING",
};

// Уменьшена общая продолжительность и убрана задержка
const SHAKE_DURATION = 2.2; // Увеличено для более плавного нарастания
const EXPLOSION_DURATION = 1.0; // Уменьшено для более быстрого взрыва

export function Nebula({
  count,
  size = 2,
  isSpin = true,
  bigCount = 100,
  isStatic = false,
}) {
  const nebulaGroupRef = useRef();
  const smallGroupRef = useRef();
  const bigGroupRef = useRef();
  const smallMeshRef = useRef();
  const bigMeshRef = useRef();
  const tempObject = useMemo(() => new Object3D(), []);
  const { mouse, camera, viewport } = useThree();
  const raycaster = useMemo(() => new Raycaster(), []);
  const mousePosition = useMemo(() => new Vector3(), []);
  const mouseWorld = useMemo(() => new Vector3(), []);
  const dirFromMouse = useMemo(() => new Vector3(), []);
  const { setNebulaGroupRef } = useHome();

  const [animationState, setAnimationState] = useState(ANIMATION_STATE.IDLE);
  const [shakeProgress, setShakeProgress] = useState(0);
  const [explosionProgress, setExplosionProgress] = useState(0);

  const originalCameraState = useRef({
    position: null,
    zoom: null,
  });

  const shakeObj = useRef({ progress: 0 });
  const explodeObj = useRef({ progress: 0 });

  const gltf = useLoader(GLTFLoader, "/models/cube/Cube L.glb", (loader) => {
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath("/draco/");
    loader.setDRACOLoader(dracoLoader);
  });

  const { geometry, material } = useMemo(() => {
    const firstMesh = gltf.scene.getObjectByProperty("type", "Mesh");
    return {
      geometry: firstMesh ? firstMesh.geometry.clone() : null,
      material: firstMesh ? firstMesh.material.clone() : null,
    };
  }, [gltf]);

  const { smallPositions, bigPositions, smallOffsets, bigOffsets } =
    useMemo(() => {
      const smallPositions = [];
      const bigPositions = [];
      const smallOffsets = [];
      const bigOffsets = [];

      const centerSafeZone = 12;
      const bigSize = 0.6;
      const maxRadius = 25;

      for (let i = 0; i < count; i++) {
        const theta = Math.random() * 2 * Math.PI;
        const phi = Math.acos(2 * Math.random() - 1);
        const r = centerSafeZone + Math.pow(Math.random(), 4) * 7;

        const basePosition = new Vector3(
          r * Math.sin(phi) * Math.cos(theta),
          r * Math.sin(phi) * Math.sin(theta),
          r * Math.cos(phi),
        );

        smallPositions.push({
          basePosition: basePosition.clone(),
          rotation: [
            Math.random() * Math.PI,
            Math.random() * Math.PI,
            Math.random() * Math.PI,
          ],
          scale: size * (0.5 + Math.random() * 1.5),
          explosionDirection: basePosition.clone().normalize(),
          explosionSpeed: 1.8 + Math.random() * 1.2,
          explosionDistance: 50 + Math.random() * 40,
          explosionDelay: Math.random() * 0.05,
          previousPosition: basePosition.clone(),
          velocity: new Vector3(0, 0, 0),
          shakeOffset: new Vector3(
            (Math.random() - 0.5) * 2,
            (Math.random() - 0.5) * 2,
            (Math.random() - 0.5) * 2,
          ),
          shrinkSpeed: 0.9 + Math.random() * 0.2,
          maxShrink: 0.6 + Math.random() * 0.1,
        });
        smallOffsets.push(Math.random() * 1000);
      }

      for (let i = 0; i < bigCount; i++) {
        const theta = Math.random() * 2 * Math.PI;
        const phi = Math.acos(2 * Math.random() - 1);
        // const r = Math.max(centerSafeZone, Math.random() * maxRadius);
        const r =
          centerSafeZone +
          Math.pow(Math.random(), 2) * (maxRadius - centerSafeZone) * 0.4;
        const jitter = () => (Math.random() - 0.5) * 1;

        const basePosition = new Vector3(
          r * Math.sin(phi) * Math.cos(theta) * 4.2,
          r * Math.sin(phi) * Math.sin(theta) * 2,
          r * Math.cos(phi) * jitter() * 2,
        );

        bigPositions.push({
          basePosition: basePosition.clone(),
          rotation: [
            Math.random() * Math.PI,
            Math.random() * Math.PI,
            Math.random() * Math.PI,
          ],
          scale: bigSize * (0.4 + Math.random()),
          explosionDirection: basePosition.clone().normalize(),
          explosionSpeed: 1.5 + Math.random() * 1.0,
          explosionDistance: 200 + Math.random() * 150,
          explosionDelay: Math.random() * 0.04, // Минимальная задержка
          previousPosition: basePosition.clone(),
          velocity: new Vector3(0, 0, 0),
          shakeOffset: new Vector3(
            (Math.random() - 0.5) * 1.5,
            (Math.random() - 0.5) * 1.5,
            (Math.random() - 0.5) * 1.5,
          ),
          shrinkSpeed: 0.9 + Math.random() * 0.2,
          maxShrink: 0.6 + Math.random() * 0.1,
        });
        bigOffsets.push(Math.random() * 1000);
      }

      return { smallPositions, bigPositions, smallOffsets, bigOffsets };
    }, [count, size, bigCount]);

  useEffect(() => {
    const applyMatrices = (ref, positions) => {
      if (!ref.current) return;
      for (let i = 0; i < positions.length; i++) {
        const { basePosition, rotation, scale } = positions[i];
        tempObject.position.copy(basePosition);
        tempObject.rotation.set(...rotation);
        tempObject.scale.setScalar(scale * 0.2);
        tempObject.updateMatrix();
        ref.current.setMatrixAt(i, tempObject.matrix);
      }
      ref.current.instanceMatrix.needsUpdate = true;
    };

    applyMatrices(smallMeshRef, smallPositions);
    applyMatrices(bigMeshRef, bigPositions);
  }, [smallPositions, bigPositions, tempObject]);

  useEffect(() => {
    if (!originalCameraState.current.position) {
      originalCameraState.current.position = camera.position.clone();
      originalCameraState.current.zoom = camera.zoom;
    }
  }, [camera]);

  const explode = async (callback) => {
    setShakeProgress(0);
    setExplosionProgress(0);

    shakeObj.current.progress = 0;
    explodeObj.current.progress = 0;

    // Начинаем тряску
    setAnimationState(ANIMATION_STATE.SHAKING);

    // Тряска экрана с нарастающей интенсивностью
    const shakeTimeline = gsap.timeline();

    // Тряска экрана с постепенным нарастанием
    shakeTimeline.to(".three-shake", {
      x: () => Math.random() * 16 - 8, // Увеличенная амплитуда
      y: () => Math.random() * 16 - 8,
      duration: 0.1,
      ease: "none",
      repeat: -1,
      onRepeat: function () {
        // Нарастающая интенсивность тряски
        const progress = shakeObj.current.progress;
        const intensity = Math.pow(progress, 2) * 40; // Квадратичное нарастание
        gsap.set(".three-shake", {
          x: (Math.random() - 0.5) * intensity,
          y: (Math.random() - 0.5) * intensity,
        });
      },
    });

    // Прогресс тряски с плавным переходом к взрыву
    await gsapAsync(shakeObj.current, {
      progress: 1,
      duration: SHAKE_DURATION,
      ease: "power2.out", // Ускорение к концу
      onUpdate: () => {
        setShakeProgress(shakeObj.current.progress);
      },
    });

    // Сразу переходим к взрыву без остановки тряски
    setAnimationState(ANIMATION_STATE.EXPLODING);

    // Останавливаем тряску экрана резко в момент взрыва
    shakeTimeline.kill();
    gsap.set(".three-shake", { x: 0, y: 0 });

    await gsapAsync(explodeObj.current, {
      progress: 1,
      duration: EXPLOSION_DURATION,
      ease: "expo.out",
      onUpdate: () => {
        setExplosionProgress(explodeObj.current.progress);
      },
    });

    if (callback && typeof callback === "function") {
      callback();
    }
  };

  const rebuild = async (callback, onComplete) => {
    setShakeProgress(0);
    setExplosionProgress(1);

    shakeObj.current.progress = 0;
    explodeObj.current.progress = 1;

    if (callback && typeof callback === "function") {
      callback();
    }

    setAnimationState(ANIMATION_STATE.EXPLODING);

    await gsapAsync(explodeObj.current, {
      progress: 0,
      duration: EXPLOSION_DURATION,
      ease: "linear",
      onUpdate: () => {
        setExplosionProgress(explodeObj.current.progress);
      },
    });

    setAnimationState(ANIMATION_STATE.IDLE);

    if (onComplete && typeof onComplete === "function") {
      onComplete();
    }
  };

  const animateGroup = (positions, offsets, ref, isMainSphere = true, time) => {
    if (!ref.current) return;

    const repulsionStrength = 2.3;
    const repulsionRadius = 10;
    const centerPoint = new Vector3(0, 0, 0);

    for (let i = 0; i < positions.length; i++) {
      const position = positions[i];
      const {
        basePosition,
        rotation,
        scale,
        explosionDirection,
        explosionSpeed,
        explosionDistance,
        explosionDelay,
        previousPosition,
        velocity,
        shakeOffset,
      } = position;

      const offset = offsets[i];
      let targetPosition = basePosition.clone();
      let currentScale = scale * 0.2;
      let currentRotation = [...rotation]; // Убираем автоматическое вращение
      let stretchScale = new Vector3(1, 1, 1);

      if (isMainSphere) {
        // Убираем постоянное вращение кубиков в обычном состоянии
        // currentRotation остается статичным

        // Эффект тряски с нарастающей интенсивностью
        if (animationState === ANIMATION_STATE.SHAKING) {
          // Квадратичное нарастание интенсивности тряски
          // const shakeIntensity = Math.pow(shakeProgress, 2); // Увеличена максимальная интенсивность

          // // Более хаотичное дрожание с нарастанием
          // const frequency = 10 + shakeProgress * 20; // Увеличивающаяся частота
          // const shakeX =
          //   Math.sin(time * frequency + offset * 3) *
          //   shakeIntensity *
          //   shakeOffset.x;
          // const shakeY =
          //   Math.cos(time * (frequency * 1.3) + offset * 2.5) *
          //   shakeIntensity *
          //   shakeOffset.y;
          // const shakeZ =
          //   Math.sin(time * (frequency * 0.8) + offset * 2) *
          //   shakeIntensity *
          //   shakeOffset.z;

          // targetPosition.x += shakeX;
          // targetPosition.y += shakeY;
          // targetPosition.z += shakeZ;

          // Убираем размытие и дополнительное вращение
          // Частицы сжимаются к центру во время тряски
          const shrinkAmount = Math.pow(shakeProgress, 1.5) * 0.2; // Сжатие до 40%
          targetPosition.lerp(centerPoint, shrinkAmount);
          currentScale *= 1 - shakeProgress * 0.15; // Уменьшение размера
        }

        if (animationState === ANIMATION_STATE.IDLE) {
          const mouseDistance = mouseWorld.distanceTo(basePosition);
          const mouseScaleFactor = Math.max(
            0,
            1 - mouseDistance / repulsionRadius,
          );
          currentScale *= 1 + mouseScaleFactor * 0.5;
        }

        // Взрыв начинается сразу с текущих позиций тряски
        if (animationState === ANIMATION_STATE.EXPLODING) {
          if (i > 450) {
            // залишити лише перші 5 кубів
            // Залишаємо куб на місці та ховаємо його
            targetPosition.copy(basePosition); // не рухаємо!
            currentScale = 0;
            previousPosition.copy(basePosition);
          } else {
            const delayedProgress = Math.max(
              0,
              explosionProgress - explosionDelay * 0.1,
            );
            const adjustedProgress = Math.min(
              1,
              delayedProgress * (1 + explosionDelay * 0.2),
            );

            if (adjustedProgress > 0) {
              const explosionEase = Math.pow(adjustedProgress, 1.4);
              const finalDirection = explosionDirection.clone().normalize();
              const currentDistance =
                explosionDistance * explosionEase * explosionSpeed;

              // Стартуем с позиции максимального сжатия
              const shrinkAmount = 0.4; // Фиксированное сжатие 40%
              const startPos = basePosition
                .clone()
                .lerp(centerPoint, shrinkAmount);
              const newPosition = startPos
                .clone()
                .add(finalDirection.clone().multiplyScalar(currentDistance));

              // Расчет скорости для растяжения
              velocity.subVectors(newPosition, previousPosition);
              const velocityMagnitude = velocity.length();

              // Эффект растяжения
              if (velocityMagnitude > 0.05) {
                const stretchAmount = Math.min(4.0, velocityMagnitude * 0.8);

                // const stretchAmount = Math.min(2.0, velocityMagnitude * 0.5);

                const velocityDir = velocity.clone().normalize();

                const absVelDir = new Vector3(
                  Math.abs(velocityDir.x),
                  Math.abs(velocityDir.y),
                  Math.abs(velocityDir.z),
                );

                stretchScale.set(
                  1 + absVelDir.x * stretchAmount,
                  1 + absVelDir.y * stretchAmount,
                  1 + absVelDir.z * stretchAmount,
                );
              }

              targetPosition.copy(newPosition);
              currentScale = scale * 0.2 * (1 + explosionEase * 2.0);
              previousPosition.copy(newPosition);

              // Убираем дополнительное вращение во время взрыва
            }
          }
        }
      }

      // Apply floating animation for idle state
      if (animationState === ANIMATION_STATE.IDLE || !isMainSphere) {
        const floatY = Math.sin(time * 1.5 + offset) * 0.2;
        const floatX = Math.sin(time * 0.8 + offset) * 0.15;
        const floatZ = Math.cos(time * 1.1 + offset) * 0.15;
        targetPosition.x += floatX;
        targetPosition.y += floatY;
        targetPosition.z += floatZ;

        // Mouse repulsion
        dirFromMouse.subVectors(basePosition, mouseWorld);
        const distance = dirFromMouse.length();
        if (distance < repulsionRadius) {
          dirFromMouse.normalize();
          const force = repulsionStrength * (1 - distance / repulsionRadius);
          targetPosition.x += dirFromMouse.x * force;
          targetPosition.y += dirFromMouse.y * force;
          targetPosition.z += dirFromMouse.z * force;
        }
      }

      // Apply transformations
      tempObject.position.copy(targetPosition);
      tempObject.rotation.set(...currentRotation);
      tempObject.scale.set(
        currentScale * stretchScale.x,
        currentScale * stretchScale.y,
        currentScale * stretchScale.z,
      );
      tempObject.updateMatrix();
      ref.current.setMatrixAt(i, tempObject.matrix);
    }
    ref.current.instanceMatrix.needsUpdate = true;
  };

  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    mousePosition.set(
      (mouse.x * viewport.width) / 2,
      (mouse.y * viewport.height) / 2,
      0,
    );
    raycaster.setFromCamera(mouse, camera);
    mouseWorld
      .copy(camera.position)
      .addScaledVector(raycaster.ray.direction, 30);

    animateGroup(smallPositions, smallOffsets, smallMeshRef, true, time);
    animateGroup(bigPositions, bigOffsets, bigMeshRef, true, time);

    const mesh = smallMeshRef.current;
    if (!mesh) return;

    const colors = new Float32Array(smallPositions.length * 3);
    for (let i = 0; i < smallPositions.length; i++) {
      colors[i * 3 + 0] = 0.1; // r
      colors[i * 3 + 1] = 0.2; // g
      colors[i * 3 + 2] = 0.4; // b
    }

    mesh.geometry.setAttribute(
      "instanceColor",
      new THREE.InstancedBufferAttribute(colors, 3),
    );

    if (
      isSpin &&
      nebulaGroupRef.current &&
      animationState === ANIMATION_STATE.IDLE
    ) {
      nebulaGroupRef.current.rotation.y += 0.0005;
    }
  });

  useEffect(() => {
    if (smallGroupRef.current) {
      smallGroupRef.current.explode = explode;
      smallGroupRef.current.rebuild = rebuild;
      if (!isStatic) {
        setNebulaGroupRef(smallGroupRef);
      }
    }
  }, [setNebulaGroupRef]);

  if (!geometry || !material) return null;

  return (
    <group ref={nebulaGroupRef}>
      <group ref={smallGroupRef}>
        <instancedMesh
          ref={smallMeshRef}
          args={[geometry, material, smallPositions.length]}
          frustumCulled={true}
        />
      </group>
      <group ref={bigGroupRef}>
        <instancedMesh
          ref={bigMeshRef}
          args={[geometry, material, bigPositions.length]}
          frustumCulled={true}
        />
      </group>
    </group>
  );
}
