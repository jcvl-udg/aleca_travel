"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { ArrowUpRight, CalendarRange, Check, CreditCard, MapPin, Search, SlidersHorizontal, Sparkles, Users } from "lucide-react";
import { DESTINATIONS, type Destination } from "@/lib/destinations";
import { TRAVEL_PACKAGES, type TripPackage } from "@/lib/trip-packages";

const SEARCH_SUGGESTIONS = ["Caribe", "Europa con historia", "Alta cocina", "Naturaleza"];
const MOODS = ["Todo", "Playa", "Gastronomía", "Historia", "Wellness"];
const BUDGETS = ["Todo", "$1k-$2k", "$2k-$3k", "$3k+"];

const PERSONAS = [
  { label: "Pareja", icon: "💕" },
  { label: "Familia", icon: "👨‍👩‍👧‍👦" },
  { label: "Amigos", icon: "🥂" },
  { label: "Solo", icon: "✈️" },
];

type Props = {
  onSelect: (destination: Destination) => void;
  onOpenDetails: () => void;
};

const currency = new Intl.NumberFormat("es-MX", {
  style: "currency",
  currency: "MXN",
  maximumFractionDigits: 0,
});

export function TravelSearch({ onSelect, onOpenDetails }: Props) {
  const [query, setQuery] = useState("");
  const [activeMood, setActiveMood] = useState("Todo");
  const [activeBudget, setActiveBudget] = useState("Todo");
  const [travelers, setTravelers] = useState(2);
  const [tripType, setTripType] = useState("Pareja");
  const [dateWindow, setDateWindow] = useState("Octubre");
  const [selectedPackageId, setSelectedPackageId] = useState<string>(TRAVEL_PACKAGES[0].id);
  const [checkoutStage, setCheckoutStage] = useState<"selection" | "payment">("selection");
  const [dynamicItems, setDynamicItems] = useState<Record<string, string>>({
    hotel: "Suite de 42 m²",
    flight: "Business",
    experience: "Cruise por el Sena",
  });

  const normalizedQuery = query.trim().toLowerCase();

  const results = useMemo(() => {
    const byMood =
      activeMood === "Todo"
        ? DESTINATIONS
        : DESTINATIONS.filter((destination) => destination.vibe.toLowerCase().includes(activeMood.toLowerCase()));

    const byBudget =
      activeBudget === "Todo"
        ? byMood
        : byMood.filter((destination) => {
            if (activeBudget === "$1k-$2k") return destination.price >= 1000 && destination.price <= 2000;
            if (activeBudget === "$2k-$3k") return destination.price > 2000 && destination.price <= 3000;
            if (activeBudget === "$3k+") return destination.price > 3000;
            return true;
          });

    if (!normalizedQuery) return byBudget;

    return byBudget.filter((destination) =>
      `${destination.name} ${destination.country} ${destination.landmark} ${destination.blurb} ${destination.vibe}`
        .toLowerCase()
        .includes(normalizedQuery),
    );
  }, [activeBudget, activeMood, normalizedQuery]);

  const featuredDestination = results[0] ?? DESTINATIONS[0];
  const selectedPackage = TRAVEL_PACKAGES.find((pkg) => pkg.id === selectedPackageId) ?? TRAVEL_PACKAGES[0];

  const selectDestination = (destination: Destination) => {
    onSelect(destination);
    onOpenDetails();
  };

  const handleSearch = () => {
    setCheckoutStage("selection");
    selectDestination(featuredDestination);
  };

  const updateDynamicItem = (key: keyof typeof dynamicItems, value: string) => {
    setDynamicItems((current) => ({ ...current, [key]: value }));
  };

  const handlePackageSelect = (pkg: TripPackage) => {
    setSelectedPackageId(pkg.id);
    setCheckoutStage("selection");
  };

  return (
    <div className="search-shell mx-auto flex w-full max-w-7xl flex-col px-4 pb-10 pt-24 sm:px-5 lg:px-10 lg:pt-36">
      <div className="search-layout grid gap-5 lg:grid-cols-[minmax(0,1.3fr)_minmax(320px,0.78fr)] lg:items-start">
        <div>
          <p className="mb-3 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-primary sm:text-xs">
            <Sparkles className="h-4 w-4" aria-hidden="true" /> Curaduría Aleca
          </p>
          <h1 className="max-w-xl font-serif text-4xl leading-[1.03] tracking-tight sm:text-5xl lg:text-6xl">
            Tu próximo viaje empieza aquí.
          </h1>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground">
            Busca por destino, país o emoción. En segundos te proponemos paquetes completos, listos para ajustar y reservar sin fricción.
          </p>

          <div className="glass-strong mt-6 rounded-3xl p-3 shadow-[0_20px_40px_rgba(13,16,24,0.08)]">
            <form className="flex flex-col gap-3" onSubmit={(event) => { event.preventDefault(); handleSearch(); }}>
              <div className="flex items-center gap-3 rounded-[1.1rem] border border-border bg-background/40 p-2.5">
                <Search className="ml-1 h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  type="search"
                  placeholder="Ej. París, playa, alta cocina..."
                  aria-label="Buscar destinos"
                  className="min-w-0 flex-1 bg-transparent px-1 py-1.5 text-sm text-foreground outline-none placeholder:text-muted-foreground"
                />
              </div>

              <div className="grid gap-2 sm:grid-cols-2">
                <label className="flex items-center gap-2 rounded-[1.05rem] border border-border bg-background/35 px-3 py-2.5 text-sm text-foreground">
                  <CalendarRange className="h-4 w-4 text-primary" aria-hidden="true" />
                  <select value={dateWindow} onChange={(event) => setDateWindow(event.target.value)} className="w-full bg-transparent text-sm outline-none">
                    <option>Octubre</option>
                    <option>Noviembre</option>
                    <option>Diciembre</option>
                    <option>Enero</option>
                  </select>
                </label>

                <label className="flex items-center gap-2 rounded-[1.05rem] border border-border bg-background/35 px-3 py-2.5 text-sm text-foreground">
                  <Users className="h-4 w-4 text-primary" aria-hidden="true" />
                  <div className="flex w-full items-center justify-between gap-2">
                    <span>Viajeros</span>
                    <input type="number" min={1} max={8} value={travelers} onChange={(event) => setTravelers(Number(event.target.value) || 1)} className="w-12 bg-transparent text-right outline-none" />
                  </div>
                </label>
              </div>

              <div className="flex flex-wrap gap-2" aria-label="Tipos de viaje">
                {PERSONAS.map((persona) => (
                  <button
                    key={persona.label}
                    type="button"
                    onClick={() => setTripType(persona.label)}
                    className={`rounded-full border px-2.5 py-1.5 text-xs transition-colors ${
                      tripType === persona.label ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <span className="mr-1">{persona.icon}</span>
                    {persona.label}
                  </button>
                ))}
              </div>

              <div className="flex items-center justify-between gap-2 rounded-[1.05rem] border border-border bg-background/35 px-3 py-2.5">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="h-4 w-4 text-primary" aria-hidden="true" />
                  <span className="text-sm text-muted-foreground">Presupuesto</span>
                </div>
                <div className="flex flex-wrap justify-end gap-1.5">
                  {BUDGETS.map((budget) => (
                    <button
                      key={budget}
                      type="button"
                      onClick={() => setActiveBudget(budget)}
                      className={`rounded-full px-2 py-1 text-[10px] uppercase tracking-[0.08em] ${
                        activeBudget === budget ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {budget}
                    </button>
                  ))}
                </div>
              </div>

              <button type="submit" className="mt-1 flex items-center justify-center gap-2 rounded-full bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground">
                Buscar ruta ideal
                <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
              </button>
            </form>
          </div>

          <div className="mt-3 flex max-w-3xl flex-wrap gap-2" aria-label="Búsquedas sugeridas">
            {SEARCH_SUGGESTIONS.map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                onClick={() => setQuery(suggestion)}
                className="rounded-full border border-border px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:border-primary hover:text-foreground"
              >
                {suggestion}
              </button>
            ))}
          </div>

          <div className="mt-5 flex flex-wrap gap-2" aria-label="Filtros por estado de ánimo">
            {MOODS.map((mood) => (
              <button
                key={mood}
                type="button"
                onClick={() => setActiveMood(mood)}
                aria-pressed={mood === activeMood}
                className={`rounded-full border px-3 py-1.5 text-[11px] font-medium transition-colors ${
                  mood === activeMood
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border text-muted-foreground hover:border-primary/50 hover:text-foreground"
                }`}
              >
                {mood}
              </button>
            ))}
          </div>
        </div>

        <aside className="search-summary glass-strong rounded-[1.6rem] p-4 sm:p-5">
          <div className="flex items-center justify-between gap-3">
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-primary">Pre-reserva</p>
            <span className="rounded-full border border-border px-2 py-1 text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
              {results.length} rutas
            </span>
          </div>

          <div className="mt-4 overflow-hidden rounded-[1.2rem] border border-border">
            <Image src={featuredDestination.image} alt={featuredDestination.name} width={800} height={420} className="h-40 w-full object-cover" />
          </div>

          <div className="mt-4">
            <p className="flex items-center gap-2 text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
              <MapPin className="h-3 w-3 text-primary" aria-hidden="true" />
              {featuredDestination.country}
            </p>
            <h2 className="mt-2 font-serif text-3xl leading-tight">{featuredDestination.name}</h2>
            <p className="mt-2 text-sm text-muted-foreground">{featuredDestination.blurb}</p>
          </div>

          <div className="mt-4 grid grid-cols-3 gap-2 text-center">
            <div className="rounded-2xl bg-muted/40 p-2">
              <p className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">Ideal</p>
              <p className="mt-1 text-sm font-semibold">{featuredDestination.bestFor}</p>
            </div>
            <div className="rounded-2xl bg-muted/40 p-2">
              <p className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">Duración</p>
              <p className="mt-1 text-sm font-semibold">{featuredDestination.duration}</p>
            </div>
            <div className="rounded-2xl bg-muted/40 p-2">
              <p className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">Desde</p>
              <p className="mt-1 text-sm font-semibold">{currency.format(featuredDestination.price)}</p>
            </div>
          </div>

          <div className="mt-5 flex items-center justify-between rounded-[1.05rem] border border-border bg-background/35 px-3 py-2 text-xs text-muted-foreground">
            <span>{tripType}</span>
            <span>{travelers} viajeros</span>
          </div>

          <button
            type="button"
            onClick={() => selectDestination(featuredDestination)}
            className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground"
          >
            Pre-reservar {featuredDestination.name}
            <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
          </button>
        </aside>
      </div>

      <div className="mt-8 grid gap-4 lg:grid-cols-[minmax(0,1.5fr)_minmax(320px,0.8fr)]">
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-3 px-1">
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-primary">Paquetes curados</p>
            <span className="rounded-full border border-border px-2 py-1 text-[10px] uppercase tracking-[0.14em] text-muted-foreground">Ajuste dinámico</span>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {TRAVEL_PACKAGES.map((pkg) => (
              <button
                key={pkg.id}
                type="button"
                onClick={() => handlePackageSelect(pkg)}
                className={`rounded-[1.4rem] border p-3 text-left transition-all ${selectedPackageId === pkg.id ? "border-primary bg-primary/5 shadow-[0_10px_35px_rgba(169,80,50,0.14)]" : "border-border bg-card/50 hover:-translate-y-0.5 hover:border-primary/40"}`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="rounded-full bg-primary/10 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-primary">
                    {pkg.tag}
                  </span>
                  <span className="text-xs text-muted-foreground">★ {pkg.rating}</span>
                </div>
                <h3 className="mt-3 font-serif text-2xl leading-tight">{pkg.name}</h3>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{pkg.summary}</p>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">Desde</span>
                  <span className="text-lg font-semibold text-foreground">{currency.format(pkg.total)}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="glass-strong rounded-[1.6rem] p-4 sm:p-5">
          <div className="flex items-center justify-between gap-3 border-b border-border pb-3">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-primary">Paquete activo</p>
              <p className="mt-1 font-serif text-2xl leading-tight">{selectedPackage.name}</p>
            </div>
            <button type="button" onClick={() => setCheckoutStage(checkoutStage === "selection" ? "payment" : "selection")} className="rounded-full bg-primary px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-primary-foreground">
              {checkoutStage === "selection" ? "Reservar" : "Editar"}
            </button>
          </div>

          <div className="mt-4 space-y-4">
            <div className="rounded-[1.2rem] border border-border bg-background/30 p-3">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">Estancia</p>
                  <p className="mt-1 text-lg font-semibold">{selectedPackage.nights} noches</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">Vibe</p>
                  <p className="mt-1 text-sm font-medium">{selectedPackage.vibe}</p>
                </div>
              </div>
            </div>

            <div className="rounded-[1.2rem] border border-border bg-background/30 p-3">
              <p className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">Hotel</p>
              <div className="mt-2 flex items-center justify-between gap-3">
                <div>
                  <p className="font-medium text-foreground">{selectedPackage.hotel.name}</p>
                  <p className="text-xs text-muted-foreground">{dynamicItems.hotel}</p>
                </div>
                <span className="text-sm font-semibold text-primary">{selectedPackage.hotel.rating}★</span>
              </div>
              <label className="mt-3 block text-xs text-muted-foreground">
                Edita la habitación
                <input value={dynamicItems.hotel} onChange={(event) => updateDynamicItem("hotel", event.target.value)} className="mt-1 w-full rounded-xl border border-border bg-transparent px-2 py-2 text-sm text-foreground outline-none" />
              </label>
            </div>

            <div className="rounded-[1.2rem] border border-border bg-background/30 p-3">
              <p className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">Vuelo</p>
              <div className="mt-2 flex items-center justify-between gap-2 text-sm">
                <span>{selectedPackage.flight.route}</span>
                <span className="rounded-full border border-border px-2 py-1 text-[10px] uppercase tracking-widest text-muted-foreground">{selectedPackage.flight.cabin}</span>
              </div>
              <div className="mt-2 flex items-center justify-between gap-2 text-xs text-muted-foreground">
                <span>{selectedPackage.flight.departure}</span>
                <span className="text-primary">→</span>
                <span>{selectedPackage.flight.return}</span>
              </div>
              <label className="mt-3 block text-xs text-muted-foreground">
                Cabin preferida
                <input value={dynamicItems.flight} onChange={(event) => updateDynamicItem("flight", event.target.value)} className="mt-1 w-full rounded-xl border border-border bg-transparent px-2 py-2 text-sm text-foreground outline-none" />
              </label>
            </div>

            <div className="rounded-[1.2rem] border border-border bg-background/30 p-3">
              <p className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">Experiencias</p>
              <div className="mt-2 space-y-2">
                {selectedPackage.experiences.map((experience) => (
                  <div key={experience.title} className="rounded-xl border border-border bg-card/40 p-2">
                    <div className="flex items-center justify-between gap-2">
                      <div>
                        <p className="text-sm font-medium text-foreground">{experience.title}</p>
                        <p className="text-[11px] text-muted-foreground">{experience.description}</p>
                      </div>
                      <span className="text-xs font-medium text-primary">{currency.format(experience.price)}</span>
                    </div>
                  </div>
                ))}
              </div>
              <label className="mt-3 block text-xs text-muted-foreground">
                Experiencia principal
                <input value={dynamicItems.experience} onChange={(event) => updateDynamicItem("experience", event.target.value)} className="mt-1 w-full rounded-xl border border-border bg-transparent px-2 py-2 text-sm text-foreground outline-none" />
              </label>
            </div>

            {checkoutStage === "payment" && (
              <div className="rounded-[1.2rem] border border-primary/30 bg-primary/5 p-3">
                <div className="flex items-center gap-2 text-primary">
                  <CreditCard className="h-4 w-4" aria-hidden="true" />
                  <span className="text-[10px] font-semibold uppercase tracking-[0.16em]">Pasarela de pago</span>
                </div>
                <div className="mt-3 space-y-3 text-sm">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-muted-foreground">Paquete</span>
                    <span className="font-medium text-foreground">{selectedPackage.name}</span>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-muted-foreground">Ajustes</span>
                    <span className="font-medium text-foreground">{dynamicItems.hotel} · {dynamicItems.flight}</span>
                  </div>
                  <div className="flex items-center justify-between gap-3 rounded-xl border border-border bg-background/30 px-3 py-2">
                    <span className="text-muted-foreground">Total estimado</span>
                    <span className="text-lg font-semibold text-foreground">{currency.format(selectedPackage.total)}</span>
                  </div>
                  <button type="button" className="flex w-full items-center justify-center gap-2 rounded-full bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground">
                    <Check className="h-4 w-4" aria-hidden="true" />
                    Confirmar pago
                  </button>
                </div>
              </div>
            )}

            <div className="rounded-[1.2rem] border border-border bg-background/30 p-3 text-xs text-muted-foreground">
              <p className="font-medium uppercase tracking-[0.12em] text-foreground">Incluye</p>
              <ul className="mt-2 space-y-2">
                {selectedPackage.inclusions.map((inclusion) => (
                  <li key={inclusion} className="flex items-center gap-2">
                    <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-primary">✓</span>
                    {inclusion}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {results.map((destination) => (
          <button
            key={destination.id}
            type="button"
            onClick={() => selectDestination(destination)}
            className="search-result glass group flex min-h-40 flex-col justify-between rounded-[1.45rem] p-4 text-left transition-transform duration-200 hover:-translate-y-1"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-primary">
                  <MapPin className="h-3 w-3" aria-hidden="true" /> {destination.country}
                </span>
                <span className="mt-2 block font-serif text-2xl leading-tight">{destination.name}</span>
              </div>
              <ArrowUpRight className="h-4 w-4 shrink-0 text-primary transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
            </div>

            <div className="mt-4 flex items-center justify-between gap-2 text-xs text-muted-foreground">
              <span>{destination.vibe}</span>
              <span>{destination.duration}</span>
            </div>

            <p className="mt-3 line-clamp-2 text-xs leading-relaxed text-muted-foreground">{destination.landmark} · {destination.blurb}</p>
          </button>
        ))}
      </div>

      {results.length === 0 && (
        <div className="mt-6 border border-dashed border-border bg-card/50 p-8 text-center text-sm text-muted-foreground">
          No encontramos ese rumbo todavía. Prueba con otro país o una emoción distinta.
        </div>
      )}
    </div>
  );
}
