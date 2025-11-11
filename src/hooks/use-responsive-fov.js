import { useState, useEffect } from "react";

function getFov(width) {
  if (width >= 1440) return 60;
  if (width >= 1024) return 70;
  if (width >= 768) return 80;
  return 90;
}
export const useResponsiveFov = function () {
  const [fov, setFov] = useState(() =>
    getFov(typeof window !== "undefined" ? window.innerWidth : 1024),
  );

  useEffect(() => {
    let timeout;
    const updateFov = () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        setFov(getFov(window.innerWidth));
      }, 100); // 100мс debounce
    };
    window.addEventListener("resize", updateFov);
    // одразу оновити при mount
    updateFov();
    return () => {
      clearTimeout(timeout);
      window.removeEventListener("resize", updateFov);
    };
  }, []);

  return fov;
};
