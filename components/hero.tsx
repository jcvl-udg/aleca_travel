"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { ChevronLeft, ChevronRight, ExternalLink, MapPin } from "lucide-react";
import { SearchPanel } from "./search-panel";
import { GlobeFilterToggle, type GlobeFilter } from "./globe-filter";
import TravelGlobe from "./travel-globe";
import { DestinationBottomDrawer } from "./pdp/DestinationBottomDrawer";
import { DESTINATIONS, type Destination } from "@/lib/destinations";

const DYNAMIC_WORDS = [
  "Evolucionar.",
  "Descubrir.",
  "Transformar.",
  "Conectar.",
  "Vivir.",
];

const fadeUp: Variants = {
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
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [focusCoords, setFocusCoords] = useState<{ lat: number; lng: number } | null>(null);
  
  // Estado para rotación de palabras del slogan
  const [wordIndex, setWordIndex] = useState(0);

  // Efecto para cambiar la palabra cada 2.5 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      setWordIndex((prev) => (prev + 1) % DYNAMIC_WORDS.length);
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  const visibleDestinations = useMemo(() => {
    if (filter === "all") return DESTINATIONS;
    return DESTINATIONS.filter((d) => d.status === filter);
  }, [filter]);

  const handleDestinationSelect = (destination: Destination) => {
    setSelected(destination);
    setFocusCoords({ lat: destination.lat, lng: destination.lng });
  };

  const handleCloseFocus = () => {
    setIsDrawerOpen(false);
    setFocusCoords({ lat: 18, lng: -35 }); 
    setTimeout(() => setSelected(null), 300);
  };

  const handleNextPrev = (direction: 1 | -1) => {
    if (!selected || visibleDestinations.length === 0) return;
    const currentIndex = visibleDestinations.findIndex((d) => d.id === selected.id);
    let nextIndex = currentIndex + direction;
    if (nextIndex < 0) nextIndex = visibleDestinations.length - 1;
    if (nextIndex >= visibleDestinations.length) nextIndex = 0;
    handleDestinationSelect(visibleDestinations[nextIndex]);
  };

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (selected && e.deltaY > 50 && !isDrawerOpen) {
        handleCloseFocus();
      }
    };
    window.addEventListener("wheel", handleWheel);
    return () => window.removeEventListener("wheel", handleWheel);
  }, [selected, isDrawerOpen]);

  return (
    <section className="relative flex min-h-[100dvh] w-full items-center overflow-hidden bg-background">
      
      {/* LAYER 0: CINEMATIC BACKGROUND VIDEO */}
      <AnimatePresence>
        {selected && (
          <motion.div
            key="video-bg"
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.8 } }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="absolute inset-0 z-0 overflow-hidden"
          >
            <video 
              autoPlay 
              loop 
              muted 
              playsInline
              className="absolute inset-0 h-full w-full object-cover opacity-30 lg:opacity-50"
              src="https://cdn.coverr.co/videos/coverr-drone-shot-over-a-tropical-beach-4318/1080p.mp4" 
            />
            <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-background via-background/80 lg:via-background/80 to-transparent z-10" />
            <motion.div 
              initial={{ opacity: 0.8 }}
              animate={{ opacity: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="absolute inset-0 bg-primary mix-blend-screen z-20 pointer-events-none"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* LAYER 1: THE GLOBE CANVAS */}
      <motion.div
        layout
        // CHANGED: Adjusted translate-y values to positive numbers to push the globe DOWN. 
        // Added 'overflow-hidden' to the parent section to stop scrolling.
        className={`absolute inset-0 z-10 flex items-center justify-center transition-all duration-1000 ease-in-out lg:inset-y-0 lg:left-auto lg:right-0 ${
          selected 
            ? "w-full translate-y-[5%] lg:w-[65%] lg:translate-y-[10%] lg:translate-x-[5%]" 
            : "w-full lg:w-[60%] translate-y-[-10%] lg:translate-y-[10%]"
        }`}
      >
        <div className="pointer-events-none absolute inset-0 -z-10 bg-primary/5 blur-[120px]" />
        {/* CHANGED: Removed arbitrary height constraints that cause overflow */}
        <div className="absolute inset-0 h-full w-full pointer-events-auto">
          <TravelGlobe 
            filter={filter} 
            onSelect={handleDestinationSelect} 
            focusCoords={focusCoords}
            selectedDestination={selected} 
          />
        </div>
      </motion.div>

      {/* LAYER 2: FOREGROUND UI OVERLAY */}
      <div className="pointer-events-none absolute inset-0 z-20 mx-auto flex w-full max-w-7xl flex-col justify-end pb-8 lg:justify-center px-4 pt-24 lg:px-12 lg:pb-0 lg:pt-0">
        <div className="relative flex w-full max-w-xl flex-col">
          <AnimatePresence mode="wait">
            {!selected ? (
              /* --- STATE A: DEFAULT HERO TEXT & SEARCH --- */
              <motion.div 
                key="default-view"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40, filter: "blur(10px)" }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="pointer-events-auto flex flex-col gap-6"
              >
                {/* SLOGAN DINÁMICO */}
                <motion.h1 
                  variants={fadeUp} 
                  custom={1} 
                  initial="hidden" 
                  animate="show" 
                  className="text-balance font-serif text-4xl leading-[1.05] tracking-tight sm:text-5xl lg:text-7xl"
                >
                  Viajar es <br className="hidden lg:block"/>
                  <span className="inline-inline-flex min-w-[280px]">
                    <AnimatePresence mode="wait">
                      <motion.span
                        key={DYNAMIC_WORDS[wordIndex]}
                        initial={{ opacity: 0, y: 15, filter: "blur(10px)" }}
                        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                        exit={{ opacity: 0, y: -15, filter: "blur(10px)" }}
                        transition={{ duration: 0.5, ease: "easeInOut" }}
                        className="inline-block italic text-glow-primary text-primary"
                      >
                        {DYNAMIC_WORDS[wordIndex]}
                      </motion.span>
                    </AnimatePresence>
                  </span>
                </motion.h1>

                <motion.div variants={fadeUp} custom={3} initial="hidden" animate="show">
                  <SearchPanel />
                </motion.div>
                <motion.div variants={fadeUp} custom={4} initial="hidden" animate="show" className="flex flex-wrap items-center gap-3 pb-4 lg:pb-0">
                  <GlobeFilterToggle value={filter} onChange={setFilter} />
                </motion.div>
              </motion.div>
            ) : (
              /* --- STATE B: FOCUS MODE COLLAGE & INFO --- */
              <motion.div
                key="focus-view"
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 30, scale: 0.95 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="pointer-events-auto glass relative flex w-full flex-col gap-4 lg:gap-6 rounded-[2rem] p-5 lg:p-6 border border-white/10 shadow-2xl backdrop-blur-xl bg-black/60 lg:max-w-md"
              >
                <button onClick={handleCloseFocus} className="absolute -top-12 left-0 flex items-center gap-2 text-sm text-white/70 hover:text-white transition-colors lg:hidden">
                   <ChevronLeft className="w-4 h-4" /> Volver al globo
                </button>

                <div className="grid grid-cols-2 gap-2 lg:gap-3 h-40 lg:h-56">
                  <div className="relative col-span-1 row-span-2 overflow-hidden rounded-xl lg:rounded-2xl bg-muted/20">
                    <img src="https://images.unsplash.com/photo-1542314831-c6a4d27ce6a2?q=80&w=400&auto=format&fit=crop" alt="Luxury" className="h-full w-full object-cover opacity-80 transition-transform duration-700 hover:scale-110" />
                  </div>
                  <div className="relative overflow-hidden rounded-xl lg:rounded-2xl bg-muted/20">
                    <img src="https://images.unsplash.com/photo-1571896349842-33c89424de2d?q=80&w=400&auto=format&fit=crop" alt="Resort" className="h-full w-full object-cover opacity-80 transition-transform duration-700 hover:scale-110" />
                  </div>
                  <div className="relative overflow-hidden rounded-xl lg:rounded-2xl bg-muted/20">
                    <img src="https://images.unsplash.com/photo-1445019980597-93fa8acb246c?q=80&w=400&auto=format&fit=crop" alt="Cuisine" className="h-full w-full object-cover opacity-80 transition-transform duration-700 hover:scale-110" />
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-2 text-primary text-xs lg:text-sm font-medium uppercase tracking-widest mb-1 lg:mb-2">
                    <MapPin className="w-3 h-3 lg:w-4 lg:h-4" /> Destino VIP
                  </div>
                  <h2 className="font-serif text-3xl lg:text-4xl text-white tracking-tight">{selected.name}</h2>
                </div>

                <button 
                  onClick={() => setIsDrawerOpen(true)}
                  className="group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-full bg-primary px-4 py-3 lg:py-3.5 text-sm font-semibold text-primary-foreground transition-all hover:bg-primary/90 hover:shadow-[0_0_30px_rgba(29,187,244,0.3)]"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    Ver Itinerario
                    <ExternalLink className="h-4 w-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                  </span>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Focus Nav Arrows */}
      <AnimatePresence>
        {selected && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="pointer-events-none absolute inset-0 z-30 hidden lg:block">
            <div className="absolute inset-y-0 left-4 right-4 flex items-center justify-between lg:left-8 lg:right-8">
              <button onClick={() => handleNextPrev(-1)} className="pointer-events-auto glass flex h-12 w-12 items-center justify-center rounded-full text-white transition-all hover:scale-110 hover:bg-white/10 hover:text-primary"><ChevronLeft className="h-6 w-6" /></button>
              <button onClick={() => handleNextPrev(1)} className="pointer-events-auto glass flex h-12 w-12 items-center justify-center rounded-full text-white transition-all hover:scale-110 hover:bg-white/10 hover:text-primary"><ChevronRight className="h-6 w-6" /></button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* BOTTOM DRAWER FOR ITINERARY */}
      <AnimatePresence>
        {isDrawerOpen && selected && (
          <DestinationBottomDrawer
            destination={selected}
            onClose={() => setIsDrawerOpen(false)}
          />
        )}
      </AnimatePresence>
    </section>
  );
}