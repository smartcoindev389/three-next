"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import ReactGA from "react-ga4";

const usePageTracking = (portal = "Customer") => {
  const pathname = usePathname();

  useEffect(() => {
    ReactGA.send({
      hitType: "pageview",
      page: pathname,
      title: document.title,
      portal: portal,
    });
  }, [pathname]);
};

export default usePageTracking;
