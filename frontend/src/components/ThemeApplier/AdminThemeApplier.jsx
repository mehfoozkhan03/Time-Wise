import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";


import { getAdminTheme } from "../../store/adminThemeSlice";

export const AdminThemeApplier = () => {
  const dispatch = useDispatch();

  const theme = useSelector((state) => state.adminTheme.theme);

  // Load admin theme from backend
  useEffect(() => {
    dispatch(getAdminTheme());
  }, [dispatch]);

  // Apply theme
  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");

    const applyTheme = () => {
      let finalTheme;

      if (theme === "system") {
        finalTheme = media.matches ? "dark" : "light";
      } else {
        finalTheme = theme;
      }

      document.documentElement.classList.remove("light", "dark");

      document.documentElement.classList.add(finalTheme);
    };

    applyTheme();

    media.addEventListener("change", applyTheme);

    return () => {
      media.removeEventListener("change", applyTheme);
    };
  }, [theme]);

  return null;
};
