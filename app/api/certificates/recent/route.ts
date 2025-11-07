import { NextResponse } from "next/server";
import { ListObjectsV2Command } from "@aws-sdk/client-s3";
import { s3 } from "@/lib/s3Client";

export async function GET() {
  try {
    const bucketName = process.env.AWS_BUCKET_NAME!;
    const prefix = "certificates/";

    const command = new ListObjectsV2Command({
      Bucket: bucketName,
      Prefix: prefix,
    });

    const result = await s3.send(command);

    // If no files are found
    if (!result.Contents || result.Contents.length === 0) {
      return NextResponse.json({ data: [] }, { status: 200 });
    }

    // Map and format file details
    const certificates = result.Contents.map((item) => {
      const key = item.Key || "";
      const fileName = key.replace(prefix, "");
      const [userFolder, certFile] = fileName.split("/");

      return {
        _id: key,
        recipientName: userFolder || "Unknown",
        certificateNo: certFile?.replace(".pdf", "") || "Unknown",
        programName: "Robotics Training Program",
        createdAt: item.LastModified || new Date(),
        fileUrl: `https://${bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`,
      };
    });

    // Sort newest first
    const sorted = certificates.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    return NextResponse.json({ data: sorted }, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching certificates:", error);
    return NextResponse.json(
      { error: "Failed to list certificates", details: error.message },
      { status: 500 }
    );
  }
}
