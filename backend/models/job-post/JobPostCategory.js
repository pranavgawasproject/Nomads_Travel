import mongoose from "mongoose";

const jobCategorySchema = new mongoose.Schema({
  categoryTitle: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
});

const JobCategory = mongoose.model("jobcategory", jobCategorySchema);
export default JobCategory;
