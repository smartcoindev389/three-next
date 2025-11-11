"use client";

import { useEffect } from "react";

import { initializeGA } from "@/utils/google-analytics";

const useGoogleAnalytics = () => {
  useEffect(() => {
    if (!window.GA_INITIALIZED) {
      initializeGA();
      window.GA_INITIALIZED = true;
    }
  }, []);
};

export default useGoogleAnalytics;
