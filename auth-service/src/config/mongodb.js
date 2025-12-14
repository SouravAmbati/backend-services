import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI ;
    await mongoose.connect(uri,{
        readPreference: 'primaryPreferred'
    });
    console.log("✅ Connected to MongoDB Replica Set");
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err);
    process.exit(1);
  }
};
