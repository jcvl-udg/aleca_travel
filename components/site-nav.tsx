"use client";

import { Compass, Globe2, Map, Moon, Sparkles, Sun } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useState, useSyncExternalStore } from "react";

const LINKS = [
  { label: "Destinos", view: "map" },
  { label: "Mi Pasaporte", view: "passport" },
];

type VisualStyle = "atlas" | "globe";
type Theme = "light" | "dark";

const subscribeToPreference = (onStoreChange: () => void) => {
  window.addEventListener("visual-preference-change", onStoreChange);
  return () => window.removeEventListener("visual-preference-change", onStoreChange);
};

const getVisualStyle = (): VisualStyle => document.documentElement.dataset.visualStyle === "globe" ? "globe" : "atlas";
const getTheme = (): Theme => document.documentElement.dataset.theme === "dark" ? "dark" : "light";
const emitPreferenceChange = () => window.dispatchEvent(new Event("visual-preference-change"));

export function SiteNav() {
  const style = useSyncExternalStore(subscribeToPreference, getVisualStyle, () => "atlas");
  const theme = useSyncExternalStore(subscribeToPreference, getTheme, () => "light");
  const [isImmersive, setIsImmersive] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    const savedStyle = window.localStorage.getItem("aleca-style") as "atlas" | "globe" | null;
    const savedTheme = window.localStorage.getItem("aleca-theme") as "light" | "dark" | null;
    const nextStyle = savedStyle === "globe" ? "globe" : "atlas";
    const nextTheme = savedTheme === "dark" ? "dark" : "light";
    root.dataset.visualStyle = nextStyle;
    root.dataset.theme = nextTheme;
    emitPreferenceChange();
  }, []);

  useEffect(() => {
    const handleImmersiveMode = (event: Event) => {
      setIsImmersive((event as CustomEvent<{ active: boolean }>).detail.active);
    };
    window.addEventListener("immersive-mode-change", handleImmersiveMode);
    return () => window.removeEventListener("immersive-mode-change", handleImmersiveMode);
  }, []);

  const changeStyle = (nextStyle: "atlas" | "globe") => {
    document.documentElement.dataset.visualStyle = nextStyle;
    window.localStorage.setItem("aleca-style", nextStyle);
    window.dispatchEvent(new CustomEvent("visual-theme-change", { detail: { style: nextStyle } }));
    emitPreferenceChange();
  };

  const toggleTheme = () => {
    const nextTheme = theme === "light" ? "dark" : "light";
    document.documentElement.dataset.theme = nextTheme;
    window.localStorage.setItem("aleca-theme", nextTheme);
    emitPreferenceChange();
  };

  return (
    <motion.header
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`fixed inset-x-0 top-4 z-50 px-4 transition-opacity ${isImmersive ? "pointer-events-none opacity-0" : "opacity-100"}`}
    >
      <nav className="glass mx-auto flex max-w-6xl items-center justify-between rounded-full py-2.5 pl-5 pr-2.5">
        <a href="#" className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground glow-primary">
            <Compass className="h-4 w-4" aria-hidden="true" />
          </span>
          <span className="font-serif text-lg tracking-tight">Aleca Travel</span>
        </a>

        {/* Desktop Links */}
        <div className="hidden items-center gap-1 lg:flex">
          {LINKS.map((link) => (
            <button
              key={link.label}
              type="button"
              onClick={() => window.dispatchEvent(new CustomEvent("exploration-navigation", { detail: { view: link.view } }))}
              className="rounded-full px-4 py-2 text-sm text-zinc-200 transition-colors hover:bg-white/5 hover:text-white"
            >
              {link.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1.5">
          <div className="hidden items-center gap-1 rounded-full border border-border p-1 sm:flex" aria-label="Versión visual">
            <button type="button" onClick={() => changeStyle("atlas")} aria-pressed={style === "atlas"} aria-label="Usar estilo mapa antiguo" className={`flex h-8 items-center gap-1.5 rounded-full px-2.5 text-xs transition-colors ${style === "atlas" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}>
              <Map className="h-3.5 w-3.5" /> Atlas
            </button>
            <button type="button" onClick={() => changeStyle("globe")} aria-pressed={style === "globe"} aria-label="Usar estilo globo renacentista" className={`flex h-8 items-center gap-1.5 rounded-full px-2.5 text-xs transition-colors ${style === "globe" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}>
              <Globe2 className="h-3.5 w-3.5" /> Globo
            </button>
          </div>
          <button type="button" onClick={toggleTheme} aria-label={theme === "light" ? "Activar modo oscuro" : "Activar modo claro"} className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:text-foreground">
            {theme === "light" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
          </button>
          <button
            type="button"
            className="glass-strong flex items-center gap-2 rounded-full py-1.5 pl-3 pr-1.5 text-sm"
          >
            <Sparkles className="h-4 w-4 text-gold" aria-hidden="true" />
            <span className="tabular-nums hidden sm:inline">
              Mis Puntos: <span className="font-semibold text-foreground">2,400</span>{" "}
              <span className="text-muted-foreground">pts</span>
            </span>
            <span className="tabular-nums sm:hidden">
              <span className="font-semibold text-foreground">2.4k</span>
            </span>
            <span
              className="ml-1 flex h-7 w-7 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground"
              aria-hidden="true"
            >
              AV
            </span>
          </button>
        </div>
      </nav>
    </motion.header>
  );
}