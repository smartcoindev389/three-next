"use client";
import { useEffect, useRef, RefObject } from "react";

export type ScrollDirection = "up" | "down";
export type DoubleScrollCallback = (dir: ScrollDirection) => void;

interface UseDoubleScrollDirectionProps {
  onDoubleScroll?: DoubleScrollCallback;
  onScroll?: (deltaY: number, direction: ScrollDirection | null) => void;
  className?: string;
  timeout?: number;
  minInterval?: number;
  longScrollDistance?: number;
}

/**
 * Викликає callback при двох скролах підряд в одну сторону (up/down) з урахуванням паузи.
 * Повертає ref на останню дельту скролу (deltaY) без ререндерів.
 */
export function useDoubleScrollDirection({
  onDoubleScroll,
  onScroll = () => {},
  className,
  timeout = 1000,
  minInterval = 300,
  longScrollDistance = 600,
}: UseDoubleScrollDirectionProps): RefObject<number> {
  const lastDeltaRef = useRef<number>(0);

  // Стабільні callbacks, щоб не перевішувати обробники
  const onDoubleScrollRef = useRef<DoubleScrollCallback>(onDoubleScroll);
  const onScrollRef = useRef<typeof onScroll>(onScroll);

  useEffect(() => {
    onDoubleScrollRef.current = onDoubleScroll;
  }, [onDoubleScroll]);

  useEffect(() => {
    onScrollRef.current = onScroll;
  }, [onScroll]);

  useEffect(() => {
    let lastScrollDir: ScrollDirection | null = null;
    let scrollCount = 0;
    let lastTime = 0;
    let accumulatedDelta = 0;
    let cooldownActive = false;

    let touchStartY = 0;
    let isScrolling = false;

    const cleanClass = className ? className.replace(/^\./, "") : null;

    const resetState = () => {
      scrollCount = 0;
      accumulatedDelta = 0;
      lastScrollDir = null;
    };

    const handleScrollDirection = (deltaY: number) => {
      lastDeltaRef.current = deltaY;
      const dir: ScrollDirection | null =
        deltaY > 0 ? "down" : deltaY < 0 ? "up" : null;
      onScrollRef.current(deltaY, dir);

      const now = Date.now();
      if (!dir || cooldownActive) return;
      if (now - lastTime < minInterval) return;

      if (lastScrollDir === dir && now - lastTime <= timeout) {
        scrollCount += 1;
        accumulatedDelta += Math.abs(deltaY);
      } else {
        scrollCount = 1;
        accumulatedDelta = Math.abs(deltaY);
        lastScrollDir = dir;
      }

      lastTime = now;

      if (scrollCount >= 2 || accumulatedDelta >= longScrollDistance) {
        if (onDoubleScrollRef.current) {
          onDoubleScrollRef.current(dir);
        }
        resetState();
        cooldownActive = true;
        setTimeout(() => {
          cooldownActive = false;
        }, 1000);
      }
    };

    const onWheel = (e: WheelEvent) => {
      if (cleanClass && !(e.target as HTMLElement)?.closest("." + cleanClass))
        return;
      if (Math.abs(e.deltaY) < 20) return;
      handleScrollDirection(e.deltaY);
    };

    const onTouchStart = (e: TouchEvent) => {
      if (cleanClass && !(e.target as HTMLElement)?.closest("." + cleanClass))
        return;
      touchStartY = e.touches[0].clientY;
      isScrolling = true;
    };

    const onTouchMove = (e: TouchEvent) => {
      if (!isScrolling) return;
      if (cleanClass && !(e.target as HTMLElement)?.closest("." + cleanClass))
        return;
      const currentY = e.touches[0].clientY;
      const deltaY = touchStartY - currentY;
      handleScrollDirection(deltaY);
      touchStartY = currentY;
    };

    const onTouchEnd = () => {
      isScrolling = false;
    };

    const onBlur = () => {
      resetState();
    };

    window.addEventListener("wheel", onWheel, { passive: true });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("touchend", onTouchEnd, { passive: true });
    window.addEventListener("blur", onBlur);

    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("blur", onBlur);
    };
  }, [timeout, minInterval, className, longScrollDistance]);

  return lastDeltaRef;
}
