// Modelo de datos del producto de viaje (PDP)
// Tipos dinámicos reutilizables para itinerario, precios y descuentos por lealtad.

import type { LucideIcon } from "lucide-react";

// Momento del día dentro de un bloque de itinerario.
export type DayPeriod = "morning" | "afternoon" | "night";

// Comidas incluidas en un día concreto.
export type MealType = "breakfast" | "lunch" | "dinner";

// Actividad opcional que el cliente puede sumar a su reserva (con costo extra en USD).
export interface OptionalActivity {
  id: string;
  label: string;
  price: number; // Costo adicional por persona en USD
}

// Bloque de actividad para una franja horaria del día.
export interface DayActivity {
  period: DayPeriod;
  title: string;
  description: string;
}

// Un día completo del itinerario (tarjeta expandible del acordeón).
export interface ItineraryDay {
  day: number;
  city: string;
  title: string;
  summary: string;
  image: string;
  meals: MealType[];
  activities: DayActivity[];
  optional: OptionalActivity[];
}

// Nivel de precio / paquete disponible para el viaje.
export interface PricingTier {
  id: string;
  label: string;
  pricePerPerson: number; // Precio base por persona en USD
  depositRate: number; // Proporción del anticipo (ej. 0.1 = 10%)
}

// Configuración del canje de puntos por descuento (calculadora de lealtad).
export interface LoyaltyDiscount {
  maxPoints: number; // Puntos máximos aplicables
  pointsPerDollar: number; // Cuántos puntos equivalen a 1 USD de descuento
  maxDiscountUsd: number; // Tope de descuento en USD
}

// Punto destacado del viaje (barra de iconos rápidos).
export interface TripHighlight {
  icon: string; // Nombre del icono de lucide-react
  label: string;
}

// Reseña verificada de un viajero (prueba social).
export interface TripReview {
  id: string;
  name: string;
  avatar: string;
  tripDate: string;
  rating: number;
  verified: boolean;
  comment: string;
}

// Estructura principal del producto de viaje.
export interface Trip {
  slug: string;
  title: string;
  country: string;
  durationDays: number;
  durationNights: number;
  rating: number;
  reviewCount: number;
  difficulty: "Ligera" | "Moderada" | "Exigente";
  requiredTier: string;
  pointsReward: number;
  gallery: { src: string; alt: string }[];
  totalPhotos: number;
  highlights: TripHighlight[];
  pricing: PricingTier;
  loyalty: LoyaltyDiscount;
  itinerary: ItineraryDay[];
  reviews: TripReview[];
  medal: { name: string; description: string };
}

// ---------------------------------------------------------------------------
// Datos del viaje "Ruta Imperial Kioto & Tokio"
// ---------------------------------------------------------------------------

