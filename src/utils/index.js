export const sortBlogs = (blogs) => {
  return blogs
    .slice()
    .sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
};

/**
 * Generates meta data object from SEO data input.
 * @example
 * generateMetaData({metaTitle: "Page Title", metaDescription: "Page Description"})
 * { title: "Page Title", description: "Page Description" }
 * @param {Object} seoData - SEO data containing meta tags and other properties.
 * @returns {Object} A meta data object formatted for SEO purposes.
 * @description
 *   - The function extracts and assigns SEO-related information to a comprehensive metaData object.
 *   - It processes specific social networks data for Facebook and Twitter to create OpenGraph and Twitter metadata.
 *   - Parses and interprets metaRobots value to populate 'index' and 'follow' directives.
 *   - Handles optional properties like structuredData and canonicalURL for richer SEO support.
 */
export const getMetadata = (seoData) => {
  const metaData = {};

  if (seoData.metaTitle) {
    metaData.title = seoData.metaTitle;
  }
  if (seoData.metaDescription) {
    metaData.description = seoData.metaDescription;
  }
  if (seoData.metaImage) {
    metaData.image = seoData.metaImage.url;
  }
  if (seoData.metaSocial) {
    const facebook = seoData.metaSocial.filter(
      (item) => item.socialNetwork === "Facebook",
    )[0];
    const twitter = seoData.metaSocial.filter(
      (item) => item.socialNetwork === "Twitter",
    )[0];

    if (facebook) {
      metaData.openGraph = {
        title: facebook.title,
        description: facebook.description,
        images: [facebook.image.url],
      };
    }
    if (twitter) {
      metaData.twitter = {
        card: "summary_large_image",
        title: twitter.title,
        description: twitter.description,
        images: [twitter.image.url],
      };
    }
  }
  if (seoData.keywords) {
    metaData.keywords = seoData.keywords;
  }
  if (seoData.metaRobots) {
    metaData.robots = {
      index: seoData.metaRobots !== "noindex",
      follow: seoData.metaRobots !== "nofollow",
    };
  }
  if (seoData.canonicalURL) {
    metaData.alternates = {
      canonical: seoData.canonicalURL,
    };
  }
  if (seoData.structuredData) {
    metaData.jsonLd = seoData.structuredData;
  }

  return metaData;
};
