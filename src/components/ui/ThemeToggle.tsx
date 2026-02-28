import { useState, useEffect, useRef, useCallback } from "react";

type ThemeSetting = "light" | "dark" | "system";

interface ThemeToggleProps {
  className?: string;
}

function getStoredTheme(): ThemeSetting {
  try {
    const stored = localStorage.getItem("theme");
    if (stored === "light" || stored === "dark") return stored;
  } catch {}
  return "system";
}

function applyTheme(setting: ThemeSetting) {
  const isDark =
    setting === "dark" ||
    (setting === "system" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches);
  document.documentElement.classList.toggle("dark", isDark);
}

const SunIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
    />
  </svg>
);

const MoonIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
    />
  </svg>
);

const MonitorIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
    />
  </svg>
);

const CheckIcon = () => (
  <svg
    className="w-3 h-3 ml-auto text-accent"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M5 13l4 4L19 7"
    />
  </svg>
);

const OPTIONS: { value: ThemeSetting; label: string; Icon: React.FC }[] = [
  { value: "light", label: "Claro", Icon: SunIcon },
  { value: "dark", label: "Oscuro", Icon: MoonIcon },
  { value: "system", label: "Sistema", Icon: MonitorIcon },
];

export default function ThemeToggle({ className = "" }: ThemeToggleProps) {
  const [theme, setThemeState] = useState<ThemeSetting>("system");
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Init from localStorage
  useEffect(() => {
    setThemeState(getStoredTheme());
  }, []);

  // Apply theme whenever it changes
  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  // System preference change
  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = () => {
      if (getStoredTheme() === "system") applyTheme("system");
    };
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("click", handler, true);
    return () => document.removeEventListener("click", handler, true);
  }, [open]);

  // Sync across multiple instances via custom event
  useEffect(() => {
    const handler = (e: Event) => {
      const newTheme = (e as CustomEvent).detail?.theme;
      if (newTheme) {
        setThemeState(newTheme);
        applyTheme(newTheme);
      }
    };
    window.addEventListener("theme-changed", handler);
    return () => window.removeEventListener("theme-changed", handler);
  }, []);

  // Astro view transitions
  useEffect(() => {
    const handler = () => {
      const setting = getStoredTheme();
      setThemeState(setting);
      applyTheme(setting);
    };
    document.addEventListener("astro:after-swap", handler);
    return () => document.removeEventListener("astro:after-swap", handler);
  }, []);

  const setTheme = useCallback((setting: ThemeSetting) => {
    localStorage.setItem("theme", setting);
    setThemeState(setting);
    applyTheme(setting);
    setOpen(false);
    window.dispatchEvent(
      new CustomEvent("theme-changed", { detail: { theme: setting } }),
    );
  }, []);

  const ActiveIcon =
    OPTIONS.find((o) => o.value === theme)?.Icon ?? MonitorIcon;

  return (
    <div ref={ref} className={`relative ${className}`}>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setOpen((v) => !v);
        }}
        aria-label="Cambiar tema"
        aria-haspopup="true"
        aria-expanded={open}
        className="p-2 min-h-11 min-w-11 flex items-center justify-center text-secondary hover:text-accent transition-all duration-200 rounded-lg hover:bg-elevated"
      >
        <ActiveIcon />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-40 py-1 bg-white dark:bg-[#0a0a0a] border border-border rounded-lg shadow-xl z-50">
          {OPTIONS.map(({ value, label, Icon }) => (
            <button
              key={value}
              type="button"
              onClick={() => setTheme(value)}
              className="w-full flex items-center gap-2.5 px-3 py-2.5 text-xs font-mono text-secondary hover:text-accent hover:bg-elevated transition-colors"
            >
              <Icon />
              {label}
              {theme === value && <CheckIcon />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
