import { useCallback } from "react";

interface ScrollToBlockOptions {
  behavior?: "smooth" | "instant" | "auto";
  block?: "start" | "center" | "end" | "nearest";
  inline?: "start" | "center" | "end" | "nearest";
  offset?: number; // Додатковий відступ в пікселях
}

export const useScrollToBlock = () => {
  const scrollToBlock = useCallback(
    (
      elementOrSelector: Element | string,
      options: ScrollToBlockOptions = {},
    ) => {
      const {
        behavior = "smooth", // Тип скролу: 'smooth', 'instant', 'auto'
        block = "start",
        inline = "nearest",
        offset = 0,
      } = options;

      let element: Element | null = null;

      // Визначаємо елемент
      if (typeof elementOrSelector === "string") {
        element = document.querySelector(elementOrSelector);
      } else {
        element = elementOrSelector;
      }

      if (!element) {
        console.warn("Element not found for scrolling");
        return;
      }

      // Якщо є offset, використовуємо scrollTo з розрахунком позиції
      if (offset !== 0) {
        const elementRect = element.getBoundingClientRect();
        const absoluteElementTop = elementRect.top + window.pageYOffset;
        const targetPosition = absoluteElementTop + offset;

        window.scrollTo({
          top: targetPosition,
          behavior,
        });
      } else {
        // Стандартний scrollIntoView
        element.scrollIntoView({
          behavior,
          block,
          inline,
        });
      }
    },
    [],
  );

  // Додаткові методи для зручності
  const scrollToTop = useCallback((smooth = true) => {
    window.scrollTo({
      top: 0,
      behavior: smooth ? "smooth" : "instant",
    });
  }, []);

  const scrollToBottom = useCallback((smooth = true) => {
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: smooth ? "smooth" : "instant",
    });
  }, []);

  const scrollToId = useCallback(
    (id: string, options?: ScrollToBlockOptions) => {
      scrollToBlock(`#${id}`, options);
    },
    [scrollToBlock],
  );

  const scrollToClass = useCallback(
    (className: string, options?: ScrollToBlockOptions) => {
      scrollToBlock(`.${className}`, options);
    },
    [scrollToBlock],
  );

  return {
    scrollToBlock,
    scrollToTop,
    scrollToBottom,
    scrollToId,
    scrollToClass,
  };
};
