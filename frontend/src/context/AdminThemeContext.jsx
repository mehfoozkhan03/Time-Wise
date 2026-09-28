import { createContext, useContext, useEffect, useState } from "react";

const AdminThemeContext = createContext();

export const AdminThemeProvider = ({ children }) => {
  const [adminTheme, setAdminTheme] = useState(() => {
    return localStorage.getItem("adminTheme") || "system";
  });

  const applyAdminTheme = (theme) => {
    const html = document.documentElement;

    if (theme === "dark") {
      html.classList.add("dark");
    } else if (theme === "light") {
      html.classList.remove("dark");
    } else {
      const systemDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;

      if (systemDark) {
        html.classList.add("dark");
      } else {
        html.classList.remove("dark");
      }
    }
  };

  const changeAdminTheme = (theme) => {
    setAdminTheme(theme);
    localStorage.setItem("adminTheme", theme);
  };

  useEffect(() => {
    applyAdminTheme(adminTheme);
  }, [adminTheme]);

  useEffect(() => {
    if (adminTheme !== "system") return;

    const mediaQuery = window.matchMedia(
      "(prefers-color-scheme: dark)"
    );

    const handleSystemThemeChange = () => {
      applyAdminTheme("system");
    };

    mediaQuery.addEventListener("change", handleSystemThemeChange);

    return () => {
      mediaQuery.removeEventListener(
        "change",
        handleSystemThemeChange
      );
    };
  }, [adminTheme]);

  // Restore user theme when leaving admin panel
  useEffect(() => {
    return () => {
      const userTheme =
        localStorage.getItem("theme") || "system";

      const html = document.documentElement;

      if (userTheme === "dark") {
        html.classList.add("dark");
      } else if (userTheme === "light") {
        html.classList.remove("dark");
      } else {
        const systemDark = window.matchMedia(
          "(prefers-color-scheme: dark)"
        ).matches;

        if (systemDark) {
          html.classList.add("dark");
        } else {
          html.classList.remove("dark");
        }
      }
    };
  }, []);

  return (
    <AdminThemeContext.Provider
      value={{
        adminTheme,
        changeAdminTheme,
      }}
    >
      {children}
    </AdminThemeContext.Provider>
  );
};

export const useAdminTheme = () => {
  return useContext(AdminThemeContext);
};