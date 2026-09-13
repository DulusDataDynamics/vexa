"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const projects = [
  { name: "Vexa", type: "Next.js", status: "Active" },
  { name: "Client Portal", type: "React", status: "Active" },
  { name: "API Service", type: "Node.js", status: "Archived" },
];

const recentActivity = [
  {
    title: "Project workspace created",
    time: "Just now",
    icon: "✦",
  },
  {
    title: "VEXA initialized",
    time: "2 minutes ago",
    icon: "⚡",
  },
  {
    title: "Database connected",
    time: "5 minutes ago",
    icon: "●",
  },
];

export default function Home() {
  const router = useRouter();

  const [activeNav, setActiveNav] = useState("Overview");
  const [prompt, setPrompt] = useState("");

  function startBuilding() {
    const trimmedPrompt = prompt.trim();

    if (!trimmedPrompt) return;

    localStorage.setItem("vexa_build_prompt", trimmedPrompt);

    router.push("/build");
  }

  const mainNavigation = [
    {
      label: "Overview",
      icon: "▦",
    },
    {
      label: "Projects",
      icon: "◇",
    },
    {
      label: "Activity",
      icon: "◷",
    },
  ];

  const secondaryNavigation = [
    {
      label: "AI Agents",
      icon: "✦",
    },
    {
      label: "Deployments",
      icon: "↗",
    },
    {
      label: "Settings",
      icon: "⚙",
    },
  ];

  return (
    <div className="min-h-screen bg-[#07080b] text-white">
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <aside className="hidden w-64 shrink-0 border-r border-white/[0.06] bg-[#090a0e] md:flex md:flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center border-b border-white/[0.06] px-6">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-white text-sm font-bold text-black">
                V
              </div>

              <span className="text-lg font-semibold tracking-tight">
                VEXA
              </span>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex-1 px-3 py-5">
            <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/25">
              Workspace
            </p>

            <nav className="space-y-1">
              {mainNavigation.map((item) => (
                <button
                  key={item.label}
                  onClick={() => setActiveNav(item.label)}
                  className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition ${
                    activeNav === item.label
                      ? "bg-white/[0.08] text-white"
                      : "text-white/50 hover:bg-white/[0.04] hover:text-white"
                  }`}
                >
                  <span className="w-5 text-center text-sm">
                    {item.icon}
                  </span>

                  <span>{item.label}</span>
                </button>
              ))}
            </nav>

            <p className="mb-2 mt-8 px-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/25">
              Platform
            </p>

            <nav className="space-y-1">
              {secondaryNavigation.map((item) => (
                <button
                  key={item.label}
                  onClick={() => setActiveNav(item.label)}
                  className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition ${
                    activeNav === item.label
                      ? "bg-white/[0.08] text-white"
                      : "text-white/50 hover:bg-white/[0.04] hover:text-white"
                  }`}
                >
                  <span className="w-5 text-center text-sm">
                    {item.icon}
                  </span>

                  <span>{item.label}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* User */}
          <div className="border-t border-white/[0.06] p-4">
            <div className="flex items-center gap-3 rounded-lg px-2 py-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/[0.08] text-xs font-medium">
                K
              </div>

              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-white/80">
                  Keshav
                </p>

                <p className="truncate text-xs text-white/30">
                  Developer
                </p>
              </div>
            </div>
          </div>
        </aside>

        {/* Main */}
        <main className="min-w-0 flex-1">
          {/* Top bar */}
          <header className="flex h-16 items-center justify-between border-b border-white/[0.06] px-5 md:px-8">
            <div>
              <p className="text-sm text-white/40">{activeNav}</p>
            </div>

            <button
              onClick={() => {
                setPrompt("");
                window.scrollTo({
                  top: document.body.scrollHeight,
                  behavior: "smooth",
                });
              }}
              className="rounded-lg border border-white/[0.08] bg-white/[0.03] px-4 py-2 text-sm font-medium text-white/80 transition hover:bg-white/[0.07] hover:text-white"
            >
              + New Project
            </button>
          </header>

          {/* Content */}
          <div className="mx-auto max-w-7xl px-5 py-8 md:px-8">
            {/* Hero */}
            <section className="mb-8">
              <div className="mb-3 flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />

                <span className="text-xs font-medium text-emerald-400/80">
                  VEXA ONLINE
                </span>
              </div>

              <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
                Build something great.
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-white/40">
                Describe what you want to build and let VEXA plan, code,
                test, debug, and help you ship it.
              </p>
            </section>

            {/* Stats */}
            <section className="mb-8 grid gap-3 sm:grid-cols-3">
              <div className="rounded-xl border border-white/[0.07] bg-white/[0.025] p-5">
                <p className="text-xs text-white/35">Projects</p>

                <p className="mt-2 text-2xl font-semibold">3</p>

                <p className="mt-1 text-xs text-white/25">
                  2 active
                </p>
              </div>

              <div className="rounded-xl border border-white/[0.07] bg-white/[0.025] p-5">
                <p className="text-xs text-white/35">AI Runs</p>

                <p className="mt-2 text-2xl font-semibold">0</p>

                <p className="mt-1 text-xs text-white/25">
                  Ready to build
                </p>
              </div>

              <div className="rounded-xl border border-white/[0.07] bg-white/[0.025] p-5">
                <p className="text-xs text-white/35">Deployments</p>

                <p className="mt-2 text-2xl font-semibold">0</p>

                <p className="mt-1 text-xs text-white/25">
                  Nothing deployed yet
                </p>
              </div>
            </section>

            {/* Projects + Activity */}
            <section className="grid gap-5 lg:grid-cols-[1.35fr_1fr]">
              {/* Projects */}
              <div className="rounded-xl border border-white/[0.07] bg-white/[0.025]">
                <div className="flex items-center justify-between border-b border-white/[0.06] px-5 py-4">
                  <div>
                    <h2 className="text-sm font-medium">
                      Projects
                    </h2>

                    <p className="mt-1 text-xs text-white/30">
                      Your development workspaces
                    </p>
                  </div>

                  <button className="text-xs text-white/40 transition hover:text-white">
                    View all
                  </button>
                </div>

                <div className="divide-y divide-white/[0.05]">
                  {projects.map((project) => (
                    <div
                      key={project.name}
                      className="flex items-center justify-between px-5 py-4 transition hover:bg-white/[0.02]"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/[0.07] bg-white/[0.03] text-xs font-semibold">
                          {project.name.charAt(0)}
                        </div>

                        <div>
                          <p className="text-sm font-medium text-white/85">
                            {project.name}
                          </p>

                          <p className="mt-1 text-xs text-white/30">
                            {project.type}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${
                            project.status === "Active"
                              ? "bg-emerald-400"
                              : "bg-white/20"
                          }`}
                        />

                        <span className="text-xs text-white/35">
                          {project.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Activity */}
              <div className="rounded-xl border border-white/[0.07] bg-white/[0.025]">
                <div className="border-b border-white/[0.06] px-5 py-4">
                  <h2 className="text-sm font-medium">
                    Recent activity
                  </h2>

                  <p className="mt-1 text-xs text-white/30">
                    Latest workspace events
                  </p>
                </div>

                <div className="divide-y divide-white/[0.05]">
                  {recentActivity.map((activity) => (
                    <div
                      key={activity.title}
                      className="flex items-center gap-3 px-5 py-4"
                    >
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/[0.07] bg-white/[0.03] text-xs text-white/50">
                        {activity.icon}
                      </div>

                      <div className="min-w-0">
                        <p className="truncate text-sm text-white/70">
                          {activity.title}
                        </p>

                        <p className="mt-1 text-xs text-white/25">
                          {activity.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Ask VEXA */}
            <section className="mt-5 rounded-xl border border-white/[0.08] bg-gradient-to-br from-white/[0.045] to-white/[0.02] p-5 md:p-6">
              <div className="mb-5">
                <div className="mb-3 flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-white text-xs font-bold text-black">
                    V
                  </div>

                  <span className="text-sm font-medium">
                    Ask VEXA
                  </span>
                </div>

                <h2 className="text-xl font-semibold tracking-tight">
                  What do you want to build?
                </h2>

                <p className="mt-1 text-sm text-white/35">
                  Describe your idea in plain language. VEXA will turn
                  it into a development plan.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <input
                  type="text"
                  value={prompt}
                  onChange={(event) => setPrompt(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      startBuilding();
                    }
                  }}
                  placeholder="e.g. Build me a customer dashboard with authentication..."
                  className="h-11 min-w-0 flex-1 rounded-lg border border-white/[0.08] bg-[#08090d] px-4 text-sm text-white outline-none placeholder:text-white/20 focus:border-white/20"
                />

                <button
                  onClick={startBuilding}
                  disabled={!prompt.trim()}
                  className="h-11 rounded-lg bg-white px-5 text-sm font-medium text-black transition hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-30"
                >
                  Start building
                </button>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {[
                  "Build a SaaS dashboard",
                  "Create an authentication system",
                  "Build an API",
                ].map((example) => (
                  <button
                    key={example}
                    onClick={() => setPrompt(example)}
                    className="rounded-full border border-white/[0.07] bg-white/[0.02] px-3 py-1.5 text-xs text-white/35 transition hover:border-white/[0.12] hover:bg-white/[0.04] hover:text-white/60"
                  >
                    {example}
                  </button>
                ))}
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}