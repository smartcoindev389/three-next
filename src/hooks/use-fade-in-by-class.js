import { useEffect } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import gsap from "gsap";
gsap.registerPlugin(ScrollTrigger);
/**
 * Додає/знімає клас .visible для fade-in елементів з певним класом.
 * @param {string|string[]} classNames - Клас або масив класів (без крапки)
 * @param {boolean} visible - Чи показувати елементи
 */
export function useFadeInByClass(classNames, visible, ...args) {
  useEffect(() => {
    const classes = Array.isArray(classNames) ? classNames : [classNames];
    classes.forEach((cls) => {
      document.querySelectorAll(`.${cls}`).forEach((el) => {
        if (visible) {
          el.classList.add("visible");
        } else {
          el.classList.remove("visible");
        }
      });
    });
  }, [classNames, visible, ...args]);
}
