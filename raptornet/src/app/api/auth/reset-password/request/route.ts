import { NextResponse } from "next/server";
import { getUserByEmail, savePasswordResetToken } from "@/lib/utils";
import { sendResetEmail } from "@/lib/utils";
import crypto from "crypto";

export async function POST(req: Request) {
  const { email } = await req.json();
  if (!email) {
    return NextResponse.json({ message: "Email is required." }, { status: 400 });
  }
  const user = await getUserByEmail(email);
  if (!user) {
    // Respond with success to prevent email enumeration
    return NextResponse.json({ message: "If your email is registered, a reset link has been sent." });
  }
  const token = crypto.randomBytes(32).toString("hex");
  const expires = Date.now() + 1000 * 60 * 60; // 1 hour
  await savePasswordResetToken(user._id, token, expires);
  await sendResetEmail(email, token);
  return NextResponse.json({ message: "If your email is registered, a reset link has been sent." });
}
