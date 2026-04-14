import { NextResponse } from "next/server";
import {
  ADMIN_AUTH_COOKIE,
  getAdminCookieValue,
  isAdminPasswordConfigured,
  isValidAdminPassword,
} from "@/lib/adminAuth";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { password?: string };
    const password = body.password ?? "";

    if (!isAdminPasswordConfigured()) {
      return NextResponse.json(
        { message: "Admin password is not configured." },
        { status: 503 }
      );
    }

    if (!isValidAdminPassword(password)) {
      return NextResponse.json(
        { message: "Invalid admin password." },
        { status: 401 }
      );
    }

    const response = NextResponse.json({ message: "Authenticated." }, { status: 200 });

    response.cookies.set({
      name: ADMIN_AUTH_COOKIE,
      value: getAdminCookieValue(),
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    return response;
  } catch {
    return NextResponse.json(
      { message: "Failed to process login." },
      { status: 500 }
    );
  }
}
