import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/Navbar";

const checklist = [
  {
    title: "GitHub Profile",
    detail:
      "Share your GitHub profile link with active repositories, clear README files, and recent work.",
  },
  {
    title: "LinkedIn Profile",
    detail:
      "Add your LinkedIn profile so we can understand your background, interests, and public work.",
  },
  {
    title: "Resume",
    detail:
      "Upload or share a resume link that clearly shows your technical experience, projects, and skills.",
  },
  {
    title: "Project Deployed Link",
    detail:
      "Provide at least one live deployed project URL that we can open and test directly. The image below shows popular hosting platforms you can use for deployment.",
  },
];

export default function ResourcesPage() {
  return (
    <main className="min-h-screen bg-[#05070b] text-white">
      <section className="mx-auto w-full max-w-7xl px-6 pb-16 pt-4 sm:px-10 lg:px-12">
        <Navbar />

        <div className="mt-10 rounded-[2rem] border border-white/10 bg-white/[0.03] p-6 sm:p-8">
          <p className="text-[16px] font-semibold tracking-[0.28em] uppercase text-red-200/85">
            Application resources
          </p>
          <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl lg:text-[3.2rem] lg:leading-[0.95]">
            What you should prepare before applying
          </h1>
          <p className="mt-4 max-w-3xl text-sm leading-6 text-white/72 sm:text-base">
            Use this page as your pre-application checklist. Keep these links and details ready before you submit your application.
          </p>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {checklist.map((item) => (
            <article
              key={item.title}
              className="rounded-2xl border border-white/10 bg-black/25 p-6 transition-colors duration-150 ease-out hover:border-[#7f1020] hover:bg-[#7f1020]/10"
            >
              <h2 className="text-lg font-semibold tracking-tight">{item.title}</h2>
              <p className="mt-3 text-sm leading-6 text-white/72">{item.detail}</p>
              {item.title === "GitHub Profile" && (
                <div className="mt-4 overflow-hidden rounded-xl border border-white/10">
                  <p className="border-b border-white/10 bg-black/30 px-4 py-2 text-[10px] font-semibold tracking-[0.24em] uppercase text-white/55">
                    Reference preview
                  </p>
                  <iframe
                    src="https://www.youtube.com/embed/z8UPAVTh2aE"
                    title="GitHub video guide"
                    className="h-48 w-full"
                    loading="lazy"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allowFullScreen
                  />
                </div>
              )}
              {item.title === "LinkedIn Profile" && (
                <div className="mt-4 overflow-hidden rounded-xl border border-white/10">
                  <p className="border-b border-white/10 bg-black/30 px-4 py-2 text-[10px] font-semibold tracking-[0.24em] uppercase text-white/55">
                    Reference preview
                  </p>
                  <iframe
                    src="https://www.youtube.com/embed/j2YA_TScR-E"
                    title="LinkedIn video guide"
                    className="h-48 w-full"
                    loading="lazy"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allowFullScreen
                  />
                </div>
              )}
              {item.title === "Resume" && (
                <div className="mt-4 overflow-hidden rounded-xl border border-white/10">
                  <p className="border-b border-white/10 bg-black/30 px-4 py-2 text-[10px] font-semibold tracking-[0.24em] uppercase text-white/55">
                    Reference preview
                  </p>
                  <iframe
                    src="https://www.youtube.com/embed/7LcBek-bP9w"
                    title="Resume video guide"
                    className="h-48 w-full"
                    loading="lazy"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allowFullScreen
                  />
                </div>
              )}
              {item.title === "Project Deployed Link" && (
                <div className="mt-4 overflow-hidden rounded-xl border border-white/10">
                  <p className="border-b border-white/10 bg-black/30 px-4 py-2 text-[10px] font-semibold tracking-[0.24em] uppercase text-white/55">
                    Hosting platforms
                  </p>
                  <Image
                    src="/Untitled design.png"
                    alt="Hosting platforms options: Render, Railway, Vercel, Firebase, and Netlify"
                    width={1278}
                    height={720}
                    className="h-auto w-full rounded-xl"
                  />
                </div>
              )}
            </article>
          ))}
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/apply"
            className="rounded-full border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-medium text-white/85 transition-colors duration-150 ease-out hover:border-[#7f1020] hover:bg-[#7f1020] hover:text-white"
          >
            Go to Apply
          </Link>
          <Link
            href="/"
            className="rounded-full border border-white/10 bg-transparent px-5 py-2.5 text-sm font-medium text-white/80 transition-colors duration-150 ease-out hover:border-[#7f1020] hover:text-white"
          >
            Back Home
          </Link>
        </div>

        <div className="mt-8 rounded-[2rem] border border-white/10 bg-white/[0.03] p-6 sm:p-8">
          <p className="text-[10px] font-semibold tracking-[0.28em] uppercase text-red-200/85">
            Contact details
          </p>
          <h2 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl">
            Reach out if you have questions
          </h2>
          <p className="mt-4 max-w-3xl text-sm leading-6 text-white/72 sm:text-base">
            Add your own LinkedIn profile and phone number here so applicants can contact you directly about their projects or application.
          </p>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-black/25 p-5">
              <p className="text-[10px] font-semibold tracking-[0.22em] uppercase text-white/55">
                LinkedIn
              </p>
              <a
                href="https://www.linkedin.com/in/krishnaprasad-webdev/"
                target="_blank"
                rel="noreferrer"
                className="mt-3 inline-flex w-full items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm leading-6 text-white/72 transition-colors duration-150 ease-out hover:border-[#0a66c2] hover:bg-[#0a66c2]/10 hover:text-white"
              >
                <span className="flex size-9 items-center justify-center rounded-full bg-[#0a66c2] text-white shadow-[0_0_20px_rgba(10,102,194,0.25)]">
                  <svg viewBox="0 0 24 24" aria-hidden="true" className="size-4 fill-current">
                    <path d="M4.98 3.5C4.98 4.88 3.87 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1 4.98 2.12 4.98 3.5zM0 8h5v15H0V8zm7.98 0h4.79v2.05h.07c.67-1.26 2.31-2.59 4.75-2.59 5.08 0 6.02 3.34 6.02 7.69V23h-5v-6.57c0-1.57-.03-3.59-2.19-3.59-2.2 0-2.54 1.72-2.54 3.48V23h-5V8z" />
                  </svg>
                </span>
                <span className="break-all">https://www.linkedin.com/in/krishnaprasad-webdev/</span>
              </a>
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/25 p-5">
              <p className="text-[10px] font-semibold tracking-[0.22em] uppercase text-white/55">
                WhatsApp
              </p>
              <a
                href="https://wa.me/917842337902"
                target="_blank"
                rel="noreferrer"
                className="mt-3 inline-flex w-full items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm leading-6 text-white/72 transition-colors duration-150 ease-out hover:border-[#25D366] hover:bg-[#25D366]/10 hover:text-white"
              >
                <span className="flex size-9 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_0_20px_rgba(37,211,102,0.25)]">
                  <svg viewBox="0 0 24 24" aria-hidden="true" className="size-4 fill-current">
                    <path d="M.6 23.4 2.2 17.6A11.1 11.1 0 0 1 0 11.9C0 5.3 5.3 0 11.9 0c3.2 0 6.1 1.2 8.3 3.4A11.8 11.8 0 0 1 24 11.7c0 6.6-5.3 12-11.9 12h-.1c-2 0-4-.5-5.8-1.6L.6 23.4zm6-3.5.3.2a9.7 9.7 0 0 0 5 1.4h.1c5.3 0 9.6-4.3 9.6-9.6a9.6 9.6 0 0 0-2.8-6.8A9.4 9.4 0 0 0 11.9 2.3C6.6 2.3 2.3 6.6 2.3 11.9c0 2 .5 3.9 1.5 5.6l.2.4-.9 3.2 3.5-.9zM8 7.5c.2-.4.4-.4.7-.4h.6c.2 0 .4 0 .5.4.2.5.7 1.8.8 2 .1.2.1.4 0 .6l-.3.4c-.1.1-.2.3-.1.5.1.2.5 1 1.3 1.7.9.8 1.6 1 1.9 1.2.2.1.4.1.5 0l.5-.6c.1-.2.3-.2.5-.1l2.1 1c.2.1.3.2.3.4 0 .9-.5 1.7-1.1 1.8-.6.1-1.3.1-2.2-.2-1.1-.4-2.6-1.1-4.3-2.7C7.2 12 6.3 10.3 6 9.2c-.2-.7-.2-1.5.1-2.1L8 7.5z" />
                  </svg>
                </span>
                <span className="break-all">7842337902</span>
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
