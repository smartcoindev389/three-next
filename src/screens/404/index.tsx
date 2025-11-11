"use client";

import clsx from "clsx";
import { FC } from "react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import styles from "./index.module.scss";
import { Squares } from "shared/components/(main)/squares";
import { Button } from "shared/components/(main)/button";
type IPage404 = object;

export const Page404: FC<IPage404> = () => {
  const router = useRouter();

  const handleGoBack = () => {
    const isInIframe = window.self !== window.top;

    if (isInIframe) {
      try {
        const parentWindow = window.parent as any;
        if (parentWindow.parentCallback && typeof parentWindow.parentCallback === "function") {
          parentWindow.parentCallback();
        } else {
          window.parent.postMessage({ action: "closeIframe" }, "*");
        }
      } catch (error) {
        try {
          window.parent.postMessage({ action: "closeIframe" }, "*");
        } catch (postMessageError) {
          console.error("Failed to communicate with parent:", postMessageError);
        }
      }
    } else {
      if (window.history.length > 1) {
        router.back();
      } else {
        router.push("/");
      }
    }
  };

  useEffect(() => {
    const isInIframe = window.self !== window.top;
    if (isInIframe) {
      document.body.style.margin = "0";
      document.body.style.padding = "0";
    }
  }, []);

  return (
    <section className={clsx(styles.Page404)}>
      <h1>Page not found, 404</h1>
      <Button className={styles.button} isBlueBtn onClick={handleGoBack}>
        <span>Go back</span>
      </Button>
      <Squares
        speed={0.25}
        squareSize={40}
        direction="diagonal"
        borderColor="#3F65FD"
        hoverFillColor="#3F65FD"
        className={styles.canvas}
      />
    </section>
  );
};
