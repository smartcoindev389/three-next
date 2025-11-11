/* eslint-disable @typescript-eslint/no-explicit-any */
import MotionPathPlugin from "gsap/MotionPathPlugin";

export const getDistance = (
  from: any,
  to: any,
  fromParam: [number, number],
  toParam: [number, number],
) => {
  let distance = {
    x: 0,
    y: 0,
  };

  distance = MotionPathPlugin.getRelativePosition(from, to, fromParam, toParam);

  return distance;
};
