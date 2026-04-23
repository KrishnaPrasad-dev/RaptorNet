import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { getAuthenticatedMemberSession } from "@/lib/memberAuth";

export const runtime = "nodejs";

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
  status?: string;
  canSignup?: boolean;
};

type ProfilePayload = {
  name?: string;
  role?: string;
  title?: string;
  college?: string;
  branch?: string;
  bio?: string;
  skills?: string[];
  resumeLink?: string;
  projectLink?: string;
  githubLink?: string;
  linkedinLink?: string;
  leetcodeLink?: string;
  phoneNumber?: string;
};

function cleanString(value: unknown, maxLength = 400) {
  if (typeof value !== "string") {
    return "";
  }

  return value.trim().slice(0, maxLength);
}

function normalizeSkills(value: unknown) {
  if (Array.isArray(value)) {
    return value
      .map((item) => cleanString(item, 40))
      .filter(Boolean)
      .slice(0, 20);
  }

  if (typeof value === "string") {
    return value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean)
      .slice(0, 20);
  }

  return [] as string[];
}

function profileResponse(member: MemberDoc, account: MemberAccountDoc) {
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

async function getAuthedDocs() {
  const session = await getAuthenticatedMemberSession();

  if (!session?.sub || !ObjectId.isValid(session.sub)) {
    return { error: NextResponse.json({ message: "Unauthorized." }, { status: 401 }) };
  }

  const db = await getDb();
  const accountsCollection = db.collection<MemberAccountDoc>("member_accounts");
  const membersCollection = db.collection<MemberDoc>("members");

  const account = await accountsCollection.findOne({ _id: new ObjectId(session.sub) });

  if (!account) {
    return { error: NextResponse.json({ message: "Unauthorized." }, { status: 401 }) };
  }

  let member: MemberDoc | null = null;

  if (account.memberId && ObjectId.isValid(account.memberId)) {
    member = await membersCollection.findOne({ _id: new ObjectId(account.memberId) });
  }

  if (!member && account.email) {
    member = await membersCollection.findOne({ email: account.email.toLowerCase() });
  }

  if (!member) {
    return {
      error: NextResponse.json(
        { message: "Profile record not found for this account." },
        { status: 404 }
      ),
    };
  }

  return { db, account, member };
}

export async function GET() {
  try {
    const result = await getAuthedDocs();

    if ("error" in result) {
      return result.error;
    }

    return NextResponse.json(profileResponse(result.member, result.account), { status: 200 });
  } catch (error) {
    console.error("Failed to fetch profile:", error);
    return NextResponse.json({ message: "Failed to load profile." }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const result = await getAuthedDocs();

    if ("error" in result) {
      return result.error;
    }

    const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;

    const payload: ProfilePayload = {
      name: cleanString(body.name, 80),
      role: cleanString(body.role, 80),
      title: cleanString(body.title, 120),
      college: cleanString(body.college, 120),
      branch: cleanString(body.branch, 120),
      bio: cleanString(body.bio, 600),
      skills: normalizeSkills(body.skills),
      resumeLink: cleanString(body.resumeLink, 300),
      projectLink: cleanString(body.projectLink, 300),
      githubLink: cleanString(body.githubLink, 200),
      linkedinLink: cleanString(body.linkedinLink, 200),
      leetcodeLink: cleanString(body.leetcodeLink, 200),
      phoneNumber: cleanString(body.phoneNumber, 40),
    };

    const membersCollection = result.db.collection<MemberDoc>("members");
    const accountsCollection = result.db.collection<MemberAccountDoc>("member_accounts");

    await membersCollection.updateOne(
      { _id: result.member._id },
      {
        $set: {
          name: payload.name || result.member.name || result.account.name || "",
          email: result.account.email?.toLowerCase() ?? result.member.email ?? "",
          role: payload.role || result.member.role || "Guild Member",
          title: payload.title || result.member.title || "Builder",
          college: payload.college,
          branch: payload.branch,
          bio: payload.bio,
          skills: payload.skills,
          resumeLink: payload.resumeLink,
          projectLink: payload.projectLink,
          githubLink: payload.githubLink,
          linkedinLink: payload.linkedinLink,
          leetcodeLink: payload.leetcodeLink,
          phoneNumber: payload.phoneNumber,
          status: result.member.status ?? "active",
          canSignup: result.member.canSignup ?? true,
          updatedAt: new Date(),
        },
      }
    );

    if (payload.name) {
      await accountsCollection.updateOne(
        { _id: result.account._id },
        {
          $set: {
            name: payload.name,
          },
        }
      );
    }

    const updatedMember = await membersCollection.findOne({ _id: result.member._id });

    if (!updatedMember) {
      return NextResponse.json({ message: "Profile not found after update." }, { status: 404 });
    }

    return NextResponse.json(profileResponse(updatedMember, result.account), { status: 200 });
  } catch (error) {
    console.error("Failed to update profile:", error);
    return NextResponse.json({ message: "Failed to update profile." }, { status: 500 });
  }
}
