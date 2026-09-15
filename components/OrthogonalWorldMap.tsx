"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, OrthographicCamera } from "@react-three/drei";
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
  onSelect 
}: { 
  feature: GeoJSONFeature; 
  projection: GeoProjection;
  onSelect: (name: string) => void;
}) {
  const [hovered, setHovered] = useState(false);

  const { shapeGeometry, lines } = useMemo(() => {
    if (!feature.geometry || !feature.geometry.coordinates) return {};

    const isMultiPolygon = feature.geometry.type === "MultiPolygon";
    const polygons = (isMultiPolygon 
      ? feature.geometry.coordinates 
      : [feature.geometry.coordinates]) as number[][][][];
    
    const shapes: THREE.Shape[] = [];
    const countryLines: THREE.Line[] = []; // Arreglo para guardar múltiples líneas

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

          ringPoints.push(new THREE.Vector3(x, y, 0.01));

          if (!hasValidPoints) {
            shape.moveTo(x, y);
            hasValidPoints = true;
          } else {
            shape.lineTo(x, y);
          }
        }
      });

      if (hasValidPoints) {
        shapes.push(shape);
      }

      // Creamos una línea INDEPENDIENTE por cada anillo (isla/polígono)
      // Así evitamos las líneas raras que cruzan el océano
      if (ringPoints.length > 1) {
        const lineGeom = new THREE.BufferGeometry().setFromPoints(ringPoints);
        // Líneas sutiles que solo marcan fronteras suavemente
        const lineMat = new THREE.LineBasicMaterial({ color: "#a3886e", opacity: 0.3, transparent: true });
        countryLines.push(new THREE.Line(lineGeom, lineMat));
      }
    });

    const shapeGeom = shapes.length > 0 ? new THREE.ShapeGeometry(shapes) : null;
    return { shapeGeometry: shapeGeom, lines: countryLines };
  }, [feature, projection]);

  if (!shapeGeometry) return null;

  return (
    <group>
      <mesh 
        geometry={shapeGeometry}
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
          const name = String(feature.properties?.ADMIN || feature.properties?.name || "País desconocido");
          onSelect(name);
        }}
      >
        <meshBasicMaterial 
          color={hovered ? "#e6ccb2" : "#c2a688"} 
          side={THREE.DoubleSide} 
        />
      </mesh>
      
      {/* Renderizamos todas las líneas correctas del país */}
      {lines && lines.map((lineObj, idx) => (
        <primitive key={idx} object={lineObj} />
      ))}
    </group>
  );
}

function TestWorld({ features, onSelectCountry }: { features: GeoJSONFeature[], onSelectCountry: (name: string) => void }) {
  const MAP_WIDTH = 30;
  const MAP_HEIGHT = 15;

  const projection = useMemo(() => {
    type D3GeoType = Parameters<ReturnType<typeof geoEqualEarth>["fitSize"]>[1];
    const featureCollection = { type: "FeatureCollection", features } as unknown as D3GeoType;
    return geoEqualEarth().fitSize([MAP_WIDTH, MAP_HEIGHT], featureCollection);
  }, [features]);

  return (
    <group position={[-MAP_WIDTH / 2, MAP_HEIGHT / 2, 0]}>
      <mesh position={[MAP_WIDTH / 2, -MAP_HEIGHT / 2, -0.1]}>
        <planeGeometry args={[MAP_WIDTH * 1.1, MAP_HEIGHT * 1.1]} />
        <meshBasicMaterial color="#a8d5e5" />
      </mesh>

      {features.map((feature, i) => (
        <CountryMesh 
          key={i} 
          feature={feature} 
          projection={projection} 
          onSelect={onSelectCountry}
        />
      ))}
    </group>
  );
}

export function OrthogonalWorldMap() {
  const [countries, setCountries] = useState<GeoJSONFeature[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCountry, setSelectedCountry] = useState<string>("Toca un país");

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
    <div className="flex h-screen w-full flex-col items-center justify-center bg-[#f4efe8] p-4 sm:p-10">
      
      <div className="mb-4 flex flex-col items-center">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-800 text-center">
          Mapa del Mundo Interactivo
        </h1>
        <div className="mt-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-md">
          {selectedCountry}
        </div>
      </div>
      
      {/* touch-none es CLAVE aquí para que en móvil no intente hacer scroll la pantalla entera */}
      <div className="relative h-[60vh] w-full max-w-4xl overflow-hidden rounded-xl border-2 border-dashed border-gray-400 bg-white shadow-lg touch-none">
        <Canvas>
          <OrthographicCamera makeDefault position={[0, 0, 50]} zoom={25} />
          
          {!loading && countries.length > 0 && (
             <TestWorld features={countries} onSelectCountry={setSelectedCountry} />
          )}
          
          {/* enableDamping={true} hace que arrastrar el mapa se sienta muy fluido en móviles */}
          <OrbitControls 
            enableRotate={false} 
            enablePan={true} 
            enableZoom={true} 
            enableDamping={true} 
            dampingFactor={0.05}
          />
        </Canvas>

        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/50 backdrop-blur-sm">
            <p className="font-semibold text-blue-600 text-lg">Cargando países...</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default OrthogonalWorldMap;