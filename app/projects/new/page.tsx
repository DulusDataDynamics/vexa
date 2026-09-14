"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const suggestions = [
  "Build a modern landing page",
  "Build a SaaS dashboard",
  "Build a customer portal",
  "Build an e-commerce website",
  "Fix a bug in my application",
];

function createProjectName(prompt: string) {
  const clean = prompt
    .replace(/^(build|create|make|develop)\s+/i, "")
    .trim();

  if (!clean) return "New VEXA Project";

  const name = clean
    .split(/[.!?]/)[0]
    .trim()
    .slice(0, 45);

  return name || "New VEXA Project";
}

export default function NewProject() {
  const router = useRouter();

  const [prompt, setPrompt] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState("");

  async function startProject() {
    const cleanPrompt = prompt.trim();

    if (!cleanPrompt || isCreating) return;

    setIsCreating(true);
    setError("");

    try {
      const projectName = createProjectName(cleanPrompt);

      const response = await fetch("/api/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: projectName,
          description: cleanPrompt,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create project");
      }

      localStorage.setItem(
        "vexa_build_request",
        JSON.stringify({
          prompt: cleanPrompt,
          projectId: data.project.id,
          createdAt: new Date().toISOString(),
        })
      );

      router.push(`/projects/${data.project.id}`);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong"
      );
      setIsCreating(false);
    }
  }

  function useSuggestion(suggestion: string) {
    setPrompt(suggestion);
  }

  return (
    <main className="min-h-screen bg-[#08090d] text-white">
      <div className="mx-auto flex min-h-screen w-full max-w-4xl flex-col px-5 py-8 sm:px-8">
        <button
          onClick={() => router.push("/projects")}
          className="w-fit text-sm text-white/40 transition hover:text-white"
        >
          ← Projects
        </button>

        <div className="flex flex-1 flex-col justify-center pb-20 pt-16">
          <div className="mx-auto w-full max-w-3xl">
            <div className="mb-10 text-center">
              <div className="mb-4 inline-flex items-center rounded-full border border-purple-500/20 bg-purple-500/[0.08] px-3 py-1 text-[10px] font-medium uppercase tracking-[0.18em] text-purple-300">
                VEXA
              </div>

              <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
                What do you want to build?
              </h1>

              <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-white/40 sm:text-base">
                Describe an application, feature, or problem.
                VEXA will use your request as the starting point for the
                engineering workspace.
              </p>
            </div>

            <div className="rounded-2xl border border-white/[0.08] bg-[#0d1016] p-3 shadow-2xl shadow-black/20">
              <textarea
                value={prompt}
                onChange={(event) => setPrompt(event.target.value)}
                onKeyDown={(event) => {
                  if (
                    event.key === "Enter" &&
                    !event.shiftKey
                  ) {
                    event.preventDefault();
                    startProject();
                  }
                }}
                autoFocus
                rows={7}
                placeholder="Describe what you want VEXA to build..."
                className="w-full resize-none bg-transparent px-4 py-4 text-base leading-7 text-white outline-none placeholder:text-white/20"
              />

              {error && (
                <div className="mx-3 mb-3 rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                  {error}
                </div>
              )}

              <div className="flex flex-col gap-3 border-t border-white/[0.07] px-3 pt-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-xs text-white/25">
                  Press Enter to start · Shift + Enter for a new line
                </p>

                <button
                  onClick={startProject}
                  disabled={!prompt.trim() || isCreating}
                  className="rounded-lg bg-white px-5 py-2.5 text-sm font-medium text-black transition hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-30"
                >
                  {isCreating ? "Starting VEXA..." : "Start with VEXA →"}
                </button>
              </div>
            </div>

            <div className="mt-8">
              <p className="mb-3 text-center text-[10px] font-medium uppercase tracking-[0.18em] text-white/20">
                Try one of these
              </p>

              <div className="flex flex-wrap justify-center gap-2">
                {suggestions.map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => useSuggestion(suggestion)}
                    className="rounded-full border border-white/[0.07] bg-white/[0.025] px-4 py-2 text-xs text-white/40 transition hover:border-white/[0.14] hover:bg-white/[0.05] hover:text-white/70"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}