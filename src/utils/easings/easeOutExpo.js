/**
 * @function
 * @param {Number} t A number between 0 and 1 representing a linearly progressing percentage through the animation.
 * @returns {Number} A number between 0 and 1 that is the eased version of the 't' parameter.
 */
export const easeOutExpo = (t) => {
  return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
};
