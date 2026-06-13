import JobCategory from "../../models/job-post/JobPostCategory.js";
import JobPost from "../../models/job-post/JobPost.js";

export const addJobCategory = async (req, res, next) => {
  try {
    const { categoryTitle, description } = req.body;
    if (!categoryTitle) {
      return res.status(400).json({ message: "Category title is required" });
    }

    const jobcategory = new JobCategory({
      categoryTitle,
      description,
    });

    await jobcategory.save();
    return res.status(200).json({ message: "Job category added successfully" });
  } catch (error) {
    next(error);
  }
};

export const deactivateJobCategory = async (req, res, next) => {
  try {
    const { categoryId } = req.params;

    const category = await JobCategory.findById(categoryId).exec();
    if (!category) {
      return res.status(404).json({ message: "Job category not found" });
    }

    await Promise.all([
      JobCategory.findByIdAndUpdate(categoryId, { isActive: false }).exec(),
      JobPost.updateMany({ category: categoryId }, { isActive: false }).exec(),
    ]);

    return res
      .status(200)
      .json({ message: "Job category deactivated successfully" });
  } catch (error) {
    next(error);
  }
};
