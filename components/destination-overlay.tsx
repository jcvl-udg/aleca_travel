"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { Star, Sparkles, ArrowRight, X, BadgeCheck, MapPin } from "lucide-react";
import type { Destination } from "@/lib/destinations";

type Props = {
  destination: Destination | null;
  onClose: () => void;
};

export function DestinationOverlay({ destination, onClose }: Props) {
  return (
    <AnimatePresence>
      {destination && (
        <motion.div
          key={destination.id}
          initial={{ opacity: 0, y: 20, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.96 }}
          transition={{ duration: 0.28, ease: "easeOut" }}
          className="glass-strong pointer-events-auto absolute bottom-4 left-4 right-4 z-20 overflow-hidden rounded-3xl sm:left-6 sm:right-auto sm:w-80"
        >
          <div className="relative h-36 w-full">
            <Image
              src={destination.image || "/placeholder.svg"}
              alt={`Vista de ${destination.name}, ${destination.country}`}
              fill
              sizes="320px"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-card via-card/30 to-transparent" />
            <button
              type="button"
              onClick={onClose}
              aria-label="Cerrar"
              className="glass absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full"
            >
              <X className="h-3.5 w-3.5" />
            </button>
            <span
              className={`absolute left-3 top-3 inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-medium ${
                destination.status === "visited"
                  ? "bg-gold/15 text-gold"
                  : "bg-primary/15 text-primary"
              }`}
            >
              {destination.status === "visited" ? (
                <>
                  <BadgeCheck className="h-3 w-3" aria-hidden="true" /> Visitado
                </>
              ) : (
                <>
                  <MapPin className="h-3 w-3" aria-hidden="true" /> Recomendado
                </>
              )}
            </span>
          </div>

          <div className="p-4">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="font-serif text-xl leading-tight">{destination.name}</h3>
                <p className="text-xs text-muted-foreground">{destination.country}</p>
              </div>
              <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-1 text-xs">
                <Star className="h-3 w-3 fill-gold text-gold" aria-hidden="true" />
                <span className="font-medium">{destination.rating.toFixed(1)}</span>
                <span className="text-muted-foreground">/5</span>
              </span>
            </div>

            <p className="mt-2 text-pretty text-xs leading-relaxed text-muted-foreground">
              {destination.blurb}
            </p>

            <div className="mt-4 flex items-end justify-between">
              <div>
                <p className="text-[11px] text-muted-foreground">Desde</p>
                <p className="font-semibold">
                  <span className="text-lg">${destination.price.toLocaleString("en-US")}</span>{" "}
                  <span className="text-xs text-muted-foreground">USD</span>
                </p>
              </div>
              <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
                <Sparkles className="h-3 w-3" aria-hidden="true" />
                Ganas +{destination.points} Puntos
              </span>
            </div>

            <button
              type="button"
              className="group mt-4 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground transition-all hover:brightness-110 hover:glow-emerald"
            >
              Ver Itinerario Completo
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
