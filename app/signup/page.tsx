"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Something went wrong");
        return;
      }

      router.push("/dashboard");
      router.refresh();
    } catch {
      setError("Unable to connect to VEXA.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#08090d] px-6 text-white">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold tracking-tight">VEXA</h1>
          <p className="mt-2 text-zinc-400">
            Build software with intelligence.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-white/10 bg-white/[0.03] p-7 shadow-2xl"
        >
          <h2 className="text-2xl font-semibold">Create your account</h2>
          <p className="mt-1 mb-6 text-sm text-zinc-400">
            Start building with VEXA.
          </p>

          <div className="space-y-4">
            <div>
              <label className="mb-2 block text-sm text-zinc-300">
                Name
              </label>

              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 outline-none transition focus:border-purple-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-zinc-300">
                Email
              </label>

              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 outline-none transition focus:border-purple-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-zinc-300">
                Password
              </label>

              <input
                type="password"
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 8 characters"
                className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 outline-none transition focus:border-purple-500"
              />
            </div>
          </div>

          {error && (
            <div className="mt-4 rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-6 w-full rounded-xl bg-purple-600 px-4 py-3 font-medium transition hover:bg-purple-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Creating account..." : "Create account"}
          </button>

          <p className="mt-5 text-center text-sm text-zinc-500">
            Already have an account?{" "}
            <a
              href="/login"
              className="text-purple-400 hover:text-purple-300"
            >
              Log in
            </a>
          </p>
        </form>
      </div>
    </main>
  );
}