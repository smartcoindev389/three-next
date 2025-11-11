/* eslint-disable @typescript-eslint/no-explicit-any */
import gsap from "gsap";

export const getAnimation = (
  element: any,
  params?: {
    from?: gsap.TweenVars;
    to?: gsap.TweenVars;
  },
) => {
  const anim: gsap.core.Timeline = gsap.timeline({ paused: true }).fromTo(
    element,
    { opacity: 0, ...params?.from },
    {
      opacity: 1,
      ...params?.to,
    },
  );

  return anim;
};
