import { Home } from "@/screens/home";
import { strapi } from "@/lib/strapi/strapi";
import { EmptyState } from "@/shared/components/(common)/EmptyState";

export default async function HomePage() {
  let homePage: any = null;

  try {
    homePage = await strapi.getHomePage();
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.warn("Failed to fetch home page data from Strapi:", errorMessage);
    homePage = {
      data: {

      },
    };
    // Continue with null data - the component should handle this gracefully
  }
  if (!homePage?.data || !homePage) {
    return (
      <EmptyState
        title="Content Unavailable"
        description="We're currently unable to load the homepage content. This might be a temporary issue with our content management system. Please try refreshing the page in a few moments."
        icon="🌐"
      />
    );
  }

  return <Home homePage={homePage?.data} />;
}
