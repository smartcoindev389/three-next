"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
export * from "./01-single";
import { Single } from "./01-single";
import { Screens } from "screens";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function Project({ project, nextProjectSlug }: { project: any, nextProjectSlug: string }) {
  const router = useRouter();

  useEffect(() => {
    if (!project) {
      router.replace("/projects");
    }
  }, [project, router]);

  // Don't render anything if project is null/undefined
  if (!project) {
    return null;
  }

  return (
    <main className="page">
      <Screens.Home.Hero hero={{ title: project?.title || project?.name || "Project"}} />
      <Single project={project} nextProjectSlug={nextProjectSlug} />
    </main>
  );
}
