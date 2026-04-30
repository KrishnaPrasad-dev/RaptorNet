// --- Password Reset Utilities ---
import nodemailer from "nodemailer";
import { ObjectId } from "mongodb";
import { getDb } from "./mongodb";

export async function getUserByEmail(email: string) {
  const db = await getDb();
  return db.collection("users").findOne({ email });
}

export async function savePasswordResetToken(userId: ObjectId, token: string, expires: number) {
  const db = await getDb();
  await db.collection("users").updateOne(
    { _id: userId },
    { $set: { resetToken: token, resetTokenExpires: expires } }
  );
}

export async function getUserByResetToken(token: string) {
  const db = await getDb();
  return db.collection("users").findOne({ resetToken: token });
}

export async function updateUserPassword(userId: ObjectId, hashedPassword: string) {
  const db = await getDb();
  await db.collection("users").updateOne(
    { _id: userId },
    { $set: { password: hashedPassword } }
  );
}

export async function clearPasswordResetToken(userId: ObjectId) {
  const db = await getDb();
  await db.collection("users").updateOne(
    { _id: userId },
    { $unset: { resetToken: "", resetTokenExpires: "" } }
  );
}

export async function sendResetEmail(email: string, token: string) {
  // Configure your SMTP transport here
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
  const resetUrl = `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/reset-password/confirm?token=${token}`;
  await transporter.sendMail({
    from: process.env.SMTP_FROM || "no-reply@raptornet.com",
    to: email,
    subject: "Reset your RaptorNet password",
    html: `<p>Click <a href="${resetUrl}">here</a> to reset your password. This link will expire in 1 hour.</p>`
  });
}
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
