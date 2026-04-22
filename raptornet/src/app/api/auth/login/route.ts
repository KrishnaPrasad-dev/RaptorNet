import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import {
  createSessionToken,
  getMemberSessionMaxAge,
  isMemberAuthConfigured,
  MEMBER_AUTH_COOKIE,
  normalizeEmail,
  verifyPassword,
} from "@/lib/memberAuth";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    if (!isMemberAuthConfigured()) {
      return NextResponse.json(
        { message: "Member auth is not configured." },
        { status: 503 }
      );
    }

    const body = (await request.json()) as { email?: string; password?: string };
    const email = normalizeEmail(body.email ?? "");
    const password = (body.password ?? "").trim();

    if (!email || !password) {
      return NextResponse.json(
        { message: "Email and password are required." },
        { status: 400 }
      );
    }

    const db = await getDb();
    const accountsCollection = db.collection("member_accounts");

    const account = (await accountsCollection.findOne({ email })) as
      | {
          _id: { toString(): string };
          passwordHash?: string;
        }
      | null;

    if (!account?.passwordHash) {
      return NextResponse.json(
        { message: "Invalid credentials." },
        { status: 401 }
      );
    }

    const validPassword = await verifyPassword(password, account.passwordHash);

    if (!validPassword) {
      return NextResponse.json(
        { message: "Invalid credentials." },
        { status: 401 }
      );
    }

    await accountsCollection.updateOne(
      { _id: account._id },
      {
        $set: {
          lastLoginAt: new Date(),
        },
      }
    );

    const sessionToken = createSessionToken(account._id.toString(), email);
    const response = NextResponse.json({ message: "Authenticated." }, { status: 200 });

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
    console.error("Login error:", error);
    return NextResponse.json(
      { message: "Failed to process login." },
      { status: 500 }
    );
  }
}
