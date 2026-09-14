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
  { name: "index.html", type: "HTML" },
  { name: "app/page.tsx", type: "TSX" },
  { name: "app/layout.tsx", type: "TSX" },
  { name: "app/globals.css", type: "CSS" },
  { name: "components/Button.tsx", type: "TSX" },
  { name: "lib/utils.ts", type: "TS" },
  { name: "package.json", type: "JSON" },
];

const initialCodePreview = `<!DOCTYPE html>
<html>
<head>
  <title>VEXA Preview</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-100 flex items-center justify-center min-h-screen font-sans">
  <div class="text-center">
    <h1 class="text-3xl font-bold text-gray-800">Welcome to VEXA</h1>
    <p class="mt-2 text-gray-600">Your project workspace is ready.</p>
  </div>
</body>
</html>`;

function generateMockCode(prompt: string) {
  return `<!DOCTYPE html>
<html>
<head>
  <title>Generated View</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-50 flex flex-col items-center justify-center min-h-screen p-4 font-sans text-gray-800">
  <div class="bg-white p-8 rounded-2xl shadow-xl w-full max-w-lg border border-gray-100">
    <div class="flex items-center gap-3 mb-6">
      <div class="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-bold text-xl">✦</div>
      <h1 class="text-2xl font-bold text-gray-900">Generated UI</h1>
    </div>
    <p class="text-gray-600 mb-8 leading-relaxed">Here is the mock result for your request: <strong class="text-gray-900 bg-gray-100 px-2 py-1 rounded">"${prompt}"</strong></p>
    
    <div class="space-y-4">
      <button class="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-4 rounded-xl transition shadow-lg shadow-purple-200">
        Primary Action
      </button>
      <button class="w-full bg-white hover:bg-gray-50 text-gray-700 font-medium py-3 px-4 rounded-xl border border-gray-200 transition">
        Secondary Action
      </button>
    </div>
  </div>
</body>
</html>`;
}

