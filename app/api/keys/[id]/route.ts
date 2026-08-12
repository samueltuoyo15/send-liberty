import { NextRequest, NextResponse } from "next/server";
import { requireAuthUser } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import ApiKey from "@/models/ApiKey";
import mongoose from "mongoose";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuthUser(req);
    const { id } = await params;
    await connectDB();

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ success: false, message: "Invalid key ID" }, { status: 400 });
    }

    const key = await ApiKey.findOne({
      _id: new mongoose.Types.ObjectId(id),
      userId: new mongoose.Types.ObjectId(user.id),
    });

    if (!key) {
      return NextResponse.json({ success: false, message: "API key not found" }, { status: 404 });
    }

    await key.deleteOne();

    return NextResponse.json({ success: true, message: "API key deleted" });
  } catch (err) {
    if (err instanceof Response) return err;
    console.error("/api/keys/[id] DELETE error:", err);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuthUser(req);
    const { id } = await params;
    await connectDB();

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ success: false, message: "Invalid key ID" }, { status: 400 });
    }

    const key = await ApiKey.findOne({
      _id: new mongoose.Types.ObjectId(id),
      userId: new mongoose.Types.ObjectId(user.id),
    });

    if (!key) {
      return NextResponse.json({ success: false, message: "API key not found" }, { status: 404 });
    }

    key.revoked = true;
    await key.save();

    return NextResponse.json({ success: true, message: "API key revoked" });
  } catch (err) {
    if (err instanceof Response) return err;
    console.error("/api/keys/[id] PATCH error:", err);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}
