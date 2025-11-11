import clsx from "clsx";
import type { Metadata } from "next";
import { RootLayout } from "layouts/RootLayout";
import "swiper/css";
import "styles/index.scss";
import "@/styles/global.css";
import { fonts } from "../fonts";
import { ScrollRestoration } from "../ScrollRestoration";
import axios from "axios";
import "@/i18n/i18n";
import { strapi } from "@/lib/strapi/strapi";

export const getMetaData = ({
  name,
  description,
}: {
  name?: string;
  description: string;
}): Metadata => {
  return {
    title: name ? `Platformz 🤖 | ${name}` : "Platformz 🤖",
    description: description,
    icons: {
      icon: {
        url: "/logo192.png",
        href: "/logo192.png",
      },
    },
  };
};

// Set default headers to disable cache
axios.defaults.headers.get['Cache-Control'] = 'no-cache, no-store, must-revalidate';
axios.defaults.headers.get['Pragma'] = 'no-cache';
axios.defaults.headers.get['Expires'] = '0';
axios.defaults.adapter = 'fetch';
axios.defaults.fetchOptions = { cache: "force-cache" }

// Function to fetch SEO data from Strapi
async function fetchSeoData(slug: string) {
  const res = await fetch(`https://strapi.platformz.us/api/${slug}?populate=seo.metaImage&populate=seo.metaSocial.image`, { cache: 'no-cache' });
  const data = await res.json();

  return data?.data?.seo || {};
}

// Generate Metadata
export async function generateMetadata() {
  const seoData = await fetchSeoData('seo-meta'); // Pass the page slug here

  return {
    title: seoData.metaTitle || 'Default Title',
    description: seoData.metaDescription || 'Default Description',
    openGraph: {
      title: seoData.metaSocial[0].title || 'Default OG Title',
      description: seoData.metaSocial[0].description || 'Default OG Description',
      images: [
        {
          url: process.env.NEXT_PUBLIC_STRAPI_URL + seoData.metaSocial[0]?.image?.url || 'https://platformz.us/preview.png',
          alt: seoData.metaImage?.alt || 'OG Image Alt',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: seoData.metaSocial[1].title || 'Default Twitter Title',
      description: seoData.metaSocial[1].description || 'Default Twitter Description',
      images: [process.env.NEXT_PUBLIC_STRAPI_URL + seoData.metaSocial[1]?.image?.url || 'https://platformz.us/preview.png'],
    },
    keywords: seoData.keywords || ['default', 'keywords'],
    robots: {
      index: seoData.metaRobots !== 'noindex',
      follow: seoData.metaRobots !== 'nofollow',
    },
    alternates: {
      canonical: seoData.canonicalURL || 'https://platformz.us'
    },
    generator: 'Next.js',
    applicationName: 'Platformz',
    referrer: 'origin-when-cross-origin',
    authors: [{ name: 'Platformz', url: 'https://platformz.us' }],
    creator: 'Timothy Roberts',
    publisher: 'Yacine Gasmi',
  };
}

// Move viewport to its own export
export function generateViewport() {
  return 'width=device-width, initial-scale=1';
}

export default async function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  // Fetch header data server-side
  let headerData = null;
  try {
    const response: any = await strapi.getPageHeader();
    headerData = response?.data || null;
  } catch (error) {
    console.error("Failed to fetch header data:", error);
    // Will fall back to default data in Header component
  }

  // Fetch footer data server-side
  let footerData = null;
  try {
    const response: any = await strapi.getPageFooter();
    footerData = response?.data || null;
  } catch (error) {
    console.error("Failed to fetch footer data:", error);
    // Will fall back to default data in Footer component
  }

  return (
    <html lang="en" suppressHydrationWarning={true}>
      <head>
        <meta charSet="utf-8" />
        <link rel="icon" href="https://platformz.us/logo192.png" />
        <meta httpEquiv="Permissions-Policy" content="accelerometer=(), gyroscope=()" />
        <script src="https://code.tidio.co/4bzp9qizuxlrwvx3svpvxoweunduxnw2.js" async></script>
      </head>
      <body
        className={clsx(
          fonts.map((font) => font.variable),
          "overflow",
        )}
      >
        <ScrollRestoration />
        <RootLayout headerData={headerData} footerData={footerData}>{children}</RootLayout>
      </body>
    </html>
  );
}
