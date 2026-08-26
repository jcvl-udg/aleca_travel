# Aleca Travel: contexto operativo para agentes

## 1. Estado del proyecto

- Next.js `16.2.4`, React `19.2.4`, TypeScript, Tailwind CSS `4`, Framer Motion, Lucide, `react-globe.gl` y Three.js.
- App Router. Ruta activa: `/`.
- Idioma de interfaz: español.
- Producto: agencia de viajes premium con exploración de destinos, pasaporte VIP y dashboard de cliente.
- Objetivo de producto: convertir prospectos en solicitudes personalizadas con una ruta rápida y ofrecer exploración inmersiva como capa de descubrimiento, no como requisito para reservar.
- Identidad actual: editorial, cartográfica y viajera. No reintroducir estética SaaS/tech, neón, glassmorphism dominante ni fondos negros por defecto.
- Lema/metadata actual: `Aleca Travel — Viajar es Recordar`.

## 2. Estructura

```text
app/
  globals.css       # Tokens, temas, utilidades y estilos globales
  layout.tsx        # Root layout, fuentes, metadata, viewport
  page.tsx          # Composición de la home
components/
  hero.tsx          # Hero, selección de destino, foco, drawer y filtros
  travel-globe.tsx  # Globo Three.js/react-globe.gl, arcos, pines y POI
  travel-map.tsx    # Vista 2D editorial, regiones, pins y lista de destinos
  travel-search.tsx # Vista de búsqueda simple y resultados filtrados
  view-mode-selector.tsx # Selector superior Globo/Mapa/Buscar
  destination-scene.tsx # Escena reactiva compartida: hito, viajero y cuaderno
  site-nav.tsx      # Navegación, selector Atlas/Globo, claro/oscuro, puntos
  search-panel.tsx  # Formulario visual de búsqueda
  globe-filter.tsx  # Filtros Todos/Mis viajes/Deseados
  passport-section.tsx # Sellos y progreso VIP
  dashboard/UserDashboard.tsx # Vista CLIENT/AGENT
  navigation/MobileBottomNav.tsx # Navegación inferior móvil
  pdp/DestinationBottomDrawer.tsx # Detalle y solicitud de itinerario
hooks/
  use-globe-capability.ts # Gate de hardware, ahorro de datos y movimiento reducido
lib/
  destinations.ts   # Tipos, origen y destinos mock
  mock-db.ts        # Tipos y usuarios mock
public/destinations/ # Imágenes locales de destinos
```

## 3. Flujo principal

`app/page.tsx` compone:

1. `SiteNav`
2. `Hero` dentro de `#destinos`
3. `PassportSection` dentro de `#pasaporte`
4. `UserDashboard` dentro de `#vip`
5. footer y `MobileBottomNav`

`Hero` mantiene estos estados:

- `view`: `globe | map | search`.
- `filter`: `all | visited | target`.
- `selected`: destino enfocado.
- `focusCoords`: coordenadas usadas por el globo.
- `isDrawerOpen`: detalle del destino.
- `wordIndex`: rotación del mensaje editorial.

Al seleccionar un pin: se enfoca el globo, aparece la vista de destino y se puede abrir `DestinationBottomDrawer`. Al cerrar, se restaura la vista general. No romper este contrato al cambiar UI.

La exploración usa tres vistas hermanas dentro de `Hero`:

- `globe`: no contiene `SearchPanel`; solo explora el planeta, filtros, escena reactiva y cuaderno.
- `globe`: conserva `TravelGlobe` para descubrimiento espacial 3D y navegación por coordenadas.
- `map`: `TravelMap` ofrece mapa editorial cenital/2.5D, `Mapa completo` y regiones `Las Américas`, `Europa`, `Asia` y `África y Oriente`; seleccionar un destino lleva primero a `DestinationScene`.
- `search`: `TravelSearch` es la única vista con búsqueda; filtra por nombre, país, hito o descripción. Seleccionar un resultado lleva primero a `DestinationScene`.

`ViewModeSelector` controla el modo con un selector superior. Mantenerlo como estado local de `Hero`, no como rutas separadas, hasta que exista una necesidad real de deep-linking o SEO por modo.

La vista inicial es `search`. `use-globe-capability.ts` detecta movimiento reducido, ahorro de datos y señales básicas de hardware. No bloquea la prueba manual de Globo: muestra una advertencia y permite continuar con `globeOverride`. No cargar modelos GLTF ni WebGPU hasta validar que la interacción aporta conversión.

`DestinationScene` es una escena persistente, no un modal: tiene cielo, terreno, hito, viajero, etiqueta reactiva y botón `Cuaderno`. El botón abre `DestinationBottomDrawer` para personalizar/agendar. **Estado real:** es una ilustración CSS/DOM con perspectiva, no una escena 2.5D/3D real ni un modelo de monumento. Debe tratarse como placeholder de dirección visual.

