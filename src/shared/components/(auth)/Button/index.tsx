// Button.js
import { ButtonHTMLAttributes } from "react";

/**
 * Renders a customizable button component with variant, size, and loading state options.
 * @example
 * Button({children: 'Click me', variant: 'secondary', onClick: handleClick})
 * <button>[Button Content]</button>
 * @param {Object} props - The properties object.
 * @param {React.ReactNode} props.children - The button content to display.
 * @param {string} [props.type='button'] - The type attribute of the button, usually 'button', 'submit', or 'reset'.
 * @param {function} [props.onClick] - Function to handle the onClick event.
 * @param {string} [props.variant='primary'] - The style variant of the button ('primary', 'secondary', 'danger').
 * @param {string} [props.size='lg'] - The size of the button ('sm', 'md', 'lg').
 * @param {string} [props.className=''] - Additional classnames for custom styling.
 * @param {boolean} [props.disabled=false] - A boolean that disables the button when true.
 * @param {boolean} [props.loading=false] - A boolean to indicate a loading state with a spinner animation.
 * @returns {JSX.Element} A button element with specified styles and functionalities.
 * @description
 *   - The `variant` and `size` props determine the button's styling according to predefined sets.
 *   - Displays a loading spinner animation when `loading` is true, replacing the button's children.
 */

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  type?: "button" | "submit" | "reset";
  onClick?: () => void;
  variant?: "primary" | "secondary" | "danger";
  size?: "sm" | "md" | "lg";
  className?: string;
  disabled?: boolean;
  loading?: boolean;
}

const Button = ({
  children,
  type = "button",
  onClick,
  variant = "primary",
  size = "lg",
  className,
  disabled = false,
  loading = false,
  ...props
} : ButtonProps) => {
  const baseStyles = "font-medium rounded-[5px] focus:outline-none transition";
  const variants = {
    primary: "bg-blue text-white hover:bg-[#495057]",
    secondary: "bg-gray-500 text-white hover:bg-gray-600 focus:ring-gray-300",
    danger: "bg-red-500 text-white hover:bg-red-600 focus:ring-red-300",
  };
  const sizes = {
    sm: "px-3 py-1 text-sm",
    md: "px-4 py-2",
    lg: "px-11 py-3.5 text-xl",
  };

  const buttonStyles = `${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`;

  return (
    <button
      className={buttonStyles}
      disabled={disabled}
      type={type}
      onClick={onClick}
      {...props}
    >
      {loading ? (
        <svg
          className="h-6 w-full"
          viewBox="0 0 200 200"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle
            cx="40"
            cy="100"
            fill="#FFFFFF"
            r="15"
            stroke="#FFFFFF"
            strokeWidth="15"
          >
            <animate
              attributeName="opacity"
              begin="-.4"
              calcMode="spline"
              dur="2"
              keySplines=".5 0 .5 1;.5 0 .5 1"
              repeatCount="indefinite"
              values="1;0;1;"
            />
          </circle>
          <circle
            cx="100"
            cy="100"
            fill="#FFFFFF"
            r="15"
            stroke="#FFFFFF"
            strokeWidth="15"
          >
            <animate
              attributeName="opacity"
              begin="-.2"
              calcMode="spline"
              dur="2"
              keySplines=".5 0 .5 1;.5 0 .5 1"
              repeatCount="indefinite"
              values="1;0;1;"
            />
          </circle>
          <circle
            cx="160"
            cy="100"
            fill="#FFFFFF"
            r="15"
            stroke="#FFFFFF"
            strokeWidth="15"
          >
            <animate
              attributeName="opacity"
              begin="0"
              calcMode="spline"
              dur="2"
              keySplines=".5 0 .5 1;.5 0 .5 1"
              repeatCount="indefinite"
              values="1;0;1;"
            />
          </circle>
        </svg>
      ) : (
        children
      )}
    </button>
  );
};

export default Button;
