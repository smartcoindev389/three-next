"use client";
import { FC, useEffect, useRef } from "react";
import styles from "./EmptyState.module.scss";
import gsap from "gsap";

interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: string;
}

export const EmptyState: FC<EmptyStateProps> = ({
  title = "No Data Available",
  description = "We're currently unable to load the content. Please try refreshing the page or check back later.",
  icon = "📭"
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      const elements = containerRef.current.querySelectorAll(`.${styles.animateIn}`);

      gsap.fromTo(
        elements,
        {
          opacity: 0,
          y: 30,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.15,
          ease: "power3.out",
        }
      );

      // Floating animation for the icon
      gsap.to(`.${styles.icon}`, {
        y: -10,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
    }
  }, []);

  return (
    <div className={styles.EmptyState} ref={containerRef}>
      <div className={styles.content}>
        <div className={`${styles.icon} ${styles.animateIn}`}>
          {icon}
        </div>
        <h2 className={`${styles.title} ${styles.animateIn}`}>{title}</h2>
        <p className={`${styles.description} ${styles.animateIn}`}>{description}</p>
        <button
          className={`${styles.button} ${styles.animateIn}`}
          onClick={() => window.location.reload()}
        >
          Refresh Page
        </button>
      </div>
      <div className={styles.background}>
        <div className={styles.circle}></div>
        <div className={styles.circle}></div>
        <div className={styles.circle}></div>
      </div>
    </div>
  );
};
