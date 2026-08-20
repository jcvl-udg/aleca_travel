"use client";

import { Compass, Map, Stamp, Crown } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const NAV_ITEMS = [
  { id: "explore", label: "Explorar", icon: Compass, href: "#" },
  { id: "destinations", label: "Destinos", icon: Map, href: "#destinos" },
  { id: "passport", label: "Pasaporte", icon: Stamp, href: "#pasaporte" },
  { id: "vip", label: "Club VIP", icon: Crown, href: "#vip" },
];

export function MobileBottomNav() {
  const [active, setActive] = useState("explore");
  const [isVisible, setIsVisible] = useState(true);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleDrawerState = (event: Event) => {
      const customEvent = event as CustomEvent<{ open: boolean }>;
      setIsDrawerOpen(customEvent.detail.open);
    };

    window.addEventListener("destination-drawer", handleDrawerState);
    return () => window.removeEventListener("destination-drawer", handleDrawerState);
  }, []);

  // Auto-hide on scroll down, reveal on scroll up
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 50) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <AnimatePresence>
      {isVisible && !isDrawerOpen && (
        <motion.nav
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          exit={{ y: 100 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed bottom-0 left-0 right-0 z-50 md:hidden pb-safe"
        >
          {/* Glassmorphic Container */}
          <div className="glass-strong mx-4 mb-4 flex items-center justify-between rounded-3xl p-2 shadow-2xl bg-black/80 backdrop-blur-xl border border-white/10">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = active === item.id;

              return (
                <a
                  key={item.id}
                  href={item.href}
                  onClick={() => setActive(item.id)}
                  className="relative flex flex-1 flex-col items-center justify-center gap-1 rounded-2xl p-2 text-xs transition-colors"
                >
                  {isActive && (
                    <motion.div
                      layoutId="nav-pill"
                      className="absolute inset-0 rounded-2xl bg-primary/15"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                  <Icon
                    className={`relative z-10 h-5 w-5 transition-colors ${
                      isActive ? "text-primary drop-shadow-[0_0_8px_rgba(29,187,244,0.5)]" : "text-muted-foreground"
                    }`}
                  />
                  <span
                    className={`relative z-10 font-medium ${
                      isActive ? "text-foreground" : "text-muted-foreground"
                    }`}
                  >
                    {item.label}
                  </span>
                </a>
              );
            })}
          </div>
        </motion.nav>
      )}
    </AnimatePresence>
  );
}