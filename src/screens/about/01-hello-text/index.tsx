import React, { useEffect, useRef } from "react";
import styles from "./index.module.scss";
import { AnimationController, AnimationData } from "@/utils/AnimationScrollController";

/**
 * 
 */
export const AnimatedText = React.memo(({ aboutPage }: { aboutPage: any }) => {
  //const [sceneReady, setSceneReady] = useState(true);
  const box1 = useRef<HTMLDivElement>(null);
  const box2 = useRef<HTMLDivElement>(null);
  const box3 = useRef<HTMLDivElement>(null);

  useEffect(function () {

    const data: AnimationData = {
      'section Text start':
        [
          [
            'to',
            box1.current,
            {
              opacity: 1,
              top: "20vh",
              fontSize: "14vmin",
              duration: 0.5,
              ease: "power2.out",

            }
          ],
          [
            'to',
            box2.current, {
              opacity: 1,
              duration: 0.5,
              ease: "power2.out",

            },

          ],
          [
            'to',
            box3.current, {
              opacity: 1,
              duration: 0.5,
              ease: "power2.out",

            },
            0.5
          ],
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
          ],
          [
            'to',
            box2.current, {
              opacity: 1,
              duration: 0.5,
              ease: "power2.out",

            },
            1.7
          ],
          [
            'to',
            box3.current, {
              opacity: 1,
              duration: 0.5,
              ease: "power2.out",

            },
            1.8
          ],
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
          ],
          [
            'to',
            box2.current, {
              opacity: 0,
              duration: 0.5,
              ease: "power2.out",

            },
            "<"
          ],
          [
            'to',
            box3.current, {
              opacity: 0,
              duration: 0.5,
              ease: "power2.out",

            },
            "<<"
          ],
        ]

    };

    AnimationController.register(data);

  }, []);

  return (
    <div className={styles.headerBox}>

      <h1 ref={box1} className={styles.headerH1}>
        {aboutPage?.title}
      </h1>
      <br />
      <p ref={box2} className={styles.headerP}>
        {aboutPage?.description}
      </p>

      <div ref={box3} className={styles.headerH2Box}>
        <h2>
          {aboutPage?.banner_title}
        </h2>

        <p>
          {aboutPage?.banner_description}
        </p>
      </div>

      <div className={styles.canvasBoard}></div>
    </div>
  );
}
);


AnimatedText.displayName = "AnimatedText";