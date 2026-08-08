import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI!;

declare global {
  var _mongooseConn: typeof mongoose | null;
  var _mongoosePromise: Promise<typeof mongoose> | null;
}

export async function connectDB(): Promise<typeof mongoose> {
  // Return existing ready connection immediately
  if (global._mongooseConn && mongoose.connection.readyState === 1) {
    return global._mongooseConn;
  }

  // If a connection is already in-flight, wait for it (prevents race on cold start)
  if (!global._mongoosePromise) {
    global._mongoosePromise = mongoose
      .connect(MONGODB_URI, { bufferCommands: false })
      .then((m) => {
        global._mongooseConn = m;
        global._mongoosePromise = null;
        return m;
      })
      .catch((err) => {
        global._mongoosePromise = null;
        throw err;
      });
  }

  return global._mongoosePromise;
}
