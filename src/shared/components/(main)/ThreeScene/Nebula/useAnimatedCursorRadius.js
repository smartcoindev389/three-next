import { useState, useEffect } from "react";
import { useFrame } from "@react-three/fiber";

/**
 * Хук для анімації радіусу дії курсора
 * @param {boolean} enableMouse
 * @param {boolean} isPointerActive
 * @param {number} maxRadius
 * @param {number} cursorRadiusLerp
 * @returns {[number, function]}
 */
export function useAnimatedCursorRadius(
  enableMouse,
  isPointerActive,
  maxRadius,
  cursorRadiusLerp,
) {
  const [animatedRadius, setAnimatedRadius] = useState(maxRadius);
  const [lastPointerMove, setLastPointerMove] = useState(Date.now());
  const pointerTimeout = 100; // мс без руху для згасання

  // Відстеження руху курсора для анімації радіусу
  useEffect(() => {
    if (!enableMouse) return;
    const handleMouseMove = () => setLastPointerMove(Date.now());
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [enableMouse]);

  useFrame(() => {
    const now = Date.now();
    const isActive = now - lastPointerMove < pointerTimeout && isPointerActive;
    const radiusTarget = isActive ? maxRadius : 0;
    setAnimatedRadius((r) => {
      const next = r + (radiusTarget - r) * cursorRadiusLerp;
      if (Math.abs(next - radiusTarget) < 0.01) return radiusTarget;
      return next;
    });
  });

  return [animatedRadius, setLastPointerMove];
}
