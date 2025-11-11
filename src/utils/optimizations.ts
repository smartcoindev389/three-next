// Performance optimization utilities for Core Web Vitals

/**
 * Preload critical resources to improve LCP
 */
export function preloadCriticalResources() {
  if (typeof window === "undefined") return;

  // Preload critical images
  const criticalImages = ["/grooming.png"];

  criticalImages.forEach((src) => {
    const link = document.createElement("link");

    link.rel = "preload";
    link.as = "image";
    link.href = src;
    document.head.appendChild(link);
  });

  // Preload critical fonts
  const criticalFonts: string[] = [
    // Add your critical font URLs here
  ];

  criticalFonts.forEach((href) => {
    const link = document.createElement("link");

    link.rel = "preload";
    link.as = "font";
    link.type = "font/woff2";
    link.crossOrigin = "anonymous";
    link.href = href;
    document.head.appendChild(link);
  });
}

/**
 * Optimize images for better LCP
 */
export function optimizeImages() {
  if (typeof window === "undefined") return;

  // Add loading="lazy" to images below the fold
  const images = document.querySelectorAll("img:not([loading])");
  const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target as HTMLImageElement;

        if (!img.loading) {
          img.loading = "lazy";
        }
        imageObserver.unobserve(img);
      }
    });
  });

  images.forEach((img) => {
    // Skip images that are likely above the fold
    const rect = img.getBoundingClientRect();

    if (rect.top > window.innerHeight) {
      imageObserver.observe(img);
    }
  });
}

/**
 * Reduce layout shifts (improve CLS)
 */
export function reduceLayoutShifts() {
  if (typeof window === "undefined") return;

  // Add aspect ratio containers for images without dimensions
  const images = document.querySelectorAll("img:not([width]):not([height])");

  images.forEach((img) => {
    const container = img.parentElement;

    if (container && !container.style.aspectRatio) {
      // Set a default aspect ratio to prevent layout shifts
      container.style.aspectRatio = "16/9";
      container.style.overflow = "hidden";
    }
  });

  // Reserve space for dynamic content
  const dynamicContainers = document.querySelectorAll("[data-dynamic-content]");

  dynamicContainers.forEach((container) => {
    if (!container.getAttribute("style")?.includes("min-height")) {
      (container as HTMLElement).style.minHeight = "200px"; // Default minimum height
    }
  });
}

/**
 * Optimize third-party scripts
 */
export function optimizeThirdPartyScripts() {
  if (typeof window === "undefined") return;

  // Defer non-critical scripts
  const scripts = document.querySelectorAll(
    "script[src]:not([async]):not([defer])",
  );

  scripts.forEach((script) => {
    const src = script.getAttribute("src");

    if (src && !isCriticalScript(src)) {
      script.setAttribute("defer", "");
    }
  });
}

function isCriticalScript(src: string): boolean {
  const criticalPatterns = [
    "gtag",
    "analytics",
    "facebook",
    // Add other critical script patterns
  ];

  return criticalPatterns.some((pattern) => src.includes(pattern));
}

/**
 * Implement resource hints for better performance
 */
export function addResourceHints() {
  if (typeof window === "undefined") return;

  const hints = [
    { rel: "dns-prefetch", href: "https://www.google-analytics.com" },
    { rel: "dns-prefetch", href: "https://www.googletagmanager.com" },
    { rel: "dns-prefetch", href: "https://connect.facebook.net" },
    { rel: "preconnect", href: "https://fonts.googleapis.com" },
    {
      rel: "preconnect",
      href: "https://fonts.gstatic.com",
      crossOrigin: "anonymous",
    },
  ];

  hints.forEach((hint) => {
    const existing = document.querySelector(
      `link[rel="${hint.rel}"][href="${hint.href}"]`,
    );

    if (!existing) {
      const link = document.createElement("link");

      link.rel = hint.rel;
      link.href = hint.href;
      if (hint.crossOrigin) {
        link.crossOrigin = hint.crossOrigin;
      }
      document.head.appendChild(link);
    }
  });
}

/**
 * Optimize web fonts loading
 */
export function optimizeWebFonts() {
  if (typeof window === "undefined") return;

  // Use font-display: swap for better FCP
  const style = document.createElement("style");

  style.textContent = `
    @font-face {
      font-display: swap;
    }
  `;
  document.head.appendChild(style);
}

/**
 * Monitor and fix common performance issues
 */
export function monitorPerformanceIssues() {
  if (typeof window === "undefined") return;

  // Monitor for large images
  const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target as HTMLImageElement;

        if (img.naturalWidth > 1920 || img.naturalHeight > 1080) {
          console.warn(
            `Large image detected: ${img.src} (${img.naturalWidth}x${img.naturalHeight})`,
          );
        }
      }
    });
  });

  document.querySelectorAll("img").forEach((img) => {
    imageObserver.observe(img);
  });

  // Monitor for render-blocking resources
  const observer = new PerformanceObserver((list) => {
    list.getEntries().forEach((entry) => {
      if (entry.entryType === "resource") {
        const resourceEntry = entry as PerformanceResourceTiming;

        // Check for potentially render-blocking resources based on timing
        if (resourceEntry.responseEnd - resourceEntry.requestStart > 1000) {
          console.warn(
            `Slow resource detected: ${resourceEntry.name} (${Math.round(resourceEntry.responseEnd - resourceEntry.requestStart)}ms)`,
          );
        }
      }
    });
  });

  if ("PerformanceObserver" in window) {
    observer.observe({ entryTypes: ["resource"] });
  }
}

/**
 * Initialize all performance optimizations
 */
export function initPerformanceOptimizations() {
  if (typeof window === "undefined") return;

  // Run optimizations when DOM is ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", runOptimizations);
  } else {
    runOptimizations();
  }
}

function runOptimizations() {
  preloadCriticalResources();
  addResourceHints();
  optimizeWebFonts();
  optimizeThirdPartyScripts();

  // Run after a short delay to avoid blocking initial render
  setTimeout(() => {
    optimizeImages();
    reduceLayoutShifts();
    monitorPerformanceIssues();
  }, 100);
}
