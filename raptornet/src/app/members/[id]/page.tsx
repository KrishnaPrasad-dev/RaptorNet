import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ObjectId } from "mongodb";
import Navbar from "@/components/Navbar";
import LetterGlitch from "@/components/LetterGlitch";
import { getDb } from "@/lib/mongodb";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type MemberDoc = {
  _id: ObjectId;
  name?: string;
  email?: string;
  college?: string;
  branch?: string;
  role?: string;
  title?: string;
  bio?: string;
  skills?: string[];
  projectLink?: string;
  githubLink?: string;
  linkedinLink?: string;
  leetcodeLink?: string;
  status?: string;
};

const founderProfile = {
  id: "founder-krishna",
  name: "J Krishna Prasad Goud",
  title: "Full Stack Web Developer (MERN)",
  role: "Guild Admin",
  branch: "Computer Science",
  year: "GNU",
  status: "Core",
  image: "/kp.jpeg",
  bio: "Built RaptorNet as a vetted community for students who ship real work, prepare for internships, and compete through projects and hackathons.",
  skills: ["React", "Next.js", "Node.js", "MongoDB", "Product Thinking"],
  projectLink: "https://github.com/KrishnaPrasad-dev/RaptorNet",
  githubLink: "https://github.com/KrishnaPrasad-dev/RaptorNet",
  linkedinLink: "https://www.linkedin.com/in/krishnaprasad-webdev/",
  leetcodeLink: "",
};

function LinkButton({ href, label }: { href?: string; label: string }) {
  if (!href) {
    return null;
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="inline-flex w-full items-center justify-center rounded-full border border-white/15 bg-transparent px-4 py-2.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-white/80 transition-colors duration-150 ease-out hover:border-[#7f1020] hover:text-white sm:w-auto"
    >
      {label}
    </a>
  );
}

async function getMemberProfile(id: string) {
  if (id === founderProfile.id) {
    return founderProfile;
  }

  if (!ObjectId.isValid(id)) {
    return null;
  }

  const db = await getDb();
  const member = await db
    .collection<MemberDoc>("members")
    .findOne({ _id: new ObjectId(id), status: "active" });

  if (!member) {
    return null;
  }

  return {
    id: member._id.toString(),
    name: member.name ?? "Unnamed member",
    title: member.title ?? "Builder",
    role: member.role ?? "Guild Member",
    branch: member.branch ?? "Not specified",
    year: member.college ?? "GNU",
    status: "Active",
    image: "",
    bio:
      member.bio ??
      "Accepted through the RaptorNet application review process and currently active in guild projects.",
    skills: member.skills ?? [],
    projectLink: member.projectLink ?? "",
    githubLink: member.githubLink ?? "",
    linkedinLink: member.linkedinLink ?? "",
    leetcodeLink: member.leetcodeLink ?? "",
  };
}

export default async function MemberProfilePage(
  props: { params: Promise<{ id: string }> }
) {
  const { id } = await props.params;
  const member = await getMemberProfile(id);

  if (!member) {
    notFound();
  }

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

      <section className="relative z-10 mx-auto w-full max-w-7xl px-4 pb-14 pt-3 sm:px-10 sm:pt-4 lg:px-12">
        <Navbar />

        <section className="rn-reveal relative mx-auto mt-8 max-w-6xl overflow-hidden rounded-[2.2rem] border border-white/20 p-[1px] shadow-[0_30px_85px_rgba(0,0,0,0.45)] sm:mt-10">
          <div className="relative z-10 rounded-[2.05rem] border border-white/15 bg-[linear-gradient(145deg,rgba(16,20,28,0.9),rgba(10,12,18,0.86))] p-6 sm:p-8 lg:p-10">
            <div className="grid gap-8 md:grid-cols-[260px_1fr] md:items-start">
              <div className="flex flex-col items-center">
                {member.image ? (
                  <div className="relative h-40 w-40 overflow-hidden rounded-full border-4 border-[#7f1020]/70 shadow-[0_0_50px_rgba(127,16,32,0.35)] md:h-52 md:w-52">
                    <Image
                      src={member.image}
                      alt={`${member.name} avatar`}
                      fill
                      className="object-cover"
                      sizes="208px"
                    />
                  </div>
                ) : (
                  <div className="flex h-40 w-40 items-center justify-center overflow-hidden rounded-full border-4 border-[#7f1020]/70 bg-[linear-gradient(140deg,#2a0f15,#10131a)] text-6xl font-black text-white shadow-[0_0_50px_rgba(127,16,32,0.35)] md:h-52 md:w-52 md:text-7xl">
                    {member.name.slice(0, 1)}
                  </div>
                )}
                <span className="mt-4 rounded-full border border-white/10 bg-black/30 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.22em] text-white/70">
                  {member.branch}
                </span>
              </div>

              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-white/60">
                  Member Profile
                </p>
                <h1 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
                  {member.name}
                </h1>
                <p className="mt-2 text-lg font-medium text-white/80">
                  {member.title}
                </p>

                <div className="mt-4 inline-flex items-center rounded-full border border-white/10 bg-black/35 px-4 py-2 text-sm font-semibold uppercase tracking-[0.18em] text-white/80">
                  {member.role}
                </div>

                <p className="mt-6 max-w-2xl text-base leading-7 text-white/78">
                  {member.bio}
                </p>

                {member.skills.length > 0 && (
                  <div className="mt-7">
                    <h2 className="text-lg font-bold text-white/90">Skills</h2>
                    <div className="rn-stagger mt-3 flex flex-wrap gap-2.5">
                      {member.skills.map((skill) => (
                        <span
                          key={skill}
                          className="rn-card rounded-full border border-white/15 bg-black/35 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-white/75 transition-colors duration-150 ease-out hover:border-[#7f1020] hover:bg-[#7f1020]/10"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="mt-8 flex flex-wrap items-center gap-3">
                  <LinkButton href={member.projectLink} label="Project" />
                  <LinkButton href={member.githubLink} label="GitHub" />
                  <LinkButton href={member.linkedinLink} label="LinkedIn" />
                  <LinkButton href={member.leetcodeLink} label="LeetCode" />
                </div>

                <div className="mt-8">
                  <Link
                    href="/members"
                    className="text-sm font-semibold text-[#ff9fb0] transition-colors duration-150 ease-out hover:text-[#ffc1cd]"
                  >
                    Back to Members
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </section>
    </main>
  );
}
