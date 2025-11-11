import { Services } from "@/screens/services";
import { getMetaData } from "app/(main)/layout";
import { strapi } from "@/lib/strapi/strapi";

export const metadata = getMetaData({
  name: "Services",
  description: "Services page platformz",
});

export default async function Page() {
  let services: any = null;
  let pageData: any = null;
  try {
    services = await strapi.getServices();
    pageData = await strapi.getPageServices();

  }  catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.warn("Failed to fetch about page data from Strapi:", errorMessage);
  }
  return (
    <main className="page">
      <Services services={services?.data} pageData={pageData?.data} />
    </main>
  );
}
