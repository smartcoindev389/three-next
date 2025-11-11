/* eslint-disable @typescript-eslint/no-explicit-any */
import { Service } from "@/screens/service";
import type { Metadata } from "next";
import { strapi } from "@/lib/strapi/strapi";
import { Screens } from "screens";
import { redirect } from "next/navigation";

type CharProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata(props: CharProps): Promise<Metadata> {
  try {
    const { slug } = await props.params;
    const services: any = await strapi.getServices();
    // Try to find by documentId, slug, or id
    const service = services?.data?.find((s: any) => 
      s.documentId === slug || 
      s.slug === slug || 
      s.id === Number(slug)
    );
    
    return {
      title: `Platformz 🤖 | ${service?.name || 'Service'}`,
      description: service?.description || `Platformz 🤖 | ${service?.name || 'Service'}`,
      icons: {
        icon: {
          url: "/favicon.ico",
          href: "/favicon.ico",
        },
      },
    };
  } catch {
    return {
      title: "Page not found",
      description: "Page not found",
      icons: {
        icon: {
          url: "/favicon.ico",
          href: "/favicon.ico",
        },
      },
    };
  }
}

export default async function Page(props: CharProps) {
  const { slug } = await props.params;
  let service: any = null;
  let nextServiceSlug: string = "";
  
  try {
    const services: any = await strapi.getServices();
    
    // Find service by documentId, slug, or id (for backward compatibility)
    const serviceIndex = services?.data?.findIndex((s: any) => 
      s.documentId === slug || 
      s.slug === slug || 
      s.id === Number(slug)
    );
    
    if (serviceIndex === -1 || !services?.data?.[serviceIndex]) {
      return redirect("/services");
    }
    
    service = services.data[serviceIndex];
    
    // Get next service (loop back to first if at the end)
    const nextServiceIndex = (serviceIndex + 1) % services.data.length;
    const nextService = services.data[nextServiceIndex];
    
    // Prefer documentId, fallback to slug, then id
    nextServiceSlug = nextService?.documentId || nextService?.slug || nextService?.id?.toString() || "";
    
  } catch (error) {
    console.error(error);
    return redirect("/services");
  }
  
  return (
    <main className="page">
      <Service service={service} nextServiceSlug={nextServiceSlug} />
    </main>
  );
}
