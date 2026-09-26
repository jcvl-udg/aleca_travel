"use client";

import React, { useMemo, useEffect, useState, useRef, useCallback, Suspense } from "react";
import { Canvas, useFrame, useThree, type ThreeEvent } from "@react-three/fiber";
import { CameraControls, Environment, Line, Html } from "@react-three/drei";
import * as THREE from "three";
import { geoEqualEarth, type GeoProjection, type ExtendedFeatureCollection } from "d3-geo";

// ============================================================================
// TIPOS
// ============================================================================
export type GeoJSONGeometry =
  | { type: "Polygon"; coordinates: number[][][] }
  | { type: "MultiPolygon"; coordinates: number[][][][] };

// El dataset real (datasets/geo-countries) expone "name" + códigos ISO.
// "ADMIN" se deja como opcional por si en el futuro cambias de fuente de datos
// a Natural Earth (que sí usa esa clave) — el fallback name||ADMIN sigue funcionando.
export interface GeoJSONFeature {
  type: "Feature";
  properties?: { ADMIN?: string; name?: string; "ISO3166-1-Alpha-2"?: string };
  geometry: GeoJSONGeometry;
}
export interface CityData {
  id: string | number;
  name: string;
  country: string;
  lat: number;
  lng: number;
}
export interface MapSceneProps {
  granularity: number;
  selectedItem: string | null;
  selectedCity: string | null;
  activeFilter: string;
  onSelectCountry: (countryName: string) => void;
  onSelectCity: (cityName: string) => void;
  onDeselect: () => void;
  itinerary: CityData[];
}

/** Un "paquete" vendible: país, ciudad o destino puntual dentro de una ciudad. */
export interface PackageItem {
  id: string;
  name: string; // nombre EXACTO usado para mesh/mapa cuando aplica (país en inglés / ciudad)
  emoji: string;
  priceFrom: number;
  duration: string;
  rating: number;
  reviews: number;
  tags: string[];
  lat?: number;
  lng?: number;
}

interface Toast {
  id: number;
  text: string;
  kind: "xp" | "like" | "level" | "info";
}

// ============================================================================
// ⚙️ CONFIGURACIÓN DE UI — TOCA AQUÍ PARA CUSTOMIZAR SIN TOCAR LÓGICA
// ============================================================================
/**
 * Alto reservado arriba para que la topbar (XP + filtros) NO quede debajo de tu
 * navbar externa. Si usas este componente dentro de un layout con navbar fija,
 * pásale `navbarOffsetPx` (ver <WorldMapApp navbarOffsetPx={72} />) en vez de
 * editar esta constante — este valor es solo el default cuando no se pasa prop.
 */
const DEFAULT_NAVBAR_OFFSET_PX = 24;
/** z-index del overlay de UI. Alto a propósito para ganarle a navbars con z-50. */
const UI_Z_INDEX = "z-[70]";

const MAP_WIDTH = 40;
const MAP_HEIGHT = 20;

// ============================================================================
// DATA — GEOGRAFÍA Y COLORES
// ============================================================================
export const CONTINENT_COLORS: Record<string, string> = {
  América: "#e76f51",
  Europa: "#2a9d8f",
  Asia: "#e9c46a",
  África: "#f4a261",
  Oceanía: "#8ab17d",
  Otros: "#3d5a80",
};

/**
 * Mapeo país → continente, generado a partir del dataset REAL que consume este
 * componente (datasets/geo-countries) cruzado con el código ISO-3166 de cada país
 * (clasificación estándar de continentes). Cubre 238 de los 258 países del dataset;
 * los ~20 restantes son territorios en disputa / islas deshabitadas sin código ISO
 * fiable (ej. "Bir Tawil", "Siachen Glacier") y caen en "Otros" a propósito, ya que
 * no son destinos turísticos vendibles.
 *
 * 🔧 Si `datasets/geo-countries` cambia un nombre (ej. renombran un país), solo
 * hace falta agregar/editar la entrada correspondiente aquí — no toques el resto
 * del componente.
 */
const CONTINENT_MEMBERSHIP: Record<string, string[]> = {
  América: [
    "Anguilla", "Antigua and Barbuda", "Argentina", "Aruba",
    "Barbados", "Belize", "Bermuda", "Bolivia",
    "Brazil", "British Virgin Islands", "Canada", "Cayman Islands",
    "Chile", "Colombia", "Costa Rica", "Cuba",
    "Curaçao", "Dominica", "Dominican Republic", "Ecuador",
    "El Salvador", "Falkland Islands", "Greenland", "Grenada",
    "Guatemala", "Guyana", "Haiti", "Honduras",
    "Jamaica", "Mexico", "Montserrat", "Nicaragua",
    "Panama", "Paraguay", "Peru", "Puerto Rico",
    "Saint Barthelemy", "Saint Kitts and Nevis", "Saint Lucia", "Saint Martin",
    "Saint Pierre and Miquelon", "Saint Vincent and the Grenadines", "Sint Maarten", "South Georgia and the Islands",
    "Suriname", "The Bahamas", "Trinidad and Tobago", "Turks and Caicos Islands",
    "United States Virgin Islands", "United States of America", "Uruguay", "Venezuela",
  ],
  Europa: [
    "Aland", "Albania", "Andorra", "Austria",
    "Belarus", "Belgium", "Bosnia and Herzegovina", "Bulgaria",
    "Croatia", "Czechia", "Denmark", "Estonia",
    "Faroe Islands", "Finland", "France", "Germany",
    "Gibraltar", "Greece", "Guernsey", "Hungary",
    "Iceland", "Ireland", "Isle of Man", "Italy",
    "Jersey", "Kosovo", "Latvia", "Liechtenstein",
    "Lithuania", "Luxembourg", "Malta", "Moldova",
    "Monaco", "Montenegro", "Netherlands", "North Macedonia",
    "Norway", "Poland", "Portugal", "Republic of Serbia",
    "Romania", "Russia", "San Marino", "Slovakia",
    "Slovenia", "Spain", "Sweden", "Switzerland",
    "Ukraine", "United Kingdom", "Vatican",
  ],
  Asia: [
    "Afghanistan", "Armenia", "Azerbaijan", "Bahrain",
    "Bangladesh", "Bhutan", "British Indian Ocean Territory", "Brunei",
    "Cambodia", "China", "Cyprus", "East Timor",
    "Georgia", "Hong Kong S.A.R.", "India", "Indonesia",
    "Iran", "Iraq", "Israel", "Japan",
    "Jordan", "Kazakhstan", "Kuwait", "Kyrgyzstan",
    "Laos", "Lebanon", "Macao S.A.R", "Malaysia",
    "Maldives", "Mongolia", "Myanmar", "Nepal",
    "North Korea", "Northern Cyprus", "Oman", "Pakistan",
    "Palestine", "Philippines", "Qatar", "Saudi Arabia",
    "Singapore", "South Korea", "Sri Lanka", "Syria",
    "Taiwan", "Tajikistan", "Thailand", "Turkey",
    "Turkmenistan", "United Arab Emirates", "Uzbekistan", "Vietnam",
    "Yemen",
  ],
  África: [
    "Algeria", "Angola", "Benin", "Botswana",
    "Burkina Faso", "Burundi", "Cabo Verde", "Cameroon",
    "Central African Republic", "Chad", "Comoros", "Democratic Republic of the Congo",
    "Djibouti", "Egypt", "Equatorial Guinea", "Eritrea",
    "Ethiopia", "Gabon", "Gambia", "Ghana",
    "Guinea", "Guinea-Bissau", "Ivory Coast", "Kenya",
    "Lesotho", "Liberia", "Libya", "Madagascar",
    "Malawi", "Mali", "Mauritania", "Mauritius",
    "Morocco", "Mozambique", "Namibia", "Niger",
    "Nigeria", "Republic of the Congo", "Rwanda", "Saint Helena",
    "Senegal", "Seychelles", "Sierra Leone", "Somalia",
    "Somaliland", "South Africa", "South Sudan", "Sudan",
    "São Tomé and Principe", "Togo", "Tunisia", "Uganda",
    "United Republic of Tanzania", "Western Sahara", "Zambia", "Zimbabwe",
    "eSwatini",
  ],
  Oceanía: [
    "American Samoa", "Australia", "Cook Islands", "Federated States of Micronesia",
    "Fiji", "French Polynesia", "Guam", "Kiribati",
    "Marshall Islands", "Nauru", "New Caledonia", "New Zealand",
    "Niue", "Norfolk Island", "Northern Mariana Islands", "Palau",
    "Papua New Guinea", "Samoa", "Solomon Islands", "Tonga",
    "Tuvalu", "Vanuatu", "Wallis and Futuna",
  ],
};

// Lookup O(1) — se resuelve UNA vez al cargar el módulo, no en cada render.
const COUNTRY_TO_CONTINENT: Record<string, string> = {};
Object.entries(CONTINENT_MEMBERSHIP).forEach(([continent, countries]) => {
  countries.forEach((c) => (COUNTRY_TO_CONTINENT[c] = continent));
});

