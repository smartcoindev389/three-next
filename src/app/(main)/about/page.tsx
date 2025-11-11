import { About } from "@/screens/about/index";
import { strapi } from "@/lib/strapi/strapi";

export default async function Page() {
  let aboutPage: any = null;
  let ourTeams: any = null;
  
  try {
    aboutPage = await strapi.getAboutPage();
    ourTeams = await strapi.getOurTeams();
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.warn("Failed to fetch about page data from Strapi:", errorMessage);
    // Continue with null data - the component should handle this gracefully
  }
  
  return <main className="page">
    <About aboutPage={aboutPage?.data} ourTeams={ourTeams?.data} />
  </main>
}
