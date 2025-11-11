export const stickyProgress = (
  element: HTMLElement,
  handleProgress?: (progress: number) => void,
  lastOffset?: string | number,
) => {
  let stickyBox: HTMLElement;

  const getOffset = () => {
    if (typeof lastOffset === "number") {
      return lastOffset;
    }

    if (typeof lastOffset === "string") {
      const num = parseFloat(lastOffset);

      if (lastOffset.includes("vh")) {
        return window.innerHeight * (num / 100);
      }

      if (lastOffset.includes("%")) {
        return stickyBox.scrollHeight * (num / 100);
      }

      return num;
    }

    return 0;
  };

  const scroll = () => {
    const boxCoords = stickyBox.getBoundingClientRect();

    const height = element.scrollHeight;
    const totalHeight = stickyBox.scrollHeight - height - getOffset();
    const topStart = boxCoords.top + window.pageYOffset;

    const elTop = element.getBoundingClientRect().top + window.pageYOffset;

    let progress = (elTop - topStart) / totalHeight;

    if (progress < 0) progress = 0;
    if (progress > 1) progress = 1;

    handleProgress?.(progress);
  };

  const init = () => {
    const box = element.parentElement;
    if (box) {
      stickyBox = box;
      window.addEventListener("scroll", scroll);
      window.addEventListener("resize", scroll);

      setTimeout(() => scroll(), 300);
    }
  };

  init();

  return {
    destroy: () => {
      window.removeEventListener("scroll", scroll);
      window.removeEventListener("resize", scroll);
    },
  };
};
