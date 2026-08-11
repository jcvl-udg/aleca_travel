import { Award, Sparkles } from "lucide-react";
import type { Trip } from "@/lib/trip";

type Props = {
  medal: Trip["medal"];
  pointsReward: number;
};

// Caja de enganche gamificado: muestra la medalla desbloqueable del Pasaporte Digital.
export function LoyaltyHook({ medal, pointsReward }: Props) {
  return (
    <section
      aria-label="Recompensa de lealtad"
      className="glass relative overflow-hidden rounded-3xl p-5"
    >
      {/* Resplandor decorativo de fondo */}
      <div
        className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-gold/20 blur-3xl"
        aria-hidden="true"
      />
      <div className="relative flex items-center gap-4">
        {/* Medalla flotante */}
        <span className="animate-float-slow flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-gold to-amber-600 text-[#1a1405] glow-gold">
          <Award className="h-8 w-8" aria-hidden="true" />
        </span>
        <div className="min-w-0">
          <p className="flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-widest text-gold">
            <Sparkles className="h-3 w-3" aria-hidden="true" />
            Logro desbloqueable
          </p>
          <h3 className="mt-1 text-pretty font-serif text-lg leading-tight">
            Si completas este viaje desbloqueas la medalla &ldquo;{medal.name}&rdquo;
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            {medal.description} Además sumas{" "}
            <span className="font-semibold text-primary">
              +{pointsReward.toLocaleString("es-MX")} puntos
            </span>{" "}
            a tu cuenta.
          </p>
        </div>
      </div>
    </section>
  );
}
