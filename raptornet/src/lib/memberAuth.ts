import { createHmac, randomBytes, scrypt as scryptCallback, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";
import { cookies } from "next/headers";

const scrypt = promisify(scryptCallback);

export const MEMBER_AUTH_COOKIE = "raptornet_member_auth";

const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7;

type SessionPayload = {
  sub: string;
  email: string;
  exp: number;
};

function base64UrlEncode(value: string) {
  return Buffer.from(value).toString("base64url");
}

function base64UrlDecode(value: string) {
  return Buffer.from(value, "base64url").toString("utf8");
}

function getSessionSecret() {
  const configured = process.env.MEMBER_AUTH_SECRET?.trim() ?? "";
  if (configured) {
    return configured;
  }

  if (process.env.NODE_ENV !== "production") {
    return "raptornet-dev-member-auth-secret";
  }

  return "";
}

export function isMemberAuthConfigured() {
  return Boolean(getSessionSecret());
}

export function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

export async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const derived = (await scrypt(password, salt, 64)) as Buffer;
  return `${salt}:${derived.toString("hex")}`;
}

export async function verifyPassword(password: string, storedHash: string) {
  const [salt, hashHex] = storedHash.split(":");

  if (!salt || !hashHex) {
    return false;
  }

  const derived = (await scrypt(password, salt, 64)) as Buffer;
  const expected = Buffer.from(hashHex, "hex");

  if (derived.length !== expected.length) {
    return false;
  }

  return timingSafeEqual(derived, expected);
}

function sign(payloadBase64: string, secret: string) {
  return createHmac("sha256", secret).update(payloadBase64).digest("base64url");
}

export function createSessionToken(accountId: string, email: string) {
  const secret = getSessionSecret();
  if (!secret) {
    return "";
  }

  const payload: SessionPayload = {
    sub: accountId,
    email,
    exp: Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS,
  };

  const payloadBase64 = base64UrlEncode(JSON.stringify(payload));
  const signature = sign(payloadBase64, secret);
  return `${payloadBase64}.${signature}`;
}

function parseSessionToken(token: string): SessionPayload | null {
  const secret = getSessionSecret();
  if (!secret || !token) {
    return null;
  }

  const [payloadBase64, providedSignature] = token.split(".");
  if (!payloadBase64 || !providedSignature) {
    return null;
  }

  const expectedSignature = sign(payloadBase64, secret);
  const expectedBuffer = Buffer.from(expectedSignature);
  const providedBuffer = Buffer.from(providedSignature);

  if (expectedBuffer.length !== providedBuffer.length) {
    return null;
  }

  if (!timingSafeEqual(expectedBuffer, providedBuffer)) {
    return null;
  }

  try {
    const decoded = base64UrlDecode(payloadBase64);
    const payload = JSON.parse(decoded) as SessionPayload;

    if (!payload.sub || !payload.email || !payload.exp) {
      return null;
    }

    if (payload.exp < Math.floor(Date.now() / 1000)) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}

export async function getAuthenticatedMemberSession() {
  const store = await cookies();
  const token = store.get(MEMBER_AUTH_COOKIE)?.value ?? "";
  return parseSessionToken(token);
}

export function getMemberSessionMaxAge() {
  return SESSION_TTL_SECONDS;
}
