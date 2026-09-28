import { useCallback, useEffect, useState } from "react";

const ADMIN_THEME_KEY = "smit-admin-theme";

export function useAdminTheme() {
  const [theme, setTheme] = useState(() => localStorage.getItem(ADMIN_THEME_KEY) || "light");

  useEffect(() => {
    localStorage.setItem(ADMIN_THEME_KEY, theme);
  }, [theme]);

  const toggle = useCallback(() => setTheme((t) => (t === "dark" ? "light" : "dark")), []);

  return { theme, toggle, isDark: theme === "dark" };
}
