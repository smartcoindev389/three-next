import { useRef, useState, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import clsx from "clsx";
import styles from "./index.module.scss";

export function Projects({
  frontBlocks,
  explosionStarted,
  scrollOffsetY,
  visible = true,
  isPhone,
}) {
  const [blocksFlyProgress, setBlocksFlyProgress] = useState(() =>
    frontBlocks.map(() => 0),
  );
  const blocksFlyStart = useRef(false);
  const blocksFlyTime = useRef(0);

  useEffect(() => {
    if (explosionStarted) {
      blocksFlyStart.current = true;
      blocksFlyTime.current = 0;
      setBlocksFlyProgress(frontBlocks.map(() => 0));
    }
  }, [explosionStarted, frontBlocks.length]);

  useFrame((_, delta) => {
    if (!blocksFlyStart.current) return;
    blocksFlyTime.current += delta;
    setBlocksFlyProgress((prev) =>
      prev.map((progress, i) => {
        const delay = frontBlocks[i]?.flyDelay || 0;
        const duration = frontBlocks[i]?.flySpeed || 1;
        if (blocksFlyTime.current < delay) return 0;
        const localTime = blocksFlyTime.current - delay;
        const step = delta / duration;
        const next = Math.min(progress + step, 1);
        return localTime >= 0 ? next : 0;
      }),
    );
  });

  return (
    <>
      {frontBlocks.map((block, i) => {
        const start = block.startPosition || [0, 0, -1000];
        const end = block.finalPosition || block.position;
        const t = blocksFlyProgress[i] ?? 0;
        const time = performance.now() / 1000;
        const levitateY =
          Math.sin(time * 1.2 + (block.levitatePhase || 0)) * 0.5;
        const levitateX = Math.sin(time * 1.2 + 0) * 0.5;
        const pos = [
          start[0] + (end[0] - start[0]) * t + levitateX,
          start[1] + (end[1] - start[1]) * t + (scrollOffsetY || 0) + levitateY,
          start[2] + (end[2] - start[2]) * t,
        ];
        if (!explosionStarted) return null;
        return (
          <Html
            key={i}
            position={pos}
            rotation={block.rotation || [0, 0, 0]}
            center
            transform
            occlude
            className={clsx(styles.projectHtml, { [styles.visible]: visible })}
            pointerEvents="auto"
            style={{
              pointerEvents: "auto",
              opacity: visible ? 1 : 0,
              transition: "opacity 0.5s",
              ...(block.style || {}),
            }}
          >
            {block.html}
          </Html>
        );
      })}
    </>
  );
}
