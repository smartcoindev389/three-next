import { strapi } from "@/lib/strapi/strapi";
import { WeAreInMedia } from "@/screens/we-are-in-media";
import { getMetaData } from "app/(main)/layout";

export const metadata = getMetaData({
  name: "We are in media",
  description: "We are in media page platformz",
});

export default async function Page() {
  let pageData: any = null;
  try {
    pageData = await strapi.getPageWeAreInMedia();

  }  catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.warn("Failed to fetch about page data from Strapi:", errorMessage);
  }
  return (
    <main className="page">
      <WeAreInMedia pageData={pageData?.data} />
    </main>
  );
}