export const getContinentName = (name: string): string => COUNTRY_TO_CONTINENT[name] || "Otros";

// Países con corona (recomendados) por continente
export const TOP_RECOMMENDATIONS: Record<string, string[]> = {
  Europa: ["France", "Italy"],
  América: ["Mexico", "Brazil"],
  Asia: ["Japan", "Thailand"],
  África: ["Egypt", "Morocco"],
  Oceanía: ["Australia"],
};

// Filtros de la agencia → Sets para lookup O(1)
const FILTERS_MOCK: Record<string, string[]> = {
  "Playa 🏖️": ["Mexico", "Brazil", "Australia", "Thailand", "Indonesia", "Philippines", "Cuba", "Dominican Republic", "Spain", "Greece", "Fiji"],
  "Cultura 🏛️": ["Italy", "Greece", "Egypt", "China", "India", "Japan", "France", "United Kingdom", "Peru", "Mexico", "Turkey"],
  "Precio 💲": ["Vietnam", "Colombia", "India", "Indonesia", "Bolivia", "Morocco", "Philippines", "Turkey", "Egypt", "Peru"],
};
const FILTERS_MOCK_SETS: Record<string, Set<string>> = Object.fromEntries(
  Object.entries(FILTERS_MOCK).map(([k, v]) => [k, new Set(v)])
);

// ============================================================================
// DATA — TOP PAÍSES POR CONTINENTE (nivel 0 → 1)
// ============================================================================
export const TOP_COUNTRIES: Record<string, PackageItem[]> = {
  América: [
    { id: "co-mx", name: "Mexico", emoji: "🇲🇽", priceFrom: 780, duration: "6-8 días", rating: 4.8, reviews: 2140, tags: ["Playa 🏖️", "Cultura 🏛️"] },
    { id: "co-br", name: "Brazil", emoji: "🇧🇷", priceFrom: 950, duration: "7-9 días", rating: 4.7, reviews: 1870, tags: ["Playa 🏖️"] },
    { id: "co-pe", name: "Peru", emoji: "🇵🇪", priceFrom: 690, duration: "5-7 días", rating: 4.9, reviews: 1520, tags: ["Cultura 🏛️", "Precio 💲"] },
  ],
  Europa: [
    { id: "co-fr", name: "France", emoji: "🇫🇷", priceFrom: 1120, duration: "6-8 días", rating: 4.8, reviews: 3210, tags: ["Cultura 🏛️"] },
    { id: "co-it", name: "Italy", emoji: "🇮🇹", priceFrom: 1080, duration: "7-9 días", rating: 4.9, reviews: 2980, tags: ["Cultura 🏛️"] },
    { id: "co-es", name: "Spain", emoji: "🇪🇸", priceFrom: 890, duration: "5-7 días", rating: 4.7, reviews: 2410, tags: ["Playa 🏖️", "Cultura 🏛️"] },
  ],
  Asia: [
    { id: "co-jp", name: "Japan", emoji: "🇯🇵", priceFrom: 1450, duration: "8-10 días", rating: 4.9, reviews: 2760, tags: ["Cultura 🏛️"] },
    { id: "co-th", name: "Thailand", emoji: "🇹🇭", priceFrom: 720, duration: "7-9 días", rating: 4.8, reviews: 3050, tags: ["Playa 🏖️", "Precio 💲"] },
    { id: "co-tr", name: "Turkey", emoji: "🇹🇷", priceFrom: 810, duration: "6-8 días", rating: 4.7, reviews: 1690, tags: ["Cultura 🏛️", "Precio 💲"] },
  ],
  África: [
    { id: "co-eg", name: "Egypt", emoji: "🇪🇬", priceFrom: 760, duration: "6-8 días", rating: 4.8, reviews: 1980, tags: ["Cultura 🏛️", "Precio 💲"] },
    { id: "co-ma", name: "Morocco", emoji: "🇲🇦", priceFrom: 680, duration: "5-7 días", rating: 4.7, reviews: 1430, tags: ["Cultura 🏛️", "Precio 💲"] },
    { id: "co-ke", name: "Kenya", emoji: "🇰🇪", priceFrom: 1290, duration: "6-8 días", rating: 4.9, reviews: 980, tags: ["Cultura 🏛️"] },
  ],
  Oceanía: [
    { id: "co-au", name: "Australia", emoji: "🇦🇺", priceFrom: 1680, duration: "9-11 días", rating: 4.8, reviews: 1240, tags: ["Playa 🏖️"] },
    { id: "co-nz", name: "New Zealand", emoji: "🇳🇿", priceFrom: 1590, duration: "8-10 días", rating: 4.9, reviews: 860, tags: ["Cultura 🏛️"] },
    { id: "co-fj", name: "Fiji", emoji: "🇫🇯", priceFrom: 1340, duration: "6-8 días", rating: 4.8, reviews: 610, tags: ["Playa 🏖️"] },
  ],
};

