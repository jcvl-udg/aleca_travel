"use client";

import { MapPin, CalendarRange, Users, Search } from "lucide-react";

export function SearchPanel() {
  return (
    <form
      className="glass-strong grid grid-cols-1 gap-2 rounded-3xl p-2 sm:grid-cols-[1.4fr_1fr_1fr_auto] sm:items-center"
      onSubmit={(e) => e.preventDefault()}
    >
      <Field icon={MapPin} label="Destino">
        <input
          type="text"
          defaultValue="¿A dónde quieres ir?"
          className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
          aria-label="Destino"
        />
      </Field>

      <Field icon={CalendarRange} label="Fechas">
        <input
          type="text"
          defaultValue="12 – 20 Ago"
          className="w-full bg-transparent text-sm text-foreground outline-none"
          aria-label="Fechas del viaje"
        />
      </Field>

      <Field icon={Users} label="Viajeros">
        <input
          type="text"
          defaultValue="2 adultos"
          className="w-full bg-transparent text-sm text-foreground outline-none"
          aria-label="Número de viajeros"
        />
      </Field>

      <button
        type="submit"
        className="inline-flex h-full min-h-12 items-center justify-center gap-2 rounded-2xl bg-primary px-5 text-sm font-semibold text-primary-foreground transition-all hover:brightness-110 glow-emerald"
      >
        <Search className="h-4 w-4" aria-hidden="true" />
        Buscar
      </button>
    </form>
  );
}

function Field({
  icon: Icon,
  label,
  children,
}: {
  icon: typeof MapPin;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="flex items-center gap-3 rounded-2xl bg-muted/60 px-4 py-2.5">
      <Icon className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
      <span className="flex flex-col">
        <span className="text-[10px] uppercase tracking-wide text-muted-foreground">{label}</span>
        {children}
      </span>
    </label>
  );
}
