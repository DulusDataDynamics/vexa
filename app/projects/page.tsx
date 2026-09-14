"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const initialProjects = [
  {
    id: "vexa",
    name: "VEXA",
    description: "AI software engineering platform",
    type: "Next.js",
    status: "Active",
    updated: "Just now",
  },
  {
    id: "client-portal",
    name: "Client Portal",
    description: "Customer-facing web application",
    type: "React",
    status: "Active",
    updated: "2 hours ago",
  },
  {
    id: "api-service",
    name: "API Service",
    description: "Backend API service",
    type: "Node.js",
    status: "Archived",
    updated: "3 days ago",
  },
];

export default function ProjectsPage() {
  const router = useRouter();
  const [projects, setProjects] = useState(initialProjects);
  const [search, setSearch] = useState("");

  const filteredProjects = projects.filter((project) =>
    `${project.name} ${project.description} ${project.type}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  function createProject() {
    router.push("/projects/new");
  }

  function openProject(id: string) {
    router.push(`/projects/${id}`);
  }

  function archiveProject(id: string) {
    setProjects((current) =>
      current.map((project) =>
        project.id === id
          ? { ...project, status: "Archived" }
          : project
      )
    );
  }

  return (
    <main className="min-h-screen bg-[#07080b] text-white">
      <div className="mx-auto max-w-7xl px-5 py-8 md:px-8">
        {/* Header */}
        <section className="mb-8">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <p className="mb-2 text-xs font-medium uppercase tracking-[0.18em] text-white/25">
                Workspace
              </p>

              <h1 className="text-3xl font-semibold tracking-tight">
                Projects
              </h1>

              <p className="mt-2 max-w-xl text-sm leading-6 text-white/35">
                Your development projects, workspaces, and AI engineering
                environments.
              </p>
            </div>

            <button
              onClick={createProject}
              className="rounded-lg bg-white px-4 py-2.5 text-sm font-medium text-black transition hover:bg-white/90"
            >
              + New Project
            </button>
          </div>
        </section>

        {/* Search + stats */}
        <section className="mb-6 grid gap-3 md:grid-cols-[1fr_auto_auto]">
          <div className="rounded-xl border border-white/[0.07] bg-white/[0.025]">
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search projects..."
              className="h-11 w-full bg-transparent px-4 text-sm text-white outline-none placeholder:text-white/20"
            />
          </div>

          <div className="rounded-xl border border-white/[0.07] bg-white/[0.025] px-5 py-3">
            <p className="text-[10px] uppercase tracking-wider text-white/25">
              Total
            </p>
            <p className="mt-1 text-sm font-medium">
              {projects.length}
            </p>
          </div>

          <div className="rounded-xl border border-white/[0.07] bg-white/[0.025] px-5 py-3">
            <p className="text-[10px] uppercase tracking-wider text-white/25">
              Active
            </p>
            <p className="mt-1 text-sm font-medium">
              {projects.filter((project) => project.status === "Active").length}
            </p>
          </div>
        </section>

        {/* Project grid */}
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filteredProjects.map((project) => (
            <article
              key={project.id}
              className="group rounded-xl border border-white/[0.07] bg-white/[0.025] p-5 transition hover:border-white/[0.12] hover:bg-white/[0.035]"
            >
              <div className="flex items-start justify-between">
                <button
                  onClick={() => openProject(project.id)}
                  className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.04] text-sm font-semibold"
                >
                  {project.name.charAt(0)}
                </button>

                <span className="flex items-center gap-2 text-xs text-white/30">
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${
                      project.status === "Active"
                        ? "bg-emerald-400"
                        : "bg-white/20"
                    }`}
                  />
                  {project.status}
                </span>
              </div>

              <button
                onClick={() => openProject(project.id)}
                className="mt-5 block w-full text-left"
              >
                <h2 className="text-base font-medium text-white/90">
                  {project.name}
                </h2>

                <p className="mt-2 min-h-10 text-sm leading-5 text-white/35">
                  {project.description}
                </p>
              </button>

              <div className="mt-5 flex items-center justify-between border-t border-white/[0.06] pt-4">
                <div>
                  <p className="text-xs text-white/45">
                    {project.type}
                  </p>
                  <p className="mt-1 text-[11px] text-white/20">
                    Updated {project.updated}
                  </p>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => openProject(project.id)}
                    className="rounded-md border border-white/[0.08] px-3 py-1.5 text-xs text-white/50 transition hover:bg-white/[0.05] hover:text-white"
                  >
                    Open
                  </button>

                  {project.status === "Active" && (
                    <button
                      onClick={() => archiveProject(project.id)}
                      className="rounded-md px-3 py-1.5 text-xs text-white/25 transition hover:bg-white/[0.04] hover:text-white/50"
                    >
                      Archive
                    </button>
                  )}
                </div>
              </div>
            </article>
          ))}
        </section>

        {/* Empty state */}
        {filteredProjects.length === 0 && (
          <section className="rounded-xl border border-dashed border-white/[0.08] px-6 py-16 text-center">
            <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.03] text-sm">
              V
            </div>

            <h2 className="mt-4 text-sm font-medium">
              No projects found
            </h2>

            <p className="mt-2 text-xs text-white/30">
              Try another search or create a new project.
            </p>

            <button
              onClick={createProject}
              className="mt-5 rounded-lg bg-white px-4 py-2 text-xs font-medium text-black"
            >
              Create project
            </button>
          </section>
        )}
      </div>
    </main>
  );
}
