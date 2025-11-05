// app/api/certificates/save/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { Certificate } from '@/models/Certificate'; // Adjust path
import mongoose from 'mongoose';

// --- MOCK DATABASE AND USER SETUP (REPLACE THESE) ---
const MOCK_MEMBER_ID = '60d0fe4f5311234567890abc'; 

// Mock DB connection - REPLACE with your actual DB connection logic
const connectDB = async () => {
    if (mongoose.connections[0].readyState) return;
    // Replace with your MongoDB connection string
    // await mongoose.connect(process.env.MONGODB_URI as string); 
    console.log("MOCK: Connected to MongoDB");
};
// ---------------------------------------------------

export async function POST(req: NextRequest) {
    // await connectDB(); 

    try {
        const body = await req.json();
        const { 
            recipientName, 
            certificateNo, 
            programName, 
            fileBase64, 
            fileType 
        } = body;

        if (!recipientName || !certificateNo || !fileBase64) {
            return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
        }

        // Convert base64 string back to a Buffer (full binary data)
        const fileDataBuffer = Buffer.from(fileBase64, 'base64');

        const newCertificate = await Certificate.create({
            memberId: new mongoose.Types.ObjectId(MOCK_MEMBER_ID), // Convert mock ID to ObjectId
            recipientName,
            certificateNo,
            programName: programName || 'N/A',
            fileData: fileDataBuffer, // Full quality PDF saved as Buffer
            fileType: fileType || 'application/pdf',
        });

        return NextResponse.json({ 
            success: true, 
            data: newCertificate,
        }, { status: 201 });

    } catch (error: any) {
        console.error("DB Save Error:", error);
        if (error.code === 11000) {
            return NextResponse.json({ success: false, error: `Certificate number ${req.body?.certificateNo} already exists.` }, { status: 409 });
        }
        return NextResponse.json({ success: false, error: error.message || 'Failed to save certificate.' }, { status: 500 });
    }
}