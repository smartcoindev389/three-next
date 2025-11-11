"use client";

import { Blur } from "shared/components/(main)/blur";
import Link from "next/link";
import styles from "./index.module.scss";
import lottie, { AnimationItem } from "lottie-web";
import { useEffect, useRef } from "react";

interface TermsOfServiceProps {
  data?: {
    terms?: string;
  };
}

export function TermsOfService({ data }: TermsOfServiceProps) {
  const html = data?.terms || "";
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
          <Link href="/">
            <span ref={logoRef} className={styles.logo} />
          </Link>
        </Blur>
        <div className={styles.Content} dangerouslySetInnerHTML={{ __html: html }} />
      </div>
    </main>
  );
}
