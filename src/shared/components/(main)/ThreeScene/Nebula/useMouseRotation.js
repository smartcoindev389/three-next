import { useEffect } from "react";

/**
 * Хук для обробки руху миші та оновлення targetRotation
 * @param {boolean} enableMouse - чи вмикати обробку миші
 * @param {object} mouse - ref на об'єкт {x, y}
 * @param {object} targetRotation - ref на об'єкт {x, y}
 * @param {number} moveStrengthX
 * @param {number} moveStrengthY
 */
export function useMouseRotation(
  enableMouse,
  mouse,
  targetRotation,
  moveStrengthX,
  moveStrengthY,
) {
  useEffect(() => {
    if (!enableMouse) return;
    const handleMouseMove = (e) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
      targetRotation.current.y = mouse.current.x * moveStrengthX;
      targetRotation.current.x = mouse.current.y * moveStrengthY;
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [enableMouse, moveStrengthX, moveStrengthY, mouse, targetRotation]);
}
