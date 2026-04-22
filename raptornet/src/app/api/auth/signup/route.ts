import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import {
  createSessionToken,
  getMemberSessionMaxAge,
  hashPassword,
  isMemberAuthConfigured,
  MEMBER_AUTH_COOKIE,
  normalizeEmail,
} from "@/lib/memberAuth";

export const runtime = "nodejs";

type MemberDoc = {
  _id: { toString(): string };
  name?: string;
  email?: string;
  status?: string;
  canSignup?: boolean;
};

function escapeRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export async function POST(request: Request) {
  try {
    if (!isMemberAuthConfigured()) {
      return NextResponse.json(
        { message: "Member auth is not configured." },
        { status: 503 }
      );
    }

    const body = (await request.json()) as {
      name?: string;
      email?: string;
      password?: string;
    };

    const name = (body.name ?? "").trim();
    const email = normalizeEmail(body.email ?? "");
    const password = (body.password ?? "").trim();

    if (!email || !password) {
      return NextResponse.json(
        { message: "Email and password are required." },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { message: "Password must be at least 8 characters." },
        { status: 400 }
      );
    }

    const db = await getDb();
    const membersCollection = db.collection<MemberDoc>("members");
    const accountsCollection = db.collection("member_accounts");

    const escapedEmail = escapeRegex(email);
    const approvedMember = (await membersCollection.findOne({
      email: { $regex: `^${escapedEmail}$`, $options: "i" },
      status: "active",
      canSignup: true,
    })) as MemberDoc | null;

    if (!approvedMember) {
      return NextResponse.json(
        {
          message:
            "Your email is not approved yet. Submit an application and wait for acceptance.",
        },
        { status: 403 }
      );
    }

    const existingAccount = await accountsCollection.findOne({ email });

    if (existingAccount) {
      return NextResponse.json(
        { message: "Account already exists. Please login." },
        { status: 409 }
      );
    }

    const passwordHash = await hashPassword(password);
    const now = new Date();

    const insertResult = await accountsCollection.insertOne({
      memberId: String(approvedMember._id),
      name: name || approvedMember.name || "",
      email,
      passwordHash,
      createdAt: now,
      lastLoginAt: now,
    });

    const sessionToken = createSessionToken(insertResult.insertedId.toString(), email);
    const response = NextResponse.json(
      { message: "Account created successfully." },
      { status: 201 }
    );

    response.cookies.set({
      name: MEMBER_AUTH_COOKIE,
      value: sessionToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: getMemberSessionMaxAge(),
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { message: "Failed to complete signup." },
      { status: 500 }
    );
  }
}
