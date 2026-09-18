import { userModel } from "../../models/User.model.js";


export const updateEmergencyContact = async (req, res) => {
  try {
    const {
      name = "",
      relationship = "",
      phone = "",
      email = "",
    } = req.body;

    // Prepare emergency contact data
    const emergencyContact = {
      name: name.trim(),
      relationship: relationship.trim(),
      phone: phone.trim(),
      email: email.trim().toLowerCase(),
    };

    // Update the logged-in user's emergency contact
    const updatedUser = await userModel
      .findByIdAndUpdate(
        req.user.userID,
        {
          $set: {
            emergencyContact,
          },
        },
        {
          new: true,
          runValidators: true,
        }
      )
      .select("-password");

    // User not found
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
      title: "Emergency Contact Updated",
      message: "Your emergency contact has been updated successfully.",
      emergencyContact: updatedUser.emergencyContact,
    });
  } catch (error) {
    console.error("Update Emergency Contact Error:", error);

    return res.status(500).json({
      success: false,
      title: "Update Failed",
      message: "Unable to update your emergency contact.",
      reason:
        process.env.NODE_ENV === "development"
          ? error.message
          : "Please try again later.",
    });
  }
};