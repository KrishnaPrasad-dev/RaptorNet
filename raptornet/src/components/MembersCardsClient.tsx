"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

type Member = {
  id: string;
  name: string;
  role: string;
  title: string;
  branch: string;
  year: string;
  focus?: string[];
  strengths?: string[];
  image?: string;
  status: "Active" | "Founding" | "Core";
  projectLink?: string;
  leetcodeUrl?: string;
  githubUrl?: string;
  linkedinUrl?: string;
  portfolioUrl?: string;
  bio: string;
};

function ProfileAvatar({ member }: { member: Member }) {
  if (member.image) {
    return (
      <div className="relative mx-auto h-32 w-32 overflow-hidden rounded-2xl border border-white/15 bg-white/5 md:mx-0 md:h-36 md:w-36">
        <Image
          src={member.image}
          alt={`${member.name} profile`}
          fill
          sizes="144px"
          className="object-cover"
        />
      </div>
    );
  }

  return (
    <div className="mx-auto flex h-32 w-32 items-center justify-center rounded-2xl border border-white/15 bg-white/5 text-3xl font-bold uppercase text-white/75 md:mx-0 md:h-36 md:w-36">
      {member.name.slice(0, 1)}
    </div>
  );
}

function MemberLinkButton({ href, label }: { href?: string; label: string }) {
  if (!href) {
    return null;
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      onClick={(event) => event.stopPropagation()}
      className="inline-flex w-full items-center justify-center rounded-full border border-white/15 bg-transparent px-4 py-2.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-white/80 transition-colors duration-150 ease-out hover:border-[#7f1020] hover:text-white sm:w-auto"
    >
      {label}
    </a>
  );
}

export default function MembersCardsClient({ members }: { members: Member[] }) {
  const router = useRouter();

  return (
    <div className="rn-stagger space-y-4">
      {members.map((member) => (
        <article
          key={member.id}
          className="rn-card cursor-pointer rounded-[1.7rem] border border-white/10 bg-[linear-gradient(150deg,rgba(255,255,255,0.05),rgba(10,12,18,0.92))] p-5 transition-colors duration-150 ease-out hover:border-[#7f1020]/65 sm:p-6"
          onClick={() => router.push(`/members/${member.id}`)}
          role="button"
          tabIndex={0}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              router.push(`/members/${member.id}`);
            }
          }}
        >
          <div className="grid gap-5 text-center md:grid-cols-[150px_1fr] md:items-start md:text-left">
            <ProfileAvatar member={member} />

            <div>
              <div className="flex flex-wrap items-center justify-center gap-2.5 md:justify-start">
                <span className="rounded-full border border-[#7f1020]/70 bg-[#7f1020]/20 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-[#ffb9c4]">
                  {member.status}
                </span>
                <span className="text-[11px] font-semibold uppercase tracking-[0.17em] text-white/60">
                  {member.role}
                </span>
              </div>

              <h2 className="mt-2 text-2xl font-bold tracking-tight">{member.name}</h2>
              <p className="mt-1 text-sm text-white/80">{member.title}</p>
              <p className="mt-1 text-xs uppercase tracking-[0.16em] text-white/55">{member.branch} • {member.year}</p>
              <p className="mt-4 text-sm leading-6 text-white/72">{member.bio}</p>

              {member.focus && member.focus.length > 0 && (
                <div className="mt-4">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-white/60">Focus</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {member.focus.map((item) => (
                      <span
                        key={item}
                        className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.13em] text-white/82"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {member.strengths && member.strengths.length > 0 && (
                <div className="mt-4">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-white/60">Strengths</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {member.strengths.map((item) => (
                      <span
                        key={item}
                        className="rounded-full border border-white/15 bg-black/30 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.13em] text-white/75"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-5 flex flex-col gap-2.5 sm:flex-row sm:flex-wrap sm:items-center md:justify-start">
                <MemberLinkButton href={member.projectLink} label="Project" />
                <MemberLinkButton href={member.githubUrl} label="GitHub" />
                <MemberLinkButton href={member.linkedinUrl} label="LinkedIn" />
                <MemberLinkButton href={member.leetcodeUrl} label="LeetCode" />
                <MemberLinkButton href={member.portfolioUrl} label="Portfolio" />
              </div>

              <p className="mt-4 text-xs font-semibold uppercase tracking-[0.16em] text-[#ffadb9]">
                Click to open profile
              </p>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
