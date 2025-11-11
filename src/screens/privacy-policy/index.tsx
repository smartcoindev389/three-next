"use client";

import { Blur } from "shared/components/(main)/blur";
import lottie, { AnimationItem } from "lottie-web";
import { useEffect, useRef } from "react";
import styles from "./index.module.scss";

interface PrivacyPolicyProps {
  data?: {
    privacy?: string;
  };
}

export function PrivacyPolicy({ data }: PrivacyPolicyProps) {
  const html = data?.privacy || "";
  const logoRef = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    if (!logoRef.current) return;
    const anim: AnimationItem = lottie.loadAnimation({
      container: logoRef.current,
      renderer: "svg",
      loop: false,
      autoplay: true,
      path: "/lottie/lottie.json",
    });
    return () => anim.destroy();
  }, []);

  return (
    <main className={`page ${styles.Page}`}>
      <div className={styles.Container}>
        <Blur className={styles.BlurWrap}>
          <span ref={logoRef} className={styles.logo} />
        </Blur>
        <div className={styles.Content} dangerouslySetInnerHTML={{ __html: html }} />
      </div>
    </main>
  );
}
