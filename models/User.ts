import mongoose, { Schema, Document, Model } from "mongoose";

export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  githubId?: string;
  googleId?: string;
  email?: string;
  displayName: string;
  avatar?: string;
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
  },
  { timestamps: true }
);

const User: Model<IUser> =
  mongoose.models.User ?? mongoose.model<IUser>("User", UserSchema);

export default User;
