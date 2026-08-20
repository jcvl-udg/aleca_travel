"use client";

import { motion } from "framer-motion";
import { Stamp, Palmtree, Mountain, Crown, Lock } from "lucide-react";

const STAMPS = [
  {
    title: "Conquistador de Asia",
    detail: "Tokio · Bangkok · Seúl",
    icon: Mountain,
    tone: "gold" as const,
    earned: true,
  },
  {
    title: "Escapada Caribeña",
    detail: "Cancún · Tulum · Aruba",
    icon: Palmtree,
    tone: "emerald" as const,
    earned: true,
  },
  {
    title: "Trotamundos Europeo",
    detail: "París · Roma · Lisboa",
    icon: Stamp,
    tone: "cyan" as const,
    earned: true,
  },
];

const toneMap = {
  gold: "text-gold bg-gold/10 border-gold/25",
  emerald: "text-primary bg-primary/10 border-primary/25",
  cyan: "text-cyan bg-cyan/10 border-cyan/25",
};

export function PassportSection() {
  const current = 2400;
  const target = 3000;
  const pct = Math.min(100, Math.round((current / target) * 100));

  return (
    <section id="pasaporte" className="relative mx-auto max-w-6xl px-4 py-20 sm:py-28">
      <div className="mb-10 flex flex-col gap-3 text-center">
        <span className="mx-auto inline-flex items-center gap-2 rounded-full glass px-3 py-1.5 text-xs">
          <Stamp className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
          Pasaporte Digital
        </span>
        <h2 className="text-balance font-serif text-3xl tracking-tight sm:text-4xl">
          Cada viaje deja su sello
        </h2>
        <p className="mx-auto max-w-xl text-pretty leading-relaxed text-muted-foreground">
          Colecciona sellos, sube de nivel y accede a beneficios exclusivos del Club VIP a medida
          que exploras el mundo.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {STAMPS.map((stamp, i) => {
          const Icon = stamp.icon;
          return (
            <motion.article
              key={stamp.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, delay: i * 0.1, ease: "easeOut" }}
              className="glass group relative overflow-hidden rounded-3xl p-6"
            >
              <div
                className={`flex h-14 w-14 items-center justify-center rounded-2xl border ${toneMap[stamp.tone]}`}
              >
                <Icon className="h-6 w-6" aria-hidden="true" />
              </div>
              <h3 className="mt-4 font-serif text-xl">{stamp.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{stamp.detail}</p>
              <span className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-muted px-2.5 py-1 text-[11px] text-muted-foreground">
                <span className="h-1.5 w-1.5 rounded-full bg-primary" aria-hidden="true" />
                Sello desbloqueado
              </span>
            </motion.article>
          );
        })}
      </div>

      {/* Progress to next tier */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="glass-strong mt-6 flex flex-col gap-4 rounded-3xl p-6 sm:flex-row sm:items-center sm:justify-between"
      >
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gold/15 text-gold glow-gold">
            <Crown className="h-6 w-6" aria-hidden="true" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Próximo nivel</p>
            <p className="font-serif text-xl">
              Explorador VIP <span className="text-muted-foreground">→</span>{" "}
              <span className="text-gold">Oro</span>
            </p>
          </div>
        </div>

        <div className="w-full sm:max-w-sm">
          <div className="mb-2 flex items-center justify-between text-xs">
            <span className="tabular-nums text-muted-foreground">
              {current.toLocaleString("en-US")} pts
            </span>
            <span className="inline-flex items-center gap-1 tabular-nums text-muted-foreground">
              <Lock className="h-3 w-3" aria-hidden="true" />
              {target.toLocaleString("en-US")} pts
            </span>
          </div>
          <div
            className="h-2.5 w-full overflow-hidden rounded-full bg-muted"
            role="progressbar"
            aria-valuenow={current}
            aria-valuemin={0}
            aria-valuemax={target}
            aria-label="Progreso al nivel Oro"
          >
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: `${pct}%` }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
            className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-sky-500"
          />
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            Solo <span className="font-medium text-foreground">600 pts</span> más para desbloquear
            beneficios Oro.
          </p>
        </div>
      </motion.div>
    </section>
  );
}
