"use client";

import { Globe2, MapPinned, Heart } from "lucide-react";

export type GlobeFilter = "all" | "visited" | "target";

const OPTIONS: { value: GlobeFilter; label: string; icon: typeof Globe2 }[] = [
  { value: "all", label: "Todos", icon: Globe2 },
  { value: "visited", label: "Mis Viajes (3)", icon: MapPinned },
  { value: "target", label: "Deseados (2)", icon: Heart },
];

type Props = {
  value: GlobeFilter;
  onChange: (value: GlobeFilter) => void;
};

export function GlobeFilterToggle({ value, onChange }: Props) {
  return (
    <div className="glass inline-flex items-center gap-1 rounded-full p-1">
      {OPTIONS.map((opt) => {
        const active = value === opt.value;
        const Icon = opt.icon;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            aria-pressed={active}
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
              active
                ? "bg-primary text-primary-foreground glow-emerald"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Icon className="h-3.5 w-3.5" aria-hidden="true" />
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
