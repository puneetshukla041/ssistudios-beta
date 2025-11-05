// app/api/certificates/[certificateNo]/download/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { Certificate } from '@/models/Certificate'; // Adjust path

export async function GET(req: NextRequest, { params }: { params: { certificateNo: string } }) {
    // await connectDB();

    const certificateNo = params.certificateNo;

    try {
        // Find the certificate by its unique certificate number, explicitly include fileData
        const certificate = await Certificate.findOne({ certificateNo: certificateNo }).select('fileData fileType');
        
        if (!certificate || !certificate.fileData) {
            return NextResponse.json({ success: false, error: 'Certificate not found or file data missing.' }, { status: 404 });
        }
        
        // Convert the Buffer to an ArrayBuffer for response
        const arrayBuffer = new Uint8Array(certificate.fileData).buffer;

        // Return the binary data directly as a file response
        return new NextResponse(arrayBuffer, {
            status: 200,
            headers: {
                'Content-Type': certificate.fileType || 'application/pdf',
                'Content-Disposition': `attachment; filename="${certificate.certificateNo}.pdf"`,
                'Content-Length': certificate.fileData.length.toString(),
            },
        });

    } catch (error: any) {
        console.error("Download Error:", error);
        return NextResponse.json({ success: false, error: error.message || 'Failed to download certificate.' }, { status: 500 });
    }
}