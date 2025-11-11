import localFont from "next/font/local";

export const sfProDisplay = localFont({
  src: [
    {
      path: "./SF-Pro-Display-Regular.otf",
      weight: "normal",
      style: "normal",
    },
    {
      path: "./SF-Pro-Display-Light.otf",
      weight: "300",
      style: "normal",
    },
    {
      path: "./SF-Pro-Display-Medium.otf",
      weight: "500",
      style: "normal",
    },
    {
      path: "./SF-Pro-Display-Semibold.otf",
      weight: "600",
      style: "normal",
    },
    {
      path: "./SF-Pro-Display-Bold.otf",
      weight: "bold",
      style: "normal",
    },
    {
      path: "./SF-Pro-Display-Black.otf",
      weight: "900",
      style: "normal",
    },
  ],
  variable: "--sf-pro-display",
  display: "swap",
});
