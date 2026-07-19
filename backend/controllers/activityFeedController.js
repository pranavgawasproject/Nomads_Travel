import ActivityFeed from "../models/ActivityFeed.js";

export const getActivityFeed = async (req, res, next) => {
  try {
    const { limit = 20, userId } = req.query;
    const query = {};

    if (userId) {
      query.user = userId;
    }

    const activities = await ActivityFeed.find(query)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit, 10))
      .populate("user", "fullName designation email")
      .populate("targetUser", "fullName designation")
      .populate("targetEvent", "eventName destination");

    return res.status(200).json(activities);
  } catch (error) {
    next(error);
  }
};

export const createActivity = async (req, res, next) => {
  try {
    const { user, action, targetUser, targetEvent, targetDestination, details } = req.body;

    if (!user || !action) {
      return res.status(400).json({ message: "User ID and action type are required." });
    }

    const activity = await ActivityFeed.create({
      user,
      action,
      targetUser: targetUser || null,
      targetEvent: targetEvent || null,
      targetDestination: targetDestination || null,
      details: details || "",
    });

    return res.status(201).json({
      message: "Activity logged successfully",
      activity,
    });
  } catch (error) {
    next(error);
  }
};
