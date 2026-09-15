"use client";

import { Compass, Map, Search } from "lucide-react";
import type { ExplorationView } from "@/store/useTravelStore";

export type { ExplorationView } from "@/store/useTravelStore";

type Props = {
  value: ExplorationView;
  onChange: (view: ExplorationView) => void;
  cautionViews?: ExplorationView[];
  cautionReason?: string;
};

const OPTIONS: { value: ExplorationView; label: string; detail: string; icon: typeof Compass }[] = [
  { value: "search", label: "Buscar", detail: "rápido", icon: Search },
  { value: "map", label: "Mapa", detail: "2.5D", icon: Map },
  // { value: "globe", label: "Globo", detail: "3D", icon: Compass },
];

export function ViewModeSelector({ value, onChange, cautionViews = [], cautionReason }: Props) {
  return (
    <div className="glass-strong inline-flex max-w-full items-center gap-1 rounded-full p-1.5" aria-label="Modo de exploración">
      {OPTIONS.map((option) => {
        const Icon = option.icon;
        const active = option.value === value;
        const caution = cautionViews.includes(option.value);
        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            aria-pressed={active}
            title={caution ? cautionReason : undefined}
            className={`flex min-h-10 items-center gap-2 rounded-full px-3 text-left transition-colors sm:px-4 ${
              active ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
            } ${caution ? "border border-dashed border-accent-gold/70" : ""}`}
          >
            <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
            <span className="text-xs font-semibold sm:text-sm">{option.label}</span>
            <span className={`hidden text-[10px] uppercase tracking-[0.16em] sm:inline ${active ? "opacity-75" : "opacity-60"}`}>
              {option.detail}
            </span>
          </button>
        );
      })}
    </div>
  );
}
