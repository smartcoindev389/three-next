"use client";

import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import Backend from "i18next-http-backend";

import { strapi } from "@/lib/strapi/strapi";

// Function to get the current language
const getCurrentLang = () => {
  if (typeof window === "undefined") return "en";
  const pLang = localStorage?.getItem("lang");

  if (!pLang) return "en";

  return pLang === "en_US" ? "en" : pLang.split("_").join("-");
};

// Only initialize if not already initialized
if (!i18n.isInitialized) {
  i18n
    .use(Backend)
    .use(initReactI18next)
    .init({
      debug: false,
      interpolation: {
        escapeValue: false,
      },
      ns: "common",
      lng: getCurrentLang(),
      load: "currentOnly",
      fallbackLng: "en",
      serializeConfig: false,
      missingKeyNoValueFallbackToKey: true,
      backend: {
        loadPath: strapi.getTranslationStrapiUrl(),
        jsonIndent: 4,
        parse: function (data) {
          return JSON.parse(data)?.data?.translations;
        },
      },
      react: {
        wait: false,
      },
    });
}

// Add event listener for storage changes
if (typeof window !== "undefined") {
  window.addEventListener("storage", (e) => {
    if (e.key === "lang") {
      i18n.changeLanguage(getCurrentLang());
    }
  });
}

export default i18n;
