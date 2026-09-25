"use client";

import React, { useMemo, useEffect, useState, useRef, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { CameraControls, PerspectiveCamera, Html, Environment } from "@react-three/drei";
import * as THREE from "three";
import { geoEqualEarth, type GeoProjection, type ExtendedFeatureCollection, type ExtendedFeature } from "d3-geo";

import { MOCK_HOTELS } from "../lib/mock-hotels";
import type { HotelbedsRawHotel } from "../lib/hotelbeds-types";

// --- TIPOS ---
export interface GeoJSONFeature {
  type: string;
  properties?: { 
    ADMIN?: string; 
    name?: string; 
    NAME?: string;
    CONTINENT?: string;
    continent?: string;
    [key: string]: unknown; 
  };
  geometry: { 
    type: "Polygon" | "MultiPolygon" | string; 
    coordinates: number[][][] | number[][][][]; 
  };
}

export interface CityData {
  id: string | number;
  name: string;
  country: string;
  lat: number;
  lng: number;
}

// --- DICCIONARIO COMPLETO AJUSTADO A LOS 5 CONTINENTES ---
const COUNTRY_TO_CONTINENT: Record<string, string> = {
  // --- ÁFRICA ---
  "Algeria": "África", "Angola": "África", "Benin": "África", "Botswana": "África",
  "Burkina Faso": "África", "Burundi": "África", "Cape Verde": "África", "Cameroon": "África",
  "Central African Republic": "África", "Chad": "África", "Comoros": "África", "Congo": "África",
  "Democratic Republic of the Congo": "África", "Republic of Congo": "África", "Republic of the Congo": "África",
  "Ivory Coast": "África", "Côte d'Ivoire": "África", "Djibouti": "África", "Egypt": "África",
  "Equatorial Guinea": "África", "Eritrea": "África", "Ethiopia": "África", "Eswatini": "África",
  "Gabon": "África", "Gambia": "África", "Ghana": "África", "Guinea": "África",
  "Guinea-Bissau": "África", "Kenya": "África", "Lesotho": "África", "Liberia": "África",
  "Libya": "África", "Madagascar": "África", "Malawi": "África", "Mali": "África",
  "Mauritania": "África", "Mauritius": "África", "Mayotte": "África", "Morocco": "África",
  "Mozambique": "África", "Namibia": "África", "Niger": "África", "Nigeria": "África",
  "Réunion": "África", "Rwanda": "África", "Sao Tome and Principe": "África", "Senegal": "África",
  "Seychelles": "África", "Sierra Leone": "África", "Somalia": "África", "Somaliland": "África",
  "South Africa": "África", "South Sudan": "África", "Sudan": "África", "Swaziland": "África",
  "Tanzania": "África", "United Republic of Tanzania": "África", "Togo": "África", "Tunisia": "África",
  "Uganda": "África", "Western Sahara": "África", "Zambia": "África", "Zimbabwe": "África",

  // --- AMÉRICA ---
  "Anguilla": "América", "Antigua and Barbuda": "América", "Argentina": "América", "Aruba": "América",
  "Bahamas": "América", "Barbados": "América", "Belize": "América", "Bermuda": "América",
  "Bermuda Islands": "América", "Bolivia": "América", "Brazil": "América", "Canada": "América",
  "Cayman Islands": "América", "Chile": "América", "Colombia": "América", "Costa Rica": "América",
  "Cuba": "América", "Curaçao": "América", "Curacao": "América", "Dominica": "América",
  "Dominican Republic": "América", "Ecuador": "América", "El Salvador": "América",
  "Falkland Islands (Malvinas)": "América", "Falkland Islands": "América", "French Guiana": "América",
  "Greenland": "América", "Grenada": "América", "Guadeloupe": "América", "Guatemala": "América",
  "Guyana": "América", "Haiti": "América", "Honduras": "América", "Jamaica": "América",
  "Martinique": "América", "Mexico": "América", "Montserrat": "América", "Netherlands Antilles": "América",
  "Nicaragua": "América", "Panama": "América", "Paraguay": "América", "Peru": "América",
  "Puerto Rico": "América", "Saint Barthélemy": "América", "Saint Kitts and Nevis": "América",
  "Saint Lucia": "América", "Saint Martin (French part)": "América", "Saint Pierre and Miquelon": "América",
  "Saint Vincent and the Grenadines": "América", "Sint Maarten": "América",
  "South Georgia and the South Sandwich Islands": "América", "Suriname": "América",
  "Trinidad and Tobago": "América", "Turks and Caicos Islands": "América", "United States": "América",
  "United States of America": "América", "United States Virgin Islands": "América", "Uruguay": "América",
  "Venezuela": "América", "Virgin Islands": "América",

  // --- ASIA ---
  "Afghanistan": "Asia", "Armenia": "Asia", "Azerbaijan": "Asia", "Bahrain": "Asia",
  "Bangladesh": "Asia", "Bhutan": "Asia", "British Indian Ocean Territory": "Asia", "Brunei": "Asia",
  "Cambodia": "Asia", "China": "Asia", "Cyprus": "Asia", "Northern Cyprus": "Asia",
  "East Timor": "Asia", "Timor-Leste": "Asia", "Georgia": "Asia", "Hong Kong": "Asia",
  "India": "Asia", "Indonesia": "Asia", "Iran": "Asia", "Iraq": "Asia", "Israel": "Asia",
  "Japan": "Asia", "Jordan": "Asia", "Kazakhstan": "Asia", "Kuwait": "Asia", "Kyrgyzstan": "Asia",
  "Laos": "Asia", "Lebanon": "Asia", "Macao": "Asia", "Malaysia": "Asia", "Maldives": "Asia",
  "Mongolia": "Asia", "Myanmar": "Asia", "Nepal": "Asia", "North Korea": "Asia", "Oman": "Asia",
  "Pakistan": "Asia", "Palestine": "Asia", "Philippines": "Asia", "Qatar": "Asia",
  "Saudi Arabia": "Asia", "Singapore": "Asia", "South Korea": "Asia", "Sri Lanka": "Asia",
  "Syria": "Asia", "Taiwan": "Asia", "Tajikistan": "Asia", "Thailand": "Asia", "Turkey": "Asia",
  "Turkmenistan": "Asia", "United Arab Emirates": "Asia", "Uzbekistan": "Asia", "Vietnam": "Asia",
  "Yemen": "Asia",

  // --- EUROPA ---
  "Albania": "Europa", "Andorra": "Europa", "Austria": "Europa", "Belarus": "Europa",
  "Belgium": "Europa", "Bosnia and Herzegovina": "Europa", "Bulgaria": "Europa", "Croatia": "Europa",
  "Czech Republic": "Europa", "Czechia": "Europa", "Denmark": "Europa", "Estonia": "Europa",
  "Faroe Islands": "Europa", "Finland": "Europa", "France": "Europa", "Germany": "Europa",
  "Gibraltar": "Europa", "Greece": "Europa", "Guernsey": "Europa", "Hungary": "Europa",
  "Iceland": "Europa", "Ireland": "Europa", "Isle of Man": "Europa", "Italy": "Europa",
  "Jersey": "Europa", "Kosovo": "Europa", "Latvia": "Europa", "Liechtenstein": "Europa",
  "Lithuania": "Europa", "Luxembourg": "Europa", "Macedonia": "Europa", "North Macedonia": "Europa",
  "Malta": "Europa", "Moldova": "Europa", "Monaco": "Europa", "Montenegro": "Europa",
  "Netherlands": "Europa", "Norway": "Europa", "Poland": "Europa", "Portugal": "Europa",
  "Romania": "Europa", "Russia": "Europa", "San Marino": "Europa", "Serbia": "Europa",
  "Slovakia": "Europa", "Slovenia": "Europa", "Spain": "Europa", "Svalbard and Jan Mayen": "Europa",
  "Sweden": "Europa", "Switzerland": "Europa", "Ukraine": "Europa", "United Kingdom": "Europa",
  "Vatican City State": "Europa", "Vatican City": "Europa", "Åland Islands": "Europa",

  // --- OCEANÍA ---
  "American Samoa": "Oceanía", "Antarctica": "Oceanía", "Australia": "Oceanía",
  "Bouvet Island": "Oceanía", "Christmas Island": "Oceanía", "Cocos (Keeling) Islands": "Oceanía",
  "Cook Islands": "Oceanía", "Fiji": "Oceanía", "French Polynesia": "Oceanía",
  "French Southern Territories": "Oceanía", "Guam": "Oceanía",
  "Heard Island and McDonald Islands": "Oceanía", "Kiribati": "Oceanía", "Marshall Islands": "Oceanía",
  "Micronesia": "Oceanía", "Nauru": "Oceanía", "New Caledonia": "Oceanía", "New Zealand": "Oceanía",
  "Niue": "Oceanía", "Norfolk Island": "Oceanía", "Northern Mariana Islands": "Oceanía",
  "Palau": "Oceanía", "Papua New Guinea": "Oceanía", "Pitcairn Islands": "Oceanía", "Samoa": "Oceanía",
  "Solomon Islands": "Oceanía", "Tokelau": "Oceanía", "Tonga": "Oceanía", "Tuvalu": "Oceanía",
  "United States Minor Outlying Islands": "Oceanía", "Vanuatu": "Oceanía", "Wallis and Futuna": "Oceanía"
};

// Colores definidos para los 5 continentes
const CONTINENT_COLORS: Record<string, string> = {
  "América": "#e76f51",
  "Europa": "#2a9d8f",
  "Asia": "#e9c46a",
  "África": "#f4a261",
  "Oceanía": "#8ab17d",
  "Otros": "#d4a373"
};

const getContinentName = (feature: GeoJSONFeature): string => {
  const countryName = String(
    feature.properties?.ADMIN || 
    feature.properties?.name || 
    feature.properties?.NAME || 
    ""
  );
  return COUNTRY_TO_CONTINENT[countryName] || "Otros";
};

// --- DATOS DE CIUDADES / DESTINOS ---
const rawHotels: HotelbedsRawHotel[] = MOCK_HOTELS.hotels?.hotels || [];
const CITIES_DATA: CityData[] = rawHotels
  .filter((h) => h.latitude && h.longitude)
  .map((h) => ({
    id: h.code,
    name: h.destinationName || h.name,
    country: h.destinationCode || "Desconocido",
    lat: parseFloat(h.latitude as string),
    lng: parseFloat(h.longitude as string),
  }));

// --- COMPONENTE MALLA DE PAÍS ---
interface CountryMeshProps {
  feature: GeoJSONFeature;
  projection: GeoProjection;
  isSelected: boolean;
  isHovered: boolean;
  isFaded: boolean;
  granularity: number;
  delay: number;
  continentName: string;
  onHover: (hovering: boolean) => void;
  onClick: () => void;
  registerMesh?: (name: string, mesh: THREE.Mesh | null) => void;
}

const CountryMesh = React.memo(({ 
  feature, projection, isSelected, isHovered, isFaded, granularity, delay, continentName, onHover, onClick, registerMesh
}: CountryMeshProps) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.MeshStandardMaterial>(null);
  const [spawned, setSpawned] = useState(false);
  
  const name = String(feature.properties?.ADMIN || feature.properties?.name || feature.properties?.NAME || "Desconocido");

  useEffect(() => {
    if (meshRef.current && registerMesh) registerMesh(name, meshRef.current);
    return () => { if (registerMesh) registerMesh(name, null); };
  }, [name, registerMesh]);

  useEffect(() => {
    const timer = setTimeout(() => setSpawned(true), delay * 1000);
    return () => clearTimeout(timer);
  }, [delay]);

  const shapeGeometry = useMemo(() => {
    if (!feature.geometry?.coordinates) return null;
    const isMulti = feature.geometry.type === "MultiPolygon";
    const polygons = (isMulti ? feature.geometry.coordinates : [feature.geometry.coordinates]) as number[][][][];
    const shapes: THREE.Shape[] = [];

    polygons.forEach((polygon) => {
      const outerRing = polygon[0]; 
      if (!outerRing || outerRing.length < 3) return;
      const shape = new THREE.Shape();
      let hasValidPoints = false;

      outerRing.forEach((pos) => {
        const point = projection(pos as [number, number]);
        if (point && !isNaN(point[0])) {
          if (!hasValidPoints) { shape.moveTo(point[0], -point[1]); hasValidPoints = true; } 
          else { shape.lineTo(point[0], -point[1]); }
        }
      });
      if (hasValidPoints) shapes.push(shape);
    });

    return shapes.length > 0 ? new THREE.ExtrudeGeometry(shapes, { depth: 0.8, bevelEnabled: false }) : null;
  }, [feature, projection]);

  useFrame((state, delta) => {
    if (!meshRef.current || !materialRef.current) return;
    
    const targetScaleZ = !spawned ? 0.01 : isSelected ? 2.2 : isHovered ? 1.5 : granularity === 0 ? 0.4 : 1;
    meshRef.current.scale.z = THREE.MathUtils.lerp(meshRef.current.scale.z, targetScaleZ, delta * 8);

    const targetY = !spawned ? 15 : 0;
    meshRef.current.position.y = THREE.MathUtils.lerp(meshRef.current.position.y, targetY, delta * 6);

    const targetOpacity = isFaded ? 0.15 : (!spawned ? 0 : 1);
    materialRef.current.opacity = THREE.MathUtils.lerp(materialRef.current.opacity, targetOpacity, delta * 5);
  });

  if (!shapeGeometry) return null;

  const baseColor = granularity === 0 ? (CONTINENT_COLORS[continentName] || CONTINENT_COLORS["Otros"]) : "#d4a373";
  const activeColor = isSelected ? "#ff7e67" : isHovered ? "#f2d3b3" : baseColor;

  return (
    <mesh 
      ref={meshRef}
      geometry={shapeGeometry}
      castShadow receiveShadow
      onPointerOver={(e) => { e.stopPropagation(); onHover(true); document.body.style.cursor = 'pointer'; }}
      onPointerOut={(e) => { e.stopPropagation(); onHover(false); document.body.style.cursor = 'auto'; }}
      onClick={(e) => { e.stopPropagation(); onClick(); }}
    >
      <meshStandardMaterial 
        ref={materialRef}
        color={activeColor} 
        roughness={0.5} 
        metalness={0.1} 
        transparent 
      />
    </mesh>
  );
});
CountryMesh.displayName = "CountryMesh";

