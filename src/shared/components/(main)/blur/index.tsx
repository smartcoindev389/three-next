"use client";

import clsx from "clsx";
import styles from "./style.module.scss";
import { FC, useEffect, useRef } from "react";
import { CanvasGradient } from "shared/components/(main)/canvas-gradient";
import { gsap } from "gsap";

interface IBlur {
  children?: React.ReactNode;
  className?: string;
  isBorder?: boolean;
  isBorderHover?: boolean;
  isAnimation?: boolean;
}

export const Blur: FC<IBlur> = ({
  children,
  className,
  isBorder = false,
  isBorderHover = false,
  isAnimation = false,
}) => {
  const divRef = useRef(null);

  useEffect(() => {
    if (isAnimation) {
      const xRange = 15 + Math.random() * 40;
      const yRange = 10 + Math.random() * 30;
      const duration = 3 + Math.random() * 2;
      const delay = Math.random() * 10;
      const element = divRef.current;
      if (!element) return;

      gsap.fromTo(
        element,
        {
          "--x": "0px",
          "--y": "0px",
          "--opacity": "1",
          x: 0,
          y: 0,
        },
        {
          "--x": `${-xRange}px`,
          "--y": `${-yRange}px`,
          x: `${-xRange / 6}px`,
          y: `${-yRange / 6}px`,
          "--opacity": "0",
          duration: duration,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
          delay: delay,
        },
      );

      gsap.to(element, {
        "--y": `${yRange}px`,
        duration: duration * 0.7,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
        delay: delay + duration * 0.3,
      });
    }
  }, [isAnimation]);

  return (
    <div
      ref={divRef}
      className={clsx(
        styles.blur,
        className,
        isBorder && styles.border,
        isBorderHover && styles.borderHover,
      )}
    >
      {children}
      {isBorder && (
        <CanvasGradient
          data={[
            { color: "rgba(0, 0, 0, 0)", index: 0.1 },
            { color: "rgba(0, 0, 0, 0)", index: 0.3 },
            { color: "rgba(0, 0, 0, 0)", index: 0.5 },
            { color: "rgba(0, 0, 0, 0)", index: 0.7 },
            { color: "#0080D0", index: 0.9 },
          ]}
          speed={5}
        />
      )}
    </div>
  );
};
