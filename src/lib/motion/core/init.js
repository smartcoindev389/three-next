import { gsap } from "gsap";
import ScrollToPlugin from "gsap/dist/ScrollToPlugin";

export function initGsap() {
  if (typeof window === "undefined") return;

  gsap.registerPlugin(ScrollToPlugin);

  gsap.defaults({ ease: "none", duration: 1 });
}
