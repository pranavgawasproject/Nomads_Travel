import mongoose from "mongoose";

const connectDb = async (url) => {
  if (!url || url.includes("replace_with") || url.includes("<username>")) {
    console.warn("⚠️  MongoDB URL is missing or using placeholder! Server starting in degraded/offline mode.");
    return;
  }
  try {
    await mongoose.connect(url);
    console.log("✅ Successfully connected to the database");
  } catch (err) {
    console.error("❌ Failed to connect to MongoDB:", err.message);
    console.warn("⚠️  Starting server in offline/degraded mode (database operations will fail).");
  }
};

export default connectDb;