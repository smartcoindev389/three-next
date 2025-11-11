/**
 * @function
 * @param {Number} t A number between 0 and 1 representing a linearly progressing percentage through the animation.
 * @returns {Number} A number between 0 and 1 that is the eased version of the 't' parameter.
 */
export const easeInOutExpo = (t) => {
  return t === 0
    ? 0
    : t === 1
      ? 1
      : t < 0.5
        ? Math.pow(2, 20 * t - 10) / 2
        : (2 - Math.pow(2, -20 * t + 10)) / 2;
};
