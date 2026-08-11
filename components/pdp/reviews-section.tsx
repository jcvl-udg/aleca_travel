import Image from "next/image";
import { Star, BadgeCheck } from "lucide-react";
import type { Trip } from "@/lib/trip";

type Props = {
  reviews: Trip["reviews"];
  rating: number;
  reviewCount: number;
};

// Sección de prueba social: reseñas verificadas con avatar, fecha e insignia.
export function ReviewsSection({ reviews, rating, reviewCount }: Props) {
  return (
    <section aria-label="Opiniones de viajeros" className="mx-auto max-w-6xl px-4 py-12">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="font-serif text-2xl sm:text-3xl">Lo que dicen nuestros viajeros</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Experiencias reales de exploradores Aleca.
          </p>
        </div>
        <div className="glass flex items-center gap-2 rounded-2xl px-4 py-2.5">
          <Star className="h-5 w-5 fill-gold text-gold" aria-hidden="true" />
          <span className="text-xl font-semibold">{rating.toFixed(1)}</span>
          <span className="text-sm text-muted-foreground">/ 5 · {reviewCount} opiniones</span>
        </div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {reviews.map((review) => (
          <article key={review.id} className="glass flex flex-col rounded-3xl p-5">
            <div className="flex items-center gap-3">
              <div className="relative h-11 w-11 overflow-hidden rounded-full">
                <Image
                  src={review.avatar || "/placeholder.svg"}
                  alt={`Foto de ${review.name}`}
                  fill
                  sizes="44px"
                  className="object-cover"
                />
              </div>
              <div className="min-w-0">
                <p className="flex items-center gap-1 font-medium leading-tight">
                  <span className="truncate">{review.name}</span>
                  {review.verified && (
                    <BadgeCheck className="h-4 w-4 shrink-0 text-primary" aria-label="Viajero Verificado" />
                  )}
                </p>
                <p className="text-xs text-muted-foreground">Viajó en {review.tripDate}</p>
              </div>
            </div>

            {/* Valoración por estrellas */}
            <div className="mt-3 flex gap-0.5" aria-label={`${review.rating} de 5 estrellas`}>
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`h-3.5 w-3.5 ${
                    i < review.rating ? "fill-gold text-gold" : "text-muted"
                  }`}
                  aria-hidden="true"
                />
              ))}
            </div>

            <p className="mt-3 text-pretty text-sm leading-relaxed text-muted-foreground">
              {review.comment}
            </p>

            {review.verified && (
              <span className="mt-4 inline-flex w-fit items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 text-[11px] font-medium text-primary">
                <BadgeCheck className="h-3 w-3" aria-hidden="true" /> Viajero Verificado
              </span>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}
