"use client";

import { Compass, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

const LINKS = [
  { label: "Destinos", href: "#destinos" },
  { label: "Mi Pasaporte", href: "#pasaporte" },
  { label: "Club VIP", href: "#vip" },
];

export function SiteNav() {
  return (
    <motion.header
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="fixed inset-x-0 top-4 z-50 px-4"
    >
      <nav className="glass mx-auto flex max-w-6xl items-center justify-between rounded-full py-2.5 pl-5 pr-2.5">
        <a href="#" className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground glow-primary">
            <Compass className="h-4 w-4" aria-hidden="true" />
          </span>
          <span className="font-serif text-lg tracking-tight">Aleca Travel</span>
        </a>

        {/* Desktop Links */}
        <div className="hidden items-center gap-1 md:flex">
          {LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="rounded-full px-4 py-2 text-sm text-zinc-200 transition-colors hover:bg-white/5 hover:text-white"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* User Points Indicator */}
        <div className="flex items-center gap-2">
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
              className="ml-1 flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-cyan-400 to-sky-500 text-xs font-semibold text-primary-foreground"
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