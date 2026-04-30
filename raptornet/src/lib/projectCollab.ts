import { ObjectId } from "mongodb";
import { getDb } from "@/lib/mongodb";
import { getAuthenticatedMemberSession, normalizeEmail } from "@/lib/memberAuth";

export const PROJECT_STATUSES = [
  "idea",
  "building",
  "needs-help",
  "submitting",
  "shipped",
] as const;

export type ProjectStatus = (typeof PROJECT_STATUSES)[number];

export type TeamMember = {
  userId: string;
  memberId: string;
  name: string;
  email: string;
};

export type JoinRequest = {
  _id: ObjectId;
  userId: string;
  memberId: string;
  name: string;
  email: string;
  message: string;
  status: "pending" | "accepted" | "rejected";
  createdAt: Date;
};

export type BuildLogEntry = {
  _id: ObjectId;
  userId: string;
  memberId: string;
  authorName: string;
  text: string;
  createdAt: Date;
};

export type ProjectDoc = {
  _id: ObjectId;
  title: string;
  description: string;
  techStack: string[];
  teamMembers: TeamMember[];
  githubLink: string;
  liveLink: string;
  status: ProjectStatus;
  progress: number;
  createdBy: {
    accountId: string;
    memberId: string;
    name: string;
    email: string;
    linkedin: string;
  };
  openRoles: string[];
  buildLog: BuildLogEntry[];
  joinRequests: JoinRequest[];
  maxTeamSize: number;
  collaborationClosed: boolean;
  createdAt: Date;
  updatedAt: Date;
};

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
  linkedinLink?: string;
  bio?: string;
  skills?: string[];
};

export function cleanString(value: unknown, maxLength = 400) {
  if (typeof value !== "string") {
    return "";
  }

  return value.trim().slice(0, maxLength);
}

export function normalizeStringList(value: unknown, maxItems = 12, maxLength = 40) {
  if (Array.isArray(value)) {
    return value
      .map((item) => cleanString(item, maxLength))
      .filter(Boolean)
      .slice(0, maxItems);
  }

  if (typeof value === "string") {
    return value
      .split(",")
      .map((item) => cleanString(item, maxLength))
      .filter(Boolean)
      .slice(0, maxItems);
  }

  return [] as string[];
}

export function cleanUrl(value: unknown, maxLength = 300) {
  const cleaned = cleanString(value, maxLength);
  if (!cleaned) {
    return "";
  }

  if (!/^https?:\/\//i.test(cleaned)) {
    return "";
  }

  return cleaned;
}

export function isProjectStatus(value: string): value is ProjectStatus {
  return (PROJECT_STATUSES as readonly string[]).includes(value);
}

export function isTeamOpen(project: ProjectDoc) {
  const teamMembers = Array.isArray(project.teamMembers) ? project.teamMembers : [];
  const maxTeamSize = Number.isFinite(project.maxTeamSize) ? project.maxTeamSize : 5;
  return !Boolean(project.collaborationClosed) && teamMembers.length < maxTeamSize;
}

export function toProjectResponse(project: ProjectDoc, viewerId?: string) {
  const teamMembers = Array.isArray(project.teamMembers)
    ? project.teamMembers.map((member, index) => {
        if (typeof member === "string") {
          return {
            userId: `legacy-${index}`,
            memberId: "",
            name: member,
            email: "",
          };
        }

        return {
          userId: cleanString((member as TeamMember).userId, 60),
          memberId: cleanString((member as TeamMember).memberId, 60),
          name: cleanString((member as TeamMember).name, 80) || "Guild Member",
          email: cleanString((member as TeamMember).email, 120),
        };
      })
    : [];
  const joinRequests = Array.isArray(project.joinRequests) ? project.joinRequests : [];
  const openRoles = Array.isArray(project.openRoles) ? project.openRoles : [];
  const buildLog = Array.isArray(project.buildLog) ? project.buildLog : [];
  const maxTeamSize = Number.isFinite(project.maxTeamSize) ? project.maxTeamSize : 5;
  const status = isProjectStatus(project.status) ? project.status : "idea";
  const progress = Number.isFinite(project.progress) ? project.progress : 0;
  const isCreator = Boolean(viewerId && viewerId === project.createdBy.accountId);
  const isOpen = isTeamOpen(project);

  return {
    id: project._id.toString(),
    title: project.title,
    description: project.description,
    techStack: project.techStack,
    teamMembers,
    githubLink: project.githubLink,
    liveLink: project.liveLink,
    status,
    progress,
    createdBy: project.createdBy,
    openRoles,
    buildLog,
    maxTeamSize,
    teamOpen: isOpen,
    collaborationClosed: Boolean(project.collaborationClosed),
    joinRequestCount: joinRequests.filter((request) => request.status === "pending").length,
    pendingJoinRequests: isCreator
      ? joinRequests.filter((request) => request.status === "pending")
      : [],
    createdAt: project.createdAt,
    updatedAt: project.updatedAt,
  };
}

export async function getViewerId() {
  const session = await getAuthenticatedMemberSession();
  if (!session?.sub || !ObjectId.isValid(session.sub)) {
    return "";
  }

  return session.sub;
}

export async function getAuthedProjectActor() {
  const session = await getAuthenticatedMemberSession();

  if (!session?.sub || !ObjectId.isValid(session.sub)) {
    return null;
  }

  const db = await getDb();
  const account = await db
    .collection<MemberAccountDoc>("member_accounts")
    .findOne({ _id: new ObjectId(session.sub) });

  if (!account) {
    return null;
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
      .findOne({ email: normalizeEmail(account.email) });
  }

  const userId = account._id.toString();
  const memberId = member?._id?.toString() ?? account.memberId ?? "";
  const email = normalizeEmail(account.email ?? member?.email ?? "");
  const name = cleanString(member?.name ?? account.name ?? "", 80) || "Guild Member";

  return {
    db,
    account,
    member,
    actor: {
      userId,
      memberId,
      email,
      name,
      linkedin: cleanUrl(member?.linkedinLink ?? "", 240),
    },
  };
}
