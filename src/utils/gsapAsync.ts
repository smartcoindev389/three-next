/* eslint-disable @typescript-eslint/no-explicit-any */
import gsap from "gsap";

export const gsapAsync = async (base: any, to: any) => {
  return new Promise((resolve) => {
    to.onComplete = resolve;
    gsap.to(base, to);
  });
};
