import { NextRequest, NextResponse } from "next/server";
import { requireAuthUser } from "@/lib/auth";
import { getGmailAuthUrl } from "@/lib/gmail";

export async function GET(req: NextRequest) {
  try {
    const user = await requireAuthUser(req);
    const url = getGmailAuthUrl(user.id);
    return NextResponse.json({ success: true, url });
  } catch (err) {
    if (err instanceof Response) return err;
    console.error("/api/gmail/connect error:", err);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}
