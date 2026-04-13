import Link from "next/link";
import RaptorModelCanvas from "@/components/RaptorModelCanvas";

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#060606] text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_8%_0%,rgba(220,38,38,0.24),transparent_32%),radial-gradient(circle_at_90%_90%,rgba(220,38,38,0.16),transparent_34%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:84px_84px] opacity-20" />

      <section className="relative mx-auto flex min-h-screen w-full max-w-7xl flex-col px-6 pb-6 pt-4 sm:px-10 lg:px-12">
        <header className="-mx-6 border-b border-white/10 bg-transparent px-6 py-4 sm:-mx-10 sm:px-10 lg:-mx-12 lg:px-12">
          <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
                R
              </div>
              <p className="text-xs font-semibold tracking-[0.26em] uppercase text-white/85">
                RaptorNet
              </p>
            </div>

            <nav className="hidden items-center gap-1 md:flex">
              <a
                href="#about"
                className="rounded-md px-3 py-2 text-[11px] font-medium tracking-[0.12em] uppercase text-white/70 transition hover:bg-white/10 hover:text-white"
              >
                About
              </a>
              <a
                href="#cohort"
                className="rounded-md px-3 py-2 text-[11px] font-medium tracking-[0.12em] uppercase text-white/70 transition hover:bg-white/10 hover:text-white"
              >
                Cohort
              </a>
              <a
                href="/apply"
                className="rounded-md px-3 py-2 text-[11px] font-medium tracking-[0.12em] uppercase text-white/70 transition hover:bg-white/10 hover:text-white"
              >
                Apply
              </a>
            </nav>

            <div className="flex items-center gap-2">
              <a
                href="#about"
                className="rounded-full px-3 py-2 text-[11px] font-medium tracking-[0.12em] uppercase text-white/65 transition hover:bg-white/10 hover:text-white md:hidden"
              >
                About
              </a>
              <Link
                href="/apply"
                className="rounded-full border border-red-400/50 bg-red-500/90 px-4 py-2 text-[11px] font-semibold tracking-[0.12em] uppercase text-white transition hover:bg-red-400"
              >
                Join the Pack
              </Link>
            </div>
          </div>
        </header>

        <div id="cohort" className="grid flex-1 items-center gap-10 py-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-12 lg:py-8">
          <div id="about" className="max-w-md">
            <p className="text-[10px] font-semibold tracking-[0.28em] uppercase text-red-200/85">
              Curated cohort for builders
            </p>
            <h1 className="mt-4 text-3xl font-bold leading-tight tracking-tight sm:text-4xl lg:text-[2.8rem]">
              Build with the pack. Ship with intent.
            </h1>
            <p className="mt-4 text-sm leading-6 text-white/70">
              A selective network from Guru Nanak University for students who
              want to build real work, collaborate across domains, and compete
              together at hackathons.
            </p>
          </div>

          <div className="relative flex h-full min-h-[26rem] items-center justify-center rounded-[2rem] border border-white/10 bg-white/[0.03] p-6 sm:min-h-[30rem] lg:min-h-[36rem]">
            <div className="pointer-events-none absolute inset-0 rounded-[2rem] bg-[radial-gradient(circle_at_50%_20%,rgba(220,38,38,0.2),transparent_45%)]" />
            <div className="relative h-full w-full overflow-hidden rounded-[1.5rem] border border-white/10 bg-black/35">
              <RaptorModelCanvas />
              <div className="pointer-events-none absolute inset-x-0 bottom-4 text-center text-[11px] tracking-[0.18em] uppercase text-white/55">
                Red Velociraptor
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
