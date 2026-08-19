"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import type { GlobeMethods } from "react-globe.gl";
import { DESTINATIONS, ORIGIN, type Destination } from "@/lib/destinations";
import type { GlobeFilter } from "./globe-filter";

const Globe = dynamic(() => import("react-globe.gl"), { ssr: false });

const CHECK_SVG = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
const POI_SVG = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>`;

type Props = {
  filter: GlobeFilter;
  onSelect: (d: Destination) => void;
  focusCoords?: { lat: number; lng: number } | null;
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

export default function TravelGlobe({ filter, onSelect, focusCoords, selectedDestination }: Props) {
  const globeRef = useRef<GlobeMethods | undefined>(undefined);
  const containerRef = useRef<HTMLDivElement>(null);
  const onSelectRef = useRef(onSelect);
  const [size, setSize] = useState({ width: 0, height: 0 });
  const [ready, setReady] = useState(false);

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
    return elements;
  }, [visibleDestinations, selectedDestination]);

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

  useEffect(() => {
    if (!ready || !globeRef.current) return;
    const globe = globeRef.current;
    const controls = globe.controls();
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.55;
    controls.enableZoom = true;
    controls.minPolarAngle = Math.PI / 5;
    controls.maxPolarAngle = Math.PI - Math.PI / 5;
    globe.pointOfView({ lat: 18, lng: -35, altitude: 2.3 }, 0);
  }, [ready]);

  useEffect(() => {
    if (!ready || !globeRef.current) return;
    const globe = globeRef.current;
    const controls = globe.controls();

    if (focusCoords) {
      controls.autoRotate = false; 
      globe.pointOfView(
        { lat: focusCoords.lat, lng: focusCoords.lng, altitude: 0.65 }, 
        1800 
      );
    } else {
      controls.autoRotate = true; 
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
      {size.width > 0 && (
        <Globe
          ref={globeRef}
          width={size.width}
          height={size.height}
          onGlobeReady={() => setReady(true)}
          backgroundColor="rgba(0,0,0,0)"
          globeImageUrl="//unpkg.com/three-globe/example/img/earth-night.jpg"
          bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
          atmosphereColor="#1dbbf4"
          atmosphereAltitude={0.28}
          
          arcsData={arcs}
          arcStartLat={(d: object) => (d as ArcData).startLat}
          arcStartLng={(d: object) => (d as ArcData).startLng}
          arcEndLat={(d: object) => (d as ArcData).endLat}
          arcEndLng={(d: object) => (d as ArcData).endLng}
          arcColor={(d: object) =>
            (d as ArcData).status === "visited"
              ? ["rgba(245,196,81,0.05)", "rgba(245,196,81,0.9)"]  
              : ["rgba(29,187,244,0.05)", "rgba(29,187,244,0.95)"] 
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
          ringColor={() => "#1dbbf4"}
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
    </div>
  );
}