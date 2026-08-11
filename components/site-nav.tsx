"use client";

import { useState } from "react";
import { Compass, Menu, Sparkles, X } from "lucide-react";
import { motion } from "framer-motion";

const LINKS = [
  { label: "Destinos", href: "#destinos" },
  { label: "Mi Pasaporte", href: "#pasaporte" },
  { label: "Club VIP", href: "#pasaporte" },
];

export function SiteNav() {
  const [open, setOpen] = useState(false);

  return (
    <motion.header
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="fixed inset-x-0 top-4 z-50 px-4"
    >
      <nav className="glass mx-auto flex max-w-6xl items-center justify-between rounded-full py-2.5 pl-5 pr-2.5">
        <a href="#" className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground glow-emerald">
            <Compass className="h-4 w-4" aria-hidden="true" />
          </span>
          <span className="font-serif text-lg tracking-tight">Aleca Travel</span>
        </a>

        <div className="hidden items-center gap-1 md:flex">
          {LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="rounded-full px-4 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            className="glass-strong hidden items-center gap-2 rounded-full py-1.5 pl-3 pr-1.5 text-sm sm:flex"
          >
            <Sparkles className="h-4 w-4 text-gold" aria-hidden="true" />
            <span className="tabular-nums">
              Mis Puntos: <span className="font-semibold text-foreground">2,400</span>{" "}
              <span className="text-muted-foreground">pts</span>
            </span>
            <span
              className="ml-1 flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-cyan-400 text-xs font-semibold text-primary-foreground"
              aria-hidden="true"
            >
              AV
            </span>
          </button>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={open}
            className="glass-strong flex h-9 w-9 items-center justify-center rounded-full md:hidden"
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </nav>

      {open && (
        <div className="glass mx-auto mt-2 max-w-6xl rounded-3xl p-3 md:hidden">
          <div className="flex flex-col">
            {LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-2xl px-4 py-3 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                {link.label}
              </a>
            ))}
            <div className="mt-1 flex items-center gap-2 rounded-2xl bg-muted px-4 py-3 text-sm sm:hidden">
              <Sparkles className="h-4 w-4 text-gold" aria-hidden="true" />
              Mis Puntos: <span className="font-semibold">2,400 pts</span>
            </div>
          </div>
        </div>
      )}
    </motion.header>
  );
}
