"use client";

import clsx from "clsx";
// import gsap from "gsap"
import { useEffect, useRef } from "react";
import { FC } from "react";

import { useResponsiveSize } from "utils/getSize";

import styles from "./index.module.scss";

interface ICanvasGradient {
  className?: string;
  speed?: number;
  isActive?: boolean;
  data: Array<{ index: number; color: string }>;
}

export const CanvasGradient: FC<ICanvasGradient> = ({
  className,
  speed = 5,
  // isActive = true,
  data,
}) => {
  // const [isActiveLocal, setIsActiveLocal] = useState<boolean>(isActive)

  const borderWidthDefault = useResponsiveSize(5);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const angleRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const parent = canvas.parentElement;
    if (!parent) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const setupCanvas = () => {
      const parentParams = parent.getBoundingClientRect();
      const borderRadius = parseFloat(getComputedStyle(canvas).borderRadius);
      const borderWidth =
        parseFloat(getComputedStyle(canvas).borderWidth) || borderWidthDefault;

      const canvasWidth = parentParams.width + borderWidth * 3;
      const canvasHeight = parentParams.height + borderWidth * 3;

      canvas.width = canvasWidth;
      canvas.height = canvasHeight;
      canvas.style.width = `${(canvasWidth * 100) / parentParams.width}%`;
      canvas.style.height = `${(canvasHeight * 100) / parentParams.height}%`;

      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;

      const draw = () => {
        // if (!isActiveLocal) return

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const angle = angleRef.current;
        const x0 = centerX + (canvas.width / 2) * Math.cos(angle);
        const y0 = centerY + (canvas.height / 2) * Math.sin(angle);
        const x1 = centerX - (canvas.width / 2) * Math.cos(angle);
        const y1 = centerY - (canvas.height / 2) * Math.sin(angle);

        const gradient = ctx.createLinearGradient(x0, y0, x1, y1);

        data.forEach(({ index, color }) => {
          gradient.addColorStop(index, color);
        });
        // gradient.addColorStop(0.5, "rgba(0, 0, 0, 0.00)")
        // gradient.addColorStop(1, "#fff")
        // gradient.addColorStop(0.65, "#fff")
        // gradient.addColorStop(0.87, "rgba(0, 0, 0, 0.00)")

        ctx.strokeStyle = gradient;
        ctx.lineWidth = borderWidth;

        const clearance = borderWidth * 1.5;

        ctx.beginPath();
        ctx.moveTo(clearance + borderRadius, clearance);
        ctx.lineTo(canvas.width - clearance - borderRadius, clearance);
        ctx.quadraticCurveTo(
          canvas.width - clearance,
          clearance,
          canvas.width - clearance,
          clearance + borderRadius,
        );
        ctx.lineTo(
          canvas.width - clearance,
          canvas.height - clearance - borderRadius,
        );
        ctx.quadraticCurveTo(
          canvas.width - clearance,
          canvas.height - clearance,
          canvas.width - clearance - borderRadius,
          canvas.height - clearance,
        );
        ctx.lineTo(clearance + borderRadius, canvas.height - clearance);
        ctx.quadraticCurveTo(
          clearance,
          canvas.height - clearance,
          clearance,
          canvas.height - clearance - borderRadius,
        );
        ctx.lineTo(clearance, clearance + borderRadius);
        ctx.quadraticCurveTo(
          clearance,
          clearance,
          clearance + borderRadius,
          clearance,
        );
        ctx.closePath();

        ctx.stroke();

        // Увеличиваем угол на величину скорости
        angleRef.current += speed / 1000;
        animationRef.current = requestAnimationFrame(draw); // Сохраняем id анимации
      };

      draw();

      // if (isActiveLocal) {
      //     draw() // Запуск анимации, если isActive true
      // } else if (animationRef.current) {
      //     cancelAnimationFrame(animationRef.current) // Остановка анимации, если isActive false
      // }
    };

    setupCanvas();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [borderWidthDefault, speed, data]);

  // useEffect(() => {
  //     gsap.killTweensOf(canvasRef.current)

  //     gsap.to(canvasRef.current, {
  //         opacity: isActive ? 1 : 0,
  //         duration: 1,
  //         onComplete() {
  //             setIsActiveLocal(isActive)
  //         },
  //         onStart() {
  //             setIsActiveLocal(isActive)
  //         },
  //     })
  // }, [isActive])

  return <canvas className={clsx(styles.canvas, className)} ref={canvasRef} />;
};
