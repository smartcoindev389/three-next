import { Group } from "three";
import { Stars } from "@react-three/drei";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";

const Particle = () => {
  const ref = useRef({} as Group);
  useFrame(() => {
    // ref.current.rotation.y += -0.001;
    // ref.current.rotation.x += 0.001;
  });
  return (
    <group ref={ref}>
      <Stars
        radius={400}
        depth={50}
        count={10000}
        factor={6}
        saturation={9}
        speed={3}
      />
    </group>
  );
};

export default Particle;
