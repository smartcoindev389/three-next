/* eslint-disable @typescript-eslint/no-explicit-any */
import { Project } from "@/screens/project";
import type { Metadata } from "next";
import { strapi } from "@/lib/strapi/strapi";
import { 
  normalizeStrapiProject, 
  normalizeStrapiProjects
} from "@/lib/strapi/normalizers";
import { notFound } from "next/navigation";

type CharProps = {
  params: Promise<{ slug: string }>;
};

const DEFAULT_METADATA = {
  title: "Platformz 🤖",
  description: "Innovative technology solutions",
  icons: {
    icon: {
      url: "/favicon.ico",
      href: "/favicon.ico",
    },
  },
};

export async function generateStaticParams() {
  try {
    const response: any = await strapi.getProjects();
    const projects = normalizeStrapiProjects(response);
    
    return projects.map((project: any) => ({
      slug: project.slug,
    }));
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error("Failed to generate static params for projects:", errorMessage);
    return [];
  }
}

export async function generateMetadata(props: CharProps): Promise<Metadata> {
  try {
    const { slug } = await props.params;
    const response: any = await strapi.getProjectBySlug(slug);
    
    if (!response?.data?.[0]) {
      console.warn(`Project not found for slug: ${slug}`);
      return {
        ...DEFAULT_METADATA,
        title: "Project Not Found | Platformz 🤖",
        description: "The requested project could not be found.",
      };
    }
    
    const project = normalizeStrapiProject(response?.data?.[0]);
    
    if (!project) {
      return DEFAULT_METADATA;
    }
    
    return {
      title: `Platformz 🤖 | ${project.title}`,
      description: `Platformz 🤖 | ${project.short_bio}`,
      icons: DEFAULT_METADATA.icons,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error("Error generating metadata for project:", errorMessage);
    return DEFAULT_METADATA;
  }
}

export default async function Page(props: CharProps) {
  const { slug } = await props.params;
  
  try {
    // Fetch current project
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const projectResponse: any = await strapi.getProjectBySlug(slug);
    
    if (!projectResponse?.data?.[0]) {
      console.error(`Project not found for slug: ${slug}`);
      notFound();
    }
    
    const project = normalizeStrapiProject(projectResponse.data[0]);
    
    if (!project) {
      console.error(`Failed to normalize project for slug: ${slug}`);
      notFound();
    }
    
    // Fetch all projects to determine next project
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const allProjectsResponse: any = await strapi.getProjects();
    const allProjects = normalizeStrapiProjects(allProjectsResponse);
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const currentProjectIndex = allProjects.findIndex((p: any) => p.slug === slug);
    const nextProjectIndex = 
      currentProjectIndex >= 0 && currentProjectIndex < allProjects.length - 1
        ? currentProjectIndex + 1
        : 0; // Loop back to first project
    
    const nextProjectSlug = allProjects[nextProjectIndex]?.slug || "";
    
    return (
      <main className="page">
        <Project project={project} nextProjectSlug={nextProjectSlug} />
      </main>
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error("Error fetching project data from Strapi:", errorMessage, error);
    notFound();
  }
}
