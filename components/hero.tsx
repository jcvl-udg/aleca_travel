"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { TravelWorldScene } from "./travel-world-scene";
import { TravelMap } from "./travel-map";
import { TravelSearch } from "./travel-search";
import { ViewModeSelector, type ExplorationView } from "./view-mode-selector";
import { DestinationBottomDrawer } from "./pdp/DestinationBottomDrawer";
import { DESTINATIONS, type Destination } from "@/lib/destinations";
import { useGlobeCapability } from "@/hooks/use-globe-capability";

export function Hero() {
  const [view, setView] = useState<ExplorationView>("search");
  const [selected, setSelected] = useState<Destination | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [showGlobeWarning, setShowGlobeWarning] = useState(false);
  const [globeOverride, setGlobeOverride] = useState(false);
  const [globeWarningSeen, setGlobeWarningSeen] = useState(false);
  const globeCapability = useGlobeCapability();

  useEffect(() => {
    window.dispatchEvent(new CustomEvent("travel-focus", { detail: { active: Boolean(selected) } }));
  }, [selected]);
  
  const visibleDestinations = DESTINATIONS;

  const handleDestinationSelect = (destination: Destination) => {
    setSelected(destination);
  };

  const openDestinationDetails = () => setIsDrawerOpen(true);

  const handleCloseFocus = () => {
    setIsDrawerOpen(false);
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

  useEffect(() => {
    if (!selected) return;

    const previousBodyOverflow = document.body.style.overflow;
    const previousHtmlOverflow = document.documentElement.style.overflow;
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousBodyOverflow;
      document.documentElement.style.overflow = previousHtmlOverflow;
    };
  }, [selected]);

  useEffect(() => {
    window.dispatchEvent(new CustomEvent("destination-drawer", { detail: { open: isDrawerOpen } }));
  }, [isDrawerOpen]);

  const activeView = globeCapability.ready && !globeCapability.capable && view === "globe" && !globeOverride ? "search" : view;

  const requestViewChange = (nextView: ExplorationView) => {
    if (nextView === "globe" && !globeWarningSeen) {
      setShowGlobeWarning(true);
      return;
    }
    setView(nextView);
    if (nextView === "globe" && globeCapability.ready && !globeCapability.capable) setGlobeOverride(true);
    if (nextView !== "globe") setGlobeOverride(false);
  };

  return (
    <section className={`relative min-h-[100dvh] w-full overflow-hidden bg-background ${
      selected ? "relative z-30 min-h-[100dvh]" : ""
    }`}>
      {!selected && (
        <div className="absolute inset-x-0 top-0 z-30 flex justify-center px-4 pt-24 lg:pt-28">
          <ViewModeSelector
            value={view}
            onChange={requestViewChange}
            cautionViews={globeCapability.ready && !globeCapability.capable ? ["globe"] : []}
            cautionReason={globeCapability.reason}
          />
        </div>
      )}

      <AnimatePresence>
        {showGlobeWarning && !selected && (
          <motion.div className="fixed inset-0 z-[60] flex items-center justify-center bg-background/70 p-4 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className="glass-strong w-full max-w-md p-6" initial={{ y: 18, scale: 0.97 }} animate={{ y: 0, scale: 1 }}>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold">Experiencia experimental</p>
              <h2 className="mt-2 font-serif text-3xl">El globo puede ir más lento</h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{globeCapability.reason ?? "Esta vista usa WebGL y puede consumir más batería o memoria."} Puedes abrirlo para probarlo y volver a Buscar si notas lentitud.</p>
              <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-end">
                <button type="button" onClick={() => setShowGlobeWarning(false)} className="border border-border px-4 py-3 text-sm font-semibold text-foreground">Seguir en Buscar</button>
                <button type="button" onClick={() => { setShowGlobeWarning(false); setGlobeWarningSeen(true); setGlobeOverride(true); setView("globe"); }} className="bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground">Probar Globo 3D</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {activeView === "map" && !selected && (
        <TravelMap onSelect={handleDestinationSelect} onOpenDetails={openDestinationDetails} />
      )}

      {activeView === "search" && !selected && (
        <TravelSearch onSelect={handleDestinationSelect} onOpenDetails={openDestinationDetails} />
      )}

      {activeView === "globe" && (
      <>
      {/* LAYER 0: CINEMATIC BACKGROUND VIDEO */}
      <AnimatePresence>
        {selected && (
          <motion.div
            key={`video-bg-${selected.id}`}
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
              preload="metadata"
              poster={selected.image}
              className="absolute inset-0 h-full w-full object-cover opacity-45 lg:opacity-60"
              src="https://cdn.coverr.co/videos/coverr-drone-shot-over-a-tropical-beach-4318/1080p.mp4" 
            />
            <div className="absolute inset-0 z-10 bg-gradient-to-t from-background/65 via-background/30 to-transparent lg:bg-gradient-to-r lg:from-background/65 lg:via-background/30 lg:to-transparent" />
            <motion.div 
              initial={{ opacity: 0.8 }}
              animate={{ opacity: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="absolute inset-0 bg-primary mix-blend-screen z-20 pointer-events-none"
            />
          </motion.div>
        )}
      </AnimatePresence>
      </>
      )}

      {activeView === "globe" && (
      <>
      {/* LAYER 1: THE GLOBE CANVAS */}
      <motion.div
        layout
        // CHANGED: Adjusted translate-y values to positive numbers to push the globe DOWN. 
        // Added 'overflow-hidden' to the parent section to stop scrolling.
        className={`absolute inset-0 z-10 flex items-center justify-center transition-all duration-1000 ease-in-out lg:inset-y-0 lg:left-auto lg:right-0 ${
          selected 
            ? "w-full translate-y-[5%] opacity-60 lg:w-[65%] lg:translate-y-[10%] lg:translate-x-[5%]" 
            : "w-full lg:w-[60%] translate-y-[-10%] lg:translate-y-[10%]"
        }`}
      >
        <div className="pointer-events-none absolute inset-0 -z-10 bg-primary/5 blur-[120px]" />
        {selected && <div className="pointer-events-none absolute inset-0 -z-10 bg-black/10 backdrop-blur-[1px]" />}
        {/* CHANGED: Removed arbitrary height constraints that cause overflow */}
        <div className="absolute inset-0 h-full w-full pointer-events-auto">
          <TravelWorldScene mode="globe" selected={selected} onSelect={handleDestinationSelect} />
        </div>
      </motion.div>
      </>
      )}

      {/* Focus Nav Arrows */}
      <AnimatePresence>
        {selected && activeView === "globe" && (
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