import { useEffect, useRef } from "react";

/**
 * Викликає callback, коли елемент видимий на екрані по висоті не менше ніж на percent% (0..1)
 * @param {React.RefObject} ref - ref на DOM-елемент
 * @param {() => void} callback - функція, яка викликається при досягненні видимості
 * @param {number} percent - відсоток видимості для callback (0..1)
 * @param {() => void} [onHide] - необов'язкова функція, яка викликається коли видимість менша за hidePercent
 * @param {number} [hidePercent] - відсоток видимості для onHide (0..1)
 */
export function useOnVisiblePercentage(
  ref,
  callback,
  percent = 0.5,
  onHide,
  hidePercent,
) {
  const triggered = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof callback !== "function") return;

    const hideThreshold =
      typeof hidePercent === "number" ? hidePercent : percent;

    function checkVisibility() {
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight || document.documentElement.clientHeight;
      if (rect.height === 0) return;
      const visibleHeight = Math.min(rect.bottom, vh) - Math.max(rect.top, 0);
      const ratio = Math.max(0, Math.min(1, visibleHeight / rect.height));
      if (ratio >= percent && !triggered.current) {
        triggered.current = true;
        callback();
      }
      // onHide тільки якщо вже був показаний і ratio < hideThreshold
      if (triggered.current && ratio < hideThreshold) {
        triggered.current = false;
        if (typeof onHide === "function") onHide();
      }
    }

    checkVisibility();

    const observer = new window.IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (
            entry.isIntersecting &&
            entry.intersectionRatio >= percent &&
            !triggered.current
          ) {
            triggered.current = true;
            callback();
          }
          // onHide тільки якщо вже був показаний і ratio < hideThreshold
          if (triggered.current && entry.intersectionRatio < hideThreshold) {
            triggered.current = false;
            if (typeof onHide === "function") onHide();
          }
        });
      },
      {
        threshold: Array.from({ length: 101 }, (_, i) => i / 100),
      },
    );

    observer.observe(el);
    window.addEventListener("scroll", checkVisibility, { passive: true });
    window.addEventListener("resize", checkVisibility);

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", checkVisibility);
      window.removeEventListener("resize", checkVisibility);
    };
  }, [ref, callback, percent, onHide, hidePercent]);
}
