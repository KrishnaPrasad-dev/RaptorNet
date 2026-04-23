"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import RippleGrid from "@/components/RippleGrid";
import CustomCursor from "@/components/CustomCursor";

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);
    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });

      const payload = (await response.json().catch(() => null)) as
        | { message?: string }
        | null;

      if (!response.ok) {
        setError(payload?.message ?? "Signup failed. Please try again.");
        return;
      }

      setSuccess("Account created. Redirecting you to your profile...");
      router.push("/profile");
      router.refresh();
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <CustomCursor />
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

      <section className="relative z-20 mx-auto grid min-h-screen w-full max-w-7xl items-center gap-8 px-4 py-8 sm:px-8 sm:py-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
        <div className="max-w-2xl text-center lg:text-left">
          <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-white/60">
            Signup
          </p>
          <h1 className="mt-4 text-3xl font-black leading-[0.98] tracking-tight sm:mt-5 sm:text-5xl lg:text-7xl">
            Join
            <span className="block text-[#ff3f3f]">RaptorNet account</span>
          </h1>
          <p className="mt-4 max-w-xl text-sm leading-7 text-white/70 sm:mt-6 sm:text-base sm:leading-8 lg:text-lg">
            Create your member account.
          </p>
          <p className="mt-3 text-base font-semibold text-white/78 sm:mt-5 sm:text-xl">
            Approved emails only.
          </p>
        </div>

        <div className="w-full max-w-xl justify-self-stretch overflow-hidden rounded-2xl border border-white/15 bg-[linear-gradient(145deg,rgba(12,16,24,0.56),rgba(8,10,16,0.62))] p-5 shadow-[0_24px_90px_rgba(0,0,0,0.45)] sm:justify-self-end sm:rounded-[2rem] sm:p-9">
          <h2 className="text-center text-3xl font-black tracking-tight sm:text-4xl">Sign Up</h2>
          <p className="mt-2 text-center text-sm text-white/65 sm:text-base">
            Use your approved email
          </p>

          <form className="mt-8 space-y-4" onSubmit={onSubmit}>
            <label className="block">
              <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.2em] text-white/65">
                Name
              </span>
              <input
                value={name}
                onChange={(event) => setName(event.target.value)}
                type="text"
                autoComplete="name"
                required
                className="h-12 w-full rounded-xl border border-white/20 bg-black/35 px-4 text-sm text-white outline-none transition-colors duration-150 ease-out placeholder:text-white/35 focus:border-[#ff4a4a]"
                placeholder="Your name"
              />
            </label>

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
                autoComplete="new-password"
                minLength={8}
                required
                className="h-12 w-full rounded-xl border border-white/20 bg-black/35 px-4 text-sm text-white outline-none transition-colors duration-150 ease-out placeholder:text-white/35 focus:border-[#ff4a4a]"
                placeholder="8+ characters"
              />
            </label>

            {error ? (
              <p className="rounded-lg border border-[#ff7890]/35 bg-[#7f1020]/20 px-3 py-2 text-sm text-[#ffd3dc]">
                {error}
              </p>
            ) : null}

            {success ? (
              <p className="rounded-lg border border-emerald-300/35 bg-emerald-500/15 px-3 py-2 text-sm text-emerald-100">
                {success}
              </p>
            ) : null}

            <button
              type="submit"
              disabled={isLoading}
              className="h-12 w-full rounded-xl border border-[#ff5a5a]/45 bg-[linear-gradient(130deg,#cc1b1b,#ff2727)] text-base font-semibold text-white transition-opacity duration-150 ease-out hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isLoading ? "Creating account..." : "Create Account"}
            </button>
          </form>

          <div className="mt-6 flex items-center justify-center gap-2 text-sm text-white/60">
            <span>Have an account?</span>
            <Link
              href="/login"
              className="font-semibold text-[#ff9f9f] transition-colors duration-150 ease-out hover:text-[#ffc1c1]"
            >
              Log in
            </Link>
          </div>
        </div>
      </section>
    </main>
    </>
  );
}
