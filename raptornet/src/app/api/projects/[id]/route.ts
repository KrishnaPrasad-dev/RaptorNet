import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { getViewerId, ProjectDoc, toProjectResponse } from "@/lib/projectCollab";

export const runtime = "nodejs";

export async function GET(
  _request: Request,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await props.params;

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ message: "Invalid project id." }, { status: 400 });
    }

    const db = await getDb();
    const project = await db
      .collection<ProjectDoc>("projects")
      .findOne({ _id: new ObjectId(id) });

    if (!project) {
      return NextResponse.json({ message: "Project not found." }, { status: 404 });
    }

    const viewerId = await getViewerId();
    return NextResponse.json(toProjectResponse(project, viewerId), { status: 200 });
  } catch (error) {
    console.error("Project fetch error:", error);
    return NextResponse.json({ message: "Failed to load project." }, { status: 500 });
  }
}
