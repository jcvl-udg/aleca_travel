"use client";

import { AnimatePresence, motion } from "framer-motion";
import type { KeyboardEvent } from "react";
import { ArrowRight, BookOpen, CloudSun, Compass, Landmark, MapPin, Sparkles } from "lucide-react";
import type { Destination } from "@/lib/destinations";

type Props = {
  destination: Destination | null;
  mode: "globe" | "map";
  onOpenItinerary: () => void;
};

export function DestinationScene({ destination, mode, onOpenItinerary }: Props) {
  const windowVideo =
    "https://cdn.coverr.co/videos/coverr-aerial-view-of-the-beach-1561762222075/1080p.mp4";

  const handleBookKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onOpenItinerary();
    }
  };

  const openPreview = () => {
    if (!destination) return;
    const next = document.querySelector("[data-scene-preview='globe']") as HTMLElement | null;
    if (next) {
      next.dataset.expanded = "true";
    }
  };

  return (
    <section className={`destination-scene destination-scene--${mode}`} aria-live="polite">
      <div className="destination-scene__sky" />
      <div className="destination-scene__sun" />
      <div className="destination-scene__terrain" />

      {mode === "globe" && destination ? (
        <>
          <div className="destination-scene__mini-room" aria-label={`Vista de ${destination.name}`} data-scene-preview="globe">
            <div className="destination-scene__window" role="img" aria-label={`Vista previa de ${destination.name}`}>
              <video autoPlay loop muted playsInline className="destination-scene__video" poster={destination.image}>
                <source src={windowVideo} type="video/mp4" />
              </video>
              <span className="destination-scene__window-badge">{destination.country}</span>
            </div>
            <div className="destination-scene__wall" aria-hidden="true" />
            <div className="destination-scene__book" tabIndex={0} role="button" onClick={openPreview} onKeyDown={handleBookKeyDown} aria-label="Abrir el cuaderno de pre-reserva">
              <span className="destination-scene__book-particles" aria-hidden="true">
                {Array.from({ length: 8 }).map((_, index) => (
                  <i key={index} className="destination-scene__particle" style={{ ['--delay' as string]: `${index * 0.18}s` }} />
                ))}
              </span>
              <span className="destination-scene__book-title">Pre-reserva</span>
              <span className="destination-scene__book-meta">{destination.duration}</span>
            </div>
          </div>

          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0, y: 16, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 14, scale: 0.96 }}
              transition={{ duration: 0.28, ease: "easeOut" }}
              className="destination-scene__sheet"
            >
              <div className="destination-scene__sheet-head">
                <span className="destination-scene__sheet-chip">{destination.country}</span>
                <button type="button" onClick={onOpenItinerary} className="destination-scene__sheet-cta">
                  Reservar <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                </button>
              </div>
              <h3 className="font-vintage text-3xl italic">{destination.name}</h3>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{destination.blurb}</p>
              <div className="mt-3 flex items-center justify-between gap-2 text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
                <span>{destination.landmark}</span>
                <span>{destination.duration}</span>
              </div>
            </motion.div>
          </AnimatePresence>
        </>
      ) : (
        <>
          <div className="destination-scene__landmark" aria-hidden="true">
            <span className="destination-scene__landmark-main" />
            <span className="destination-scene__landmark-detail" />
          </div>
          <div className="destination-scene__traveler" aria-hidden="true">
            <span className="destination-scene__traveler-hat" />
            <span className="destination-scene__traveler-head" />
            <span className="destination-scene__traveler-body" />
            <span className="destination-scene__traveler-case" />
          </div>
        </>
      )}

      <div className="destination-scene__caption glass-strong">
        <p className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-primary">
          {destination ? <MapPin className="h-3 w-3" aria-hidden="true" /> : <Compass className="h-3 w-3" aria-hidden="true" />}
          {mode === "globe" ? "Cuaderno del globo" : "Escena de ruta"}
        </p>
        <h2 className="mt-1 font-vintage text-2xl italic">{destination?.name ?? "Elige un destino"}</h2>
        <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
          {destination ? destination.landmark : "Selecciona un pin para revelar el siguiente capítulo."}
        </p>
        <div className="mt-3 flex items-center gap-3 text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
          <span className="inline-flex items-center gap-1"><CloudSun className="h-3 w-3 text-accent-gold" /> Clima por venir</span>
          <span className="inline-flex items-center gap-1"><Sparkles className="h-3 w-3 text-accent-gold" /> Escena viva</span>
        </div>
      </div>

      <button type="button" onClick={onOpenItinerary} className="destination-scene__notebook group" aria-label="Abrir cuaderno y personalizar itinerario">
        <BookOpen className="h-5 w-5" aria-hidden="true" />
        <span className="text-[10px] font-semibold uppercase tracking-[0.12em]">Cuaderno</span>
      </button>
      <div className="destination-scene__label"><Landmark className="h-3 w-3" aria-hidden="true" /> {destination?.landmark ?? "Puntos de interés"}</div>
    </section>
  );
}
