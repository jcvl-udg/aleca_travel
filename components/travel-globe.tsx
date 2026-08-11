"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import type { GlobeMethods } from "react-globe.gl";
import { DESTINATIONS, ORIGIN, type Destination } from "@/lib/destinations";
import type { GlobeFilter } from "./globe-filter";

const Globe = dynamic(() => import("react-globe.gl"), { ssr: false });

const CHECK_SVG = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>`;

type Props = {
  filter: GlobeFilter;
  onSelect: (d: Destination) => void;
};

export default function TravelGlobe({ filter, onSelect }: Props) {
  const globeRef = useRef<GlobeMethods | undefined>(undefined);
  const containerRef = useRef<HTMLDivElement>(null);
  const onSelectRef = useRef(onSelect);
  const [size, setSize] = useState({ width: 0, height: 0 });
  const [ready, setReady] = useState(false);

  useEffect(() => {
    onSelectRef.current = onSelect;
  }, [onSelect]);

  // Measure container
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

  const visible = useMemo(() => {
    if (filter === "all") return DESTINATIONS;
    return DESTINATIONS.filter((d) => d.status === filter);
  }, [filter]);

  const arcs = useMemo(
    () =>
      visible.map((d) => ({
        startLat: ORIGIN.lat,
        startLng: ORIGIN.lng,
        endLat: d.lat,
        endLng: d.lng,
        status: d.status,
      })),
    [visible],
  );

  // Configure controls & initial camera once ready
  useEffect(() => {
    if (!ready || !globeRef.current) return;
    const globe = globeRef.current;
    const controls = globe.controls();
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.55;
    controls.enableZoom = false;
    controls.minPolarAngle = Math.PI / 5;
    controls.maxPolarAngle = Math.PI - Math.PI / 5;
    globe.pointOfView({ lat: 18, lng: -35, altitude: 2.3 }, 0);
  }, [ready]);

  const buildPin = useCallback((d: object) => {
    const dest = d as Destination;
    const el = document.createElement("div");
    el.className = `globe-pin globe-pin--${dest.status}`;
    el.innerHTML = `
      <div class="globe-pin__ring"></div>
      <div class="globe-pin__dot">${dest.status === "visited" ? CHECK_SVG : ""}</div>
      <div class="globe-pin__label">${dest.name}</div>
    `;
    el.addEventListener("click", (e) => {
      e.stopPropagation();
      onSelectRef.current(dest);
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
          atmosphereColor="#10b981"
          atmosphereAltitude={0.2}
          arcsData={arcs}
          arcStartLat={(d: object) => (d as { startLat: number }).startLat}
          arcStartLng={(d: object) => (d as { startLng: number }).startLng}
          arcEndLat={(d: object) => (d as { endLat: number }).endLat}
          arcEndLng={(d: object) => (d as { endLng: number }).endLng}
          arcColor={(d: object) =>
            (d as { status: string }).status === "visited"
              ? ["rgba(245,196,81,0.05)", "rgba(245,196,81,0.9)"]
              : ["rgba(16,185,129,0.05)", "rgba(16,185,129,0.95)"]
          }
          arcAltitudeAutoScale={0.45}
          arcStroke={0.45}
          arcDashLength={0.5}
          arcDashGap={0.22}
          arcDashAnimateTime={3200}
          htmlElementsData={visible as unknown as object[]}
          htmlLat={(d: object) => (d as Destination).lat}
          htmlLng={(d: object) => (d as Destination).lng}
          htmlAltitude={0.02}
          htmlElement={buildPin}
        />
      )}
    </div>
  );
}
