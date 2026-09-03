"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import type { GlobeMethods } from "react-globe.gl";
import { DESTINATIONS, ORIGIN, type Destination } from "@/lib/destinations";
import type { GlobeFilter } from "./globe-filter";
import { useGeoJSON, type GeoJSONFeature } from "@/hooks/useGeoJSON";
import { useTravelStore } from "@/store/useTravelStore";

const Globe = dynamic(() => import("react-globe.gl"), { ssr: false });

const CHECK_SVG = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
const POI_SVG = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>`;

type Props = {
  filter: GlobeFilter;
  onSelect: (d: Destination) => void;
  focusCoords?: FocusCoordinates | null;
  selectedDestination?: Destination | null;
};

// Strict TypeScript Interfaces
interface ArcData {
  startLat: number;
  startLng: number;
  endLat: number;
  endLng: number;
  status: string;
}

interface HtmlElementData {
  id: string;
  lat: number;
  lng: number;
  name: string;
  status?: string;
  type?: string;
}

// New Strict Interface for the VFX Ring
interface RingData {
  lat: number;
  lng: number;
}

export interface FocusCoordinates {
  lat: number;
  lng: number;
  altitude?: number;
}

export default function TravelGlobe({ filter, onSelect, focusCoords, selectedDestination }: Props) {
  const globeRef = useRef<GlobeMethods | undefined>(undefined);
  const containerRef = useRef<HTMLDivElement>(null);
  const onSelectRef = useRef(onSelect);
  const [size, setSize] = useState({ width: 0, height: 0 });
  const [ready, setReady] = useState(false);
  const [visualStyle, setVisualStyle] = useState<"atlas" | "globe">("atlas");
  const [hoveredCountry, setHoveredCountry] = useState<string | null>(null);
  const { data: countries, loading: countriesLoading, error: countriesError } = useGeoJSON();
  const suggestHotelsInArea = useTravelStore((state) => state.suggestHotelsInArea);

  useEffect(() => {
    const handleVisualStyleChange = (event: Event) => {
      const nextStyle = (event as CustomEvent<{ style: "atlas" | "globe" }>).detail.style;
      setVisualStyle(nextStyle);
    };
    window.addEventListener("visual-theme-change", handleVisualStyleChange);
    return () => window.removeEventListener("visual-theme-change", handleVisualStyleChange);
  }, []);

  useEffect(() => {
    onSelectRef.current = onSelect;
  }, [onSelect]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        setSize({ width, height });
      }
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const visibleDestinations = useMemo(() => {
    if (filter === "all") return DESTINATIONS;
    return DESTINATIONS.filter((d) => d.status === filter);
  }, [filter]);

  const countryCenter = (feature: GeoJSONFeature): [number, number] => {
    if (feature.properties?.center) return feature.properties.center;
    const coordinates = feature.geometry.coordinates.flat(2) as [number, number][];
    const bounds = coordinates.reduce(([minLng, minLat, maxLng, maxLat], [lng, lat]) => [
      Math.min(minLng, lng), Math.min(minLat, lat), Math.max(maxLng, lng), Math.max(maxLat, lat),
    ], [180, 90, -180, -90]);
    return [(bounds[0] + bounds[2]) / 2, (bounds[1] + bounds[3]) / 2];
  };

  const handleCountryClick = (feature: GeoJSONFeature) => {
    const [lng, lat] = countryCenter(feature);
    suggestHotelsInArea({ label: feature.properties?.name ?? "esta región", lat, lng, radius: 50 });
  };

  const renderElements = useMemo(() => {
    const elements: HtmlElementData[] = visibleDestinations.map(d => ({
      ...d,
      type: "destination"
    }));
    
    if (selectedDestination) {
      const offsets = [
        { latOffset: 0.5, lngOffset: 0.8, label: "Helipuerto VIP", type: "poi" },
        { latOffset: -0.6, lngOffset: 0.4, label: "Reserva Marina", type: "poi" },
        { latOffset: 0.2, lngOffset: -0.9, label: "Alta Cocina", type: "poi" },
      ];
      offsets.forEach((off, i) => {
        elements.push({
          id: `poi-${selectedDestination.id}-${i}`,
          lat: selectedDestination.lat + off.latOffset,
          lng: selectedDestination.lng + off.lngOffset,
          name: off.label,
          type: off.type
        });
      });
    }

    // Folklore markers keep the atlas feeling alive without adding a heavy 3D asset pipeline.
    if (!selectedDestination && visualStyle === "atlas") {
      elements.push(
        { id: "sea-serpent-atlantic", lat: 18, lng: -42, name: "Avistamiento", type: "sea-monster" },
        { id: "sea-serpent-pacific", lat: 8, lng: -155, name: "Criatura marina", type: "sea-monster" },
      );
    }
    return elements;
  }, [visibleDestinations, selectedDestination, visualStyle]);

  const arcs: ArcData[] = useMemo(() => visibleDestinations.map((d) => ({
    startLat: ORIGIN.lat,
    startLng: ORIGIN.lng,
    endLat: d.lat,
    endLng: d.lng,
    status: d.status,
  })), [visibleDestinations]);

  // Typed VFX Rings Array
  const ringsData: RingData[] = useMemo(() => {
    return selectedDestination ? [{ lat: selectedDestination.lat, lng: selectedDestination.lng }] : [];
  }, [selectedDestination]);

  // Add a responsive altitude check
  const getResponsiveAltitude = () => {
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      return 2.8; // Zoom out slightly on mobile to see the whole globe in narrow screens
    }
    return 2.3; // Default desktop zoom
  };

  useEffect(() => {
    if (!ready || !globeRef.current) return;
    const globe = globeRef.current;
    const controls = globe.controls();
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.55;
    controls.enableZoom = true;
    controls.minPolarAngle = Math.PI / 5;
    controls.maxPolarAngle = Math.PI - Math.PI / 5;
    
    // Use responsive altitude on initial load
    globe.pointOfView({ lat: 18, lng: -35, altitude: getResponsiveAltitude() }, 0);
  }, [ready]);

  useEffect(() => {
    if (!ready || !globeRef.current) return;
    const globe = globeRef.current;
    const controls = globe.controls();

    if (focusCoords) {
      controls.autoRotate = false; 
      
      globe.pointOfView(
        { 
          lat: focusCoords.lat, 
          lng: focusCoords.lng, 
          altitude: focusCoords.altitude ?? getResponsiveAltitude() // Acceso 100% tipado
        }, 
        1000 
      );
    } else {
      controls.autoRotate = true; 
      globe.pointOfView(
        { lat: 18, lng: -35, altitude: getResponsiveAltitude() }, 
        1000 
      );
    }
  }, [focusCoords, ready]);

  const buildPin = useCallback((d: object) => {
    const data = d as HtmlElementData;
    const el = document.createElement("div");
    
    if (data.type === "poi") {
      el.className = `globe-poi text-gold opacity-80 transition-all duration-500 scale-0 animate-in zoom-in`;
      el.innerHTML = `
        <div class="flex items-center gap-1.5 bg-black/60 backdrop-blur-sm px-2 py-1 rounded-full border border-gold/30">
          <div class="w-3 h-3">${POI_SVG}</div>
          <span class="text-[9px] font-medium whitespace-nowrap">${data.name}</span>
        </div>
      `;
      setTimeout(() => { el.style.transform = 'scale(1)'; }, Math.random() * 500);
      return el;
    }

    if (data.type === "sea-monster") {
      el.className = "globe-sea-monster";
      el.innerHTML = `<span class="globe-sea-monster__tail">~</span><span class="globe-sea-monster__body">≈</span><span class="globe-sea-monster__eye">·</span>`;
      el.title = `${data.name}: leyenda del atlas`;
      return el;
    }

    el.className = `globe-pin globe-pin--${data.status}`;
    el.innerHTML = `
      <div class="globe-pin__ring"></div>
      <div class="globe-pin__dot">${data.status === "visited" ? CHECK_SVG : ""}</div>
      <div class="globe-pin__label">${data.name}</div>
    `;
    el.addEventListener("click", (e) => {
      e.stopPropagation();
      const fullDest = DESTINATIONS.find(dest => dest.id === data.id);
      if (fullDest) onSelectRef.current(fullDest);
    });
    return el;
  }, []);

  return (
    <div ref={containerRef} className="absolute inset-0">
      {!ready && (
        <div className="globe-loading absolute inset-0 z-10 flex items-center justify-center p-6" role="status" aria-live="polite">
          <div className="globe-loading__card glass-strong flex items-center gap-3 px-4 py-3">
            <span className="globe-loading__orb" aria-hidden="true" />
            <span>
              <strong className="block text-sm">Preparando el globo</strong>
              <small className="mt-0.5 block text-xs text-muted-foreground">Tu atlas aparecerá en un momento</small>
            </span>
          </div>
        </div>
      )}
      {size.width > 0 && (
        <Globe
          ref={globeRef}
          width={size.width}
          height={size.height}
          onGlobeReady={() => setReady(true)}
          backgroundColor="rgba(0,0,0,0)"
          globeImageUrl={visualStyle === "atlas" ? "//unpkg.com/three-globe/example/img/earth-blue-marble.jpg" : "//unpkg.com/three-globe/example/img/earth-day.jpg"}
          bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
          atmosphereColor={visualStyle === "atlas" ? "#a95032" : "#53766d"}
          atmosphereAltitude={0.18}
          showGraticules={visualStyle === "atlas"}

          polygonsData={countries?.features ?? []}
          polygonCapColor={(feature: object) => {
            const country = feature as GeoJSONFeature;
            return country.properties?.name === hoveredCountry ? "rgba(185,129,47,0.68)" : "rgba(169,80,50,0.3)";
          }}
          polygonSideColor={() => "rgba(83,118,109,0.18)"}
          polygonStrokeColor={() => visualStyle === "atlas" ? "#b98432" : "#53766d"}
          polygonAltitude={0.012}
          polygonLabel={(feature: object) => `<b>${(feature as GeoJSONFeature).properties?.name ?? "Región"}</b>`}
          onPolygonHover={(feature: object | null) => setHoveredCountry(feature ? ((feature as GeoJSONFeature).properties?.name ?? null) : null)}
          onPolygonClick={(feature: object) => handleCountryClick(feature as GeoJSONFeature)}
          
          arcsData={arcs}
          arcStartLat={(d: object) => (d as ArcData).startLat}
          arcStartLng={(d: object) => (d as ArcData).startLng}
          arcEndLat={(d: object) => (d as ArcData).endLat}
          arcEndLng={(d: object) => (d as ArcData).endLng}
          arcColor={(d: object) =>
            (d as ArcData).status === "visited"
              ? ["rgba(185,129,47,0.05)", "rgba(185,129,47,0.9)"]
              : ["rgba(169,80,50,0.05)", "rgba(169,80,50,0.9)"]
          }
          arcAltitudeAutoScale={0.45}
          arcStroke={0.45}
          arcDashLength={0.5}
          arcDashGap={0.22}
          arcDashAnimateTime={3200}
          
          // STRICTLY TYPED RINGS CONFIGURATION
          ringsData={ringsData}
          ringLat={(d: object) => (d as RingData).lat}
          ringLng={(d: object) => (d as RingData).lng}
          ringColor={() => visualStyle === "atlas" ? "#a95032" : "#53766d"}
          ringMaxRadius={3}
          ringPropagationSpeed={2}
          ringRepeatPeriod={800}

          htmlElementsData={renderElements}
          htmlLat={(d: object) => (d as HtmlElementData).lat}
          htmlLng={(d: object) => (d as HtmlElementData).lng}
          htmlAltitude={0.02}
          htmlElement={buildPin}
        />
      )}
      {countriesLoading && <p className="absolute bottom-5 left-5 text-xs text-muted-foreground">Cargando fronteras...</p>}
      {countriesError && <p className="absolute bottom-5 left-5 text-xs text-muted-foreground">El atlas está disponible sin fronteras detalladas.</p>}
    </div>
  );
}