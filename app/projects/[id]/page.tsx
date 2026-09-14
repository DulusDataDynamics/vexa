"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

type Agent = {
  name: string;
  status: string;
  description: string;
};

const agents: Agent[] = [
  {
    name: "Planner",
    status: "Ready",
    description: "Understand the request and create an implementation plan",
  },
  {
    name: "Coder",
    status: "Ready",
    description: "Write and modify application code",
  },
  {
    name: "Debugger",
    status: "Ready",
    description: "Find, diagnose and fix errors",
  },
  {
    name: "Reviewer",
    status: "Ready",
    description: "Review code quality and proposed changes",
  },
];

const files = [
  { name: "app/page.tsx", type: "TSX" },
  { name: "app/layout.tsx", type: "TSX" },
  { name: "app/globals.css", type: "CSS" },
  { name: "components/Button.tsx", type: "TSX" },
  { name: "lib/utils.ts", type: "TS" },
  { name: "package.json", type: "JSON" },
];

const codePreview = `export default function Home() {
  return (
    <main>
      <h1>Welcome to VEXA</h1>
      <p>Your project workspace is ready.</p>
    </main>
  );
}`;

export default function ProjectPage() {
  const router = useRouter();
  const params = useParams();

  const projectId =
    typeof params.id === "string" ? params.id : "unknown";

  const [projectName, setProjectName] = useState("VEXA");
  const [projectDescription, setProjectDescription] = useState(
    "AI software engineering project"
  );

  const [prompt, setPrompt] = useState("");
  const [activeAgent, setActiveAgent] = useState("Planner");
  const [selectedFile, setSelectedFile] = useState("app/page.tsx");
  const [isRunning, setIsRunning] = useState(false);

  const [activity, setActivity] = useState([
    {
      title: "Workspace created",
      detail: "Project workspace is ready",
      time: "Just now",
    },
    {
      title: "Database connected",
      detail: "PostgreSQL ready",
      time: "Ready",
    },
  ]);

  useEffect(() => {
    const storedProject = localStorage.getItem("vexa_new_project");

    if (!storedProject) return;

    try {
      const project = JSON.parse(storedProject);

      if (project.name) {
        setProjectName(project.name);
      }

      if (project.description) {
        setProjectDescription(project.description);
      }
    } catch {
      // Ignore invalid local project data.
    }
  }, []);

  function addActivity(title: string, detail: string) {
    setActivity((current) => [
      {
        title,
        detail,
        time: "Just now",
      },
      ...current,
    ]);
  }

  function runVexa() {
    const cleanPrompt = prompt.trim();

    if (!cleanPrompt || isRunning) return;

    const request = {
      prompt: cleanPrompt,
      agent: activeAgent,
      projectId,
      createdAt: new Date().toISOString(),
    };

    localStorage.setItem(
      "vexa_build_request",
      JSON.stringify(request)
    );

    setIsRunning(true);

    addActivity(
      `${activeAgent} started`,
      cleanPrompt
    );

    router.push("/build");
  }

  return (
    <main className="min-h-screen bg-[#08090d] text-white">
      <div className="flex min-h-screen">

        {/* Project sidebar */}
        <aside className="w-72 border-r border-white/10 bg-[#0b0d12] p-5">

          <div className="mb-8">
            <button
              onClick={() => router.push("/projects")}
              className="text-xl font-bold tracking-tight"
            >
              VEXA<span className="text-purple-500">.</span>
            </button>

            <div className="mt-1 text-xs text-white/40">
              AI Engineering Agent
            </div>
          </div>

          <div className="mb-3 text-[11px] font-semibold uppercase tracking-widest text-white/30">
            Project
          </div>

          <div className="rounded-xl border border-purple-500/20 bg-purple-500/10 p-4">

            <div className="font-semibold">
              {projectName}
            </div>

            <div className="mt-1 text-xs text-white/40">
              Next.js Project
            </div>

            <div className="mt-3 flex items-center gap-2 text-xs text-green-400">
              <span className="h-2 w-2 rounded-full bg-green-400" />
              Active
            </div>
          </div>

          <div className="mb-3 mt-8 text-[11px] font-semibold uppercase tracking-widest text-white/30">
            Agents
          </div>

          <div className="space-y-2">
            {agents.map((agent) => (
              <button
                key={agent.name}
                onClick={() => setActiveAgent(agent.name)}
                className={`w-full rounded-lg border p-3 text-left transition ${
                  activeAgent === agent.name
                    ? "border-purple-500/30 bg-purple-500/10"
                    : "border-transparent bg-white/[0.02] hover:bg-white/[0.05]"
                }`}
              >
                <div className="flex items-center justify-between">

                  <span className="text-sm font-medium">
                    {agent.name}
                  </span>

                  <span className="text-[10px] text-green-400">
                    {agent.status}
                  </span>

                </div>

                <div className="mt-1 text-xs leading-5 text-white/35">
                  {agent.description}
                </div>

              </button>
            ))}
          </div>

          <div className="mt-8 border-t border-white/10 pt-5">

            <div className="text-xs text-white/30">
              Project ID
            </div>

            <div className="mt-1 break-all font-mono text-xs text-white/50">
              {projectId}
            </div>

          </div>
        </aside>

        {/* Main workspace */}
        <section className="flex min-w-0 flex-1 flex-col">

          {/* Header */}
          <header className="flex h-16 items-center justify-between border-b border-white/10 bg-[#0b0d12] px-7">

            <div className="min-w-0">
              <div className="truncate text-sm font-semibold">
                {projectName}
              </div>

              <div className="truncate text-xs text-white/35">
                {projectDescription || "Project Workspace"}
              </div>
            </div>

            <div className="flex items-center gap-3">

              <button
                onClick={() => router.push("/projects")}
                className="rounded-lg border border-white/10 px-4 py-2 text-xs text-white/60 transition hover:bg-white/5 hover:text-white"
              >
                Projects
              </button>

              <button
                className="rounded-lg bg-purple-600 px-4 py-2 text-xs font-medium transition hover:bg-purple-500"
              >
                Deploy
              </button>

            </div>
          </header>

          <div className="flex min-h-0 flex-1">

            {/* File explorer */}
            <aside className="w-60 border-r border-white/10 bg-[#090b10] p-4">

              <div className="mb-4 flex items-center justify-between">

                <div className="text-[11px] font-semibold uppercase tracking-widest text-white/30">
                  Files
                </div>

                <span className="text-[10px] text-white/20">
                  {files.length}
                </span>

              </div>

              <div className="space-y-1">

                {files.map((file) => (
                  <button
                    key={file.name}
                    onClick={() => setSelectedFile(file.name)}
                    className={`flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-xs transition ${
                      selectedFile === file.name
                        ? "bg-white/[0.08] text-white"
                        : "text-white/50 hover:bg-white/[0.04] hover:text-white"
                    }`}
                  >

                    <span className="truncate">
                      {file.name}
                    </span>

                    <span className="ml-2 text-[9px] text-white/25">
                      {file.type}
                    </span>

                  </button>
                ))}

              </div>

            </aside>

            {/* Editor */}
            <div className="flex min-w-0 flex-1 flex-col">

              <div className="flex h-12 items-center justify-between border-b border-white/10 bg-[#0b0d12] px-5">

                <div className="font-mono text-xs text-white/60">
                  {selectedFile}
                </div>

                <div className="flex items-center gap-2">

                  <span className="h-2 w-2 rounded-full bg-green-400" />

                  <span className="text-xs text-white/35">
                    Workspace ready
                  </span>

                </div>

              </div>

              <div className="flex-1 overflow-auto bg-[#07080c] p-6">

                <div className="mb-5 flex items-center justify-between">

                  <div>
                    <div className="text-xs text-white/25">
                      Code preview
                    </div>

                    <div className="mt-1 text-sm text-white/50">
                      {selectedFile}
                    </div>
                  </div>

                  <span className="rounded-md border border-white/[0.07] px-2 py-1 text-[10px] text-white/25">
                    READ ONLY
                  </span>

                </div>

                <pre className="overflow-x-auto font-mono text-sm leading-7 text-white/55">
                  {codePreview}
                </pre>

              </div>

              {/* Ask VEXA */}
              <div className="border-t border-white/10 bg-[#0b0d12] p-5">

                <div className="mb-3 flex items-center justify-between">

                  <div>
                    <div className="text-sm font-semibold">
                      Ask VEXA
                    </div>

                    <div className="mt-1 text-xs text-white/35">
                      {activeAgent} agent selected
                    </div>
                  </div>

                  <div className="text-[10px] uppercase tracking-widest text-purple-400">
                    AI Ready
                  </div>

                </div>

                <div className="flex gap-3">

                  <textarea
                    value={prompt}
                    onChange={(event) =>
                      setPrompt(event.target.value)
                    }
                    placeholder={`Tell VEXA what you want the ${activeAgent.toLowerCase()} agent to do...`}
                    className="min-h-[90px] flex-1 resize-none rounded-xl border border-white/10 bg-black/20 p-4 text-sm text-white outline-none placeholder:text-white/20 focus:border-purple-500/40"
                  />

                  <button
                    onClick={runVexa}
                    disabled={isRunning || !prompt.trim()}
                    className="self-end rounded-xl bg-purple-600 px-6 py-3 text-sm font-semibold transition hover:bg-purple-500 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    {isRunning ? "Starting..." : "Run VEXA"}
                  </button>

                </div>

              </div>

            </div>

            {/* Activity */}
            <aside className="hidden w-72 border-l border-white/10 bg-[#090b10] p-5 xl:block">

              <div className="mb-5 flex items-center justify-between">

                <div className="text-[11px] font-semibold uppercase tracking-widest text-white/30">
                  Activity
                </div>

                <span className="text-[10px] text-white/20">
                  {activity.length}
                </span>

              </div>

              <div className="space-y-5">

                {activity.map((item, index) => (
                  <div key={`${item.title}-${index}`}>

                    <div className="text-sm text-white/70">
                      {item.title}
                    </div>

                    <div className="mt-1 text-xs leading-5 text-white/25">
                      {item.detail}
                    </div>

                    <div className="mt-1 text-[10px] text-white/15">
                      {item.time}
                    </div>

                  </div>
                ))}

              </div>

              <div className="mt-10 rounded-xl border border-purple-500/20 bg-purple-500/[0.06] p-4">

                <div className="text-sm font-semibold">
                  VEXA Intelligence
                </div>

                <p className="mt-2 text-xs leading-5 text-white/35">
                  VEXA will understand your project,
                  plan implementation, modify files,
                  review changes, test code and help
                  prepare deployments.
                </p>

              </div>

            </aside>

          </div>
        </section>
      </div>
    </main>
  );
}
