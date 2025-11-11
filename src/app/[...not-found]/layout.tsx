import clsx from "clsx";
import "@/styles/global.css";
import "swiper/css";
import "styles/index.scss";
import { fonts } from "../fonts";
import { ScrollRestoration } from "../ScrollRestoration";

export default async function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {

  return (
    <html lang="en" suppressHydrationWarning={true}>
      <head>
        <meta charSet="utf-8" />
        <link rel="icon" href="https://platformz.us/logo192.png" />
        <meta httpEquiv="Permissions-Policy" content="accelerometer=(), gyroscope=()" />
        <script src="https://code.tidio.co/4bzp9qizuxlrwvx3svpvxoweunduxnw2.js" async></script>
      </head>
      <body
        className={clsx(
          fonts.map((font) => font.variable),
          "overflow",
        )}
      >
        <ScrollRestoration />
        {children}
      </body>
    </html>
  );
}

