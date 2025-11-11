"use client";

import { Provider as ReduxProvider } from "react-redux";
import { FC, PropsWithChildren } from "react";
import { SessionProvider } from "next-auth/react";
import { Provider as ToastProvider } from "@radix-ui/react-toast";
import { I18nextProvider } from "react-i18next";

import ApolloWrapper from "@/lib/apollo/client/apollo-wrapper";
import { store } from "@/lib/redux/store";
// import useGoogleAnalytics from "@/hooks/useGoogleAnalytics";
// import usePageTracking from "@/hooks/usePageTracking";
import { Toaster } from "@/shared/components/(common)/ui/toaster";
import { CartProvider } from "@/providers/CartProvider/CartProvider";
import i18n from "@/i18n/i18n";

const Providers: FC<PropsWithChildren> = ({ children }) => {
  // useGoogleAnalytics();
  // usePageTracking();

  return (
    <ToastProvider>
      <I18nextProvider i18n={i18n}>
        <ApolloWrapper>
          <SessionProvider>
            <CartProvider>
              <ReduxProvider store={store}>
                {children}
                <Toaster />
              </ReduxProvider>
            </CartProvider>
          </SessionProvider>
        </ApolloWrapper>
      </I18nextProvider>
    </ToastProvider>
  );
};

export default Providers;
