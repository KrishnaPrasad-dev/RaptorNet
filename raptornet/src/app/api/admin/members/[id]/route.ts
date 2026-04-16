import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { isAdminAuthenticated, isAdminPasswordConfigured } from "@/lib/adminAuth";

export const runtime = "nodejs";

export async function DELETE(
  _request: Request,
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
        { message: "Invalid member id." },
        { status: 400 }
      );
    }

    const db = await getDb();
    const result = await db.collection("members").deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { message: "Member not found." },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Member removed successfully." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Failed to remove member:", error);

    return NextResponse.json(
      { message: "Failed to remove member." },
      { status: 500 }
    );
  }
}
