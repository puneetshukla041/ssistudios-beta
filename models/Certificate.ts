// models/Certificate.ts
import mongoose, { Schema, Document } from "mongoose";

export interface ICertificate extends Document {
  certificateNo: string;
  filename: string;      // s3 object key
  url?: string;          // S3 object URL (optional)
  uploadedBy: string;    // username or userId
  programName?: string;
  createdAt: Date;
}

const CertificateSchema: Schema = new Schema({
  certificateNo: { type: String, required: true },
  filename: { type: String, required: true },
  url: { type: String },
  uploadedBy: { type: String, required: true },
  programName: { type: String },
}, { timestamps: true });

export const Certificate =
  mongoose.models.Certificate || mongoose.model<ICertificate>("Certificate", CertificateSchema);
