// const media = (
//     breakpoint: "phone" | "tab-mid" | "tab-big" | "tab-spec",
// ): boolean | undefined => {
//     if (breakpoint === "phone") {
//         return window.innerWidth > 767
//     } else if (breakpoint === "tab-mid") {
//         return window.innerWidth > 834
//     } else if (breakpoint === "tab-big") {
//         return window.innerWidth > 1260
//     } else if (breakpoint === "tab-spec") {
//         return window.innerWidth > 1060
//     }
// }
// export {media}

// * v2 for next
import { useEffect, useState } from "react";

export const useMedia = (
  breakpoint: "phone" | "tab-mid" | "tab-big" | "tab-spec",
): boolean | undefined => {
  const [result, setResult] = useState<boolean>();

  useEffect(() => {
    let newResult = false;

    if (breakpoint === "phone") {
      newResult = window.innerWidth > 767;
    } else if (breakpoint === "tab-mid") {
      newResult = window.innerWidth > 1000;
    } else if (breakpoint === "tab-big") {
      newResult = window.innerWidth > 1260;
    } else if (breakpoint === "tab-spec") {
      newResult = window.innerWidth > 1060;
    }

    setResult(newResult);
  }, [breakpoint]);

  return result;
};
