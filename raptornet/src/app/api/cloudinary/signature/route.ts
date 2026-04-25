import crypto from "crypto";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

function buildSignature(params: Record<string, string | number>, apiSecret: string) {
  const serialized = Object.keys(params)
    .sort()
    .map((key) => `${key}=${params[key]}`)
    .join("&");

  return crypto
    .createHash("sha1")
    .update(`${serialized}${apiSecret}`)
    .digest("hex");
}

export async function POST() {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  const folder = process.env.CLOUDINARY_UPLOAD_FOLDER || "Raptornet";

  if (!cloudName || !apiKey || !apiSecret) {
    return NextResponse.json(
      { message: "Cloudinary is not configured on the server." },
      { status: 500 }
    );
  }

  const timestamp = Math.floor(Date.now() / 1000);
  const signature = buildSignature({ folder, timestamp }, apiSecret);

  return NextResponse.json(
    {
      cloudName,
      apiKey,
      folder,
      timestamp,
      signature,
    },
    { status: 200 }
  );
}