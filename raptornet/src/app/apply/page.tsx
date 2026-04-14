import Link from "next/link";
import Navbar from "@/components/Navbar";

export default function ApplyPage() {
  return (
    <main className="min-h-screen bg-[#05070b] text-white">
      <section className="mx-auto w-full max-w-7xl px-6 pb-16 pt-4 sm:px-10 lg:px-12">
        <Navbar />

        <div className="mt-10 grid gap-6 lg:grid-cols-[1.15fr_0.85fr] lg:items-start">
          <div className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-6 sm:p-8">
            <p className="text-[10px] font-semibold tracking-[0.28em] uppercase text-red-200/85">
              Join the guild
            </p>
            <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl lg:text-[3.4rem] lg:leading-[0.95]">
              Apply to RaptorNet
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-white/72 sm:text-base">
              This is where future members introduce themselves, show their work, and explain why they belong in a builder-first guild.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-black/25 p-5">
                <p className="text-xs font-semibold tracking-[0.18em] uppercase text-white/70">
                  What we care about
                </p>
                <p className="mt-3 text-sm leading-6 text-white/72">
                  Projects, curiosity, consistency, and the ability to ship.
                </p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-black/25 p-5">
                <p className="text-xs font-semibold tracking-[0.18em] uppercase text-white/70">
                  What to include
                </p>
                <p className="mt-3 text-sm leading-6 text-white/72">
                  GitHub, portfolio, hackathon work, or anything that proves you build.
                </p>
              </div>
            </div>
          </div>

          <aside className="rounded-[2rem] border border-white/10 bg-black/25 p-6 sm:p-8">
            <p className="text-[10px] font-semibold tracking-[0.26em] uppercase text-red-200/85">
              Application status
            </p>
            <h2 className="mt-3 text-2xl font-bold tracking-tight">
              Form coming soon
            </h2>
            <p className="mt-4 text-sm leading-6 text-white/72">
              The route now exists, so the deployment no longer returns NOT_FOUND. You can wire the actual submission flow here next.
            </p>

            <div className="mt-6 space-y-3 text-sm text-white/72">
              <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
                1. Submit your details
              </div>
              <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
                2. Share one project
              </div>
              <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
                3. Wait for review
              </div>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/"
                className="rounded-full border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-medium text-white/85 transition hover:border-[#7f1020] hover:bg-[#7f1020] hover:text-white"
              >
                Back home
              </Link>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}