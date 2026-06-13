import mongoose from "mongoose";

const jobPostSchema = new mongoose.Schema({
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "jobcategory",
  },
  title: {
    type: String,
  },
  about: {
    type: String,
    required: true,
  },
  responsibilities: [
    {
      type: String,
    },
  ],
  qualifications: [
    {
      type: String,
    },
  ],
  isActive: {
    type: Boolean,
    default: true,
  },
  jobType: {
    type: String,
  },
  jobMode: {
    type: String,
  },
  location: {
    type: String,
  },
});

const JobPost = mongoose.model("jobpost", jobPostSchema);
export default JobPost;
