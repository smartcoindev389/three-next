import React, { memo } from "react";
import { useFrame } from "@react-three/fiber";
import { Group } from "three";
import { Person } from "../Person";

interface PersonProps {
  assetPath: string;
  name: string;
  role?: string;
  description?: string;
  opacity?: number;
}

type PersonWithOpacityProps = Omit<PersonProps, "opacity">;

export const PersonWithOpacity = memo((props: PersonWithOpacityProps) => {
  const [currentOpacity, setCurrentOpacity] = React.useState(1);
  const groupRef = React.useRef<Group>(null);

  useFrame(() => {
    if (groupRef.current && groupRef.current.parent) {
      const parentOpacity = groupRef.current.parent.userData.opacity;
      if (parentOpacity !== undefined && parentOpacity !== currentOpacity) {
        setCurrentOpacity(parentOpacity);
      }
    }
  });

  return (
    <group ref={groupRef}>
      <Person {...props} opacity={currentOpacity} />
    </group>
  );
});

PersonWithOpacity.displayName = "PersonWithOpacity";
