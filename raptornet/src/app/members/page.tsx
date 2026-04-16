import Image from "next/image";
import Link from "next/link";
import { unstable_noStore as noStore } from "next/cache";
import Navbar from "@/components/Navbar";
import { getDb } from "@/lib/mongodb";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type Member = {
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

type MemberDoc = {
  _id: { toString(): string };
  name?: string;
  college?: string;
  branch?: string;
  role?: string;
  title?: string;
  status?: string;
  projectLink?: string;
  githubLink?: string;
  linkedinLink?: string;
  leetcodeLink?: string;
  approvedAt?: Date | string;
  createdAt?: Date | string;
};

const foundingMembers: Member[] = [
  {
    name: "J Krishna Prasad Goud",
    role: "Guild Founder",
    title: "Full Stack Web Developer (MERN)",
    branch: "Computer Science",
    year: "GNU",
    focus: ["Web Platforms", "Builder Community", "Mentorship"],
    strengths: ["React", "Next.js", "Node.js", "MongoDB", "Product Thinking"],
    image: "/kp.jpeg",
    status: "Founding",
    githubUrl: "https://github.com/KrishnaPrasad-dev/RaptorNet",
    linkedinUrl: "https://www.linkedin.com/in/krishnaprasad-webdev/",
    portfolioUrl: "https://krishnaprasad.space",
    bio: "Built RaptorNet as a vetted community for students who ship real work, prepare for internships, and compete through projects and hackathons.",
  },
];

const seatsToFill = [
  "AIML builder",
  "ECE systems builder",
  "Product-focused frontend builder",
  "Backend/API builder",
];

async function getApprovedMembers(): Promise<Member[]> {
  try {
    noStore();

    const db = await getDb();
    const docs = (await db
      .collection<MemberDoc>("members")
      .find({ status: "active" })
      .sort({ approvedAt: -1, createdAt: -1 })
      .toArray()) as MemberDoc[];

    return docs.map((member) => ({
      name: member.name ?? "Unnamed member",
      role: member.role ?? "Guild Member",
      title: member.title ?? "Builder",
      branch: member.branch ?? "Not specified",
      year: member.college ?? "GNU",
      status: "Active",
      projectLink: member.projectLink ?? "",
      githubUrl: member.githubLink ?? "",
      linkedinUrl: member.linkedinLink ?? "",
      leetcodeUrl: member.leetcodeLink ?? "",
      bio: "Accepted through the RaptorNet application review process and currently active in guild projects.",
    }));
  } catch (error) {
    console.error("Failed to load members:", error);
    return [];
  }
}

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

export default async function MembersPage() {
  const acceptedMembers = await getApprovedMembers();
  const members = [...foundingMembers, ...acceptedMembers];

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#05070b] text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_8%,rgba(255,255,255,0.08),transparent_24%),radial-gradient(circle_at_82%_86%,rgba(120,144,156,0.12),transparent_32%)]" />

      <section className="relative mx-auto w-full max-w-7xl px-4 pb-14 pt-3 sm:px-10 sm:pt-4 lg:px-12">
        <Navbar />

        <div className="rn-reveal mt-8 rounded-[2rem] border border-white/8 bg-white/[0.03] p-5 sm:mt-10 sm:p-8">
          <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-red-300/85">
            Current Members
          </p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
            Active builders in the guild
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-white/75">
            RaptorNet is open to students from any branch who genuinely want to build. CSE, AIML, ECE, and every other branch are welcome if the intent is real and the work is solid.
          </p>

          <div className="mt-7 flex flex-wrap items-center gap-3">
            <span className="rounded-full border border-white/15 bg-black/30 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-white/75">
              {members.length} listed member{members.length > 1 ? "s" : ""}
            </span>
            <Link
              href="/apply"
              className="rn-button rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-white/85 transition-colors duration-150 ease-out hover:border-[#7f1020] hover:bg-[#7f1020]/20"
            >
              Apply to join
            </Link>
          </div>
        </div>

        <section className="mt-5 grid gap-4 sm:mt-6 lg:grid-cols-[1.7fr_1fr]">
          <div className="rn-stagger space-y-4">
            {members.map((member, index) => (
              <article
                key={`${member.name}-${index}`}
                className="rn-card rounded-[1.7rem] border border-white/10 bg-[linear-gradient(150deg,rgba(255,255,255,0.05),rgba(10,12,18,0.92))] p-5 sm:p-6"
              >
                <div className="grid gap-5 md:grid-cols-[150px_1fr] md:items-start">
                  <ProfileAvatar member={member} />

                  <div>
                    <div className="flex flex-wrap items-center gap-2.5">
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

                    <div className="mt-5 flex flex-wrap items-center gap-2.5">
                      {member.projectLink && (
                        <a
                          href={member.projectLink}
                          target="_blank"
                          rel="noreferrer"
                          className="rounded-full border border-white/15 bg-transparent px-4 py-2.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-white/80 transition-colors duration-150 ease-out hover:border-[#7f1020] hover:text-white"
                        >
                          Project
                        </a>
                      )}
                      {member.githubUrl && (
                        <a
                          href={member.githubUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="rounded-full border border-white/15 bg-transparent px-4 py-2.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-white/80 transition-colors duration-150 ease-out hover:border-[#7f1020] hover:text-white"
                        >
                          GitHub
                        </a>
                      )}
                      {member.linkedinUrl && (
                        <a
                          href={member.linkedinUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="rounded-full border border-white/15 bg-transparent px-4 py-2.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-white/80 transition-colors duration-150 ease-out hover:border-[#7f1020] hover:text-white"
                        >
                          LinkedIn
                        </a>
                      )}
                      {member.leetcodeUrl && (
                        <a
                          href={member.leetcodeUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="rounded-full border border-white/15 bg-transparent px-4 py-2.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-white/80 transition-colors duration-150 ease-out hover:border-[#7f1020] hover:text-white"
                        >
                          LeetCode
                        </a>
                      )}
                      {member.portfolioUrl && (
                        <a
                          href={member.portfolioUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="rounded-full border border-white/15 bg-transparent px-4 py-2.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-white/80 transition-colors duration-150 ease-out hover:border-[#7f1020] hover:text-white"
                        >
                          Portfolio
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <aside className="rn-reveal rn-delay-2 rounded-[1.7rem] border border-white/10 bg-black/30 p-5 sm:p-6">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/62">
              Open Builder Seats
            </p>
            <p className="mt-3 text-sm leading-6 text-white/72">
              We are expanding with members from multiple branches. If you build consistently, you belong here.
            </p>

            <div className="mt-4 space-y-2.5">
              {seatsToFill.map((seat) => (
                <div
                  key={seat}
                  className="rn-card flex items-center justify-between rounded-xl border border-white/10 bg-black/35 px-3.5 py-2.5 transition-colors duration-150 ease-out hover:border-[#7f1020] hover:bg-[#7f1020]/10"
                >
                  <span className="text-sm text-white/84">{seat}</span>
                  <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-white/45">Open</span>
                </div>
              ))}
            </div>

            <Link
              href="/apply"
              className="rn-button mt-5 inline-flex rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-white/85 transition-colors duration-150 ease-out hover:border-[#7f1020] hover:bg-[#7f1020]/20"
            >
              Submit profile
            </Link>
          </aside>
        </section>
      </section>
    </main>
  );
}
