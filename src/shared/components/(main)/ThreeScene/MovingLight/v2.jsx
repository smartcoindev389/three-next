"use client";
import { useRef, useEffect, forwardRef, useImperativeHandle } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

const MovingLightV2 = forwardRef(
  (
    {
      radius = 28, // Радіус руху ліхтаря навколо кулі
      speed = 0.65, // Швидкість обертання ліхтаря
      color = "#621e72", // Колір світла і кружечків
      intensity = 29, // Яскравість світла
      distance = 49, // Максимальна відстань дії світла
      decay = 0.09, // Швидкість згасання світла
      offset = 0, // Додаткове зміщення відносно кулі (по camDir)
      angle = Math.PI / 8, // Кут розкриття центрального ліхтарика (spotLight)
      edgeAngle = Math.PI / 10, // Кут розкриття для крайніх ліхтарів (індивідуально)
      penumbra = 0.1, // М'якість країв світлового конуса
      fixed = false, // Якщо true — ліхтарі не рухаються, а стоять по центру
      count = 5, // Кількість ліхтарів (5: два верхніх, центральний, два нижніх)
      verticalStep = 10, // Відстань між ліхтарями по Y
      edgeScale = 0.4, // Масштаб крайніх ліхтарів
      startPhase = 0, // Стартова фаза (кут) для початку руху світла, в радіанах
      layers = 0, // Індекси слоєв, на яких мають бути ліхтарі
    },
    ref,
  ) => {
    // Масиви рефів для кожного ліхтаря, target і кружечка
    const lightRefs = Array.from({ length: count }, () => useRef());
    const targetRefs = Array.from({ length: count }, () => useRef());
    const sphereRefs = Array.from({ length: count }, () => useRef());
    const { camera, scene } = useThree();

    const refMovingLightV2 = useRef();

    // Прокидаємо реф наружу
    useImperativeHandle(
      ref,
      () => ({
        group: refMovingLightV2.current,
        lights: lightRefs.map((ref) => ref.current),
        targets: targetRefs.map((ref) => ref.current),
        spheres: sphereRefs.map((ref) => ref.current),
      }),
      [],
    );

    // Додаємо target для кожного ліхтаря у сцену
    useEffect(() => {
      targetRefs.forEach((ref) => {
        if (ref.current) scene.add(ref.current);
      });
      return () => {
        targetRefs.forEach((ref) => {
          if (ref.current) scene.remove(ref.current);
        });
      };
    }, [scene, targetRefs]);

    useFrame((state) => {
      const camDir = camera.position.clone().normalize();
      const up = new THREE.Vector3(0, 1, 0);
      const right = new THREE.Vector3().crossVectors(up, camDir).normalize();

      for (let i = 0; i < count; i++) {
        // Зміщення по Y для кожного ліхтаря (розташування по вертикалі)
        const yOffset = (i - (count - 1) / 2) * verticalStep;

        let pos;
        if (fixed) {
          // Якщо fixed — ліхтарі стоять по центру
          pos = camDir.clone().multiplyScalar(radius + offset);
          pos.y += yOffset;
        } else {
          // Якщо не fixed — рухаються по екватору
          const t = state.clock.getElapsedTime();
          // Додаємо startPhase до кута руху
          const angleMove = Math.PI / 2 - Math.PI * (t * speed) + startPhase;
          const base = right
            .clone()
            .multiplyScalar(Math.sin(angleMove) * radius)
            .add(camDir.clone().multiplyScalar(Math.cos(angleMove) * radius));
          pos = base.clone().add(camDir.clone().multiplyScalar(offset));
          pos.y += yOffset;
        }

        // fade — плавне згасання світла на задній частині кулі
        if (lightRefs[i].current) {
          lightRefs[i].current.position.copy(pos);
          lightRefs[i].current.target = targetRefs[i].current;
          lightRefs[i].current.intensity = intensity;
          // Для крайніх ліхтарів використовуємо edgeAngle, для центрального — angle
          lightRefs[i].current.angle =
            i === 0 || i === count - 1 ? edgeAngle : angle;
        }
        // Target завжди у центрі кулі
        if (targetRefs[i].current) {
          targetRefs[i].current.position.set(0, 0, 0);
          targetRefs[i].current.updateMatrixWorld();
        }
        // Оновлюємо позицію кружечка та масштабуємо крайні
        if (sphereRefs[i].current) {
          sphereRefs[i].current.position.copy(pos);
          let scale = 1;
          if (i === 0 || i === count - 1) scale = edgeScale;
          sphereRefs[i].current.scale.set(scale, scale, scale);
        }
      }
    });

    return (
      <group ref={refMovingLightV2}>
        {/* Ліхтарі */}
        {Array.from({ length: count }).map((_, i) => (
          <spotLight
            key={i}
            ref={lightRefs[i]}
            color={color}
            intensity={intensity}
            distance={distance}
            decay={decay}
            angle={i === 0 || i === count - 1 ? edgeAngle : angle}
            penumbra={penumbra}
            castShadow={false}
            layers={layers}
          />
        ))}
        {Array.from({ length: count }).map((_, i) => (
          <object3D
            layers={layers}
            key={i}
            ref={targetRefs[i]}
            position={[0, 0, 0]}
          />
        ))}
      </group>
    );
  },
);

MovingLightV2.displayName = "MovingLightV2";

export default MovingLightV2;
