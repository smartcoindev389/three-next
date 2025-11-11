import { useState, useEffect } from "react";

/**
 * Custom hook to check if the window width is less than or equal to 768 pixels.
 * @example
 * useMaxMd()
 * false
 * @param None - This hook does not take any parameters.
 * @returns {boolean} Returns true if the window width is less than or equal to 768 pixels, otherwise false.
 * @description
 *   - Utilizes the useState hook to manage the boolean state.
 *   - Uses the useEffect hook to set up an event listener for window resizing.
 *   - Automatically cleans up the event listener on component unmount.
 */
const useMaxMd = () => {
  const [isMaxMd, setIsMaxMd] = useState(false);

  useEffect(() => {
    const checkIfMaxMd = () => {
      setIsMaxMd(window.innerWidth <= 768);
    };

    checkIfMaxMd();

    window.addEventListener("resize", checkIfMaxMd);

    return () => {
      window.removeEventListener("resize", checkIfMaxMd);
    };
  }, []);

  return isMaxMd;
};

export default useMaxMd;