// --- COMPONENTE MARCADOR DE CIUDAD ---
function CityMarker({ coords, city, isSelected, onClick }: { coords: [number, number]; city: CityData; isSelected: boolean; onClick: () => void }) {
  return (
    <group position={[coords[0], -coords[1], 1]}>
      <mesh onClick={(e) => { e.stopPropagation(); onClick(); }}>
        <cylinderGeometry args={[0.2, 0.2, 0.4, 16]} />
        <meshStandardMaterial color={isSelected ? "#ff3366" : "#ffffff"} />
      </mesh>
      <Html distanceFactor={20} position={[0, 0, 0.6]} center>
        <div className={`px-2 py-1 rounded text-xs font-bold whitespace-nowrap transition-all ${
          isSelected ? "bg-[#ff7e67] text-white scale-110 shadow-lg" : "bg-white/90 text-gray-800 shadow-md"
        }`}>
          {city.name}
        </div>
      </Html>
    </group>
  );
}

// --- ESCENA PRINCIPAL ---
function MapScene({ granularity, selectedItem, onSelect }: { granularity: number; selectedItem: string; onSelect: (name: string) => void; }) {
  const [features, setFeatures] = useState<GeoJSONFeature[]>([]);
  const [hoveredEntity, setHoveredEntity] = useState<string | null>(null);
  const controlsRef = useRef<CameraControls>(null);
  const meshesRegistry = useRef<Map<string, THREE.Mesh>>(new Map());

  const MAP_WIDTH = 35;
  const MAP_HEIGHT = 17.5;

  useEffect(() => {
    let isMounted = true;
    fetch('https://raw.githubusercontent.com/datasets/geo-countries/master/data/countries.geojson')
      .then(res => res.json())
      .then(data => { if(isMounted) setFeatures(data.features); })
      .catch(console.error);
    return () => { isMounted = false; };
  }, []);

  const projection = useMemo(() => {
    const collection: ExtendedFeatureCollection<ExtendedFeature> = { type: "FeatureCollection", features: features as unknown as ExtendedFeature[] };
    return geoEqualEarth().fitSize([MAP_WIDTH, MAP_HEIGHT], collection);
  }, [features]);

  const registerMesh = React.useCallback((name: string, mesh: THREE.Mesh | null) => {
    if (mesh) meshesRegistry.current.set(name, mesh);
    else meshesRegistry.current.delete(name);
  }, []);

  useEffect(() => {
    if (!controlsRef.current) return;

    if (selectedItem === "Explora el mundo" || !selectedItem) {
      if (granularity === 0) {
        controlsRef.current.setLookAt(0, 28, 22, 0, 0, 0, true);
      } else {
        controlsRef.current.setLookAt(0, 18, 14, 0, 0, 0, true);
      }
      return;
    }

    const targetMeshes: THREE.Mesh[] = [];
    if (granularity === 0) {
      features.forEach(f => {
        if (getContinentName(f) === selectedItem) {
          const m = meshesRegistry.current.get(String(f.properties?.ADMIN || f.properties?.name || f.properties?.NAME));
          if (m) targetMeshes.push(m);
        }
      });
    } else {
      const m = meshesRegistry.current.get(selectedItem);
      if (m) targetMeshes.push(m);
    }

    if (targetMeshes.length > 0) {
      const box = new THREE.Box3();
      targetMeshes.forEach(mesh => box.expandByObject(mesh));
      
      const center = new THREE.Vector3();
      const size = new THREE.Vector3();
      box.getCenter(center);
      box.getSize(size);

      const maxDim = Math.max(size.x, size.y);
      const distance = Math.max(maxDim * 1.2, 8);

      controlsRef.current.setLookAt(
        center.x, 
        center.y + distance * 1.1,
        center.z + distance * 0.7,
        center.x, center.y, center.z,
        true
      );
    }
  }, [selectedItem, granularity, features]);

  return (
    <>
      <CameraControls 
        ref={controlsRef} 
        makeDefault 
        dampingFactor={0.05} 
        maxPolarAngle={Math.PI / 3.2} 
        minPolarAngle={0.1}
        minDistance={3} 
        maxDistance={60} 
      />
      <Environment preset="city" />

      <group rotation={[-Math.PI / 2, 0, 0]} position={[-MAP_WIDTH / 2, MAP_HEIGHT / 2, 0]}>
        <mesh position={[MAP_WIDTH / 2, -MAP_HEIGHT / 2, -0.4]} receiveShadow>
          <planeGeometry args={[MAP_WIDTH * 2, MAP_HEIGHT * 2]} />
          <meshStandardMaterial color={granularity === 0 ? "#1d3557" : "#2a4d69"} roughness={0.8} />
        </mesh>

        {features.map((feature, i) => {
          const countryName = String(feature.properties?.ADMIN || feature.properties?.name || feature.properties?.NAME);
          const continentName = getContinentName(feature);

          let isSelected = false;
          let isHovered = false;
          let isFaded = false;

          if (granularity === 0) {
            isSelected = selectedItem === continentName;
            isHovered = hoveredEntity === continentName;
            isFaded = selectedItem !== "Explora el mundo" && !isSelected;
          } else {
            isSelected = selectedItem === countryName;
            isHovered = hoveredEntity === countryName;
            isFaded = selectedItem !== "Explora el mundo" && !isSelected;
          }

          return (
            <CountryMesh 
              key={countryName + i} 
              feature={feature} 
              projection={projection}
              granularity={granularity}
              isSelected={isSelected}
              isHovered={isHovered}
              isFaded={isFaded}
              delay={i * 0.005}
              continentName={continentName}
              onHover={(hovering) => setHoveredEntity(hovering ? (granularity === 0 ? continentName : countryName) : null)}
              onClick={() => onSelect(granularity === 0 ? continentName : countryName)}
              registerMesh={registerMesh} 
            />
          );
        })}

        {granularity === 2 && CITIES_DATA.map((city) => {
          const coords = projection([city.lng, city.lat]);
          if (!coords) return null;
          return (
            <CityMarker 
              key={city.id} 
              coords={coords as [number, number]} 
              city={city} 
              isSelected={selectedItem === city.name}
              onClick={() => onSelect(city.name)}
            />
          );
        })}
      </group>
    </>
  );
}

