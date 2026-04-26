import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";
import {
  BuildLogEntry,
  cleanString,
  getAuthedProjectActor,
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

    const body = (await request.json().catch(() => ({}))) as { text?: string };
    const text = cleanString(body.text, 360);

    if (!text) {
      return NextResponse.json({ message: "Update text is required." }, { status: 400 });
    }

    const projectsCollection = authResult.db.collection<ProjectDoc>("projects");
    const project = await projectsCollection.findOne({ _id: new ObjectId(id) });

    if (!project) {
      return NextResponse.json({ message: "Project not found." }, { status: 404 });
    }

    const teamMembers = Array.isArray(project.teamMembers) ? project.teamMembers : [];
    const currentBuildLog = Array.isArray(project.buildLog) ? project.buildLog : [];

    const isCreator = project.createdBy.accountId === authResult.actor.userId;
    const isTeamMember = teamMembers.some(
      (teamMember) => teamMember.userId === authResult.actor.userId
    );

    if (!isCreator && !isTeamMember) {
      return NextResponse.json({ message: "Only team members can post updates." }, { status: 403 });
    }

    const updateEntry: BuildLogEntry = {
      _id: new ObjectId(),
      userId: authResult.actor.userId,
      memberId: authResult.actor.memberId,
      authorName: authResult.actor.name,
      text,
      createdAt: new Date(),
    };

    const nextBuildLog = [updateEntry, ...currentBuildLog].slice(0, 100);

    await projectsCollection.updateOne(
      { _id: project._id },
      {
        $set: {
          buildLog: nextBuildLog,
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
    console.error("Build log create error:", error);
    return NextResponse.json({ message: "Failed to post update." }, { status: 500 });
  }
}
