/* eslint-disable @typescript-eslint/no-explicit-any */
import { useRef, useEffect, FC, useState } from "react";
import style from "./style.module.scss";
import Image from "next/image";
import gsap from "gsap";

class GridParticle {
  x: number;
  y: number;
  gridSize: number;
  startX: number;
  startY: number;
  speedX: number;
  speedY: number;
  life: number;
  decay: number;
  symbol: string;
  squareSize: number;
  isEmpty: boolean;

  constructor(x: number, y: number) {
    // Fixed grid size - точное следование за курсором
    this.gridSize = 20;
    this.squareSize = 20;

    // Точно по координатам курсора, привязка к сетке
    this.x = Math.round(x / this.gridSize) * this.gridSize;
    this.y = Math.round(y / this.gridSize) * this.gridSize;

    this.startX = this.x;
    this.startY = this.y;

    // Медленное расхождение
    this.speedX = (Math.random() - 0.5) * 1.5;
    this.speedY = (Math.random() - 0.5) * 1.5;

    this.life = 1;
    this.decay = Math.random() * 0.008 + 0.005;

    // Символы или пустой квадрат
    const symbols = ["X", "O", ">", "●", ""];
    this.symbol = symbols[Math.floor(Math.random() * symbols.length)];
    this.isEmpty = this.symbol === "";
  }

  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    this.life -= this.decay;

    // Замедление
    this.speedX *= 0.98;
    this.speedY *= 0.98;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.save();
    ctx.globalAlpha = this.life;

    // Рисуем квадрат (всегда)
    ctx.fillStyle = "#001322";
    ctx.fillRect(this.x, this.y, this.squareSize, this.squareSize);

    // Рисуем символ только если не пустой
    if (!this.isEmpty) {
      ctx.fillStyle = "#ffffff";
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 2;

      const centerX = this.x + this.squareSize / 2;
      const centerY = this.y + this.squareSize / 2;

      if (this.symbol === "X") {
        ctx.beginPath();
        ctx.moveTo(centerX - 5, centerY - 5);
        ctx.lineTo(centerX + 5, centerY + 5);
        ctx.moveTo(centerX + 5, centerY - 5);
        ctx.lineTo(centerX - 5, centerY + 5);
        ctx.stroke();
      } else if (this.symbol === "O") {
        ctx.beginPath();
        ctx.arc(centerX, centerY, 4, 0, Math.PI * 2);
        ctx.stroke();
      } else if (this.symbol === ">") {
        ctx.fillStyle = "#ffffff";
        ctx.beginPath();
        ctx.moveTo(centerX - 3, centerY - 4);
        ctx.lineTo(centerX + 4, centerY);
        ctx.lineTo(centerX - 3, centerY + 4);
        ctx.fill();
      } else if (this.symbol === "●") {
        ctx.fillStyle = "#ffffff";
        ctx.beginPath();
        ctx.arc(centerX, centerY, 3, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    ctx.restore();
  }

  isDead() {
    return this.life <= 0;
  }
}

export const CursorParticlesImage: FC<{ 
  src: string; 
  alt: string; 
  width?: number; 
  height?: number; 
}> = ({
  src = "/assets/projects/unsplash_Zw2nRt2z5f0 (1).png",
  alt,
  width = 1920,
  height = 1080,
}) => {
  const canvasRef = useRef<any>(null);
  const wrapperRef = useRef<any>(null);
  const particlesRef = useRef<any>([]);
  const animationIdRef = useRef<any>(null);
  const mousePos = useRef<any>({ x: 0, y: 0 });
  const lastMousePos = useRef<any>({ x: 0, y: 0 });

  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!ready) return;
    const canvas = canvasRef.current as HTMLCanvasElement | null;
    const wrapper = wrapperRef.current as HTMLDivElement | null;
    if (!canvas || !wrapper) return;
    const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = wrapper.offsetWidth ?? 100;
      canvas.height = wrapper.offsetHeight ?? 100;
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const createParticlesOnPath = (x: number, y: number) => {
      // Вычисляем расстояние от последней позиции
      const dx = x - lastMousePos.current.x;
      const dy = y - lastMousePos.current.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      // Создаем частицы вдоль пути курсора
      if (distance > 5) {
        // Минимальное расстояние для создания частицы
        const steps = Math.floor(distance / 20); // Каждые 20px создаем частицу

        for (let i = 0; i <= steps; i++) {
          const ratio = i / Math.max(steps, 1);
          const pathX = lastMousePos.current.x + dx * ratio;
          const pathY = lastMousePos.current.y + dy * ratio;

          // Создаем 2-3 частицы в каждой точке пути
          const particleCount = Math.floor(Math.random() * 2) + 2;
          for (let j = 0; j < particleCount; j++) {
            // Небольшое смещение для разнообразия
            const offsetX = (Math.random() - 0.5) * 20;
            const offsetY = (Math.random() - 0.5) * 20;
            particlesRef.current.push(
              new GridParticle(pathX + offsetX, pathY + offsetY),
            );
          }
        }

        lastMousePos.current = { x, y };
      }
    };

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update and draw particles
      particlesRef.current = particlesRef.current.filter(
        (particle: GridParticle) => {
          particle.update();
          particle.draw(ctx);
          return !particle.isDead();
        },
      );

      animationIdRef.current = requestAnimationFrame(animate);
    };

    // Mouse move handler
    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.offsetX, y: e.offsetY };
      createParticlesOnPath(e.offsetX, e.offsetY);
    };

    // Initialize last mouse position
    const handleMouseEnter = (e: MouseEvent) => {
      lastMousePos.current = { x: e.offsetX, y: e.offsetY };
    };

    // Start animation
    animate();

    // Add event listeners
    wrapper.addEventListener("mousemove", handleMouseMove);
    wrapper.addEventListener("mouseenter", handleMouseEnter);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      wrapper.removeEventListener("mousemove", handleMouseMove);
      wrapper.removeEventListener("mouseenter", handleMouseEnter);
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
    };
  }, [ready]);

  useEffect(() => {
    gsap.delayedCall(1, () => {
      setReady(true);
    });
  }, []);

  return (
    <div ref={wrapperRef} className={style.CursorParticlesImage}>
      <Image 
        src={src} 
        alt={alt} 
        width={width} 
        height={height}
        quality={90}
        priority={true}
        sizes="(max-width: 768px) 100vw, (max-width: 1440px) 75vw, 50vw"
      />
      <canvas ref={canvasRef} />
    </div>
  );
};
