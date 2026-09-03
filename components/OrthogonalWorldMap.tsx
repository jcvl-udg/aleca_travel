"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Edges, OrbitControls, OrthographicCamera } from "@react-three/drei";
import { geoMercator } from "d3-geo";
import { useMemo, useRef, useState } from "react";
import { ExtrudeGeometry, Path, Shape, type Group } from "three";
import { TOUCH } from "three";
import { ArrowUpRight, MapPinned, Route } from "lucide-react";
import { DESTINATIONS, type Destination } from "@/lib/destinations";
import { useGeoJSON, type GeoJSONFeature, type GeoJSONPosition } from "@/hooks/useGeoJSON";
import { useTravelStore } from "@/store/useTravelStore";

type Props = { onSelect: (destination: Destination) => void; onOpenDetails: () => void };
type ProjectedPoint = [number, number];

const projection = geoMercator().scale(1.65).translate([0, 0]);
const DESTINATIONS_BY_COUNTRY: Record<string, string[]> = {
  México: ["cancun"],
  Francia: ["paris", "london"],
  Egipto: ["cairo"],
  Japón: ["tokyo"],
  Indonesia: ["bali"],
};

function projectPosition(position: GeoJSONPosition): ProjectedPoint {
  const point = projection(position);
  return point ? [point[0], -point[1]] : [0, 0];
}

function getRings(feature: GeoJSONFeature): GeoJSONPosition[][] {
  if (feature.geometry.type === "Polygon") return feature.geometry.coordinates as GeoJSONPosition[][];
  return (feature.geometry.coordinates as GeoJSONPosition[][][]).flat();
}

function CountryMesh({ feature, active, onSelect, onHover }: { feature: GeoJSONFeature; active: boolean; onSelect: () => void; onHover: (name: string | null) => void }) {
  const geometry = useMemo(() => {
    const rings = getRings(feature);
    const [firstRing, ...holes] = rings;
    if (!firstRing) return null;
    const path = new Shape();
    firstRing.forEach((position, index) => {
      const [x, y] = projectPosition(position);
      if (index === 0) path.moveTo(x, y);
      else path.lineTo(x, y);
    });
    holes.forEach((ring) => {
      const hole = new Path();
      ring.forEach((position, index) => {
        const [x, y] = projectPosition(position);
        if (index === 0) hole.moveTo(x, y);
        else hole.lineTo(x, y);
      });
      path.holes.push(hole);
    });
    return new ExtrudeGeometry(path, { depth: 0.08, bevelEnabled: false });
  }, [feature]);

  if (!geometry) return null;
  return <mesh geometry={geometry} position={[0, 0, 0]} onPointerOver={(event) => { event.stopPropagation(); onHover(feature.properties?.name ?? null); }} onPointerOut={() => onHover(null)} onClick={(event) => { event.stopPropagation(); onSelect(); }}>
    <meshStandardMaterial color={active ? "#b98432" : "#a95032"} roughness={0.8} metalness={0.05} />
    <Edges color="#d8b46a" lineWidth={0.7} />
  </mesh>;
}

function WorldMeshes({ features, selectedName, onCountryClick, onHover }: { features: GeoJSONFeature[]; selectedName: string | null; onCountryClick: (feature: GeoJSONFeature) => void; onHover: (name: string | null) => void }) {
  const group = useRef<Group>(null);
  useFrame((_, delta) => {
    const selectedFeature = features.find((feature) => feature.properties?.name === selectedName);
    const target = selectedFeature?.properties?.center ? projectPosition(selectedFeature.properties.center) : null;
    if (!target || !group.current) return;
    const amount = Math.min(delta * 3, 1);
    group.current.position.x += (-target[0] - group.current.position.x) * amount;
    group.current.position.y += (-target[1] - group.current.position.y) * amount;
  });
  return <group ref={group}>{features.map((feature) => <CountryMesh key={feature.properties?.iso_a2 ?? feature.properties?.name} feature={feature} active={feature.properties?.name === selectedName} onSelect={() => onCountryClick(feature)} onHover={onHover} />)}</group>;
}

