import mongoose, { Schema, Document, Model } from "mongoose";

export interface IEmailLog extends Document {
  userId: mongoose.Types.ObjectId;
  apiKeyId?: mongoose.Types.ObjectId;
  from?: string;
  to: string;
  subject: string;
  status: "sent" | "failed";
  provider: "gmail";
  messageId?: string;
  error?: string;
  createdAt: Date;
}

const EmailLogSchema = new Schema<IEmailLog>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    apiKeyId: { type: Schema.Types.ObjectId, ref: "ApiKey" },
    from: { type: String, sparse: true, index: true },
    to: { type: String, required: true },
    subject: { type: String, required: true },
    status: { type: String, enum: ["sent", "failed"], required: true },
    provider: { type: String, enum: ["gmail"], default: "gmail" },
    messageId: { type: String },
    error: { type: String },
  },
  { timestamps: true }
);

const EmailLog: Model<IEmailLog> =
  mongoose.models.EmailLog ?? mongoose.model<IEmailLog>("EmailLog", EmailLogSchema);

export default EmailLog;
