import * as cheerio from "cheerio";
import { FC } from "react";
import parse from "html-react-parser";

interface CharProps {
  str: string;
  isSpace?: boolean;
}

export const Chars: FC<CharProps> = ({ str, isSpace = false }) => {
  const $ = cheerio.load(str);

  const wrapText = (text: string): string => {
    if (isSpace) {
      return text
        .split(/\s+/)
        .map((word) => `<i class="char">${word}</i>`)
        .join(" ");
    } else {
      return text
        .split(/\s+/)
        .map((word) =>
          word
            .split("")
            .map((char) => `<i class="char">${char}</i>`)
            .join(""),
        )
        .map((word) => `<i class="charBig">${word}</i>`)
        .join(" ");
    }
  };

  $("*").each((_, el) => {
    const element = $(el);
    element.contents().each((__, node) => {
      if (node.type === "text") {
        const text = $(node).text();
        const wrapped = wrapText(text);
        $(node).replaceWith(wrapped);
      } else if (node.type === "tag" && node.tagName === "br") {
        $(node).replaceWith("<br>");
      }
    });
  });

  const a = $.html()
    .replace("<html>", "")
    .replace("</html>", "")
    .replace("<body>", "")
    .replace("</body>", "")
    .replace("<head>", "")
    .replace("</head>", "");

  return parse(a);
};
