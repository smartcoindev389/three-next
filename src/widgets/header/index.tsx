import clsx from "clsx";
import { FC, useEffect, useState, useRef, useCallback, useMemo } from "react";
import styles from "./index.module.scss";
import Link from "next/link";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { dataLists0 } from "@/data/dataLists";
import { Blur } from "shared/components/(main)/blur";
import { usePathname } from "next/navigation";
import { Button } from "shared/components/(main)/button";
import lottie, { AnimationItem } from "lottie-web";
import { Socials } from "shared/components/(main)/socials";
gsap.registerPlugin(ScrollTrigger);

interface MenuItem {
  id: number;
  label: string;
  href: string;
}

interface SocialLink {
  id: number;
  social_network: string;
  url: string;
}

interface HeaderData {
  together_text: string;
  menu: MenuItem[];
  social_links: SocialLink[];
}

type IHeader = {
  headerData?: HeaderData | null;
};

export const Header: FC<IHeader> = ({ headerData }) => {
  const [active, setActive] = useState(false);
  const [preloader, setPreloader] = useState(true);
  const pathname = usePathname();
  const headerRef = useRef<HTMLElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const loaderAnimationRef = useRef<AnimationItem | null>(null);
  const logoAnimationRef = useRef<AnimationItem | null>(null);
  const preloaderRef = useRef<HTMLDivElement>(null);
  const isComing = useMemo(() => pathname === "/coming-soon", [pathname]);
  const isPlayground = useMemo(() => pathname === "/playground", [pathname]);
  const spanRef = useRef<HTMLDivElement>(null);

  // Use Strapi data if available, otherwise fall back to default data
  const menuItems = useMemo(
    () =>
      headerData?.menu?.map((item) => ({
        text: item.label.toLowerCase(),
        link: item.href,
      })) || dataLists0,
    [headerData],
  );

  const togetherText = headerData?.together_text || "let's work together";
  const socialLinks = headerData?.social_links || [];

  const handleClickOutside = useCallback((event: MouseEvent) => {
    const target = event.target as Node;

    if (
      headerRef.current &&
      mobileMenuRef.current &&
      !headerRef.current.contains(target) &&
      !mobileMenuRef.current.contains(target)
    ) {
      setActive(false);
    }
  }, []);

  const toggleMenu = useCallback(() => {
    setActive((prev) => !prev);
  }, []);

  useEffect(() => {
    setActive(false);
  }, [pathname]);

  useEffect(() => {
    if (active) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [active, handleClickOutside]);

  useEffect(() => {
    const loaderElement = document.querySelector(`.${styles.loader}`);
    if (!loaderElement || document.querySelector(`.${styles.loader} svg`)) {
      return;
    }

    loaderAnimationRef.current = lottie.loadAnimation({
      container: loaderElement as HTMLElement,
      renderer: "svg",
      loop: false,
      autoplay: true,
      path: "/lottie/lottie.json",
    });

    const handleComplete = () => {
      setPreloader(false);
      if (loaderAnimationRef.current) {
        loaderAnimationRef.current.removeEventListener(
          "complete",
          handleComplete,
        );
      }
    };

    if (isPlayground) {
      document.addEventListener("complete_game", handleComplete);
    } else {
      loaderAnimationRef.current.addEventListener("complete", handleComplete);
    }

    return () => {
      if (loaderAnimationRef.current) {
        loaderAnimationRef.current.removeEventListener(
          "complete",
          handleComplete,
        );
        loaderAnimationRef.current.destroy();
        document.removeEventListener("complete_game", handleComplete);
      }
    };
  }, [isPlayground]);

  useGSAP(() => {
    if (preloader) return;

    const preloaderElement = preloaderRef.current;
    const logoElement = document.querySelector(`.${styles.logo}`);
    const asideElement = document.querySelector(`.${styles.aside}`);
    const loaderElement = document.querySelector(`.${styles.loader}`);

    if (!preloaderElement || !logoElement || !asideElement || !loaderElement) {
      return;
    }

    logoAnimationRef.current = lottie.loadAnimation({
      container: logoElement as HTMLElement,
      renderer: "svg",
      loop: false,
      autoplay: false,
      path: "/lottie/lottie.json",
    });

    const appearanceTimeline = gsap.timeline({
      paused: true,
      defaults: {
        duration: 0.8,
        ease: "power3.out",
      },
    });

    appearanceTimeline
      .from(logoElement, {
        x: 20,
        y: 10,
        opacity: 0,
        onComplete: () => {
          logoAnimationRef.current?.play();
        },
      })
      .from(
        asideElement,
        {
          y: 20,
          opacity: 0,
        },
        "-=0.4",
      );

    const preloaderTimeline = gsap.timeline({
      defaults: {
        duration: 0.6,
        ease: "power3.inOut",
      },
    });

    preloaderTimeline
      .to(loaderElement, {
        opacity: 0,
        scale: 0.8,
      })
      .to(
        preloaderElement,
        {
          opacity: 0,
          onComplete: () => {
            preloaderElement.remove();
            appearanceTimeline.play();
          },
        },
        "-=0.3",
      );

    return () => {
      if (logoAnimationRef.current) {
        logoAnimationRef.current.destroy();
      }
      appearanceTimeline.kill();
      preloaderTimeline.kill();
    };
  }, [preloader]);

  useEffect(() => {
    return () => {
      if (loaderAnimationRef.current) {
        loaderAnimationRef.current.destroy();
      }
      if (logoAnimationRef.current) {
        logoAnimationRef.current.destroy();
      }
    };
  }, []);

  if (isComing) return null;

  return (
    <>
      <header ref={headerRef} className={clsx(styles.Header, "shake")}>
        <Link href="/" className={styles.logo} />
        <div className={styles.aside}>
          <Link href="/contact"><button className={styles.link}>{togetherText}</button></Link>
          <span className={styles.divider} />
          <button
            onClick={toggleMenu}
            className={clsx(
              styles.menu,
              "brackets",
              active && styles.active,
              "hover-text-wrapper",
            )}
            aria-label="Toggle menu"
            aria-expanded={active}
          >
            <span className="hover-text" data-text="menu">
              menu
            </span>
          </button>
        </div>
      </header>
      <div
        ref={mobileMenuRef}
        className={clsx(styles.mobileMenu, active && styles.active)}
        role="navigation"
        aria-hidden={!active}
      >
        <Blur isAnimation className={styles.blur1} isBorder isBorderHover>
          <ul role="list">
            {menuItems.map((item) => (
              <li key={item.link} role="listitem">
                <Link
                  className={clsx(
                    pathname === item.link && styles.activeLink,
                    "hover-text-wrapper",
                  )}
                  href={item.link}
                  aria-current={pathname === item.link ? "page" : undefined}
                >
                  <span className="hover-text" data-text={item.text}>
                    {item.text}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </Blur>
        <Blur isAnimation className={styles.blur2} isBorder isBorderHover>
          <h3>Get a quote</h3>
          <Button href="/contact" isBlueBtn isBlueBtnFull>
            go to page
          </Button>
        </Blur>
        <Blur isAnimation className={styles.blur3} isBorder isBorderHover>
          <Link href="/playground">
            <span className={styles.playground}>playground</span>
          </Link>
        </Blur>
        <Blur isAnimation className={styles.blur4} isBorder isBorderHover>
          <Socials className={styles.socials} socialLinks={socialLinks} />
        </Blur>
      </div>
      <div ref={preloaderRef} className={styles.preloader}>
        <div className={styles.loader} />
        {isPlayground && (
          <div id="playground_new" className={styles.playground_new}>
            <div className={styles.playground_new_bar}>
              <div className={styles.playground_new_bar_inner}></div>
            </div>
            <span id="percent-text-loader" ref={spanRef}>
              100%
            </span>
          </div>
        )}
      </div>
    </>
  );
};
