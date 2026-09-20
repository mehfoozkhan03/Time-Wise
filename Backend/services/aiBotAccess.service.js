import { AIBotAccessModel } from "../models/AIBotAccess.model.js";
import { userModel } from "../models/User.model.js";

export const getAccessSettings = async (adminID) =>
  AIBotAccessModel.findOneAndUpdate(
    { adminID },
    { $setOnInsert: { adminID } },
    { new: true, upsert: true, setDefaultsOnInsert: true },
  );

export const getUserAIBotAccess = async (userID) => {
  const user = await userModel.findById(userID).select("email adminID").lean();
  if (!user?.adminID) return { blocked: false };

  const settings = await AIBotAccessModel.findOne({ adminID: user.adminID }).lean();
  if (!settings || settings.mode === "enabled") return { blocked: false };
  if (settings.mode === "disabled_all") return { blocked: true };

  const blocked = settings.blockedEmails.includes(String(user.email).toLowerCase());
  return { blocked };
};
