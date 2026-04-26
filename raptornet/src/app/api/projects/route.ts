import { NextResponse } from "next/server";
import {
  cleanString,
  cleanUrl,
  getAuthedProjectActor,
  getViewerId,
  isProjectStatus,
  normalizeStringList,
  ProjectDoc,
  toProjectResponse,
} from "@/lib/projectCollab";
import { getDb } from "@/lib/mongodb";

export const runtime = "nodejs";

export async function GET() {
  try {
    const db = await getDb();
    const viewerId = await getViewerId();

    const docs = (await db
      .collection<ProjectDoc>("projects")
      .find({})
      .sort({ createdAt: -1 })
      .limit(200)
      .toArray()) as ProjectDoc[];

    return NextResponse.json(docs.map((project) => toProjectResponse(project, viewerId)), {
      status: 200,
    });
  } catch (error) {
    console.error("Projects fetch error:", error);
    return NextResponse.json({ message: "Failed to load projects." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const authResult = await getAuthedProjectActor();

    if (!authResult) {
      return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
    }

    const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;

    const title = cleanString(body.title, 120);
    const description = cleanString(body.description, 1200);
    const techStack = normalizeStringList(body.techStack, 12, 40);
    const githubLink = cleanUrl(body.githubLink, 280);
    const liveLink = cleanUrl(body.liveLink, 280);

    const rawStatus = cleanString(body.status, 20);
    const status = isProjectStatus(rawStatus) ? rawStatus : "idea";

    const progressCandidate = Number(body.progress ?? 0);
    const progress = Number.isFinite(progressCandidate)
      ? Math.max(0, Math.min(100, Math.round(progressCandidate)))
      : 0;

    const openRoles = normalizeStringList(body.openRoles, 10, 60);
    const maxTeamSizeCandidate = Number(body.maxTeamSize ?? 5);
    const maxTeamSize = Number.isFinite(maxTeamSizeCandidate)
      ? Math.max(1, Math.min(20, Math.round(maxTeamSizeCandidate)))
      : 5;

    if (!title || !description) {
      return NextResponse.json(
        { message: "Title and description are required." },
        { status: 400 }
      );
    }

    if (!githubLink && !liveLink) {
      return NextResponse.json(
        { message: "Add at least one link (GitHub or Live)." },
        { status: 400 }
      );
    }

    const now = new Date();
    const starterTeam = [
      {
        userId: authResult.actor.userId,
        memberId: authResult.actor.memberId,
        name: authResult.actor.name,
        email: authResult.actor.email,
      },
    ];

    const createdBy = {
      accountId: authResult.actor.userId,
      memberId: authResult.actor.memberId,
      name: authResult.actor.name,
      email: authResult.actor.email,
      linkedin: authResult.actor.linkedin,
    };

    const insertResult = await authResult.db.collection("projects").insertOne({
      title,
      description,
      techStack,
      teamMembers: starterTeam,
      githubLink,
      liveLink,
      status,
      progress,
      createdBy,
      openRoles,
      buildLog: [],
      joinRequests: [],
      maxTeamSize,
      collaborationClosed: false,
      createdAt: now,
      updatedAt: now,
    });

    const saved = await authResult.db
      .collection<ProjectDoc>("projects")
      .findOne({ _id: insertResult.insertedId });

    if (!saved) {
      return NextResponse.json({ message: "Failed to save project." }, { status: 500 });
    }

    return NextResponse.json(toProjectResponse(saved, authResult.actor.userId), { status: 201 });
  } catch (error) {
    console.error("Projects create error:", error);
    return NextResponse.json({ message: "Failed to create project." }, { status: 500 });
  }
}