// ============================================================================
// DATA — TOP CIUDADES POR PAÍS (nivel 1 → 2)
// ============================================================================
export const TOP_CITIES: Record<string, PackageItem[]> = {
  Mexico: [
    { id: "ci-cdmx", name: "Ciudad de México", emoji: "🏙️", priceFrom: 420, duration: "3-4 días", rating: 4.7, reviews: 980, tags: ["Cultura 🏛️"], lat: 19.4326, lng: -99.1332 },
    { id: "ci-cancun", name: "Cancún", emoji: "🏝️", priceFrom: 560, duration: "4-5 días", rating: 4.8, reviews: 1450, tags: ["Playa 🏖️"], lat: 21.1619, lng: -86.8515 },
    { id: "ci-oaxaca", name: "Oaxaca", emoji: "🌵", priceFrom: 350, duration: "3-4 días", rating: 4.9, reviews: 520, tags: ["Cultura 🏛️", "Precio 💲"], lat: 17.0732, lng: -96.7266 },
  ],
  Brazil: [
    { id: "ci-rio", name: "Río de Janeiro", emoji: "🏖️", priceFrom: 610, duration: "4-5 días", rating: 4.8, reviews: 1620, tags: ["Playa 🏖️"], lat: -22.9068, lng: -43.1729 },
    { id: "ci-sp", name: "São Paulo", emoji: "🏙️", priceFrom: 480, duration: "3-4 días", rating: 4.5, reviews: 740, tags: ["Cultura 🏛️"], lat: -23.5505, lng: -46.6333 },
    { id: "ci-salvador", name: "Salvador de Bahía", emoji: "🥁", priceFrom: 520, duration: "4-5 días", rating: 4.9, reviews: 610, tags: ["Playa 🏖️", "Cultura 🏛️"], lat: -12.9718, lng: -38.5011 },
  ],
  Peru: [
    { id: "ci-lima", name: "Lima", emoji: "🍽️", priceFrom: 380, duration: "3-4 días", rating: 4.6, reviews: 690, tags: ["Cultura 🏛️"], lat: -12.0464, lng: -77.0428 },
    { id: "ci-cusco", name: "Cusco", emoji: "⛰️", priceFrom: 440, duration: "4-5 días", rating: 4.9, reviews: 1310, tags: ["Cultura 🏛️", "Precio 💲"], lat: -13.532, lng: -71.9675 },
    { id: "ci-arequipa", name: "Arequipa", emoji: "🌋", priceFrom: 320, duration: "3-4 días", rating: 4.7, reviews: 410, tags: ["Precio 💲"], lat: -16.409, lng: -71.5375 },
  ],
  France: [
    { id: "ci-paris", name: "París", emoji: "🗼", priceFrom: 680, duration: "4-5 días", rating: 4.9, reviews: 4210, tags: ["Cultura 🏛️"], lat: 48.8566, lng: 2.3522 },
    { id: "ci-niza", name: "Niza", emoji: "🌊", priceFrom: 590, duration: "3-4 días", rating: 4.7, reviews: 890, tags: ["Playa 🏖️"], lat: 43.7102, lng: 7.262 },
    { id: "ci-lyon", name: "Lyon", emoji: "🍷", priceFrom: 510, duration: "3-4 días", rating: 4.6, reviews: 540, tags: ["Cultura 🏛️"], lat: 45.764, lng: 4.8357 },
  ],
  Italy: [
    { id: "ci-roma", name: "Roma", emoji: "🏛️", priceFrom: 620, duration: "4-5 días", rating: 4.9, reviews: 3890, tags: ["Cultura 🏛️"], lat: 41.9028, lng: 12.4964 },
    { id: "ci-florencia", name: "Florencia", emoji: "🎨", priceFrom: 560, duration: "3-4 días", rating: 4.8, reviews: 1670, tags: ["Cultura 🏛️"], lat: 43.7696, lng: 11.2558 },
    { id: "ci-venecia", name: "Venecia", emoji: "🚤", priceFrom: 650, duration: "3-4 días", rating: 4.8, reviews: 2130, tags: ["Cultura 🏛️"], lat: 45.4408, lng: 12.3155 },
  ],
  Spain: [
    { id: "ci-barcelona", name: "Barcelona", emoji: "⛪", priceFrom: 540, duration: "4-5 días", rating: 4.8, reviews: 3340, tags: ["Playa 🏖️", "Cultura 🏛️"], lat: 41.3874, lng: 2.1686 },
    { id: "ci-madrid", name: "Madrid", emoji: "🏙️", priceFrom: 500, duration: "3-4 días", rating: 4.7, reviews: 2210, tags: ["Cultura 🏛️"], lat: 40.4168, lng: -3.7038 },
    { id: "ci-sevilla", name: "Sevilla", emoji: "💃", priceFrom: 460, duration: "3-4 días", rating: 4.8, reviews: 990, tags: ["Cultura 🏛️", "Precio 💲"], lat: 37.3891, lng: -5.9845 },
  ],
  Japan: [
    { id: "ci-tokio", name: "Tokio", emoji: "🗾", priceFrom: 780, duration: "5-6 días", rating: 4.9, reviews: 2540, tags: ["Cultura 🏛️"], lat: 35.6762, lng: 139.6503 },
    { id: "ci-kioto", name: "Kioto", emoji: "⛩️", priceFrom: 690, duration: "3-4 días", rating: 4.9, reviews: 1980, tags: ["Cultura 🏛️"], lat: 35.0116, lng: 135.7681 },
    { id: "ci-osaka", name: "Osaka", emoji: "🍜", priceFrom: 640, duration: "3-4 días", rating: 4.7, reviews: 1120, tags: ["Cultura 🏛️", "Precio 💲"], lat: 34.6937, lng: 135.5023 },
  ],
  Thailand: [
    { id: "ci-bangkok", name: "Bangkok", emoji: "🛕", priceFrom: 480, duration: "3-4 días", rating: 4.7, reviews: 2870, tags: ["Cultura 🏛️", "Precio 💲"], lat: 13.7563, lng: 100.5018 },
    { id: "ci-phuket", name: "Phuket", emoji: "🏝️", priceFrom: 520, duration: "4-5 días", rating: 4.8, reviews: 3120, tags: ["Playa 🏖️"], lat: 7.8804, lng: 98.3923 },
    { id: "ci-chiangmai", name: "Chiang Mai", emoji: "🐘", priceFrom: 410, duration: "3-4 días", rating: 4.9, reviews: 1340, tags: ["Cultura 🏛️", "Precio 💲"], lat: 18.7883, lng: 98.9853 },
  ],
  Turkey: [
    { id: "ci-estambul", name: "Estambul", emoji: "🕌", priceFrom: 460, duration: "4-5 días", rating: 4.8, reviews: 2650, tags: ["Cultura 🏛️"], lat: 41.0082, lng: 28.9784 },
    { id: "ci-capadocia", name: "Capadocia", emoji: "🎈", priceFrom: 510, duration: "2-3 días", rating: 4.9, reviews: 1780, tags: ["Cultura 🏛️"], lat: 38.6431, lng: 34.8283 },
    { id: "ci-antalya", name: "Antalya", emoji: "🏖️", priceFrom: 390, duration: "4-5 días", rating: 4.6, reviews: 940, tags: ["Playa 🏖️", "Precio 💲"], lat: 36.8969, lng: 30.7133 },
  ],
  Egypt: [
    { id: "ci-cairo", name: "El Cairo", emoji: "🐪", priceFrom: 430, duration: "3-4 días", rating: 4.7, reviews: 1560, tags: ["Cultura 🏛️", "Precio 💲"], lat: 30.0444, lng: 31.2357 },
    { id: "ci-luxor", name: "Luxor", emoji: "🏺", priceFrom: 470, duration: "3-4 días", rating: 4.9, reviews: 830, tags: ["Cultura 🏛️"], lat: 25.6872, lng: 32.6396 },
    { id: "ci-sharm", name: "Sharm El Sheikh", emoji: "🤿", priceFrom: 540, duration: "4-5 días", rating: 4.7, reviews: 1120, tags: ["Playa 🏖️"], lat: 27.9158, lng: 34.33 },
  ],
  Morocco: [
    { id: "ci-marrakech", name: "Marrakech", emoji: "🕌", priceFrom: 400, duration: "3-4 días", rating: 4.8, reviews: 1970, tags: ["Cultura 🏛️", "Precio 💲"], lat: 31.6295, lng: -7.9811 },
    { id: "ci-fez", name: "Fez", emoji: "🧵", priceFrom: 370, duration: "3-4 días", rating: 4.7, reviews: 620, tags: ["Cultura 🏛️", "Precio 💲"], lat: 34.0181, lng: -5.0078 },
    { id: "ci-casablanca", name: "Casablanca", emoji: "🏙️", priceFrom: 390, duration: "2-3 días", rating: 4.4, reviews: 480, tags: ["Cultura 🏛️"], lat: 33.5731, lng: -7.5898 },
  ],
  Kenya: [
    { id: "ci-nairobi", name: "Nairobi", emoji: "🦁", priceFrom: 610, duration: "3-4 días", rating: 4.5, reviews: 380, tags: ["Cultura 🏛️"], lat: -1.2921, lng: 36.8219 },
    { id: "ci-mombasa", name: "Mombasa", emoji: "🏖️", priceFrom: 690, duration: "4-5 días", rating: 4.7, reviews: 420, tags: ["Playa 🏖️"], lat: -4.0435, lng: 39.6682 },
    { id: "ci-masaimara", name: "Masái Mara", emoji: "🦒", priceFrom: 1450, duration: "3-4 días", rating: 5.0, reviews: 610, tags: ["Cultura 🏛️"], lat: -1.4061, lng: 35.0089 },
  ],
  Australia: [
    { id: "ci-sidney", name: "Sídney", emoji: "🏙️", priceFrom: 890, duration: "4-5 días", rating: 4.8, reviews: 1980, tags: ["Playa 🏖️"], lat: -33.8688, lng: 151.2093 },
    { id: "ci-melbourne", name: "Melbourne", emoji: "☕", priceFrom: 810, duration: "3-4 días", rating: 4.7, reviews: 1120, tags: ["Cultura 🏛️"], lat: -37.8136, lng: 144.9631 },
    { id: "ci-cairns", name: "Cairns", emoji: "🐠", priceFrom: 950, duration: "4-5 días", rating: 4.9, reviews: 760, tags: ["Playa 🏖️"], lat: -16.9203, lng: 145.771 },
  ],
  "New Zealand": [
    { id: "ci-auckland", name: "Auckland", emoji: "⛵", priceFrom: 820, duration: "3-4 días", rating: 4.6, reviews: 540, tags: ["Cultura 🏛️"], lat: -36.8485, lng: 174.7633 },
    { id: "ci-queenstown", name: "Queenstown", emoji: "🏔️", priceFrom: 990, duration: "4-5 días", rating: 4.9, reviews: 870, tags: ["Cultura 🏛️"], lat: -45.0312, lng: 168.6626 },
    { id: "ci-wellington", name: "Wellington", emoji: "🎬", priceFrom: 760, duration: "3-4 días", rating: 4.6, reviews: 390, tags: ["Cultura 🏛️"], lat: -41.2865, lng: 174.7762 },
  ],
  Fiji: [
    { id: "ci-nadi", name: "Nadi", emoji: "🌺", priceFrom: 780, duration: "4-5 días", rating: 4.8, reviews: 430, tags: ["Playa 🏖️"], lat: -17.7765, lng: 177.4356 },
    { id: "ci-suva", name: "Suva", emoji: "🏝️", priceFrom: 690, duration: "3-4 días", rating: 4.5, reviews: 210, tags: ["Cultura 🏛️"], lat: -18.1416, lng: 178.4419 },
    { id: "ci-denarau", name: "Denarau", emoji: "🏖️", priceFrom: 1020, duration: "5-6 días", rating: 4.9, reviews: 560, tags: ["Playa 🏖️"], lat: -17.7756, lng: 177.3822 },
  ],
};

// Índice plano ciudad → PackageItem, construido UNA vez al cargar el módulo.
// Reemplaza los `Object.values(TOP_CITIES).flat().find(...)` (O(n) y recreados
// en cada llamada) por un lookup O(1).
const CITY_LOOKUP: Record<string, PackageItem> = {};
Object.values(TOP_CITIES).forEach((cities) => {
  cities.forEach((c) => (CITY_LOOKUP[c.name] = c));
});

