"use client";

import { Html, OrbitControls, PerspectiveCamera, Float, Line, Sphere, View } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import type { RefObject } from "react";
import type { Group, PerspectiveCamera as ThreePerspectiveCamera } from "three";
import { DESTINATIONS, type Destination } from "@/lib/destinations";

type SceneMode = "map" | "globe";

type Props = {
  mode: SceneMode;
  selected?: Destination | null;
  onSelect?: (destination: Destination) => void;
};

const WORLD_POINTS: Record<string, [number, number, number]> = {
  cancun: [-2.7, 0.55, 0.15],
  paris: [-0.1, 1.55, 0.1],
  london: [-0.2, 1.75, 0.1],
  tokyo: [2.65, 1.1, 0.1],
  bali: [2.2, 0.05, 0.1],
  cairo: [0.55, 0.9, 0.12],
};

function DestinationPins({ mode, selected, onSelect }: Props) {
  const points = useMemo(
    () =>
      DESTINATIONS.map((destination) => ({
        destination,
        point:
          mode === "globe"
            ? WORLD_POINTS[destination.id]
            : ([(destination.lng / 180) * 3.9, (destination.lat / 90) * 1.45, 0.18] as [number, number, number]),
      })),
    [mode],
  );

  return (
    <>
      {points.map(({ destination, point }) => (
        <group key={destination.id} position={point} onClick={(event) => { event.stopPropagation(); console.info("[Aleca Travel] Globo: destino seleccionado", { id: destination.id, name: destination.name, lat: destination.lat, lng: destination.lng }); onSelect?.(destination); }} onPointerOver={(event) => { event.stopPropagation(); document.body.style.cursor = "pointer"; }} onPointerOut={() => { document.body.style.cursor = "default" }}>
          <mesh scale={selected?.id === destination.id ? 0.18 : 0.12}>
            <sphereGeometry args={[1, 12, 8]} />
            <meshStandardMaterial color={destination.status === "visited" ? "#b98432" : "#a95032"} emissive={destination.status === "target" ? "#a95032" : "#000000"} emissiveIntensity={0.45} />
          </mesh>
          <Html center distanceFactor={mode === "globe" ? 6 : 4} style={{ pointerEvents: "none" }}>
            <span className={`world-pin-label ${selected?.id === destination.id ? "world-pin-label--active" : ""}`}>{destination.name}</span>
          </Html>
        </group>
      ))}
    </>
  );
}

function RouteLines({ mode }: { mode: SceneMode }) {
  const routes = useMemo(() => {
    if (mode === "globe") return DESTINATIONS.map((destination) => [[0, 0, 0], WORLD_POINTS[destination.id]] as [number, number, number][]);
    return [[[-2.8, 0.1, 0.2], [-0.1, 1.45, 0.2], [2.55, 0.55, 0.2]]] as [number, number, number][][];
  }, [mode]);

  return (<>
    {routes.map((route, index) => (
      <Line key={index} points={route} color={mode === "globe" ? "#b98432" : "#a95032"} transparent opacity={0.5} lineWidth={1.2} dashed dashScale={3} dashSize={0.12} gapSize={0.08} />
    ))}
  </>);
}

function GlobeModel({ selected }: { selected?: Destination | null }) {
  const group = useRef<Group>(null);

  useFrame((_, delta) => {
    if (!group.current) return;
    const targetRotation = selected ? -(selected.lng / 180) * Math.PI : group.current.rotation.y + delta * 0.04;
    group.current.rotation.y += (targetRotation - group.current.rotation.y) * Math.min(delta * 2.4, 1);
  });

  return (
    <group ref={group} rotation={[0.15, -0.45, 0]}>
      <Sphere args={[2.05, 32, 20]}>
        <meshStandardMaterial color="#315c62" roughness={0.8} metalness={0.05} wireframe opacity={0.2} transparent />
      </Sphere>
      <Sphere args={[1.96, 32, 20]}>
        <meshStandardMaterial color="#d7e5df" roughness={1} transparent opacity={0.72} />
      </Sphere>
      {selected && <Sphere args={[2.12, 32, 20]}><meshBasicMaterial color="#a95032" wireframe transparent opacity={0.22} /></Sphere>}
    </group>
  );
}

