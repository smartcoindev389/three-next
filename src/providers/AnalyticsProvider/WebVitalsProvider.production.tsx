"use client";

import { useEffect } from "react";

import {
  initWebVitals,
  initPerformanceObserver,
} from "@/lib/analytics/web-vitals.production";

interface WebVitalsProviderProps {
  children: React.ReactNode;
}

export default function WebVitalsProvider({
  children,
}: WebVitalsProviderProps) {
  useEffect(() => {
    // Only initialize if in browser environment
    if (typeof window === "undefined") return;

    // Initialize Web Vitals monitoring
    try {
      initWebVitals();

      // Initialize performance observer for critical issues only
      if (
        process.env.NODE_ENV === "production" ||
        process.env.NEXT_PUBLIC_ENABLE_PERFORMANCE_OBSERVER === "true"
      ) {
        initPerformanceObserver();
      }
    } catch (error) {
      // Silent fail in production
      if (process.env.NODE_ENV === "development") {
        console.error("Failed to initialize Web Vitals:", error);
      }
    }
  }, []);

  return <>{children}</>;
}
