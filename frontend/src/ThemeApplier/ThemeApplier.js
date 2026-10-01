import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getTheme } from "../store/themeSlice";

export const ThemeApplier = () => {
  const dispatch = useDispatch();

  const theme = useSelector((state) => state.theme.theme);

  // Load saved theme from backend
  useEffect(() => {
    dispatch(getTheme());
  }, [dispatch]);

  // Apply theme to the document
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

  // return null;
};
