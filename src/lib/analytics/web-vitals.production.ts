import { onCLS, onFCP, onLCP, onTTFB, onINP } from "web-vitals";

// Types for Web Vitals metrics
interface WebVitalMetric {
  name: string;
  value: number;
  rating: "good" | "needs-improvement" | "poor";
  delta: number;
  id: string;
  navigationType?: string;
}

interface AnalyticsEvent {
  event_name: string;
  metric_name: string;
  metric_value: number;
  metric_rating: string;
  metric_delta: number;
  metric_id: string;
  page_url: string;
  user_agent: string;
  connection_type?: string;
}

// Thresholds for Core Web Vitals (in milliseconds)
const VITALS_THRESHOLDS = {
  LCP: { good: 2500, poor: 4000 },
  INP: { good: 200, poor: 500 },
  CLS: { good: 0.1, poor: 0.25 },
  TTFB: { good: 800, poor: 1800 },
  FCP: { good: 1800, poor: 3000 },
};

// Get rating based on thresholds
function getRating(
  name: string,
  value: number,
): "good" | "needs-improvement" | "poor" {
  const thresholds = VITALS_THRESHOLDS[name as keyof typeof VITALS_THRESHOLDS];

  if (!thresholds) return "good";

  if (value <= thresholds.good) return "good";
  if (value <= thresholds.poor) return "needs-improvement";

  return "poor";
}

// Send metric to Google Analytics 4 (production optimized)
function sendToGoogleAnalytics(metric: WebVitalMetric) {
  if (typeof window !== "undefined" && window.gtag) {
    // Use requestIdleCallback for better performance
    const sendMetric = () => {
      window.gtag("event", metric.name, {
        event_category: "Web Vitals",
        event_label: metric.id,
        value: Math.round(
          metric.name === "CLS" ? metric.value * 1000 : metric.value,
        ),
        custom_map: {
          metric_rating: metric.rating,
          metric_delta: metric.delta,
        },
      });
    };

    if ("requestIdleCallback" in window) {
      requestIdleCallback(sendMetric);
    } else {
      setTimeout(sendMetric, 0);
    }
  }
}

// Send metric to Google Tag Manager (production optimized)
function sendToGTM(metric: WebVitalMetric) {
  if (typeof window !== "undefined" && window.dataLayer) {
    const sendMetric = () => {
      window.dataLayer.push({
        event: "web_vital",
        metric_name: metric.name,
        metric_value: metric.value,
        metric_rating: metric.rating,
        metric_delta: metric.delta,
        metric_id: metric.id,
        page_url: window.location.href,
        user_agent: navigator.userAgent,
      });
    };

    if ("requestIdleCallback" in window) {
      requestIdleCallback(sendMetric);
    } else {
      setTimeout(sendMetric, 0);
    }
  }
}

// Send metric to custom analytics endpoint (production optimized with batching)
let metricsQueue: AnalyticsEvent[] = [];
let batchTimeout: NodeJS.Timeout | null = null;

async function sendToCustomAnalytics(metric: WebVitalMetric) {
  try {
    const analyticsEvent: AnalyticsEvent = {
      event_name: "web_vital",
      metric_name: metric.name,
      metric_value: metric.value,
      metric_rating: metric.rating,
      metric_delta: metric.delta,
      metric_id: metric.id,
      page_url: window.location.href,
      user_agent: navigator.userAgent,
      connection_type:
        (navigator as any).connection?.effectiveType || "unknown",
    };

    // Add to queue for batching
    metricsQueue.push(analyticsEvent);

    // Clear existing timeout
    if (batchTimeout) {
      clearTimeout(batchTimeout);
    }

    // Send batch after 5 seconds or when queue reaches 10 items
    if (metricsQueue.length >= 10) {
      await sendBatch();
    } else {
      batchTimeout = setTimeout(sendBatch, 5000);
    }
  } catch (error) {
    // Silent fail in production
    if (process.env.NODE_ENV === "development") {
      console.error("Failed to queue web vital:", error);
    }
  }
}

async function sendBatch() {
  if (metricsQueue.length === 0) return;

  const batch = [...metricsQueue];

  metricsQueue = [];

  try {
    await fetch("/api/analytics/web-vitals", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ batch }),
    });
  } catch (error) {
    // Silent fail in production
    if (process.env.NODE_ENV === "development") {
      console.error("Failed to send web vitals batch:", error);
    }
  }
}

