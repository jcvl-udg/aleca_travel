"use client";

import Image from "next/image";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, CheckCircle2, Clock, MapPin, Plane, ArrowRight, Sparkles } from "lucide-react";
import type { Destination } from "@/lib/destinations";

type Props = {
  destination: Destination;
  onClose: () => void;
};

const MOCK_ITINERARY = [
  {
    day: "Día 1: Llegada VIP",
    time: "14:00 PM",
    desc: "Traslado en helicóptero privado desde el aeropuerto directo a la terraza de su suite. Check-in con champagne.",
  },
  {
    day: "Día 2: Inmersión Local",
    time: "09:00 AM",
    desc: "Guía privado certificado para explorar la región con acceso exclusivo antes de la apertura al público general.",
  },
  {
    day: "Día 3: Alta Cocina",
    time: "20:00 PM",
    desc: "Cena de 7 tiempos maridada por el sommelier del resort en la mesa del chef, reservada en exclusiva.",
  },
];

export function DestinationBottomDrawer({ destination, onClose }: Props) {
  const [reservationState, setReservationState] = useState<"idle" | "flying" | "confirmed">("idle");

  const startReservation = () => setReservationState("flying");

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-40 bg-background/60 backdrop-blur-sm"
      />

      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: "0%" }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="fixed bottom-0 left-0 right-0 z-50 mx-auto flex h-[min(88dvh,760px)] w-full max-w-5xl flex-col overflow-hidden rounded-t-[2rem] border-t border-white/10 bg-black/95 p-4 shadow-2xl backdrop-blur-xl sm:p-6 lg:h-[min(82dvh,760px)] lg:rounded-t-[2.5rem] lg:p-8"
      >
        <button
          onClick={onClose}
          aria-label="Cerrar detalles del destino"
          className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/5 text-white transition-colors hover:bg-white/10 hover:text-primary sm:right-6 sm:top-6"
        >
          <X className="h-5 w-5" />
        </button>

        <AnimatePresence mode="wait">
          {reservationState === "confirmed" ? (
            <motion.div
              key="confirmed"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex min-h-0 flex-1 flex-col items-center justify-center px-4 text-center"
            >
              <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-primary/15 text-primary glow-primary">
                <Sparkles className="h-7 w-7" />
              </div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">Solicitud enviada</p>
              <h2 className="mt-3 font-serif text-3xl text-white sm:text-4xl">Tu viaje a {destination.name} empieza aquí</h2>
              <p className="mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
                Un asesor VIP se pondrá en contacto contigo para personalizar cada detalle de tu itinerario.
              </p>
              <button onClick={onClose} className="mt-8 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-all hover:brightness-110">
                Volver al globo <ArrowRight className="h-4 w-4" />
              </button>
            </motion.div>
          ) : (
            <motion.div key="details" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex min-h-0 flex-1 flex-col">
              <div className="flex flex-col gap-4 border-b border-white/10 pb-4 pr-12 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.18em] text-primary">
                    <MapPin className="h-3.5 w-3.5" /> {destination.country}
                  </p>
                  <h2 className="mt-1 font-serif text-3xl tracking-tight text-white sm:text-4xl">{destination.name}</h2>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <CheckCircle2 className="h-4 w-4 text-primary" /> Itinerario Nivel Diamante
                </div>
              </div>

              <div className="mt-4 grid min-h-0 flex-1 gap-5 overflow-y-auto pb-4 pr-1 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/10 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
                <div className="space-y-4">
                  <div className="relative aspect-[16/9] overflow-hidden rounded-2xl border border-white/10 bg-muted/20">
                    <Image src={destination.image} alt={destination.name} fill sizes="(min-width: 1024px) 35vw, 100vw" className="object-cover opacity-85" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4">
                      <p className="text-lg font-medium text-white">Reserva esta experiencia</p>
                      <p className="text-sm text-primary">Gana {destination.points} pts VIP</p>
                    </div>
                  </div>
                  <p className="text-sm leading-relaxed text-muted-foreground">{destination.blurb}</p>
                  <button
                    onClick={startReservation}
                    disabled={reservationState === "flying"}
                    className="group flex w-full items-center justify-center gap-2 rounded-2xl bg-primary px-4 py-3.5 text-sm font-semibold text-primary-foreground transition-all hover:brightness-110 disabled:cursor-wait disabled:opacity-70 glow-primary"
                  >
                    Continuar con la reservación
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </button>
                </div>

                <div className="space-y-4 lg:pr-2">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Tu itinerario</p>
                    <h3 className="mt-1 font-serif text-2xl text-white">Tres días a tu medida</h3>
                  </div>
                  <div className="relative space-y-3 before:absolute before:bottom-5 before:left-5 before:top-5 before:w-px before:bg-gradient-to-b before:from-primary/50 before:via-white/15 before:to-transparent">
                    {MOCK_ITINERARY.map((item, idx) => (
                      <div key={item.day} className="relative flex gap-3">
                        <div className="z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/10 bg-background text-primary">
                          {idx === 0 ? <MapPin className="h-4 w-4" /> : <Clock className="h-4 w-4" />}
                        </div>
                        <div className="glass-strong min-w-0 flex-1 rounded-2xl p-4">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <h4 className="text-sm font-semibold text-white">{item.day}</h4>
                            <span className="text-[10px] text-muted-foreground">{item.time}</span>
                          </div>
                          <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{item.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {reservationState === "flying" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="pointer-events-none absolute inset-0 z-20 overflow-hidden bg-black/20"
            >
              <motion.div
                initial={{ x: "-15vw", y: "38vh", rotate: -18, scale: 0.7, opacity: 0 }}
                animate={{ x: "105vw", y: "-18vh", rotate: 18, scale: 1.15, opacity: [0, 1, 1, 0] }}
                transition={{ duration: 1.15, ease: "easeInOut" }}
                onAnimationComplete={() => setReservationState("confirmed")}
                className="absolute left-1/2 top-1/2 text-primary drop-shadow-[0_0_18px_rgba(29,187,244,0.8)]"
              >
                <Plane className="h-16 w-16" />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </>
  );
}