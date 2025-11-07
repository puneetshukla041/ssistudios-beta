// app/api/certificate/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { s3 } from "@/lib/s3Client";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> } // 👈 Notice: params is a Promise
) {
  try {
    const { id } = await context.params; // 👈 Must await it now
    const bucketName = process.env.AWS_BUCKET_NAME!;
    const certificateKey = decodeURIComponent(id);

    if (!certificateKey) {
      return NextResponse.json(
        { error: "Certificate key is missing" },
        { status: 400 }
      );
    }

    const fullKey = `certificates/${certificateKey}`;
    console.log("Fetching S3 key:", fullKey);

    const command = new GetObjectCommand({
      Bucket: bucketName,
      Key: fullKey,
    });

    const signedUrl = await getSignedUrl(s3, command, { expiresIn: 60 });

    return NextResponse.json({ url: signedUrl }, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching certificate:", error);

    if (error.name === "NoSuchKey" || error.$metadata?.httpStatusCode === 404) {
      return NextResponse.json(
        { error: "Certificate not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: "Failed to generate download link", details: error.message },
      { status: 500 }
    );
  }
}
