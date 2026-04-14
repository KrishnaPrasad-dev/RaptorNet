import Navbar from "@/components/Navbar";
import RaptorModelCanvas from "@/components/RaptorModelCanvas";

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#05070b] text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_14%_8%,rgba(255,255,255,0.08),transparent_28%),radial-gradient(circle_at_85%_78%,rgba(120,144,156,0.12),transparent_30%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:84px_84px] opacity-14" />

      <section className="relative mx-auto flex min-h-[108vh] w-full max-w-7xl flex-col px-6 pb-10 pt-4 sm:px-10 lg:min-h-[114vh] lg:px-12">
        <Navbar />

        <div
          id="cohort"
          className="relative flex flex-1 items-center overflow-hidden py-14 lg:py-12"
        >
          <div className="pointer-events-none absolute left-[34%] right-[-10%] top-[8%] bottom-0 hidden lg:block">
            <div className="absolute inset-0 rounded-[3rem] bg-[radial-gradient(circle_at_50%_42%,rgba(255,255,255,0.08),transparent_48%),linear-gradient(180deg,rgba(255,255,255,0.04),transparent_32%)] opacity-90" />
            <div className="absolute inset-x-8 top-4 bottom-0 overflow-hidden rounded-[2.25rem]">
              <div className="absolute inset-0 scale-[1.22] origin-center">
                <RaptorModelCanvas />
              </div>
            </div>
          </div>

          <div
            id="about"
            className="relative z-10 max-w-xl rounded-[2rem] border border-white/10 bg-black/20 p-6 backdrop-blur-[2px] sm:p-8 lg:max-w-lg lg:bg-transparent lg:p-0 lg:backdrop-blur-none"
          >
            <p className="text-[10px] font-semibold tracking-[0.28em] uppercase text-red-200/85">
              Curated cohort for builders
            </p>
            <h1 className="mt-4 max-w-md text-3xl font-bold leading-tight tracking-tight sm:text-4xl lg:text-[3.4rem] lg:leading-[0.95]">
              Build with the pack. Ship with intent.
            </h1>
            <p className="mt-4 max-w-md text-sm leading-6 text-white/72 sm:text-base">
              A selective network from Guru Nanak University for students who
              want to build real work, collaborate across domains, and compete
              together at hackathons.
            </p>
          </div>
        </div>
      </section>

      <section className="relative mx-auto w-full max-w-7xl px-6 pb-10 sm:px-10 lg:px-12">
        <div className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-6 sm:p-8">
          <p className="text-[10px] font-semibold tracking-[0.26em] uppercase text-red-200/85">
            What is RaptorNet
          </p>
          <h2 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl">
            A campus-first builder network with real output.
          </h2>
          <p className="mt-4 max-w-3xl text-sm leading-6 text-white/72 sm:text-base">
            RaptorNet is designed for students who want momentum: focused
            cohorts, project sprints, and public showcases that create proof of
            work. Every cycle is built around learning fast and shipping faster.
          </p>
        </div>
      </section>

      <section className="relative mx-auto w-full max-w-7xl px-6 pb-10 sm:px-10 lg:px-12">
        <div className="grid gap-4 md:grid-cols-3">
          <article className="rounded-2xl border border-white/10 bg-black/25 p-6 transition duration-200 hover:border-[#7f1020] hover:bg-[#7f1020]/10">
            <p className="text-[10px] font-semibold tracking-[0.22em] uppercase text-red-200/85">
              Build Track
            </p>
            <h3 className="mt-3 text-xl font-semibold">Product + Frontend</h3>
            <p className="mt-3 text-sm leading-6 text-white/70">
              Turn ideas into usable products with rapid prototyping,
              interaction design, and performance-focused implementation.
            </p>
          </article>

          <article className="rounded-2xl border border-white/10 bg-black/25 p-6 transition duration-200 hover:border-[#7f1020] hover:bg-[#7f1020]/10">
            <p className="text-[10px] font-semibold tracking-[0.22em] uppercase text-red-200/85">
              Systems Track
            </p>
            <h3 className="mt-3 text-xl font-semibold">Backend + Infra</h3>
            <p className="mt-3 text-sm leading-6 text-white/70">
              Learn architecture, APIs, cloud workflows, and deployment habits
              needed to run reliable products under pressure.
            </p>
          </article>

          <article className="rounded-2xl border border-white/10 bg-black/25 p-6 transition duration-200 hover:border-[#7f1020] hover:bg-[#7f1020]/10">
            <p className="text-[10px] font-semibold tracking-[0.22em] uppercase text-red-200/85">
              Compete Track
            </p>
            <h3 className="mt-3 text-xl font-semibold">Hackathons + Demos</h3>
            <p className="mt-3 text-sm leading-6 text-white/70">
              Form teams, practice demo storytelling, and enter hackathons with
              production-ready builds and cleaner execution.
            </p>
          </article>
        </div>
      </section>

      <section className="relative mx-auto w-full max-w-7xl px-6 pb-20 sm:px-10 lg:px-12">
        <div className="rounded-[2rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02))] p-6 sm:p-8 transition duration-200 hover:border-[#7f1020] hover:bg-[#7f1020]/10">
          <p className="text-[10px] font-semibold tracking-[0.24em] uppercase text-red-100/90">
            How it works
          </p>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            <div className="rounded-xl border border-white/15 bg-black/20 p-4 transition duration-200 hover:border-[#7f1020] hover:bg-[#7f1020]/10">
              <p className="text-xs font-semibold tracking-[0.14em] uppercase text-white/85">
                01. Join
              </p>
              <p className="mt-2 text-sm text-white/72">
                Apply and get placed into a focused cohort based on skills.
              </p>
            </div>
            <div className="rounded-xl border border-white/15 bg-black/20 p-4 transition duration-200 hover:border-[#7f1020] hover:bg-[#7f1020]/10">
              <p className="text-xs font-semibold tracking-[0.14em] uppercase text-white/85">
                02. Build
              </p>
              <p className="mt-2 text-sm text-white/72">
                Work in short sprints with mentors, reviews, and deadlines.
              </p>
            </div>
            <div className="rounded-xl border border-white/15 bg-black/20 p-4 transition duration-200 hover:border-[#7f1020] hover:bg-[#7f1020]/10">
              <p className="text-xs font-semibold tracking-[0.14em] uppercase text-white/85">
                03. Showcase
              </p>
              <p className="mt-2 text-sm text-white/72">
                Present your work publicly and ship updates consistently.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
