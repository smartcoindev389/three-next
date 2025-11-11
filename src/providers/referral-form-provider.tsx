"use client";
import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { Model } from "shared/modal";

interface ReferralFormContextType {
  open: () => void;
  close: () => void;
  toggle: () => void;
  openWithShare: () => string;
}

const ReferralFormContext = createContext<ReferralFormContextType | undefined>(
  undefined,
);

interface ReferralFormProviderProps {
  children: ReactNode;
}

export const ReferralFormProvider = ({
  children,
}: ReferralFormProviderProps) => {
  const [active, setActive] = useState<boolean>(false);

  const getUrlParams = () => {
    if (typeof window === "undefined") return null;
    return new URLSearchParams(window.location.search);
  };

  const updateUrlParams = (params: URLSearchParams) => {
    if (typeof window === "undefined") return;

    const newUrl = params.toString()
      ? `${window.location.pathname}?${params.toString()}`
      : window.location.pathname;

    window.history.pushState({}, "", newUrl);
  };

  useEffect(() => {
    const params = getUrlParams();
    if (params?.get("referral") === "open") {
      setActive(true);
    }
  }, []);

  useEffect(() => {
    const handlePopState = () => {
      const params = getUrlParams();
      setActive(params?.get("referral") === "open");
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const open = () => {
    setActive(true);
    const params = getUrlParams() || new URLSearchParams();
    params.set("referral", "open");
    updateUrlParams(params);
  };

  const close = () => {
    setActive(false);
    const params = getUrlParams() || new URLSearchParams();
    params.delete("referral");
    updateUrlParams(params);
  };

  const toggle = () => {
    if (active) {
      close();
    } else {
      open();
    }
  };

  const openWithShare = () => {
    setActive(true);
    const params = new URLSearchParams(window.location.search);
    params.set("referral", "open");

    const shareUrl = `${window.location.origin}${window.location.pathname}?${params.toString()}`;
    updateUrlParams(params);

    return shareUrl;
  };

  return (
    <ReferralFormContext.Provider
      value={{
        open,
        close,
        toggle,
        openWithShare,
      }}
    >
      {children}
      <Model active={active} />
    </ReferralFormContext.Provider>
  );
};

export const useReferralForm = () => {
  const context = useContext(ReferralFormContext);

  if (context === undefined) {
    throw new Error(
      "useReferralForm must be used within a ReferralFormProvider",
    );
  }

  return context;
};
