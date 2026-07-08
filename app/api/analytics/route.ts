import { NextRequest, NextResponse } from "next/server";
import { requireAuthUser } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import GmailAccount from "@/models/GmailAccount";
import EmailLog from "@/models/EmailLog";
import mongoose from "mongoose";

export async function GET(req: NextRequest) {
  try {
    const user = await requireAuthUser(req);
    const userId = new mongoose.Types.ObjectId(user.id);
    await connectDB();

    // Fetch connected Gmail accounts
    const accounts = await GmailAccount.find({ userId });
    
    // Fetch daily cap usage for each connected account
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const caps = await Promise.all(
      accounts.map(async (account) => {
        const sentCount = await EmailLog.countDocuments({
          from: account.gmailEmail,
          status: "sent",
          createdAt: { $gte: oneDayAgo }
        });
        const isWorkspace = !account.gmailEmail.endsWith("@gmail.com") && !account.gmailEmail.endsWith("@googlemail.com");
        const limit = isWorkspace ? 2000 : 500;
        return {
          email: account.gmailEmail,
          sentCount,
          limit,
          connected: account.connected
        };
      })
    );

    // Fetch send volume for the last 7 days (grouped by date)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6); // Cover exactly 7 days including today
    sevenDaysAgo.setHours(0, 0, 0, 0);

    const volumeData = await EmailLog.aggregate([
      {
        $match: {
          userId,
          createdAt: { $gte: sevenDaysAgo }
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          sent: { $sum: { $cond: [{ $eq: ["$status", "sent"] }, 1, 0] } },
          failed: { $sum: { $cond: [{ $eq: ["$status", "failed"] }, 1, 0] } }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Fill in missing dates with zero values so the frontend always has exactly 7 days
    const volumeMap = new Map(volumeData.map((d: any) => [d._id, { sent: d.sent, failed: d.failed }]));
    const formattedVolume = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split("T")[0];
      const stats = volumeMap.get(dateStr) ?? { sent: 0, failed: 0 };
      
      // Format date label (e.g. "Jul 08")
      const label = d.toLocaleDateString("en-US", { month: "short", day: "2-digit" });
      
      formattedVolume.push({
        date: dateStr,
        label,
        sent: stats.sent,
        failed: stats.failed
      });
    }

    return NextResponse.json({
      success: true,
      data: {
        caps,
        volume: formattedVolume
      }
    });
  } catch (err) {
    if (err instanceof Response) return err;
    console.error("/api/analytics GET error:", err);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}
