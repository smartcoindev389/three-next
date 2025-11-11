import { PrivacyPolicy } from "@/screens/privacy-policy";
import { strapi } from "@/lib/strapi/strapi";

export const metadata = {
  title: "Privacy Policy | Platformz",
  description: "Read Platformz privacy policy.",
};

export default async function Page() {
  let data: any = null;
  try {
    data = await strapi.getPagePolicy();
  } catch (e) {
    // non-fatal; render empty content
  }

  return <PrivacyPolicy data={data?.data} />;
}


