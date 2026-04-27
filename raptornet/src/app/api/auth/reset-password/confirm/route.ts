import { NextResponse } from "next/server";
import { getUserByResetToken, updateUserPassword, clearPasswordResetToken } from "@/lib/utils";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  const { token, password } = await req.json();
  if (!token || !password) {
    return NextResponse.json({ message: "Token and password are required." }, { status: 400 });
  }
  const user = await getUserByResetToken(token);
  if (!user || !user.resetTokenExpires || user.resetTokenExpires < Date.now()) {
    return NextResponse.json({ message: "Invalid or expired token." }, { status: 400 });
  }
  const hashed = await bcrypt.hash(password, 10);
  await updateUserPassword(user._id, hashed);
  await clearPasswordResetToken(user._id);
  return NextResponse.json({ message: "Password has been reset." });
}
