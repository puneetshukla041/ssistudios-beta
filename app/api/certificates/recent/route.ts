// app/api/certificates/recent/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { Certificate } from '@/models/Certificate'; // Adjust path
import mongoose from 'mongoose';

// --- MOCK USER SETUP (REPLACE THIS) ---
const MOCK_MEMBER_ID = '60d0fe4f5311234567890abc'; 
// ------------------------------------

export async function GET(req: NextRequest) {
    // await connectDB(); 

    try {
        // Find recent certificates for the mock user, only pulling metadata
        const recentCertificates = await Certificate.find({ 
            memberId: new mongoose.Types.ObjectId(MOCK_MEMBER_ID)
        })
          .select('-fileData') // Exclude the large file data for listing
          .sort({ createdAt: -1 })
          .limit(8)
          .lean(); // Use .lean() for faster query performance

        return NextResponse.json({ 
            success: true, 
            data: recentCertificates,
        }, { status: 200 });

    } catch (error: any) {
        console.error("DB Fetch Error:", error);
        return NextResponse.json({ success: false, error: error.message || 'Failed to fetch certificates.' }, { status: 500 });
    }
}