export default function ProjectPage() {
  const router = useRouter();
  const params = useParams();

  const projectId = typeof params.id === "string" ? params.id : "unknown";

  const [projectName, setProjectName] = useState("VEXA");
  const [projectDescription, setProjectDescription] = useState(
    "AI software engineering project"
  );

  const [prompt, setPrompt] = useState("");
  const [activeAgent, setActiveAgent] = useState("Planner");
  const [selectedFile, setSelectedFile] = useState("index.html");
  const [isRunning, setIsRunning] = useState(false);
  
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [viewMode, setViewMode] = useState<"code" | "preview">("preview");
  const [codePreview, setCodePreview] = useState(initialCodePreview);

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
      if (project.name) setProjectName(project.name);
      if (project.description) setProjectDescription(project.description);
    } catch {
      // Ignore invalid local project data.
    }
  }, []);

  function addActivity(title: string, detail: string) {
    setActivity((current) => [
      { title, detail, time: "Just now" },
      ...current,
    ]);
  }

  function runVexa() {
    const cleanPrompt = prompt.trim();
    if (!cleanPrompt || isRunning) return;

    setIsRunning(true);
    addActivity(`${activeAgent} started`, cleanPrompt);

    // Mock LLM generation
    setTimeout(() => {
      const generatedCode = generateMockCode(cleanPrompt);
      setCodePreview(generatedCode);
      setSelectedFile("index.html");
      setViewMode("preview");
      setIsRunning(false);
      setPrompt("");
      addActivity(`${activeAgent} finished`, "Generated new code based on request");
    }, 1500);
  }

  return (
    <main className="min-h-screen bg-[#08090d] text-white flex flex-col">
      {/* Global Header / Exit Bar */}
      <div className="h-12 border-b border-white/10 bg-[#090a0e] flex items-center px-4 shrink-0 justify-between">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => router.push("/")}
            className="flex items-center gap-2 text-xs font-medium text-white/50 hover:text-white transition bg-white/5 px-3 py-1.5 rounded-md"
          >
            ← Exit Workspace
          </button>
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="flex items-center gap-2 text-xs font-medium text-white/50 hover:text-white transition bg-white/5 px-3 py-1.5 rounded-md"
          >
            {isSidebarOpen ? "Collapse Sidebar" : "Expand Sidebar"}
          </button>
        </div>
        <div className="text-xs text-white/30 font-mono hidden sm:block">
          {projectId}
        </div>
      </div>

      <div className="flex flex-1 min-h-0">
        {/* Project sidebar */}
        {isSidebarOpen && (
          <aside className="w-64 md:w-72 border-r border-white/10 bg-[#0b0d12] p-5 overflow-y-auto shrink-0 flex flex-col h-full z-10 absolute md:relative shadow-2xl md:shadow-none">
            <div className="mb-8">
              <button
                onClick={() => router.push("/projects")}
                className="text-xl font-bold tracking-tight"
              >
                VEXA<span className="text-purple-500">.</span>
              </button>
              <div className="mt-1 text-xs text-white/40">AI Engineering Agent</div>
            </div>

            <div className="mb-3 text-[11px] font-semibold uppercase tracking-widest text-white/30">Project</div>
            <div className="rounded-xl border border-purple-500/20 bg-purple-500/10 p-4">
              <div className="font-semibold truncate">{projectName}</div>
              <div className="mt-1 text-xs text-white/40 truncate">{projectDescription}</div>
              <div className="mt-3 flex items-center gap-2 text-xs text-green-400">
                <span className="h-2 w-2 rounded-full bg-green-400" /> Active
              </div>
            </div>

            <div className="mb-3 mt-8 text-[11px] font-semibold uppercase tracking-widest text-white/30">Agents</div>
            <div className="space-y-2 flex-1">
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
                    <span className="text-sm font-medium">{agent.name}</span>
                    <span className="text-[10px] text-green-400">{agent.status}</span>
                  </div>
                  <div className="mt-1 text-xs leading-5 text-white/35">{agent.description}</div>
                </button>
              ))}
            </div>
            
            {/* Mobile close button inside sidebar */}
            <button 
              className="mt-6 md:hidden w-full py-2 bg-white/10 rounded-md text-xs font-medium text-white/70"
              onClick={() => setIsSidebarOpen(false)}
            >
              Close Sidebar
            </button>
          </aside>
        )}

        {/* Main workspace */}
        <section className="flex min-w-0 flex-1 flex-col relative h-full">
          {/* Header */}
          <header className="flex h-16 items-center justify-between border-b border-white/10 bg-[#0b0d12] px-4 md:px-7 shrink-0">
            <div className="min-w-0 flex items-center gap-3">
              {!isSidebarOpen && (
                <button
                  onClick={() => setIsSidebarOpen(true)}
                  className="md:hidden text-white/60 hover:text-white p-2"
                >
                  ☰
                </button>
              )}
              <div className="min-w-0">
                <div className="truncate text-sm font-semibold">{projectName}</div>
                <div className="truncate text-xs text-white/35">{projectDescription || "Project Workspace"}</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button className="rounded-lg bg-purple-600 px-4 py-2 text-xs font-medium transition hover:bg-purple-500">
                Deploy
              </button>
            </div>
          </header>

          <div className="flex min-h-0 flex-1 h-full">
            {/* File explorer */}
            <aside className="hidden lg:block w-60 border-r border-white/10 bg-[#090b10] p-4 shrink-0 overflow-y-auto">
              <div className="mb-4 flex items-center justify-between">
                <div className="text-[11px] font-semibold uppercase tracking-widest text-white/30">Files</div>
                <span className="text-[10px] text-white/20">{files.length}</span>
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
                    <span className="truncate">{file.name}</span>
                    <span className="ml-2 text-[9px] text-white/25">{file.type}</span>
                  </button>
                ))}
              </div>
            </aside>

            {/* Editor */}
            <div className="flex min-w-0 flex-1 flex-col h-full">
              <div className="flex h-12 items-center justify-between border-b border-white/10 bg-[#0b0d12] px-5 shrink-0">
                <div className="font-mono text-xs text-white/60">{selectedFile}</div>
                <div className="flex gap-4">
                  <button 
                    onClick={() => setViewMode("preview")} 
                    className={`text-xs font-medium transition-colors ${viewMode === "preview" ? "text-purple-400" : "text-white/40 hover:text-white"}`}
                  >
                    Preview
                  </button>
                  <button 
                    onClick={() => setViewMode("code")} 
                    className={`text-xs font-medium transition-colors ${viewMode === "code" ? "text-purple-400" : "text-white/40 hover:text-white"}`}
                  >
                    Code
                  </button>
                </div>
              </div>

              <div className="flex-1 min-h-0 overflow-auto bg-[#07080c] relative">
                {viewMode === "code" ? (
                  <div className="p-6 h-full">
                    <div className="mb-5 flex items-center justify-between">
                      <div>
                        <div className="text-xs text-white/25">Code viewer</div>
                      </div>
                      <span className="rounded-md border border-white/[0.07] px-2 py-1 text-[10px] text-white/25">READ ONLY</span>
                    </div>
                    <pre className="font-mono text-sm leading-7 text-white/55">
                      {selectedFile === "index.html" ? codePreview : "// Other file contents not available in demo."}
                    </pre>
                  </div>
                ) : (
                  <div className="w-full h-full bg-white flex flex-col relative">
                    <div className="h-8 bg-gray-200 border-b border-gray-300 flex items-center px-4 shrink-0 gap-2">
                      <div className="flex gap-1.5">
                        <div className="w-3 h-3 rounded-full bg-red-400"></div>
                        <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                        <div className="w-3 h-3 rounded-full bg-green-400"></div>
                      </div>
                      <div className="ml-4 bg-white/60 px-3 py-0.5 rounded text-[10px] text-gray-500 font-mono">
                        localhost:3000
                      </div>
                    </div>
                    {selectedFile === "index.html" ? (
                      <iframe srcDoc={codePreview} className="w-full flex-1 border-none bg-white" sandbox="allow-scripts" />
                    ) : (
                      <div className="flex-1 flex items-center justify-center text-gray-500 font-medium p-8 text-center bg-gray-50">
                        Select index.html to see the preview.
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Ask VEXA */}
              <div className="border-t border-white/10 bg-[#0b0d12] p-5 shrink-0 z-20">
                <div className="mb-3 flex items-center justify-between">
                  <div>
                    <div className="text-sm font-semibold">Ask VEXA</div>
                    <div className="mt-1 text-xs text-white/35">{activeAgent} agent selected</div>
                  </div>
                  <div className="text-[10px] uppercase tracking-widest text-purple-400 flex items-center gap-2">
                    {isRunning && (
                      <svg className="animate-spin h-3 w-3 text-purple-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    )}
                    {isRunning ? "Generating..." : "AI Ready"}
                  </div>
                </div>
                <div className="flex gap-3 flex-col sm:flex-row">
                  <textarea
                    value={prompt}
                    onChange={(event) => setPrompt(event.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        runVexa();
                      }
                    }}
                    placeholder={`Tell VEXA what you want the ${activeAgent.toLowerCase()} agent to do... (Press Enter to submit)`}
                    className="h-[60px] sm:h-[90px] flex-1 resize-none rounded-xl border border-white/10 bg-black/20 p-4 text-sm text-white outline-none placeholder:text-white/20 focus:border-purple-500/40"
                  />
                  <button
                    onClick={runVexa}
                    disabled={isRunning || !prompt.trim()}
                    className="self-stretch sm:self-end rounded-xl bg-purple-600 px-6 py-3 text-sm font-semibold transition hover:bg-purple-500 disabled:cursor-not-allowed disabled:opacity-40 whitespace-nowrap"
                  >
                    {isRunning ? "Running..." : "Run VEXA"}
                  </button>
                </div>
              </div>
            </div>

            {/* Activity */}
            <aside className="hidden xl:block w-72 border-l border-white/10 bg-[#090b10] p-5 shrink-0 overflow-y-auto">
              <div className="mb-5 flex items-center justify-between">
                <div className="text-[11px] font-semibold uppercase tracking-widest text-white/30">Activity</div>
                <span className="text-[10px] text-white/20">{activity.length}</span>
              </div>
              <div className="space-y-5">
                {activity.map((item, index) => (
                  <div key={`${item.title}-${index}`}>
                    <div className="text-sm text-white/70">{item.title}</div>
                    <div className="mt-1 text-xs leading-5 text-white/25">{item.detail}</div>
                    <div className="mt-1 text-[10px] text-white/15">{item.time}</div>
                  </div>
                ))}
              </div>
              <div className="mt-10 rounded-xl border border-purple-500/20 bg-purple-500/[0.06] p-4">
                <div className="text-sm font-semibold">VEXA Intelligence</div>
                <p className="mt-2 text-xs leading-5 text-white/35">
                  VEXA will understand your project, plan implementation, modify files, review changes, test code and help prepare deployments.
                </p>
              </div>
            </aside>
          </div>
        </section>
      </div>
    </main>
  );
}