// ============================================================================
// DATA — TOP DESTINOS FAMOSOS POR CIUDAD (nivel 2, hoja final)
// ============================================================================
export const TOP_DESTINATIONS: Record<string, PackageItem[]> = {
  "París": [
    { id: "de-torre", name: "Torre Eiffel", emoji: "🗼", priceFrom: 45, duration: "Medio día", rating: 4.7, reviews: 18900, tags: ["Cultura 🏛️"] },
    { id: "de-louvre", name: "Museo del Louvre", emoji: "🖼️", priceFrom: 38, duration: "Medio día", rating: 4.8, reviews: 15400, tags: ["Cultura 🏛️"] },
    { id: "de-montmartre", name: "Montmartre", emoji: "🎨", priceFrom: 25, duration: "3 horas", rating: 4.6, reviews: 9800, tags: ["Cultura 🏛️", "Precio 💲"] },
  ],
  Tokio: [
    { id: "de-shibuya", name: "Cruce de Shibuya", emoji: "🚦", priceFrom: 0, duration: "1 hora", rating: 4.5, reviews: 12100, tags: ["Cultura 🏛️", "Precio 💲"] },
    { id: "de-senso", name: "Templo Senso-ji", emoji: "⛩️", priceFrom: 0, duration: "2 horas", rating: 4.7, reviews: 10300, tags: ["Cultura 🏛️", "Precio 💲"] },
    { id: "de-fuji", name: "Vista al Monte Fuji", emoji: "🗻", priceFrom: 90, duration: "Día completo", rating: 4.9, reviews: 4200, tags: ["Cultura 🏛️"] },
  ],
  Roma: [
    { id: "de-coliseo", name: "Coliseo Romano", emoji: "🏛️", priceFrom: 32, duration: "Medio día", rating: 4.8, reviews: 21400, tags: ["Cultura 🏛️"] },
    { id: "de-vaticano", name: "Museos Vaticanos", emoji: "⛪", priceFrom: 40, duration: "Medio día", rating: 4.7, reviews: 17600, tags: ["Cultura 🏛️"] },
    { id: "de-trevi", name: "Fontana di Trevi", emoji: "⛲", priceFrom: 0, duration: "1 hora", rating: 4.6, reviews: 13200, tags: ["Cultura 🏛️", "Precio 💲"] },
  ],
  Barcelona: [
    { id: "de-sagrada", name: "Sagrada Familia", emoji: "⛪", priceFrom: 35, duration: "Medio día", rating: 4.9, reviews: 19800, tags: ["Cultura 🏛️"] },
    { id: "de-parkguell", name: "Park Güell", emoji: "🎨", priceFrom: 18, duration: "2 horas", rating: 4.7, reviews: 11200, tags: ["Cultura 🏛️", "Precio 💲"] },
    { id: "de-barceloneta", name: "Playa Barceloneta", emoji: "🏖️", priceFrom: 0, duration: "Medio día", rating: 4.4, reviews: 8700, tags: ["Playa 🏖️", "Precio 💲"] },
  ],
  Cancún: [
    { id: "de-chichen", name: "Chichén Itzá", emoji: "🗿", priceFrom: 65, duration: "Día completo", rating: 4.8, reviews: 9600, tags: ["Cultura 🏛️"] },
    { id: "de-arrecife", name: "Arrecife de coral", emoji: "🐠", priceFrom: 55, duration: "Medio día", rating: 4.7, reviews: 6400, tags: ["Playa 🏖️"] },
    { id: "de-isla", name: "Isla Mujeres", emoji: "🏝️", priceFrom: 40, duration: "Día completo", rating: 4.8, reviews: 7200, tags: ["Playa 🏖️", "Precio 💲"] },
  ],
  Bangkok: [
    { id: "de-granpalacio", name: "Gran Palacio", emoji: "🛕", priceFrom: 15, duration: "Medio día", rating: 4.7, reviews: 14300, tags: ["Cultura 🏛️", "Precio 💲"] },
    { id: "de-chatuchak", name: "Mercado Chatuchak", emoji: "🛍️", priceFrom: 0, duration: "3 horas", rating: 4.5, reviews: 6800, tags: ["Precio 💲"] },
    { id: "de-riochao", name: "Río Chao Phraya", emoji: "🚤", priceFrom: 12, duration: "2 horas", rating: 4.6, reviews: 5100, tags: ["Cultura 🏛️", "Precio 💲"] },
  ],
  "El Cairo": [
    { id: "de-piramides", name: "Pirámides de Guiza", emoji: "🏜️", priceFrom: 28, duration: "Medio día", rating: 4.9, reviews: 16700, tags: ["Cultura 🏛️"] },
    { id: "de-esfinge", name: "La Esfinge", emoji: "🗿", priceFrom: 0, duration: "1 hora", rating: 4.7, reviews: 12400, tags: ["Cultura 🏛️", "Precio 💲"] },
    { id: "de-museoegipcio", name: "Museo Egipcio", emoji: "🏺", priceFrom: 15, duration: "Medio día", rating: 4.6, reviews: 8900, tags: ["Cultura 🏛️", "Precio 💲"] },
  ],
  Sídney: [
    { id: "de-opera", name: "Ópera de Sídney", emoji: "🎭", priceFrom: 42, duration: "2 horas", rating: 4.8, reviews: 15600, tags: ["Cultura 🏛️"] },
    { id: "de-bondi", name: "Playa Bondi", emoji: "🏄", priceFrom: 0, duration: "Medio día", rating: 4.7, reviews: 13100, tags: ["Playa 🏖️", "Precio 💲"] },
    { id: "de-harbourbridge", name: "Harbour Bridge", emoji: "🌉", priceFrom: 220, duration: "3 horas", rating: 4.9, reviews: 5400, tags: ["Cultura 🏛️"] },
  ],
  Marrakech: [
    { id: "de-jemaa", name: "Plaza Jemaa el-Fna", emoji: "🎪", priceFrom: 0, duration: "3 horas", rating: 4.7, reviews: 10800, tags: ["Cultura 🏛️", "Precio 💲"] },
    { id: "de-majorelle", name: "Jardín Majorelle", emoji: "🌵", priceFrom: 10, duration: "2 horas", rating: 4.6, reviews: 7300, tags: ["Cultura 🏛️", "Precio 💲"] },
    { id: "de-souks", name: "Los Souks", emoji: "🧶", priceFrom: 0, duration: "Medio día", rating: 4.5, reviews: 6100, tags: ["Precio 💲"] },
  ],
  "Río de Janeiro": [
    { id: "de-cristo", name: "Cristo Redentor", emoji: "🗿", priceFrom: 38, duration: "Medio día", rating: 4.9, reviews: 19200, tags: ["Cultura 🏛️"] },
    { id: "de-panderezucar", name: "Pan de Azúcar", emoji: "🚡", priceFrom: 45, duration: "3 horas", rating: 4.8, reviews: 11500, tags: ["Cultura 🏛️"] },
    { id: "de-copacabana", name: "Playa de Copacabana", emoji: "🏖️", priceFrom: 0, duration: "Medio día", rating: 4.6, reviews: 14700, tags: ["Playa 🏖️", "Precio 💲"] },
  ],
};

const genericDestinations = (cityName: string): PackageItem[] => [
  { id: `de-${cityName}-1`, name: `Recorrido por ${cityName}`, emoji: "🧭", priceFrom: 35, duration: "Medio día", rating: 4.6, reviews: 320, tags: ["Cultura 🏛️"] },
  { id: `de-${cityName}-2`, name: `Sabores de ${cityName}`, emoji: "🍽️", priceFrom: 28, duration: "3 horas", rating: 4.7, reviews: 210, tags: ["Precio 💲"] },
];
const getDestinations = (cityName: string): PackageItem[] => TOP_DESTINATIONS[cityName] || genericDestinations(cityName);

// Itinerario inicial (mock)
const CITIES_DATA: CityData[] = [
  { id: 1, name: "París", country: "France", lat: 48.8566, lng: 2.3522 },
  { id: 2, name: "Tokio", country: "Japan", lat: 35.6762, lng: 139.6503 },
];

// Estado de hover mutable — evita re-renders de React en cada movimiento de puntero (60fps friendly)
const GLOBAL_HOVER = { name: "", continent: "" };

// Constante de "no hay selección" — evitamos comparar contra un string mágico repetido
const WORLD_VIEW = "Explora el mundo";

// ============================================================================
// COMPONENTES 3D
// ============================================================================
interface CountryMeshProps {
  name: string;
  geometry: THREE.ExtrudeGeometry;
  isSelected: boolean;
  isFaded: boolean;
  granularity: number;
  continentName: string;
  onClick: () => void;
  registerMesh: (name: string, mesh: THREE.Mesh | null) => void;
}

/**
 * Malla 3D de un país. IMPORTANTE: la geometría llega ya calculada por prop
 * (ver `countryGeometries` en MapScene) — este componente NUNCA construye
 * geometría propia, solo anima color/escala/opacidad por frame. Antes la
 * geometría (ExtrudeGeometry costosa) se recalculaba para ~250 países cada vez
 * que el slider cruzaba "Continentes ↔ Países", lo que causaba el freeze al
 * soltar el slider. Ahora se calcula 1 sola vez cuando llegan los `features`.
 */
