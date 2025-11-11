import { strapi } from "@/lib/strapi/strapi";
import { OurProgress } from "@/screens/our-progress";
import { getMetaData } from "app/(main)/layout";

export const metadata = getMetaData({
  name: "Our progress",
  description: "Our progress page platformz",
});

export default async function Page() {
  let pageData: any = null;
  try {
    pageData = await strapi.getPageOurProgress();

  }  catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.warn("Failed to fetch about page data from Strapi:", errorMessage);
  }
  return (
    <main className="page">
      <OurProgress pageData={pageData?.data} />
    </main>
  );
}