// --- CONTENEDOR PRINCIPAL INMERSIVO ---
export default function WorldMapApp() {
  const [granularity, setGranularity] = useState<number>(0);
  const [selectedItem, setSelectedItem] = useState<string>("Explora el mundo");
  const granularityLabels = ["Continentes", "Países", "Ciudades"];

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newLevel = Number(e.target.value);
    setGranularity(newLevel);
    setSelectedItem("Explora el mundo");
  };

  return (
    <div className="relative flex h-screen w-full flex-col items-center justify-center bg-[#0d1b2a] font-sans overflow-hidden">
      <div className="absolute inset-0 z-0">
        <Canvas shadows dpr={[1, 2]}>
          <PerspectiveCamera makeDefault position={[0, 28, 22]} fov={35} />
          <ambientLight intensity={0.6} />
          <directionalLight position={[15, 30, 20]} intensity={1.5} castShadow />
          
          <Suspense fallback={<Html center><div className="text-2xl font-black text-white animate-pulse">Creando mundo...</div></Html>}>
            <MapScene 
              granularity={granularity} 
              selectedItem={selectedItem} 
              onSelect={(name) => setSelectedItem(name)} 
            />
          </Suspense>
        </Canvas>
      </div>

      <div className="absolute bottom-8 left-1/2 z-20 flex w-[90%] max-w-2xl -translate-x-1/2 flex-col items-center rounded-3xl bg-white/80 p-6 shadow-2xl backdrop-blur-xl border border-white/50">
        <h1 className="mb-1 text-2xl font-black tracking-tight text-gray-900">
          Explorador Jerárquico
        </h1>
        <p className="mb-4 font-bold text-base text-[#e76f51]">
          {selectedItem}
        </p>

        <div className="w-full px-4">
          <input 
            type="range" min="0" max="2" step="1" 
            value={granularity}
            onChange={handleSliderChange}
            className="h-3 w-full cursor-pointer appearance-none rounded-full bg-gray-300 accent-[#e76f51] shadow-inner"
          />
          <div className="mt-4 flex justify-between text-xs font-bold text-gray-500 uppercase tracking-wider">
            {granularityLabels.map((label, idx) => (
              <span key={label} className={`transition-all duration-300 ${granularity === idx ? "text-[#e76f51] scale-110 font-black" : ""}`}>
                {label}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}