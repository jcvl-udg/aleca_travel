"use client";

import { useState } from "react";
import { ChevronRight, Share2, Heart, FileDown, Check } from "lucide-react";

type Props = {
  title: string;
  country: string;
};

// Sub-header pegajoso (sticky) con migas de pan y acciones rápidas.
export function TripSubheader({ title, country }: Props) {
  // Estado local para reflejar visualmente el guardado en favoritos.
  const [saved, setSaved] = useState(false);
  // Estado para mostrar confirmación tras compartir (y sus +50 pts).
  const [shared, setShared] = useState(false);

  // Comparte el viaje usando la Web Share API nativa; si no existe, copia el enlace.
  async function handleShare() {
    const url = typeof window !== "undefined" ? window.location.href : "";
    try {
      if (navigator.share) {
        await navigator.share({ title, text: `Mira este viaje: ${title}`, url });
      } else {
        await navigator.clipboard.writeText(url);
      }
      setShared(true);
      setTimeout(() => setShared(false), 2500);
    } catch {
      // El usuario canceló el diálogo de compartir; no hacemos nada.
    }
  }

  return (
    <div className="sticky top-0 z-40 border-b border-border">
      <div className="glass-strong">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-3 md:flex-row md:items-center md:justify-between">
          {/* Migas de pan de navegación */}
          <nav aria-label="Ruta de navegación" className="min-w-0">
            <ol className="flex items-center gap-1.5 overflow-x-auto text-sm text-muted-foreground">
              <li>
                <a href="/" className="transition-colors hover:text-foreground">
                  Inicio
                </a>
              </li>
              <ChevronRight className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              <li>
                <a href="#" className="transition-colors hover:text-foreground">
                  {country}
                </a>
              </li>
              <ChevronRight className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              <li aria-current="page" className="truncate font-medium text-foreground">
                {title}
              </li>
            </ol>
          </nav>

          {/* Acciones rápidas */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleShare}
              className="glass inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-colors hover:text-foreground"
            >
              {shared ? (
                <Check className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
              ) : (
                <Share2 className="h-3.5 w-3.5" aria-hidden="true" />
              )}
              <span className="whitespace-nowrap">
                {shared ? "¡Enlace listo!" : "Compartir"}
                {!shared && <span className="ml-1 text-primary">+50 pts</span>}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setSaved((v) => !v)}
              aria-pressed={saved}
              className="glass inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-colors hover:text-foreground"
            >
              <Heart
                className={`h-3.5 w-3.5 ${saved ? "fill-red-400 text-red-400" : ""}`}
                aria-hidden="true"
              />
              <span className="hidden whitespace-nowrap sm:inline">
                {saved ? "Guardado" : "Guardar en Favoritos"}
              </span>
            </button>

            <button
              type="button"
              onClick={() => window.print()}
              className="glass inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-colors hover:text-foreground"
            >
              <FileDown className="h-3.5 w-3.5" aria-hidden="true" />
              <span className="hidden whitespace-nowrap md:inline">Descargar Ficha PDF</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
