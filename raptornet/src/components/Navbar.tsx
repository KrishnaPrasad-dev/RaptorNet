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
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [moreMenuOpen, setMoreMenuOpen] = React.useState(false);
  const moreMenuRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (moreMenuRef.current && !moreMenuRef.current.contains(event.target as Node)) {
        setMoreMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  React.useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  return (
    <nav className={`${geist.className} rn-nav-enter relative z-[100] rounded-[1.35rem] border border-white/12 bg-[#0b0f15]/70 px-3 py-2 text-white backdrop-blur-md sm:rounded-[1.5rem] sm:px-4 sm:py-3 md:px-5`}>
      <div className="flex items-center justify-between gap-2 sm:gap-6">
        {/* Logo */}
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
                className="rounded-full object-cover object-[44%_48%]"
                priority
              />
            </div>
            <p className="flex items-baseline gap-0.5 text-white sm:gap-1">
              <span className={`${raptorFont.className} text-[1.22rem] font-bold leading-none tracking-[0.04em] uppercase text-white sm:text-[1.8rem] sm:tracking-[0.06em]`}>
                Raptor
              </span>
              <span className={`${netFont.className} text-[1.22rem] font-medium leading-none tracking-[0.04em] uppercase text-[#7f1020] sm:text-[1.8rem] sm:tracking-[0.06em]`}>
                Net
              </span>
            </p>
          </div>
        </Link>

        {/* Main Navigation - Shows on md and up */}
        <div className="hidden items-center gap-6 md:flex lg:gap-8 xl:gap-4">
          <Link href="/#about-guild" className="text-sm font-medium text-white/75 transition-colors duration-150 ease-out hover:text-[#7f1020] px-3 py-2 lg:text-base">
            About
          </Link>
          <Link href="/resources" className="text-sm font-medium text-white/75 transition-colors duration-150 ease-out hover:text-[#7f1020] px-3 py-2 lg:text-base">
            Resources
          </Link>
          <Link href="/members" className="text-sm font-medium text-white/75 transition-colors duration-150 ease-out hover:text-[#7f1020] px-3 py-2 lg:text-base">
            Members
          </Link>

          {/* More Dropdown - Shows only on md-lg, hidden on xl+ */}
          <div className="relative md:flex lg:hidden" ref={moreMenuRef}>
            <button
              onClick={() => setMoreMenuOpen(!moreMenuOpen)}
              className="text-sm font-medium text-white/75 transition-colors duration-150 ease-out hover:text-[#7f1020] px-3 py-2 flex items-center gap-1.5"
            >
              More
              <svg className={`w-4 h-4 transition-transform ${moreMenuOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </button>

            {moreMenuOpen && (
              <div className="absolute right-0 top-full mt-2 w-48 rounded-xl border border-white/10 bg-[#0d1117] shadow-2xl z-[300]">
                <Link href="/admin" className="block px-4 py-2.5 text-sm text-white/65 hover:bg-[#7f1020]/20 hover:text-white transition-colors first:rounded-t-lg">
                  Admin
                </Link>
                <Link href="/admin/applications" className="block px-4 py-2.5 text-sm text-white/65 hover:bg-[#7f1020]/20 hover:text-white transition-colors last:rounded-b-lg">
                  Applications
                </Link>
              </div>
            )}
          </div>

          {/* Full Desktop Menu - Shows on xl+ */}
          <div className="hidden xl:flex items-center gap-4">
            <Link href="/admin" className="text-base font-medium text-white/75 transition-colors duration-150 ease-out hover:text-[#7f1020] px-3 py-2">
              Admin
            </Link>
            <Link href="/admin/applications" className="text-base font-medium text-white/75 transition-colors duration-150 ease-out hover:text-[#7f1020] px-3 py-2">
              Applications
            </Link>
          </div>
        </div>

        {/* Right Side - Join Button & Mobile Menu */}
        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          <Link
            href="/login"
            className="hidden rounded-full border border-white/10 bg-transparent px-4 py-2 text-sm font-medium text-white/80 transition-colors duration-150 ease-out hover:border-[#7f1020] hover:text-white md:inline-flex"
          >
            Login
          </Link>

          <Link
            href="/apply"
            className="rn-button hidden items-center gap-2.5 rounded-full border border-white/10 bg-white/5 pl-5 pr-2 py-2 text-sm font-medium text-white/85 transition-colors duration-150 ease-out hover:border-[#7f1020] hover:bg-[#7f1020] hover:text-white md:flex"
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
            className="rn-button rounded-full border border-white/10 bg-white/5 px-2.5 py-1.5 text-[10px] font-semibold tracking-[0.12em] uppercase text-white transition-colors duration-150 ease-out hover:border-[#7f1020] hover:bg-[#7f1020] hover:text-white sm:px-4 sm:py-2 sm:text-[11px] md:hidden"
          >
            Join
          </Link>

          {/* Mobile Hamburger */}
          <button
            type="button"
            aria-label="Toggle menu"
            aria-expanded={mobileMenuOpen}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex cursor-pointer flex-col gap-1.5 rounded-md border-0 bg-transparent p-2 md:hidden"
          >
            <span className={`block h-0.5 w-6 bg-white transition-transform ${mobileMenuOpen ? "translate-y-2 rotate-45" : ""}`} />
            <span className={`block h-0.5 w-6 bg-white transition-opacity ${mobileMenuOpen ? "opacity-0" : ""}`} />
            <span className={`block h-0.5 w-6 bg-white transition-transform ${mobileMenuOpen ? "-translate-y-2 -rotate-45" : ""}`} />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="absolute left-0 top-full z-[200] mt-2.5 flex max-h-[calc(100vh-6rem)] w-full flex-col gap-1 overflow-y-auto rounded-b-[1.25rem] border border-white/10 border-t-0 bg-[#0d1117] p-4 shadow-2xl sm:mt-3 sm:p-5 md:hidden">
          <Link href="/#about-guild" onClick={() => setMobileMenuOpen(false)} className="rounded-lg px-4 py-3 text-sm text-white/65 transition-colors duration-150 ease-out hover:bg-[#7f1020] hover:text-white">
            About Guild
          </Link>
          <Link href="/resources" onClick={() => setMobileMenuOpen(false)} className="rounded-lg px-4 py-3 text-sm text-white/65 transition-colors duration-150 ease-out hover:bg-[#7f1020] hover:text-white">
            Resources
          </Link>
          <Link href="/members" onClick={() => setMobileMenuOpen(false)} className="rounded-lg px-4 py-3 text-sm text-white/65 transition-colors duration-150 ease-out hover:bg-[#7f1020] hover:text-white">
            Current Members
          </Link>
          <Link href="/admin" onClick={() => setMobileMenuOpen(false)} className="rounded-lg px-4 py-3 text-sm text-white/65 transition-colors duration-150 ease-out hover:bg-[#7f1020] hover:text-white">
            Admin
          </Link>
          <Link href="/admin/applications" onClick={() => setMobileMenuOpen(false)} className="rounded-lg px-4 py-3 text-sm text-white/65 transition-colors duration-150 ease-out hover:bg-[#7f1020] hover:text-white">
            Applications
          </Link>
          <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="rounded-lg px-4 py-3 text-sm text-white/65 transition-colors duration-150 ease-out hover:bg-[#7f1020] hover:text-white">
            Login
          </Link>

          <Link
            href="/apply"
            onClick={() => setMobileMenuOpen(false)}
            className="rn-button mt-3 flex w-full items-center justify-center gap-2.5 rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm font-medium text-white/85 transition-colors duration-150 ease-out hover:border-[#7f1020] hover:bg-[#7f1020] hover:text-white"
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