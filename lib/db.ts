import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI!;

let cached: typeof mongoose | null = null;
let connecting: Promise<typeof mongoose> | null = null;

export async function connectDB(): Promise<typeof mongoose> {
  if (cached && mongoose.connection.readyState === 1) return cached;

  if (!connecting) {
    connecting = mongoose
      .connect(MONGODB_URI)
      .then((m) => { cached = m; connecting = null; return m; })
      .catch((err) => { connecting = null; throw err; });
  }

  return connecting;
}
