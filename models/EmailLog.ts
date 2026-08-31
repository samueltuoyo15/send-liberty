import mongoose, { Schema, Document, Model } from "mongoose";

export interface IEmailLogDebugStep {
  key: string;
  label: string;
  ok: boolean;
  skipped?: boolean;
  detail: string;
}

export interface IEmailLogDebugIssue {
  severity: "warning" | "error";
  code: string;
  title: string;
  hint: string;
}

export interface IEmailLogDebug {
  health: "healthy" | "warnings" | "failed";
  steps: IEmailLogDebugStep[];
  issues: IEmailLogDebugIssue[];
  htmlBytes?: number;
  templateSlug?: string;
}

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
  templateSlug?: string;
  debug?: IEmailLogDebug;
  expiresAt: Date;
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
    templateSlug: { type: String, index: true },
    debug: {
      health: { type: String, enum: ["healthy", "warnings", "failed"] },
      steps: [
        {
          key: { type: String },
          label: { type: String },
          ok: { type: Boolean },
          skipped: { type: Boolean },
          detail: { type: String },
        },
      ],
      issues: [
        {
          severity: { type: String, enum: ["warning", "error"] },
          code: { type: String },
          title: { type: String },
          hint: { type: String },
        },
      ],
      htmlBytes: { type: Number },
      templateSlug: { type: String },
    },
    expiresAt: { type: Date, required: true, index: { expireAfterSeconds: 0 } },
  },
  { timestamps: true }
);

const EmailLog: Model<IEmailLog> =
  mongoose.models.EmailLog ?? mongoose.model<IEmailLog>("EmailLog", EmailLogSchema);

export default EmailLog;
