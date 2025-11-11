import { Projects } from "@/screens/projects";
import { getMetaData } from "app/(main)/layout";
import { strapi } from "@/lib/strapi/strapi";

export const metadata = getMetaData({
  name: "Projects",
  description: "Projects page platformz",
});

export default async function Page() {
  let projects: any = null;
  let pageData: any = null;
  try {
    projects = await strapi.getProjects();
    pageData = await strapi.getPageProjects();

  }  catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.warn("Failed to fetch about page data from Strapi:", errorMessage);
  }

  return (
    <main className="page">
      <Projects projects={projects?.data} pageData={pageData?.data} />
    </main>
  );
}
