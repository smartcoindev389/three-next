"use client";

import gsap from "gsap";

export const GsapMagnetic = (
  element: HTMLDivElement,
  xK: number = 7.5,
  yK: number = 5,
) => {
  const xTo = gsap.quickTo(element, "x", {
    duration: 1,
    ease: "elastic.out(1, 0.75)",
  });
  const yTo = gsap.quickTo(element, "y", {
    duration: 1,
    ease: "elastic.out(1, 0.75)",
  });

  const mouseMove = (e: MouseEvent) => {
    if (element) {
      const { clientX, clientY } = e;
      const { height, width, left, top } = element.getBoundingClientRect();
      const x = (clientX - (left + width / 2)) / xK;
      const y = (clientY - (top + height / 2)) / yK;
      xTo(x);
      yTo(y);
    }
  };

  const mouseLeave = () => {
    xTo(0);
    yTo(0);
  };

  element.addEventListener("mousemove", mouseMove);
  element.addEventListener("mouseleave", mouseLeave);

  return () => {
    element.removeEventListener("mousemove", mouseMove);
    element.removeEventListener("mouseleave", mouseLeave);
  };
};
