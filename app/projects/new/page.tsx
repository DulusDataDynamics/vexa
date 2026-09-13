"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewProject() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  function createProject() {
    if (!name.trim()) return;

    const project = {
      name: name.trim(),
      description: description.trim(),
      createdAt: new Date().toISOString(),
    };

    localStorage.setItem("vexa_new_project", JSON.stringify(project));
    router.push("/projects");
  }

  return (
    <main className="min-h-screen bg-[#08090d] text-white">
      <div className="mx-auto flex min-h-screen w-full max-w-3xl flex-col px-5 py-8 sm:px-8">
        <button
          onClick={() => router.back()}
          className="mb-12 w-fit text-sm text-white/40 transition hover:text-white"
        >
          ← Back
        </button>

        <div className="mb-10">
          <p className="mb-2 text-xs font-medium uppercase tracking-[0.16em] text-white/30">
            New workspace
          </p>

          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Start a new project.
          </h1>

          <p className="mt-3 max-w-xl text-sm leading-6 text-white/40">
            Give VEXA an idea. You can refine it with AI once the workspace is
            created.
          </p>
        </div>

        <div className="space-y-6 rounded-2xl border border-white/[0.08] bg-[#0d1016] p-6 sm:p-8">
          <div>
            <label className="mb-2 block text-xs font-medium text-white/60">
              Project name
            </label>

            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Customer Portal"
              className="h-12 w-full rounded-lg border border-white/[0.08] bg-[#08090d] px-4 text-sm text-white outline-none transition placeholder:text-white/20 focus:border-white/20"
            />
          </div>

          <div>
            <label className="mb-2 block text-xs font-medium text-white/60">
              What are you building?
            </label>

            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the application, feature or problem you want VEXA to work on..."
              rows={6}
              className="w-full resize-none rounded-lg border border-white/[0.08] bg-[#08090d] px-4 py-3 text-sm leading-6 text-white outline-none transition placeholder:text-white/20 focus:border-white/20"
            />
          </div>

          <div className="flex flex-col gap-3 border-t border-white/[0.07] pt-6 sm:flex-row sm:justify-end">
            <button
              onClick={() => router.back()}
              className="rounded-lg border border-white/10 bg-white/[0.03] px-5 py-3 text-sm text-white/60 transition hover:bg-white/[0.07] hover:text-white"
            >
              Cancel
            </button>

            <button
              onClick={createProject}
              disabled={!name.trim()}
              className="rounded-lg bg-white px-5 py-3 text-sm font-medium text-black transition hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-30"
            >
              Create project
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}