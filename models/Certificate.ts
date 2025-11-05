// models/Certificate.ts
import mongoose, { Schema, Document, Types } from "mongoose";

// Interface for a Certificate document
export interface ICertificate extends Document {
  memberId: Types.ObjectId;
  recipientName: string;
  certificateNo: string;
  programName: string;
  fileData: Buffer;       // PDF file bytes
  fileType: string;       // MIME type, e.g., 'application/pdf'
  createdAt: Date;
  updatedAt: Date;
}

const CertificateSchema: Schema = new Schema(
  {
    memberId: {
      type: Schema.Types.ObjectId,
      ref: "Member",
      required: true,
    },
    recipientName: {
      type: String,
      required: true,
    },
    certificateNo: {
      type: String,
      required: true,
      unique: true,
    },
    programName: {
      type: String,
    },
    // Store file binary data
    fileData: {
      type: Buffer,
      required: true,
    },
    // File MIME type (usually application/pdf)
    fileType: {
      type: String,
      default: "application/pdf",
    },
  },
  { timestamps: true }
);

// Prevent model overwrite issues in dev
export const Certificate =
  mongoose.models.Certificate ||
  mongoose.model<ICertificate>("Certificate", CertificateSchema);