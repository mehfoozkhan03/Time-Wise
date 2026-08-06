/* =========================================
   Employee Initials
========================================= */

export const getInitials = (name = "") => {
  const parts = name.trim().split(/\s+/).filter(Boolean);

  if (parts.length === 0) {
    return "--";
  }

  return parts
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
};

/* =========================================
   Capitalize First Letter
========================================= */

export const capitalize = (text = "") => {
  const value = text.trim();

  if (!value) {
    return "";
  }

  return value.charAt(0).toUpperCase() + value.slice(1);
};

/* =========================================
   Truncate Long Text
========================================= */

export const truncate = (text = "", maxLength = 30) => {
  if (text.length <= maxLength) {
    return text;
  }

  return text.slice(0, maxLength - 3) + "...";
};

/* =========================================
   Generate Avatar Color
========================================= */

const AVATAR_COLORS = [
  "#3B82F6",
  "#8B5CF6",
  "#06B6D4",
  "#10B981",
  "#F59E0B",
  "#EF4444",
  "#EC4899",
  "#14B8A6",
];

export const getAvatarColor = (text = "") => {
  if (!text.trim()) {
    return AVATAR_COLORS[0];
  }

  let hash = 0;

  for (let i = 0; i < text.length; i++) {
    hash = text.charCodeAt(i) + ((hash << 5) - hash);
  }

  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
};