function GlobeFocusCamera({ selected, cameraRef }: { selected?: Destination | null; cameraRef: RefObject<ThreePerspectiveCamera | null> }) {
  useFrame((_, delta) => {
    const camera = cameraRef.current;
    if (!camera) return;
    const targetZ = selected ? 6.2 : 8;
    camera.position.z += (targetZ - camera.position.z) * Math.min(delta * 2.2, 1);
  });
  return null;
}

function RoomGlobe({ selected }: { selected?: Destination | null }) {
  return <group position={[-1.18, -0.08, 0.18]}>
    <Sphere args={[0.7, 24, 16]} onClick={(event) => event.stopPropagation()}>
      <meshStandardMaterial color="#53766d" roughness={0.86} wireframe transparent opacity={0.8} />
    </Sphere>
    {selected && <Sphere args={[0.74, 24, 16]}><meshBasicMaterial color="#b98432" wireframe transparent opacity={0.24} /></Sphere>}
    {selected && <Html position={[0, -0.95, 0]} center><span className="world-room-label"><strong>{selected.name}</strong><span>Destino enfocado</span></span></Html>}
  </group>;
}

function RoomModel({ selected }: { selected?: Destination | null }) {
  return (
    <group position={[0, -0.45, 0]}>
      <Float speed={0.55} rotationIntensity={0.025} floatIntensity={0.18}>
        <group>
          <mesh position={[0, -1.02, 0]} rotation={[0, 0, 0]}>
            <boxGeometry args={[4.9, 0.12, 3.5]} />
            <meshStandardMaterial color="#a95032" roughness={0.7} metalness={0.18} />
          </mesh>
          <mesh position={[-2.35, 0.3, 0]} rotation={[0, 0, Math.PI / 2]}>
            <torusGeometry args={[1.2, 0.06, 12, 32, Math.PI]} />
            <meshStandardMaterial color="#b98432" metalness={0.6} roughness={0.35} />
          </mesh>
          <mesh position={[2.35, 0.3, 0]} rotation={[0, 0, Math.PI / 2]}>
            <torusGeometry args={[1.2, 0.06, 12, 32, Math.PI]} />
            <meshStandardMaterial color="#b98432" metalness={0.6} roughness={0.35} />
          </mesh>
        </group>
      </Float>
      <mesh position={[0, -0.7, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[4.5, 3.2]} />
        <meshStandardMaterial color="#b98432" roughness={0.9} />
      </mesh>
      <mesh position={[0, 0.8, -0.35]}>
        <boxGeometry args={[3.2, 1.8, 0.12]} />
        <meshStandardMaterial color="#d7e5df" roughness={0.8} />
      </mesh>
      <mesh position={[0, 0.72, -0.45]}>
        <boxGeometry args={[2.45, 1.25, 0.05]} />
        <meshStandardMaterial color="#53766d" emissive="#a95032" emissiveIntensity={0.12} />
      </mesh>
      <RoomGlobe selected={selected} />
      <group position={[0, 0.76, -0.52]}>
        <mesh>
          <boxGeometry args={[1.7, 0.85, 0.06]} />
          <meshStandardMaterial color="#bd8254" roughness={1} />
        </mesh>
        <mesh position={[0, 0.05, -0.05]}>
          <boxGeometry args={[0.72, 0.52, 0.08]} />
          <meshStandardMaterial color="#34545a" roughness={0.8} />
        </mesh>
        <mesh position={[-0.45, -0.22, -0.06]} rotation={[0, 0, -0.08]}>
          <boxGeometry args={[0.16, 0.16, 0.08]} />
          <meshStandardMaterial color="#a95032" emissive="#a95032" emissiveIntensity={0.25} />
        </mesh>
        <mesh position={[0.42, -0.18, -0.06]} rotation={[0, 0, 0.08]}>
          <boxGeometry args={[0.16, 0.16, 0.08]} />
          <meshStandardMaterial color="#b98432" emissive="#b98432" emissiveIntensity={0.25} />
        </mesh>
      </group>
      <Float speed={1.4} rotationIntensity={0.08} floatIntensity={0.12}>
        <mesh position={[0.95, -0.05, 0.05]} rotation={[0.05, -0.2, -0.08]} onClick={(event) => event.stopPropagation()}>
          <boxGeometry args={[0.62, 0.85, 0.12]} />
          <meshStandardMaterial color="#a95032" roughness={0.6} />
        </mesh>
      </Float>
      {selected && <Html position={[-1.4, 0.5, 0]} center>
        <div className="world-room-label"><strong>{selected.name}</strong><span>{selected.landmark} · ${selected.price}</span></div>
      </Html>}
      {selected && <Html position={[0.9, 0.35, 0.1]} center>
        <div className="world-brochure-stack" role="status">
          <strong>Folletos de {selected.name}</strong>
          <span>Hoteles · {selected.hotelDetails?.categoryName ?? "curaduría Aleca"}</span>
          <span>Actividades · próximas a confirmar</span>
        </div>
      </Html>}
    </group>
  );
}

function Scene({ mode, selected, onSelect, cameraView = "globe", cameraRef }: Props & { cameraView?: "globe" | "room"; cameraRef?: RefObject<ThreePerspectiveCamera | null> }) {
  return (
    <>
      <ambientLight intensity={1.4} />
      <directionalLight position={[3, 4, 5]} intensity={2} color="#fff6df" />
      {mode === "globe" && cameraView === "globe" && cameraRef && <><GlobeFocusCamera selected={selected} cameraRef={cameraRef} /><GlobeModel selected={selected} /></>}
      {mode === "map" && (
        <group rotation={[-0.6, 0.2, 0.15]}>
          <mesh position={[0, -0.7, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[8.3, 4.5]} />
            <meshStandardMaterial color="#e7dbc4" roughness={0.96} />
          </mesh>
          <mesh position={[0, -0.45, 0.08]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[7.1, 3.6]} />
            <meshStandardMaterial color="#53766d" transparent opacity={0.35} />
          </mesh>
          <mesh position={[0, -0.2, 0.14]} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[1.6, 2.7, 64]} />
            <meshStandardMaterial color="#c0a66b" transparent opacity={0.45} />
          </mesh>
          <mesh position={[0, -0.12, 0.18]} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[2.9, 3.4, 64]} />
            <meshStandardMaterial color="#a95032" transparent opacity={0.22} />
          </mesh>
        </group>
      )}
      {cameraView === "globe" && <RouteLines mode={mode} />}
      {cameraView === "globe" && <DestinationPins mode={mode} selected={selected} onSelect={onSelect} />}
      {mode === "globe" && cameraView === "room" && <RoomModel selected={selected} />}
    </>
  );
}

