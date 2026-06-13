import mongoose from "mongoose";

const testpoc = new mongoose.Schema(
  {
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      // required: true,
    },
    name: {
      type: String,
    },
    companyId: {
      type: String,
      // unique: true,
      // required: true,
      trim: true,
    },
    designation: {
      type: String,
    },
    email: {
      type: String,
      // unique: true,
    },
    phone: {
      type: String,
    },
    linkedInProfile: {
      type: String,
    },
    languagesSpoken: {
      type: [String],
    },
    address: {
      type: String,
    },
    profileImage: {
      type: String,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    availibilityTime: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const TestPointOfContactInsert = mongoose.model("TestPointOfContactInsert", testpoc);
export default TestPointOfContactInsert;
