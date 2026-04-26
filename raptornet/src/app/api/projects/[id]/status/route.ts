import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";
import {
  cleanString,
  getAuthedProjectActor,
  isProjectStatus,
  ProjectDoc,
  toProjectResponse,
} from "@/lib/projectCollab";

export const runtime = "nodejs";

export async function PATCH(
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

    const body = (await request.json().catch(() => ({}))) as {
      status?: string;
      collaborationClosed?: boolean;
      maxTeamSize?: number;
    };

    const statusValue = cleanString(body.status, 20);
    if (!isProjectStatus(statusValue)) {
      return NextResponse.json({ message: "Invalid status value." }, { status: 400 });
    }

    const projectsCollection = authResult.db.collection<ProjectDoc>("projects");
    const project = await projectsCollection.findOne({ _id: new ObjectId(id) });

    if (!project) {
      return NextResponse.json({ message: "Project not found." }, { status: 404 });
    }

    if (project.createdBy.accountId !== authResult.actor.userId) {
      return NextResponse.json({ message: "Only creator can change status." }, { status: 403 });
    }

    const manualClosed = Boolean(body.collaborationClosed);
    const teamMembers = Array.isArray(project.teamMembers) ? project.teamMembers : [];
    const maxTeamSizeCandidate = Number(body.maxTeamSize);
    const maxTeamSize = Number.isFinite(maxTeamSizeCandidate)
      ? Math.max(1, Math.min(20, Math.round(maxTeamSizeCandidate)))
      : Number.isFinite(project.maxTeamSize)
        ? project.maxTeamSize
        : 5;

    const shouldAutoClose = manualClosed || teamMembers.length >= maxTeamSize;

    await projectsCollection.updateOne(
      { _id: project._id },
      {
        $set: {
          status: statusValue,
          maxTeamSize,
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
    console.error("Project status update error:", error);
    return NextResponse.json({ message: "Failed to update status." }, { status: 500 });
  }
}
