"use client";

/* eslint-disable react/no-unescaped-entities */
import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Navbar from "@/components/Navbar";
import RaptorModelCanvas from "@/components/RaptorModelCanvas";
import InteractiveQuoteBox from "@/components/InteractiveQuoteBox";
import TiltCard from "@/components/TiltCard";

export default function Home() {
  const aboutRef = useRef<HTMLDivElement | null>(null);
  const cardsRef = useRef<HTMLDivElement | null>(null);
  const quoteRef = useRef<HTMLDivElement | null>(null);
  const stepsRef = useRef<HTMLDivElement | null>(null);

  const aboutInView = useInView(aboutRef, { once: true, amount: 0.2 });
  const cardsInView = useInView(cardsRef, { once: true, amount: 0.2 });
  const quoteInView = useInView(quoteRef, { once: true, amount: 0.25 });
  const stepsInView = useInView(stepsRef, { once: true, amount: 0.2 });

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#05070b] text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_14%_8%,rgba(255,255,255,0.08),transparent_28%),radial-gradient(circle_at_85%_78%,rgba(120,144,156,0.12),transparent_30%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:84px_84px] opacity-8" />

      <section className="relative mx-auto flex min-h-[92vh] w-full max-w-7xl flex-col px-4 pb-10 pt-3 sm:min-h-[100vh] sm:px-10 sm:pt-4 lg:min-h-[114vh] lg:px-12">
        <Navbar />

        <div
          id="cohort"
          className="relative flex flex-1 items-center overflow-hidden py-10 sm:py-12 lg:py-12"
        >
          <div className="pointer-events-none absolute left-[34%] right-[-10%] top-[8%] bottom-0 hidden lg:block">
            <div className="absolute inset-0 rounded-[3rem] bg-[radial-gradient(circle_at_50%_42%,rgba(255,255,255,0.08),transparent_48%),linear-gradient(180deg,rgba(255,255,255,0.04),transparent_32%)] opacity-90" />
            <div className="absolute inset-x-8 top-4 bottom-0 overflow-hidden rounded-l-[2.25rem] rounded-r-[3.1rem]">
              <div className="absolute inset-0 scale-[1.22] origin-center">
                <RaptorModelCanvas />
              </div>
            </div>
          </div>

          <div
            id="about"
            className="rn-reveal relative z-10 mx-auto w-full max-w-xl rounded-[2rem] border border-white/8 bg-black/15 p-6 text-center backdrop-blur-[2px] sm:p-8 lg:mx-0 lg:max-w-lg lg:bg-transparent lg:pl-8 lg:pr-0 lg:py-0 lg:text-left lg:backdrop-blur-none"
          >
            <p className="relative p-1 pt-4 text-[11px] font-semibold tracking-[0.22em] uppercase text-red-200/85 sm:text-[12px] sm:tracking-[0.28em]">
              Curated guild for builders
            </p>
            <h1 className="mx-auto mt-4 max-w-md text-[2rem] font-bold leading-tight tracking-tight sm:text-4xl lg:mx-0 lg:text-[3.2rem] lg:leading-[0.98]">
              {[
                "Build",
                "together.",
                "Ship",
                "with",
                "intent.",
              ].map((word, index) => (
                <span
                  key={word}
                  className="inline-block opacity-0 drop-shadow-[0_1px_10px_rgba(147,197,253,0.22)]"
                  style={{
                    color: "#ffffff",
                    animation: "heroWordDrop 560ms cubic-bezier(0.2, 0.7, 0.2, 1) forwards",
                    animationDelay: `${index * 0.1}s`,
                  }}
                >
                  {word}
                  {index < 4 ? "\u00A0" : ""}
                </span>
              ))}
            </h1>
            <p
              className="mx-auto mb-4 mt-4 max-w-[34ch] px-1 text-[1rem] leading-7 text-white/90 opacity-0 sm:px-0 sm:text-[1.05rem] lg:mx-0"
              style={{ animation: "heroSubFade 520ms ease-out 0.4s forwards" }}
            >
              A guild from Guru Nanak institutions for students who build real projects, dive into tech, prepare for internships, and show up at hackathons — from CSE, AIML, ECE, or any branch.
            </p>

            <div className="mx-auto mt-5 max-w-xl overflow-hidden rounded-[1.5rem] border border-white/10 bg-[linear-gradient(170deg,rgba(255,255,255,0.05),rgba(10,12,18,0.86))] p-2.5 lg:hidden">
              <div className="h-[260px] w-full rounded-[1.1rem] border border-white/10 bg-black/35 sm:h-[290px]">
                <RaptorModelCanvas mobileEnabled />
              </div>
              <p className="px-2 pb-1 pt-3 text-center text-xs leading-5 text-white/60 sm:text-left">
                Mobile-optimized model preview. Full interactive stage is available on larger screens.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="about-guild" className="relative mx-auto w-full max-w-7xl scroll-mt-24 px-4 pb-10 sm:scroll-mt-28 sm:px-10 lg:px-12">
        <motion.div
          ref={aboutRef}
          initial={{ opacity: 0, y: 40 }}
          animate={aboutInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-6 sm:p-8"
        >
          <p className="text-[16px] font-bold tracking-[0.26em] uppercase text-red-400/85">
            What is RaptorNet
          </p>
          <h2 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl">
            We build. We compete. Grades can wait.
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-7 text-white/78 sm:text-[1.05rem]">
            RaptorNet is a guild of GNU students who chose a different path. When everyone else is cramming notes, we're deep in codebases, pulling all-nighters on projects that actually matter, and walking into hackathons ready to compete. We're open to builders from every branch — CSE, AIML, ECE, and beyond. No assignments. No attendance. No bullshit. Just a pack of builders who give everything to what they're building — because that's what separates the ones who make it from the ones who just pass.
          </p>
        </motion.div>
      </section>

      <section className="relative mx-auto w-full max-w-7xl px-4 pb-10 sm:px-10 lg:px-12">
        <motion.div
          ref={cardsRef}
          initial={{ opacity: 0, y: 40 }}
          animate={cardsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="rn-stagger grid gap-4 md:grid-cols-3"
        >
          <TiltCard className="rn-card group rounded-2xl border border-white/10 bg-black/25 p-5 sm:p-6 transition-colors duration-150 ease-out hover:border-[#7f1020] hover:bg-[#7f1020]/10">   
            <p className="text-[9px] font-bold tracking-[0.22em] uppercase text-red-400/85 sm:text-[10px]">
              Who we are
            </p>
            <h3 className="mt-3 text-[1.15rem] font-semibold leading-snug sm:text-[1.35rem]">Builders & Makers</h3>
            <p className="mt-3 max-w-sm text-sm leading-6 text-white/76 sm:text-base sm:leading-7 break-words">
              We don't wait for a course to teach us. We pick a project, figure
              it out, and ship it — frontend, backend, AI, whatever it takes.
            </p>
          </TiltCard>

          <TiltCard className="rn-card group rounded-2xl border border-white/10 bg-black/25 p-5 sm:p-6 transition-colors duration-150 ease-out hover:border-[#7f1020] hover:bg-[#7f1020]/10">   
            <p className="text-[9px] font-bold tracking-[0.22em] uppercase text-red-400/85 sm:text-[10px]">
              What we do
            </p>
            <h3 className="mt-3 text-[1.15rem] font-semibold leading-snug sm:text-[1.35rem]">Hackathons, Internship Prep & Tech Events</h3>
            <p className="mt-3 max-w-[34ch] text-base leading-7 text-white/76">
              When a hackathon drops, everything stops. We form teams, go all
              in, sharpen for internship rounds together, and come back with
              something to show — win or not.
            </p>
          </TiltCard>

          <TiltCard className="rn-card group rounded-2xl border border-white/10 bg-black/25 p-5 sm:p-6 transition-colors duration-150 ease-out hover:border-[#7f1020] hover:bg-[#7f1020]/10">   
            <p className="text-[9px] font-bold tracking-[0.22em] uppercase text-red-400/85 sm:text-[10px]">
              Who gets in
            </p>
            <h3 className="mt-3 text-[1.15rem] font-semibold leading-snug sm:text-[1.35rem]">Vetted. Not Random.</h3>
            <p className="mt-3 max-w-[34ch] text-base leading-7 text-white/76">
              This isn't an open group chat. Every member is handpicked. If
              you're here to actually build, you'll fit right in, no matter
              your branch.
            </p>
          </TiltCard>
        </motion.div>
      </section>

      <section className="relative mx-auto w-full max-w-7xl px-4 pb-20 sm:px-10 lg:px-12">
        <div className="rounded-[2rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02))] p-6 sm:p-8 transition-colors duration-150 ease-out hover:border-white/20 hover:bg-white/[0.04]">
          <motion.div
            ref={quoteRef}
            initial={{ opacity: 0, x: -30 }}
            animate={quoteInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <InteractiveQuoteBox />
          </motion.div>

          <motion.div
            ref={stepsRef}
            initial={{ opacity: 0, y: 40 }}
            animate={stepsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.08 }}
          >
            <p className="text-[10px] font-bold tracking-[0.24em] uppercase text-white/70">
              How to get in
            </p>
            <div className="rn-stagger mt-4 grid gap-4 sm:grid-cols-4">
            <div className="rn-card rounded-xl border border-white/15 bg-black/20 p-3 sm:p-4 transition-colors duration-150 ease-out hover:border-[#7f1020] hover:bg-[#7f1020]/10">      
              <p className="text-[10px] font-bold tracking-[0.12em] uppercase text-white/85 sm:text-xs sm:tracking-[0.14em]">
                01. Check if you qualify
              </p>
              <p className="mt-2 text-sm leading-6 text-white/76 sm:text-base sm:leading-7">
                Read what we look for. Not grades — projects, curiosity, and the
                drive to actually build something.
              </p>
            </div>
            <div className="rn-card rounded-xl border border-white/15 bg-black/20 p-3 sm:p-4 transition-colors duration-150 ease-out hover:border-[#7f1020] hover:bg-[#7f1020]/10">      
              <p className="text-[10px] font-bold tracking-[0.12em] uppercase text-white/85 sm:text-xs sm:tracking-[0.14em]">
                02. Get your stuff ready
              </p>
              <p className="mt-2 text-sm leading-6 text-white/76 sm:text-base sm:leading-7">
                GitHub, a project you're proud of, and a reason why you want
                in. That's all we need.
              </p>
            </div>
            <div className="rn-card rounded-xl border border-white/15 bg-black/20 p-3 sm:p-4 transition-colors duration-150 ease-out hover:border-[#7f1020] hover:bg-[#7f1020]/10">      
              <p className="text-[10px] font-bold tracking-[0.12em] uppercase text-white/85 sm:text-xs sm:tracking-[0.14em]">
                03. Apply
              </p>
              <p className="mt-2 text-sm leading-6 text-white/76 sm:text-base sm:leading-7">
                Fill the form. No fluff, no essays. Just tell us who you are
                and what you've built.
              </p>
            </div>
            <div className="rn-card rounded-xl border border-white/15 bg-black/20 p-3 sm:p-4 transition-colors duration-150 ease-out hover:border-[#7f1020] hover:bg-[#7f1020]/10">      
              <p className="text-[10px] font-bold tracking-[0.12em] uppercase text-white/85 sm:text-xs sm:tracking-[0.14em]">
                04. We reach out
              </p>
              <p className="mt-2 text-sm leading-6 text-white/76 sm:text-base sm:leading-7">
                If you're in, you'll hear from us. We review every application
                personally — no auto-rejections.
              </p>
            </div>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
