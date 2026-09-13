"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function BuildPage() {
  const router = useRouter();
  const [prompt, setPrompt] = useState("");
  const [isBuilding, setIsBuilding] = useState(false);

  function startBuild() {
    const trimmedPrompt = prompt.trim();

    if (!trimmedPrompt) return;

    setIsBuilding(true);

    const projectId =
      trimmedPrompt
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "")
        .slice(0, 40) || "new-project";

    const project = {
      id: projectId,
      name:
        trimmedPrompt.length > 42
          ? `${trimmedPrompt.slice(0, 42)}...`
          : trimmedPrompt,
      description: trimmedPrompt,
      createdAt: new Date().toISOString(),
      status: "ACTIVE",
    };

    localStorage.setItem("vexa_project", JSON.stringify(project));

    router.push(`/projects/${projectId}`);
  }

  return (
    <main className="min-h-screen bg-[#08090d] text-white">
      <div className="flex min-h-screen">
        <aside className="hidden w-64 shrink-0 border-r border-white/[0.07] bg-[#0b0d12] lg:flex lg:flex-col">
          <div className="flex h-16 items-center border-b border-white/[0.07] px-5">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-sm font-bold text-black">
                V
              </div>
              <span className="text-lg font-semibold tracking-tight">
                VEXA
              </span>
            </div>
          </div>

          <div className="flex-1 px-3 py-5">
            <p className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/30">
              Workspace
            </p>

            <div className="space-y-1">
              <div className="rounded-lg bg-white/[0.08] px-3 py-2.5 text-sm text-white">
                Build
              </div>

              <div className="px-3 py-2.5 text-sm text-white/40">
                Projects
              </div>

              <div className="px-3 py-2.5 text-sm text-white/40">
                Activity
              </div>
            </div>

            <p className="mb-3 mt-8 px-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/30">
              AI
            </p>

            <div className="space-y-1">
              <div className="px-3 py-2.5 text-sm text-white/40">
                Agents
              </div>

              <div className="px-3 py-2.5 text-sm text-white/40">
                Deployments
              </div>
            </div>
          </div>

          <div className="border-t border-white/[0.07] p-4">
            <div className="flex items-center gap-3 px-2 py-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-xs font-semibold">
                K
              </div>

              <div>
                <p className="text-sm font-medium">Developer</p>
                <p className="text-xs text-white/30">VEXA Workspace</p>
              </div>
            </div>
          </div>
        </aside>

        <section className="flex min-w-0 flex-1 flex-col">
          <header className="flex h-16 items-center justify-between border-b border-white/[0.07] bg-[#0b0d12]/80 px-5 backdrop-blur">
            <div>
              <p className="text-sm font-medium">New Build</p>

              <p className="text-xs text-white/30">
                Turn an idea into a working project
              </p>
            </div>

            <button className="rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-xs text-white/50">
              Save draft
            </button>
          </header>

          <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col px-5 py-10 sm:px-8">
            <div className="mx-auto w-full max-w-3xl text-center">
              <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-white text-lg text-black">
                ✦
              </div>

              <p className="mb-3 text-xs font-medium uppercase tracking-[0.18em] text-white/30">
                VEXA AI ENGINE
              </p>

              <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
                What are we building?
              </h1>

              <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-white/40">
                Describe your idea in plain English. VEXA will turn it into a
                development plan, architecture and code.
              </p>
            </div>

            <div className="mt-10 rounded-2xl border border-white/[0.09] bg-[#0d1016] p-2 shadow-2xl">
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Build me a SaaS dashboard where users can create projects, invite team members and track deployments..."
                className="min-h-44 w-full resize-none bg-transparent px-4 py-4 text-base leading-7 text-white outline-none placeholder:text-white/20"
              />

              <div className="flex flex-col gap-3 border-t border-white/[0.06] p-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex gap-2">
                  <span className="rounded-md border border-white/[0.07] bg-white/[0.03] px-2.5 py-1.5 text-[11px] text-white/40">
                    Planner
                  </span>

                  <span className="rounded-md border border-white/[0.07] bg-white/[0.03] px-2.5 py-1.5 text-[11px] text-white/40">
                    Coder
                  </span>
                </div>

                <button
                  onClick={startBuild}
                  disabled={!prompt.trim() || isBuilding}
                  className="rounded-lg bg-white px-5 py-2.5 text-sm font-medium text-black transition hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-30"
                >
                  {isBuilding ? "Creating project..." : "Start build →"}
                </button>
              </div>
            </div>

            <div className="mt-8">
              <p className="mb-3 text-xs text-white/30">
                Try an example
              </p>

              <div className="grid gap-3 sm:grid-cols-3">
                {[
                  "Build a customer management dashboard",
                  "Create a modern SaaS landing page",
                  "Build an API with authentication",
                ].map((example) => (
                  <button
                    key={example}
                    onClick={() => setPrompt(example)}
                    className="rounded-xl border border-white/[0.07] bg-[#0d1016] p-4 text-left text-xs leading-5 text-white/45 transition hover:border-white/[0.15] hover:bg-white/[0.04] hover:text-white"
                  >
                    {example}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-auto pt-12 text-center">
              <p className="text-[11px] text-white/20">
                VEXA can plan, code, review, debug and prepare deployments.
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}