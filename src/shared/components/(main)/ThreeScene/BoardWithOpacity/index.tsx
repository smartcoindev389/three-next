import React, { forwardRef, memo } from "react";
import { useFrame } from "@react-three/fiber";
import { Group } from "three";
import { Board } from "../Board";
import { BoardProps } from "@/types";

type BoardWithOpacityProps = Omit<BoardProps, "opacity">;

export const BoardWithOpacity = memo(
  forwardRef<Group, BoardWithOpacityProps>((props, ref) => {
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
        <Board {...props} opacity={currentOpacity} ref={ref} />
      </group>
    );
  }),
);

BoardWithOpacity.displayName = "BoardWithOpacity";
