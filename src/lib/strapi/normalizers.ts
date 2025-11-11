/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Normalize Strapi media field to ensure consistent shape
 * Handles both object shapes and plain URL strings
 */
export function normalizeStrapiMedia(media: any) {
  if (!media) return null;
  
  // If it's already a string URL, return minimal object
  if (typeof media === 'string') {
    return {
      url: media,
      alternativeText: null,
      width: null,
      height: null,
    };
  }
  
  // If it's an object, ensure all expected properties exist
  return {
    url: media.url || null,
    alternativeText: media.alternativeText || media.alt || null,
    width: media.width || null,
    height: media.height || null,
    formats: media.formats || null,
  };
}

/**
 * Normalize a single project from Strapi API response
 */
export function normalizeStrapiProject(project: any) {
  if (!project) return null;
  
  return {
    id: project.id,
    documentId: project.documentId,
    slug: project.slug,
    name: project.name || 'Untitled Project',
    title: project.title || project.name || 'Untitled Project',
    short_bio: project.short_bio || project.description || '',
    description: project.description || project.short_bio || '',
    left_description: project.left_description || '',
    right_description: project.right_description || '',
    visual: normalizeStrapiMedia(project.visual),
    visual2: normalizeStrapiMedia(project.visual2),
    description_visual: normalizeStrapiMedia(project.description_visual),
    visual4: normalizeStrapiMedia(project.visual4),
    createdAt: project.createdAt,
    updatedAt: project.updatedAt,
    publishedAt: project.publishedAt,
  };
}

/**
 * Normalize projects array from Strapi API response
 */
export function normalizeStrapiProjects(response: any) {
  if (!response?.data || !Array.isArray(response.data)) {
    return [];
  }
  
  return response.data
    .map((project: any) => normalizeStrapiProject(project))
    .filter((project: any): project is NonNullable<typeof project> => project !== null);
}

/**
 * Find a project by slug from normalized projects array
 */
export function findProjectBySlug(projects: any[], slug: string) {
  return projects.find((project: any) => project.slug === slug) || null;
}

