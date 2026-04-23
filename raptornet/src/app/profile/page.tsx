import { redirect } from "next/navigation";
import Navbar from "@/components/Navbar";
import UserProfileClient from "@/components/UserProfileClient";
import LetterGlitch from "@/components/LetterGlitch";
import { getDb } from "@/lib/mongodb";
import { getAuthenticatedMemberSession } from "@/lib/memberAuth";
import { ObjectId } from "mongodb";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type MemberAccountDoc = {
  _id: ObjectId;
  email?: string;
  name?: string;
  memberId?: string;
};

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
  resumeLink?: string;
  projectLink?: string;
  githubLink?: string;
  linkedinLink?: string;
  leetcodeLink?: string;
  phoneNumber?: string;
};

async function getProfile() {
  const session = await getAuthenticatedMemberSession();

  if (!session?.sub || !ObjectId.isValid(session.sub)) {
    redirect("/login");
  }

  const db = await getDb();
  const account = await db
    .collection<MemberAccountDoc>("member_accounts")
    .findOne({ _id: new ObjectId(session.sub) });

  if (!account) {
    redirect("/login");
  }

  let member: MemberDoc | null = null;

  if (account.memberId && ObjectId.isValid(account.memberId)) {
    member = await db
      .collection<MemberDoc>("members")
      .findOne({ _id: new ObjectId(account.memberId) });
  }

  if (!member && account.email) {
    member = await db
      .collection<MemberDoc>("members")
      .findOne({ email: account.email.toLowerCase() });
  }

  if (!member) {
    return null;
  }

  return {
    id: member._id.toString(),
    accountId: account._id.toString(),
    name: member.name ?? account.name ?? "",
    email: member.email ?? account.email ?? "",
    college: member.college ?? "",
    branch: member.branch ?? "",
    role: member.role ?? "Guild Member",
    title: member.title ?? "Builder",
    bio: member.bio ?? "",
    skills: member.skills ?? [],
    resumeLink: member.resumeLink ?? "",
    projectLink: member.projectLink ?? "",
    githubLink: member.githubLink ?? "",
    linkedinLink: member.linkedinLink ?? "",
    leetcodeLink: member.leetcodeLink ?? "",
    phoneNumber: member.phoneNumber ?? "",
  };
}

export default async function ProfilePage() {
  const profile = await getProfile();

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

        {profile ? (
          <UserProfileClient profile={profile} />
        ) : (
          <div className="rn-reveal mt-8 rounded-[1.7rem] border border-white/10 bg-black/30 p-6 text-sm text-white/75">
            Could not find a profile for your account yet. Contact admin if your application was recently accepted.
          </div>
        )}
      </section>
    </main>
  );
}
