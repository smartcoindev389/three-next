export const sticky = (element: HTMLElement, top: number) => {
  let boxElement: HTMLElement;
  let raf: number;

  const scroll = () => {
    const rect = boxElement.getBoundingClientRect();
    const maxTransformY = rect.height - element.offsetHeight;

    const y = -(rect.top - top);

    if (y > 0) {
      element.style.transform = `translateY(${Math.min(y, maxTransformY)}px)`;
    }

    raf = requestAnimationFrame(scroll);
  };

  const init = () => {
    const el = element.parentElement;

    if (el) {
      boxElement = el;

      raf = requestAnimationFrame(scroll);

      window.addEventListener("scroll", scroll);
    }
  };

  const destroy = () => {
    window.removeEventListener("scroll", scroll);
    cancelAnimationFrame(raf);
  };

  init();

  return {
    destroy,
  };
};
