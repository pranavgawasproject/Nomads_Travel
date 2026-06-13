import mongoose from "mongoose";
import NomadUser from "../models/NomadUser.js";
import StateWiseWeight from "../models/StateWiseWeight.js";
import bcrypt from "bcrypt";

const normalizeFavoriteDestinationImages = (destination = {}) => {
  const rawImages =
    destination.images instanceof Map
      ? Object.fromEntries(destination.images)
      : destination.images && typeof destination.images === "object"
        ? destination.images
        : {};
  const images = Object.fromEntries(
    Object.entries(rawImages).map(([slotKey, image]) => [
      slotKey,
      typeof image === "string"
        ? { url: image, s3Key: "" }
        : {
            url: String(image?.url || image?.imageUrl || "").trim(),
            s3Key: String(image?.s3Key || "").trim(),
          },
    ]),
  );

  const imageUrls = Object.values(images)
    .map((image) => image?.url)
    .filter(Boolean);

  const fallbackImageUrls = Array.isArray(destination.imageUrls)
    ? destination.imageUrls.filter(Boolean)
    : typeof destination.imageUrl === "string" && destination.imageUrl.trim()
      ? [destination.imageUrl.trim()]
      : typeof destination.imagelink === "string" && destination.imagelink.trim()
        ? [destination.imagelink.trim()]
        : [];

  const resolvedImageUrls = imageUrls.length ? imageUrls : fallbackImageUrls;
  const resolvedImageUrl = resolvedImageUrls.length
    ? resolvedImageUrls[Math.floor(Math.random() * resolvedImageUrls.length)]
    : "";

  return {
    ...destination,
    images,
    imageUrls: resolvedImageUrls,
    imageUrl: resolvedImageUrl,
  };
};

