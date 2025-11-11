import { useRef } from "react";
import { useFrame } from "@react-three/fiber";

export default function GlowingCube({
  position = [0, 0, 0],
  size = 3,
  lampSize = 2.2,
  glassColor = "#b3e0ff",
  lampColor = "#00aaff",
}) {
  const groupRef = useRef();
  const lampRef = useRef();

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.01;
      groupRef.current.rotation.x += 0.005;
    }
    if (lampRef.current) {
      lampRef.current.material.emissiveIntensity =
        8 + Math.sin(Date.now() * 0.001) * 4;
    }
  });

  return (
    <group position={position} ref={groupRef}>
      {/* Матове скло */}
      <mesh>
        <boxGeometry args={[size, size, size]} />
        <meshPhysicalMaterial
          color={glassColor}
          roughness={0.7}
          metalness={0.05}
          transmission={0.85}
          thickness={0.4}
          ior={1.5}
          transparent
          opacity={0.85}
          reflectivity={0.1}
          clearcoat={0.2}
        />
      </mesh>
      {/* Підсвічена внутрішня оболонка */}
      <mesh>
        <boxGeometry args={[size * 0.98, size * 0.98, size * 0.98]} />
        <meshBasicMaterial
          color={lampColor}
          transparent
          opacity={0.18}
          toneMapped={false}
        />
      </mesh>
      {/* Синя лампа всередині */}
      <mesh ref={lampRef} position={[0, 0, 0]}>
        <sphereGeometry args={[lampSize, 32, 32]} />
        <meshStandardMaterial
          color={lampColor}
          emissive={lampColor}
          emissiveIntensity={8}
          roughness={0.3}
          metalness={0.1}
        />
      </mesh>
      {/* Джерело світла */}
      <pointLight
        position={[0, 0, 0]}
        color={lampColor}
        intensity={15}
        distance={size * 0.95}
        decay={2}
        castShadow={false}
      />
    </group>
  );
}
