"use client";

import { useEffect } from "react";

import {
  initWebVitals,
  initPerformanceObserver,
} from "@/lib/analytics/web-vitals";
import { initPerformanceOptimizations } from "@/utils/optimizations";

interface WebVitalsProviderProps {
  children: React.ReactNode;
}

export default function WebVitalsProvider({
  children,
}: WebVitalsProviderProps) {
  useEffect(() => {
    // Initialize Web Vitals monitoring
    initWebVitals();

    // Initialize Performance Observer for additional monitoring
    initPerformanceObserver();

    // Initialize performance optimizations
    initPerformanceOptimizations();

    // Log initialization in development
    if (process.env.NODE_ENV === "development") {
      console.log(
        "🚀 Core Web Vitals monitoring and optimizations initialized",
      );
    }
  }, []);

  return <>{children}</>;
}
