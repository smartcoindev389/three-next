import gsap from "gsap";

import { effectTimeline } from "@/lib/motion/core/effect-timeline";
import { SafeSplitText } from "@/lib/motion/core/safe-split-text";

const setup = (target) => {
  const textEl = target[0];
  const splitTxt = new SafeSplitText(textEl, { type: "lines" });

  gsap.set(splitTxt.lines, { opacity: 0 });

  return [textEl, splitTxt];
};

const effect = {
  name: "textRiseByWordsRotate",
  effect: (target, config = {}) => {
    if (config.immediateRender) setup(target);

    return effectTimeline(config.duration, config.reversed, () => {
      const [element, split] = setup(target);
      const lines = config.shuffle
        ? gsap.utils.shuffle(split.lines)
        : split.lines;

      return gsap
        .timeline({ paused: true })
        .set(element, { opacity: 1 })
        .set(lines, { opacity: 1 })
        .fromTo(
          lines,
          { y: config.yOffsetInitial, rotate: config.rotateInitial },
          {
            y: config.yOffsetFinal,
            rotate: config.rotateFinal,
            duration: config.wordDuration,
            stagger: config.wordOffset,
            ease: config.ease,
          },
        );
    });
  },
  defaults: {
    ease: "none",
    duration: +(gsap.defaults().duration ?? 2),
    rotateFinal: "0deg",
    rotateInitial: "5deg",
    yOffsetFinal: "0%",
    yOffsetInitial: "115%",
    wordDuration: 1,
    wordOffset: 0.075,
    shuffle: false,
    immediateRender: false,
  },
  extendTimeline: true,
};

export default effect;
