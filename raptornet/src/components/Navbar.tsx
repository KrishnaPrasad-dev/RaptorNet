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
    <nav className={`${geist.className} relative z-[100] rounded-[1.5rem] border border-white/10 bg-black/40 px-3 py-2.5 text-white backdrop-blur-md sm:px-4 sm:py-3 md:px-5`}>
      <div className="flex items-center justify-between gap-3 sm:gap-6">
        <div className="flex min-w-0 items-center gap-4 sm:gap-8 lg:gap-10">
          <Link href="/" className="shrink-0" aria-label="RaptorNet home">
            <div className="flex items-center gap-2.5 sm:gap-4">
              <div className="relative h-10 w-10 overflow-hidden rounded-full border border-white/10 bg-white/5 shadow-[0_0_20px_rgba(255,255,255,0.08)] sm:h-12 sm:w-12">
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
              <p className="flex items-baseline gap-0.5 text-white sm:gap-1">
                <span className={`${raptorFont.className} text-[1.45rem] font-bold leading-none tracking-[0.05em] uppercase text-white sm:text-[1.8rem] sm:tracking-[0.06em]`}>
                  Raptor
                </span>
                <span className={`${netFont.className} text-[1.45rem] font-medium leading-none tracking-[0.05em] uppercase text-[#7f1020] sm:text-[1.8rem] sm:tracking-[0.06em]`}>
                  Net
                </span>
              </p>
            </div>
          </Link>

          {/* Tablet Navigation - 3-4 key buttons */}
          <div className="hidden items-center gap-3 md:flex lg:hidden">
            <Link href="/#about-guild" className="text-xs font-medium text-white/75 transition-colors duration-150 ease-out hover:text-[#7f1020] px-3 py-1.5">About</Link>
            <Link href="/resources" className="text-xs font-medium text-white/75 transition-colors duration-150 ease-out hover:text-[#7f1020] px-3 py-1.5">Resources</Link>
            <Link href="/members" className="text-xs font-medium text-white/75 transition-colors duration-150 ease-out hover:text-[#7f1020] px-3 py-1.5">Members</Link>
            <Link href="/admin/applications" className="text-xs font-medium text-white/75 transition-colors duration-150 ease-out hover:text-[#7f1020] px-3 py-1.5">Apps</Link>
          </div>

          {/* Desktop Navigation - Full menu */}
          <div className="hidden items-center gap-8 lg:flex">
            <Link href="/#about-guild" className="text-md text-white/75 transition-colors duration-150 ease-out hover:text-[#7f1020]">About Guild</Link>
            <Link href="/resources" className="text-md text-white/75 transition-colors duration-150 ease-out hover:text-[#7f1020]">Resources</Link>
            <Link href="/admin" className="text-md text-white/75 transition-colors duration-150 ease-out hover:text-[#7f1020]">Admin</Link>
            <Link href="/admin/applications" className="text-md text-white/75 transition-colors duration-150 ease-out hover:text-[#7f1020]">Applications</Link>
            <Link
              href="/members"
              className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs font-semibold tracking-[0.14em] uppercase text-white/80 transition-colors duration-150 ease-out hover:border-[#7f1020] hover:bg-[#7f1020]/20 hover:text-white"
            >
              Current Members
            </Link>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
          <Link
            href="/apply"
            className="hidden items-center gap-2.5 rounded-full border border-white/10 bg-white/5 pl-5 pr-2 py-2 text-sm font-medium text-white/85 transition-colors duration-150 ease-out hover:border-[#7f1020] hover:bg-[#7f1020] hover:text-white md:flex"
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
            className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[10px] font-semibold tracking-[0.14em] uppercase text-white transition-colors duration-150 ease-out hover:border-[#7f1020] hover:bg-[#7f1020] hover:text-white sm:px-4 sm:py-2 sm:text-[11px] sm:tracking-[0.16em] md:hidden"
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
        <div className="absolute left-0 top-full z-[200] mt-2.5 flex w-full flex-col gap-1 rounded-b-[1.25rem] border border-white/10 border-t-0 bg-[#0d1117] p-4 shadow-2xl sm:mt-3 sm:p-5 md:hidden">
          <Link href="/#about-guild" className="rounded-lg px-4 py-2.5 text-sm text-white/65 transition-colors duration-150 ease-out hover:bg-[#7f1020] hover:text-white">About Guild</Link>
          <Link href="/resources" className="rounded-lg px-4 py-2.5 text-sm text-white/65 transition-colors duration-150 ease-out hover:bg-[#7f1020] hover:text-white">Resources</Link>
          <Link href="/members" className="rounded-lg px-4 py-2.5 text-sm text-white/65 transition-colors duration-150 ease-out hover:bg-[#7f1020] hover:text-white">Current Members</Link>
          <Link href="/admin" className="rounded-lg px-4 py-2.5 text-sm text-white/65 transition-colors duration-150 ease-out hover:bg-[#7f1020] hover:text-white">Admin Profile</Link>
          <Link href="/admin/applications" className="rounded-lg px-4 py-2.5 text-sm text-white/65 transition-colors duration-150 ease-out hover:bg-[#7f1020] hover:text-white">Applications</Link>

          <Link
            href="/apply"
            className="mt-3 flex w-fit items-center justify-center gap-2.5 rounded-full border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-medium text-white/85 transition-colors duration-150 ease-out hover:border-[#7f1020] hover:bg-[#7f1020] hover:text-white"
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