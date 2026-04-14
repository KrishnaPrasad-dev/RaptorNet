import { NextResponse } from "next/server";
import { ADMIN_AUTH_COOKIE } from "@/lib/adminAuth";

export const runtime = "nodejs";

export async function POST() {
  const response = NextResponse.json({ message: "Logged out." }, { status: 200 });

  response.cookies.set({
    name: ADMIN_AUTH_COOKIE,
    value: "",
    expires: new Date(0),
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  });

  return response;
}
