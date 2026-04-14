/* eslint-disable react/no-unescaped-entities */
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
            className="relative z-10 max-w-xl rounded-[2rem] border border-white/10 bg-black/20 p-6 backdrop-blur-[2px] sm:p-8 lg:max-w-lg lg:bg-transparent lg:pl-8 lg:pr-0 lg:py-0 lg:backdrop-blur-none"
          >
            <p className="text-[12px] font-semibold tracking-[0.28em] uppercase text-red-200/85 p-1 pt-4 relative">
              Curated guild for builders
            </p>
            <h1 className="mt-4 max-w-md text-3xl font-bold leading-tight tracking-tight sm:text-4xl lg:text-[3.4rem] lg:leading-[0.95]">
              Build together. Ship with intent.
            </h1>
            <p className="mt-4 max-w-md text-sm leading-6 text-white/72 sm:text-base pr-3 mb-4">
              A guild from Guru Nanak University for students who build real projects, dive into tech, and show up at hackathons — grades optional.
            </p>
          </div>
        </div>
      </section>

      <section id="about-guild" className="relative mx-auto w-full max-w-7xl scroll-mt-28 px-6 pb-10 sm:px-10 lg:px-12">
        <div className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-6 sm:p-8">
          <p className="text-[16px] font-bold tracking-[0.26em] uppercase text-red-400/85">
            What is RaptorNet
          </p>
          <h2 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl">
            We build. We compete. Grades can wait.
          </h2>
          <p className="mt-4 max-w-3xl text-sm leading-6 text-white/72 sm:text-base">
            RaptorNet is a guild of GNU students who chose a different path. When everyone else is cramming notes, we're deep in codebases, pulling all-nighters on projects that actually matter, and walking into hackathons ready to compete. No assignments. No attendance. No bullshit. Just a pack of builders who give everything to what they're building — because that's what separates the ones who make it from the ones who just pass.
          </p>
        </div>
      </section>

      <section className="relative mx-auto w-full max-w-7xl px-6 pb-10 sm:px-10 lg:px-12">
        <div className="grid gap-4 md:grid-cols-3">
          <article className="rounded-2xl border border-white/10 bg-black/25 p-6 transition-colors duration-150 ease-out hover:border-[#7f1020] hover:bg-[#7f1020]/10">   
            <p className="text-[10px] font-bold tracking-[0.22em] uppercase text-red-400/85">
              Who we are
            </p>
            <h3 className="mt-3 text-xl font-semibold">Builders & Makers</h3>
            <p className="mt-3 text-sm leading-6 text-white/70">
              We don't wait for a course to teach us. We pick a project, figure
              it out, and ship it — frontend, backend, AI, whatever it takes.
            </p>
          </article>

          <article className="rounded-2xl border border-white/10 bg-black/25 p-6 transition-colors duration-150 ease-out hover:border-[#7f1020] hover:bg-[#7f1020]/10">   
            <p className="text-[10px] font-bold tracking-[0.22em] uppercase text-red-400/85">
              What we do
            </p>
            <h3 className="mt-3 text-xl font-semibold">Hackathons & Tech Events</h3>
            <p className="mt-3 text-sm leading-6 text-white/70">
              When a hackathon drops, everything stops. We form teams, go all
              in, and come back with something to show — win or not.
            </p>
          </article>

          <article className="rounded-2xl border border-white/10 bg-black/25 p-6 transition-colors duration-150 ease-out hover:border-[#7f1020] hover:bg-[#7f1020]/10">   
            <p className="text-[10px] font-bold tracking-[0.22em] uppercase text-red-400/85">
              Who gets in
            </p>
            <h3 className="mt-3 text-xl font-semibold">Vetted. Not Random.</h3>
            <p className="mt-3 text-sm leading-6 text-white/70">
              This isn't an open group chat. Every member is handpicked. If
              you're here to actually build, you'll fit right in.
            </p>
          </article>
        </div>
      </section>

      <section className="relative mx-auto w-full max-w-7xl px-6 pb-20 sm:px-10 lg:px-12">
        <div className="rounded-[2rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02))] p-6 sm:p-8 transition-colors duration-150 ease-out hover:border-[#7f1020] hover:bg-[#7f1020]/10">
          <p className="text-[10px] font-bold tracking-[0.24em] uppercase text-red-400/85">
            How to get in
          </p>
          <div className="mt-4 grid gap-4 sm:grid-cols-4">
            <div className="rounded-xl border border-white/15 bg-black/20 p-4 transition-colors duration-150 ease-out hover:border-[#7f1020] hover:bg-[#7f1020]/10">      
              <p className="text-xs font-bold tracking-[0.14em] uppercase text-white/85">
                01. Check if you qualify
              </p>
              <p className="mt-2 text-sm text-white/72">
                Read what we look for. Not grades — projects, curiosity, and the
                drive to actually build something.
              </p>
            </div>
            <div className="rounded-xl border border-white/15 bg-black/20 p-4 transition-colors duration-150 ease-out hover:border-[#7f1020] hover:bg-[#7f1020]/10">      
              <p className="text-xs font-bold tracking-[0.14em] uppercase text-white/85">
                02. Get your stuff ready
              </p>
              <p className="mt-2 text-sm text-white/72">
                GitHub, a project you're proud of, and a reason why you want
                in. That's all we need.
              </p>
            </div>
            <div className="rounded-xl border border-white/15 bg-black/20 p-4 transition-colors duration-150 ease-out hover:border-[#7f1020] hover:bg-[#7f1020]/10">      
              <p className="text-xs font-bold tracking-[0.14em] uppercase text-white/85">
                03. Apply
              </p>
              <p className="mt-2 text-sm text-white/72">
                Fill the form. No fluff, no essays. Just tell us who you are
                and what you've built.
              </p>
            </div>
            <div className="rounded-xl border border-white/15 bg-black/20 p-4 transition-colors duration-150 ease-out hover:border-[#7f1020] hover:bg-[#7f1020]/10">      
              <p className="text-xs font-bold tracking-[0.14em] uppercase text-white/85">
                04. We reach out
              </p>
              <p className="mt-2 text-sm text-white/72">
                If you're in, you'll hear from us. We review every application
                personally — no auto-rejections.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
