"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, Landmark, MapPinned, Route } from "lucide-react";
import { DESTINATIONS, type Destination } from "@/lib/destinations";
import { TravelWorldScene } from "./travel-world-scene";

type RegionId = "all" | "americas" | "europe" | "asia" | "africa";

type Props = {
  onSelect: (destination: Destination) => void;
  onOpenDetails: () => void;
};

const REGIONS: { id: RegionId; label: string; eyebrow: string; description: string; destinationIds: string[]; accent: string }[] = [
  { id: "all", label: "Mapa completo", eyebrow: "El mundo", description: "Una vista general para elegir tu próximo rumbo.", destinationIds: DESTINATIONS.map((d) => d.id), accent: "#a95032" },
  { id: "americas", label: "Las Américas", eyebrow: "Norte a sur", description: "Caribe, ciudades coloniales y rutas de naturaleza.", destinationIds: ["cancun"], accent: "#53766d" },
  { id: "europe", label: "Europa", eyebrow: "Arte y memoria", description: "Capitales culturales, gastronomía y hoteles con historia.", destinationIds: ["paris", "london"], accent: "#a95032" },
  { id: "asia", label: "Asia", eyebrow: "Rituales y contraste", description: "Templos, alta cocina y refugios entre arrozales.", destinationIds: ["tokyo", "bali"], accent: "#b98432" },
  { id: "africa", label: "África y Oriente", eyebrow: "Horizontes antiguos", description: "Desiertos, ríos y patrimonio que permanece.", destinationIds: ["cairo"], accent: "#8b6d3d" },
];

const POINTS: Record<string, { left: string; top: string }> = {
  cancun: { left: "29%", top: "54%" },
  paris: { left: "51%", top: "35%" },
  tokyo: { left: "79%", top: "42%" },
  bali: { left: "72%", top: "66%" },
  cairo: { left: "57%", top: "49%" },
  london: { left: "48%", top: "30%" },
};

export function TravelMap({ onSelect, onOpenDetails }: Props) {
  const [region, setRegion] = React.useState<RegionId>("all");
  const selectedRegion = REGIONS.find((item) => item.id === region) ?? REGIONS[0];
  const destinations = DESTINATIONS.filter((destination) => selectedRegion.destinationIds.includes(destination.id));

  return (
    <div className="mx-auto flex h-full w-full max-w-7xl flex-col gap-5 px-4 pb-8 pt-28 lg:px-12 lg:pt-36">
      <div className="grid gap-4 lg:grid-cols-[minmax(0,0.72fr)_minmax(0,1.28fr)] lg:items-end">
        <div>
          <p className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
            <Route className="h-4 w-4" aria-hidden="true" /> Vista 2.5D
          </p>
          <h1 className="max-w-xl font-serif text-4xl leading-[1.03] tracking-tight sm:text-5xl lg:text-6xl">
            Elige una región y deja que el mapa te guíe.
          </h1>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-muted-foreground">
            Es una escena ligera, cenital y táctil pensada para comparar destinos antes de abrir la opción de reserva.
          </p>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1 lg:justify-end">
          {REGIONS.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setRegion(item.id)}
              aria-pressed={item.id === region}
              className={`min-w-[116px] shrink-0 border-b-2 px-3 py-2 text-left transition-colors ${item.id === region ? "border-primary text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"}`}
            >
              <span className="block text-[10px] uppercase tracking-[0.16em]">{item.eyebrow}</span>
              <span className="mt-1 block text-sm font-semibold">{item.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="map-view-grid grid min-h-0 flex-1 gap-4 lg:grid-cols-[minmax(0,1.5fr)_minmax(270px,0.5fr)]">
        <motion.div
          key={region}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="map-paper map-orbit relative min-h-[330px] overflow-hidden border border-border p-4 sm:p-7"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(169,80,50,0.10),_transparent_60%)]" aria-hidden="true" />
          <div className="absolute left-5 top-5 z-10 flex items-center gap-2 text-xs font-semibold text-muted-foreground">
            <MapPinned className="h-4 w-4 text-primary" aria-hidden="true" /> {selectedRegion.label}
          </div>
          <div className="map-compass absolute right-5 top-5 z-10" aria-label="Brújula del mapa">
            <span className="map-compass__north">N</span>
            <span className="map-compass__needle" />
            <span className="map-compass__south">S</span>
          </div>

          {/* <div className="map-route-card absolute bottom-16 left-5 z-10 max-w-[15rem] border border-border bg-card/90 p-3 backdrop-blur-sm sm:bottom-20 sm:left-7">
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-primary">Ruta sugerida</p>
            <p className="mt-1 font-serif text-xl">{selectedRegion.eyebrow}</p>
            <div className="mt-2 flex items-center gap-2 text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
              <span className="map-route-card__dot" style={{ backgroundColor: selectedRegion.accent }} />
              <span>{destinations.length} paradas · curaduría VIP</span>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">Toca un pin para abrir la pre-reserva.</p>
          </div> */}

          <TravelWorldScene mode="map" onSelect={onSelect} />

          {destinations.map((destination) => {
            const point = POINTS[destination.id];
            return (
              <button
                key={destination.id}
                type="button"
                onClick={() => {
                  onSelect(destination);
                  onOpenDetails();
                }}
                className="map-pin group absolute z-10 -translate-x-1/2 -translate-y-1/2"
                style={point}
                aria-label={`Abrir ${destination.name}`}
              >
                <span className="map-pin__dot" style={{ backgroundColor: selectedRegion.accent }}>
                  <Landmark className="h-3.5 w-3.5 text-[var(--card)]" aria-hidden="true" />
                </span>
                <span className="map-pin__label">{destination.name}</span>
              </button>
            );
          })}

          <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between gap-4 text-xs text-muted-foreground">
            <span className="max-w-[15rem] sm:max-w-sm">{selectedRegion.description}</span>
            <span className="hidden shrink-0 uppercase tracking-[0.16em] sm:inline">Aleca / 2026</span>
          </div>
        </motion.div>

        <div className="map-destination-list flex flex-col gap-3">
          <div className="border-b border-border pb-3">
            <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Destinos en ruta</p>
            <p className="mt-1 font-serif text-2xl">{destinations.length} lugares para empezar</p>
          </div>
          <div className="map-list-hint flex items-center gap-2 text-xs text-muted-foreground">
            <Route className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
            <span>Compara la ruta y elige una parada.</span>
          </div>
          {destinations.map((destination) => (
            <button
              key={destination.id}
              type="button"
              onClick={() => {
                onSelect(destination);
                onOpenDetails();
              }}
              className="glass group flex items-center gap-3 p-3 text-left transition-transform hover:-translate-y-0.5"
            >
              <span className="h-12 w-12 shrink-0 bg-muted" style={{ backgroundImage: `url(${destination.image})`, backgroundPosition: "center", backgroundSize: "cover" }} aria-hidden="true" />
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-semibold">{destination.name}</span>
                <span className="mt-1 block truncate text-xs text-muted-foreground">{destination.landmark} · {destination.points} pts VIP</span>
              </span>
              <ArrowUpRight className="h-4 w-4 shrink-0 text-primary transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