export function TravelWorldScene({ mode, selected, onSelect }: Props) {
  const globeView = useRef<HTMLDivElement>(null!);
  const roomView = useRef<HTMLDivElement>(null!);
  const globeCamera = useRef<ThreePerspectiveCamera>(null);

  if (mode === "map") {
    return (
      <div className="world-canvas world-canvas--map">
        <Canvas dpr={[1, 1.5]} camera={{ position: [0, 3.7, 7.5], fov: 30 }}>
          <Scene mode="map" selected={selected} onSelect={onSelect} />
          <OrbitControls enablePan={false} enableZoom={false} minPolarAngle={Math.PI / 3.1} maxPolarAngle={Math.PI / 2.2} />
        </Canvas>
      </div>
    );
  }

  return (
    <div className="world-canvas world-canvas--globe">
      <div ref={globeView} className="world-camera-view world-camera-view--globe" aria-label="Vista del globo 3D" />
      <div ref={roomView} className="world-camera-view world-camera-view--room" aria-label="Vista de habitación del destino" />
      <Canvas dpr={[1, 1.5]} camera={{ position: [0, 0, 8], fov: 38 }}>
        <View track={globeView}><PerspectiveCamera ref={globeCamera} makeDefault position={[0, 0, 8]} fov={38} /><Scene mode="globe" cameraView="globe" selected={selected} onSelect={onSelect} cameraRef={globeCamera} /><OrbitControls enablePan={false} /></View>
        <View track={roomView}><PerspectiveCamera makeDefault position={[0, 0.2, 5.6]} fov={42} /><Scene mode="globe" cameraView="room" selected={selected} onSelect={onSelect} /></View>
        <View.Port />
      </Canvas>
    </div>
  );
}
