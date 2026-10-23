import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { consumeRateLimit } from "@/lib/rate-limit";
import { clientIp, isTrustedMutation } from "@/lib/request-guard";

const MAX_VIDEO_BYTES = 80 * 1024 * 1024;

export async function POST(request: Request) {
  if (!isTrustedMutation(request)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const uploadLimit = consumeRateLimit(
    `video:${session.u}:${clientIp(request.headers)}`,
    30,
    60 * 60 * 1000
  );
  if (!uploadLimit.ok) {
    return NextResponse.json({ error: "Too many uploads" }, { status: 429 });
  }

  const token = process.env.BLOB_READ_WRITE_TOKEN;
  if (!token) {
    return NextResponse.json(
      { error: "Vercel Blob is not configured." },
      { status: 503 }
    );
  }

  let body: HandleUploadBody;
  try {
    body = (await request.json()) as HandleUploadBody;
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  try {
    const json = await handleUpload({
      body,
      request,
      token,
      onBeforeGenerateToken: async (pathname) => {
        if (!pathname.startsWith("roster/videos/")) {
          throw new Error("Invalid upload path");
        }
        return {
          allowedContentTypes: [
            "video/mp4",
            "video/webm",
            "video/quicktime",
            "video/x-m4v",
          ],
          addRandomSuffix: true,
          maximumSizeInBytes: MAX_VIDEO_BYTES,
        };
      },
      onUploadCompleted: async () => {},
    });
    return NextResponse.json(json);
  } catch (error) {
    console.error("Admin video upload failed", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 400 });
  }
}
