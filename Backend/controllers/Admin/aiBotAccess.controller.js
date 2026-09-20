import { userModel } from "../../models/User.model.js";
import { getAccessSettings } from "../../services/aiBotAccess.service.js";

const MODES = new Set(["enabled", "disabled_all", "disabled_selected"]);

export const getAIBotAccessSettings = async (req, res) => {
  try {
    const settings = await getAccessSettings(req.admin.adminID);
    return res.status(200).json({ success: true, settings });
  } catch (error) {
    console.error("Get AI bot access settings error:", error);
    return res.status(500).json({ success: false, message: "Unable to load WiseBot access settings." });
  }
};

export const updateAIBotAccessSettings = async (req, res) => {
  try {
    const mode = req.body?.mode;
    const requestedCount = Number(req.body?.blockedCount || 0);
    const rawEmails = Array.isArray(req.body?.blockedEmails) ? req.body.blockedEmails : [];

    if (!MODES.has(mode)) {
      return res.status(400).json({ success: false, message: "Choose a valid WiseBot access option." });
    }

    const emails = [...new Set(rawEmails.map((email) => String(email).trim().toLowerCase()).filter(Boolean))];

    if (mode === "disabled_selected") {
      if (!Number.isInteger(requestedCount) || requestedCount < 1 || requestedCount !== emails.length) {
        return res.status(400).json({ success: false, message: "Enter the requested number of unique employee email addresses." });
      }

      const employees = await userModel.find({
        adminID: req.admin.adminID,
        email: { $in: emails },
      }).select("email").lean();

      if (employees.length !== emails.length) {
        return res.status(400).json({ success: false, message: "One or more email addresses do not belong to an employee in your organisation." });
      }
    }

    const settings = await getAccessSettings(req.admin.adminID);
    settings.mode = mode;
    settings.blockedEmails = mode === "disabled_selected" ? emails : [];
    await settings.save();

    return res.status(200).json({ success: true, message: "WiseBot access updated.", settings });
  } catch (error) {
    console.error("Update AI bot access settings error:", error);
    return res.status(500).json({ success: false, message: "Unable to save WiseBot access settings." });
  }
};
