"use client"

import * as React from "react"

const ThemeContext = React.createContext({ theme: "light", setTheme: () => {} })

export function ThemeProvider({ children }) {
  const [theme, setTheme] = React.useState(() => {
    // Check for stored theme or system preference
    if (typeof window !== "undefined") {
      const storedTheme = window.localStorage.getItem("theme")
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches

      return storedTheme || (prefersDark ? "dark" : "light")
    }

    return "light"
  })

  React.useEffect(() => {
    const root = window.document.documentElement
    root.classList.remove("light", "dark")
    root.classList.add(theme)
    localStorage.setItem("theme", theme)
  }, [theme])

  const value = React.useMemo(
    () => ({
      theme,
      setTheme: (newTheme) => {
        setTheme(newTheme)
      },
    }),
    [theme]
  )

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => {
  const context = React.useContext(ThemeContext)
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }
  return context
}