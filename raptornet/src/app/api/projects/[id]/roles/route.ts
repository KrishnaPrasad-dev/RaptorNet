import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";
import {
  getAuthedProjectActor,
  normalizeStringList,
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

    const body = (await request.json().catch(() => ({}))) as { roles?: unknown };
    const roles = normalizeStringList(body.roles, 10, 60);

    const projectsCollection = authResult.db.collection<ProjectDoc>("projects");
    const project = await projectsCollection.findOne({ _id: new ObjectId(id) });

    if (!project) {
      return NextResponse.json({ message: "Project not found." }, { status: 404 });
    }

    if (project.createdBy.accountId !== authResult.actor.userId) {
      return NextResponse.json({ message: "Only creator can update roles." }, { status: 403 });
    }

    await projectsCollection.updateOne(
      { _id: project._id },
      {
        $set: {
          openRoles: roles,
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
    console.error("Project roles update error:", error);
    return NextResponse.json({ message: "Failed to update roles." }, { status: 500 });
  }
}
