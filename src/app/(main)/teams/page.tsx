import { strapi } from "@/lib/strapi/strapi";
import { Teams } from "@/screens/teams";

export const metadata = {
  title: "Our Team | Platformz",
  description: "Meet the Platformz team.",
};

export default async function Page() {
  let ourTeams: any = null;
  try {
    ourTeams = await strapi.getOurTeams();
  } catch (e) {
    // ignore
  }

  return <main className="page">
    <Teams ourTeams={ourTeams?.data || []} />
  </main>;
}


