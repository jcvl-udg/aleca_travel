"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import * as THREE from "three";
import { geoEqualEarth, type GeoProjection } from "d3-geo";
import { useMemo, useEffect, useState } from "react";

export interface GeoJSONFeature {
  type: string;
  properties?: Record<string, unknown>;
  geometry: {
    type: "Polygon" | "MultiPolygon" | string;
    coordinates: number[][][] | number[][][][];
  };
}

function CountryMesh({ 
  feature, 
  projection,
  isSelected,
  onSelect 
}: { 
  feature: GeoJSONFeature; 
  projection: GeoProjection;
  isSelected: boolean;
  onSelect: (name: string) => void;
}) {
  const [hovered, setHovered] = useState(false);

  // Aumentamos un poco la profundidad para que el efecto lateral sea obvio
  const EXTRUDE_DEPTH = isSelected ? 2.5 : 0.8;

  const { shapeGeometry, lines } = useMemo(() => {
    if (!feature.geometry || !feature.geometry.coordinates) return {};

    const isMultiPolygon = feature.geometry.type === "MultiPolygon";
    const polygons = (isMultiPolygon 
      ? feature.geometry.coordinates 
      : [feature.geometry.coordinates]) as number[][][][];
    
    const shapes: THREE.Shape[] = [];
    const countryLines: THREE.Line[] = [];

    polygons.forEach((polygon) => {
      const outerRing = polygon[0]; 
      if (!outerRing || outerRing.length < 3) return;

      const shape = new THREE.Shape();
      const ringPoints: THREE.Vector3[] = [];
      let hasValidPoints = false;

      outerRing.forEach((pos) => {
        const point = projection(pos as [number, number]);
        
        if (point && !isNaN(point[0]) && !isNaN(point[1])) {
          const x = point[0];
          const y = -point[1];

          // Subimos la línea justo encima de la extrusión
          ringPoints.push(new THREE.Vector3(x, y, EXTRUDE_DEPTH + 0.05));

          if (!hasValidPoints) {
            shape.moveTo(x, y);
            hasValidPoints = true;
          } else {
            shape.lineTo(x, y);
          }
        }
      });

      if (hasValidPoints) shapes.push(shape);

      if (ringPoints.length > 1) {
        const lineGeom = new THREE.BufferGeometry().setFromPoints(ringPoints);
        // Línea más clara para que resalte sobre el modelo
        const lineMat = new THREE.LineBasicMaterial({ color: "#ffffff", opacity: 0.3, transparent: true });
        countryLines.push(new THREE.Line(lineGeom, lineMat));
      }
    });

    // Añadimos un pequeño bisel (bevel) para que los bordes atrapen la luz
    const extrudeSettings = {
      depth: EXTRUDE_DEPTH,
      bevelEnabled: true, 
      bevelSegments: 1,
      steps: 1,
      bevelSize: 0.05,
      bevelThickness: 0.05
    };
    
    const shapeGeom = shapes.length > 0 ? new THREE.ExtrudeGeometry(shapes, extrudeSettings) : null;
    return { shapeGeometry: shapeGeom, lines: countryLines };
  }, [feature, projection, EXTRUDE_DEPTH]);

  if (!shapeGeometry) return null;

  return (
    <group>
      <mesh 
        geometry={shapeGeometry}
        castShadow // Importante para que el volumen proyecte sombra
        receiveShadow
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={(e) => {
          e.stopPropagation();
          setHovered(false);
          document.body.style.cursor = 'auto';
        }}
        onClick={(e) => {
          e.stopPropagation();
          const name = String(feature.properties?.ADMIN || feature.properties?.name || "Desconocido");
          onSelect(name);
        }}
      >
        <meshStandardMaterial 
          color={isSelected ? "#ff7e67" : hovered ? "#f2d3b3" : "#d4a373"} 
          roughness={0.4} // Menos rugosidad para que parezca material premium (como cerámica)
          metalness={0.1}
        />
      </mesh>
      
      {lines && lines.map((lineObj, idx) => (
        <primitive key={idx} object={lineObj} />
      ))}
    </group>
  );
}

