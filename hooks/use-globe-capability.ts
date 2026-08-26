"use client";

import { useEffect, useState } from "react";

type CapabilityState = {
  ready: boolean;
  capable: boolean;
  reason?: string;
};

type NavigatorWithMemory = Navigator & {
  deviceMemory?: number;
  connection?: {
    saveData?: boolean;
  };
};

const INITIAL_STATE: CapabilityState = {
  ready: false,
  capable: true,
};

export function useGlobeCapability(): CapabilityState {
  const [state, setState] = useState(INITIAL_STATE);

  useEffect(() => {
    const nav = navigator as NavigatorWithMemory;
    const memory = nav.deviceMemory;
    const cores = nav.hardwareConcurrency || 2;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const saveData = Boolean(nav.connection && "saveData" in nav.connection && nav.connection.saveData);
    const coarsePointer = window.matchMedia("(pointer: coarse)").matches;

    const nextState = reducedMotion || saveData
      ? { ready: true, capable: false, reason: "Preferencias de ahorro o movimiento reducido" }
      : (memory !== undefined && memory <= 4 && cores <= 4) || (coarsePointer && memory !== undefined && memory <= 4)
        ? { ready: true, capable: false, reason: "Este dispositivo prioriza la vista rápida para conservar batería" }
        : { ready: true, capable: true };
    const commit = window.setTimeout(() => setState(nextState), 0);
    return () => window.clearTimeout(commit);
  }, []);

  return state;
}
