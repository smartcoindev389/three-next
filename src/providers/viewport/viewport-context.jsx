import { createContext } from "react";

const ViewportContext = createContext({
  isMobile: false,
  isTablet: false,
  isLaptop: false,
  isLandscape: false,
  isPortrait: false,
  isDesktop: false,
  isTouch: false,
  innerWidth: 0,
  innerHeight: 0,
  fullWidth: 0,
  fullHeight: 0,
});

export default ViewportContext;