export const getUsers = async (req, res, next) => {
  try {
    const { userId } = req.query;
    let query = {};

    if (userId) {
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({
          message: "Invalid Id provided",
        });
      }
      query._id = userId;
    }

    const users = await NomadUser.find(query).populate([
      { path: "saves", select: "" },
      { path: "likes", select: "" },
      { path: "favoriteDestination", select: "" },
    ]);

    if (!users || !users.length) {
      return res.status(400).json({
        message: "No users found",
      });
    }

    return res.status(200).json(users);
  } catch (error) {
    console.error("[getUsers] error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const updateProfile = async (req, res) => {
  try {
    console.log("profile");
    const { userId } = req.params;
    const {
      fullName,
      country,
      state,
      salary,
      designation,
      contactCode,
      contactNumber,
    } = req.body;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const user = await NomadUser.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (fullName) user.fullName = fullName.trim();
    if (country) user.country = country.trim();
    if (state) user.state = state.trim();
    if (salary) user.salary = salary.trim();
    if (designation) user.designation = designation.trim();
    if (contactCode) user.contactCode = contactCode.trim();
    if (contactNumber) user.contactNumber = contactNumber.trim();

    const updatedUser = await user.save();

    return res.status(200).json({
      message: "Profile updated successfully",
      user: {
        id: updatedUser._id,
        fullName: updatedUser.fullName,
        email: updatedUser.email,
        country: updatedUser.country,
        state: updatedUser.state,
        salary: updatedUser.salary,
        designation: updatedUser.designation,
        contactCode: updatedUser.contactCode,
        contactNumber: updatedUser.contactNumber,
      },
    });
  } catch (error) {
    console.error("[updateProfile] error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const changePassword = async (req, res) => {
  try {
    const { userId } = req.params;
    const { oldPassword, newPassword, confirmPassword } = req.body;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    if (!oldPassword || !newPassword || !confirmPassword) {
      return res
        .status(400)
        .json({ message: "Current, new and confirm passwords are required" });
    }

    if (newPassword !== confirmPassword) {
      return res
        .status(400)
        .json({ message: "New and confirm password doesn't match" });
    }

    const user = await NomadUser.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Incorrect current password" });
    }

    if (newPassword.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters long" });
    }
    if (newPassword.length > 72) {
      return res
        .status(400)
        .json({ message: "Password cannot exceed 72 characters" });
    }

    // const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = newPassword;
    // user.refreshToken = "";
    await user.save();

    // res.clearCookie("roamiqCookie", {
    //   httpOnly: true,
    //   sameSite: "None",
    //   secure: true,
    // });

    return res.status(200).json({ message: "Password changed successfully" });
  } catch (error) {
    console.error("[changePassword] error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const saveListings = async (req, res, next) => {
  try {
    const { listingId, userId, isSaved } = req.body;

    if (!listingId || !userId || typeof isSaved !== "boolean") {
      return res.status(400).json({ message: "Missing or invalid fields" });
    }

    let updatedUser;

    if (isSaved) {
      // Add to likes
      updatedUser = await NomadUser.findByIdAndUpdate(
        userId,
        { $addToSet: { saves: listingId } },
        { new: true },
      );
    } else {
      // Remove from likes
      updatedUser = await NomadUser.findByIdAndUpdate(
        userId,
        { $pull: { saves: listingId } },
        { new: true },
      );
    }

    if (!updatedUser) {
      return res.status(400).json({ message: "Failed to update saves" });
    }

    return res.status(200).json({
      message: isSaved ? "You saved" : "You unsaved",
    });
  } catch (error) {
    next(error);
  }
};

export const getUserSaves = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid userId" });
    }

    const user = await NomadUser.findById(userId)
      .populate({ path: "saves" })
      .lean();

    if (!user || !user.saves?.length) {
      return res.status(200).json([]);
    }

    return res.status(200).json(user.saves);
  } catch (error) {
    console.error("[getLikes] error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getSaves = async (req, res) => {
  try {
    const users = await NomadUser.find().populate({ path: "saves" }).lean();

    if (!users || users.length === 0) {
      return res.status(200).json([]);
    }

    const allSaves = users.flatMap((user) => user.saves || []);

    return res.status(200).json(allSaves);
  } catch (error) {
    console.error("[getSaves] error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getUserLikes = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid userId" });
    }

    const user = await NomadUser.findById(userId)
      .populate({ path: "likes" })
      .lean();

    if (!user || !user.likes?.length) {
      return res.status(200).json([]);
    }

    // ✅ Return a flat array of liked companies
    return res.status(200).json(user.likes);
  } catch (error) {
    console.error("[getLikes] error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getLikes = async (req, res) => {
  try {
    const users = await NomadUser.find().populate({ path: "likes" }).lean();

    if (!users || users.length === 0) {
      return res.status(200).json([]);
    }

    const allLikes = users.flatMap((user) => user.likes || []);

    return res.status(200).json(allLikes);
  } catch (error) {
    console.error("[getLikes] error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getUserFavoriteDestinations = async (req, res) => {
  try {
    const { userId } = req.params;
    const authenticatedUserId = req.userData?._id?.toString();

    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid userId" });
    }

    if (!authenticatedUserId || authenticatedUserId !== userId) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const user = await NomadUser.findById(userId)
      .populate({ path: "favoriteDestination" })
      .lean();

    if (!user || !user.favoriteDestination?.length) {
      return res.status(200).json([]);
    }

    return res
      .status(200)
      .json(user.favoriteDestination.map(normalizeFavoriteDestinationImages));
  } catch (error) {
    console.error("[getUserFavoriteDestinations] error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const favoriteDestinations = async (req, res, next) => {
  try {
    const { destinationId, isFavorited } = req.body;
    const userId = req.userData?._id;

    if (
      !destinationId ||
      !userId ||
      typeof isFavorited !== "boolean" ||
      !mongoose.Types.ObjectId.isValid(destinationId)
    ) {
      return res.status(400).json({ message: "Missing or invalid fields" });
    }

    const destinationExists = await StateWiseWeight.exists({
      _id: destinationId,
    });

    if (!destinationExists) {
      return res.status(404).json({ message: "Destination not found" });
    }

    let updatedUser;

    if (isFavorited) {
      updatedUser = await NomadUser.findByIdAndUpdate(
        userId,
        { $addToSet: { favoriteDestination: destinationId } },
        { new: true },
      );
    } else {
      updatedUser = await NomadUser.findByIdAndUpdate(
        userId,
        { $pull: { favoriteDestination: destinationId } },
        { new: true },
      );
    }

    if (!updatedUser) {
      return res
        .status(400)
        .json({ message: "Failed to update favorite destinations" });
    }

    return res.status(200).json({
      message: isFavorited
        ? "Destination added to favorites"
        : "Destination removed from favorites",
      favoriteDestination: updatedUser.favoriteDestination,
    });
  } catch (error) {
    next(error);
  }
};

export const likeListings = async (req, res, next) => {
  try {
    const { listingId, userId, isLiked } = req.body;

    if (!listingId || !userId || typeof isLiked !== "boolean") {
      return res.status(400).json({ message: "Missing or invalid fields" });
    }

    let updatedUser;

    if (isLiked) {
      // Add to likes
      updatedUser = await NomadUser.findByIdAndUpdate(
        userId,
        { $addToSet: { likes: listingId } },
        { new: true },
      );
    } else {
      // Remove from likes
      updatedUser = await NomadUser.findByIdAndUpdate(
        userId,
        { $pull: { likes: listingId } },
        { new: true },
      );
    }

    if (!updatedUser) {
      return res.status(400).json({ message: "Failed to update likes" });
    }

    return res.status(200).json({
      message: isLiked ? "You liked" : "You unliked",
      likes: updatedUser.likes,
    });
  } catch (error) {
    next(error);
  }
};
