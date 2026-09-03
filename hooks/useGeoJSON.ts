"use client";

import { useEffect, useState } from "react";

export type GeoJSONPosition = [number, number];
export type GeoJSONGeometry = { type: "Polygon" | "MultiPolygon"; coordinates: GeoJSONPosition[][] | GeoJSONPosition[][][] };
export type GeoJSONFeature = { type: "Feature"; properties?: { name?: string; iso_a2?: string; center?: [number, number] }; geometry: GeoJSONGeometry };
export type GeoJSONFeatureCollection = { type: "FeatureCollection"; features: GeoJSONFeature[] };

type GeoJSONState = { data: GeoJSONFeatureCollection | null; loading: boolean; error: string | null };

export function useGeoJSON(url = "/countries.geojson"): GeoJSONState {
  const [state, setState] = useState<GeoJSONState>({ data: null, loading: true, error: null });

  useEffect(() => {
    const controller = new AbortController();
    fetch(url, { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error(`GeoJSON request failed: ${response.status}`);
        return response.json() as Promise<GeoJSONFeatureCollection>;
      })
      .then((data) => setState({ data, loading: false, error: null }))
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === "AbortError") return;
        setState({ data: null, loading: false, error: error instanceof Error ? error.message : "No se pudo cargar el mapa" });
      });
    return () => controller.abort();
  }, [url]);

  return state;
}