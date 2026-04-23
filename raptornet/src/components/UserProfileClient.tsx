"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

type UserProfile = {
  id: string;
  accountId: string;
  name: string;
  email: string;
  college: string;
  branch: string;
  role: string;
  title: string;
  bio: string;
  skills: string[];
  resumeLink: string;
  projectLink: string;
  githubLink: string;
  linkedinLink: string;
  leetcodeLink: string;
  phoneNumber: string;
};

type ActionKind = "resume" | "project" | "github" | "linkedin" | "leetcode";

function ActionIcon({ kind }: { kind: ActionKind }) {
  if (kind === "resume") {
    return (
      <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
        <path d="M12 4v10m0 0 4-4m-4 4-4-4" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M4 15v3a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3" strokeLinecap="round" />
      </svg>
    );
  }

  if (kind === "project") {
    return (
      <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
        <rect x="3.5" y="3.5" width="17" height="17" rx="2.5" />
        <path d="M8 14.5 11 11l2.2 2.2L16 10" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }

  if (kind === "github") {
    return (
      <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 fill-current" aria-hidden="true">
        <path d="M12 .5a12 12 0 0 0-3.8 23.4c.6.1.8-.3.8-.6v-2.2c-3.3.7-4-1.5-4-1.5-.5-1.4-1.3-1.8-1.3-1.8-1.1-.8.1-.8.1-.8 1.2.1 1.9 1.2 1.9 1.2 1.1 1.8 2.9 1.3 3.6 1 .1-.8.4-1.3.7-1.6-2.7-.3-5.6-1.4-5.6-6.1 0-1.3.5-2.4 1.2-3.3-.1-.3-.5-1.6.1-3.2 0 0 1-.3 3.3 1.2a11.5 11.5 0 0 1 6 0c2.3-1.5 3.3-1.2 3.3-1.2.6 1.6.2 2.9.1 3.2.8.9 1.2 2 1.2 3.3 0 4.7-2.9 5.8-5.6 6.1.4.4.8 1.1.8 2.3v3.4c0 .3.2.7.8.6A12 12 0 0 0 12 .5Z" />
      </svg>
    );
  }

  if (kind === "linkedin") {
    return (
      <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 fill-current" aria-hidden="true">
        <path d="M4.98 3.5C4.98 4.88 3.87 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1 4.98 2.12 4.98 3.5zM0 8h5v15H0V8zm7.98 0h4.79v2.05h.07c.67-1.26 2.31-2.59 4.75-2.59 5.08 0 6.02 3.34 6.02 7.69V23h-5v-6.57c0-1.57-.03-3.59-2.19-3.59-2.2 0-2.54 1.72-2.54 3.48V23h-5V8z" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path d="M15.5 8.5h-7a1 1 0 0 0-1 1v7a1 1 0 0 0 1 1h7a1 1 0 0 0 1-1v-7a1 1 0 0 0-1-1Z" />
      <path d="M9.5 8.5V6.7a2.8 2.8 0 1 1 5.6 0v1.8" strokeLinecap="round" />
      <path d="m10.8 12 1.2 1.2 2.2-2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ActionLink({ href, label, kind }: { href: string; label: string; kind: ActionKind }) {
  if (!href) {
    return null;
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/15 bg-[linear-gradient(160deg,rgba(255,255,255,0.08),rgba(255,255,255,0.03))] px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-white/85 transition-colors duration-150 ease-out hover:border-[#7f1020] hover:bg-[#7f1020]/16 hover:text-white"
    >
      <ActionIcon kind={kind} />
      {label}
    </a>
  );
}

export default function UserProfileClient({ profile }: { profile: UserProfile }) {
  const router = useRouter();
  const initials =
    profile.name
      .split(" ")
      .map((part) => part.trim()[0] ?? "")
      .join("")
      .slice(0, 2)
      .toUpperCase() || "RN";

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  return (
    <section className="rn-reveal relative mx-auto mt-8 max-w-6xl overflow-hidden rounded-[2.2rem] border border-white/20 p-[1px] shadow-[0_30px_85px_rgba(0,0,0,0.45)] sm:mt-10">
      <article className="relative z-10 rounded-[2.05rem] border border-white/15 bg-[linear-gradient(145deg,rgba(16,20,28,0.9),rgba(10,12,18,0.86))] p-6 sm:p-8 lg:p-10">
        <div className="mb-7 flex flex-col gap-3 rounded-2xl border border-white/10 bg-black/25 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-5">
          <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-white/55">
            Account Controls
          </p>
          <div className="grid w-full grid-cols-1 gap-2 sm:flex sm:w-auto sm:flex-wrap sm:items-center">
            <Link
              href="/profile/edit"
              className="rn-button inline-flex items-center justify-center gap-2 rounded-full border border-[#7f1020]/70 bg-[#7f1020]/25 px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-white transition-colors duration-150 ease-out hover:bg-[#7f1020]/45 sm:px-5 sm:py-2.5 sm:text-sm"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                <path d="m4 16 0 4 4 0 10-10-4-4L4 16z" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M13 6l4 4" strokeLinecap="round" />
              </svg>
              Edit Profile
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/15 bg-transparent px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-white/75 transition-colors duration-150 ease-out hover:border-[#7f1020] hover:text-white sm:px-5 sm:py-2.5 sm:text-sm"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                <path d="M10 17 5 12l5-5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M5 12h10" strokeLinecap="round" />
                <path d="M14 5h3a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-3" strokeLinecap="round" />
              </svg>
              Logout
            </button>
          </div>
        </div>

        <div className="grid gap-8 md:grid-cols-[260px_1fr] md:items-start">
          <div className="flex flex-col items-center">
            <div className="flex h-40 w-40 items-center justify-center overflow-hidden rounded-full border-4 border-[#7f1020]/70 bg-[linear-gradient(140deg,#2a0f15,#10131a)] text-4xl font-black text-white shadow-[0_0_50px_rgba(127,16,32,0.35)] md:h-52 md:w-52 md:text-5xl">
              {initials}
            </div>
            <span className="mt-4 rounded-full border border-white/10 bg-black/30 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.22em] text-white/70">
              {profile.branch || "Member"}
            </span>
          </div>

          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-white/60">
              Verified Member Profile
            </p>
            <h1 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
              {profile.name || "Unnamed Member"}
            </h1>
            <p className="mt-2 text-lg font-medium text-white/80">
              {profile.title || "Builder"}
            </p>

            <div className="mt-4 inline-flex items-center rounded-full border border-white/10 bg-black/35 px-4 py-2 text-sm font-semibold uppercase tracking-[0.18em] text-white/80">
              {profile.role || "Guild Member"}
            </div>

            <p className="mt-6 max-w-2xl text-base leading-7 text-white/78">
              {profile.bio || "Add a short bio to tell other members what you build."}
            </p>

            {profile.skills.length > 0 && (
              <div className="mt-7">
                <h2 className="text-lg font-bold text-white/90">Skills</h2>
                <div className="rn-stagger mt-3 flex flex-wrap gap-2.5">
                  {profile.skills.map((item) => (
                    <span
                      key={item}
                      className="rn-card rounded-full border border-white/15 bg-black/35 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-white/75 transition-colors duration-150 ease-out hover:border-[#7f1020] hover:bg-[#7f1020]/10"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-6 rounded-2xl border border-white/10 bg-black/25 p-3 sm:p-4">
              <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.24em] text-white/55">
                Profile Links
              </p>
              <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
                <ActionLink href={profile.resumeLink} label="Resume" kind="resume" />
                <ActionLink href={profile.projectLink} label="Project" kind="project" />
                <ActionLink href={profile.githubLink} label="GitHub" kind="github" />
                <ActionLink href={profile.linkedinLink} label="LinkedIn" kind="linkedin" />
                <ActionLink href={profile.leetcodeLink} label="LeetCode" kind="leetcode" />
              </div>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl border border-white/10 bg-black/25 px-4 py-3">
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/55">Email</p>
                <p className="mt-1 text-sm text-white/90">{profile.email || "Not set"}</p>
              </div>
              <div className="rounded-xl border border-white/10 bg-black/25 px-4 py-3">
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/55">College</p>
                <p className="mt-1 text-sm text-white/90">{profile.college || "Not set"}</p>
              </div>
              <div className="rounded-xl border border-white/10 bg-black/25 px-4 py-3">
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/55">Branch</p>
                <p className="mt-1 text-sm text-white/90">{profile.branch || "Not set"}</p>
              </div>
              <div className="rounded-xl border border-white/10 bg-black/25 px-4 py-3">
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/55">Phone</p>
                <p className="mt-1 text-sm text-white/90">{profile.phoneNumber || "Not set"}</p>
              </div>
            </div>

          </div>
        </div>
      </article>
    </section>
  );
}
