import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI as string;

if (!MONGODB_URI) {
  throw new Error("❌ MONGODB_URI is not defined in .env.local");
}

// Define a global cache to prevent multiple connections
interface MongooseCache {
  conn: mongoose.Connection | null;
  promise: Promise<mongoose.Connection> | null;
}

// Use 'as' to extend globalThis with a cache
const globalWithMongoose = global as typeof global & { mongoose?: MongooseCache };

if (!globalWithMongoose.mongoose) {
  globalWithMongoose.mongoose = { conn: null, promise: null };
}

const cached = globalWithMongoose.mongoose;

export async function connectDB(): Promise<mongoose.Connection> {
  if (cached.conn) return cached.conn; // Return existing connection

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(MONGODB_URI, {
        dbName: "todoDatabase",
        bufferCommands: false,
      })
      .then((mongoose) => mongoose.connection);
  }

  cached.conn = await cached.promise;
  return cached.conn;
}
