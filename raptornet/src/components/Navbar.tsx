"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Geist, Cormorant_Garamond, Space_Grotesk } from "next/font/google";

const geist = Geist({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const raptorFont = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["600", "700"],
});

const netFont = Space_Grotesk({
  subsets: ["latin"],
  weight: ["500", "700"],
});

export default function Navbar() {
  const [menuOpen, setMenuOpen] = React.useState(false);

  return (
    <nav className={`${geist.className} relative rounded-[1.5rem] border border-white/10 bg-black/40 px-4 py-3 text-white backdrop-blur-xl md:px-5`}>
      <div className="flex items-center justify-between gap-6">
        <div className="flex items-center gap-8 lg:gap-10">
          <Link href="/" className="shrink-0" aria-label="RaptorNet home">
            <div className="flex items-center gap-4">
              <div className="relative h-12 w-12 overflow-hidden rounded-full border border-white/10 bg-white/5 shadow-[0_0_20px_rgba(255,255,255,0.08)]">
                <Image
                  src="/rn.png"
                  alt="Raptor icon"
                  fill
                  sizes="48px"
                  quality={100}
                  unoptimized
                  className="object-cover object-[44%_48%]"
                  priority
                />
              </div>
              <p className="flex items-baseline gap-2 text-white">
                <span className={`${raptorFont.className} text-[1.8rem] font-semibold leading-none tracking-[0.08em] uppercase text-white`}>
                  Raptor
                </span>
                <span className={`${netFont.className} text-[1.2rem] font-medium leading-none tracking-[0.28em] uppercase text-white/70`}>
                  Net
                </span>
              </p>
            </div>
          </Link>

          <div className="hidden items-center gap-8 lg:flex">
            <a href="#about" className="text-sm text-white/75 transition hover:text-[#7f1020]">About Guild</a>
            <span className="text-xs font-medium tracking-[0.2em] uppercase text-white/45">Builders only</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/apply"
            className="hidden items-center gap-2.5 rounded-full border border-white/10 bg-white/5 pl-5 pr-2 py-2 text-sm font-medium text-white/85 transition hover:border-[#7f1020] hover:bg-[#7f1020] hover:text-white md:flex"
          >
             Join the Raptor Guild 
            <span className="flex size-7 items-center justify-center rounded-full bg-white">
              <svg width="12" height="10" viewBox="0 0 12 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M.6 4.602h10m-4-4 4 4-4 4" stroke="#3f3f47" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          </Link>

          <Link
            href="/apply"
            className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-[11px] font-semibold tracking-[0.16em] uppercase text-white transition hover:border-[#7f1020] hover:bg-[#7f1020] hover:text-white md:hidden"
          >
            Join
          </Link>

          <button
            type="button"
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex cursor-pointer flex-col gap-1.5 border-0 bg-transparent p-1 md:hidden"
          >
            <span className={`block h-0.5 w-6 bg-white transition-transform ${menuOpen ? "translate-y-2 rotate-45" : ""}`} />
            <span className={`block h-0.5 w-6 bg-white transition-opacity ${menuOpen ? "opacity-0" : ""}`} />
            <span className={`block h-0.5 w-6 bg-white transition-transform ${menuOpen ? "-translate-y-2 -rotate-45" : ""}`} />
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="absolute left-0 top-full z-50 mt-3 flex w-full flex-col gap-1 rounded-b-[1.25rem] border border-white/10 border-t-0 bg-[#0d1117] p-5 shadow-2xl md:hidden">
          <a href="#about" className="rounded-lg px-4 py-2.5 text-sm text-white/65 transition hover:bg-[#7f1020] hover:text-white">About Guild</a>

          <Link
            href="/apply"
            className="mt-3 flex w-fit items-center justify-center gap-2.5 rounded-full border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-medium text-white/85 transition hover:border-[#7f1020] hover:bg-[#7f1020] hover:text-white"
          >
            Join Our Guild
            <span className="flex size-7 items-center justify-center rounded-full bg-white">
              <svg width="12" height="10" viewBox="0 0 12 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M.6 4.602h10m-4-4 4 4-4 4" stroke="#3f3f47" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          </Link>
        </div>
      )}
    </nav>
  );
}