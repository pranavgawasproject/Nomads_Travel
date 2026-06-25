import bcrypt from "bcrypt";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import NomadUser from "../../models/NomadUser.js";
import { sendMail } from "../../config/mailer.js";

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res
        .status(400)
        .json({ message: "Email and password are required" });

    const user = await NomadUser.findOne({
      email: email.trim().toLowerCase(),
    }).lean();

    if (!user)
      return res.status(401).json({ message: "Invalid email provided" });

    const isMatch = await bcrypt.compare(password, user.password || "");

    if (!isMatch)
      return res.status(401).json({ message: "Incorrect password provided" });

    delete user.password;
    delete user.refreshToken;

    const accessToken = jwt.sign(
      { userInfo: { ...user } },
      process.env.JWT_ACCESS_SECRET,
      { expiresIn: "1h" },
    );

    const refreshToken = jwt.sign(
      { userInfo: { ...user } },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: "15d" },
    );

    await NomadUser.findOneAndUpdate({ email }, { refreshToken }).lean().exec();

    res.cookie("roamiqCookie", refreshToken, {
      httpOnly: true,
      sameSite: "None",
      secure: true,
      maxAge: 15 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      status: "success",
      message: "Login successful",
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        country: user.country,
        countryOfResidence: user.countryOfResidence,
        contactCode: user.contactCode,
        contactNumber: user.contactNumber,
        saves: user.saves,
        likes: user.likes,
        favoriteDestination: user.favoriteDestination,
      },
      accessToken,
    });
  } catch (err) {
    console.error("Login error:", err.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const logout = async (req, res, next) => {
  try {
    const cookies = req.cookies;
    if (!cookies?.roamiqCookie) {
      return res.sendStatus(201);
    }

    const refreshToken = cookies?.roamiqCookie;
    const user = await NomadUser.findOne({ refreshToken }, { new: true });
    if (!user) {
      res.clearCookie("roamiqCookie", {
        httpOnly: true,
        sameSite: "None",
        secure: true,
      });
      return res.sendStatus(201);
    }

    await NomadUser.findOneAndUpdate({ refreshToken }, { refreshToken: "" })
      .lean()
      .exec();
    res.clearCookie("roamiqCookie", {
      httpOnly: true,
      sameSite: "None",
      secure: true,
    });
    res.status(200).json({ message: "Logged out" });
  } catch (error) {
    next(error);
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) return res.status(400).json({ message: "Email is required" });

    const user = await NomadUser.findOne({ email });
    if (!user)
      return res
        .status(404)
        .json({ message: "User not found with this email" });

    // Generate reset token
    const resetToken = user.getResetPasswordToken();
    await user.save({ validateBeforeSave: false });

    // Create reset URL (frontend route)
    // const resetUrl = `${process.env.FRONTEND_PROD_LINK}/reset-password/${resetToken}`;
    const resetUrl = `${process.env.FRONTEND_PROD_LINK}reset-password/${resetToken}`;

    const message = `
      <p>Hi ${user.name || ""},</p> 
      <p>You requested a password reset. Click below to reset your password:</p>
      <a href="${resetUrl}" target="_blank">Reset Password</a>
      <p>This link will expire in 15 minutes.</p>
      <p>If you didn’t request this, please ignore this email.</p>
    `;

    try {
      await sendMail({
        to: user.email,
        subject: "Password Reset Request",
        html: message,
      });

      res.status(200).json({
        success: true,
        message: "Password reset email sent successfully",
      });
    } catch (error) {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save({ validateBeforeSave: false });
      res.status(500).json({ message: "Email could not be sent" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const aiForgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) return res.status(400).json({ message: "Email is required" });

    const user = await NomadUser.findOne({ email });
    if (!user)
      return res
        .status(404)
        .json({ message: "User not found with this email" });

    // Generate reset token
    const resetToken = user.getResetPasswordToken();
    await user.save({ validateBeforeSave: false });

    // Create reset URL (frontend route)
    // const resetUrl = `${process.env.FRONTEND_PROD_LINK}/reset-password/${resetToken}`;
    const resetUrl = `${process.env.FRONTEND_PROD_LINK}ai-reset-password/${resetToken}`;

    const message = `
      <p>Hi ${user.name || ""},</p> 
      <p>You requested a password reset. Click below to reset your password:</p>
      <a href="${resetUrl}" target="_blank">Reset Password</a>
      <p>This link will expire in 15 minutes.</p>
      <p>If you didn’t request this, please ignore this email.</p>
    `;

    try {
      await sendMail({
        to: user.email,
        subject: "Password Reset Request",
        html: message,
      });

      res.status(200).json({
        success: true,
        message: "Password reset email sent successfully",
      });
    } catch (error) {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save({ validateBeforeSave: false });
      res.status(500).json({ message: "Email could not be sent" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password, confirmPassword } = req.body;

    if (!password || !confirmPassword)
      return res
        .status(400)
        .json({ message: "Password and Confirm Password are required" });

    if (password !== confirmPassword)
      return res.status(400).json({ message: "Passwords do not match" });

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters long" });
    }
    if (password.length > 72) {
      return res
        .status(400)
        .json({ message: "Password cannot exceed 72 characters" });
    }

    // Hash the reset token to find user
    const resetPasswordToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    const user = await NomadUser.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    }).select("+password");

    if (!user)
      return res
        .status(400)
        .json({ message: "Invalid or expired password reset token" });

    // ✅ Check if new password is same as old password
    const isSamePassword = await bcrypt.compare(password, user.password);
    if (isSamePassword)
      return res.status(400).json({
        message: "New password cannot be the same as the old password",
      });

    // ✅ Update password
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    // ✅ Send confirmation email
    const successMessage = `
      <p>Hi ${(user.fullName || user.name || "").split(" ")[0] || ""},</p>
      <p>Your password has been successfully reset.</p>
      <p>You can now <a href="${
        process.env.FRONTEND_DEV_LINK
      }login" target="_blank">Login</a> with your new password.</p>
      <p>If you did not perform this action, please contact us immediately.</p>
      <br/>
      <p>Best,<br/>The RoamIQ Team</p>
    `;

    try {
      await sendMail({
        to: user.email,
        subject: "Your Password Has Been Reset Successfully",
        html: successMessage,
      });
    } catch (error) {
      console.error(
        "⚠️ Password reset confirmation email failed:",
        error.message,
      );
    }

    res.status(200).json({
      success: true,
      message: "Password reset successful. A confirmation email has been sent.",
    });
  } catch (error) {
    console.error("Reset password error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
