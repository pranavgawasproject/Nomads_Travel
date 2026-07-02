import mongoose from "mongoose";

const connectDb = async (url) => {
  try {
    await mongoose.connect(url);
    console.log("successfully connected to the database");
  } catch {
    process.exit(1);
  }
};

export default connectDb;