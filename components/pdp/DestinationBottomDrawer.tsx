"use client";

import { motion } from "framer-motion";
import { X, CheckCircle2, Clock, MapPin } from "lucide-react";
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
        className="fixed bottom-0 left-0 right-0 z-50 mx-auto w-full max-w-5xl overflow-hidden rounded-t-[2.5rem] border-t border-white/10 bg-black/90 p-6 shadow-2xl backdrop-blur-xl lg:p-10 h-[90vh] lg:h-[85vh] flex flex-col"
      >
        <button
          onClick={onClose}
          className="absolute right-6 top-6 flex h-10 w-10 items-center justify-center rounded-full bg-white/5 text-white transition-colors hover:bg-white/10 hover:text-primary z-10"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="mb-6 flex-shrink-0">
          <h2 className="font-serif text-3xl text-white md:text-5xl">{destination.name}</h2>
          <div className="mt-3 flex items-center gap-2">
            <span className="glass inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium text-primary">
              <CheckCircle2 className="h-3.5 w-3.5" /> Itinerario Nivel Diamante
            </span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto pb-12 pr-2 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/10">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            
            {/* Itinerary Timeline */}
            <div className="space-y-4 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-white/10 before:to-transparent">
              {MOCK_ITINERARY.map((item, idx) => (
                <div key={idx} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white/10 bg-background shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 text-primary">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] glass-strong rounded-2xl p-5 hover:border-primary/30 transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-sm font-semibold text-white">{item.day}</h3>
                      <span className="text-[10px] text-muted-foreground flex items-center gap-1"><Clock className="w-3 h-3"/> {item.time}</span>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Sticky Action Card */}
            <div className="h-fit sticky top-0 space-y-4">
              <div className="aspect-video w-full rounded-2xl bg-muted/20 overflow-hidden relative border border-white/10">
                <img src="https://imgur.com/gallery/favorite-photo-ive-ever-taken-jG4OxcD" alt="Luxury Resort" className="object-cover w-full h-full opacity-70" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <p className="text-white font-medium text-lg">Reserva esta experiencia</p>
                  <p className="text-primary text-sm">Gana 800 pts VIP</p>
                </div>
              </div>
              <button className="w-full rounded-2xl bg-primary py-4 text-sm font-semibold text-primary-foreground transition-all hover:brightness-110 glow-primary">
                Contactar a mi Asesor
              </button>
            </div>

          </div>
        </div>
      </motion.div>
    </>
  );
}