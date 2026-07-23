import { NextRequest, NextResponse } from "next/server";
import { requireAuthUser } from "@/lib/auth";
import { getGmailAuthUrl } from "@/lib/gmail";
import { connectDB } from "@/lib/db";
import GmailAccount from "@/models/GmailAccount";

const MAX_GMAIL_ACCOUNTS = 10;

export async function GET(req: NextRequest) {
  try {
    const user = await requireAuthUser(req);
    await connectDB();

    const count = await GmailAccount.countDocuments({ userId: user.id });
    if (count >= MAX_GMAIL_ACCOUNTS) {
      return NextResponse.json(
        { success: false, message: `You have reached the maximum of ${MAX_GMAIL_ACCOUNTS} connected Gmail accounts.` },
        { status: 429 }
      );
    }

    const url = getGmailAuthUrl(user.id);
    return NextResponse.json({ success: true, url });
  } catch (err) {
    if (err instanceof Response) return err;
    console.error("/api/gmail/connect error:", err);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}
