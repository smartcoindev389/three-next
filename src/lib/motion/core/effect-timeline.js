import { gsap } from "gsap";

/**
 * Creates and controls a GSAP timeline with progress tracking and completion handling.
 * @example
 * timelineFunction(1.5, true, myTimelineFactory)
 * // Returns a GSAP timeline with reversed progress.
 * @param {number} duration - Duration of the timeline animation.
 * @param {boolean} reversed - Indicates if the timeline should play in reverse.
 * @param {function} timelineFactory - Factory function to create a new timeline instance.
 * @returns {GSAPTimeline} A GSAP timeline configured with the specified parameters.
 * @description
 *   - The timeline is reinitialized upon completion if the 'reversed' flag is true.
 *   - The helper object tracks progress and completion state of the timeline.
 *   - Intended for use with GSAP's scrolltrigger scrubbing functionality.
 */
export const effectTimeline = (duration, reversed, timelineFactory) => {
  let timeline;

  const helper = { progress: reversed ? 1 : 0, completed: false };

  return gsap
    .timeline({
      onStart: () => {
        timeline = timelineFactory();
      },
      onUpdate: () => {
        if (helper.completed) {
          // if onUpdate is called after the timeline is finished
          // it means the timeline is playing backwards for some reason.
          // This is often due scrolltrigger scrubbing.
          helper.completed = false;
          timeline = timelineFactory();
        }
        timeline?.progress(helper.progress);
      },
      onComplete: () => {
        helper.completed = true;
      },
    })
    .to(helper, { progress: reversed ? 0 : 1, duration, ease: "none" });
};
