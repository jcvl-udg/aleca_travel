export type DestinationStatus = "visited" | "target";

export type Destination = {
  id: string;
  name: string;
  country: string;
  lat: number;
  lng: number;
  status: DestinationStatus;
  rating: number;
  price: number;
  points: number;
  image: string;
  blurb: string;
};

// User's origin city (Ciudad de México) — arcs originate here.
export const ORIGIN = { name: "Ciudad de México", lat: 19.4326, lng: -99.1332 };

export const DESTINATIONS: Destination[] = [
  {
    id: "paris",
    name: "París",
    country: "Francia",
    lat: 48.8566,
    lng: 2.3522,
    status: "visited",
    rating: 4.9,
    price: 1899,
    points: 620,
    image: "/destinations/paris.png",
    blurb: "Noches doradas junto al Sena y suites con vista a la Torre Eiffel.",
  },
  {
    id: "tokyo",
    name: "Tokio",
    country: "Japón",
    lat: 35.6762,
    lng: 139.6503,
    status: "visited",
    rating: 4.9,
    price: 2450,
    points: 780,
    image: "/destinations/tokyo.png",
    blurb: "Neón, alta cocina y ryokans privados en el corazón de Shibuya.",
  },
  {
    id: "cancun",
    name: "Cancún",
    country: "México",
    lat: 21.1619,
    lng: -86.8515,
    status: "visited",
    rating: 4.8,
    price: 1299,
    points: 450,
    image: "/destinations/cancun.png",
    blurb: "Caribe turquesa, resorts all-inclusive y cenotes escondidos.",
  },
  {
    id: "bali",
    name: "Bali",
    country: "Indonesia",
    lat: -8.3405,
    lng: 115.092,
    status: "target",
    rating: 4.9,
    price: 2190,
    points: 850,
    image: "/destinations/bali.png",
    blurb: "Villas con piscina infinita sobre selvas y arrozales al atardecer.",
  },
  {
    id: "cairo",
    name: "El Cairo",
    country: "Egipto",
    lat: 30.0444,
    lng: 31.2357,
    status: "target",
    rating: 4.8,
    price: 1750,
    points: 700,
    image: "/destinations/cairo.png",
    blurb: "Las pirámides al amanecer y cruceros de lujo por el Nilo.",
  },
];
