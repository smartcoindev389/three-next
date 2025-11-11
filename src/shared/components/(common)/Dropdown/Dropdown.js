import { useEffect, useRef, useState } from "react";
import { FiChevronDown } from "react-icons/fi";
import { motion } from "framer-motion";
import "flag-icons/css/flag-icons.min.css";

/**
 * Renders a dropdown component with animation effects and handles outside clicks to close the dropdown.
 * @example
 * DropdownComponent({ open: true, setOpen: () => {}, data: [], value: '', onSelect: () => {} })
 * <motion.div>...</motion.div>
 * @param {boolean} open - Indicates whether the dropdown is currently open.
 * @param {function} setOpen - Function to toggle the open state of the dropdown.
 * @param {Array} data - Array of objects containing dropdown options.
 * @param {string} value - The current selected value in the dropdown.
 * @param {function} onSelect - Function to handle the selection of a dropdown option.
 * @returns {JSX.Element} A dropdown component with interactive options.
 * @description
 *   - Utilizes hooks like useRef and useEffect for managing DOM events and rendering lifecycle.
 *   - Employs motion animations for smooth open and close transitions.
 *   - Prevents animation initiation during an ongoing animation process.
 */
const StaggeredDropDown = ({ open, setOpen, data, value, onSelect }) => {
  const dropdownRef = useRef(null);
  const [animationProcess, setAnimationProcess] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current?.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [setOpen]);

  const onToggleClick = () => {
    if (animationProcess) return;

    setOpen((pv) => !pv);
    setAnimationProcess(true);

    setTimeout(() => setAnimationProcess(false), 600);
  };

  return (
    <motion.div
      ref={dropdownRef}
      animate={open ? "open" : "closed"}
      className="relative"
    >
      <button
        className="flex items-center gap-2 px-3 py-2 rounded-md text-indigo-50 bg-indigo-500 hover:bg-indigo-500 transition-colors"
        onClick={onToggleClick}
      >
        <span className="font-medium text-sm" suppressHydrationWarning>
          {data.find((item) => item.code === value)
            ? data.filter((item) => item.code === value)[0].name
            : value || "USD"}
        </span>
        <motion.span className="w-6 h-6" variants={iconVariants}>
          <FiChevronDown className="w-6 h-6" />
        </motion.span>
      </button>

      <motion.ul
        data-lenis-prevent="true"
        initial={wrapperVariants.closed}
        variants={wrapperVariants}
        // style={{ originY: "top", translateX: "-25%" }}
        className="flex flex-col gap-2 p-2 rounded-lg bg-white shadow-xl absolute z-30 max-h-96 overflow-auto"
      >
        {data.map((item, idx) => (
          <Option
            key={idx}
            code={item.code}
            setOpen={setOpen}
            text={item.name}
            onSelect={onSelect}
          />
        ))}
      </motion.ul>
    </motion.div>
  );
};

/**
 * Render a list item with specific styles and behavior for a dropdown component.
 * @example
 * renderComponent("Sample Text", setOpenFunction, selectFunction, "en_us_code")
 * <motion.li>...</motion.li>
 * @param {string} text - The visible text for the list item.
 * @param {function} setOpen - Function to set the dropdown open status.
 * @param {function} onSelect - Function to handle selection of a code.
 * @param {string} code - Code indicating the language or locale.
 * @returns {JSX.Element} A list item element with embedded styles and dynamic content.
 * @description
 *   - Converts locale code from 'en' to 'eu' as a specific requirement.
 *   - Uses conditional rendering based on presence of underscore in code.
 *   - Applies motion animation and additional styling to the list item.
 *   - Closes dropdown upon selection for better user interaction.
 */
const Option = ({ text, setOpen, onSelect, code }) => {
  let codeParts = code ? code.split("_").pop().toLowerCase() : code;

  codeParts = codeParts === "en" ? "eu" : codeParts;

  return (
    <motion.li
      className="flex items-center gap-2 w-full p-2 text-xs font-medium whitespace-nowrap rounded-md hover:bg-indigo-100 text-slate-700 hover:text-indigo-500 transition-colors cursor-pointer"
      variants={itemVariants}
      onClick={() => {
        onSelect(code);
        setOpen(false);
      }}
    >
      {code.includes("_") ? <span className={`fi fi-${codeParts} fis`} /> : ""}
      <span>{text}</span>
    </motion.li>
  );
};

export default StaggeredDropDown;

const wrapperVariants = {
  open: {
    scaleY: 1,
    transition: {
      when: "beforeChildren",
      staggerChildren: 0.01,
    },
  },
  closed: {
    scaleY: 0,
    transition: {
      when: "afterChildren",
      staggerChildren: 0.01,
    },
  },
};

const iconVariants = {
  open: { rotate: 180 },
  closed: { rotate: 0 },
};

const itemVariants = {
  open: {
    opacity: 1,
    y: 0,
    transition: {
      when: "beforeChildren",
    },
  },
  closed: {
    opacity: 0,
    y: -15,
    transition: {
      when: "afterChildren",
    },
  },
};

const actionIconVariants = {
  open: { scale: 1, y: 0 },
  closed: { scale: 0, y: -7 },
};
