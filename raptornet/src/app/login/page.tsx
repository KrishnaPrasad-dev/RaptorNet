"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import RippleGrid from "@/components/RippleGrid";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as
          | { message?: string }
          | null;
        setError(payload?.message ?? "Login failed. Try again.");
        return;
      }

      router.push("/members");
      router.refresh();
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main
      className="relative min-h-screen overflow-hidden bg-[#05070b] text-white"
      style={{ backgroundColor: "#05070b", color: "#ededed" }}
    >
      <div className="absolute inset-0 z-0">
        <RippleGrid
          enableRainbow={false}
          gridColor="#ff3f3f"
          rippleIntensity={0.05}
          gridSize={10}
          gridThickness={15}
          mouseInteraction={true}
          mouseInteractionRadius={1.2}
          opacity={0.8}
        />
      </div>

      <section className="relative z-20 mx-auto grid min-h-screen w-full max-w-7xl items-center gap-10 px-4 py-12 sm:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
        <div className="max-w-2xl">
          <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-white/60">
            RaptorNet Member Access
          </p>
          <h1 className="mt-5 text-5xl font-black leading-[0.96] tracking-tight sm:text-6xl lg:text-7xl">
            Welcome back to
            <span className="block text-[#ff3f3f]">RaptorNet</span>
          </h1>
          <p className="mt-7 max-w-xl text-base leading-8 text-white/70 sm:text-lg">
            Built your way in? Sign in to continue with the guild. Access is
            reserved for approved applicants only.
          </p>
          <p className="mt-5 text-xl font-semibold text-white/78">
            Vetted access for serious builders.
          </p>
        </div>

        <div className="w-full max-w-xl justify-self-end overflow-hidden rounded-[2rem] border border-white/15 bg-[linear-gradient(145deg,rgba(12,16,24,0.56),rgba(8,10,16,0.62))] p-7 shadow-[0_24px_90px_rgba(0,0,0,0.45)] sm:p-9">
          <h2 className="text-center text-4xl font-black tracking-tight">Login</h2>
          <p className="mt-2 text-center text-base text-white/65">
            Use your approved email and password
          </p>

          <form className="mt-8 space-y-4" onSubmit={onSubmit}>
            <label className="block">
              <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.2em] text-white/65">
                Email
              </span>
              <input
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                type="email"
                autoComplete="email"
                required
                className="h-12 w-full rounded-xl border border-white/20 bg-black/35 px-4 text-sm text-white outline-none transition-colors duration-150 ease-out placeholder:text-white/35 focus:border-[#ff4a4a]"
                placeholder="you@example.com"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.2em] text-white/65">
                Password
              </span>
              <input
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                type="password"
                autoComplete="current-password"
                required
                className="h-12 w-full rounded-xl border border-white/20 bg-black/35 px-4 text-sm text-white outline-none transition-colors duration-150 ease-out placeholder:text-white/35 focus:border-[#ff4a4a]"
                placeholder="Enter your password"
              />
            </label>

            {error ? (
              <p className="rounded-lg border border-[#ff7890]/35 bg-[#7f1020]/20 px-3 py-2 text-sm text-[#ffd3dc]">
                {error}
              </p>
            ) : null}

            <button
              type="submit"
              disabled={isLoading}
              className="h-12 w-full rounded-xl border border-[#ff5a5a]/45 bg-[linear-gradient(130deg,#cc1b1b,#ff2727)] text-base font-semibold text-white transition-opacity duration-150 ease-out hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isLoading ? "Signing in..." : "Login"}
            </button>
          </form>

          <div className="mt-6 flex items-center justify-center gap-2 text-sm text-white/60">
            <span>No account yet?</span>
            <Link
              href="/signup"
              className="font-semibold text-[#ff9f9f] transition-colors duration-150 ease-out hover:text-[#ffc1c1]"
            >
              Create account
            </Link>
          </div>

          <div className="mt-3 flex items-center justify-center gap-2 text-xs text-white/55">
            <span>Not approved yet?</span>
            <Link
              href="/apply"
              className="font-semibold text-white/80 transition-colors duration-150 ease-out hover:text-white"
            >
              Submit application
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
