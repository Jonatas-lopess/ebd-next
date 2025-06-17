import mongoose, { Mongoose } from "mongoose";

interface MongooseCache {
  conn: Mongoose | null;
  promise: Promise<Mongoose> | null;
}

declare global {
  var mongoose: MongooseCache;
}

let cached: MongooseCache = global.mongoose;

if (!cached) cached = global.mongoose = { conn: null, promise: null };

async function dbConnect(): Promise<Mongoose> {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(process.env.MONGODB_URI as string, {
        bufferCommands: false,
        autoCreate: false,
      })
      .then((mongooseInstance) => {
        console.log("✅ New MongoDB connection established");
        return mongooseInstance;
      })
      .catch((error) => {
        console.error(
          "❌ MongoDB connection error during initial connection:",
          error
        );

        cached.promise = null;
        throw error;
      });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;

    console.error("❌ MongoDB connection error while awaiting promise:", e);
    throw e;
  }

  if (!cached.conn)
    throw new Error("MongoDB connection failed and connection object is null.");

  return cached.conn;
}

export default dbConnect;
