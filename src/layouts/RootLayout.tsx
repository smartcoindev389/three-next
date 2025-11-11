"use client";
import { FC, PropsWithChildren, useEffect } from "react";
import { Footer } from "widgets/footer";
import { Header } from "widgets/header";
import { useFadeInByClass } from "@/hooks/use-fade-in-by-class";
import stylesHeader from "@/widgets/header/index.module.scss";
import stylesFooter from "@/widgets/footer/index.module.scss";
import { ReferralFormProvider } from "providers/referral-form-provider";
import style from "./style.module.scss";
import { usePathname } from "next/navigation";
import WebVitalsProvider from "providers/AnalyticsProvider/WebVitalsProvider";
import ToastContainer from "shared/components/(common)/ToastContainer/ToastContainer";

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

interface FooterLink {
  id: number;
  label: string;
  href: string;
}

interface FooterData {
  button_text: string;
  left_description: string;
  phone: string;
  email: string;
  copyright: string;
  left_link: FooterLink[];
  right_link: FooterLink[];
}

type IRootLayout = {
  headerData?: HeaderData | null;
  footerData?: FooterData | null;
};

export const RootLayout: FC<PropsWithChildren<IRootLayout>> = ({
  children,
  headerData,
  footerData,
}) => {
  const pathname = usePathname();

  useFadeInByClass([stylesHeader.Header, stylesFooter.Footer], true, pathname);

  useEffect(() => {
    const handleLoad = () => {
      document.body.classList.remove("overflow");
    };

    if (document.readyState === "complete") {
      handleLoad();
    } else {
      window.addEventListener("load", handleLoad);
    }

    return () => {
      window.removeEventListener("load", handleLoad);
    };
  }, []);

  return (
    <ReferralFormProvider>
      <ToastContainer />
      <WebVitalsProvider>
        <div className={style.wrapper}>
          <Header headerData={headerData} />
          {children}
        </div>
        <Footer footerData={footerData || undefined} />
      </WebVitalsProvider>
    </ReferralFormProvider>
  );
};
