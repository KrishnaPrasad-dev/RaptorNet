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

  let icon = null;
  if (label === "GitHub") {
    icon = (
      <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.477 2 2 6.484 2 12.021c0 4.428 2.865 8.184 6.839 9.504.5.092.682-.217.682-.483 0-.237-.009-.868-.014-1.703-2.782.605-3.369-1.342-3.369-1.342-.454-1.154-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.004.07 1.532 1.032 1.532 1.032.892 1.53 2.341 1.089 2.91.833.091-.647.35-1.089.636-1.34-2.221-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.295 2.748-1.025 2.748-1.025.546 1.378.202 2.397.1 2.65.64.7 1.028 1.595 1.028 2.688 0 3.847-2.337 4.695-4.566 4.944.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.749 0 .268.18.579.688.481C19.138 20.203 22 16.447 22 12.021 22 6.484 17.523 2 12 2z"/></svg>
    );
  } else if (label === "LinkedIn") {
    icon = (
      <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.76 0-5 2.24-5 5v14c0 2.76 2.24 5 5 5h14c2.76 0 5-2.24 5-5v-14c0-2.76-2.24-5-5-5zm-11 19h-3v-10h3v10zm-1.5-11.28c-.966 0-1.75-.79-1.75-1.76s.784-1.76 1.75-1.76 1.75.79 1.75 1.76-.784 1.76-1.75 1.76zm13.5 11.28h-3v-5.6c0-1.34-.03-3.07-1.87-3.07-1.87 0-2.16 1.46-2.16 2.97v5.7h-3v-10h2.89v1.36h.04c.4-.76 1.38-1.56 2.84-1.56 3.04 0 3.6 2 3.6 4.59v5.61z"/></svg>
    );
  } else if (label === "Portfolio") {
    icon = (
      <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
    );
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      onClick={(event) => event.stopPropagation()}
      className="inline-flex w-full items-center justify-center rounded-full border border-white/15 bg-transparent px-4 py-2.5 text-[13px] font-semibold uppercase tracking-[0.14em] text-white/80 transition-colors duration-150 ease-out hover:border-[#7f1020] hover:text-white sm:w-auto"
    >
      {icon}
      {label}
    </a>
  );
}

export default function MembersCardsClient({ members }: { members: Member[] }) {
  const router = useRouter();

  return (
    <div className="rn-stagger flex flex-col gap-10 w-full">
      {members.map((member) => (
        <article
          key={member.id}
          className="rn-card cursor-pointer w-full rounded-[2rem] border border-white/10 bg-[linear-gradient(150deg,rgba(255,255,255,0.05),rgba(10,12,18,0.92))] p-10 shadow-2xl transition-colors duration-150 ease-out hover:border-[#7f1020]/65 hover:shadow-2xl hover:scale-[1.01] focus:scale-[1.01] focus:shadow-2xl outline-none"
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
          <div className="flex flex-col md:flex-row gap-10 text-center md:text-left items-center md:items-start w-full">
            <ProfileAvatar member={member} />

            <div className="flex flex-col h-full justify-between w-full">
              <div className="flex flex-wrap items-center justify-center gap-4 md:justify-start">
                <span className="rounded-full border border-[#7f1020]/70 bg-[#7f1020]/20 px-5 py-1 text-[13px] font-bold uppercase tracking-[0.16em] text-[#ffb9c4]">
                  {member.status}
                </span>
                <span className="text-[14px] font-semibold uppercase tracking-[0.17em] text-white/60">
                  {member.role}
                </span>
              </div>

              <h2 className="mt-4 text-3xl font-bold tracking-tight break-words">{member.name}</h2>
              <p className="mt-2 text-lg text-white/80 break-words">{member.title}</p>
              <p className="mt-2 text-base uppercase tracking-[0.16em] text-white/55 break-words">{member.branch} • {member.year}</p>

              <div className="mt-6 flex flex-wrap gap-4 w-full">
                <MemberLinkButton href={member.githubUrl} label="GitHub" />
                <MemberLinkButton href={member.linkedinUrl} label="LinkedIn" />
                <MemberLinkButton href={member.portfolioUrl} label="Portfolio" />
              </div>

              {member.focus && member.focus.length > 0 && (
                <div className="mt-6">
                  <p className="text-[12px] font-semibold uppercase tracking-[0.15em] text-white/60">Focus</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {member.focus.map((item) => (
                      <span
                        key={item}
                        className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[12px] font-semibold uppercase tracking-[0.13em] text-white/82"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {member.strengths && member.strengths.length > 0 && (
                <div className="mt-6">
                  <p className="text-[12px] font-semibold uppercase tracking-[0.15em] text-white/60">Strengths</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {member.strengths.map((item) => (
                      <span
                        key={item}
                        className="rounded-full border border-white/15 bg-black/30 px-3 py-1 text-[12px] font-semibold uppercase tracking-[0.13em] text-white/75"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <p className="mt-8 text-lg leading-8 text-white/80 w-full text-center md:text-left break-words">{member.bio}</p>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
