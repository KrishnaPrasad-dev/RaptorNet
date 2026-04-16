import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { isAdminAuthenticated, isAdminPasswordConfigured } from "@/lib/adminAuth";

export const runtime = "nodejs";

type ActionType = "accept" | "reject" | "pending";

type ApplicationDoc = {
  _id: ObjectId;
  name?: string;
  email?: string;
  college?: string;
  branch?: string;
  resumeLink?: string;
  projectLink?: string;
  demoVideoLink?: string;
  githubLink?: string;
  linkedinLink?: string;
  leetcodeLink?: string;
  phoneNumber?: string;
  status?: string;
  createdAt?: Date | string;
};

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    if (!isAdminPasswordConfigured()) {
      return NextResponse.json(
        { message: "Admin password is not configured." },
        { status: 503 }
      );
    }

    const isAuthenticated = await isAdminAuthenticated();

    if (!isAuthenticated) {
      return NextResponse.json(
        { message: "Unauthorized." },
        { status: 401 }
      );
    }

    const { id } = await context.params;

    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { message: "Invalid application id." },
        { status: 400 }
      );
    }

    const body = (await request.json()) as { action?: string };
    const action = body.action as ActionType | undefined;

    if (!action || !["accept", "reject", "pending"].includes(action)) {
      return NextResponse.json(
        { message: "Invalid action." },
        { status: 400 }
      );
    }

    const db = await getDb();
    const applicationId = new ObjectId(id);

    const application = await db
      .collection<ApplicationDoc>("applications")
      .findOne({ _id: applicationId });

    if (!application) {
      return NextResponse.json(
        { message: "Application not found." },
        { status: 404 }
      );
    }

    if (action === "accept") {
      await db.collection("members").updateOne(
        { email: application.email ?? "" },
        {
          $set: {
            applicationId: application._id.toString(),
            name: application.name ?? "",
            email: application.email ?? "",
            college: application.college ?? "",
            branch: application.branch ?? "",
            resumeLink: application.resumeLink ?? "",
            projectLink: application.projectLink ?? "",
            demoVideoLink: application.demoVideoLink ?? "",
            githubLink: application.githubLink ?? "",
            linkedinLink: application.linkedinLink ?? "",
            leetcodeLink: application.leetcodeLink ?? "",
            phoneNumber: application.phoneNumber ?? "",
            role: "Guild Member",
            title: `${application.branch ?? "Student"} Builder`,
            status: "active",
            approvedAt: new Date(),
          },
          $setOnInsert: {
            createdAt: new Date(),
          },
        },
        { upsert: true }
      );

      await db.collection("applications").deleteOne({ _id: applicationId });

      return NextResponse.json(
        { message: "Application accepted and member added." },
        { status: 200 }
      );
    }

    const nextStatus = action === "reject" ? "rejected" : "pending";

    await db.collection("applications").updateOne(
      { _id: applicationId },
      {
        $set: {
          status: nextStatus,
          reviewedAt: new Date(),
        },
      }
    );

    return NextResponse.json(
      { message: `Application marked as ${nextStatus}.` },
      { status: 200 }
    );
  } catch (error) {
    console.error("Failed to update application status:", error);

    return NextResponse.json(
      { message: "Failed to update application." },
      { status: 500 }
    );
  }
}
