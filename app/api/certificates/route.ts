import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbconnect";
import { Certificate } from "@/models/Certificate";
import { Member } from "@/models/Employee";
import { Error as MongooseError } from "mongoose";

export async function POST(req: Request) {
  await dbConnect();

  try {
    const formData = await req.formData();

    const pdfFile = formData.get("file") as File | null;
    const certificateNo = formData.get("certificateNo") as string | null;
    const recipientName = formData.get("recipientName") as string | null;
    const programName = formData.get("programName") as string | null;

    if (!pdfFile || !(pdfFile instanceof File) || !certificateNo || !recipientName || !programName) {
      return NextResponse.json(
        { message: "Missing required certificate data (file, number, recipient, or program)." },
        { status: 400 }
      );
    }

    const fileBuffer = Buffer.from(await pdfFile.arrayBuffer()); // <-- actual file data

    const existing = await Certificate.findOne({ certificateNo });
    if (existing) {
      return NextResponse.json({ message: `Certificate ${certificateNo} already exists.` }, { status: 409 });
    }

    let member = await Member.findOne({ username: "testuser" });

    if (!member) {
      console.log("Mock user not found. Creating 'testuser'...");
      member = await Member.create({
        username: "testuser",
        email: "testuser@example.com",
        password: "mock-password-123",
      });
    }

    const newCert = new Certificate({
      memberId: member._id,
      recipientName,
      certificateNo,
      programName,
      fileData: fileBuffer, // <-- Store file here
      fileType: pdfFile.type || "application/pdf",
    });

    await newCert.save();

    return NextResponse.json(
      {
        message: "Certificate uploaded successfully.",
        certificate: {
          id: newCert._id,
          certificateNo,
          size: fileBuffer.length,
          type: newCert.fileType,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    const err = error as Error;
    console.error("Upload Error:", err);

    let message = "Failed to upload certificate.";
    if (err instanceof MongooseError.ValidationError) {
      message = "Database validation failed. Check server logs for details.";
    }

    return NextResponse.json(
      { message, detail: err.message || "Unknown error" },
      { status: 500 }
    );
  }
}
