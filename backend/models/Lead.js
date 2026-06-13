import mongoose from "mongoose";

const leadSchema = new mongoose.Schema(
  {
    companyName: {
      type: String,
      required: true,
      trim: true,
    },
    companyId: {
      type: String,
      required: true,
      trim: true,
    },
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },
    verticalType: {
      type: String,
      required: true,
      trim: true,
    },
    country: {
      type: String,
      required: true,
      trim: true,
    },
    state: {
      type: String,
      trim: true,
    },
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    noOfPeople: {
      type: Number,
      min: 1,
    },
    mobileNumber: {
      type: String,
    },
    email: {
      type: String,
      lowercase: true,
      trim: true,
      match: [/.+\@.+\..+/, "Invalid email address"],
    },
    startDate: {
      type: Date,
      required: true,
    },
    source: {
      type: String,
      required: true,
      trim: true,
      enum: ["nomad", "website"],
    },
    productType: {
      type: String,
      required: true,
      trim: true,
    },
    endDate: {
      type: Date,
      validate: {
        validator: function (value) {
          return !this.startDate || value >= this.startDate;
        },
        message: "End date must be greater than or equal to start date",
      },
    },
    comment: {
      type: String,
      trim: true,
      default: "",
    },
    status: {
      type: String,
      default: "Pending",
      enum: ["Pending", "Contacted", "In Progress", "Converted", "Lost"],
    },
  },
  { timestamps: true }
);

export default mongoose.model("Lead", leadSchema);
