import { useTranslation } from "react-i18next";
import { emailRegExp } from "@/constants/regexp";

/**
 * Email input component allowing validation and custom styling
 * @example
 * InputEmail({ register, options, name: "email", label: "Email", placeholder: "Enter your email", errors: {} })
 * // Renders an email input field, displays an error message if applicable
 * @param {Object} { register } - React Hook Form's register function for input registration.
 * @param {Object} { options } - Options for input validation and registration.
 * @param {string} { name } - Name attribute for the input element.
 * @param {string} { label } - Label text displayed above the input field.
 * @param {string} { labelClassName } - Custom class name for additional styling of the label.
 * @param {string} { placeholder } - Placeholder text inside the input field.
 * @param {Object} { errors } - Error object containing validation errors.
 * @param {string} { className } - Optional custom class name for the input field.
 * @returns {JSX.Element} The email input component.
 * @description
 *   - Utilizes react-i18next for internationalization support.
 *   - Applies a regex pattern to validate the email format.
 *   - Displays a required asterisk if the `options` indicate required input.
 *   - Errors are shown underneath the input field using the `errors` object.
 */
export default function InputEmail({
  register,
  options,
  name,
  label,
  labelClassName,
  placeholder,
  errors,
  className,
}) {
  const { t, i18n } = useTranslation();

  return (
    <div className={"w-full"}>
      {label && (
        <label
          className={`block text-[#545454] p-1 text-base mb-2 ${labelClassName}`}
          htmlFor={label}
        >
          {label}{" "}
          {options?.required && <span className="text-[#F25454]">*</span>}
        </label>
      )}
      <input
        type="email"
        {...register(name, {
          ...options,
          pattern: { value: emailRegExp, message: t("Incorrect format") },
        })}
        className={
          className
            ? className
            : "text-[40px] py-6 px-4 rounded-xl border-2 border-[#D9D9D9] w-full outline-none"
        }
        placeholder={placeholder}
      />
      {errors[name] && (
        <p className={"text-base text-red-600 font-light text-start pt-2"}>
          {errors[name].message}
        </p>
      )}
    </div>
  );
}
