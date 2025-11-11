import { useTexture } from "@react-three/drei";
import { useMemo } from "react";
import * as THREE from "three";

type ModelFBOProps = {
  src: string;
  photoW?: number;
  opacity?: number;
};

export default function ModelFBO({
  src,
  photoW = 4,
  opacity = 1,
}: ModelFBOProps) {
  const { texture } = useTexture({ texture: src });
  const { image } = texture;

  // Calculate photoH based on image aspect ratio
  const photoH = useMemo(() => {
    const aspectRatio = image.height / image.width;
    return photoW * aspectRatio;
  }, [image.width, image.height, photoW]);

  // Use photoW and calculated photoH for rendering size
  const planeArgs = useMemo(
    () => [photoW, photoH] as [number, number],
    [photoW, photoH]
  );

  // Border size (adjust as needed)
  const borderThickness = 0.15;
  const borderArgs = useMemo(
    () => [
      photoW + borderThickness,
      photoH + borderThickness
    ] as [number, number],
    [photoW, photoH]
  );

  // Display image with border frame
  return (
    <group>
      {/* Border frame */}
      <mesh position={[0, 0, -0.01]}>
        <planeGeometry args={borderArgs} />
        <meshBasicMaterial 
          color="#1E90FF"
          opacity={opacity} 
          transparent 
          toneMapped={false}
        />
      </mesh>
      
      {/* Image */}
      <mesh scale={[1, 1, 1]}>
        <planeGeometry args={planeArgs} />
        <meshBasicMaterial 
          map={texture} 
          opacity={opacity} 
          transparent 
          toneMapped={false}
        />
      </mesh>
    </group>
  );
}
