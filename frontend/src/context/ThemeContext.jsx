// import { createContext, useContext, useEffect, useState } from 'react'

// const ThemeContext = createContext()

// export function ThemeProvider({ children }) {
//   // const [theme, setTheme] = useState(() => {
//   //   return (
//   //     localStorage.getItem('theme') ||
//   //     (window.matchMedia('(prefers-color-scheme: dark)').matches
//   //       ? 'dark'
//   //       : 'light')
//   //   )
//   // })
//   const [theme, setTheme] = useState(() => {
//   const savedTheme = localStorage.getItem("theme");

//   if (savedTheme) {
//     return savedTheme;
//   }

//   return window.matchMedia("(prefers-color-scheme: dark)").matches
//     ? "dark"
//     : "light";
// });

//   useEffect(() => {
//     document.body.classList.toggle(
//       'dark_mode',

//       theme === 'dark',
//     )

//     localStorage.setItem('theme', theme)
//   }, [theme])

//   return (
//     <ThemeContext.Provider value={{ theme, setTheme }}>
//       {children}
//     </ThemeContext.Provider>
//   )
// }

// export function useTheme() {
//   return useContext(ThemeContext)
// }

import { createContext, useContext, useEffect } from "react";
import { updateTheme } from "../store/authSlice";
import { useDispatch, useSelector } from "react-redux";

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const dispatch = useDispatch();

  const user = useSelector((state) => state.auth.user);

  const changeTheme = (theme) => {
    dispatch(updateTheme(theme));
  };

  useEffect(() => {
<<<<<<< HEAD
    // if (!user) return;
=======
    if (!user) return;
>>>>>>> 2f5cb8235e940a7bee02d98a2a0eaab4a4b9edaf

    const media = window.matchMedia("(prefers-color-scheme: dark)");

    const applyTheme = () => {
<<<<<<< HEAD
      /*
       * If user is logged in:
       * use their saved theme.
       *
       * If user is not logged in:
       * follow the system theme.
       */

      let selectedTheme = user?.theme || "system";

      let finalTheme;

      if (selectedTheme === "system") {
        finalTheme = media.matches ? "dark" : "light";
      } else {
        finalTheme = selectedTheme;
=======
      let finalTheme = user.theme;

      if (user.theme === "system") {
        finalTheme = media.matches ? "dark" : "light";
>>>>>>> 2f5cb8235e940a7bee02d98a2a0eaab4a4b9edaf
      }

      document.documentElement.classList.remove("light", "dark");
      document.documentElement.classList.add(finalTheme);
    };

    applyTheme();

    media.addEventListener("change", applyTheme);

    return () => {
      media.removeEventListener("change", applyTheme);
    };
  }, [user]);

<<<<<<< HEAD
  const currentTheme = user?.theme || "system";
=======
  const currentTheme = user?.theme || "light";
>>>>>>> 2f5cb8235e940a7bee02d98a2a0eaab4a4b9edaf

  const resolvedTheme =
    currentTheme === "system"
      ? window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light"
      : currentTheme;

  return (
    <ThemeContext.Provider
      value={{
        changeTheme,
        currentTheme,
        resolvedTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