const CountryMesh = React.memo(
  ({ name, geometry, isSelected, isFaded, granularity, continentName, onClick, registerMesh }: CountryMeshProps) => {
    const meshRef = useRef<THREE.Mesh>(null);
    const materialRef = useRef<THREE.MeshStandardMaterial>(null);
    const colorTarget = useMemo(() => new THREE.Color(), []);

    useEffect(() => {
      if (meshRef.current) registerMesh(name, meshRef.current);
      return () => registerMesh(name, null);
    }, [name, registerMesh]);

    useFrame((_, delta) => {
      if (!meshRef.current || !materialRef.current) return;
      const isHovered = granularity === 0 ? GLOBAL_HOVER.continent === continentName : GLOBAL_HOVER.name === name;

      const targetScaleZ = isSelected ? 4.0 : isHovered ? 1.5 : granularity === 0 ? 0.4 : 1;
      meshRef.current.scale.z = THREE.MathUtils.damp(meshRef.current.scale.z, targetScaleZ, 6, delta);

      // Piso de opacidad más alto que antes (0.08 → 0.3): un país "no seleccionado"
      // sigue siendo visible como referencia geográfica, así el usuario nunca
      // pierde de vista dónde está el resto del mapa para "salir" de la selección.
      const targetOpacity = isFaded ? 0.3 : isHovered || isSelected ? 1 : 0.85;
      materialRef.current.opacity = THREE.MathUtils.lerp(materialRef.current.opacity, targetOpacity, delta * 5);

      const baseColor = granularity === 0 ? CONTINENT_COLORS[continentName] || CONTINENT_COLORS["Otros"] : "#1a365d";
      colorTarget.set(isSelected ? "#00f2fe" : isHovered ? "#4facfe" : baseColor);
      // Antes: "#0d1b2a" (casi negro) cuando estaba fadeado → continentes vecinos
      // se veían indistinguibles. Ahora se atenúa el MISMO color base en vez de
      // apagarlo a negro, así la separación de continentes se sigue percibiendo.
      if (isFaded && !isSelected) colorTarget.multiplyScalar(0.35);
      materialRef.current.color.lerp(colorTarget, delta * 5);
    });

    return (
      <mesh
        ref={meshRef}
        geometry={geometry}
        castShadow={granularity !== 0}
        receiveShadow={granularity !== 0}
        onPointerOver={(e: ThreeEvent<PointerEvent>) => {
          e.stopPropagation();
          document.body.style.cursor = "pointer";
          GLOBAL_HOVER.name = name;
          GLOBAL_HOVER.continent = continentName;
        }}
        onPointerOut={() => {
          document.body.style.cursor = "auto";
          GLOBAL_HOVER.name = "";
          GLOBAL_HOVER.continent = "";
        }}
        onClick={(e: ThreeEvent<MouseEvent>) => {
          e.stopPropagation();
          onClick();
        }}
      >
        <meshStandardMaterial ref={materialRef} roughness={0.8} metalness={0.1} transparent />
      </mesh>
    );
  }
);
CountryMesh.displayName = "CountryMesh";

type DreiLineRef = React.ElementRef<typeof Line>;

/** Ruta de vuelo curva entre puntos del itinerario, con flujo animado y brillo pulsante. */
export const FlightPath = ({ points, projection }: { points: CityData[]; projection: GeoProjection }) => {
  const lineRef = useRef<DreiLineRef>(null);

  const curvePoints = useMemo(() => {
    if (points.length < 2) return [] as THREE.Vector3[];
    const curvePath = new THREE.CurvePath<THREE.Vector3>();
    for (let i = 0; i < points.length - 1; i++) {
      const p1 = projection([points[i].lng, points[i].lat]);
      const p2 = projection([points[i + 1].lng, points[i + 1].lat]);
      if (!p1 || !p2) continue;
      const v1 = new THREE.Vector3(p1[0], -p1[1], 1.2);
      const v2 = new THREE.Vector3(p2[0], -p2[1], 1.2);
      const midPoint = v1.clone().lerp(v2, 0.5);
      midPoint.z += v1.distanceTo(v2) * 0.4;
      curvePath.add(new THREE.QuadraticBezierCurve3(v1, midPoint, v2));
    }
    // Menos segmentos en curvas cortas = menos triángulos para meshline sin pérdida visible
    const segments = Math.min(80, Math.max(24, Math.round(curvePath.getLength() * 4)));
    return curvePath.getPoints(segments);
  }, [points, projection]);

  useFrame(({ clock }, delta) => {
    if (!lineRef.current) return;
    const material = lineRef.current.material as THREE.Material & { dashOffset: number; opacity: number };
    material.dashOffset -= delta * 1.5;
    // Pulso suave de energía en la ruta — usa el reloj global de R3F, así no
    // necesitamos un useRef propio acumulando tiempo en cada instancia.
    material.opacity = 0.65 + Math.sin(clock.elapsedTime * 2) * 0.15;
  });

  if (curvePoints.length === 0) return null;

  return (
    <Line
      ref={lineRef}
      points={curvePoints}
      color="#00f2fe"
      lineWidth={3}
      dashed
      dashScale={20}
      dashSize={1}
      dashOffset={0}
      gapSize={1}
      transparent
      opacity={0.8}
      blending={THREE.AdditiveBlending}
      depthTest={false}
    />
  );
};

/** Pin 3D pulsante para ciudades (nivel país) o destinos (nivel ciudad). */
interface MapPinProps {
  position: [number, number, number];
  label: string;
  emoji: string;
  isActive: boolean;
  onClick: () => void;
}
const MapPin = React.memo(({ position, label, emoji, isActive, onClick }: MapPinProps) => {
  const ref = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  // Desfase determinista por posición: cada pin "respira" en un momento distinto
  // sin necesitar Math.random() (evita drift entre renders) ni un useRef propio.
  const spatialOffset = useMemo(() => position[0] * 3.14 + position[1] * 2.71, [position]);

  useFrame(({ clock }, delta) => {
    if (!ref.current) return;
    const pulse = 1 + Math.sin(clock.elapsedTime * 3 + spatialOffset) * 0.12;
    const targetScale = (isActive ? 1.6 : hovered ? 1.3 : 1) * pulse;
    ref.current.scale.setScalar(THREE.MathUtils.damp(ref.current.scale.x, targetScale, 8, delta));
  });

  return (
    <group position={position}>
      <mesh
        ref={ref}
        onPointerOver={(e: ThreeEvent<PointerEvent>) => { e.stopPropagation(); setHovered(true); document.body.style.cursor = "pointer"; }}
        onPointerOut={() => { setHovered(false); document.body.style.cursor = "auto"; }}
        onClick={(e: ThreeEvent<MouseEvent>) => { e.stopPropagation(); onClick(); }}
      >
        {/* Baja poligonización (12x12) a propósito: puede haber varios pines a la vez */}
        <sphereGeometry args={[0.22, 12, 12]} />
        <meshStandardMaterial
          color={isActive ? "#00f2fe" : "#ff6b6b"}
          emissive={isActive ? "#00f2fe" : "#ff6b6b"}
          emissiveIntensity={isActive ? 1.4 : 0.6}
        />
      </mesh>
      {(hovered || isActive) && (
        <Html center distanceFactor={12} style={{ pointerEvents: "none" }}>
          <div className="px-2.5 py-1 rounded-lg bg-black/80 border border-white/20 text-white text-xs font-bold whitespace-nowrap backdrop-blur-sm">
            {emoji} {label}
          </div>
        </Html>
      )}
    </group>
  );
});
MapPin.displayName = "MapPin";

