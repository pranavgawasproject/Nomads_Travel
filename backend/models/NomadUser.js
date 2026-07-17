import mongoose from "mongoose";
import crypto from "crypto";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      trim: true,
      required: [true, "Full name is required"],
    },
    // Deprecated: firstName and lastName. Use fullName instead.
    firstName: {
      type: String,
      trim: true,
    },
    lastName: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Please use a valid email address"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters long"],
      maxlength: [72, "Password cannot exceed 72 characters"],
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    country: {
      type: String,
      trim: true,
    },
    countryOfResidence: {
      type: String,
      trim: true,
    },
    state: {
      type: String,
      trim: true,
    },
    salary: {
      type: String,
      trim: true,
    },
    designation: {
      type: String,
      trim: true,
    },
    contactCode: { type: String, trim: true, default: "" },
    contactNumber: { type: String, trim: true, required: true },
    saves: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Company",
      },
    ],
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Company",
      },
    ],
    favoriteDestination: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "StateWiseWeight",
      },
    ],
    refreshToken: {
      type: String,
    },
    githubUrl: {
      type: String,
      trim: true,
      default: "",
    },
    linkedinUrl: {
      type: String,
      trim: true,
      default: "",
    },
    twitterUrl: {
      type: String,
      trim: true,
      default: "",
    },
    portfolioUrl: {
      type: String,
      trim: true,
      default: "",
    },
    skills: {
      type: String,
      trim: true,
      default: "",
    },
    travelTimeline: [
      {
        city: { type: String, trim: true },
        country: { type: String, trim: true },
        dateFrom: { type: String, trim: true },
        dateTo: { type: String, trim: true },
        status: { type: String, trim: true }, // 'past' | 'current' | 'future'
      }
    ],
    followers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "NomadUser",
      },
    ],
    following: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "NomadUser",
      },
    ],
  },
  { timestamps: true },
);

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Compare entered password
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Generate reset token
userSchema.methods.getResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(20).toString("hex");

  // Hash and set to resetPasswordToken
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  // Set expiration time (15 min)
  this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

  return resetToken;
};

export default mongoose.model("NomadUser", userSchema);
