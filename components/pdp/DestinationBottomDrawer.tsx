"use client";

import { motion } from "framer-motion";
import { X } from "lucide-react";
import type { Destination } from "@/lib/destinations";

type Props = {
  destination: Destination;
  onClose: () => void;
};

export function DestinationBottomDrawer({ destination, onClose }: Props) {
  return (
    <>
      {/* Darken the background slightly behind the drawer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-40 bg-background/60 backdrop-blur-sm"
      />

      {/* The Bottom Sheet */}
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: "0%" }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="fixed bottom-0 left-0 right-0 z-50 mx-auto w-full max-w-5xl overflow-hidden rounded-t-[2.5rem] border-t border-white/10 bg-black/80 p-6 shadow-2xl backdrop-blur-xl lg:p-10 h-[75vh]"
      >
        <button
          onClick={onClose}
          className="absolute right-6 top-6 flex h-10 w-10 items-center justify-center rounded-full bg-white/5 text-white transition-colors hover:bg-white/10 hover:text-primary"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="h-full overflow-y-auto pr-4 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/10">
          <div className="mb-8">
            <h2 className="font-serif text-3xl text-white md:text-5xl">{destination.name}</h2>
            <p className="mt-2 text-lg text-primary">Itinerario Nivel Diamante</p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {/* Example content columns - You can drop your itinerary accordion here */}
            <div className="space-y-6">
              <div className="rounded-2xl bg-white/5 p-6">
                <h3 className="text-xl font-medium text-white">Día 1: Llegada VIP</h3>
                <p className="mt-2 text-muted-foreground">Traslado en helicóptero privado desde el aeropuerto internacional directo a la terraza de su suite.</p>
              </div>
              <div className="rounded-2xl bg-white/5 p-6">
                <h3 className="text-xl font-medium text-white">Día 2: Inmersión Local</h3>
                <p className="mt-2 text-muted-foreground">Guía privado certificado para explorar ruinas arqueológicas con acceso exclusivo antes de la apertura al público.</p>
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="aspect-video w-full rounded-2xl bg-muted/20 overflow-hidden relative">
                <img src={`https://images.unsplash.com/photo-1542314831-c6a4d27ce6a2?q=80&w=800&auto=format&fit=crop`} alt="Hotel" className="object-cover w-full h-full opacity-60" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="glass px-4 py-2 rounded-full text-sm font-medium">Reservar Estadía</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
}