// ============================================================================
// ESCENA R3F
// ============================================================================
function MapScene({ granularity, selectedItem, selectedCity, activeFilter, onSelectCountry, onSelectCity, onDeselect, itinerary }: MapSceneProps) {
  const controlsRef = useRef<CameraControls>(null);
  const meshesRegistry = useRef<Map<string, THREE.Mesh>>(new Map());
  const [features, setFeatures] = useState<GeoJSONFeature[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { invalidate } = useThree();

  useEffect(() => {
    let cancelled = false;
    fetch("https://raw.githubusercontent.com/datasets/geo-countries/master/data/countries.geojson")
      .then((res) => res.json())
      .then((data: { features?: GeoJSONFeature[] }) => {
        if (cancelled) return;
        if (data.features) {
          const filtered = data.features.filter(
            (f) => f.properties?.name !== "Antarctica" && f.properties?.name !== "French Southern and Antarctic Lands"
          );
          setFeatures(filtered);
        }
        setIsLoading(false);
        invalidate();
      })
      .catch(() => setIsLoading(false));
    return () => { cancelled = true; };
  }, [invalidate]);

  const projection = useMemo(() => {
    const geoCollection = { type: "FeatureCollection", features } as unknown as ExtendedFeatureCollection;
    return geoEqualEarth().fitSize([MAP_WIDTH, MAP_HEIGHT], geoCollection);
  }, [features]);

  /**
   * 🚀 FIX DE RENDIMIENTO PRINCIPAL: la geometría 3D de cada país se calcula
   * UNA SOLA VEZ aquí (cuando cambian los `features`, es decir, al cargar el
   * geojson) en vez de dentro de cada <CountryMesh>. Antes, cada mesh recreaba
   * su ExtrudeGeometry cada vez que `granularity` cruzaba el umbral 0 <-> 1,
   * es decir, ~250 geometrías extruidas de golpe en el hilo principal cada vez
   * que soltabas el slider — de ahí el freeze. Ahora el slider solo cambia
   * props livianas (opacidad/escala/color), nunca geometría.
   */
  const countryGeometries = useMemo(() => {
    const map = new Map<string, THREE.ExtrudeGeometry>();
    features.forEach((feature) => {
      if (!feature.geometry?.coordinates) return;
      const name = String(feature.properties?.name || feature.properties?.ADMIN || "Desconocido");
      const polygons: number[][][][] =
        feature.geometry.type === "MultiPolygon" ? feature.geometry.coordinates : [feature.geometry.coordinates];
      const shapes: THREE.Shape[] = [];
      polygons.forEach((polygon) => {
        const outerRing = polygon[0];
        if (!outerRing || outerRing.length < 3) return;
        const shape = new THREE.Shape();
        let hasValidPoints = false;
        // Simplificación leve y fija (no depende de granularity, así nunca hay
        // que recalcular al hacer zoom): solo se reduce el detalle en polígonos
        // MUY grandes, donde el ojo no distingue la diferencia de todas formas.
        const step = outerRing.length > 300 ? 2 : 1;
        for (let i = 0; i < outerRing.length; i += step) {
          const point = projection(outerRing[i] as [number, number]);
          if (point && !isNaN(point[0])) {
            if (!hasValidPoints) {
              shape.moveTo(point[0], -point[1]);
              hasValidPoints = true;
            } else {
              shape.lineTo(point[0], -point[1]);
            }
          }
        }
        if (hasValidPoints) shapes.push(shape);
      });
      if (shapes.length > 0) {
        map.set(name, new THREE.ExtrudeGeometry(shapes, { depth: 0.2, bevelEnabled: false, curveSegments: 1 }));
      }
    });
    return map;
  }, [features, projection]);

  // Libera memoria de GPU al desmontar o al recalcular (hot-reload de Next.js, etc.)
  useEffect(() => {
    return () => {
      countryGeometries.forEach((g) => g.dispose());
    };
  }, [countryGeometries]);

  const registerMesh = useCallback((name: string, mesh: THREE.Mesh | null) => {
    if (mesh) meshesRegistry.current.set(name, mesh);
    else meshesRegistry.current.delete(name);
  }, []);

  // Vuelo de cámara: continente → país → ciudad, con distancias ajustadas por nivel
  useEffect(() => {
    if (!controlsRef.current || isLoading) return;

    if (selectedCity) {
      const cityEntry = CITY_LOOKUP[selectedCity];
      if (cityEntry?.lat !== undefined && cityEntry.lng !== undefined) {
        const p = projection([cityEntry.lng, cityEntry.lat]);
        if (p) {
          controlsRef.current.setLookAt(p[0], 6, -p[1] + 4, p[0], 0, -p[1], true);
          return;
        }
      }
    }

    if (selectedItem === WORLD_VIEW || !selectedItem) {
      controlsRef.current.setLookAt(0, 30, 20, 0, 0, 0, true);
      return;
    }

    const targetMeshes: THREE.Mesh[] = [];
    if (granularity === 0) {
      features.forEach((f) => {
        const countryName = String(f.properties?.name || f.properties?.ADMIN || "");
        if (getContinentName(countryName) === selectedItem) {
          const m = meshesRegistry.current.get(countryName);
          if (m) targetMeshes.push(m);
        }
      });
    } else {
      const m = meshesRegistry.current.get(selectedItem);
      if (m) targetMeshes.push(m);
    }
    if (targetMeshes.length > 0) {
      const box = new THREE.Box3();
      targetMeshes.forEach((mesh) => box.expandByObject(mesh));
      const center = new THREE.Vector3();
      const size = new THREE.Vector3();
      box.getCenter(center);
      box.getSize(size);
      const distance = Math.max(Math.max(size.x, size.y) * (granularity === 0 ? 2 : 1.2), granularity === 0 ? 15 : 6);
      controlsRef.current.setLookAt(center.x, center.y + distance, center.z + distance * 0.5, center.x, center.y, center.z, true);
    }
  }, [selectedItem, selectedCity, granularity, features, isLoading, projection]);

  // Pines de ciudades: solo se calculan cuando hay un país seleccionado y granularity >= 1
  const cityPins = useMemo(() => {
    if (granularity === 0 || !selectedItem || !TOP_CITIES[selectedItem]) return [];
    return TOP_CITIES[selectedItem]
      .map((c) => {
        if (c.lat === undefined || c.lng === undefined) return null;
        const p = projection([c.lng, c.lat]);
        if (!p) return null;
        return { name: c.name, emoji: c.emoji, position: [p[0], -p[1], 1.6] as [number, number, number] };
      })
      .filter((v): v is { name: string; emoji: string; position: [number, number, number] } => v !== null);
  }, [granularity, selectedItem, projection]);

  const filterSet = activeFilter !== "Todos" ? FILTERS_MOCK_SETS[activeFilter] : null;

  if (isLoading) return null;

  return (
    <>
      <CameraControls ref={controlsRef} makeDefault dampingFactor={0.08} maxPolarAngle={Math.PI / 3} minDistance={5} maxDistance={60} />
      <Environment preset="city" />
      <ambientLight intensity={0.6} />
      <directionalLight position={[10, 20, 20]} intensity={1.5} color="#fff" />

      {/*
        onPointerMissed: click en área vacía del canvas (mar/espacio) = deseleccionar.
        Es el gesto 3D más natural para "salir" de un país/continente sin depender
        únicamente del botón "Volver al mundo" o de mover el slider con precisión.
      */}
      <group
        rotation={[-Math.PI / 2, 0, 0]}
        position={[-MAP_WIDTH / 2, MAP_HEIGHT / 2, 0]}
        onPointerMissed={onDeselect}
      >
        {features.map((feature, i) => {
          const countryName = String(feature.properties?.name || feature.properties?.ADMIN);
          const geometry = countryGeometries.get(countryName);
          if (!geometry) return null;
          const continentName = getContinentName(countryName);

          let isSelected = false;
          let isFaded = false;

          if (filterSet && !filterSet.has(countryName)) isFaded = true;

          if (granularity === 0) {
            isSelected = selectedItem === continentName;
            if (selectedItem !== WORLD_VIEW && !isSelected) isFaded = true;
          } else {
            isSelected = selectedItem === countryName;
            if (selectedItem !== WORLD_VIEW && !isSelected) isFaded = true;
          }

          return (
            <CountryMesh
              key={countryName + i}
              name={countryName}
              geometry={geometry}
              granularity={granularity}
              isSelected={isSelected}
              isFaded={isFaded}
              continentName={continentName}
              registerMesh={registerMesh}
              onClick={() => onSelectCountry(granularity === 0 ? continentName : countryName)}
            />
          );
        })}

        {cityPins.map((pin) => (
          <MapPin
            key={pin.name}
            position={pin.position}
            label={pin.name}
            emoji={pin.emoji}
            isActive={selectedCity === pin.name}
            onClick={() => onSelectCity(pin.name)}
          />
        ))}

        {itinerary.length > 1 && <FlightPath points={itinerary} projection={projection} />}
      </group>
    </>
  );
}

// ============================================================================
// UI — TARJETAS DE PAQUETE (dopamine-driven)
// ============================================================================
interface PackageCardProps {
  item: PackageItem;
  liked: boolean;
  onSelect: () => void;
  onLike: () => void;
  ctaLabel: string;
}
const PackageCard = React.memo(({ item, liked, onSelect, onLike, ctaLabel }: PackageCardProps) => {
  const [pressed, setPressed] = useState(false);

  return (
    <div className="group relative rounded-2xl bg-white/[0.04] border border-white/10 p-3.5 transition-all duration-300 hover:bg-white/[0.08] hover:border-[#00f2fe]/40 hover:-translate-y-0.5">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-10 h-10 shrink-0 rounded-xl bg-gradient-to-br from-[#00f2fe]/20 to-[#4facfe]/10 flex items-center justify-center text-xl">
            {item.emoji}
          </div>
          <div className="min-w-0">
            <p className="text-white font-bold text-sm truncate">{item.name}</p>
            <div className="flex items-center gap-1 text-[11px] text-white/50">
              <span className="text-[#ffd166]">★</span>
              <span>{item.rating.toFixed(1)}</span>
              <span className="text-white/30">· {item.reviews.toLocaleString("es")} reseñas</span>
            </div>
          </div>
        </div>
        <button
          onClick={(e) => { e.stopPropagation(); onLike(); }}
          className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm transition-all duration-200 ${
            liked ? "bg-[#ff6b6b]/20 text-[#ff6b6b] scale-110" : "bg-white/5 text-white/40 hover:text-white/70"
          }`}
          aria-label="Guardar en favoritos"
        >
          {liked ? "♥" : "♡"}
        </button>
      </div>

      <div className="flex flex-wrap gap-1.5 mt-2.5">
        {item.tags.map((tag) => (
          <span key={tag} className="px-2 py-0.5 rounded-md bg-white/5 text-[10px] text-white/60 font-semibold">
            {tag}
          </span>
        ))}
      </div>

      <div className="flex items-center justify-between mt-3">
        <div>
          <p className="text-[10px] text-white/40 uppercase tracking-wide">Desde</p>
          <p className="text-[#00f2fe] font-black text-base leading-none">${item.priceFrom.toLocaleString("es")}</p>
          <p className="text-[10px] text-white/40 mt-0.5">{item.duration}</p>
        </div>
        <button
          onMouseDown={() => setPressed(true)}
          onMouseUp={() => setPressed(false)}
          onMouseLeave={() => setPressed(false)}
          onClick={onSelect}
          className={`px-4 py-2 rounded-xl text-xs font-black bg-[#00f2fe] text-[#03121c] transition-transform duration-150 shadow-[0_0_16px_rgba(0,242,254,0.35)] hover:shadow-[0_0_22px_rgba(0,242,254,0.55)] ${
            pressed ? "scale-90" : "scale-100"
          }`}
        >
          {ctaLabel}
        </button>
      </div>
    </div>
  );
});
PackageCard.displayName = "PackageCard";

// ============================================================================
// UI — TOASTS
// ============================================================================
const ToastStack = ({ toasts }: { toasts: Toast[] }) => (
  <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[80] flex flex-col-reverse gap-2 pointer-events-none">
    {toasts.map((t) => (
      <div
        key={t.id}
        className={`animate-[toastIn_0.35s_ease-out] px-4 py-2.5 rounded-xl backdrop-blur-md border shadow-2xl text-sm font-bold flex items-center gap-2 ${
          t.kind === "level"
            ? "bg-[#ffd166]/15 border-[#ffd166]/50 text-[#ffd166]"
            : t.kind === "like"
            ? "bg-[#ff6b6b]/15 border-[#ff6b6b]/50 text-[#ff6b6b]"
            : "bg-[#00f2fe]/15 border-[#00f2fe]/50 text-[#00f2fe]"
        }`}
      >
        {t.text}
      </div>
    ))}
  </div>
);

// ============================================================================
// UI — BARRA DE PROGRESO / XP (gamificación)
// ============================================================================
const XPBar = ({ xp, level, streak }: { xp: number; level: number; streak: number }) => {
  const pct = xp % 100;
  return (
    <div className="flex items-center gap-3 bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl px-4 py-2.5 shadow-2xl">
      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#ffd166] to-[#f4a261] flex items-center justify-center text-sm font-black text-[#3a2200]">
        {level}
      </div>
      <div className="w-28">
        <div className="flex justify-between text-[10px] text-white/50 font-bold mb-1">
          <span>Explorador</span>
          <span>{pct}/100 XP</span>
        </div>
        <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-[#00f2fe] to-[#4facfe] rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
        </div>
      </div>
      {streak > 0 && (
        <div className="flex items-center gap-1 text-xs font-black text-[#ff9f1c]">
          🔥 <span>{streak}</span>
        </div>
      )}
    </div>
  );
};

/** Botón de salida siempre visible cuando hay algo seleccionado. */
const ResetToWorldButton = ({ onClick }: { onClick: () => void }) => (
  <button
    onClick={onClick}
    className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-bold bg-white/10 border border-white/15 text-white/80 hover:bg-white/20 hover:text-white transition-all duration-200 backdrop-blur-md shadow-lg"
  >
    🌍 Volver al mundo
  </button>
);

// ============================================================================
// CONTENEDOR PRINCIPAL
// ============================================================================
// noop tipado explícitamente (nada de `any`) — se usa cuando el panel de nivel
// "Destinos" no necesita reaccionar al click de la tarjeta (usa su propio CTA).
const noop = (_name: string): void => {};

export interface WorldMapAppProps {
  /**
   * Alto (en px) del navbar externo de tu app, para que la topbar de filtros
   * no quede tapada. Ejemplo: <WorldMapApp navbarOffsetPx={72} />
   */
  navbarOffsetPx?: number;
}

export default function WorldMapApp({ navbarOffsetPx = DEFAULT_NAVBAR_OFFSET_PX }: WorldMapAppProps) {
  const [liveZoom, setLiveZoom] = useState<number>(0);
  const [appliedGranularity, setAppliedGranularity] = useState<number>(0);
  const [selectedItem, setSelectedItem] = useState<string>(WORLD_VIEW);
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<string>("Todos");
  const [itinerary, setItinerary] = useState<CityData[]>([CITIES_DATA[0], CITIES_DATA[1]]);
  const [liked, setLiked] = useState<Set<string>>(new Set());
  const [xp, setXp] = useState(0);
  const [streak, setStreak] = useState(0);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const toastIdRef = useRef(0);
  const level = Math.floor(xp / 100) + 1;
  const hasSelection = selectedItem !== WORLD_VIEW || selectedCity !== null;

  const pushToast = useCallback((text: string, kind: Toast["kind"] = "info") => {
    const id = ++toastIdRef.current;
    setToasts((prev) => [...prev, { id, text, kind }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3200);
  }, []);

  const addXp = useCallback(
    (amount: number) => {
      setXp((prev) => {
        const next = prev + amount;
        if (Math.floor(prev / 100) !== Math.floor(next / 100)) {
          setTimeout(() => pushToast(`🎉 ¡Subiste a nivel ${Math.floor(next / 100) + 1}!`, "level"), 300);
        }
        return next;
      });
    },
    [pushToast]
  );

  const handleSliderDrag = (e: React.ChangeEvent<HTMLInputElement>) => setLiveZoom(Number(e.target.value));
  const handleSliderRelease = () => {
    setAppliedGranularity(liveZoom);
    setSelectedItem(WORLD_VIEW);
    setSelectedCity(null);
  };

  const handleFilterClick = (f: string) => {
    setActiveFilter(f);
    setSelectedItem(WORLD_VIEW);
    setSelectedCity(null);
    if (f !== "Todos") pushToast(`Filtrando por ${f}`, "info");
  };

  // Reset explícito: vuelve al globo completo SIN tocar el nivel de zoom del
  // slider (a diferencia de handleSliderRelease). Usado por el botón flotante
  // y por onPointerMissed (click en el vacío del mapa).
  const resetToWorld = useCallback(() => {
    setSelectedItem(WORLD_VIEW);
    setSelectedCity(null);
  }, []);

  const handleSelectCountryOnMap = useCallback((name: string) => setSelectedItem(name), []);
  const handleSelectCityOnMap = useCallback((name: string) => {
    setSelectedCity(name);
    setLiveZoom(2);
    setAppliedGranularity(2);
  }, []);

  // Drill-down desde el panel: continente -> país (avanza el slider automáticamente)
  const drillToCountry = useCallback(
    (countryName: string) => {
      setSelectedItem(countryName);
      setSelectedCity(null);
      setLiveZoom(1);
      setAppliedGranularity(1);
      addXp(15);
      pushToast(`🗺️ Explorando ${countryName}`, "xp");
    },
    [addXp, pushToast]
  );

  // Drill-down: país -> ciudad
  const drillToCity = useCallback(
    (cityName: string) => {
      setSelectedCity(cityName);
      setLiveZoom(2);
      setAppliedGranularity(2);
      addXp(20);
      pushToast(`📍 Descubriendo ${cityName}`, "xp");
    },
    [addXp, pushToast]
  );

  // Agregar destino final al itinerario (crea la ruta de vuelo)
  const addDestinationToItinerary = useCallback(
    (item: PackageItem) => {
      const cityRef = selectedCity ? CITY_LOOKUP[selectedCity] : null;
      if (cityRef?.lat !== undefined && cityRef.lng !== undefined) {
        setItinerary((prev) => [
          ...prev,
          { id: item.id, name: cityRef.name, country: selectedItem, lat: cityRef.lat as number, lng: cityRef.lng as number },
        ]);
      }
      setStreak((s) => s + 1);
      addXp(35);
      pushToast(`✈️ ${item.name} agregado a tu viaje`, "xp");
    },
    [selectedCity, selectedItem, addXp, pushToast]
  );

  const toggleLike = useCallback(
    (item: PackageItem) => {
      setLiked((prev) => {
        const next = new Set(prev);
        if (next.has(item.id)) {
          next.delete(item.id);
        } else {
          next.add(item.id);
          addXp(5);
          pushToast(`♥ ${item.name} guardado`, "like");
        }
        return next;
      });
    },
    [addXp, pushToast]
  );

  // Contenido del panel lateral según el nivel de drill-down actual.
  // Devuelve siempre la misma forma { title, subtitle, items, onSelect } con
  // onSelect de aridad fija (string) => void, para que el tipo no varíe entre ramas.
  const panel = useMemo(() => {
    if (appliedGranularity === 0) {
      const continent = selectedItem !== WORLD_VIEW ? selectedItem : null;
      if (!continent) return { title: "Explora el mundo", subtitle: "Selecciona un continente en el globo", items: [] as PackageItem[], onSelect: drillToCountry };
      let items = TOP_COUNTRIES[continent] || [];
      if (activeFilter !== "Todos") items = items.filter((i) => i.tags.includes(activeFilter));
      return { title: `Top países · ${continent}`, subtitle: "Los favoritos de nuestros viajeros", items, onSelect: drillToCountry };
    }
    if (appliedGranularity === 1) {
      const country = selectedItem !== WORLD_VIEW ? selectedItem : null;
      if (!country || !TOP_CITIES[country]) return { title: "Elige un país", subtitle: "Selecciona un país en el globo", items: [] as PackageItem[], onSelect: drillToCity };
      let items = TOP_CITIES[country];
      if (activeFilter !== "Todos") items = items.filter((i) => i.tags.includes(activeFilter));
      return { title: `Top ciudades · ${country}`, subtitle: "Las más reservadas este mes", items, onSelect: drillToCity };
    }
    // granularity 2 — el CTA de esta rama nunca invoca onSelect (usa addDestinationToItinerary
    // directamente desde el botón de la tarjeta), pero mantenemos la misma aridad `noop`.
    if (!selectedCity) return { title: "Elige una ciudad", subtitle: "Toca un pin 📍 en el mapa para ver destinos", items: [] as PackageItem[], onSelect: noop };
    let items = getDestinations(selectedCity);
    if (activeFilter !== "Todos") items = items.filter((i) => i.tags.includes(activeFilter));
    return { title: `Destinos imperdibles · ${selectedCity}`, subtitle: "Elegidos por la comunidad", items, onSelect: noop };
  }, [appliedGranularity, selectedItem, selectedCity, activeFilter, drillToCountry, drillToCity]);

  const sliderNodes = [
    { value: 0, icon: "🌍", label: "Continentes" },
    { value: 1, icon: "🗺️", label: "Países" },
    { value: 2, icon: "📍", label: "Destinos" },
  ];

  // Alto real de la topbar (para posicionar el panel lateral justo debajo, sin
  // números mágicos repetidos entre ambos bloques del JSX).
  const topbarHeightPx = 64;
  const panelTopPx = navbarOffsetPx + topbarHeightPx + 16;

  return (
    <div className="relative flex h-screen w-full bg-[#050b14] font-sans overflow-hidden">
      <style>{`
        @keyframes toastIn { from { opacity: 0; transform: translateY(12px) scale(0.95); } to { opacity: 1; transform: translateY(0) scale(1); } }
        @keyframes cardIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        .panel-scroll::-webkit-scrollbar { width: 6px; }
        .panel-scroll::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.15); border-radius: 999px; }
      `}</style>

      {/* CAPA 3D */}
      <div className="absolute inset-0 z-0 pointer-events-auto">
        <Canvas shadows dpr={[1, 1.5]} gl={{ powerPreference: "high-performance", antialias: true }}>
          <Suspense fallback={<Html center><div className="text-[#00f2fe] animate-pulse font-bold tracking-widest">CARGANDO GEOMETRÍAS...</div></Html>}>
            <MapScene
              granularity={appliedGranularity}
              selectedItem={selectedItem}
              selectedCity={selectedCity}
              activeFilter={activeFilter}
              onSelectCountry={handleSelectCountryOnMap}
              onSelectCity={handleSelectCityOnMap}
              onDeselect={resetToWorld}
              itinerary={itinerary}
            />
          </Suspense>
        </Canvas>
      </div>

      {/* TOP BAR — XP + FILTROS + VOLVER AL MUNDO */}
      {/* 🔧 top: usa `navbarOffsetPx` (prop) para no quedar debajo de tu navbar externa */}
      <div
        className={`absolute w-full ${UI_Z_INDEX} pointer-events-none flex items-center justify-between px-6 gap-4`}
        style={{ top: navbarOffsetPx, height: topbarHeightPx }}
      >
        <div className="pointer-events-auto">
          <XPBar xp={xp} level={level} streak={streak} />
        </div>
        <div className="flex-1 flex justify-center">
          <div className="flex gap-2 bg-black/40 p-2 rounded-2xl backdrop-blur-md border border-white/10 pointer-events-auto shadow-2xl">
            {["Todos", "Playa 🏖️", "Cultura 🏛️", "Precio 💲"].map((f) => (
              <button
                key={f}
                onClick={() => handleFilterClick(f)}
                className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${
                  activeFilter === f
                    ? "bg-[#00f2fe]/20 text-[#00f2fe] border border-[#00f2fe] shadow-[0_0_15px_rgba(0,242,254,0.3)]"
                    : "text-white/70 border border-transparent hover:bg-white/10 hover:text-white"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
        <div className="pointer-events-auto w-[168px] shrink-0 flex justify-end">
          {hasSelection && <ResetToWorldButton onClick={resetToWorld} />}
        </div>
      </div>

      {/* PANEL LATERAL IZQUIERDO — TOP LISTS / PAQUETES */}
      <div className={`absolute left-6 bottom-6 ${UI_Z_INDEX} w-[320px] pointer-events-none flex flex-col`} style={{ top: panelTopPx }}>
        <div className="pointer-events-auto flex-1 flex flex-col bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
          <div className="p-4 border-b border-white/10">
            <p className="text-white font-black text-base leading-tight">{panel.title}</p>
            <p className="text-white/40 text-xs mt-0.5">{panel.subtitle}</p>
          </div>
          <div className="panel-scroll flex-1 overflow-y-auto p-3 flex flex-col gap-2.5">
            {panel.items.length === 0 && (
              <div className="flex-1 flex items-center justify-center text-center text-white/30 text-sm px-6 py-10">
                {appliedGranularity === 2 ? "Explora el globo y toca un pin 📍" : "Toca el mapa para comenzar tu aventura ✨"}
              </div>
            )}
            {panel.items.map((item, idx) => (
              <div key={item.id} style={{ animation: `cardIn 0.3s ease-out ${idx * 0.05}s both` }}>
                <PackageCard
                  item={item}
                  liked={liked.has(item.id)}
                  onLike={() => toggleLike(item)}
                  onSelect={() => (appliedGranularity === 2 ? addDestinationToItinerary(item) : panel.onSelect(item.name))}
                  ctaLabel={appliedGranularity === 2 ? "Agregar" : "Explorar"}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* RIGHT BAR — SLIDER CON ICONOS */}
      <div className={`absolute right-8 top-1/2 -translate-y-1/2 ${UI_Z_INDEX} pointer-events-none h-[300px] flex gap-4 items-center`}>
        <div className="flex flex-col justify-between h-full py-2 text-right">
          {[...sliderNodes].reverse().map((node) => (
            <span key={node.label} className={`text-[10px] font-black uppercase tracking-widest transition-colors ${liveZoom === node.value ? "text-[#00f2fe]" : "text-white/40"}`}>
              {node.label}
            </span>
          ))}
        </div>

        <div className="relative w-12 h-full bg-black/40 rounded-full backdrop-blur-md border border-white/10 flex flex-col justify-between items-center py-2 pointer-events-auto shadow-lg">
          {[...sliderNodes].reverse().map((node) => (
            <div
              key={node.value}
              className={`w-8 h-8 flex items-center justify-center rounded-full transition-all duration-500 z-10 ${
                liveZoom === node.value ? "bg-[#00f2fe]/20 border border-[#00f2fe] shadow-[0_0_10px_#00f2fe]" : "bg-black/50 border border-white/5 grayscale opacity-50"
              }`}
            >
              <span className="text-sm">{node.icon}</span>
            </div>
          ))}

          <div className="absolute bottom-2 top-2 w-1.5 bg-white/5 rounded-full z-0 overflow-hidden">
            <div className="absolute bottom-0 w-full bg-gradient-to-t from-[#00f2fe] to-[#4facfe] rounded-full transition-all duration-300 ease-out" style={{ height: `${(liveZoom / 2) * 100}%` }} />
          </div>

          <input
            type="range"
            min="0"
            max="2"
            step="1"
            value={liveZoom}
            onChange={handleSliderDrag}
            onMouseUp={handleSliderRelease}
            onTouchEnd={handleSliderRelease}
            className="absolute h-full w-full appearance-none bg-transparent cursor-pointer opacity-0 z-20"
            style={{ writingMode: "vertical-lr", direction: "rtl" } as React.CSSProperties}
          />
        </div>
      </div>

      <ToastStack toasts={toasts} />
    </div>
  );
}