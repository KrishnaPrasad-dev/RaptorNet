import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";

export const runtime = "nodejs";

const requiredFields = [
  "name",
  "email",
  "college",
  "branch",
  "resumeLink",
  "githubLink",
  "linkedinLink",
  "phoneNumber",
] as const;

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Record<string, unknown>;

    const payload = Object.fromEntries(
      Object.entries(body).map(([key, value]) => [key, typeof value === "string" ? value.trim() : ""])
    ) as Record<string, string>;

    const missingFields = requiredFields.filter((field) => !payload[field]);

    if (missingFields.length > 0) {
      return NextResponse.json(
        { message: "Missing required fields.", missingFields },
        { status: 400 }
      );
    }

    const requiresHardwareDemo = /ece|hardware/i.test(payload.branch ?? "");

    if (requiresHardwareDemo && !payload.demoVideoLink) {
      return NextResponse.json(
        {
          message:
            "For ECE/Hardware projects, demo video link (Google Drive) is required.",
          missingFields: ["demoVideoLink"],
        },
        { status: 400 }
      );
    }

    if (!requiresHardwareDemo && !payload.projectLink) {
      return NextResponse.json(
        {
          message: "Missing required fields.",
          missingFields: ["projectLink"],
        },
        { status: 400 }
      );
    }

    const db = await getDb();

    const result = await db.collection("applications").insertOne({
      name: payload.name,
      email: payload.email,
      college: payload.college,
      branch: payload.branch,
      resumeLink: payload.resumeLink,
      projectLink: payload.projectLink ?? "",
      demoVideoLink: payload.demoVideoLink ?? "",
      githubLink: payload.githubLink,
      linkedinLink: payload.linkedinLink,
      leetcodeLink: payload.leetcodeLink ?? "",
      phoneNumber: payload.phoneNumber,
      createdAt: new Date(),
      status: "new",
    });

    return NextResponse.json(
      { message: "Application submitted successfully.", applicationId: result.insertedId },
      { status: 201 }
    );
  } catch (error) {
    console.error("Application submission error:", error);

    return NextResponse.json(
      { message: "Failed to submit application." },
      { status: 500 }
    );
  }
}