export const JAPAN_TRIP: Trip = {
  slug: "ruta-imperial-japon",
  title: "Ruta Imperial Kioto & Tokio",
  country: "Japón",
  durationDays: 10,
  durationNights: 9,
  rating: 4.9,
  reviewCount: 128,
  difficulty: "Moderada",
  requiredTier: "Plata o Superior",
  pointsReward: 1200,
  totalPhotos: 24,
  gallery: [
    { src: "/trips/japan/kyoto-temple.png", alt: "Templo dorado Kinkaku-ji reflejado en el estanque, Kioto" },
    { src: "/trips/japan/fushimi-torii.png", alt: "Túnel de puertas torii bermellón en Fushimi Inari" },
    { src: "/trips/japan/shibuya.png", alt: "Cruce de Shibuya iluminado por neón en Tokio" },
    { src: "/trips/japan/ryokan.png", alt: "Onsen privado de un ryokan tradicional japonés" },
    { src: "/trips/japan/tokyo-skyline.png", alt: "Horizonte de Tokio al atardecer con el Monte Fuji al fondo" },
  ],
  highlights: [
    { icon: "Hotel", label: "Hoteles 4★" },
    { icon: "Languages", label: "Guía en Español" },
    { icon: "Coffee", label: "Desayunos Incluidos" },
    { icon: "Plane", label: "Enlace Aéreo" },
  ],
  pricing: {
    id: "standard",
    label: "Tarifa por persona",
    pricePerPerson: 2890,
    depositRate: 0.1,
  },
  loyalty: {
    maxPoints: 5000,
    pointsPerDollar: 10, // 10 puntos = 1 USD
    maxDiscountUsd: 500,
  },
  medal: {
    name: "Samurái Urbano",
    description:
      "Al completar este viaje desbloqueas la medalla exclusiva en tu Pasaporte Digital.",
  },
  itinerary: [
    {
      day: 1,
      city: "Tokio",
      title: "Bienvenida a la metrópoli",
      summary: "Llegada al aeropuerto de Narita y traslado privado a tu hotel en Shinjuku.",
      image: "/trips/japan/shibuya.png",
      meals: ["dinner"],
      activities: [
        { period: "afternoon", title: "Traslado privado", description: "Recepción en el aeropuerto y check-in en hotel 4★." },
        { period: "night", title: "Cena de bienvenida", description: "Izakaya tradicional en el corazón de Shinjuku con tu guía." },
      ],
      optional: [{ id: "d1-heli", label: "Tour nocturno en helicóptero", price: 320 }],
    },
    {
      day: 2,
      city: "Tokio",
      title: "Contrastes de la capital",
      summary: "De los templos de Asakusa al futurismo de Shibuya.",
      image: "/trips/japan/tokyo-skyline.png",
      meals: ["breakfast", "lunch"],
      activities: [
        { period: "morning", title: "Templo Senso-ji", description: "Recorrido por Asakusa y la calle comercial Nakamise." },
        { period: "afternoon", title: "Cruce de Shibuya", description: "El paso peatonal más famoso del mundo y barrio de Harajuku." },
        { period: "night", title: "Tiempo libre", description: "Explora la vida nocturna de Tokio a tu ritmo." },
      ],
      optional: [{ id: "d2-teamlab", label: "Museo digital teamLab Planets", price: 45 }],
    },
    {
      day: 3,
      city: "Tokio",
      title: "Cultura y alta cocina",
      summary: "Mercado de Toyosu y una experiencia kaiseki privada.",
      image: "/trips/japan/kaiseki.png",
      meals: ["breakfast", "dinner"],
      activities: [
        { period: "morning", title: "Mercado de Toyosu", description: "Degustación de sushi fresco al amanecer." },
        { period: "afternoon", title: "Jardines del Palacio Imperial", description: "Paseo guiado por los jardines históricos." },
        { period: "night", title: "Cena kaiseki", description: "Menú de temporada de varios tiempos en un restaurante exclusivo." },
      ],
      optional: [{ id: "d3-sumo", label: "Torneo de sumo (según temporada)", price: 90 }],
    },
    {
      day: 4,
      city: "Hakone",
      title: "Monte Fuji y aguas termales",
      summary: "Escapada a Hakone con vistas al Fuji y noche en ryokan.",
      image: "/trips/japan/ryokan.png",
      meals: ["breakfast", "dinner"],
      activities: [
        { period: "morning", title: "Lago Ashi", description: "Crucero panorámico con vistas al Monte Fuji." },
        { period: "afternoon", title: "Teleférico de Hakone", description: "Vistas del valle volcánico de Owakudani." },
        { period: "night", title: "Ryokan y onsen", description: "Noche en posada tradicional con baño termal privado." },
      ],
      optional: [{ id: "d4-fuji", label: "Ascenso guiado a la 5ª estación del Fuji", price: 130 }],
    },
    {
      day: 5,
      city: "Kioto",
      title: "Tren bala a la ciudad imperial",
      summary: "Viaje en Shinkansen y primera tarde en Kioto.",
      image: "/trips/japan/kyoto-temple.png",
      meals: ["breakfast"],
      activities: [
        { period: "morning", title: "Shinkansen", description: "Experiencia en el tren bala de Hakone a Kioto." },
        { period: "afternoon", title: "Templo Kinkaku-ji", description: "El icónico Pabellón Dorado y sus jardines." },
        { period: "night", title: "Barrio de Gion", description: "Paseo por el distrito de las geishas al anochecer." },
      ],
      optional: [{ id: "d5-tea", label: "Ceremonia del té privada", price: 60 }],
    },
    {
      day: 6,
      city: "Kioto",
      title: "Mil puertas bermellón",
      summary: "Fushimi Inari y el bosque de bambú de Arashiyama.",
      image: "/trips/japan/fushimi-torii.png",
      meals: ["breakfast", "lunch"],
      activities: [
        { period: "morning", title: "Fushimi Inari", description: "Ascenso entre los famosos túneles de puertas torii." },
        { period: "afternoon", title: "Arashiyama", description: "Bosque de bambú y templo Tenryu-ji." },
        { period: "night", title: "Cena libre", description: "Recomendaciones gastronómicas de tu guía local." },
      ],
      optional: [{ id: "d6-kimono", label: "Alquiler de kimono y sesión de fotos", price: 75 }],
    },
    {
      day: 7,
      city: "Nara",
      title: "Ciervos y grandes templos",
      summary: "Excursión de día a Nara, la primera capital de Japón.",
      image: "/trips/japan/kyoto-temple.png",
      meals: ["breakfast"],
      activities: [
        { period: "morning", title: "Parque de Nara", description: "Encuentro con los ciervos sagrados en libertad." },
        { period: "afternoon", title: "Templo Todai-ji", description: "El Gran Buda de bronce y sus salones de madera." },
        { period: "night", title: "Regreso a Kioto", description: "Noche libre en la ciudad imperial." },
      ],
      optional: [{ id: "d7-cooking", label: "Clase de cocina japonesa", price: 85 }],
    },
    {
      day: 8,
      city: "Kioto",
      title: "Día a tu medida",
      summary: "Jornada libre para descubrir Kioto a tu ritmo.",
      image: "/trips/japan/kaiseki.png",
      meals: ["breakfast"],
      activities: [
        { period: "morning", title: "Tiempo libre", description: "Compras en Nishiki o templos a tu elección." },
        { period: "afternoon", title: "Actividades opcionales", description: "Tu guía te ayuda a diseñar la tarde perfecta." },
        { period: "night", title: "Cena de despedida de Kioto", description: "Restaurante seleccionado con especialidades locales." },
      ],
      optional: [{ id: "d8-bike", label: "Tour en bicicleta por el este de Kioto", price: 50 }],
    },
    {
      day: 9,
      city: "Tokio",
      title: "Regreso a la capital",
      summary: "Vuelta a Tokio y últimas compras.",
      image: "/trips/japan/shibuya.png",
      meals: ["breakfast", "dinner"],
      activities: [
        { period: "morning", title: "Shinkansen a Tokio", description: "Regreso panorámico a la capital." },
        { period: "afternoon", title: "Ginza y Akihabara", description: "Compras de lujo o tecnología, tú eliges." },
        { period: "night", title: "Cena final", description: "Celebración de fin de viaje con el grupo." },
      ],
      optional: [{ id: "d9-robot", label: "Espectáculo y cena temática", price: 55 }],
    },
    {
      day: 10,
      city: "Tokio",
      title: "Hasta pronto, Japón",
      summary: "Traslado privado al aeropuerto y vuelo de regreso.",
      image: "/trips/japan/tokyo-skyline.png",
      meals: ["breakfast"],
      activities: [
        { period: "morning", title: "Traslado al aeropuerto", description: "Despedida y asistencia en el check-in de tu vuelo." },
      ],
      optional: [],
    },
  ],
  reviews: [
    {
      id: "r1",
      name: "Mariana Cortés",
      avatar: "/trips/japan/avatar-1.png",
      tripDate: "Marzo 2026",
      rating: 5,
      verified: true,
      comment:
        "Superó todas mis expectativas. La cena kaiseki y la noche en el ryokan fueron mágicas. El guía en español hizo toda la diferencia.",
    },
    {
      id: "r2",
      name: "Ricardo Ballesteros",
      avatar: "/trips/japan/avatar-2.png",
      tripDate: "Febrero 2026",
      rating: 5,
      verified: true,
      comment:
        "Organización impecable de principio a fin. Los traslados privados y los hoteles fueron de primer nivel. Volvería a viajar con Aleca sin dudarlo.",
    },
    {
      id: "r3",
      name: "Valeria Nuño",
      avatar: "/trips/japan/avatar-3.png",
      tripDate: "Enero 2026",
      rating: 4,
      verified: true,
      comment:
        "Un viaje redondo. Fushimi Inari al amanecer fue mi momento favorito. Sumé la sesión de kimono como actividad opcional y valió cada dólar.",
    },
  ],
};
