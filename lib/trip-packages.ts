export type TripPackageItem = {
  title: string;
  description: string;
  price: number;
};

export type TripPackage = {
  id: string;
  destinationId: string;
  name: string;
  tag: string;
  summary: string;
  total: number;
  nights: number;
  rating: number;
  vibe: string;
  accent: string;
  hotel: {
    name: string;
    room: string;
    rating: number;
    price: number;
    perks: string[];
  };
  flight: {
    route: string;
    cabin: string;
    departure: string;
    return: string;
    price: number;
  };
  experiences: TripPackageItem[];
  inclusions: string[];
};

export const TRAVEL_PACKAGES: TripPackage[] = [
  {
    id: "paris-luxe",
    destinationId: "paris",
    name: "París Clásico & Dorado",
    tag: "91% match",
    summary: "Hotel boutique, vuelo directo y cenas emblemáticas con agenda flexible.",
    total: 3980,
    nights: 4,
    rating: 4.9,
    vibe: "Romance y arte",
    accent: "#b98432",
    hotel: {
      name: "Le Séjour Saint-Honoré",
      room: "Suite de 42 m²",
      rating: 4.9,
      price: 1980,
      perks: ["Desayuno diario", "Traslado privado", "Check-in express"],
    },
    flight: {
      route: "Ciudad de México → París",
      cabin: "Business",
      departure: "06:40 AM",
      return: "18:15 PM",
      price: 1340,
    },
    experiences: [
      { title: "Cruise por el Sena", description: "Cena íntima con vista a la Torre Eiffel", price: 420 },
      { title: "Museo del Louvre", description: "Acceso prioritario y guía privada", price: 310 },
      { title: "Boutique shopping", description: "Mapa de locales recomendados por barrio", price: 280 },
    ],
    inclusions: ["Reservas garantizadas", "Asesor personal", "WhatsApp 24/7"],
  },
  {
    id: "tokyo-immersive",
    destinationId: "tokyo",
    name: "Tokio Neon & Sabor",
    tag: "96% match",
    summary: "Una jornada culinary, ryokan y paseos urbanos calibrados para una escapada premium.",
    total: 5260,
    nights: 6,
    rating: 4.9,
    vibe: "Gastronomía y diseño",
    accent: "#3d7a73",
    hotel: {
      name: "Ryokan Koto No Yume",
      room: "Villa privada con onsen",
      rating: 5,
      price: 2640,
      perks: ["Onsen privado", "Traslado de llegada", "Desayuno kaiseki"],
    },
    flight: {
      route: "Ciudad de México → Tokio",
      cabin: "Premium Economy",
      departure: "11:20 AM",
      return: "21:10 PM",
      price: 1480,
    },
    experiences: [
      { title: "Tasting de ramen", description: "Ruta inspirada en Shibuya y Asakusa", price: 390 },
      { title: "Templo y jardín", description: "Paseo privado con guía cultural", price: 260 },
      { title: "Sky bar nocturno", description: "Vista panorámica de la ciudad", price: 340 },
    ],
    inclusions: ["Conexión premium", "Transfer a hotel", "Itinero editable"],
  },
  {
    id: "bali-ease",
    destinationId: "bali",
    name: "Bali Bienestar & Playa",
    tag: "89% match",
    summary: "Refugio con spa, cenas al aire libre y experiencia de lujo en la naturaleza.",
    total: 4690,
    nights: 7,
    rating: 4.8,
    vibe: "Wellness y paisajes",
    accent: "#d47a4e",
    hotel: {
      name: "The Solstice Cove",
      room: "Villa sobre piscina",
      rating: 4.8,
      price: 2320,
      perks: ["Spa + yoga", "Traslado desde el aeropuerto", "Cena privada"],
    },
    flight: {
      route: "Ciudad de México → Bali",
      cabin: "Business",
      departure: "08:05 AM",
      return: "07:35 AM",
      price: 1560,
    },
    experiences: [
      { title: "Sunrise Uluwatu", description: "Templo y brunch en la costa", price: 360 },
      { title: "Spa de lujo", description: "Tratamiento de 90 min + hidroterapia", price: 430 },
      { title: "Tour de arrozales", description: "Ruta con fotógrafo local", price: 280 },
    ],
    inclusions: ["Plan de bienestar", "Ajuste de ruta", "Cobertura VIP"],
  },
];
