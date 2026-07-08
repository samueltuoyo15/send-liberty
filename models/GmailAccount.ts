import mongoose, { Schema, Document, Model } from "mongoose";

export interface IGmailAccount extends Document {
  userId: mongoose.Types.ObjectId;
  gmailEmail: string;
  encryptedAccessToken: string;
  encryptedRefreshToken: string;
  tokenExpiresAt: Date;
  connected: boolean;
  lastError?: string;
  createdAt: Date;
  updatedAt: Date;
}

const GmailAccountSchema = new Schema<IGmailAccount>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    gmailEmail: { type: String, required: true },
    encryptedAccessToken: { type: String, required: true },
    encryptedRefreshToken: { type: String, required: true },
    tokenExpiresAt: { type: Date, required: true },
    connected: { type: Boolean, default: true },
    lastError: { type: String },
  },
  { timestamps: true }
);

GmailAccountSchema.index({ userId: 1, gmailEmail: 1 }, { unique: true });

const GmailAccount: Model<IGmailAccount> =
  mongoose.models.GmailAccount ??
  mongoose.model<IGmailAccount>("GmailAccount", GmailAccountSchema);

export default GmailAccount;
