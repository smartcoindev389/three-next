import clsx from "clsx";
import { ComponentPropsWithoutRef, FC, useEffect, useRef } from "react";
import styles from "./index.module.scss";
type IRadialGradient = ComponentPropsWithoutRef<"canvas">;
export const RadialGradient: FC<IRadialGradient> = ({
  className,
  color = "rgba(88, 232, 119, .2)",
  ...props
}) => {
  const refRoot = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = refRoot.current;
    if (canvas) {
      const canvasSize = canvas.getBoundingClientRect();
      const ctx = canvas.getContext("2d");
      canvas.width = canvasSize.width;
      canvas.height = canvasSize.height;
      if (ctx) {
        const scaleY = canvasSize.height / canvasSize.width;
        ctx.scale(1, scaleY);
        const centerX = canvasSize.width / 2;
        const centerY = canvasSize.height / (2 * scaleY);
        const radius = canvasSize.width / 2;
        const gradient = ctx.createRadialGradient(
          centerX,
          centerY,
          0,
          centerX,
          centerY,
          radius,
        );
        gradient.addColorStop(0, color);
        gradient.addColorStop(1, "transparent");
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvasSize.width, canvasSize.height / scaleY);
      }
    }
  }, [color]);
  return (
    <canvas
      className={clsx(className, styles.RadialGradient)}
      {...props}
      ref={refRoot}
    />
  );
};
