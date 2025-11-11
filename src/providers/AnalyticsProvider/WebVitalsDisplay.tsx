"use client";

import { useEffect, useState } from "react";

import { VITALS_THRESHOLDS } from "@/lib/analytics/web-vitals";

interface WebVitalMetric {
  name: string;
  value: number;
  rating: "good" | "needs-improvement" | "poor";
  timestamp: number;
  url: string;
}

interface WebVitalsDisplayProps {
  showInProduction?: boolean;
  position?: "top-left" | "top-right" | "bottom-left" | "bottom-right";
  minimized?: boolean;
}

export default function WebVitalsDisplay({
  showInProduction = false,
  position = "bottom-right",
  minimized = false,
}: WebVitalsDisplayProps) {
  const [vitals, setVitals] = useState<WebVitalMetric[]>([]);
  const [isMinimized, setIsMinimized] = useState(minimized);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Only show in development unless explicitly enabled for production
    if (process.env.NODE_ENV === "production" && !showInProduction) {
      return;
    }

    setIsVisible(true);

    // Load existing vitals from localStorage
    const loadVitals = () => {
      try {
        const stored = localStorage.getItem("web-vitals");

        if (stored) {
          const parsedVitals = JSON.parse(stored);

          setVitals(parsedVitals.slice(-6)); // Show last 6 metrics
        }
      } catch (error) {
        console.error("Error loading web vitals from localStorage:", error);
      }
    };

    loadVitals();

    // Listen for storage changes (when new vitals are added)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "web-vitals") {
        loadVitals();
      }
    };

    window.addEventListener("storage", handleStorageChange);

    // Poll for updates every 2 seconds
    const interval = setInterval(loadVitals, 2000);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      clearInterval(interval);
    };
  }, [showInProduction]);

  if (!isVisible) return null;

  const getPositionClasses = () => {
    const base = "fixed z-50";

    switch (position) {
      case "top-left":
        return `${base} top-4 left-4`;
      case "top-right":
        return `${base} top-4 right-4`;
      case "bottom-left":
        return `${base} bottom-4 left-4`;
      case "bottom-right":
      default:
        return `${base} bottom-4 right-4`;
    }
  };

  const getRatingColor = (rating: string) => {
    switch (rating) {
      case "good":
        return "text-green-600 bg-green-50";
      case "needs-improvement":
        return "text-yellow-600 bg-yellow-50";
      case "poor":
        return "text-red-600 bg-red-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  const getRatingEmoji = (rating: string) => {
    switch (rating) {
      case "good":
        return "✅";
      case "needs-improvement":
        return "⚠️";
      case "poor":
        return "❌";
      default:
        return "📊";
    }
  };

  const formatValue = (name: string, value: number) => {
    if (name === "CLS") {
      return value.toFixed(3);
    }

    return `${Math.round(value)}ms`;
  };

  const getMetricDescription = (name: string) => {
    switch (name) {
      case "LCP":
        return "Largest Contentful Paint";
      case "INP":
        return "Interaction to Next Paint";
      case "CLS":
        return "Cumulative Layout Shift";
      case "TTFB":
        return "Time to First Byte";
      case "FCP":
        return "First Contentful Paint";
      default:
        return name;
    }
  };

  const getThresholds = (name: string) => {
    const thresholds =
      VITALS_THRESHOLDS[name as keyof typeof VITALS_THRESHOLDS];

    if (!thresholds) return null;

    if (name === "CLS") {
      return `Good: ≤${thresholds.good}, Poor: >${thresholds.poor}`;
    }

    return `Good: ≤${thresholds.good}ms, Poor: >${thresholds.poor}ms`;
  };

  // Group vitals by metric name and get the latest for each
  const latestVitals = vitals.reduce(
    (acc, vital) => {
      if (!acc[vital.name] || vital.timestamp > acc[vital.name].timestamp) {
        acc[vital.name] = vital;
      }

      return acc;
    },
    {} as Record<string, WebVitalMetric>,
  );

  const coreVitals = ["LCP", "INP", "CLS"];
  const otherVitals = ["TTFB", "FCP"];

  return (
    <div className={getPositionClasses()}>
      <div className="bg-white border border-gray-200 rounded-lg shadow-lg max-w-sm">
        {/* Header */}
        <div className="flex items-center justify-between p-3 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-gray-700">
              📊 Web Vitals
            </span>
            <span className="text-xs text-gray-500">
              {Object.keys(latestVitals).length} metrics
            </span>
          </div>
          <button
            className="text-gray-400 hover:text-gray-600 text-sm"
            onClick={() => setIsMinimized(!isMinimized)}
          >
            {isMinimized ? "📈" : "📉"}
          </button>
        </div>

        {/* Content */}
        {!isMinimized && (
          <div className="p-3 space-y-3">
            {/* Core Web Vitals */}
            <div>
              <h4 className="text-xs font-semibold text-gray-600 mb-2">
                Core Web Vitals
              </h4>
              <div className="space-y-2">
                {coreVitals.map((metricName) => {
                  const vital = latestVitals[metricName];

                  if (!vital) return null;

                  return (
                    <div
                      key={metricName}
                      className={`p-2 rounded text-xs ${getRatingColor(vital.rating)}`}
                      title={`${getMetricDescription(metricName)}\n${getThresholds(metricName)}`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium">
                          {getRatingEmoji(vital.rating)} {metricName}
                        </span>
                        <span className="font-mono">
                          {formatValue(metricName, vital.value)}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Other Metrics */}
            {Object.keys(latestVitals).some((name) =>
              otherVitals.includes(name),
            ) && (
              <div>
                <h4 className="text-xs font-semibold text-gray-600 mb-2">
                  Other Metrics
                </h4>
                <div className="space-y-1">
                  {otherVitals.map((metricName) => {
                    const vital = latestVitals[metricName];

                    if (!vital) return null;

                    return (
                      <div
                        key={metricName}
                        className="flex items-center justify-between text-xs text-gray-600"
                        title={`${getMetricDescription(metricName)}\n${getThresholds(metricName)}`}
                      >
                        <span>
                          {getRatingEmoji(vital.rating)} {metricName}
                        </span>
                        <span className="font-mono">
                          {formatValue(metricName, vital.value)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-2 pt-2 border-t border-gray-100">
              <button
                className="text-xs text-gray-500 hover:text-gray-700"
                onClick={() => {
                  localStorage.removeItem("web-vitals");
                  setVitals([]);
                }}
              >
                Clear
              </button>
              <button
                className="text-xs text-gray-500 hover:text-gray-700"
                onClick={() => {
                  const data = localStorage.getItem("web-vitals");

                  if (data) {
                    console.table(JSON.parse(data));
                  }
                }}
              >
                Log Data
              </button>
              <button
                className="text-xs text-gray-500 hover:text-gray-700"
                onClick={() =>
                  window.open("/api/analytics/web-vitals", "_blank")
                }
              >
                View API
              </button>
            </div>
          </div>
        )}

        {/* Minimized view */}
        {isMinimized && (
          <div className="p-2">
            <div className="flex gap-1">
              {coreVitals.map((metricName) => {
                const vital = latestVitals[metricName];

                if (!vital) return null;

                return (
                  <div
                    key={metricName}
                    className={`w-3 h-3 rounded-full ${
                      vital.rating === "good"
                        ? "bg-green-500"
                        : vital.rating === "needs-improvement"
                          ? "bg-yellow-500"
                          : "bg-red-500"
                    }`}
                    title={`${metricName}: ${formatValue(metricName, vital.value)} (${vital.rating})`}
                  />
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
