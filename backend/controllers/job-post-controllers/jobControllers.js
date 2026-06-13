import JobPost from "../../models/job-post/JobPost.js";
import JobCategory from "../../models/job-post/JobPostCategory.js";

export const addNewJobPost = async (req, res, next) => {
  try {
    const {
      categoryId,
      title,
      about,
      responsibilities,
      qualifications,
      mode,
      location,
      type,
    } = req.body;

    const category = await JobCategory.findById(categoryId).exec();
    if (!category) {
      return res.status(404).json({ message: "Job category not found" });
    }

    const normalizeArray = (input) => {
      if (!input) return [];
      if (Array.isArray(input)) {
        return input.map((item) => String(item).trim()).filter(Boolean);
      }
      return String(input)
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);
    };

    const newJob = await JobPost.create({
      title,
      category: categoryId,
      about: String(about || "").trim(),
      responsibilities: normalizeArray(responsibilities),
      qualifications: normalizeArray(qualifications),
      jobMode: mode,
      jobType: type,
      location,
      isActive: true,
    });

    return res.status(201).json({
      message: "Job post created successfully",
      jobPost: newJob,
    });
  } catch (error) {
    next(error);
  }
};

export const getJobPosts = async (req, res, next) => {
  try {
    const allActiveJobPosts = await JobCategory.aggregate([
      { $match: { isActive: true } },
      {
        $lookup: {
          from: "jobposts",
          localField: "_id",
          foreignField: "category",
          as: "jobPosts",
        },
      },
      {
        $addFields: {
          jobPosts: {
            $filter: {
              input: "$jobPosts",
              as: "jp",
              cond: { $eq: ["$$jp.isActive", true] }, // Only keep active posts
            },
          },
        },
      },
    ]);
    res.status(200).json(allActiveJobPosts);
  } catch (error) {
    next(error);
  }
};

export const updateJobPost = async (req, res, next) => {
  try {
    const { jobId } = req.params;

    // Normalize array fields
    const normalizeArray = (input) => {
      if (!input) return [];
      if (Array.isArray(input)) {
        return input.map((item) => String(item).trim()).filter(Boolean);
      }
      return String(input)
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);
    };

    const updateData = { ...req.body };

    if ("responsibilities" in updateData) {
      updateData.responsibilities = normalizeArray(updateData.responsibilities);
    }
    if ("qualifications" in updateData) {
      updateData.qualifications = normalizeArray(updateData.qualifications);
    }

    const updatedJob = await JobPost.findOneAndUpdate(
      { _id: jobId },
      { $set: updateData },
      { new: true }
    ).exec();

    if (!updatedJob) {
      return res.status(404).json({ message: "Job post not found" });
    }

    return res.status(200).json({
      message: "Job post updated successfully",
      jobPost: updatedJob,
    });
  } catch (error) {
    next(error);
  }
};

export const deactivateJobPost = async (req, res, next) => {
  try {
    const { jobId } = req.params;
    await JobPost.findByIdAndUpdate(jobId, { isActive: false }).exec();
    return res
      .status(200)
      .json({ message: "Job posting deactivated successfully" });
  } catch (error) {
    next(error);
  }
};
