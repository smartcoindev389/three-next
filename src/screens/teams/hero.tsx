import React, { useEffect, useRef } from "react";
import styles from "./hero.module.scss";
import { AnimationController, AnimationData } from "@/utils/AnimationScrollController";

/**
 * 
 */
export const HeroText = React.memo(({ title }: { title: string }) => {
  //const [sceneReady, setSceneReady] = useState(true);
  const box1 = useRef<HTMLDivElement>(null);

  useEffect(function () {

    const data: AnimationData = {
      'section Text start':
        [
          [
            'to',
            box1.current,
            {
              opacity: 1,
              top: "40vh",
              fontSize: "14vmin",
              duration: 0.5,
              ease: "power2.out",

            }
          ]
        ],
      'section Text open':
        [
          [
            'to',
            box1.current,
            {
              opacity: 1,
              duration: 0.5,
              ease: "power2.out",

            },
            1.5
          ]
        ],
      'section Text closed':
        [
          [
            'to',
            box1.current, {
              opacity: 0,
              duration: 0.5,
              ease: "power2.out",

            },
            0
          ]
        ]

    };

    AnimationController.register(data);

  }, []);

  return (
    <div className={styles.headerBox}>
      <h1 ref={box1} className={styles.headerH1}>
        {title}
      </h1>
    </div>
  );
}
);


HeroText.displayName = "HeroText";