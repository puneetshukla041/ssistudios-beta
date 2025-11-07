import { NextRequest, NextResponse } from "next/server";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { s3 } from "@/lib/s3Client";

export async function POST(req: NextRequest) {
  try {
    const { certificateNo, fileName } = await req.json();

    if (!certificateNo || !fileName) {
      return NextResponse.json({ error: "certificateNo and fileName are required" }, { status: 400 });
    }

    const bucketName = process.env.AWS_BUCKET_NAME!;
    const s3Key = `certificates/${certificateNo}/${fileName}`;

    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: s3Key,
      ContentType: "application/pdf",
    });

    const signedUrl = await getSignedUrl(s3, command, { expiresIn: 300 }); // 5 min expiry

    return NextResponse.json({
      uploadUrl: signedUrl,
      s3Key,
    });
  } catch (err: any) {
    console.error("Error generating upload URL:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
