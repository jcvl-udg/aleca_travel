"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Flame, Crown, Sparkles, Images } from "lucide-react";
import type { Trip } from "@/lib/trip";

type Props = {
  gallery: Trip["gallery"];
  totalPhotos: number;
  requiredTier: string;
  pointsReward: number;
};

// Galería estilo bento: 1 imagen principal grande + 4 miniaturas en cuadrícula.
export function TripGallery({ gallery, totalPhotos, requiredTier, pointsReward }: Props) {
  const [main, ...thumbs] = gallery;

  return (
    <section aria-label="Galería del viaje" className="relative">
      <div className="grid gap-2 md:grid-cols-4 md:grid-rows-2">
        {/* Imagen principal (ocupa 2x2 en escritorio) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="relative col-span-2 row-span-2 aspect-[4/3] overflow-hidden rounded-3xl md:aspect-auto"
        >
          <Image
            src={main.src || "/placeholder.svg"}
            alt={main.alt}
            fill
            priority
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/70 via-transparent to-transparent" />

          {/* Insignias sobre la imagen principal */}
          <div className="absolute left-3 top-3 flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-1 rounded-full bg-gold/90 px-2.5 py-1 text-[11px] font-semibold text-[#1a1405]">
              <Flame className="h-3 w-3" aria-hidden="true" /> Más Vendido
            </span>
            <span className="glass-strong inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-medium text-foreground">
              <Crown className="h-3 w-3 text-gold" aria-hidden="true" /> Nivel VIP: {requiredTier}
            </span>
          </div>
          <div className="absolute bottom-3 left-3">
            <span className="inline-flex items-center gap-1 rounded-full bg-primary/90 px-2.5 py-1 text-[11px] font-semibold text-primary-foreground glow-emerald">
              <Sparkles className="h-3 w-3" aria-hidden="true" /> Ganas +
              {pointsReward.toLocaleString("es-MX")} Puntos
            </span>
          </div>
        </motion.div>

        {/* Miniaturas */}
        {thumbs.map((img, i) => (
          <motion.div
            key={img.src}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut", delay: 0.1 + i * 0.06 }}
            className="group relative aspect-square overflow-hidden rounded-2xl"
          >
            <Image
              src={img.src || "/placeholder.svg"}
              alt={img.alt}
              fill
              sizes="(max-width: 768px) 50vw, 25vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            {/* En la última miniatura mostramos el overlay "Ver todas las fotos" */}
            {i === thumbs.length - 1 && (
              <button
                type="button"
                className="absolute inset-0 flex flex-col items-center justify-center gap-1 bg-background/70 text-sm font-medium text-foreground opacity-0 backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-100"
              >
                <Images className="h-5 w-5" aria-hidden="true" />
                Ver todas las fotos ({totalPhotos})
              </button>
            )}
          </motion.div>
        ))}
      </div>
    </section>
  );
}
