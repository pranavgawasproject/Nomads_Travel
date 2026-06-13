import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
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
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "approved",
    },
    reviewer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "NomadUser",
    },
    // approvedBy: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "PointOfContact",
    // },
    // rejectedBy: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "PointOfContact",
    // },
    approvedBy: {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
      },
      userType: {
        type: String,
        enum: ["MASTER", "HOST"],
      },
    },
    rejectedBy: {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
      },
      userType: {
        type: String,
        enum: ["MASTER", "HOST"],
      },
    },

    approvedDate: {
      type: Date,
    },
    rejectedDate: {
      type: Date,
    },
  },
  {
    timestamps: true,
  },
);

const Review = mongoose.model("Review", reviewSchema);
export default Review;
