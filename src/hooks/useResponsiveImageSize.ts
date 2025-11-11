import { useState, useEffect } from 'react';

/**
 * Responsive Image Size Configuration
 * Based on the About page's responsive system
 */
export const IMAGE_BREAKPOINTS = {
  desktop: 1920,      // Large desktop screens
  laptop: 1440,       // Laptop and small desktop
  tablet: 1024,       // Tablet landscape and portrait
  mobile: 768,        // Mobile devices
};

export const IMAGE_SIZES = {
  // Project cards in grid view
  projectCard: {
    desktop: { width: 1500, height: 800 },
    laptop: { width: 1200, height: 640 },
    tablet: { width: 900, height: 480 },
    mobile: { width: 600, height: 320 },
  },
  // Individual project hero images
  projectHero: {
    desktop: { width: 1920, height: 1080 },
    laptop: { width: 1440, height: 810 },
    tablet: { width: 1024, height: 576 },
    mobile: { width: 768, height: 432 },
  },
  // Second project hero image (visual2)
  projectHero2: {
    desktop: { width: 1920, height: 1080 },
    laptop: { width: 1440, height: 810 },
    tablet: { width: 1024, height: 576 },
    mobile: { width: 768, height: 432 },
  },
  // Project description image
  projectDescription: {
    desktop: { width: 1920, height: 1920 },
    laptop: { width: 1440, height: 1440 },
    tablet: { width: 1024, height: 1024 },
    mobile: { width: 768, height: 768 },
  },
  // Project banner image (visual4)
  projectBanner: {
    desktop: { width: 1920, height: 458 },
    laptop: { width: 1440, height: 344 },
    tablet: { width: 1024, height: 244 },
    mobile: { width: 768, height: 183 },
  },
  // Portfolio grid images
  portfolio: {
    desktop: { width: 1500, height: 800 },
    laptop: { width: 1200, height: 640 },
    tablet: { width: 900, height: 480 },
    mobile: { width: 600, height: 320 },
  },
  // Innovation cards
  innovationCard: {
    desktop: { width: 1500, height: 2000 },
    laptop: { width: 1200, height: 1600 },
    tablet: { width: 900, height: 1200 },
    mobile: { width: 600, height: 800 },
  },
};

type BreakpointType = 'desktop' | 'laptop' | 'tablet' | 'mobile';
type ImageType = keyof typeof IMAGE_SIZES;

/**
 * Hook to get responsive image dimensions based on current viewport
 * Similar to About page's responsive configuration
 */
export function useResponsiveImageSize(
  imageType: ImageType = 'projectCard',
  originalWidth?: number,
  originalHeight?: number
) {
  const [breakpoint, setBreakpoint] = useState<BreakpointType>('desktop');
  const [dimensions, setDimensions] = useState(IMAGE_SIZES[imageType].desktop);

  useEffect(() => {
    const updateBreakpoint = () => {
      const width = window.innerWidth;
      
      let newBreakpoint: BreakpointType;
      if (width >= IMAGE_BREAKPOINTS.desktop) {
        newBreakpoint = 'desktop';
      } else if (width >= IMAGE_BREAKPOINTS.laptop) {
        newBreakpoint = 'laptop';
      } else if (width >= IMAGE_BREAKPOINTS.tablet) {
        newBreakpoint = 'tablet';
      } else {
        newBreakpoint = 'mobile';
      }

      setBreakpoint(newBreakpoint);
      
      // If original dimensions provided, calculate proportional sizes
      if (originalWidth && originalHeight) {
        const targetWidth = IMAGE_SIZES[imageType][newBreakpoint].width;
        const aspectRatio = originalHeight / originalWidth;
        setDimensions({
          width: targetWidth,
          height: Math.round(targetWidth * aspectRatio),
        });
      } else {
        setDimensions(IMAGE_SIZES[imageType][newBreakpoint]);
      }
    };

    updateBreakpoint();
    window.addEventListener('resize', updateBreakpoint);
    
    return () => window.removeEventListener('resize', updateBreakpoint);
  }, [imageType, originalWidth, originalHeight]);

  return {
    width: dimensions.width,
    height: dimensions.height,
    breakpoint,
  };
}

/**
 * Get responsive image size without hook (for server-side or static usage)
 */
export function getResponsiveImageSize(
  imageType: ImageType,
  breakpoint: BreakpointType = 'desktop',
  originalWidth?: number,
  originalHeight?: number
) {
  if (originalWidth && originalHeight) {
    const targetWidth = IMAGE_SIZES[imageType][breakpoint].width;
    const aspectRatio = originalHeight / originalWidth;
    return {
      width: targetWidth,
      height: Math.round(targetWidth * aspectRatio),
    };
  }
  
  return IMAGE_SIZES[imageType][breakpoint];
}

