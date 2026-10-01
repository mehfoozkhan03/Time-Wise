import { AdminModel } from "../../models/Admin.model.js";

// ================= GET ADMIN THEME =================

export const getAdminTheme = async (req, res) => {
  try {
    const admin = await AdminModel
      .findById(req.admin.adminID)
      .select("theme");

    if (!admin) {
      return res.status(404).json({
        success: false,
        title: "Admin Not Found",
        message: "No admin account was found.",
      });
    }

    return res.status(200).json({
      success: true,
      theme: admin.theme,
    });
  } catch (error) {
    console.error("Get Admin Theme Error:", error);

    return res.status(500).json({
      success: false,
      title: "Something Went Wrong",
      message: "Unable to get admin theme.",
      reason:
        process.env.NODE_ENV === "development"
          ? error.message
          : "Please try again later.",
    });
  }
};

// ================= UPDATE ADMIN THEME =================

export const updateAdminTheme = async (req, res) => {
  try {
    const { theme } = req.body;

    const allowedThemes = ["light", "dark", "system"];

    if (!allowedThemes.includes(theme)) {
      return res.status(400).json({
        success: false,
        title: "Invalid Theme",
        message: "The selected theme is not valid.",
        reason: `Please choose from: ${allowedThemes.join(", ")}`,
      });
    }

    const updatedAdmin = await AdminModel.findByIdAndUpdate(
      req.admin.adminID,
      { theme },
      {
        returnDocument: "after",
        runValidators: true,
      }
    );

    if (!updatedAdmin) {
      return res.status(404).json({
        success: false,
        title: "Admin Not Found",
        message: "No admin account was found.",
      });
    }

    return res.status(200).json({
      success: true,
      title: "Theme Updated",
      message: "Admin appearance settings have been saved.",
      theme: updatedAdmin.theme,
    });
  } catch (error) {
    console.error("Update Admin Theme Error:", error);

    return res.status(500).json({
      success: false,
      title: "Something Went Wrong",
      message: "Unable to update admin theme.",
      reason:
        process.env.NODE_ENV === "development"
          ? error.message
          : "Please try again later.",
    });
  }
};