// app/api/certificates/route.ts
import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbconnect";
import { Certificate } from "@/models/Certificate";
import { Member } from "@/models/Employee"; 
import { Error as MongooseError } from 'mongoose';

// --- Mock Storage Upload (Simulated External Upload) ---
const mockUploadToExternalStorage = async (file: { name?: string; originalFilename?: string }, fileName: string): Promise<string> => {
  console.log(`Simulating upload of file: ${file.name || file.originalFilename || fileName}`);
  await new Promise((resolve) => setTimeout(resolve, 500)); 
  return `https://storage.example.com/certificates/${fileName.replace(/\s/g, "_")}-${Date.now()}.pdf`;
};

// Handle POST (file upload)
export async function POST(req: Request) {
  await dbConnect();

  try {
    const formData = await req.formData();
    
    // 1. Extract and validate all required fields
    const pdfFile = formData.get("file") as File | null;
    const certificateNo = formData.get("certificateNo") as string | null;
    const recipientName = formData.get("recipientName") as string | null;
    const programName = formData.get("programName") as string | null;

    if (!pdfFile || !(pdfFile instanceof File) || !certificateNo || !recipientName || !programName) {
      return NextResponse.json({ message: "Missing required certificate data (file, number, recipient, or program)." }, { status: 400 });
    }
    
    const fileName = pdfFile.name || `${certificateNo}.pdf`;

    // 2. Check for existing certificate
    const existing = await Certificate.findOne({ certificateNo });
    if (existing) {
      return NextResponse.json({ message: `Certificate ${certificateNo} already exists.` }, { status: 409 });
    }

    // 3. Ensure Mock User Exists
    let member = await Member.findOne({ username: "testuser" });
    
    if (!member) {
        console.log("Mock user not found in DB. Creating 'testuser' member.");
        // FIX: Added the required 'password' field. Use '123456' as a mock password.
        member = await Member.create({
            username: "testuser",
            email: "testuser@example.com",
            password: "mock-password-123", // <-- ADDED REQUIRED FIELD
            // Add other required fields if your schema demands them
        });
    }

    // 4. Mock upload
    const storageUrl = await mockUploadToExternalStorage(pdfFile, fileName);

    // 5. Create and Save Certificate document
    const newCert = new Certificate({
      memberId: member._id,
      recipientName,
      certificateNo,
      programName,
      storageUrl,
    });

    await newCert.save();

    return NextResponse.json(
      {
        message: "Certificate uploaded and saved successfully.",
        certificate: {
          id: newCert._id,
          certificateNo,
          storageUrl,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    let errorMessage = "Failed to upload certificate.";
    const err = error as Error;

    if (err instanceof MongooseError.ValidationError) {
        console.error("Mongoose Validation Error:", err.message, err.errors);
        errorMessage = "Database validation failed. Check server logs for details.";
    } else {
        console.error("General Upload Error:", err);
        errorMessage = err.message || errorMessage;
    }
    
    return NextResponse.json(
      { 
        message: "Failed to upload certificate. See detail.", 
        detail: (err instanceof MongooseError.ValidationError) ? err.message : err.message || 'Unknown server error.' 
      },
      { status: 500 }
    );
  }
}