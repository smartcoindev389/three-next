/**
 * Strapi Image Shape Validation and Normalization
 * Handles various Strapi media response formats
 */

export interface StrapiImageFormat {
  url: string;
  width: number;
  height: number;
  size?: number;
  ext?: string;
  hash?: string;
  mime?: string;
}

export interface StrapiImage {
  url?: string;
  formats?: {
    large?: StrapiImageFormat;
    medium?: StrapiImageFormat;
    small?: StrapiImageFormat;
    thumbnail?: StrapiImageFormat;
  };
  width?: number;
  height?: number;
  alternativeText?: string | null;
  caption?: string | null;
  name?: string;
}

/**
 * Safely extract URL from various Strapi image response formats
 * Handles: direct url, nested data.attributes.url, formats.large.url, etc.
 */
export function getStrapiImageUrl(image: any): string | null {
  if (!image) return null;

  // Direct URL string
  if (typeof image === 'string') return image;

  // Direct url property
  if (image.url && typeof image.url === 'string') {
    return image.url;
  }

  // Nested in data.attributes (Strapi v4 format)
  if (image.data?.attributes?.url) {
    return image.data.attributes.url;
  }

  // Try formats (prefer larger sizes)
  if (image.formats) {
    if (image.formats.large?.url) return image.formats.large.url;
    if (image.formats.medium?.url) return image.formats.medium.url;
    if (image.formats.small?.url) return image.formats.small.url;
    if (image.formats.thumbnail?.url) return image.formats.thumbnail.url;
  }

  return null;
}

/**
 * Get image dimensions, falling back to defaults if not available
 */
export function getStrapiImageDimensions(image: any): { width: number; height: number } {
  const defaults = { width: 1200, height: 800 };

  if (!image) return defaults;

  // Direct properties
  if (image.width && image.height) {
    return { width: image.width, height: image.height };
  }

  // Nested in data.attributes
  if (image.data?.attributes) {
    const attrs = image.data.attributes;
    if (attrs.width && attrs.height) {
      return { width: attrs.width, height: attrs.height };
    }
  }

  // From formats.large
  if (image.formats?.large) {
    const large = image.formats.large;
    if (large.width && large.height) {
      return { width: large.width, height: large.height };
    }
  }

  return defaults;
}

/**
 * Get alternative text for accessibility
 */
export function getStrapiImageAlt(image: any, fallback: string = 'Image'): string {
  if (!image) return fallback;

  // Direct alternativeText
  if (image.alternativeText) return image.alternativeText;

  // Nested
  if (image.data?.attributes?.alternativeText) {
    return image.data.attributes.alternativeText;
  }

  // Caption as fallback
  if (image.caption) return image.caption;
  if (image.data?.attributes?.caption) {
    return image.data.attributes.caption;
  }

  // Name as last resort
  if (image.name) return image.name;
  if (image.data?.attributes?.name) {
    return image.data.attributes.name;
  }

  return fallback;
}

/**
 * Normalize Strapi image object to a consistent format
 */
export function normalizeStrapiImage(image: any, fallbackAlt?: string) {
  return {
    url: getStrapiImageUrl(image),
    ...getStrapiImageDimensions(image),
    alternativeText: getStrapiImageAlt(image, fallbackAlt),
  };
}

