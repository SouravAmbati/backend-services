import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI;
    await mongoose.connect(uri);
    console.log("✅ Connected to MongoDB Replica Set for Cart Service");
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err);
    process.exit(1);
  }
};
