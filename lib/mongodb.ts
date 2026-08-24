import mongoose from "mongoose";

const globalForMongo = globalThis as unknown as {
  mongooseConn?: typeof mongoose;
  mongoosePromise?: Promise<typeof mongoose>;
};

export function mongoUri() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error(
      "MONGODB_URI is missing. Add your MongoDB Atlas connection string to .env (and Vercel env vars).",
    );
  }
  return uri;
}

export async function connectDB() {
  if (globalForMongo.mongooseConn?.connection.readyState === 1) {
    return globalForMongo.mongooseConn;
  }
  if (!globalForMongo.mongoosePromise) {
    globalForMongo.mongoosePromise = mongoose.connect(mongoUri());
  }
  globalForMongo.mongooseConn = await globalForMongo.mongoosePromise;
  return globalForMongo.mongooseConn;
}
