import { NextResponse } from "next/server";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { s3 } from "@/lib/s3Client";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const certificateNo = formData.get("certificateNo") as string;
    const recipientName = formData.get("recipientName") as string;

    if (!file || !certificateNo) {
      return NextResponse.json(
        { message: "Missing file or certificate number" },
        { status: 400 }
      );
    }

    // Folder structure: certificates/{username or recipientName}/filename.pdf
    const fileName = `${recipientName || "user"}/${certificateNo}.pdf`;
    const bucketName = process.env.AWS_BUCKET_NAME!;

    // Prepare S3 upload
    const uploadParams = {
      Bucket: bucketName,
      Key: `certificates/${fileName}`,
      ContentType: file.type,
    };

    // Get presigned URL (expires in 1 minute)
    const signedUrl = await getSignedUrl(s3, new PutObjectCommand(uploadParams), {
      expiresIn: 60,
    });

    // Upload file from server to S3
    const arrayBuffer = await file.arrayBuffer();
    await fetch(signedUrl, {
      method: "PUT",
      body: Buffer.from(arrayBuffer),
      headers: { "Content-Type": file.type },
    });

    return NextResponse.json({
      message: "File uploaded successfully",
      fileUrl: `https://${bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/certificates/${fileName}`,
    });
  } catch (error: any) {
    console.error("Upload error:", error);
    return NextResponse.json({ message: "Upload failed", error }, { status: 500 });
  }
}
