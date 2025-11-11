import style from "./style.module.scss";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);
import { useGSAP } from "@gsap/react";

export const Progress = () => {
  useGSAP(() => {
    window.onscroll = () => {
      const winScroll =
        document.body.scrollTop || document.documentElement.scrollTop;
      const height =
        document.documentElement.scrollHeight -
        document.documentElement.clientHeight;
      const scrolled = (winScroll / height) * 100;
      gsap.to(`.${style.bar}`, {
        width: scrolled + "%",
        duration: 0.1,
        ease: "power1.inOut",
      });
    };
  });
  return (
    <div className={style.progress}>
      <div className={style.bar}></div>
    </div>
  );
};
