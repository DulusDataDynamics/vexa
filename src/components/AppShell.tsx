import Link from "next/link";
import type { PublicUser } from "@/src/lib/auth";
import { SignOutButton } from "@/src/components/SignOutButton";

type AppShellProps = {
  user?: PublicUser | null;
  children: React.ReactNode;
  title?: string;
};

export function AppShell({ user, children, title }: AppShellProps) {
  const initial = (user?.name || user?.email || "V").charAt(0).toUpperCase();

  return (
    <div className="min-h-screen bg-[#07080b] text-white">
      <div className="flex min-h-screen">
        <aside className="hidden w-60 shrink-0 border-r border-white/[0.06] bg-[#090a0e] md:flex md:flex-col">
          <div className="flex h-16 items-center border-b border-white/[0.06] px-5">
            <Link href="/" className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-white text-sm font-bold text-black">
                V
              </span>
              <span className="text-lg font-semibold tracking-tight">VEXA</span>
            </Link>
          </div>

          <nav className="flex-1 space-y-1 px-3 py-5 text-sm">
            <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/25">
              Workspace
            </p>
            <Link
              href="/"
              className="block rounded-lg px-3 py-2 text-white/60 transition hover:bg-white/[0.04] hover:text-white"
            >
              Overview
            </Link>
            <Link
              href="/projects"
              className="block rounded-lg px-3 py-2 text-white/60 transition hover:bg-white/[0.04] hover:text-white"
            >
              Projects
            </Link>
            <Link
              href="/projects/new"
              className="block rounded-lg px-3 py-2 text-white/60 transition hover:bg-white/[0.04] hover:text-white"
            >
              New project
            </Link>
          </nav>

          <div className="border-t border-white/[0.06] p-4">
            {user ? (
              <div className="flex items-center gap-3 px-1">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/[0.08] text-xs font-medium">
                  {initial}
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-white/80">
                    {user.name || user.username || user.email}
                  </p>
                  <p className="truncate text-xs text-white/30">{user.email}</p>
                </div>
              </div>
            ) : null}
          </div>
        </aside>

        <main className="min-w-0 flex-1">
          <header className="flex h-16 items-center justify-between border-b border-white/[0.06] px-5 md:px-8">
            <p className="text-sm text-white/45">{title ?? "Workspace"}</p>
            {user ? (
              <SignOutButton />
            ) : null}
          </header>
          <div className="px-5 py-8 md:px-8">{children}</div>
        </main>
      </div>
    </div>
  );
}