// Main function to handle web vital metrics (production optimized)
function handleWebVital(metric: any) {
  const webVitalMetric: WebVitalMetric = {
    name: metric.name,
    value: metric.value,
    rating: getRating(metric.name, metric.value),
    delta: metric.delta,
    id: metric.id,
    navigationType: metric.navigationType,
  };

  // Only send to analytics in production
  if (process.env.NODE_ENV === "production") {
    sendToGoogleAnalytics(webVitalMetric);
    sendToGTM(webVitalMetric);
    sendToCustomAnalytics(webVitalMetric);
  } else {
    // Development logging
    const emoji =
      webVitalMetric.rating === "good"
        ? "✅"
        : webVitalMetric.rating === "needs-improvement"
          ? "⚠️"
          : "❌";

    console.log(
      `${emoji} ${webVitalMetric.name}: ${webVitalMetric.value.toFixed(2)}${webVitalMetric.name === "CLS" ? "" : "ms"} (${webVitalMetric.rating})`,
    );

    // Store in localStorage for development debugging
    if (typeof window !== "undefined") {
      const vitals = JSON.parse(localStorage.getItem("web-vitals") || "[]");

      vitals.push({
        ...webVitalMetric,
        timestamp: Date.now(),
        url: window.location.href,
      });
      if (vitals.length > 50) vitals.shift();
      localStorage.setItem("web-vitals", JSON.stringify(vitals));
    }
  }
}

// Initialize Core Web Vitals monitoring (production optimized)
export function initWebVitals() {
  if (typeof window === "undefined") return;

  try {
    // Use passive listeners for better performance
    const options = { passive: true };

    // Core Web Vitals
    onCLS(handleWebVital);
    onLCP(handleWebVital);
    onINP(handleWebVital);

    // Additional metrics (only if enabled)
    if (process.env.NEXT_PUBLIC_ENABLE_ADDITIONAL_METRICS === "true") {
      onFCP(handleWebVital);
      onTTFB(handleWebVital);
    }

    // Send any remaining metrics when page is about to unload
    window.addEventListener(
      "beforeunload",
      () => {
        if (metricsQueue.length > 0) {
          sendBatch();
        }
      },
      options,
    );
  } catch (error) {
    // Silent fail in production
    if (process.env.NODE_ENV === "development") {
      console.error("Failed to initialize Web Vitals:", error);
    }
  }
}

// Performance observer for critical issues only (production optimized)
export function initPerformanceObserver() {
  if (typeof window === "undefined" || !("PerformanceObserver" in window))
    return;

  try {
    // Only monitor critical long tasks in production (>100ms instead of 50ms)
    const longTaskObserver = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        if (entry.duration > 100) {
          // More conservative threshold for production
          // Send to analytics instead of console
          if (window.gtag) {
            window.gtag("event", "long_task", {
              event_category: "Performance",
              value: Math.round(entry.duration),
              custom_map: {
                task_duration: entry.duration,
                task_start: entry.startTime,
              },
            });
          }
        }
      });
    });

    longTaskObserver.observe({ entryTypes: ["longtask"] });

    // Monitor significant layout shifts only (>0.1 instead of any shift)
    const layoutShiftObserver = new PerformanceObserver((list) => {
      let clsValue = 0;

      list.getEntries().forEach((entry: any) => {
        if (!entry.hadRecentInput) {
          clsValue += entry.value;
        }
      });

      if (clsValue > 0.1) {
        // Only significant layout shifts
        if (window.gtag) {
          window.gtag("event", "layout_shift", {
            event_category: "Performance",
            value: Math.round(clsValue * 1000),
            custom_map: {
              cls_value: clsValue,
            },
          });
        }
      }
    });

    layoutShiftObserver.observe({ entryTypes: ["layout-shift"] });
  } catch (error) {
    // Silent fail in production
    if (process.env.NODE_ENV === "development") {
      console.error("Failed to initialize Performance Observer:", error);
    }
  }
}

// Utility to measure custom metrics (production optimized)
export function measureCustomMetric(
  name: string,
  fn: () => void | Promise<void>,
) {
  const startTime = performance.now();

  const finish = () => {
    const duration = performance.now() - startTime;

    // Only log in development
    if (process.env.NODE_ENV === "development") {
      console.log(`Custom metric "${name}": ${duration.toFixed(2)}ms`);
    }

    // Send to analytics in production
    if (typeof window !== "undefined" && window.gtag) {
      const sendMetric = () => {
        window.gtag("event", "custom_metric", {
          event_category: "Performance",
          event_label: name,
          value: Math.round(duration),
        });
      };

      if ("requestIdleCallback" in window) {
        requestIdleCallback(sendMetric);
      } else {
        setTimeout(sendMetric, 0);
      }
    }
  };

  try {
    const result = fn();

    if (result instanceof Promise) {
      return result.finally(finish);
    } else {
      finish();

      return result;
    }
  } catch (error) {
    finish();
    throw error;
  }
}

// Export thresholds for use in other components
export { VITALS_THRESHOLDS };

// Type declarations for global objects
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
  }
}
