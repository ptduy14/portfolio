import { createContext, useContext, useEffect, useState } from "react";

export const ThemeContext = createContext();

export default function ThemeProvider({ children }) {
  const [isDark, setIsDark] = useState(() => {
    try {
      const saved = localStorage.getItem("portfolio-os-theme");
      return saved ? saved === "dark" : true;
    } catch {
      return true;
    }
  });

  // Drive the `.light` class on <html>; tokens live in index.css (:root / :root.light)
  useEffect(() => {
    document.documentElement.classList.toggle("light", !isDark);
    try {
      localStorage.setItem("portfolio-os-theme", isDark ? "dark" : "light");
    } catch {
      /* ignore */
    }
  }, [isDark]);

  const toggleTheme = () => setIsDark((prev) => !prev);

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
