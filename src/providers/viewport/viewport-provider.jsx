import { useCallback, useEffect, useState } from "react";
import resolveConfig from "tailwindcss/resolveConfig";
import { useDebouncedCallback } from "use-debounce";

import ViewportContext from "./viewport-context";

import tailwindConfig from "@/../tailwind.config";

const breakpoints = resolveConfig(tailwindConfig).theme.screens;

const DEBOUNCE_TIMEOUT = 50; // milliseconds

/**
 * Provides the viewport context that includes viewport size and media query status.
 * @example
 * <ViewportProvider>
 *   <YourComponent />
 * </ViewportProvider>
 * @param {Object} children - React children components that require viewport context.
 * @returns {JSX.Element} Returns a context provider wrapping the children with viewport information.
 * @description
 *   - Uses browser APIs to determine viewport dimensions and media query matches.
 *   - Dynamically updates viewport sizes and applies them as CSS variables upon window resize or orientation change.
 *   - Media queries are set up to manage various device types and orientations using window.matchMedia.
 *   - Includes debouncing to optimize performance during rapid resize events.
 */
const ViewportProvider = ({ children }) => {
  const [matchMediaQueries, setMatchMediaQueries] = useState(undefined);
  const [sizes, setSizes] = useState(undefined);
  const [deviceInfo, setDeviceInfo] = useState({
    isIOS: false,
    isWindows: false,
    isMacOS: false,
    isAndroid: false,
  });

  const createGhostElement = useCallback(() => {
    const element = document.createElement("div");

    element.style.width = "100%";
    element.style.height = "100vh";
    element.style.position = "absolute";
    element.style.top = "0";
    element.style.left = "0";
    element.style.pointerEvents = "none";

    return element;
  }, []);

  // Detect device and platform once on mount
  useEffect(() => {
    const userAgent = navigator.userAgent;
    const isIOS =
      /iPad|iPhone|iPod/.test(userAgent) &&
      (typeof window.MSStream === "undefined" || window.MSStream === false);
    const isWindows = /Windows/.test(userAgent);
    const isMacOS =
      /Mac OS X/.test(userAgent) && !/iPad|iPhone|iPod/.test(userAgent);
    const isAndroid = /Android/.test(userAgent);

    setDeviceInfo({
      isIOS,
      isWindows,
      isMacOS,
      isAndroid,
    });

    // Add appropriate classes to html element for CSS targeting
    const htmlElement = document.documentElement;

    htmlElement.classList.toggle("ios", isIOS);
    htmlElement.classList.toggle("windows", isWindows);
    htmlElement.classList.toggle("macos", isMacOS);
    htmlElement.classList.toggle("android", isAndroid);
  }, []);

  const updateViewportState = useCallback(() => {
    const innerGhostElement = createGhostElement();

    document.body.appendChild(innerGhostElement);
    const fullWidth = innerGhostElement.offsetWidth;
    const fullHeight = innerGhostElement.offsetHeight;

    document.body.removeChild(innerGhostElement);

    setSizes({
      innerWidth: window.innerWidth,
      innerHeight: window.innerHeight,
      fullWidth,
      fullHeight,
    });

    // Update CSS variables
    document.documentElement.style.setProperty(
      "--vh",
      `${window.innerHeight * 0.01}px`,
    );
    document.documentElement.style.setProperty(
      "--vw",
      `${window.innerWidth * 0.01}px`,
    );
    document.documentElement.style.setProperty(
      "--scrollbar-width",
      `${fullWidth - window.innerWidth}px`,
    );

    // iOS Safari specific fixes
    if (deviceInfo.isIOS) {
      // Fix for iOS Safari viewport height issues
      const vh = window.innerHeight * 0.01;

      document.documentElement.style.setProperty("--vh", `${vh}px`);
    }
  }, [createGhostElement, deviceInfo]);

  const debounce = useDebouncedCallback(updateViewportState, DEBOUNCE_TIMEOUT);

  useEffect(() => {
    updateViewportState(); // Initial update

    window.addEventListener("resize", debounce);
    window.addEventListener("orientationchange", debounce);

    return () => {
      window.removeEventListener("resize", debounce);
      window.removeEventListener("orientationchange", debounce);
    };
  }, [updateViewportState, debounce]);

  useEffect(() => {
    const queries = {
      isMobile: `(max-width: ${parseInt(breakpoints.sm, 10) - 1}px)`,
      isTablet: `(max-width: ${parseInt(breakpoints.md, 10) - 1}px)`,
      isLaptop: `(min-width: ${breakpoints.md}) and (max-width: ${parseInt(breakpoints.lg, 10) - 1}px)`,
      isDesktop: `(min-width: ${breakpoints.lg})`,
      isLandscape: `(orientation: landscape)`,
      isPortrait: `(orientation: portrait)`,
      isTouch: `(pointer: coarse)`,
    };

    const mediaQueries = {};
    const listeners = {};

    Object.entries(queries).forEach(([key, value]) => {
      const mediaQueryList = window.matchMedia(value);

      listeners[key] = () => {
        mediaQueries[key] = mediaQueryList.matches;
        setMatchMediaQueries({ ...mediaQueries });
      };

      mediaQueryList.addEventListener("change", listeners[key]);
      mediaQueries[key] = mediaQueryList.matches;
    });

    setMatchMediaQueries(mediaQueries);

    return () => {
      Object.entries(queries).forEach(([key, value]) => {
        const mediaQueryList = window.matchMedia(value);

        mediaQueryList.removeEventListener("change", listeners[key]);
      });
    };
  }, []);

  const {
    isMobile,
    isTablet,
    isLaptop,
    isLandscape,
    isPortrait,
    isDesktop,
    isTouch,
  } = matchMediaQueries || {
    isMobile: false,
    isTablet: false,
    isLaptop: false,
    isDesktop: false,
    isLandscape: false,
    isPortrait: false,
    isTouch: false,
  };

  const { innerWidth, innerHeight, fullWidth, fullHeight } = sizes || {
    innerWidth: 0,
    innerHeight: 0,
    fullWidth: 0,
    fullHeight: 0,
  };

  return (
    <ViewportContext.Provider
      value={{
        isMobile,
        isTablet,
        isLaptop,
        isLandscape,
        isPortrait,
        isDesktop,
        isTouch,
        innerWidth,
        innerHeight,
        fullWidth,
        fullHeight,
        ...deviceInfo,
      }}
    >
      {children}
    </ViewportContext.Provider>
  );
};

export { ViewportProvider };
