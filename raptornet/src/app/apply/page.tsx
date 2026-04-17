import Link from "next/link";
import Navbar from "@/components/Navbar";
import ApplicationForm from "@/components/ApplicationForm";

export default function ApplyPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#05070b] text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_14%_8%,rgba(255,255,255,0.08),transparent_28%),radial-gradient(circle_at_85%_78%,rgba(120,144,156,0.12),transparent_30%)]" />
      <section className="mx-auto w-full max-w-7xl px-4 pb-14 pt-3 sm:px-10 sm:pt-4 lg:px-12">
        <Navbar />

        <div className="mt-8 grid gap-5 lg:mt-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-start lg:gap-6">
          <div className="rn-reveal rounded-[2rem] border border-white/8 bg-white/[0.03] p-5 text-center sm:p-8 lg:text-left">
            <p className="text-[10px] font-semibold tracking-[0.28em] uppercase text-red-200/85">
              Join the guild
            </p>
            <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl lg:text-[3.4rem] lg:leading-[0.95]">
              Apply to RaptorNet
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-white/72 sm:text-base lg:mx-0">
              Submit your details. We review profiles and projects, then reach out. All branches are welcome.
            </p>

            <div className="mt-4 rounded-lg border border-white/15 bg-white/[0.02] p-4 text-left">
              <p className="text-sm leading-6 text-white/78 sm:text-base">
                <span className="font-semibold text-white/80">Not sure what to prepare?</span> Use the <Link href="/resources" className="font-semibold text-[#7f1020] hover:text-[#9f1030] transition-colors">Resources page</Link> for quick examples.
              </p>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="rn-card rounded-2xl border border-white/10 bg-black/25 p-5 transition-colors duration-150 ease-out hover:border-[#7f1020] hover:bg-[#7f1020]/10">
                <p className="text-xs font-semibold tracking-[0.18em] uppercase text-white/70">
                  What we care about
                </p>
                <p className="mt-3 text-sm leading-6 text-white/72">
                  We value builders: projects, consistency, and shipping.
                </p>
              </div>
              <div className="rn-card rounded-2xl border border-white/10 bg-black/25 p-5 transition-colors duration-150 ease-out hover:border-[#7f1020] hover:bg-[#7f1020]/10">
                <p className="text-xs font-semibold tracking-[0.18em] uppercase text-white/70">
                  What to include
                </p>
                <p className="mt-3 text-sm leading-6 text-white/72">
                  Basic details, resume link, GitHub, LinkedIn, phone, and project proof.
                </p>
              </div>
            </div>

            <div className="rn-reveal rn-delay-1 mt-5 rounded-2xl border border-white/10 bg-black/25 p-4 sm:p-6">
              <p className="text-xs font-semibold tracking-[0.18em] uppercase text-red-200/85">
                Quick checklist
              </p>
              <ol className="mt-4 space-y-3 text-sm leading-6 text-white/75">
                <li>
                  <span className="font-semibold text-white">1. Resume (Google Drive):</span> set "Anyone with the link can view".
                </li>
                <li>
                  <span className="font-semibold text-white">2. Project proof:</span> software = live deployed link, ECE/hardware = Google Drive demo video.
                </li>
                <li>
                  <span className="font-semibold text-white">3. Add GitHub + LinkedIn:</span> share clean, active profiles.
                </li>
                <li>
                  <span className="font-semibold text-white">4. Final check:</span> LeetCode is optional; open all links once before submit.
                </li>
              </ol>
            </div>
          </div>

          <ApplicationForm />
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <Link
            href="/resources"
            className="rn-button inline-flex w-full items-center justify-center rounded-full border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-medium text-white/85 transition-colors duration-150 ease-out hover:border-[#7f1020] hover:bg-[#7f1020] hover:text-white sm:w-auto"
          >
            View Resources
          </Link>
          <Link
            href="/"
            className="rn-button inline-flex w-full items-center justify-center rounded-full border border-white/10 bg-transparent px-5 py-2.5 text-sm font-medium text-white/80 transition-colors duration-150 ease-out hover:border-[#7f1020] hover:text-white sm:w-auto"
          >
            Back home
          </Link>
        </div>
      </section>
    </main>
  );
}