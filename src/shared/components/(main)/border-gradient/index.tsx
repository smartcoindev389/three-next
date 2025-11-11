"use client";

import { useGSAP } from "@gsap/react";
import clsx from "clsx";
import gsap from "gsap";
import { FC, useEffect, useRef } from "react";

import { getPercentFromPx } from "utils/getPercentFromPx";

import styles from "./index.module.scss";

export interface IBorderGradient {
  style?: "purple" | "blue";
  speedMultiplayer?: number;
  isActive?: boolean;
}

export const BorderGradient: FC<IBorderGradient> = ({
  style = "purple",
  speedMultiplayer = 1,
  isActive = true,
}) => {
  const refGR = useRef<HTMLDivElement[]>([]);
  const refRoot = useRef<HTMLDivElement>(null);

  const tl = useRef<gsap.core.Timeline | null>(null);

  useGSAP(() => {
    if (refRoot.current) {
      const rootParams = refRoot.current.getBoundingClientRect();

      let width;

      if (rootParams.height > rootParams.width) width = rootParams.height;
      else width = rootParams.width;

      gsap.set(refGR.current, {
        width: `${getPercentFromPx(rootParams.width, width * 1.3)}%`,
      });

      const aspect =
        getPercentFromPx(rootParams.height, rootParams.width) / 100;

      tl.current = gsap
        .timeline({
          paused: true,
          repeat: -1,
          defaults: {
            ease: "none",
          },
        })
        .fromTo(
          refGR.current,
          {
            rotate: 0,
          },
          {
            rotate: 90,
            duration: (1 - aspect) * 1.5 * speedMultiplayer,
          },
        )
        .to(refGR.current, {
          rotate: 180,
          duration: aspect * speedMultiplayer,
        })
        .to(refGR.current, {
          rotate: 270,
          duration: (1 - aspect) * 1.5 * speedMultiplayer,
        })
        .to(refGR.current, {
          rotate: 360,
          duration: aspect * speedMultiplayer,
        });
    }
  }, []);

  useEffect(() => {
    if (isActive) {
      tl.current?.play();
    } else {
      tl.current?.pause();
    }
  }, [isActive]);

  return (
    <div className={clsx(styles.BorderGradient, styles[style])} ref={refRoot}>
      <div
        className={clsx(styles.BorderGradient_gr)}
        ref={(ref) => {
          if (ref) refGR.current[0] = ref;
        }}
      />
      {/* <div
                className={clsx(styles.BorderGradient_gr)}
                ref={(ref) => {
                    if (ref) refGR.current[1] = ref
                }}
            /> */}
      <div className={clsx(styles.BorderGradient_black)} />
    </div>
  );
};
