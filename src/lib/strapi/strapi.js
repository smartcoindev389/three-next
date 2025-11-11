export class strapi {
  static getLocale() {
    if (typeof window !== "undefined") {
      const lang = localStorage.getItem("lang");

      return lang
        ? !lang.includes("en")
          ? lang.split("_").join("-")
          : "en"
        : "en";
    }

    return "en";
  }

  static getDefaultLanguage() {
    return "en";
  }

  static getStrapiLanguageCode() {
    const lang = this.getLocale();

    return lang.split("_").join("-");
  }

  static getTranslationStrapiUrl() {
    return this.getStrapiMediaUrl("api/i18next-translation?locale={{lng}}");
  }

  /**
   * Fetches data from a Strapi API endpoint, optionally using language settings.
   * @example
   * getStrapiData('/example-endpoint', true, false)
   * { data: {...} }
   * @param {string} uri - The API endpoint to fetch from.
   * @param {boolean} useLang - Determines whether to append a language code to the request.
   * @param {boolean} fallback - Indicates whether this is a retry request with a default language.
   * @returns {Promise<Object|null>} Returns a JSON object from the API response or null if an error occurs.
   * @description
   *   - Handles constructing the API URL with optional language query parameter.
   *   - Automatically retries once with a fallback language if the initial request fails.
   *   - Logs an error message to the console if both attempts fail.
   */
  static async getStrapiData(uri, useLang = false, fallback = false) {
    // @todo: uncomment when NEXT_INTERNAL_STRAPI_URL works
    // const isServer = typeof window === "undefined";
    // const strHost = isServer ? process.env.NEXT_INTERNAL_STRAPI_URL : process.env.NEXT_PUBLIC_STRAPI_URL;
    const strHost = process.env.NEXT_INTERNAL_STRAPI_URL || process.env.NEXT_PUBLIC_STRAPI_URL || 'https://strapi.platformz.us/';

    try {
      let finalUrl = strHost + uri;

      if (useLang) {
        const delimiter = uri.includes("?") ? "&" : "?";
        const locale = fallback
          ? this.getDefaultLanguage()
          : this.getStrapiLanguageCode();

        finalUrl += `${delimiter}locale=${locale}`;
      }

      const response = await fetch(finalUrl, { cache: "no-cache" });

      if (!response.ok)
        throw new Error(
          `STRAPI ERROR: ${response.status} ${response.statusText}`,
        );

      return response.json();
    } catch (error) {
      if (!fallback) {
        return this.getStrapiData(uri, useLang, true);
      }
      console.error("Error:", error);

      return null;
    }
  }

  static getStrapiMediaUrl(uri) {
    const strHost = process.env.NEXT_PUBLIC_STRAPI_URL || 'https://strapi.platformz.us/';

    if (uri?.startsWith("http")) {
      return uri;
    }

    return strHost + uri;
  }

  static getMetaData() {
    return this.getStrapiData("api/meta-data?pLevel=5", true);
  }

  static async getPageHeader() {
    return this.getStrapiData("api/page-header?pLevel=5", true);
  }

  static async getHomePage() {
    return this.getStrapiData("api/homepage?pLevel=5", false);
  }

  static async getAboutPage() {
    return this.getStrapiData("api/about-us?pLevel=5", false);
  }

  static async getOurTeams() {
    return this.getStrapiData("api/our-teams?pLevel=5", false);
  }

  static async getProjects() {
    return this.getStrapiData("api/porjects?pLevel=5", false);
  }

  static async getProjectBySlug(slug) {
    if (!slug && slug !== 0) {
      return null;
    }
    const normalizedSlug = encodeURIComponent(String(slug).trim());
    return this.getStrapiData(`api/porjects?filters[slug][$eq]=${normalizedSlug}&pLevel=5`, false);
  }

  static async getPageProjects() {
    return this.getStrapiData("api/page-project?pLevel=5", false);
  }

  static async getServices() {
    return this.getStrapiData("api/serivces?pLevel=5", false);
  }

  static async getPageServices() {
    return this.getStrapiData("api/service?pLevel=5", false);
  }

  static async getService(documentId) {
    return this.getStrapiData(
      `api/serivces?filters[documentId][$eq]=${documentId}&pLevel=5`,
      false
    );
  }

  static async getMedias() {
    return this.getStrapiData("api/medias?pLevel=5", false);
  }

  static async getPageWeAreInMedia() {
    return this.getStrapiData("api/page-media?pLevel=5", false);
  }

  static async getPageOurProgress() {
    return this.getStrapiData("api/page-process?pLevel=5", false);
  }

  static async getPageFooter() {
    return this.getStrapiData("api/page-footer?pLevel=5", false);
  }

  static async getPagePolicy() {
    return this.getStrapiData("api/page-policy?pLevel=5", false);
  }

  static async getRegisterPolicy() {
    return this.getStrapiData("api/customer-register?pLevel=5", false);
  }
}