Orden de producto: `Buscar` es la conversión primaria, `Mapa` la exploración estable y `Globo` la mejora opcional. El Globo actual usa `react-globe.gl`, que encapsula Three.js; no usa R3F, Drei ni WebGPU. El primer acceso manual muestra una advertencia para pruebas y permite continuar; la entrada por defecto sigue siendo rápida.

## 4. Estado honesto de las visualizaciones

- **Globo actual:** Three.js indirecto mediante `react-globe.gl`; textura remota, arcos, pins HTML, retícula y marcadores marinos. Todavía no incluye personaje 3D, monumentos 3D ni cámara hacia un cuaderno 3D.
- **Mapa actual:** SVG editorial con zonas, pins, ruta, brújula y perspectiva CSS en desktop. No es un mapa ortográfico 3D ni GIS.
- **Escena actual:** `DestinationScene` es CSS/DOM con perspectiva; sirve para validar jerarquía y flujo, pero no debe considerarse una escena 2.5D terminada.
- **Búsqueda actual:** filtrado local de `DESTINATIONS`; no necesita consultas mientras los datos sean mock.

## 5. Decisión técnica recomendada

### Luxury: R3F + Drei sobre Three.js

Usar React Three Fiber y Drei únicamente para una escena luxury cargada bajo demanda después de que el usuario seleccione `Globo` y acepte la advertencia. R3F compone la escena con React; Drei aporta cámara, controles, `Environment`, `Html`, `useGLTF` y utilidades. Mantener `TravelGlobe` separado de `LuxuryDestinationScene`.

```text
Hero
  SearchView                 # HTML: entrada y conversión
  RegionalMapView            # SVG/CSS o WebGL mínimo: gama media
  GlobeView
    TravelGlobe              # orientación mundial
    LuxuryDestinationScene   # R3F lazy: personaje, hito, clima
    ItineraryNotebook        # cámara/overlay dentro de la escena
```

Reglas de rendimiento:

- Cargar R3F/Drei con `next/dynamic` y `ssr: false` solo al entrar en luxury.
- Un GLB por escena, idealmente menor de 1-2 MB comprimido con Draco o Meshopt.
- Usar texturas WebP/KTX2, atlas de materiales y `dispose` al salir.
- Limitar DPR a `Math.min(devicePixelRatio, 1.5)`.
- Pausar render cuando la pestaña esté oculta o la escena no sea visible.
- Evitar postprocesado y sombras dinámicas hasta medir FPS.
- Preferir animaciones de cámara/estado a simulaciones físicas.
- Mantener fallback HTML, teclado, `prefers-reduced-motion` y `saveData`.

### WebGPU

No usar WebGPU en la primera escena luxury. Es apropiado para partículas masivas, iluminación avanzada o postprocesado, pero añade riesgo de compatibilidad y complejidad. Evaluarlo después como renderer opt-in con fallback WebGL, nunca como dependencia del flujo de reserva.

### Mapa de gama media

Evolucionar el mapa a una escena ortográfica ligera, no a una segunda aplicación 3D pesada:

- cámara ortográfica fija;
- terreno por zonas de color;
- 3-5 landmarks low-poly o sprites;
- zoom limitado y pan táctil;
- transición de región mediante cámara/profundidad;
- fallback SVG actual si WebGL no está disponible.

El mapa optimiza comparación y selección. El Globo optimiza descubrimiento y emoción.

## 6. Temas visuales

El sistema visual vive en `app/globals.css` y usa atributos en `<html>`:

```html
<html data-visual-style="atlas|globe" data-theme="light|dark">
```

- `atlas`: papel, líneas de mapa, terracota, tinta, dorado y tratamiento sepia del canvas.
- `globe`: verdes salvia, océano natural y tratamiento más contemporáneo/editorial.
- `TravelGlobe` en `atlas` activa una retícula de paralelos/meridianos, filtros cálidos y dos avistamientos marinos decorativos; son HTML ligero, no modelos 3D pesados.
- `TravelMap` usa una proyección editorial SVG con perspectiva cenital CSS en desktop y plano táctil en móvil; no es GIS ni WebGL.
- `light` y `dark`: cambian los tokens CSS sin duplicar componentes.
- `SiteNav` persiste preferencias con `localStorage`:
  - `aleca-style`
  - `aleca-theme`
- Al cambiar estilo se emite `CustomEvent("visual-theme-change")`; `TravelGlobe` actualiza textura y atmósfera.
- Clases globales reutilizadas: `glass`, `glass-strong`, `glow-primary`, `glow-emerald`, `glow-cyan`, `glow-gold`, `text-glow-primary`, `bg-aurora`.
- Preferir variables CSS (`--background`, `--foreground`, `--primary`, `--muted`, `--border`, `--accent-gold`) sobre colores hardcodeados.
- Mantener contraste AA, foco visible, botones con `aria-label`/`aria-pressed` y soporte `prefers-reduced-motion`.

## 7. Datos y contratos

`lib/destinations.ts`:

