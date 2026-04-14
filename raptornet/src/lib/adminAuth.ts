import { createHash, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

export const ADMIN_AUTH_COOKIE = "raptornet_admin_auth";

function sha256(value: string) {
  return createHash("sha256").update(value).digest("hex");
}

export function isAdminPasswordConfigured() {
  return Boolean(process.env.ADMIN_DASHBOARD_PASSWORD?.trim());
}

export function getAdminCookieValue() {
  const password = process.env.ADMIN_DASHBOARD_PASSWORD?.trim() ?? "";
  if (!password) {
    return "";
  }

  return sha256(`${password}:raptornet-admin-v1`);
}

export function isValidAdminPassword(password: string) {
  const expected = process.env.ADMIN_DASHBOARD_PASSWORD?.trim() ?? "";
  const provided = password.trim();

  if (!expected || !provided) {
    return false;
  }

  const expectedBuffer = Buffer.from(expected);
  const providedBuffer = Buffer.from(provided);

  if (expectedBuffer.length !== providedBuffer.length) {
    return false;
  }

  return timingSafeEqual(expectedBuffer, providedBuffer);
}

export async function isAdminAuthenticated() {
  const cookieStore = await cookies();
  const cookieValue = cookieStore.get(ADMIN_AUTH_COOKIE)?.value ?? "";
  const expectedValue = getAdminCookieValue();

  if (!cookieValue || !expectedValue) {
    return false;
  }

  const cookieBuffer = Buffer.from(cookieValue);
  const expectedBuffer = Buffer.from(expectedValue);

  if (cookieBuffer.length !== expectedBuffer.length) {
    return false;
  }

  return timingSafeEqual(cookieBuffer, expectedBuffer);
}
