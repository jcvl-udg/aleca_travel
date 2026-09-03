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
  landmark: string;
  vibe: string;
  duration: string;
  bestFor: string;
  hotelDetails?: HotelDetails;
};

import type { HotelbedsRawHotel, HotelbedsRawResponse, HotelbedsRate } from "./hotelbeds-types";

export type HotelRateOption = {
  roomCode: string;
  roomName: string;
  rateKey: string;
  rateClass: string;
  boardName: string;
  paymentType: string;
  net: number;
  sellingRate: number;
  cancellationLabel: string;
  cancellationDate?: string;
};

export type HotelDetails = {
  destinationCode?: string;
  categoryCode: string;
  categoryName: string;
  zoneName: string;
  destinationName: string;
  currency: string;
  rates: HotelRateOption[];
};

const HOTEL_IMAGES: Record<string, string> = {
  "6930": "/destinations/bali.png",
  "1803": "/destinations/cancun.png",
  "3219": "/destinations/paris.png",
};

const parseAmount = (value: string | undefined): number => {
  const amount = Number.parseFloat(value ?? "");
  return Number.isFinite(amount) ? amount : 0;
};

const formatCancellationDate = (value: string | undefined): string | undefined => {
  if (!value) return undefined;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return undefined;
  return new Intl.DateTimeFormat("es-ES", { day: "2-digit", month: "2-digit", year: "numeric" }).format(date);
};

const mapRate = (roomCode: string, roomName: string, rate: HotelbedsRate): HotelRateOption => {
  const cancellationDate = formatCancellationDate(rate.cancellationPolicies?.[0]?.from);
  const isNonRefundable = rate.rateClass.toUpperCase() === "NRF";
  return {
    roomCode,
    roomName,
    rateKey: rate.rateKey,
    rateClass: rate.rateClass,
    boardName: rate.boardName,
    paymentType: rate.paymentType ?? "AT_WEB",
    net: parseAmount(rate.net),
    sellingRate: parseAmount(rate.sellingRate ?? rate.net),
    cancellationLabel: isNonRefundable ? "No reembolsable" : "Cancelación gratuita",
    cancellationDate,
  };
};

export function mapHotelToDestination(hotel: HotelbedsRawHotel): Destination {
  const rates = hotel.rooms.flatMap((room) => room.rates.map((rate) => mapRate(room.code, room.name, rate)));
  const firstRate = rates[0];
  const categoryNumber = Number.parseInt(hotel.categoryCode?.match(/\d+/)?.[0] ?? "4", 10);
  const rating = Math.min(5, Math.max(3.5, categoryNumber + (hotel.categoryCode?.includes("LUX") ? 0.8 : 0.3)));

  return {
    id: String(hotel.code),
    name: hotel.name.trim(),
    country: "España",
    lat: parseAmount(hotel.latitude),
    lng: parseAmount(hotel.longitude),
    status: "target",
    rating,
    price: firstRate?.sellingRate ?? parseAmount(hotel.minRate),
    points: Math.round(rating * 100),
    image: HOTEL_IMAGES[String(hotel.code)] ?? "/destinations/cancun.png",
    blurb: `${hotel.categoryName} en ${hotel.zoneName ?? hotel.destinationName}.` ,
    landmark: hotel.zoneName ?? hotel.destinationName,
    vibe: "estancia mediterránea",
    duration: "1 noche",
    bestFor: "descanso y golf",
    hotelDetails: {
      destinationCode: hotel.destinationCode,
      categoryCode: hotel.categoryCode ?? "",
      categoryName: hotel.categoryName,
      zoneName: hotel.zoneName ?? hotel.destinationName,
      destinationName: hotel.destinationName,
      currency: hotel.currency ?? "EUR",
      rates,
    },
  };
}

export function adaptPostmanHotelsResponse(response: HotelbedsRawResponse): Destination[] {
  return (response.hotels?.hotels ?? []).map(mapHotelToDestination);
}

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
    landmark: "Torre Eiffel",
    vibe: "romance y arte",
    duration: "4 noches",
    bestFor: "cultura y cenas",
  },
  {
    id: "london",
    name: "Londres",
    country: "Reino Unido",
    lat: 51.5072,
    lng: -0.1276,
    status: "target",
    rating: 4.8,
    price: 2090,
    points: 680,
    image: "/destinations/paris.png",
    blurb: "Tardes junto al Támesis, teatros históricos y hoteles con carácter.",
    landmark: "Big Ben",
    vibe: "clásico y chic",
    duration: "5 noches",
    bestFor: "hotel boutique",
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
    landmark: "Torre de Tokio",
    vibe: "neón y gastronomía",
    duration: "6 noches",
    bestFor: "street food y diseño",
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
    landmark: "Cenotes del Caribe",
    vibe: "playa y descanso",
    duration: "5 noches",
    bestFor: "sol y relajación",
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
    landmark: "Templo de Uluwatu",
    vibe: "wellness y naturaleza",
    duration: "7 noches",
    bestFor: "luna de miel",
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
    landmark: "Pirámides de Guiza",
    vibe: "historia y aventura",
    duration: "5 noches",
    bestFor: "patrimonio y safari",
  },
];
