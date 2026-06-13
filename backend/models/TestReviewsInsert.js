import mongoose from "mongoose";

const testreviewinsert = new mongoose.Schema(
  {
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },
    companyId: {
      type: String,
      required: true,
      trim: true,
    },
    name: {
      type: String,
    },
    starCount: {
      type: Number,
      min: 1,
      max: 5,
    },
    description: {
      type: String,
    },
    reviewSource: {
      type: String,
    },
    reviewLink: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const TestReviewInsert = mongoose.model("TestReviewInsert", testreviewinsert);
export default TestReviewInsert;
