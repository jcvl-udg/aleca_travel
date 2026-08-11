import {
  Star,
  Clock,
  Activity,
  Hotel,
  Languages,
  Coffee,
  Plane,
  type LucideIcon,
} from "lucide-react";
import type { Trip } from "@/lib/trip";

type Props = {
  trip: Trip;
};

// Mapa de nombres de icono (string en los datos) a componentes de lucide-react.
const ICONS: Record<string, LucideIcon> = {
  Hotel,
  Languages,
  Coffee,
  Plane,
};

// Colores de la píldora de dificultad según el nivel físico.
const DIFFICULTY_STYLES: Record<Trip["difficulty"], string> = {
  Ligera: "bg-primary/15 text-primary",
  Moderada: "bg-gold/15 text-gold",
  Exigente: "bg-red-500/15 text-red-400",
};

export function TripOverview({ trip }: Props) {
  return (
    <section aria-label="Información del viaje">
      <p className="text-sm font-medium uppercase tracking-widest text-primary">{trip.country}</p>
      <h1 className="mt-2 text-balance font-serif text-3xl leading-tight sm:text-4xl">
        {trip.title}
      </h1>

      {/* Datos rápidos: duración, valoración y dificultad */}
      <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
        <span className="inline-flex items-center gap-1.5 text-muted-foreground">
          <Clock className="h-4 w-4" aria-hidden="true" />
          {trip.durationDays} Días / {trip.durationNights} Noches
        </span>
        <span className="inline-flex items-center gap-1.5">
          <Star className="h-4 w-4 fill-gold text-gold" aria-hidden="true" />
          <span className="font-semibold">{trip.rating.toFixed(1)}</span>
          <span className="text-muted-foreground">({trip.reviewCount} opiniones)</span>
        </span>
        <span
          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${
            DIFFICULTY_STYLES[trip.difficulty]
          }`}
        >
          <Activity className="h-3 w-3" aria-hidden="true" />
          Dificultad {trip.difficulty}
        </span>
      </div>

      {/* Barra de puntos destacados con iconos */}
      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {trip.highlights.map((h) => {
          const Icon = ICONS[h.icon] ?? Star;
          return (
            <div
              key={h.label}
              className="glass flex items-center gap-2.5 rounded-2xl px-3 py-3"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Icon className="h-4 w-4" aria-hidden="true" />
              </span>
              <span className="text-sm font-medium leading-tight">{h.label}</span>
            </div>
          );
        })}
      </div>
    </section>
  );
}
