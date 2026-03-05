"use client";

import { createContext, useContext, useEffect, useState, useCallback, useMemo } from "react";

type Theme = "dark" | "light";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: "dark",
  toggleTheme: () => {},
});

export function useTheme() {
  return useContext(ThemeContext);
}

// client-localstorage-schema: versioned key with try-catch
const THEME_KEY = "theme:v1";

// js-cache-storage: cache localStorage reads in memory
let cachedTheme: Theme | null = null;

function readTheme(): Theme {
  if (cachedTheme !== null) return cachedTheme;
  try {
    const stored = localStorage.getItem(THEME_KEY) as Theme | null;
    // Migration from unversioned key
    if (!stored) {
      const legacy = localStorage.getItem("theme") as Theme | null;
      if (legacy) {
        try {
          localStorage.setItem(THEME_KEY, legacy);
          localStorage.removeItem("theme");
        } catch {}
        cachedTheme = legacy;
        return legacy;
      }
    }
    cachedTheme = stored || "dark";
    return cachedTheme;
  } catch {
    cachedTheme = "dark";
    return "dark";
  }
}

function writeTheme(theme: Theme) {
  cachedTheme = theme;
  try {
    localStorage.setItem(THEME_KEY, theme);
  } catch {}
}

export default function ThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  // rerender-lazy-state-init: function form for localStorage read
  const [theme, setTheme] = useState<Theme>(() => "dark");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const saved = readTheme();
    setTheme(saved);
    document.documentElement.setAttribute("data-theme", saved);
    setMounted(true);
  }, []);

  // rerender-functional-setstate: stable callback with useCallback
  const toggleTheme = useCallback(() => {
    setTheme((prev) => {
      const next = prev === "dark" ? "light" : "dark";
      document.documentElement.setAttribute("data-theme", next);
      writeTheme(next);
      return next;
    });
  }, []);

  // rerender-memo: memoize context value to prevent consumer re-renders
  const contextValue = useMemo(() => ({ theme, toggleTheme }), [theme, toggleTheme]);

  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
}
