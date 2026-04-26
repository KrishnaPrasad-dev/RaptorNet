import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";
import {
  getAuthedProjectActor,
  isTeamOpen,
  ProjectDoc,
  TeamMember,
  toProjectResponse,
} from "@/lib/projectCollab";

export const runtime = "nodejs";

export async function PATCH(
  request: Request,
  props: { params: Promise<{ id: string; requestId: string }> }
) {
  try {
    const authResult = await getAuthedProjectActor();
    if (!authResult) {
      return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
    }

    const { id, requestId } = await props.params;
    if (!ObjectId.isValid(id) || !ObjectId.isValid(requestId)) {
      return NextResponse.json({ message: "Invalid id." }, { status: 400 });
    }

    const body = (await request.json().catch(() => ({}))) as { action?: string };
    const action = body.action === "accept" || body.action === "reject" ? body.action : "";

    if (!action) {
      return NextResponse.json({ message: "Action must be accept or reject." }, { status: 400 });
    }

    const projectsCollection = authResult.db.collection<ProjectDoc>("projects");
    const project = await projectsCollection.findOne({ _id: new ObjectId(id) });

    if (!project) {
      return NextResponse.json({ message: "Project not found." }, { status: 404 });
    }

    if (project.createdBy.accountId !== authResult.actor.userId) {
      return NextResponse.json({ message: "Only creator can manage requests." }, { status: 403 });
    }

    const joinRequests = Array.isArray(project.joinRequests) ? project.joinRequests : [];
    const teamMembers = Array.isArray(project.teamMembers) ? project.teamMembers : [];
    const maxTeamSize = Number.isFinite(project.maxTeamSize) ? project.maxTeamSize : 5;
    const collaborationClosed = Boolean(project.collaborationClosed);

    const joinRequestIndex = joinRequests.findIndex(
      (joinRequest) => joinRequest._id.toString() === requestId
    );

    if (joinRequestIndex < 0) {
      return NextResponse.json({ message: "Join request not found." }, { status: 404 });
    }

    const joinRequest = joinRequests[joinRequestIndex];
    if (joinRequest.status !== "pending") {
      return NextResponse.json({ message: "Request already handled." }, { status: 409 });
    }

    const updatedJoinRequests = [...joinRequests];
    updatedJoinRequests[joinRequestIndex] = {
      ...joinRequest,
      status: action === "accept" ? "accepted" : "rejected",
    };

    let updatedTeamMembers = [...teamMembers];

    if (action === "accept") {
      if (!isTeamOpen({ ...project, teamMembers, maxTeamSize, collaborationClosed } as ProjectDoc)) {
        return NextResponse.json({ message: "Team is closed." }, { status: 400 });
      }

      if (!updatedTeamMembers.some((member) => member.userId === joinRequest.userId)) {
        const newMember: TeamMember = {
          userId: joinRequest.userId,
          memberId: joinRequest.memberId,
          name: joinRequest.name,
          email: joinRequest.email,
        };
        updatedTeamMembers = [...updatedTeamMembers, newMember];
      }
    }

    const shouldAutoClose =
      collaborationClosed || updatedTeamMembers.length >= maxTeamSize;

    await projectsCollection.updateOne(
      { _id: project._id },
      {
        $set: {
          joinRequests: updatedJoinRequests,
          teamMembers: updatedTeamMembers,
          collaborationClosed: shouldAutoClose,
          updatedAt: new Date(),
        },
      }
    );

    const updatedProject = await projectsCollection.findOne({ _id: project._id });
    if (!updatedProject) {
      return NextResponse.json({ message: "Project not found after update." }, { status: 404 });
    }

    return NextResponse.json(toProjectResponse(updatedProject, authResult.actor.userId), {
      status: 200,
    });
  } catch (error) {
    console.error("Join request decision error:", error);
    return NextResponse.json({ message: "Failed to process request." }, { status: 500 });
  }
}
