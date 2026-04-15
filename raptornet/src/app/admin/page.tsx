import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import LetterGlitch from "@/components/LetterGlitch";

const admin = {
  name: "J Krishna Prasad Goud",
  title: "Full Stack Web Developer (MERN)",
  role: "Guild Admin",
  section: "Core Team",
  bio: `Im Krishna Prasad, a builder from GNU who got tired of waiting for the right people to build with. So I built the network instead. RaptorNet is my answer to a campus full of potential that never gets activated - a vetted guild for students who care more about what they're shipping than what's on their transcript. If you're the kind of person who opens a code editor before you open your notes app, you're exactly who this is for.`,
  skills: ["React.js", "Javascript", "Node.js", "TailwindCSS", "HTML", "Express.js", "CSS", "Next.js", "Mongodb", "Postman", "Git", "Github", "Render", "Vercel"],
  resumeLink: "https://drive.google.com/file/d/1ra2kmiI-7Atfp6q7HNCyrgMQtCf9sjpg/view?usp=sharing",
  githubUrl: "https://github.com/KrishnaPrasad-dev/RaptorNet",
  linkedinUrl: "https://www.linkedin.com/in/krishnaprasad-webdev/",
  portfolioUrl: "https://krishnaprasad.space",
};

export default function AdminPage() {
  return (
    <main className="relative min-h-screen overflow-hidden text-white">
      <div className="pointer-events-none fixed inset-0 z-0">
        <LetterGlitch
          glitchSpeed={50}
          glitchColors={["#7f1020", "#c81f37", "#7f8ea3"]}
          centerVignette={true}
          outerVignette={false}
          smooth={true}
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,5,8,0.34),rgba(5,5,8,0.46))]" />
      </div>

      <section className="relative z-10 mx-auto w-full max-w-7xl px-6 pb-16 pt-4 sm:px-10 lg:px-12">
        <Navbar />

        <section className="relative mx-auto mt-10 max-w-6xl overflow-hidden rounded-[2.2rem] border border-white/20 p-[1px] shadow-[0_30px_85px_rgba(0,0,0,0.45)]">
          <div className="relative z-10 rounded-[2.05rem] border border-white/15 bg-[linear-gradient(145deg,rgba(16,20,28,0.9),rgba(10,12,18,0.86))] p-6 sm:p-8 lg:p-10">
            <div className="grid gap-8 md:grid-cols-[260px_1fr] md:items-start">
            <div className="flex flex-col items-center">
              <div className="relative h-40 w-40 overflow-hidden rounded-full border-4 border-[#7f1020]/70 shadow-[0_0_50px_rgba(127,16,32,0.35)] md:h-52 md:w-52">
                <Image
                  src="/kp.jpeg"
                  alt="Admin avatar"
                  fill
                  className="object-cover"
                  sizes="208px"
                  priority
                />
              </div>
              <span className="mt-4 rounded-full border border-white/10 bg-black/30 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.22em] text-white/70">
                {admin.section}
              </span>
            </div>

            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-white/60">
                Verified Leadership Profile
              </p>
              <h1 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
                {admin.name}
              </h1>
              <p className="mt-2 text-lg font-medium text-white/80">
                {admin.title}
              </p>

              <div className="mt-4 inline-flex items-center rounded-full border border-white/10 bg-black/35 px-4 py-2 text-sm font-semibold uppercase tracking-[0.18em] text-white/80">
                {admin.role}
              </div>

              <p className="mt-6 max-w-2xl text-base leading-7 text-white/78">
                {admin.bio}
              </p>

              <div className="mt-7">
                <h2 className="text-lg font-bold text-white/90">Skills</h2>
                <div className="mt-3 flex flex-wrap gap-2.5">
                  {admin.skills.map((skill) => (
                    <span
                      key={skill}
                      className="rounded-full border border-white/15 bg-black/35 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-white/75"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <a
                  href={admin.resumeLink}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-5 py-2.5 text-sm font-semibold text-white/90 transition-colors duration-150 ease-out hover:border-[#7f1020] hover:bg-[#7f1020]/25"
                >
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                    <path d="M12 4v10m0 0 4-4m-4 4-4-4" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M4 15v3a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3" strokeLinecap="round" />
                  </svg>
                  Resume
                </a>
                <a
                  href={admin.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-transparent px-5 py-2.5 text-sm font-semibold text-white/75 transition-colors duration-150 ease-out hover:border-[#7f1020] hover:text-white"
                >
                  <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden="true">
                    <path d="M12 .5a12 12 0 0 0-3.8 23.4c.6.1.8-.3.8-.6v-2.2c-3.3.7-4-1.5-4-1.5-.5-1.4-1.3-1.8-1.3-1.8-1.1-.8.1-.8.1-.8 1.2.1 1.9 1.2 1.9 1.2 1.1 1.8 2.9 1.3 3.6 1 .1-.8.4-1.3.7-1.6-2.7-.3-5.6-1.4-5.6-6.1 0-1.3.5-2.4 1.2-3.3-.1-.3-.5-1.6.1-3.2 0 0 1-.3 3.3 1.2a11.5 11.5 0 0 1 6 0c2.3-1.5 3.3-1.2 3.3-1.2.6 1.6.2 2.9.1 3.2.8.9 1.2 2 1.2 3.3 0 4.7-2.9 5.8-5.6 6.1.4.4.8 1.1.8 2.3v3.4c0 .3.2.7.8.6A12 12 0 0 0 12 .5Z" />
                  </svg>
                  GitHub
                </a>
                <a
                  href={admin.linkedinUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-transparent px-5 py-2.5 text-sm font-semibold text-white/75 transition-colors duration-150 ease-out hover:border-[#7f1020] hover:text-white"
                >
                  <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden="true">
                    <path d="M4.98 3.5C4.98 4.88 3.87 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1 4.98 2.12 4.98 3.5zM0 8h5v15H0V8zm7.98 0h4.79v2.05h.07c.67-1.26 2.31-2.59 4.75-2.59 5.08 0 6.02 3.34 6.02 7.69V23h-5v-6.57c0-1.57-.03-3.59-2.19-3.59-2.2 0-2.54 1.72-2.54 3.48V23h-5V8z" />
                  </svg>
                  LinkedIn
                </a>
                <a
                  href={admin.portfolioUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-transparent px-5 py-2.5 text-sm font-semibold text-white/75 transition-colors duration-150 ease-out hover:border-[#7f1020] hover:text-white"
                >
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                    <path d="M3 12h18M12 3a15 15 0 0 1 0 18M12 3a15 15 0 0 0 0 18" strokeLinecap="round" />
                  </svg>
                  Portfolio
                </a>
              </div>

              <div className="mt-8">
                <div className="flex flex-wrap items-center gap-4">
                  <Link
                    href="/admin/applications"
                    className="text-sm font-semibold text-[#ff9fb0] transition-colors duration-150 ease-out hover:text-[#ffc1cd]"
                  >
                    View Applications
                  </Link>
                  <Link
                    href="/"
                    className="text-sm font-medium text-white/60 transition-colors duration-150 ease-out hover:text-white"
                  >
                    Back to Home
                  </Link>
                </div>
              </div>
            </div>
          </div>
          </div>
        </section>
      </section>
    </main>
  );
}
