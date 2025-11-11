import { useState, useEffect } from "react";

const MOBILE_BREAKPOINT = 1024;

const isMobileView = (): boolean => {
  if (typeof window === "undefined") return false;

  return window.innerWidth < MOBILE_BREAKPOINT;
};

const useMobile = (): boolean => {
  const [isMobile, setIsMobile] = useState(isMobileView);

  useEffect(() => {
    const updateMobileStatus = (): void => setIsMobile(isMobileView());

    updateMobileStatus();
    window.addEventListener("resize", updateMobileStatus);

    return () => {
      window.removeEventListener("resize", updateMobileStatus);
    };
  }, []);

  return isMobile;
};

export default useMobile;
