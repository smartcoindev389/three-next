import { useEffect } from "react";
import * as THREE from "three";

/**
 * Хук для визначення чи курсор над сферою
 * @param {number} sphereRadius
 * @param {THREE.Camera} camera
 * @param {function} setIsPointerActive
 */
export function usePointerOnSphere(sphereRadius, camera, setIsPointerActive) {
  useEffect(() => {
    const handlePointerMove = (e) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = -(e.clientY / window.innerHeight) * 2 + 1;
      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera({ x, y }, camera);

      const sphereCenter = new THREE.Vector3(0, 0, 0);
      const origin = raycaster.ray.origin.clone();
      const dir = raycaster.ray.direction.clone();
      const oc = origin.clone().sub(sphereCenter);

      const a = dir.dot(dir);
      const b = 2 * oc.dot(dir);
      const c = oc.dot(oc) - sphereRadius * sphereRadius;
      const discriminant = b * b - 4 * a * c;

      let intersect = null;
      if (discriminant >= 0) {
        const t1 = (-b - Math.sqrt(discriminant)) / (2 * a);
        const t2 = (-b + Math.sqrt(discriminant)) / (2 * a);
        const t = t1 > 0 ? t1 : t2 > 0 ? t2 : null;
        if (t !== null) {
          intersect = origin.clone().add(dir.multiplyScalar(t));
        }
      }

      setIsPointerActive(!!intersect);
    };
    const handlePointerOut = () => setIsPointerActive(false);

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerout", handlePointerOut);
    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerout", handlePointerOut);
    };
  }, [sphereRadius, camera, setIsPointerActive]);
}
