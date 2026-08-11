"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Crown, Sparkles } from "lucide-react";
import { SearchPanel } from "./search-panel";
import { GlobeFilterToggle, type GlobeFilter } from "./globe-filter";
import { DestinationOverlay } from "./destination-overlay";
import TravelGlobe from "./travel-globe";
import type { Destination } from "@/lib/destinations";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut", delay: 0.1 * i },
  }),
};

export function Hero() {
  const [filter, setFilter] = useState<GlobeFilter>("all");
  const [selected, setSelected] = useState<Destination | null>(null);

  return (
    <section className="relative mx-auto grid min-h-screen max-w-6xl grid-cols-1 items-center gap-8 px-4 pb-16 pt-28 lg:grid-cols-2 lg:gap-6 lg:pt-24">
      {/* Left */}
      <div className="relative z-10 flex flex-col gap-6">
        <motion.div variants={fadeUp} custom={0} initial="hidden" animate="show">
          <span className="glass inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs">
            <Crown className="h-3.5 w-3.5 text-gold" aria-hidden="true" />
            Nivel Explorador VIP
            <span className="mx-1 h-1 w-1 rounded-full bg-muted-foreground" aria-hidden="true" />
            <span className="text-muted-foreground">Temporada 2026</span>
          </span>
        </motion.div>

        <motion.h1
          variants={fadeUp}
          custom={1}
          initial="hidden"
          animate="show"
          className="text-balance font-serif text-4xl leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl"
        >
          El mundo es tuyo.{" "}
          <span className="italic text-glow-emerald text-primary">Traza tu siguiente aventura.</span>
        </motion.h1>

        <motion.p
          variants={fadeUp}
          custom={2}
          initial="hidden"
          animate="show"
          className="max-w-md text-pretty leading-relaxed text-muted-foreground"
        >
          Explora tu globo personal, revive los destinos que ya conquistaste y desbloquea nuevas
          experiencias de lujo mientras acumulas puntos en cada viaje.
        </motion.p>

        <motion.div variants={fadeUp} custom={3} initial="hidden" animate="show">
          <SearchPanel />
        </motion.div>

        <motion.div
          variants={fadeUp}
          custom={4}
          initial="hidden"
          animate="show"
          className="flex flex-wrap items-center gap-3"
        >
          <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Sparkles className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
            Filtra tu globo:
          </span>
          <GlobeFilterToggle value={filter} onChange={setFilter} />
        </motion.div>
      </div>

      {/* Right — globe */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.9, ease: "easeOut", delay: 0.2 }}
        className="relative h-[380px] w-full sm:h-[460px] lg:h-[600px]"
      >
        <div className="pointer-events-none absolute inset-0 -z-10 rounded-full bg-primary/10 blur-3xl" />
        <div className="relative h-full w-full">
          <TravelGlobe filter={filter} onSelect={setSelected} />
          <DestinationOverlay destination={selected} onClose={() => setSelected(null)} />
        </div>
      </motion.div>
    </section>
  );
}
