"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Coins,
  Wallet,
  Calendar,
  Minus,
  Plus,
  ChevronDown,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  MessageCircle,
  Check,
} from "lucide-react";
import type { PricingTier, LoyaltyDiscount } from "@/lib/trip";

type Props = {
  title: string;
  pricing: PricingTier;
  loyalty: LoyaltyDiscount;
  // Costo extra por persona proveniente de las actividades opcionales seleccionadas en el itinerario.
  optionalPerPerson: number;
};

// Fechas de salida disponibles (salidas garantizadas del tour).
const DEPARTURE_DATES = [
  "12 Mar 2026",
  "09 Abr 2026",
  "14 May 2026",
  "11 Jun 2026",
  "10 Sep 2026",
  "08 Oct 2026",
];

// Número de WhatsApp del agente (formato internacional sin signos).
const WHATSAPP_NUMBER = "525512345678";

// Formatea un número como moneda USD.
function usd(value: number) {
  return `$${Math.round(value).toLocaleString("en-US")}`;
}

export function BookingCard({ title, pricing, loyalty, optionalPerPerson }: Props) {
  // Modo de pago: solo dinero, o puntos + dinero.
  const [usePoints, setUsePoints] = useState(false);
  // Estado para calcular el descuento dinámico aplicado por los puntos del cliente.
  const [pointsApplied, setPointsApplied] = useState(0);
  // Número de viajeros de la reserva.
  const [travelers, setTravelers] = useState(2);
  // Fecha de salida seleccionada.
  const [departure, setDeparture] = useState(DEPARTURE_DATES[0]);
  // Control de apertura del popover de fechas.
  const [dateOpen, setDateOpen] = useState(false);
  // Modalidad de pago: total o solo el anticipo (10%).
  const [depositOnly, setDepositOnly] = useState(false);

  // Puntos máximos aplicables: el menor entre el tope del programa y los puntos que dan el descuento máximo.
  const maxApplicablePoints = Math.min(
    loyalty.maxPoints,
    loyalty.maxDiscountUsd * loyalty.pointsPerDollar,
  );

  // Cálculo derivado del precio en tiempo real.
  const pricingSummary = useMemo(() => {
    // Precio por persona = base + actividades opcionales elegidas.
    const perPerson = pricing.pricePerPerson + optionalPerPerson;
    const subtotal = perPerson * travelers;

    // Descuento por puntos: convierte puntos a USD y respeta el tope del programa y el subtotal.
    const rawDiscount = usePoints ? pointsApplied / loyalty.pointsPerDollar : 0;
    const pointsDiscount = Math.min(rawDiscount, loyalty.maxDiscountUsd, subtotal);

    const total = subtotal - pointsDiscount;
    // Monto a pagar ahora según la modalidad (total o anticipo del 10%).
    const dueNow = depositOnly ? total * pricing.depositRate : total;

    return { perPerson, subtotal, pointsDiscount, total, dueNow };
  }, [pricing, optionalPerPerson, travelers, usePoints, pointsApplied, loyalty, depositOnly]);

  // Construye el enlace de WhatsApp con un mensaje dinámico pre-rellenado.
  const whatsappHref = useMemo(() => {
    const message = `Hola, me interesa el viaje "${title}".\n\n• Salida: ${departure}\n• Viajeros: ${travelers}\n• Total estimado: ${usd(
      pricingSummary.total,
    )} USD\n\n¿Me pueden ayudar con una cotización?`;
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  }, [title, departure, travelers, pricingSummary.total]);

  return (
    <div className="glass-strong rounded-3xl p-5">
      {/* Precio principal */}
      <div className="flex items-end justify-between">
        <div>
          <p className="text-xs text-muted-foreground">Desde</p>
          <p className="font-serif text-3xl leading-none">
            {usd(pricingSummary.perPerson)}
            <span className="ml-1 text-sm font-sans text-muted-foreground">USD / persona</span>
          </p>
        </div>
        <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 text-[11px] font-medium text-primary">
          <Sparkles className="h-3 w-3" aria-hidden="true" /> Precio VIP
        </span>
      </div>

      {/* Selector de modo de pago */}
      <div className="mt-5 grid grid-cols-2 gap-1 rounded-2xl bg-muted p-1" role="tablist">
        <button
          type="button"
          role="tab"
          aria-selected={!usePoints}
          onClick={() => setUsePoints(false)}
          className={`inline-flex items-center justify-center gap-1.5 rounded-xl px-3 py-2 text-xs font-medium transition-all ${
            !usePoints ? "bg-card text-foreground shadow" : "text-muted-foreground"
          }`}
        >
          <Wallet className="h-3.5 w-3.5" aria-hidden="true" /> Pagar con Dinero
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={usePoints}
          onClick={() => setUsePoints(true)}
          className={`inline-flex items-center justify-center gap-1.5 rounded-xl px-3 py-2 text-xs font-medium transition-all ${
            usePoints ? "bg-card text-foreground shadow" : "text-muted-foreground"
          }`}
        >
          <Coins className="h-3.5 w-3.5" aria-hidden="true" /> Puntos + Dinero
        </button>
      </div>

      {/* Calculadora de puntos (visible solo en modo puntos + dinero) */}
      <AnimatePresence initial={false}>
        {usePoints && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="mt-3 rounded-2xl border border-primary/30 bg-primary/5 p-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Aplicar puntos</span>
                <span className="font-medium tabular-nums">
                  {pointsApplied.toLocaleString("es-MX")} pts
                </span>
              </div>
              <input
                type="range"
                min={0}
                max={maxApplicablePoints}
                step={100}
                value={pointsApplied}
                onChange={(e) => setPointsApplied(Number(e.target.value))}
                aria-label="Puntos a aplicar"
                className="mt-2 w-full accent-[var(--primary)]"
              />
              <div className="mt-1 flex items-center justify-between text-xs">
                <span className="text-muted-foreground">
                  Máx {maxApplicablePoints.toLocaleString("es-MX")} pts
                </span>
                <span className="font-semibold text-primary">
                  Ahorras {usd(pricingSummary.pointsDiscount)}
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Selector de fecha (popover) y contador de viajeros */}
      <div className="mt-4 grid grid-cols-2 gap-2">
        <div className="relative">
          <button
            type="button"
            onClick={() => setDateOpen((v) => !v)}
            aria-expanded={dateOpen}
            className="glass flex w-full items-center gap-2 rounded-2xl px-3 py-2.5 text-left text-sm"
          >
            <Calendar className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
            <span className="min-w-0 flex-1">
              <span className="block text-[10px] uppercase tracking-wide text-muted-foreground">
                Salida
              </span>
              <span className="block truncate font-medium">{departure}</span>
            </span>
            <ChevronDown
              className={`h-4 w-4 shrink-0 text-muted-foreground transition-transform ${
                dateOpen ? "rotate-180" : ""
              }`}
              aria-hidden="true"
            />
          </button>

          <AnimatePresence>
            {dateOpen && (
              <>
                {/* Capa invisible para cerrar el popover al hacer clic fuera */}
                <button
                  type="button"
                  aria-label="Cerrar calendario"
                  className="fixed inset-0 z-40 cursor-default"
                  onClick={() => setDateOpen(false)}
                />
                <motion.ul
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.18 }}
                  className="glass-strong absolute left-0 right-0 top-full z-50 mt-2 max-h-56 overflow-auto rounded-2xl p-1"
                >
                  {DEPARTURE_DATES.map((date) => (
                    <li key={date}>
                      <button
                        type="button"
                        onClick={() => {
                          setDeparture(date);
                          setDateOpen(false);
                        }}
                        className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-sm transition-colors hover:bg-muted"
                      >
                        {date}
                        {departure === date && (
                          <Check className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
                        )}
                      </button>
                    </li>
                  ))}
                </motion.ul>
              </>
            )}
          </AnimatePresence>
        </div>

        {/* Contador de viajeros */}
        <div className="glass flex items-center justify-between rounded-2xl px-3 py-2.5">
          <span className="min-w-0">
            <span className="block text-[10px] uppercase tracking-wide text-muted-foreground">
              Viajeros
            </span>
            <span className="block font-medium tabular-nums">{travelers}</span>
          </span>
          <span className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setTravelers((n) => Math.max(1, n - 1))}
              disabled={travelers <= 1}
              aria-label="Quitar viajero"
              className="flex h-7 w-7 items-center justify-center rounded-lg bg-muted text-foreground transition-colors hover:bg-border disabled:opacity-40"
            >
              <Minus className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => setTravelers((n) => Math.min(8, n + 1))}
              disabled={travelers >= 8}
              aria-label="Agregar viajero"
              className="flex h-7 w-7 items-center justify-center rounded-lg bg-muted text-foreground transition-colors hover:bg-border disabled:opacity-40"
            >
              <Plus className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
          </span>
        </div>
      </div>

      {/* Toggle de modalidad de pago: total o anticipo del 10% */}
      <div className="mt-3 grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => setDepositOnly(false)}
          aria-pressed={!depositOnly}
          className={`rounded-2xl border px-3 py-2.5 text-left text-xs transition-all ${
            !depositOnly ? "border-primary/50 bg-primary/10" : "border-border bg-muted/30"
          }`}
        >
          <span className="block text-muted-foreground">Pagar Total</span>
          <span className="block font-semibold">{usd(pricingSummary.total)} USD</span>
        </button>
        <button
          type="button"
          onClick={() => setDepositOnly(true)}
          aria-pressed={depositOnly}
          className={`rounded-2xl border px-3 py-2.5 text-left text-xs transition-all ${
            depositOnly ? "border-primary/50 bg-primary/10" : "border-border bg-muted/30"
          }`}
        >
          <span className="block text-muted-foreground">Bloquear lugar (10%)</span>
          <span className="block font-semibold">
            {usd(pricingSummary.total * pricing.depositRate)} USD
          </span>
        </button>
      </div>

      {/* Desglose animado del monto a pagar ahora */}
      <div className="mt-4 space-y-1.5 border-t border-border pt-4 text-sm">
        <div className="flex justify-between text-muted-foreground">
          <span>
            {usd(pricingSummary.perPerson)} × {travelers} viajero{travelers > 1 ? "s" : ""}
          </span>
          <span className="tabular-nums">{usd(pricingSummary.subtotal)}</span>
        </div>
        {pricingSummary.pointsDiscount > 0 && (
          <div className="flex justify-between text-primary">
            <span>Descuento por puntos</span>
            <span className="tabular-nums">−{usd(pricingSummary.pointsDiscount)}</span>
          </div>
        )}
        <div className="flex items-end justify-between pt-1">
          <span className="text-muted-foreground">
            {depositOnly ? "A pagar ahora (anticipo)" : "Total"}
          </span>
          <motion.span
            key={pricingSummary.dueNow}
            initial={{ opacity: 0.4, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className="font-serif text-2xl tabular-nums"
          >
            {usd(pricingSummary.dueNow)}
          </motion.span>
        </div>
        {depositOnly && (
          <p className="text-[11px] text-muted-foreground">
            Restante {usd(pricingSummary.total - pricingSummary.dueNow)} USD antes de la salida.
          </p>
        )}
      </div>

      {/* CTA principal */}
      <button
        type="button"
        className="group mt-4 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-primary px-4 py-3.5 text-sm font-semibold text-primary-foreground transition-all hover:brightness-110 hover:glow-emerald"
      >
        Reservar Ahora
        <ArrowRight
          className="h-4 w-4 transition-transform group-hover:translate-x-1"
          aria-hidden="true"
        />
      </button>

      {/* CTA secundario de WhatsApp */}
      <a
        href={whatsappHref}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-border bg-muted/40 px-4 py-3 text-sm font-medium transition-colors hover:bg-muted"
      >
        <MessageCircle className="h-4 w-4 text-primary" aria-hidden="true" />
        Cotizar por WhatsApp con un Agente
      </a>

      {/* Sello de confianza */}
      <p className="mt-3 flex items-center justify-center gap-1.5 text-[11px] text-muted-foreground">
        <ShieldCheck className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
        Reserva segura · Cancelación flexible hasta 30 días antes
      </p>
    </div>
  );
}
