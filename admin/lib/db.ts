import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_URI ?? "mongodb://127.0.0.1:27017/lex-david";

declare global {
  // eslint-disable-next-line no-var
  var _mongooseConn: mongoose.Connection | null;
}

let cached = global._mongooseConn ?? null;

export async function connectDB() {
  if (cached && cached.readyState === 1) return cached;
  await mongoose.connect(MONGO_URI);
  cached = mongoose.connection;
  global._mongooseConn = cached;
  return cached;
}
