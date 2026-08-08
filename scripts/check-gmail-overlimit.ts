/**
 * Admin Script: Check users who exceed the new free plan Gmail account cap (3)
 *
 * Usage:
 *   npx tsx scripts/check-gmail-overlimit.ts
 *
 * Requires MONGODB_URI to be set in .env or .env.production
 */

import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env.production") });
dotenv.config({ path: path.resolve(process.cwd(), ".env") });

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error("❌  MONGODB_URI is not set.");
  process.exit(1);
}

const FREE_LIMIT = 3;

const UserSchema = new mongoose.Schema({
  email: String,
  displayName: String,
  plan: String,
}, { timestamps: true });

const GmailAccountSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  gmailEmail: String,
  connected: Boolean,
}, { timestamps: true });

const User = mongoose.models.User ?? mongoose.model("User", UserSchema);
const GmailAccount = mongoose.models.GmailAccount ?? mongoose.model("GmailAccount", GmailAccountSchema);

async function main() {
  await mongoose.connect(MONGODB_URI!);
  console.log("✅  Connected to MongoDB\n");

  const results = await GmailAccount.aggregate([
    {
      $group: {
        _id: "$userId",
        totalAccounts: { $sum: 1 },
        connectedAccounts: { $sum: { $cond: ["$connected", 1, 0] } },
        emails: { $push: "$gmailEmail" },
      },
    },
    {
      $match: { totalAccounts: { $gt: FREE_LIMIT } },
    },
    {
      $lookup: {
        from: "users",
        localField: "_id",
        foreignField: "_id",
        as: "user",
      },
    },
    { $unwind: { path: "$user", preserveNullAndEmptyArrays: true } },
    {
      $project: {
        userId: "$_id",
        totalAccounts: 1,
        connectedAccounts: 1,
        emails: 1,
        userEmail: "$user.email",
        displayName: "$user.displayName",
        plan: "$user.plan",
      },
    },
    { $sort: { totalAccounts: -1 } },
  ]);

  if (results.length === 0) {
    console.log(`✅  No users exceed the free plan limit of ${FREE_LIMIT} Gmail accounts.\n`);
  } else {
    console.log(`⚠️   Found ${results.length} user(s) with more than ${FREE_LIMIT} Gmail accounts:\n`);
    console.log("─".repeat(80));
    for (const r of results) {
      const planBadge = r.plan === "pro" ? "🟢 PRO" : "🔴 FREE";
      console.log(`${planBadge}  ${r.displayName || "Unknown"} <${r.userEmail || "no email"}>`);
      console.log(`   User ID  : ${r.userId}`);
      console.log(`   Accounts : ${r.totalAccounts} total (${r.connectedAccounts} connected)`);
      console.log(`   Emails   : ${r.emails.join(", ")}`);
      console.log("─".repeat(80));
    }
  }

  console.log("\nSummary:");
  const freeOverlimit = results.filter(r => r.plan !== "pro");
  const proOverlimit = results.filter(r => r.plan === "pro");
  console.log(`  Free plan users over limit : ${freeOverlimit.length}`);
  console.log(`  Pro plan users over limit  : ${proOverlimit.length} (they're fine — limit is 50)`);

  await mongoose.disconnect();
  console.log("\n✅  Done.");
}

main().catch((err) => {
  console.error("Script failed:", err);
  process.exit(1);
});