function ExtrudedWorld({ features, selectedCountry, onSelectCountry }: { features: GeoJSONFeature[], selectedCountry: string, onSelectCountry: (name: string) => void }) {
  const MAP_WIDTH = 30;
  const MAP_HEIGHT = 15;

  const projection = useMemo(() => {
    type D3GeoType = Parameters<ReturnType<typeof geoEqualEarth>["fitSize"]>[1];
    const featureCollection = { type: "FeatureCollection", features } as unknown as D3GeoType;
    return geoEqualEarth().fitSize([MAP_WIDTH, MAP_HEIGHT], featureCollection);
  }, [features]);

  return (
    // MAGIA DE UX: Rotamos TODO el grupo -90 grados en el eje X
    // Esto hace que el mapa quede "acostado" como una mesa, y la extrusión crezca hacia ARRIBA.
    <group rotation={[-Math.PI / 2, 0, 0]}>
      <group position={[-MAP_WIDTH / 2, MAP_HEIGHT / 2, 0]}>
        
        {/* Base del mapa (Océano/Mesa) */}
        <mesh position={[MAP_WIDTH / 2, -MAP_HEIGHT / 2, -0.2]} receiveShadow>
          <planeGeometry args={[MAP_WIDTH * 1.5, MAP_HEIGHT * 1.5]} />
          <meshStandardMaterial color="#8ab5c2" roughness={0.9} />
        </mesh>

        {features.map((feature, i) => {
          const countryName = String(feature.properties?.ADMIN || feature.properties?.name || "");
          return (
            <CountryMesh 
              key={i} 
              feature={feature} 
              projection={projection}
              isSelected={selectedCountry === countryName}
              onSelect={onSelectCountry}
            />
          )
        })}
      </group>
    </group>
  );
}

export function OrthogonalWorldMap() {
  const [countries, setCountries] = useState<GeoJSONFeature[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCountry, setSelectedCountry] = useState<string>("Toca un destino");

  useEffect(() => {
    fetch('https://raw.githubusercontent.com/datasets/geo-countries/master/data/countries.geojson')
      .then(res => res.json())
      .then(data => {
        setCountries(data.features);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error cargando GeoJSON:", err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-[#eae4db] p-4 sm:p-10">
      
      <div className="mb-4 flex flex-col items-center z-10">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-800 text-center">
          Rutas de Viaje
        </h1>
        <div className="mt-2 rounded-full bg-white px-6 py-2 text-md font-semibold text-[#ff7e67] shadow-md transition-all duration-300">
          {selectedCountry}
        </div>
      </div>
      
      <div className="relative h-[65vh] w-full max-w-5xl overflow-hidden rounded-2xl border border-gray-300 bg-gradient-to-b from-[#e3edf0] to-[#c2dce6] shadow-2xl touch-none">
        
        {/* Activamos shadows en el Canvas */}
        <Canvas shadows>
          
          {/* Cambiamos a PerspectiveCamera, posicionada alta y en diagonal */}
          <PerspectiveCamera makeDefault position={[0, 25, 30]} fov={40} />
          
          {/* Iluminación dramática para resaltar bordes y extrusiones */}
          <ambientLight intensity={0.4} />
          <directionalLight 
            position={[15, 30, 15]} 
            intensity={1.2} 
            castShadow 
            shadow-mapSize-width={1024}
            shadow-mapSize-height={1024}
            shadow-camera-far={100}
            shadow-camera-left={-20}
            shadow-camera-right={20}
            shadow-camera-top={20}
            shadow-camera-bottom={-20}
          />
          <directionalLight position={[-15, 10, -15]} intensity={0.5} />
          
          {!loading && countries.length > 0 && (
             <ExtrudedWorld 
               features={countries} 
               selectedCountry={selectedCountry}
               onSelectCountry={setSelectedCountry} 
             />
          )}
          
          {/* Controles optimizados para la vista "mesa" */}
          <OrbitControls 
            target={[0, 0, 0]} // La cámara siempre mira al centro de la mesa
            enableRotate={true} 
            maxPolarAngle={Math.PI / 2 - 0.1} // Bloquea ir por debajo de la mesa
            minPolarAngle={0.2} // Impide vista totalmente desde arriba (arruina el 3D)
            enablePan={false} // Desactivado para que en móviles no arrastren el mapa fuera de pantalla
            enableZoom={true} 
            minDistance={15}
            maxDistance={50}
            enableDamping={true} 
            dampingFactor={0.05}
          />
        </Canvas>

        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/40 backdrop-blur-md">
            <div className="animate-pulse flex flex-col items-center">
              <div className="h-10 w-10 rounded-full border-4 border-[#ff7e67] border-t-transparent animate-spin mb-4"></div>
              <p className="font-semibold text-gray-700 text-lg">Trazando el mundo...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default OrthogonalWorldMap;