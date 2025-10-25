// models/Certificate.ts
import mongoose, { Schema, Document, Types } from "mongoose";

// Interface for a Certificate document
export interface ICertificate extends Document {
  memberId: Types.ObjectId; // Link to the user who generated the certificate
  recipientName: string;
  certificateNo: string;
  programName: string;
  storageUrl: string; // The URL where the PDF file is stored (e.g., S3 URL)
  createdAt: Date;
  updatedAt: Date;
}

const CertificateSchema: Schema = new Schema(
  {
    // The member who generated the certificate
    memberId: {
      type: Schema.Types.ObjectId,
      ref: "Member",
      required: true,
    },
    // The name on the certificate
    recipientName: {
      type: String,
      required: true,
    },
    // The certificate number for easy lookup
    certificateNo: {
      type: String,
      required: true,
      unique: true,
    },
    // Other metadata
    programName: {
      type: String,
    },
    // The URL of the stored PDF file
    storageUrl: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export const Certificate =
  mongoose.models.Certificate ||
  mongoose.model<ICertificate>("Certificate", CertificateSchema);