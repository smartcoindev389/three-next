import gsap from "gsap";
import SplitText from "gsap/SplitText";

import { ResizeService } from "@/lib/services/resize-service";
import { randomString } from "@/utils/basic-functions";

gsap.registerPlugin(SplitText);

const cache = {};

const attrId = "data-safe-split-text";

export class SafeSplitText extends SplitText {
  id;
  targets;

  /**
   * Splits a target element's text content into lines, words, and characters, and optionally sets aria-hidden attributes.
   * @example
   * constructor(targetElement, { wordsClass: 'custom-word' }, true)
   * // The text of targetElement will be split with lines, words, and characters classes customized, and aria-hidden attributes set.
   * @param {HTMLElement | HTMLElement[]} target - The target element(s) to split text from.
   * @param {Object} vars - Additional options to customize the splitting process, such as custom class names.
   * @param {boolean} setAriaHidden - Flag to determine if aria-hidden attributes should be set to true on split parts of text; defaults to true.
   * @returns {void} No return value.
   * @description
   *   - Uses a cache to manage state, reverting any existing cache before proceeding.
   *   - Ensures that target elements are not null or undefined, using a filtering mechanism.
   *   - Listens to resize events to adapt text splitting dynamically.
   */
  constructor(target, vars, setAriaHidden = true) {
    super(
      // https://github.com/microsoft/TypeScript/issues/8277
      (() => {
        const targets = [target].flat().filter(Boolean);
        const id = targets[0]?.getAttribute(attrId);

        if (id) cache[id]?.revert();

        return target;
      })(),
      {
        linesClass: "split-line",
        wordsClass: "split-word",
        charsClass: "split-char",
        ...vars,
      },
    );

    const targets = [target].flat().filter(Boolean);
    const id = targets[0]?.getAttribute(attrId) || randomString();

    this.targets = targets;

    cache[id] = this;

    this.id = id;
    this.targets = targets;
    this.targets.forEach((t) => {
      t.setAttribute(attrId, this.id);
    });

    if (setAriaHidden) {
      if (this.chars?.length)
        gsap.set(this.chars, { attr: { "aria-hidden": "true" } });
      if (this.words?.length)
        gsap.set(this.words, { attr: { "aria-hidden": "true" } });
      if (this.lines?.length)
        gsap.set(this.lines, { attr: { "aria-hidden": "true" } });
    }

    ResizeService.listen(this.onResize);
  }

  onResize = () => {
    this.revert();
  };

  revert = () => {
    this.targets.forEach((t) => {
      t.removeAttribute(attrId);
    });
    ResizeService.dismiss(this.onResize);
    cache[this.id] = null;
    // @ts-expect-error original file
    super.revert();
  };
}
