import mongoose from "mongoose";

const activityFeedSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "NomadUser",
      required: true,
    },
    action: {
      type: String,
      required: true,
      enum: ["FOLLOW", "UNFOLLOW", "RSVP", "COMMENT", "FAVORITE_DESTINATION", "POST_THREAD"],
    },
    targetUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "NomadUser",
    },
    targetEvent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
    },
    targetDestination: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "StateWiseWeight",
    },
    details: {
      type: String,
      trim: true,
      default: "",
    },
  },
  { timestamps: true }
);

export default mongoose.model("ActivityFeed", activityFeedSchema);
