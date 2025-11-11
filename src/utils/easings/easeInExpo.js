/**
 * @function
 * @param {Number} t A number between 0 and 1 representing a linearly progressing percentage through the animation.
 * @returns {Number} A number between 0 and 1 that is the eased version of the 't' parameter.
 */

export const easeInExpo = (t) => {
  return t === 0 ? 0 : Math.pow(2, 10 * t - 10);
};
