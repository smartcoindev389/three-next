import { useState } from "react";
import { useTranslation } from "react-i18next";

/**
 * Renders an input field for passwords with a toggle-able visibility feature.
 * @example
 * InputPassword({
 *   register: formRegisterFunction,
 *   options: { required: true },
 *   name: 'userPassword',
 *   label: 'Password',
 *   placeholder: 'Enter your password',
 *   errors: formErrorsObject,
 *   className: 'custom-class',
 *   labelClassName: 'custom-label-class',
 *   eyeIconClassName: 'eye-icon-class',
 *   inputContainerClasses: 'input-container-class',
 * })
 * // Returns a JSX component for password input field.
 * @param {Function} register - Function to register the input with form management library.
 * @param {Object} options - Validation options for the input field.
 * @param {string} name - Name of the input field to link with form management.
 * @param {string} label - Label for the input field.
 * @param {string} placeholder - Placeholder text for the input field.
 * @param {Object} errors - Object containing form errors.
 * @param {string} [className] - Custom class for the input field.
 * @param {string} [labelClassName] - Custom class for the label of the input field.
 * @param {string} [eyeIconClassName] - Custom class for the eye icon to toggle password visibility.
 * @param {string} [inputContainerClasses] - Classes for the input container.
 * @returns {JSX.Element} The password input component with visibility toggle and validation error display.
 * @description
 *   - Utilizes `useState` from React for toggling password visibility.
 *   - Default style is provided but can be overridden by custom class names.
 *   - Displays an error message if the respective input validation fails.
 *   - Integrates translation functionality using `useTranslation` hook.
 */
export default function InputPassword({
  register,
  options,
  name,
  label,
  placeholder,
  errors,
  className,
  labelClassName,
  eyeIconClassName,
  inputContainerClasses,
}) {
  const { t, i18n } = useTranslation();
  const [showPassword, setShowPassword] = useState(false);

  const style =
    "text-[40px] text-red-600 py-6 px-4 rounded-xl border-2 border-[#D9D9D9] w-full outline-none";

  return (
    <div className={"w-full relative"}>
      {label && (
        <label
          className={`block text-[#545454] p-1 text-base mb-2 ${labelClassName}`}
          htmlFor={label}
        >
          {label}{" "}
          {options?.required && <span className="text-[#F25454]">*</span>}
        </label>
      )}
      <div className={`w-full relative ${inputContainerClasses}`}>
        <input
          type={showPassword ? "text" : "password"}
          {...register(name, {
            ...options,
            pattern: {
              value:
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#+])[A-Za-z\d@$!%*?&#+]{8,}$/,
              message:
                "The password must contain at least one lowercase letter, one uppercase letter, one number, one special character, and be at least 8 characters long. For example, Abcdefgh1$",
            },
          })}
          className={className ? className : style}
          placeholder={placeholder}
        />
        <div
          className={
            eyeIconClassName
              ? eyeIconClassName
              : "absolute right-4 top-[50%] -translate-y-[50%]"
          }
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? (
            <svg
              fill="none"
              height="12"
              viewBox="0 0 21 12"
              width="21"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M10.2494 4.44287C11.9954 4.44287 13.4114 5.85787 13.4114 7.60487C13.4114 9.35087 11.9954 10.7659 10.2494 10.7659C8.50338 10.7659 7.08838 9.35087 7.08838 7.60487"
                stroke="#74788D"
                strokeLinecap="square"
                strokeWidth="1.5"
              />
              <path
                d="M19.5 7.604C17.539 3.476 14.056 1 10.248 1H10.252C6.444 1 2.961 3.476 1 7.604"
                stroke="#74788D"
                strokeLinecap="square"
                strokeWidth="1.5"
              />
            </svg>
          ) : (
            <svg
              fill="none"
              height="17"
              viewBox="0 0 21 17"
              width="21"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M10.2494 5.44287C11.9954 5.44287 13.4114 6.85787 13.4114 8.60487C13.4114 10.3509 11.9954 11.7659 10.2494 11.7659C8.50338 11.7659 7.08838 10.3509 7.08838 8.60487"
                stroke="#74788D"
                strokeLinecap="square"
                strokeWidth="1.5"
              />
              <path
                d="M19.5 8.604C17.539 4.476 14.056 2 10.248 2H10.252C6.444 2 2.961 4.476 1 8.604"
                stroke="#74788D"
                strokeLinecap="square"
                strokeWidth="1.5"
              />
              <line
                stroke="#F46A6A"
                strokeWidth="1.5"
                x1="18.5303"
                x2="3.53033"
                y1="0.53033"
                y2="15.5303"
              />
            </svg>
          )}
        </div>
      </div>
      {errors[name] && (
        <p className={"text-base text-red-600 font-light pt-2 text-start"}>
          {errors[name].message}
        </p>
      )}
    </div>
  );
}
