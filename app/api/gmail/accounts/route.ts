import { NextRequest, NextResponse } from "next/server";
import { requireAuthUser } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { createOAuthClient } from "@/lib/gmail";
import { decrypt } from "@/lib/encryption";
import GmailAccount from "@/models/GmailAccount";
import mongoose from "mongoose";

export async function GET(req: NextRequest) {
  try {
    const user = await requireAuthUser(req);
    await connectDB();

    const accounts = await GmailAccount.find({ userId: user.id }).select(
      "gmailEmail connected lastError createdAt updatedAt"
    ).lean();

    return NextResponse.json({
      success: true,
      data: accounts.map(account => ({
        id: account._id,
        email: account.gmailEmail,
        connected: account.connected,
        lastError: account.lastError,
        connectedAt: account.createdAt,
      })),
    });
  } catch (err) {
    if (err instanceof Response) return err;
    console.error("/api/gmail/accounts GET error:", err);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const user = await requireAuthUser(req);
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");

    await connectDB();

    if (email) {
      const account = await GmailAccount.findOne({ 
        userId: new mongoose.Types.ObjectId(user.id),
        gmailEmail: email
      }).lean();

      if (!account) {
        return NextResponse.json({ success: false, message: "Gmail account not found" }, { status: 404 });
      }

      try {
        const oauth2Client = createOAuthClient();
        oauth2Client.setCredentials({ access_token: decrypt(account.encryptedAccessToken) });
        await oauth2Client.revokeCredentials();
      } catch {}

      await GmailAccount.deleteOne({ _id: account._id });
    } else {
      // Fallback: Disconnect all if no email specified
      const accounts = await GmailAccount.find({ userId: new mongoose.Types.ObjectId(user.id) }).lean();
      for (const account of accounts) {
        try {
          const oauth2Client = createOAuthClient();
          oauth2Client.setCredentials({ access_token: decrypt(account.encryptedAccessToken) });
          await oauth2Client.revokeCredentials();
        } catch {}
      }
      await GmailAccount.deleteMany({ userId: new mongoose.Types.ObjectId(user.id) });
    }

    return NextResponse.json({ success: true, message: "Gmail disconnected successfully" });
  } catch (err) {
    if (err instanceof Response) return err;
    console.error("/api/gmail/accounts DELETE error:", err);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}