export function OrthogonalWorldMap({ onSelect, onOpenDetails }: Props) {
  const { data, loading, error } = useGeoJSON();
  const suggestHotelsInArea = useTravelStore((state) => state.suggestHotelsInArea);
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [hoveredCountry, setHoveredCountry] = useState<string | null>(null);
  const countries = data?.features ?? [];
  const destinations = selectedCountry
    ? DESTINATIONS.filter((destination) => DESTINATIONS_BY_COUNTRY[selectedCountry]?.includes(destination.id))
    : DESTINATIONS;

  const selectCountry = (feature: GeoJSONFeature) => {
    const [lng, lat] = feature.properties?.center ?? [0, 0];
    const name = feature.properties?.name ?? "esta región";
    console.info("[Aleca Travel] Región seleccionada", { name, lat, lng, radius: 50 });
    setSelectedCountry(name);
    suggestHotelsInArea({ label: name, lat, lng, radius: 50 });
  };

  return <div className="mx-auto flex h-full w-full max-w-7xl flex-col gap-5 px-4 pb-8 pt-28 lg:px-12 lg:pt-36">
    <div className="grid gap-4 lg:grid-cols-[minmax(0,0.72fr)_minmax(0,1.28fr)] lg:items-end"><div><p className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-primary"><Route className="h-4 w-4" aria-hidden="true" /> Mapa ortogonal</p><h1 className="max-w-xl font-serif text-4xl leading-[1.03] sm:text-5xl lg:text-6xl">Elige una región y deja que el mapa te guíe.</h1><p className="mt-4 max-w-md text-sm leading-relaxed text-muted-foreground">Una vista cenital ligera para comparar destinos y sugerir hoteles por zona.</p></div><div className="flex items-center justify-end gap-3 text-xs text-muted-foreground"><MapPinned className="h-4 w-4 text-primary" aria-hidden="true" />{hoveredCountry ?? selectedCountry ?? "Explora el atlas"}</div></div>
    <div className="grid min-h-0 flex-1 gap-4 lg:grid-cols-[minmax(0,1.5fr)_minmax(270px,0.5fr)]"><div className="map-paper relative min-h-97.5 overflow-hidden border border-border"><Canvas dpr={[1, 1.5]} style={{ touchAction: "none" }}><OrthographicCamera makeDefault position={[0, 0, 8]} zoom={75} /><ambientLight intensity={1.7} /><directionalLight position={[2, 3, 5]} intensity={2} /><WorldMeshes features={countries} selectedName={selectedCountry} onCountryClick={selectCountry} onHover={setHoveredCountry} /><OrbitControls enableRotate={false} enablePan enableZoom minZoom={45} maxZoom={125} touches={{ ONE: TOUCH.PAN, TWO: TOUCH.DOLLY_PAN }} dampingFactor={0.12} /></Canvas>{loading && <p className="absolute bottom-5 left-5 text-xs text-muted-foreground">Cargando fronteras...</p>}{error && <p className="absolute bottom-5 left-5 text-xs text-muted-foreground">El atlas está disponible sin fronteras detalladas.</p>}</div><div className="flex flex-col gap-3"><div className="border-b border-border pb-3"><p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">{selectedCountry ? `Hoteles sugeridos en ${selectedCountry}` : "Destinos en ruta"}</p><p className="mt-1 font-serif text-2xl">{destinations.length} lugares para empezar</p></div>{destinations.length === 0 && <p className="border border-dashed border-border p-4 text-xs text-muted-foreground">Aún no hay destinos mock para esta región.</p>}{destinations.map((destination) => <button key={destination.id} type="button" onClick={() => { console.info("[Aleca Travel] Destino seleccionado", { id: destination.id, name: destination.name, lat: destination.lat, lng: destination.lng }); onSelect(destination); onOpenDetails(); }} className="glass group flex items-center gap-3 p-3 text-left transition-transform hover:-translate-y-0.5"><span className="h-12 w-12 shrink-0 bg-muted" style={{ backgroundImage: `url(${destination.image})`, backgroundPosition: "center", backgroundSize: "cover" }} aria-hidden="true" /><span className="min-w-0 flex-1"><span className="block text-sm font-semibold">{destination.name}</span><span className="mt-1 block truncate text-xs text-muted-foreground">{destination.landmark} · {destination.points} pts VIP</span></span><ArrowUpRight className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" /></button>)}</div></div>
  </div>;
}

export default OrthogonalWorldMap;
