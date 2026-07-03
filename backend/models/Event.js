import mongoose from "mongoose";

const eventSchema = new mongoose.Schema(
  {
    serialNumber: {
      type: String,
      trim: true,
      default: "",
    },
    link: {
      type: String,
      trim: true,
      default: "",
    },
    mainImage: {
      type: String,
      trim: true,
      default: "",
    },
    eventName: {
      type: String,
      required: true,
      trim: true,
    },
    shortDescription: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      trim: true,
      default: "",
    },
    month: {
      type: String,
      trim: true,
      default: "",
    },
    venue: {
      type: String,
      trim: true,
      default: "",
    },
    destination: {
      type: String,
      required: true,
      trim: true,
    },
    eventType: {
      type: String,
      trim: true,
      default: "",
    },
    sections: [
      {
        title: { type: String, default: "" },
        image: { type: String, default: "" },
        content: { type: String, default: "" },
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
    attendees: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "NomadUser",
      },
    ],
    discussions: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "NomadUser",
          required: true,
        },
        userName: {
          type: String,
          required: true,
        },
        comment: {
          type: String,
          required: true,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  { timestamps: true },
);

eventSchema.index({ destination: 1 });

const Event = mongoose.model("Event", eventSchema, "events");

export default Event;
