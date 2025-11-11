/**
 * Renders an orange circle SVG component with customizable dimensions and class name.
 * @example
 * OrangeCircle({ width: 60, height: 60, className: 'my-circle' })
 * Returns an SVG element representing an orange circle.
 * @param {Object} { width, height, className } - The configuration object for the Orange Circle.
 * @param {number} { width=55 } - The width of the SVG element.
 * @param {number} { height=55 } - The height of the SVG element.
 * @param {string} { className } - The class name for the SVG element.
 * @returns {JSX.Element} React component rendering an SVG element.
 * @description
 *   - The circle is centered at coordinates (37.4257, 37.4258) with a radius of 34.6661.
 *   - Stroke color is set to '#FFB143'.
 *   - The circle is slightly rotated by 6.22513 degrees.
 *   - Default dimensions are 55x55 pixels.
 */
export function OrangeCircle({ width = 55, height = 55, className }) {
  return (
    <svg
      className={className}
      fill="none"
      height={height}
      viewBox="0 0 75 75"
      width={width}
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle
        cx="37.4257"
        cy="37.4258"
        r="34.6661"
        stroke="#FFB143"
        strokeWidth="7"
        transform="rotate(6.22513 37.4257 37.4258)"
      />
    </svg>
  );
}
