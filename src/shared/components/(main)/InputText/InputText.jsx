/**
 * Renders a styled text input field with validation.
 * @example
 * InputText({ register, options, name: 'email', label: 'Email', id: 'email-input', placeholder: 'Enter your email', errors, className: 'custom-class', width: 'w-1/2' })
 * <div class="w-1/2"> ... </div>
 * @param {Object} register - Function to register the input field with validation.
 * @param {Object} options - Validation options for the input field.
 * @param {string} name - Name of the input field for form handling.
 * @param {string} label - Label text for the input.
 * @param {string} id - Unique identifier for the input field.
 * @param {string} placeholder - Placeholder text for the input field.
 * @param {Object} errors - Errors object to display validation messages.
 * @param {string} className - Custom CSS class for additional styling.
 * @param {string} width - Width class for styling the input container.
 * @returns {JSX.Element} JSX representation of a text input field.
 * @description
 *   - Uses Regex for email validation.
 *   - Displays error message when there's a validation error.
 *   - Supports dynamic width and styling through props.
 */
export default function InputText({
  register,
  options,
  name,
  label,
  id,
  placeholder,
  errors,
  className,
  width,
}) {
  return (
    <div className={width ? width : "w-full"}>
      <input
        type="text"
        {...register(name, {
          ...options,
        })}
        className={
          className
            ? className
            : "text-xl md:text-3xl py-6 px-4 rounded-xl border-2 border-[#D9D9D9]  w-full outline-none"
        }
        id={id}
        placeholder={placeholder}
      />
      {errors[name] && (
        <p className={"text-base text-red-600 font-light pt-0"}>
          {errors[name].message}
        </p>
      )}
    </div>
  );
}
