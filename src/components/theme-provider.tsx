import { createContext, useContext, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

type Theme = "light" | "dark";

const THEME_TOGGLE_EGG_COUNT = 3;
const THEME_TOGGLE_EGG_MS = 4000;
const PICK_SIDE_TOOLTIP_MS = 2800;

interface ThemeContextValue {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window === "undefined") return "dark";
    return (localStorage.getItem("theme") as Theme) || "dark";
  });
  const [showPickSideTooltip, setShowPickSideTooltip] = useState(false);
  const toggleStreakRef = useRef(0);
  const toggleStreakTimerRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );
  const pickSideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", theme === "dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(
    () => () => {
      if (toggleStreakTimerRef.current) {
        clearTimeout(toggleStreakTimerRef.current);
      }
      if (pickSideTimerRef.current) clearTimeout(pickSideTimerRef.current);
    },
    [],
  );

  const toggleTheme = () => {
    setTheme((t) => (t === "light" ? "dark" : "light"));

    if (toggleStreakTimerRef.current) {
      clearTimeout(toggleStreakTimerRef.current);
    }

    toggleStreakRef.current += 1;

    if (toggleStreakRef.current >= THEME_TOGGLE_EGG_COUNT) {
      toggleStreakRef.current = 0;
      setShowPickSideTooltip(true);
      if (pickSideTimerRef.current) clearTimeout(pickSideTimerRef.current);
      pickSideTimerRef.current = setTimeout(() => {
        setShowPickSideTooltip(false);
        pickSideTimerRef.current = null;
      }, PICK_SIDE_TOOLTIP_MS);
    } else {
      toggleStreakTimerRef.current = setTimeout(() => {
        toggleStreakRef.current = 0;
        toggleStreakTimerRef.current = null;
      }, THEME_TOGGLE_EGG_MS);
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
      {showPickSideTooltip && (
        <div
          role="status"
          className={cn(
            "pointer-events-none fixed bottom-6 left-1/2 z-[100] -translate-x-1/2",
            "rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium text-foreground shadow-lg",
            "animate-in fade-in slide-in-from-bottom-2 duration-300",
          )}
        >
          Pick a side Dude!
        </div>
      )}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
