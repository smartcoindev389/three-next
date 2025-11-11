"use client";
import clsx from "clsx";
import { ComponentPropsWithoutRef, forwardRef, PropsWithChildren } from "react";
import styles from "./index.module.scss";
import { FlyingParticles } from "shared/components/(main)/flying-particles";
import Link from "next/link";

export interface IButton
  extends Omit<ComponentPropsWithoutRef<"button">, "style"> {
  href?: string;
  className?: string;
  isBlueBtn?: boolean;
  isBlueBtnFull?: boolean;
  isSecondaryBtn?: boolean;
  width?: string | number;
}

export const Button = forwardRef<HTMLButtonElement | HTMLAnchorElement, PropsWithChildren<IButton>>(({
  children,
  className,
  href,
  isBlueBtn = false,
  isBlueBtnFull = false,
  isSecondaryBtn = false,
  width,
  ...restProps
}, ref) => {
  const buttonStyle = width
    ? { width: typeof width === "number" ? `${width}px` : width }
    : undefined;

  if (isBlueBtn) {
    return !href ? (
      <button
        ref={ref as React.Ref<HTMLButtonElement>}
        className={clsx(
          styles.buttonBlue,
          className,
          "button",
          isBlueBtnFull && styles.full,
          isSecondaryBtn && styles.isSecondaryBtn,
        )}
        style={buttonStyle}
        {...restProps}
      >
        <div className={clsx(styles.content)}>
          <span className={clsx(styles.text)}>
            {children}
            <div className={clsx(styles.hidden)}>{children}</div>
          </span>
        </div>
        <FlyingParticles color="#ffffff"></FlyingParticles>
      </button>
    ) : (
      <Link
        ref={ref as React.Ref<HTMLAnchorElement>}
        href={href}
        className={clsx(
          styles.buttonBlue,
          className,
          "button",
          isBlueBtnFull && styles.full,
          isSecondaryBtn && styles.isSecondaryBtn,
        )}
        style={buttonStyle}
      >
        <FlyingParticles color="#ffffff"></FlyingParticles>
        <div className={clsx(styles.content)}>
          <span className={clsx(styles.text)}>
            {children}
            <div className={clsx(styles.hidden)}>{children}</div>
          </span>
        </div>
      </Link>
    );
  }
  return !href ? (
    <button
      ref={ref as React.Ref<HTMLButtonElement>}
      className={clsx(styles.button, className, "button")}
      style={buttonStyle}
      {...restProps}
    >
      <div className={clsx(styles.content)}>
        <span className={clsx(styles.text)}>
          {children}
          <div className={clsx(styles.hidden)}>{children}</div>
        </span>
      </div>
      <FlyingParticles color="#0080D0"></FlyingParticles>
    </button>
  ) : (
    <Link
      ref={ref as React.Ref<HTMLAnchorElement>}
      href={href}
      className={clsx(styles.button, className, "button")}
      style={buttonStyle}
    >
      <FlyingParticles color="#0080D0"></FlyingParticles>
      <div className={clsx(styles.content)}>
        <span className={clsx(styles.text)}>
          {children}
          <div className={clsx(styles.hidden)}>{children}</div>
        </span>
      </div>
    </Link>
  );
});

Button.displayName = "Button";
