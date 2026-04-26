import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";
import {
  cleanString,
  getAuthedProjectActor,
  isTeamOpen,
  JoinRequest,
  ProjectDoc,
  toProjectResponse,
} from "@/lib/projectCollab";

export const runtime = "nodejs";

export async function POST(
  request: Request,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const authResult = await getAuthedProjectActor();
    if (!authResult) {
      return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
    }

    const { id } = await props.params;
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ message: "Invalid project id." }, { status: 400 });
    }

    const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;
    const message = cleanString(body.message, 500);

    if (!message) {
      return NextResponse.json({ message: "Join message is required." }, { status: 400 });
    }

    const projectsCollection = authResult.db.collection<ProjectDoc>("projects");
    const project = await projectsCollection.findOne({ _id: new ObjectId(id) });

    if (!project) {
      return NextResponse.json({ message: "Project not found." }, { status: 404 });
    }

    if (project.createdBy.accountId === authResult.actor.userId) {
      return NextResponse.json({ message: "You already own this project." }, { status: 400 });
    }

    const teamMembers = Array.isArray(project.teamMembers) ? project.teamMembers : [];
    const joinRequests = Array.isArray(project.joinRequests) ? project.joinRequests : [];

    if (!isTeamOpen({ ...project, teamMembers, joinRequests } as ProjectDoc)) {
      return NextResponse.json({ message: "Team is closed for this project." }, { status: 400 });
    }

    if (teamMembers.some((member) => member.userId === authResult.actor.userId)) {
      return NextResponse.json({ message: "You are already in this team." }, { status: 400 });
    }

    const existing = joinRequests.find(
      (joinRequest) =>
        joinRequest.userId === authResult.actor.userId && joinRequest.status === "pending"
    );

    if (existing) {
      return NextResponse.json({ message: "You already requested to join." }, { status: 409 });
    }

    const joinRequest: JoinRequest = {
      _id: new ObjectId(),
      userId: authResult.actor.userId,
      memberId: authResult.actor.memberId,
      name: authResult.actor.name,
      email: authResult.actor.email,
      message,
      status: "pending",
      createdAt: new Date(),
    };

    const updatedJoinRequests = [...joinRequests, joinRequest];

    await projectsCollection.updateOne(
      { _id: project._id },
      {
        $set: {
          joinRequests: updatedJoinRequests,
          updatedAt: new Date(),
        },
      }
    );

    const updatedProject = await projectsCollection.findOne({ _id: project._id });

    if (!updatedProject) {
      return NextResponse.json({ message: "Project not found after update." }, { status: 404 });
    }

    return NextResponse.json(toProjectResponse(updatedProject, authResult.actor.userId), {
      status: 201,
    });
  } catch (error) {
    console.error("Join request error:", error);
    return NextResponse.json({ message: "Failed to submit join request." }, { status: 500 });
  }
}
