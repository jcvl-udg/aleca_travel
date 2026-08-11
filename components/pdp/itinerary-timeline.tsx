"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronDown,
  Sunrise,
  Sun,
  Moon,
  Coffee,
  UtensilsCrossed,
  Wine,
  Plus,
  Check,
  MapPin,
  type LucideIcon,
} from "lucide-react";
import type { ItineraryDay, DayPeriod, MealType, OptionalActivity } from "@/lib/trip";

type Props = {
  days: ItineraryDay[];
  // Mapa de actividades opcionales seleccionadas (id -> true).
  selected: Record<string, boolean>;
  // Notifica al componente padre para recalcular el precio en la tarjeta de reserva.
  onToggleOptional: (activity: OptionalActivity) => void;
};

// Icono según la franja horaria de la actividad.
const PERIOD_META: Record<DayPeriod, { icon: LucideIcon; label: string }> = {
  morning: { icon: Sunrise, label: "Mañana" },
  afternoon: { icon: Sun, label: "Tarde" },
  night: { icon: Moon, label: "Noche" },
};

// Icono según el tipo de comida incluida.
const MEAL_META: Record<MealType, { icon: LucideIcon; label: string }> = {
  breakfast: { icon: Coffee, label: "Desayuno" },
  lunch: { icon: UtensilsCrossed, label: "Comida" },
  dinner: { icon: Wine, label: "Cena" },
};

export function ItineraryTimeline({ days, selected, onToggleOptional }: Props) {
  // Día actualmente expandido (el primero abierto por defecto).
  const [openDay, setOpenDay] = useState<number | null>(1);

  return (
    <section aria-label="Itinerario día a día">
      <h2 className="font-serif text-2xl">Itinerario día a día</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Explora cada jornada y personaliza tu ruta con actividades opcionales.
      </p>

      <ol className="mt-6 space-y-3">
        {days.map((day) => {
          const isOpen = openDay === day.day;
          return (
            <li key={day.day} className="glass overflow-hidden rounded-3xl">
              {/* Cabecera clicable de la tarjeta del día */}
              <button
                type="button"
                onClick={() => setOpenDay(isOpen ? null : day.day)}
                aria-expanded={isOpen}
                className="flex w-full items-center gap-4 p-4 text-left transition-colors hover:bg-muted/40"
              >
                <span className="flex h-11 w-11 shrink-0 flex-col items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <span className="text-[9px] uppercase leading-none opacity-70">Día</span>
                  <span className="text-base font-semibold leading-tight">{day.day}</span>
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                    <MapPin className="h-3 w-3" aria-hidden="true" />
                    {day.city}
                  </span>
                  <span className="block truncate font-medium">{day.title}</span>
                </span>
                <ChevronDown
                  className={`h-5 w-5 shrink-0 text-muted-foreground transition-transform duration-300 ${
                    isOpen ? "rotate-180" : ""
                  }`}
                  aria-hidden="true"
                />
              </button>

              {/* Contenido expandible animado */}
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    key="content"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.35, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <div className="grid gap-5 border-t border-border p-4 md:grid-cols-[1fr_180px]">
                      <div>
                        <p className="text-sm text-muted-foreground">{day.summary}</p>

                        {/* Desglose por franja horaria */}
                        <div className="mt-4 space-y-3">
                          {day.activities.map((act) => {
                            const meta = PERIOD_META[act.period];
                            const Icon = meta.icon;
                            return (
                              <div key={act.period + act.title} className="flex gap-3">
                                <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-muted text-gold">
                                  <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                                </span>
                                <div>
                                  <p className="text-[11px] uppercase tracking-wide text-muted-foreground">
                                    {meta.label}
                                  </p>
                                  <p className="text-sm font-medium">{act.title}</p>
                                  <p className="text-xs text-muted-foreground">{act.description}</p>
                                </div>
                              </div>
                            );
                          })}
                        </div>

                        {/* Comidas incluidas */}
                        {day.meals.length > 0 && (
                          <div className="mt-4 flex flex-wrap items-center gap-2">
                            <span className="text-[11px] uppercase tracking-wide text-muted-foreground">
                              Incluye:
                            </span>
                            {day.meals.map((meal) => {
                              const meta = MEAL_META[meal];
                              const Icon = meta.icon;
                              return (
                                <span
                                  key={meal}
                                  className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-1 text-[11px] text-primary"
                                >
                                  <Icon className="h-3 w-3" aria-hidden="true" />
                                  {meta.label}
                                </span>
                              );
                            })}
                          </div>
                        )}

                        {/* Actividades opcionales con costo extra */}
                        {day.optional.length > 0 && (
                          <div className="mt-4 space-y-2">
                            <p className="text-[11px] uppercase tracking-wide text-muted-foreground">
                              Actividades opcionales
                            </p>
                            {day.optional.map((opt) => {
                              const active = !!selected[opt.id];
                              return (
                                <button
                                  key={opt.id}
                                  type="button"
                                  onClick={() => onToggleOptional(opt)}
                                  aria-pressed={active}
                                  className={`flex w-full items-center justify-between gap-3 rounded-2xl border px-3 py-2.5 text-left text-sm transition-all ${
                                    active
                                      ? "border-primary/50 bg-primary/10 glow-emerald"
                                      : "border-border bg-muted/30 hover:border-border/80"
                                  }`}
                                >
                                  <span className="flex items-center gap-2">
                                    <span
                                      className={`flex h-5 w-5 items-center justify-center rounded-md ${
                                        active
                                          ? "bg-primary text-primary-foreground"
                                          : "bg-muted text-muted-foreground"
                                      }`}
                                    >
                                      {active ? (
                                        <Check className="h-3 w-3" aria-hidden="true" />
                                      ) : (
                                        <Plus className="h-3 w-3" aria-hidden="true" />
                                      )}
                                    </span>
                                    {opt.label}
                                  </span>
                                  <span
                                    className={`whitespace-nowrap font-medium ${
                                      active ? "text-primary" : "text-muted-foreground"
                                    }`}
                                  >
                                    + ${opt.price} USD
                                  </span>
                                </button>
                              );
                            })}
                          </div>
                        )}
                      </div>

                      {/* Vista previa fotográfica del día */}
                      <div className="relative hidden overflow-hidden rounded-2xl md:block">
                        <Image
                          src={day.image || "/placeholder.svg"}
                          alt={`Vista del día ${day.day}: ${day.title}`}
                          fill
                          sizes="180px"
                          className="object-cover"
                        />
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
