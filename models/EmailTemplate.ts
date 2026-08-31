import mongoose, { Schema, Document, Model } from "mongoose";

export type TemplateCategory = "auth" | "billing" | "account" | "custom";

export interface IEmailTemplate extends Document {
  userId: mongoose.Types.ObjectId;
  slug: string;
  name: string;
  category: TemplateCategory;
  description: string;
  subject: string;
  html: string;
  variables: string[];
  isDefault: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const EmailTemplateSchema = new Schema<IEmailTemplate>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    slug: { type: String, required: true, trim: true, lowercase: true },
    name: { type: String, required: true, trim: true, maxlength: 80 },
    category: {
      type: String,
      enum: ["auth", "billing", "account", "custom"],
      default: "custom",
    },
    description: { type: String, default: "", maxlength: 200 },
    subject: { type: String, required: true, maxlength: 998 },
    html: { type: String, required: true },
    variables: { type: [String], default: [] },
    isDefault: { type: Boolean, default: false },
  },
  { timestamps: true }
);

EmailTemplateSchema.index({ userId: 1, slug: 1 }, { unique: true });

const EmailTemplate: Model<IEmailTemplate> =
  mongoose.models.EmailTemplate ?? mongoose.model<IEmailTemplate>("EmailTemplate", EmailTemplateSchema);

export default EmailTemplate;
