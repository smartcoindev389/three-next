import { TermsOfService } from "@/screens/terms-of-service";
import { strapi } from "@/lib/strapi/strapi";

export const metadata = {
  title: "Terms of Service | Platformz",
  description: "Read Platformz terms of service.",
};

export default async function Page() {
  let data: any = null;
  try {
    data = await strapi.getPagePolicy();
  } catch (e) {
    // non-fatal; render empty content
  }

  return <TermsOfService data={data?.data} />;
}


