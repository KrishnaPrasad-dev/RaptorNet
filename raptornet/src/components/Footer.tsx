import Link from "next/link";

const footerLinks = [
  { href: "/#about-guild", label: "About" },
  { href: "/resources", label: "Resources" },
  { href: "/members", label: "Members" },
  { href: "/apply", label: "Apply" },
];

export default function Footer() {
  return (
    <footer className="relative border-t border-white/10 bg-[#070a10] text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_0%,rgba(127,16,32,0.16),transparent_34%),radial-gradient(circle_at_82%_100%,rgba(255,255,255,0.05),transparent_28%)]" />
      <div className="relative mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-10 sm:px-10 sm:py-12 lg:flex-row lg:items-end lg:justify-between lg:px-12">
        <div className="max-w-xl">
          <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-red-200/80">
            RaptorNet
          </p>
          <h2 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl">
            Built for students who ship, compete, and keep moving.
          </h2>
          <p className="mt-3 max-w-lg text-sm leading-6 text-white/68 sm:text-base">
            A curated guild at Guru Nanak University for builders from every branch. No filler, just projects, hackathons, and real momentum.
          </p>
        </div>

        <div className="flex flex-col gap-5 sm:flex-row sm:flex-wrap sm:items-start lg:justify-end">
          <nav aria-label="Footer navigation" className="flex flex-wrap gap-2.5">
            {footerLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-white/75 transition-colors duration-150 ease-out hover:border-[#7f1020] hover:bg-[#7f1020]/15 hover:text-white"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="rounded-2xl border border-white/10 bg-black/25 px-4 py-3 sm:max-w-sm">
            <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-white/55">
              Contact
            </p>
            <div className="mt-2 space-y-1">
              <a
                href="mailto:raptornetclub@gmail.com"
                className="block text-sm font-medium text-white/78 transition-colors duration-150 ease-out hover:text-white"
              >
                raptornetclub@gmail.com
              </a>
              <a
                href="mailto:itzmekrishna.257@gmail.com"
                className="block text-sm font-medium text-white/78 transition-colors duration-150 ease-out hover:text-white"
              >
                itzmekrishna.257@gmail.com
              </a>
            </div>
            <p className="mt-2 text-xs leading-5 text-white/50">
              © {new Date().getFullYear()} RaptorNet. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}