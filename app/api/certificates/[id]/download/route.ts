import { NextRequest, NextResponse } from "next/server";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { s3 } from "@/lib/s3Client";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> } // ✅ Fix: must be Promise in Next.js 15
) {
  try {
    const { id } = await context.params; // ✅ await the promise
    const bucketName = process.env.AWS_BUCKET_NAME!;
    const certificateKey = decodeURIComponent(id); // example: "username/CERT-001.pdf"

    if (!certificateKey) {
      return NextResponse.json({ error: "Certificate key is missing" }, { status: 400 });
    }

    const command = new GetObjectCommand({
      Bucket: bucketName,
      Key: `certificates/${certificateKey}`,
    });

    const signedUrl = await getSignedUrl(s3, command, { expiresIn: 60 });

    return NextResponse.json({ url: signedUrl }, { status: 200 });
  } catch (error: any) {
    console.error("Error generating signed URL:", error);
    return NextResponse.json(
      { error: "Failed to generate download link", details: error.message },
      { status: 500 }
    );
  }
}
