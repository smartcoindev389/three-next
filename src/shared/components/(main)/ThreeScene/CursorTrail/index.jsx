import React, { useRef, useMemo, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
export default function CursorParticles() {
  const particlesRef = useRef();
  const streaksRef = useRef();
  const { camera } = useThree();

  // Массивы для частиц
  const particles = useRef([]);
  const streaks = useRef([]);
  const maxParticles = 100;
  const maxStreaks = 300;

  // Геометрия для кружков
  const particlesGeometry = useMemo(() => {
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(maxParticles * 3);
    const sizes = new Float32Array(maxParticles);
    const alphas = new Float32Array(maxParticles);

    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("size", new THREE.BufferAttribute(sizes, 1));
    geometry.setAttribute("alpha", new THREE.BufferAttribute(alphas, 1));

    return geometry;
  }, [maxParticles]);

  // Геометрия для полосок
  const streaksGeometry = useMemo(() => {
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(maxStreaks * 6); // 2 точки на полоску
    const alphas = new Float32Array(maxStreaks * 2);

    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("alpha", new THREE.BufferAttribute(alphas, 1));

    return geometry;
  }, []);

  // Материал для белых кружков
  const particlesMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      uniforms: {
        pixelRatio: { value: Math.min(window.devicePixelRatio, 1) },
      },
      vertexShader: `
        attribute float size;
        attribute float alpha;
        uniform float pixelRatio;
        varying float vAlpha;
        
        void main() {
          vAlpha = alpha;
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = size * pixelRatio * (100.0 / -mvPosition.z);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        varying float vAlpha;
        
        void main() {
          float distanceToCenter = distance(gl_PointCoord, vec2(0.5));
          
          // Создаем яркий белый кружок с мягкими краями
          float circle = 1.0 - smoothstep(0.1, 0.5, distanceToCenter);
          float innerGlow = 1.0 - smoothstep(0.0, 0.2, distanceToCenter);
          
          float alpha = (circle * 0.1 + innerGlow * 1.8) * vAlpha;
          
          gl_FragColor = vec4(1.0, 1.0, 1.0, alpha);
        }
      `,
    });
  }, []);

  // Материал для полосок
  const streaksMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      vertexShader: `
        attribute float alpha;
        varying float vAlpha;
        
        void main() {
          vAlpha = alpha;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying float vAlpha;
        
        void main() {
          gl_FragColor = vec4(1.0, 1.0, 1.0, vAlpha);
        }
      `,
    });
  }, []);

  // Обработчик движения мыши
  useEffect(() => {
    let lastMouseTime = 0;
    let lastMousePos = new THREE.Vector2();

    const handleMouseMove = (event) => {
      const currentTime = Date.now();

      const mouseX = (event.clientX / window.innerWidth) * 2 - 1;
      const mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
      const vector = new THREE.Vector3(mouseX, mouseY, 0);
      vector.unproject(camera);

      const dir = vector.sub(camera.position).normalize();
      const distance = -camera.position.z / dir.z;
      const pos = camera.position.clone().add(dir.multiplyScalar(distance));

      const deltaX = mouseX - lastMousePos.x;
      const deltaY = mouseY - lastMousePos.y;

      const mouseDir = new THREE.Vector2(deltaX, deltaY).normalize();

      if (Math.random() < 0.95) {
        const angle = Math.atan2(mouseDir.y, mouseDir.x);
        const spread = 0.4;
        const speed = 0.05;
        const vx = Math.cos(angle + (Math.random() - 0.5) * spread) * speed;
        const vy = Math.sin(angle + (Math.random() - 0.5) * spread) * speed;
        const vz = (Math.random() - 0.5) * 0.03;

        const spreadRadius = 2.3;

        particles.current.push({
          x: pos.x + (Math.random() - 0.5) * spreadRadius,
          y: pos.y + (Math.random() - 0.5) * spreadRadius,
          z: pos.z + (Math.random() - 0.5) * spreadRadius * 0.3,
          vx,
          vy,
          vz,
          life: 1.0,
          size: Math.random() * 12 + 8,
        });
      }

      // Полоски залишаємо без змін
      if (currentTime - lastMouseTime < 50 && Math.random() < 0.4) {
        const angle = Math.random() * Math.PI * 2;
        const length = Math.random() * 1.5 + 0.5;
        const speed = Math.random() * 0.06 + 0.02;

        streaks.current.push({
          startX: pos.x,
          startY: pos.y,
          startZ: pos.z,
          endX: pos.x + Math.cos(angle) * length,
          endY: pos.y + Math.sin(angle) * length,
          endZ: pos.z + (Math.random() - 0.5) * 0.5,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          vz: (Math.random() - 0.5) * 0.01,
          life: 1.0,
          length: length,
        });
      }

      lastMouseTime = currentTime;
      lastMousePos.set(mouseX, mouseY);

      if (particles.current.length > maxParticles) {
        particles.current = particles.current.slice(-maxParticles);
      }
      if (streaks.current.length > maxStreaks) {
        streaks.current = streaks.current.slice(-maxStreaks);
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [camera]);

  useFrame(() => {
    // Обновляем кружки
    if (particlesRef.current) {
      const positions = particlesRef.current.geometry.attributes.position.array;
      const sizes = particlesRef.current.geometry.attributes.size.array;
      const alphas = particlesRef.current.geometry.attributes.alpha.array;

      particles.current = particles.current.filter((particle, index) => {
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.z += particle.vz;
        particle.life -= 0.015;

        // Замедляем частицы
        particle.vx *= 0.98;
        particle.vy *= 0.98;
        particle.vz *= 0.98;

        if (particle.life > 0 && index < maxParticles) {
          positions[index * 3] = particle.x;
          positions[index * 3 + 1] = particle.y;
          positions[index * 3 + 2] = particle.z;

          sizes[index] = particle.size;
          alphas[index] = Math.pow(particle.life, 1.5);

          return true;
        }
        return false;
      });

      // Очищаем неиспользуемые позиции
      for (let i = particles.current.length; i < maxParticles; i++) {
        positions[i * 3] = 0;
        positions[i * 3 + 1] = 0;
        positions[i * 3 + 2] = 0;
        alphas[i] = 0;
        sizes[i] = 0;
      }

      particlesRef.current.geometry.attributes.position.needsUpdate = true;
      particlesRef.current.geometry.attributes.size.needsUpdate = true;
      particlesRef.current.geometry.attributes.alpha.needsUpdate = true;
    }

    // Обновляем полоски
    if (streaksRef.current) {
      const positions = streaksRef.current.geometry.attributes.position.array;
      const alphas = streaksRef.current.geometry.attributes.alpha.array;

      streaks.current = streaks.current.filter((streak, index) => {
        streak.startX += streak.vx;
        streak.startY += streak.vy;
        streak.startZ += streak.vz;
        streak.endX += streak.vx;
        streak.endY += streak.vy;
        streak.endZ += streak.vz;
        streak.life -= 0.02;

        // Замедляем полоски
        streak.vx *= 0.96;
        streak.vy *= 0.96;

        if (streak.life > 0 && index < maxStreaks) {
          const i = index * 6;

          positions[i] = streak.startX;
          positions[i + 1] = streak.startY;
          positions[i + 2] = streak.startZ;
          positions[i + 3] = streak.endX;
          positions[i + 4] = streak.endY;
          positions[i + 5] = streak.endZ;

          const alpha = Math.pow(streak.life, 2);
          alphas[index * 2] = alpha;
          alphas[index * 2 + 1] = alpha * 0.3;

          return true;
        }
        return false;
      });

      // Очищаем неиспользуемые позиции
      for (let i = streaks.current.length; i < maxStreaks; i++) {
        const pos = i * 6;
        positions[pos] = 0;
        positions[pos + 1] = 0;
        positions[pos + 2] = 0;
        positions[pos + 3] = 0;
        positions[pos + 4] = 0;
        positions[pos + 5] = 0;
        alphas[i * 2] = 0;
        alphas[i * 2 + 1] = 0;
      }

      streaksRef.current.geometry.attributes.position.needsUpdate = true;
      streaksRef.current.geometry.attributes.alpha.needsUpdate = true;
      streaksRef.current.geometry.setDrawRange(0, streaks.current.length * 2);
    }
  });

  return (
    <>
      {/* Белые кружки */}
      <points
        ref={particlesRef}
        geometry={particlesGeometry}
        material={particlesMaterial}
      />

      {/* Полоски */}
      <lineSegments
        ref={streaksRef}
        geometry={streaksGeometry}
        material={streaksMaterial}
      />
    </>
  );
}
