import { userModel } from "../models/User.model.js";

export const getAnnouncementRecipients = async (announcement) => {
  const filter = {};

  switch (announcement.audience) {
    case "Everyone":
      // Send to all eligible users.
      break;

    case "Department":
      if (!announcement.department) {
        throw new Error("Department is required for this audience.");
      }

      filter.department = announcement.department;
      break;

    case "Role":
      if (!announcement.role) {
        throw new Error("Role is required for this audience.");
      }

      filter.role = announcement.role;
      break;

    case "Specific Employees":
      return announcement.specificEmployees || [];

    default:
      throw new Error(
        `Unsupported announcement audience: ${announcement.audience}`
      );
  }

  const users = await userModel
    .find(filter)
    .select("_id")
    .lean();

  return users.map((user) => user._id);
};
