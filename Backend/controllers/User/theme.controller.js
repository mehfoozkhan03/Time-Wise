
// ================= Theme Update =================

export const updateTheme = async (req, res) => {
  try {
    const { theme } = req.body;

    // Validate theme
    const allowedThemes = ["light", "dark", "system"];

    if (!allowedThemes.includes(theme)) {
      return res.status(400).json({
        success: false,
        title: "Invalid Theme",
        message: "The selected theme is not valid.",
        reason: `Please choose from: ${allowedThemes.join(", ")}`,
      });
    }

    const updatedUser = await userModel.findByIdAndUpdate(
      req.user.userID,
      { theme },
      {
        returnDocument: "after",
        runValidators: true,
      },
    );

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        title: "Account Not Found",
        message: "No account was found.",
        reason: "Your account may have been deleted or is inaccessible.",
      });
    }

    return res.status(200).json({
      success: true,
      title: "Theme Updated",
      message: "Your appearance settings have been saved.",
      description: `Theme changed to ${updatedUser.theme}.`,
      reason: "Your preference has been successfully updated.",
      theme: updatedUser.theme,
    });
  } catch (error) {
    console.error("Update Theme Error:", error);

    // Check if it's a MongoDB connection error
    if (error.name === "MongooseError" || error.message.includes("connect")) {
      return res.status(500).json({
        success: false,
        title: "Database Connection Error",
        message: "Unable to connect to the database.",
        reason:
          "The server encountered a database issue. Please try again in a moment.",
      });
    }

    // Generic server error
    return res.status(500).json({
      success: false,
      title: "Something Went Wrong",
      message: "An unexpected error occurred while updating your theme.",
      reason:
        process.env.NODE_ENV === "development"
          ? error.message
          : "Please try again in a few moments.",
    });
  }
};