```ts
type DestinationStatus = "visited" | "target";
type Destination = {
  id: string;
  name: string;
  country: string;
  lat: number;
  lng: number;
  status: DestinationStatus;
  rating: number;
  price: number;
  points: number;
  image: string;
  blurb: string;
  landmark: string;
};
```

- `ORIGIN` es Ciudad de México y origina los arcos.
- Destinos actuales: París, Londres, Tokio, Cancún, Bali y El Cairo.
- Cada destino incluye `landmark`, usado en mapa, búsqueda, `DestinationScene` y WhatsApp.
- Imágenes de destino: `/destinations/*.png`.
- `mock-db.ts` define `UserSession` y usuarios CLIENT/AGENT. La home usa un cliente mock.

### Contrato futuro de escenas

No mezclar decisiones de render con `Destination`. Añadir gradualmente una configuración separada:

```ts
type DestinationScene = {
  landmark: string;
  modelUrl?: string;
  previewImage?: string;
  palette?: { sky: string; ground: string; accent: string };
  poi?: { id: string; label: string; kind: "landmark" | "experience" | "weather" }[];
};
```

El backend entrega contenido/configuración; la UI decide la representación. Siempre debe existir `previewImage` o fallback HTML.

## 8. Reglas de implementación

- Leer `AGENTS.md` antes de modificar Next.js. Esta versión puede diferir de documentación conocida; consultar `node_modules/next/dist/docs/` cuando el cambio afecte APIs o estructura.
- Mantener Server Components por defecto; usar `"use client"` solo donde exista estado, evento, browser API o animación interactiva.
- Conservar alias `@/*`, TypeScript estricto y la estructura actual salvo necesidad clara.
- No crear una nueva abstracción visual si puede resolverse con tokens existentes.
- Usar `next/image` para imágenes nuevas; evitar añadir `<img>`.
- No añadir dependencias sin necesidad y no modificar datos mock para resolver problemas visuales.
- Los comentarios deben explicar decisiones no obvias, no narrar operaciones triviales.
- Validar cambios con lint y build; para UI, verificar desktop/móvil y ambos tratamientos visuales.
- La conversión rápida usa `DestinationBottomDrawer`: resultado → itinerario → solicitud mock → WhatsApp prellenado. Sustituir el evento `travel-request` por `POST /api/travel-requests` cuando exista backend; no acoplar la UI a una base de datos.
- `MobileBottomNav` se oculta al bajar, reaparece al subir y ofrece una zona inferior de pulsación prolongada para recuperarla cuando queda oculta.

## 9. Plan recomendado

1. Medir conversión, tiempo hasta primer resultado, abandono del drawer, FPS, LCP, CLS, memoria y peso de assets.
2. Completar `Search` como ruta principal: formulario controlado para destino, fechas y viajeros, resumen de solicitud y un CTA principal.
3. Sustituir `travel-request` mock por `POST /api/travel-requests` con validación de schema y persistencia; conservar WhatsApp como salida secundaria.
4. Crear una única escena luxury piloto con R3F/Drei: personaje low-poly, un landmark, tres POI y transición de cámara hacia el cuaderno.
5. Crear una única región map low-end con cámara ortográfica, tres landmarks y controles táctiles; medir en un teléfono real de gama media.
6. Registrar `view_opened`, `destination_selected`, `scene_loaded`, `notebook_opened`, `request_submitted` y `whatsapp_clicked`, sin datos personales innecesarios.
7. A/B testear Search sin escena, Search con preview 2.5D y Search con luxury opt-in; mantener 3D solo si mejora conversión o retención.

## 10. Pruebas mínimas

- Desktop y viewport móvil real/emulado.
- Search funciona sin montar ningún renderer 3D.
- Map mantiene selección, región y retorno al destino.
- Globe muestra advertencia, permite opt-in y conserva fallback.
- La escena no impide cerrar, volver o abrir el cuaderno.
- DevTools Performance: FPS sostenido, memoria, red y tiempo de interacción.
- `prefers-reduced-motion`, `saveData`, teclado, foco y lector de pantalla.

## 11. Comandos

```powershell
npm run dev
npm run lint
npm run build
```

Preview local: `http://localhost:3000`.

## 12. Estado de validación y pendientes

- `npm run build`: correcto.
- `npm run lint`: correcto con 4 warnings existentes:
  - `UserDashboard.tsx`: parámetro `user` sin usar en `AgentView`.
  - `hero.tsx`: tres `<img>` en collage de foco; migrar a `next/image` cuando se trabaje esa vista.
- Pendiente menor: al restaurar preferencias desde `localStorage`, el documento adopta el tema guardado pero el estado visual inicial de los botones de `SiteNav` parte de `atlas/light`; corregir con una inicialización SSR-safe si se necesita reflejo exacto desde el primer render.
- Las texturas del globo provienen de URLs remotas de `unpkg`; considerar alojarlas localmente o definir fallback antes de producción.
- `DestinationScene` sigue siendo un placeholder CSS/DOM; la siguiente iteración 3D debe validar primero una escena piloto, no modelar todos los destinos.
