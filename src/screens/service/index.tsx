/* eslint-disable @typescript-eslint/no-explicit-any */
export * from "./01-single";
import { Single } from "./01-single";
import { Screens } from "screens";
import { dataServices } from "@/data/dataLists";
import { redirect } from "next/navigation";

type CharProps = {
  params: Promise<{ slug: string }>;
};

export async function Service({ service, nextServiceSlug }: { service: any, nextServiceSlug: string }) {
  if (!service) {
    return redirect("/services");
  }

  return (
    <main className="page">
      <Screens.Home.Hero hero={{ title: service?.name || "Service" }} />
      <Single service={service} nextServiceSlug={nextServiceSlug} />
    </main>
  );
}
