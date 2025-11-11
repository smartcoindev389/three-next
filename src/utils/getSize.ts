import { useWindowSize } from "@uidotdev/usehooks";
import { useEffect, useState } from "react";

const getSize = (target: number, width: number) => {
  const windowWidth = window.innerWidth;
  return (target * windowWidth) / width;
};

export const getD = (target: number) => {
  return getSize(target, 1510);
};

export const getDs = (target: number) => {
  return getSize(target, 1440);
};

export const getTl = (target: number) => {
  return getSize(target, 1024);
};

export const getT = (target: number) => {
  return getSize(target, 650);
};

export const getM = (target: number) => {
  return getSize(target, 430);
};

const calcPx = (target: number, width: number) => {
  let func;

  if (width >= 1440) {
    func = getD;
  } else if (width >= 1024) {
    func = getDs;
  } else if (width >= 650) {
    func = getT;
  } else {
    func = getM;
  }

  return func(target);
};

export const getResponsiveSize = (target: number) => {
  const { innerWidth: width } = window;

  return calcPx(target, width);
};

export const useResponsiveSize = (target: number) => {
  const { width } = useWindowSize();

  const [value, setValue] = useState<number>(target);

  useEffect(() => {
    if (!width) return;

    setValue(calcPx(target, width));
  }, [width, target]);

  return value;
};
