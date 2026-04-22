import { NextResponse } from "next/server";
import { MEMBER_AUTH_COOKIE } from "@/lib/memberAuth";

export const runtime = "nodejs";

export async function POST() {
  const response = NextResponse.json({ message: "Logged out." }, { status: 200 });

  response.cookies.set({
    name: MEMBER_AUTH_COOKIE,
    value: "",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 0,
    path: "/",
  });

  return response;
}
