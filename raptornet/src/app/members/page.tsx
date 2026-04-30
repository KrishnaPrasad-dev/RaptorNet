import Link from "next/link";
import { unstable_noStore as noStore } from "next/cache";
import Navbar from "@/components/Navbar";
import { getDb } from "@/lib/mongodb";
import MembersCardsClient from "@/components/MembersCardsClient";
import MagneticLink from "@/components/MagneticLink";
import MembersVettedBadge from "@/components/MembersVettedBadge";

export const dynamic = "force-dynamic";
export const revalidate = 0;

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

type MemberDoc = {
  _id: { toString(): string };
  name?: string;
  image?: string;
  college?: string;
  branch?: string;
  role?: string;
  title?: string;
  bio?: string;
  status?: string;
  projectLink?: string;
  githubLink?: string;
  linkedinLink?: string;
  leetcodeLink?: string;
  approvedAt?: Date | string;
  createdAt?: Date | string;
};


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
      id: member._id.toString(),
      name: member.name ?? "Unnamed member",
      role: member.role ?? "Guild Member",
      title: member.title ?? "Builder",
      branch: member.branch ?? "Not specified",
      year: member.college ?? "GNU",
      status: "Active",
      image: member.image ?? "",
      projectLink: member.projectLink ?? "",
      githubUrl: member.githubLink ?? "",
      linkedinUrl: member.linkedinLink ?? "",
      leetcodeUrl: member.leetcodeLink ?? "",
      bio: member.bio ?? "Accepted through the RaptorNet application review process and currently active in guild projects.",
    }));
  } catch (error) {
    console.error("Failed to load members:", error);
    return [];
  }
}

export default async function MembersPage() {
  const members = await getApprovedMembers();

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
            <MembersVettedBadge total={members.length} />
            <MagneticLink
              href="/apply"
              className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-white/85 transition-colors duration-150 ease-out hover:border-[#7f1020] hover:bg-[#7f1020]/20"
            >
              Apply to join
            </MagneticLink>
          </div>
        </div>

        <section className="mt-5 sm:mt-6">
          <MembersCardsClient members={members} />
        </section>
      </section>
    </main>
  );
}
