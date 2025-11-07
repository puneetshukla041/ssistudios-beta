// app/api/presign/route.ts
import { NextRequest } from "next/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export const runtime = "nodejs";

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
  },
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { filename, certificateNo, username, contentType } = body;

    if (!filename || !certificateNo || !username) {
      return new Response(JSON.stringify({ error: "missing fields" }), { status: 400 });
    }

    // sanitize username for key
    const safeUsername = String(username).replace(/[^a-zA-Z0-9-_]/g, "_");
    const safeFile = filename.replace(/[^a-zA-Z0-9-_.]/g, "_");
    const key = `certificates/${safeUsername}/${certificateNo}-${safeFile}`;

    const command = new PutObjectCommand({
      Bucket: process.env.S3_BUCKET,
      Key: key,
      ContentType: contentType || "application/pdf",
      ServerSideEncryption: "AES256", // ensure SSE-S3
      // You may optionally add Metadata: { uploadedBy: username, certificateNo }
    });

    // presigned PUT URL valid e.g., 5 minutes (300 seconds)
    const url = await getSignedUrl(s3, command, { expiresIn: 300 });

    return new Response(JSON.stringify({ url, key }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err: any) {
    console.error("presign error", err);
    return new Response(JSON.stringify({ error: err.message || String(err) }), { status: 500 });
  }
}
