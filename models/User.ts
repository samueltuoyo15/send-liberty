import mongoose, { Schema, Document, Model } from "mongoose";

export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  githubId?: string;
  googleId?: string;
  email?: string;
  displayName: string;
  avatar?: string;
  plan: "free" | "pro";
  subscriptionId?: string;
  subscriptionStatus?: "active" | "canceled" | "past_due" | "none";
  lastPaymentAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    githubId: { type: String, sparse: true, index: true },
    googleId: { type: String, sparse: true, index: true },
    email: { type: String, sparse: true, index: true },
    displayName: { type: String, required: true },
    avatar: { type: String },
    plan: { type: String, enum: ["free", "pro"], default: "free" },
    subscriptionId: { type: String },
    subscriptionStatus: { type: String, enum: ["active", "canceled", "past_due", "none"], default: "none" },
    lastPaymentAt: { type: Date },
  },
  { timestamps: true }
);

const User: Model<IUser> =
  mongoose.models.User ?? mongoose.model<IUser>("User", UserSchema);

export default User;
