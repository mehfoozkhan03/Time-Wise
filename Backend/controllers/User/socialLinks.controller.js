import { userModel } from "../../models/User.model.js";

// ================= Update Social Links =================
export const updateSocialLinks = async (req, res) => {
  try {
    const {
      linkedin = "",
      github = "",
      portfolio = "",
    } = req.body;

    const socialLinks = {
      linkedin: linkedin.trim(),
      github: github.trim(),
      portfolio: portfolio.trim(),
    };

    const updatedUser = await userModel.findByIdAndUpdate(
      req.user.userID,
      {
        $set: {
          socialLinks,
        },
      },
      {
        new: true,
        runValidators: true,
      }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        title: "User Not Found",
        message: "Your account could not be found.",
        reason: "The account may have been deleted or is inaccessible.",
      });
    }

    return res.status(200).json({
      success: true,
      title: "Social Links Updated",
      message: "Your social links have been updated successfully.",
      socialLinks: updatedUser.socialLinks,
    });
  } catch (error) {
    console.error("Update Social Links Error:", error);

    return res.status(500).json({
      success: false,
      title: "Update Failed",
      message: "Unable to update your social links.",
      reason:
        process.env.NODE_ENV === "development"
          ? error.message
          : "Please try again later.",
    });
  }
};