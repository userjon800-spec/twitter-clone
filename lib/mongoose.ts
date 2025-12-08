import mongoose, { ConnectOptions } from "mongoose";

type Cached = {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
};

declare global {
  // eslint-disable-next-line no-var
  var _mongoose: Cached | undefined;
}

const MONGO_URI = process.env.MONGO_URI;

export const connectToDatabase = async () => {
  mongoose.set("strictQuery", true);

  if (!MONGO_URI) {
    throw new Error("Mongo uri is not defined");
  }

  if (!global._mongoose) {
    global._mongoose = { conn: null, promise: null };
  }

  const cached = global._mongoose;

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const options: ConnectOptions = {
      dbName: "twitter-x",
      autoCreate: true,
    };
    cached.promise = mongoose
      .connect(MONGO_URI, options)
      .then((m) => {
        cached.conn = m;
        console.log("Connected to MongoDB");
        return m;
      })
      .catch((err) => {
        // Reset promise so future attempts can retry
        cached.promise = null;
        console.error("Mongoose connect error:", err);
        throw err;
      });
  }

  return cached.promise;
};
