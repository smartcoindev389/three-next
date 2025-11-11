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
  INP: { good: 200, poor: 500 }, // INP replaces FID in v5
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

// Send metric to Google Analytics 4
function sendToGoogleAnalytics(metric: WebVitalMetric) {
  if (typeof window !== "undefined" && window.gtag) {
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
  }
}

// Send metric to Google Tag Manager
function sendToGTM(metric: WebVitalMetric) {
  if (typeof window !== "undefined" && window.dataLayer) {
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
  }
}

// Send metric to custom analytics endpoint
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

    // Send to your custom analytics endpoint
    await fetch("/api/analytics/web-vitals", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(analyticsEvent),
    });
  } catch (error) {
    console.error("Failed to send web vital to custom analytics:", error);
  }
}

// Console logging for development
function logMetric(metric: WebVitalMetric) {
  if (process.env.NODE_ENV === "development") {
    const emoji =
      metric.rating === "good"
        ? "✅"
        : metric.rating === "needs-improvement"
          ? "⚠️"
          : "❌";

    console.log(
      `${emoji} ${metric.name}: ${metric.value.toFixed(2)}${metric.name === "CLS" ? "" : "ms"} (${metric.rating})`,
    );
  }
}

// Main function to handle web vital metrics
function handleWebVital(metric: any) {
  const webVitalMetric: WebVitalMetric = {
    name: metric.name,
    value: metric.value,
    rating: getRating(metric.name, metric.value),
    delta: metric.delta,
    id: metric.id,
    navigationType: metric.navigationType,
  };

  // Send to various analytics services
  logMetric(webVitalMetric);
  sendToGoogleAnalytics(webVitalMetric);
  sendToGTM(webVitalMetric);
  sendToCustomAnalytics(webVitalMetric);

  // Store in localStorage for debugging
  if (typeof window !== "undefined") {
    const vitals = JSON.parse(localStorage.getItem("web-vitals") || "[]");

    vitals.push({
      ...webVitalMetric,
      timestamp: Date.now(),
      url: window.location.href,
    });
    // Keep only last 50 measurements
    if (vitals.length > 50) vitals.shift();
    localStorage.setItem("web-vitals", JSON.stringify(vitals));
  }
}

// Initialize Core Web Vitals monitoring
export function initWebVitals() {
  if (typeof window === "undefined") return;

  try {
    // Core Web Vitals
    onCLS(handleWebVital);
    onLCP(handleWebVital);

    // Additional metrics
    onFCP(handleWebVital);
    onTTFB(handleWebVital);

    // New metric (Interaction to Next Paint)
    onINP(handleWebVital);
  } catch (error) {
    console.error("Failed to initialize Web Vitals:", error);
  }
}

// Get current page performance metrics
export function getPageMetrics() {
  if (typeof window === "undefined") return null;

  const navigation = performance.getEntriesByType(
    "navigation",
  )[0] as PerformanceNavigationTiming;
  const paint = performance.getEntriesByType("paint");

  return {
    // Navigation timing
    domContentLoaded:
      navigation.domContentLoadedEventEnd -
      navigation.domContentLoadedEventStart,
    loadComplete: navigation.loadEventEnd - navigation.loadEventStart,

    // Paint timing
    firstPaint:
      paint.find((entry) => entry.name === "first-paint")?.startTime || 0,
    firstContentfulPaint:
      paint.find((entry) => entry.name === "first-contentful-paint")
        ?.startTime || 0,

    // Resource timing
    totalResources: performance.getEntriesByType("resource").length,

    // Memory (if available)
    memory: (performance as any).memory
      ? {
          usedJSHeapSize: (performance as any).memory.usedJSHeapSize,
          totalJSHeapSize: (performance as any).memory.totalJSHeapSize,
          jsHeapSizeLimit: (performance as any).memory.jsHeapSizeLimit,
        }
      : null,
  };
}

// Performance observer for monitoring resource loading
export function initPerformanceObserver() {
  if (typeof window === "undefined" || !("PerformanceObserver" in window))
    return;

  try {
    // Monitor long tasks (blocking main thread)
    const longTaskObserver = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        if (entry.duration > 50) {
          // Tasks longer than 50ms
          console.warn(`Long task detected: ${entry.duration.toFixed(2)}ms`);

          // Send to analytics
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

    // Monitor layout shifts
    const layoutShiftObserver = new PerformanceObserver((list) => {
      let clsValue = 0;

      list.getEntries().forEach((entry: any) => {
        if (!entry.hadRecentInput) {
          clsValue += entry.value;
        }
      });

      if (clsValue > 0.1) {
        // Significant layout shift
        console.warn(`Layout shift detected: ${clsValue.toFixed(4)}`);
      }
    });

    layoutShiftObserver.observe({ entryTypes: ["layout-shift"] });
  } catch (error) {
    console.error("Failed to initialize Performance Observer:", error);
  }
}

// Utility to measure custom metrics
export function measureCustomMetric(
  name: string,
  fn: () => void | Promise<void>,
) {
  const startTime = performance.now();

  const finish = () => {
    const duration = performance.now() - startTime;

    console.log(`Custom metric "${name}": ${duration.toFixed(2)}ms`);

    // Send to analytics
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("event", "custom_metric", {
        event_category: "Performance",
        event_label: name,
        value: Math.round(duration),
      });
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
