import clsx from "clsx";
import { FC } from "react";

import { BorderGradient, IBorderGradient } from "../border-gradient";

import styles from "./index.module.scss";

interface IBorderGradientLight extends IBorderGradient {
  customStyle?: React.CSSProperties; // Add customStyle for inline styles
}

export const BorderGradientLight: FC<IBorderGradientLight> = ({
  customStyle,
  ...props
}) => {
  return (
    <div className={clsx(styles.BorderGradientLight)} style={customStyle}>
      {" "}
      {/* Apply the custom styles */}
      <BorderGradient {...props} />
      <BorderGradient {...props} />
    </div>
  );
};
