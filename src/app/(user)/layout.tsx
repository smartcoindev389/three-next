"use client";
import "@/styles/global.css";
import { ReferralFormProvider } from "providers/referral-form-provider";
import Providers from "providers/providers";
import WebVitalsProvider from "providers/AnalyticsProvider/WebVitalsProvider";
import ToastContainer from "shared/components/(common)/ToastContainer/ToastContainer";
import { fonts } from "app/fonts";
import clsx from "clsx";

export default function Layout(props: { children: React.ReactNode }) {
  const { children } = props;

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
          "overflow bg-[#081927]",
        )}
      >
        <ReferralFormProvider>
          <ToastContainer />
          <WebVitalsProvider>
            <Providers>
              <main className="w-full m-auto">
                {children}
              </main>
            </Providers>
          </WebVitalsProvider>
        </ReferralFormProvider>
      </body>
    </html>
  );
}
