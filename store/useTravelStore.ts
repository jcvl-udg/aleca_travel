"use client";

import { create } from "zustand";
import type { Destination } from "@/lib/destinations";

export type ExplorationView = "globe" | "map" | "search";
export type TravelFilter = "all" | "visited" | "target";

export type FocusCoordinates = {
  lat: number;
  lng: number;
  altitude?: number;
};

export type HotelSearchArea = {
  label: string;
  lat: number;
  lng: number;
  radius: number;
};

type TravelStore = {
  view: ExplorationView;
  filter: TravelFilter;
  selectedDestination: Destination | null;
  focusCoords: FocusCoordinates | null;
  hotelSearchArea: HotelSearchArea | null;
  setView: (view: ExplorationView) => void;
  setFilter: (filter: TravelFilter) => void;
  selectDestination: (destination: Destination | null) => void;
  setFocusCoords: (coordinates: FocusCoordinates | null) => void;
  suggestHotelsInArea: (area: HotelSearchArea) => void;
  clearSelection: () => void;
};

export const useTravelStore = create<TravelStore>((set) => ({
  view: "search",
  filter: "all",
  selectedDestination: null,
  focusCoords: null,
  hotelSearchArea: null,
  setView: (view) => set({ view }),
  setFilter: (filter) => set({ filter }),
  selectDestination: (selectedDestination) =>
    set({
      selectedDestination,
      focusCoords: selectedDestination
        ? { lat: selectedDestination.lat, lng: selectedDestination.lng }
        : null,
    }),
  setFocusCoords: (focusCoords) => set({ focusCoords }),
  suggestHotelsInArea: (hotelSearchArea) => set({ hotelSearchArea, focusCoords: hotelSearchArea }),
  clearSelection: () => set({ selectedDestination: null, focusCoords: null }),
}));