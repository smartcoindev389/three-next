import gsap from "gsap";
import { useEffect, useRef } from "react";
import { useHome } from "providers/home";

export const MovingLight = ({ angle = 0 }) => {
  const lightRef = useRef(null);
  const { setLightsArrRef } = useHome();

  useEffect(() => {
    setLightsArrRef((prev) => [...prev, lightRef]);
  }, []);

  useEffect(() => {
    const light = lightRef.current;
    const obj = { angle };
    if (!light) return;
    gsap.to(obj, {
      angle: angle + Math.PI * 2,
      duration: 10,
      repeat: -1,
      ease: "sine.inOut",
      onUpdate: () => {
        const r = 20;
        const x = r * Math.cos(obj.angle);
        const z = r * Math.sin(obj.angle);
        light.position.set(x, 0, z);
      },
    });
  }, []);

  return (
    <pointLight
      ref={lightRef}
      intensity={300}
      distance={100}
      decay={0.085}
      color="pink"
    />
  );
};
