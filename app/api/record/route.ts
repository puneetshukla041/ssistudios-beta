// app/api/record/route.ts
import { NextRequest } from "next/server";
import mongoose from "mongoose";
import { Certificate } from "../../../models/Certificate"; // adjust path if needed

export const runtime = "nodejs";

async function connectDb() {
  if (!process.env.MONGODB_URI) throw new Error("MONGODB_URI not set");
  if (mongoose.connection.readyState === 1) return;
  await mongoose.connect(process.env.MONGODB_URI!);
}

export async function POST(req: NextRequest) {
  try {
    await connectDb();
    const body = await req.json();
    const { certificateNo, key, username, programName } = body;

    if (!certificateNo || !key || !username) {
      return new Response(JSON.stringify({ error: "missing fields" }), { status: 400 });
    }

    const doc = await Certificate.create({
      certificateNo,
      filename: key,
      uploadedBy: username,
      programName,
    });

    return new Response(JSON.stringify({ ok: true, id: doc._id }), { status: 200 });
  } catch (err: any) {
    console.error("record error", err);
    return new Response(JSON.stringify({ error: err.message || String(err) }), { status: 500 });
  }
}
