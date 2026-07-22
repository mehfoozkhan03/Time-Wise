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
    if (!user) return;

    const media = window.matchMedia("(prefers-color-scheme: dark)");

    const applyTheme = () => {
      let finalTheme = user.theme;

      if (user.theme === "system") {
        finalTheme = media.matches ? "dark" : "light";
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

  return (
    <ThemeContext.Provider
      value={{
        changeTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
