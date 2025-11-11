/**
 * Renders a white circle SVG icon with customizable width, height, and className.
 * @example
 * WhiteCircle({ width: 100, height: 100, className: 'my-circle' })
 * Returns an SVG element with a white stroked circle.
 * @param {Object} props - Properties to customize the SVG element.
 * @param {number} [props.width=63] - The width of the SVG.
 * @param {number} [props.height=63] - The height of the SVG.
 * @param {string} props.className - The class name for the SVG element.
 * @returns {JSX.Element} A JSX element representing the SVG with a white stroked circle.
 * @description
 *   - The circle in the SVG is centered at (31.5, 31.5) with a radius of 29.5.
 *   - Stroke color of the circle is set to white, with a stroke width of 4.
 *   - The 'viewBox' is set to '0 0 63 63' to make the circle responsive.
 */
export function WhiteCircle({ width = 63, height = 63, className }) {
  return (
    <svg
      className={className}
      fill="none"
      height={height}
      viewBox="0 0 63 63"
      width={width}
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="31.5" cy="31.5" r="29.5" stroke="white" strokeWidth="4" />
    </svg>
  );
}
