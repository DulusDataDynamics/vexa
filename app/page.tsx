import Link from "next/link";
import { AppShell } from "@/src/components/AppShell";
import { getCurrentUser } from "@/src/lib/auth";
import { listProjectsForUser } from "@/src/lib/projects";
import { isDatabaseConfigured } from "@/src/prisma/db";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const databaseReady = isDatabaseConfigured();
  const user = databaseReady ? await getCurrentUser() : null;
  const projects = user ? await listProjectsForUser(user.id).catch(() => []) : [];
  const activeCount = projects.filter((project) => project.status === "ACTIVE").length;

  if (!user) {
    return (
      <main className="min-h-screen bg-[#07080b] text-white">
        <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-sm font-bold text-black">
              V
            </span>
            <span className="text-lg font-semibold">VEXA</span>
          </div>
          <div className="flex gap-3 text-sm">
            <Link href="/login" className="px-3 py-2 text-white/60 hover:text-white">
              Sign in
            </Link>
            <Link
              href="/signup"
              className="rounded-lg bg-white px-4 py-2 font-medium text-black"
            >
              Create account
            </Link>
          </div>
        </header>

        <section className="mx-auto max-w-3xl px-6 py-24 text-center">
          <p className="mb-4 text-xs font-medium uppercase tracking-[0.2em] text-white/35">
            AI engineering platform
          </p>
          <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">
            A workspace for building software with VEXA.
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-white/45">
            Create projects, record engineering requests, inspect files, and keep
            agent runs in a contract the coding engine can attach to later.
          </p>
          <div className="mt-8 flex justify-center gap-3">
            <Link
              href="/signup"
              className="rounded-lg bg-white px-5 py-2.5 text-sm font-medium text-black"
            >
              Get started
            </Link>
            <Link
              href="/login"
              className="rounded-lg border border-white/10 px-5 py-2.5 text-sm text-white/70"
            >
              Sign in
            </Link>
          </div>
          {!databaseReady ? (
            <p className="mt-10 text-xs text-amber-300/80">
              Configure DATABASE_URL and AUTH_SECRET in .env before creating
              accounts.
            </p>
          ) : null}
        </section>
      </main>
    );
  }

  return (
    <AppShell user={user} title="Overview">
      <section className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tight">
          Welcome back{user.name ? `, ${user.name}` : ""}.
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-white/40">
          Open a project workspace or describe something new. VEXA records
          requests against PLANNER, CODER, DEBUGGER, REVIEWER, and DEPLOYER
          runs. The coding engine is not connected in this release.
        </p>
      </section>

      <section className="mb-8 grid gap-3 sm:grid-cols-3">
        <div className="rounded-xl border border-white/[0.07] bg-white/[0.025] p-5">
          <p className="text-xs text-white/35">Projects</p>
          <p className="mt-2 text-2xl font-semibold">{projects.length}</p>
          <p className="mt-1 text-xs text-white/25">{activeCount} active</p>
        </div>
        <div className="rounded-xl border border-white/[0.07] bg-white/[0.025] p-5">
          <p className="text-xs text-white/35">Engine</p>
          <p className="mt-2 text-2xl font-semibold">Record</p>
          <p className="mt-1 text-xs text-white/25">Requests persist as AgentRuns</p>
        </div>
        <div className="rounded-xl border border-white/[0.07] bg-white/[0.025] p-5">
          <p className="text-xs text-white/35">Next</p>
          <p className="mt-2 text-2xl font-semibold">Build</p>
          <p className="mt-1 text-xs text-white/25">Attach LLM tools later</p>
        </div>
      </section>

      <section className="rounded-xl border border-white/[0.07] bg-white/[0.025]">
        <div className="flex items-center justify-between border-b border-white/[0.06] px-5 py-4">
          <h2 className="text-sm font-medium">Projects</h2>
          <Link href="/projects" className="text-xs text-white/40 hover:text-white">
            View all
          </Link>
        </div>
        {projects.length === 0 ? (
          <div className="px-5 py-10 text-sm text-white/40">
            No projects yet.{" "}
            <Link href="/projects/new" className="text-white hover:underline">
              Create one
            </Link>
            .
          </div>
        ) : (
          <div className="divide-y divide-white/[0.05]">
            {projects.slice(0, 6).map((project) => (
              <Link
                key={project.id}
                href={`/projects/${project.id}`}
                className="flex items-center justify-between px-5 py-4 hover:bg-white/[0.02]"
              >
                <div>
                  <p className="text-sm font-medium text-white/85">{project.name}</p>
                  <p className="mt-1 text-xs text-white/30">
                    {project.description || "No description"}
                  </p>
                </div>
                <span className="text-xs text-white/35">{project.status}</span>
              </Link>
            ))}
          </div>
        )}
      </section>
    </AppShell>
  );
}
