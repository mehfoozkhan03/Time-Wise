import { createContext, useContext, useEffect, useState } from 'react'

const ThemeContext = createContext()

export function ThemeProvider({ children }) {
  // const [theme, setTheme] = useState(() => {
  //   return (
  //     localStorage.getItem('theme') ||
  //     (window.matchMedia('(prefers-color-scheme: dark)').matches
  //       ? 'dark'
  //       : 'light')
  //   )
  // })
  const [theme, setTheme] = useState(() => {
  const savedTheme = localStorage.getItem("theme");

  if (savedTheme) {
    return savedTheme;
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
});

  useEffect(() => {
    document.body.classList.toggle(
      'dark_mode',

      theme === 'dark',
    )

    localStorage.setItem('theme', theme)
  }, [theme])

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  return useContext(ThemeContext)
}
