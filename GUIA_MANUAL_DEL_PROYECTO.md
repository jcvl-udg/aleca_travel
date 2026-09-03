## 14. Fases completadas y GeoJSON

La Fase 1 centralizó el estado de exploración en `store/useTravelStore.ts` con Zustand y dejó las vistas pesadas como imports dinámicos en `Hero`.

La Fase 2 convirtió `components/travel-search.tsx` en un formulario progresivo: destino, fechas y viajeros. `components/travel-search.test.tsx` verifica que el primer clic expande el campo de destino. Ejecutar `npm test`.

La Fase 3 añade `hooks/useGeoJSON.ts`, `public/countries.geojson`, polígonos interactivos en `components/travel-globe.tsx` y `hotelSearchArea` en el store. El click de un país conserva `label`, `lat`, `lng` y un radio de 50 km para la futura búsqueda Hotelbeds.

La Fase 4 añade `components/OrthogonalWorldMap.tsx` y sustituye la vista `TravelMap` en `Hero`. La escena carga bajo demanda con `next/dynamic`, usa `Canvas`, `OrthographicCamera`, `d3-geo` para proyectar coordenadas y `ExtrudeGeometry` + `Edges` para cada país. Hover resalta el país; click selecciona su región, hace pan suave hacia el centro y actualiza `hotelSearchArea`.

El globo con GeoJSON sigue aislado: `Hero` monta actualmente `TravelWorldScene`, no `TravelGlobe`. Para mostrarlo en la home hay que decidir si reemplaza el canvas actual o si se presenta como vista de orientación separada.

El archivo GeoJSON incluido es un dataset local simplificado para validar el contrato. En producción debe sustituirse por fronteras completas y revisarse su tamaño, simplificación geométrica y licencia.

## 15. Como continuar manualmente
## 16. Comandos de trabajo
# Aleca Travel: guia manual del proyecto

Este documento explica el estado real del proyecto para poder construirlo y depurarlo manualmente. Describe lo que existe hoy, no una arquitectura futura.

## 1. Resumen rapido

Aleca Travel es una pagina Next.js con App Router para explorar destinos y preparar una pre-reserva.

La pantalla activa es `/`, compuesta por:

```text
app/page.tsx
  SiteNav
  Hero
    ViewModeSelector
    TravelSearch       <- flujo principal actual, phone-first
    TravelMap
    TravelWorldScene
    DestinationBottomDrawer
  MobileBottomNav
```

La vista inicial de `Hero` es `search`.

## 2. Dependencias principales

Las dependencias de `package.json` cumplen estas funciones:

- `next`: framework, App Router, build y servidor.
- `react` / `react-dom`: componentes y estado.
- `typescript`: tipos estrictos.
- `tailwindcss` y `@tailwindcss/postcss`: estilos utilitarios.
- `framer-motion`: animaciones de Hero y drawer.
- `lucide-react`: iconos.
- `three`, `@react-three/fiber`, `@react-three/drei`: base 3D instalada.
- `react-globe.gl`: globo alternativo instalado.

Estado importante: la búsqueda de hoteles usa datos mock locales. El detalle de hotel puede consultar actividades mediante `POST /api/activities`; esa ruta firma Hotelbeds en servidor cuando existen credenciales.

La consulta de actividades está protegida por `NEXT_PUBLIC_HOTELBEDS_ACTIVITIES_ENABLED`. Debe estar en `true` solo cuando también existan `HOTELBEDS_API_KEY` y `HOTELBEDS_SECRET`; `.env.example` muestra la configuración. Con el flag apagado no se genera ningún request ni `503` en consola.

## 3. Punto de entrada y composición

### `app/layout.tsx`

Es el layout raíz. Define:

- idioma `es`;
- metadata de Aleca Travel;
- fuentes de Next: Geist, Fraunces y Cormorant Garamond;
- `app/globals.css`;
- variables de fuente disponibles para Tailwind.

No contiene lógica de negocio.

### `app/page.tsx`

Monta la pagina principal con la navegación, el buscador y el footer.

Orden visual:

1. `SiteNav`.
2. `Hero`, dentro de `#destinos`.
3. Footer.
4. `MobileBottomNav`.

El pasaporte digital y el dashboard no se montan actualmente en la home: quedan fuera del camino de conversión porque no ayudan a preparar una pre-reserva hotelera.

## 4. Flujo de exploracion en `Hero`

Archivo: `components/hero.tsx`.

`Hero` es el coordinador de las vistas. Mantiene estos estados:

- `view`: `search`, `map` o `globe`.
- `selected`: destino u hotel seleccionado.
- `isDrawerOpen`: visibilidad del drawer.
- `showGlobeWarning`: advertencia antes de abrir el globo.
- `globeOverride`: permite probar el globo aunque el dispositivo no sea recomendado.
- `section`: `explore` o `passport`; evita montar el canvas del globo detrás de la vista de logros.
- `selected`: destino/hotel abierto en detalle. Search y Map no se desmontan mientras el drawer está abierto; se ocultan visualmente para conservar su estado.

Cuando un componente llama `onSelect(destination)`:

1. `Hero` guarda el objeto en `selected`.
2. La escena puede enfocar sus coordenadas `lat` y `lng`.
3. El componente llama `onOpenDetails()`.
4. `Hero` muestra `DestinationBottomDrawer`.

Este contrato es compartido por `TravelSearch`, `TravelMap` y `TravelWorldScene`. Si se cambia el tipo de objeto seleccionado, hay que conservar al menos el contrato `Destination`.

La navegación inferior y los enlaces de escritorio no usan anclas independientes. Ambos emiten `exploration-navigation` hacia `Hero`; `Destinos` activa `map`, `Explorar` activa `search` y `Pasaporte` activa la vista de badges. `Hero` emite `exploration-view-change` para que el selector superior y el bottom nav reflejen esos cambios.

Cuando `activeView` es `globe`, `Hero` emite `immersive-mode-change`: se ocultan el logo/nav superior, el bottom nav y el selector de tres vistas. `Escape` devuelve a `Buscar`.

## 5. Flujo phone-first de busqueda simulado

Archivo principal: `components/travel-search.tsx`.

### Camino feliz actual de tres clics

1. Pulsar `Simular búsqueda Mallorca`.
   - Cambia el destino a `Majorca`.
   - Selecciona `15–16 marzo 2019`.
   - Deja `2` viajeros y tipo `Pareja`.
   - Activa `hasSearched`.
   - Muestra las tarjetas de Hotelbeds mock.

2. En una tarjeta, seleccionar habitación y tarifa si hace falta y pulsar `Ver detalle`.
   - La tarjeta conserva una única tarifa elegida.
   - `TravelSearch` crea una copia del hotel con esa tarifa en `hotelDetails.rates[0]`.
   - Pasa el hotel a `Hero`.
   - Se abre `DestinationBottomDrawer`.

3. Pulsar `Pre-reserva enviada al agente`.
   - Se emite el evento de navegador `travel-request`.
   - Se prepara una vista de confirmación.
   - La vista ofrece un enlace de WhatsApp con hotel, habitación, régimen, precio y `rateKey`.

La selección de una tarifa no hace una llamada al proveedor. Solo cambia estado React local.

En las tarjetas se muestra una tarifa recomendada. Las demás permanecen ocultas hasta pulsar `Ver alternativas`, lo que evita listas repetidas y reduce fricción visual. La barra de resultados conserva la lupa, el destino editable, el botón `Buscar` y `Filtros` mientras el usuario recorre el listado.

Al abrir el detalle de un hotel, el drawer intenta consultar actividades opcionales con `POST /api/activities`. La ruta usa el código de destino de Hotelbeds (`PMI` para Majorca) y firma la petición en servidor. Para habilitar el entorno de pruebas hay que definir `HOTELBEDS_API_KEY` y `HOTELBEDS_SECRET` en `.env.local`. Sin credenciales, el estado visible es que todavía no hay actividades confirmadas; no se reutilizan actividades del mock de Fiji para Mallorca.

### Busqueda manual

El formulario permite escribir una consulta. Al pulsar `Buscar ruta ideal`:

- se marca `hasSearched`;
- se muestran resultados hoteleros filtrados si la consulta coincide;
- no se abre automáticamente el drawer.

Los hoteles se filtran por:

- nombre;
- país;
- zona;
- destino (`Majorca`);
- categoría.

Por eso consultas como `Majorca`, `Palma`, `Portals`, `Lindner` y `NH` funcionan cuando corresponden a los datos mock.

### Observacion UX actual

La búsqueda hotelera es ahora el único resultado de esta vista. Al pulsar `Buscar hoteles` o `Simular búsqueda Mallorca`, el formulario se colapsa y sus criterios quedan en una barra sticky bajo la navegación fija. La barra permite escribir otro destino, pulsar `Buscar` o abrir `Filtros` desde cualquier punto del listado. Debajo aparecen inmediatamente las tarjetas de hoteles. Los paquetes curados, destinos editoriales fijos y el pasaporte no forman parte de este camino.

La vista Globo mantiene un solo `Canvas` con dos cámaras: una para orientación mundial y otra para la habitación. `Hero` carga `TravelWorldScene` dinámicamente solo en cliente (`next/dynamic`, `ssr: false`), así que Search no paga el coste inicial del renderer. La cámara secundaria presenta una cabina flotante, un tablero de corcho y un pasaporte visual con sellos iniciales. Es una base 3D funcional para añadir landmarks, POI y objetos interactivos progresivamente.

## 6. De donde salen los hoteles

### `lib/mock-hotels.ts`

Contiene `MOCK_HOTELS`, un objeto estático que imita la respuesta JSON de Hotelbeds.

Incluye, entre otros datos:

- hoteles de Majorca con código `PMI`;
- código y nombre del hotel;
- categoría y estrellas;
- latitud, longitud y zona;
- habitaciones;
- múltiples tarifas por habitación;
- `net` y, en algunas tarifas, `sellingRate`;
- régimen `BB`, `HB`, `SC`;
- `paymentType` como `AT_WEB` o `AT_HOTEL`;
- políticas de cancelación;
- `rateKey`.

Este archivo no ejecuta nada. Solo exporta datos.

### `lib/hotelbeds-types.ts`

Define los tipos de la respuesta externa:

- `HotelbedsRawResponse`;
- `HotelbedsRawHotel`;
- `HotelbedsRoom`;
- `HotelbedsRate`;
- `HotelbedsCancellationPolicy`.

Si en el futuro se conecta una API real, este es el contrato del payload que debe validarse en el borde de la aplicación. Los tipos de TypeScript por sí solos no validan JSON recibido en runtime.

### `lib/destinations.ts`

Contiene dos responsabilidades:

1. Los destinos editoriales originales de la aplicación en `DESTINATIONS`.
2. El adaptador de hoteles hacia el contrato común `Destination`.

Funciones relevantes:

- `mapHotelToDestination(hotel)` transforma un hotel individual.
- `adaptPostmanHotelsResponse(response)` transforma la lista completa.

El adaptador:

- usa `hotel.code` como `id` string;
- usa país `España`;
- convierte latitud y longitud a número;
- usa `zoneName` como `landmark`;
- calcula una valoración aproximada desde `categoryCode`;
- usa `sellingRate` y cae a `net` si no existe;
- mantiene habitaciones y tarifas en `hotelDetails`;
- calcula etiqueta de cancelación y fecha límite;
- conserva `rateKey`.

## 7. Forma de los datos adaptados

Un destino editorial normal tiene:

```ts
{
  id,
  name,
  country,
  lat,
  lng,
  status,
  rating,
  price,
  points,
  image,
  blurb,
  landmark,
  vibe,
  duration,
  bestFor
}
```

Un hotel adaptado tiene además:

```ts
hotelDetails: {
  categoryCode,
  categoryName,
  zoneName,
  destinationName,
  currency,
  rates: [
    {
      roomCode,
      roomName,
      rateKey,
      rateClass,
      boardName,
      paymentType,
      net,
      sellingRate,
      cancellationLabel,
      cancellationDate
    }
  ]
}
```

La tarjeta trabaja con todas las tarifas. El drawer recibe una sola tarifa en `rates[0]`, que representa la opción elegida por el usuario.

## 8. Drawer y envio al agente

Archivo: `components/pdp/DestinationBottomDrawer.tsx`.

El drawer recibe:

```ts
{
  destination: Destination,
  onClose: () => void
}
```

Si existe `destination.hotelDetails`, toma `hotelDetails.rates[0]` como tarifa seleccionada y muestra:

- nombre del hotel;
- país y zona;
- habitación y código;
- régimen;
- forma de pago;
- precio neto;
- precio de venta;
- política de cancelación;
- fecha límite si existe.

Al pulsar el CTA se emite:

```ts
window.dispatchEvent(new CustomEvent("travel-request", {
  detail: {
    destinationId,
    destinationName,
    rateKey,
    boardName,
    roomCode,
    sellingRate
  }
}))
```

Actualmente no existe un listener que persista este evento en una base de datos. El evento es una simulación del futuro envío al agente.

WhatsApp se construye con `wa.me` y un texto URL-encoded. Es una salida secundaria y no confirma una reserva real.

## 9. Paquetes curados

Archivo: `lib/trip-packages.ts`.

`TRAVEL_PACKAGES` es una lista estática de paquetes para París, Tokio y Bali. Cada paquete contiene:

- hotel;
- vuelo;
- experiencias;
- inclusiones;
- noches;
- precio total;
- puntuación y resumen.

Los paquetes no se muestran en el `TravelSearch` activo. Se conservan como datos para una futura vista de viaje completo. Al pulsar un paquete en la implementación histórica:

1. se actualiza `selectedPackageId`;
2. se actualiza el panel de paquete activo;
3. se pueden editar textos locales de habitación, cabina y experiencia;
4. no se realiza una llamada API;
5. no se abre el drawer de Hotelbeds.

El botón `Reservar` del panel cambia entre estado de selección y pago visual. `Confirmar pago` todavía no integra una pasarela.

Recomendación: no mezclar estos paquetes con la pre-reserva de Mallorca hasta definir una decisión de producto clara: hotel simple o viaje completo.

## 10. Hooks y efectos

### `hooks/use-globe-capability.ts`

Este es el único hook de lógica de capacidad. No llama a ninguna API de viajes.

Al montarse, revisa en el navegador:

- `prefers-reduced-motion`;
- `navigator.connection.saveData`;
- `navigator.deviceMemory`;
- `navigator.hardwareConcurrency`;
- tipo de puntero.

Devuelve:

```ts
{
  ready: boolean,
  capable: boolean,
  reason?: string
}
```

`Hero` lo usa para advertir antes del globo y ofrecer la vista rápida.

### Otros efectos

`Hero` usa `useEffect` para:

- emitir `travel-focus` cuando hay destino seleccionado;
- escuchar la rueda del mouse y cerrar foco;
- bloquear el scroll del body mientras hay selección;
- emitir `destination-drawer` cuando cambia el drawer.
- emitir `immersive-mode-change` para controlar la chrome global del modo Globo;
- escuchar `exploration-navigation` y sincronizar la sección/vista.

`SiteNav` usa `localStorage` para guardar:

- `aleca-style`;
- `aleca-theme`.

`app/layout.tsx` aplica esas preferencias con un script antes del primer paint. `SiteNav` lee los atributos del documento para que el tema y sus controles aparezcan sincronizados inmediatamente, sin esperar un efecto posterior.

`MobileBottomNav` escucha `travel-focus` y `destination-drawer` para ocultarse o reaparecer.

También escucha `exploration-view-change` para mantener sincronizado su estado activo con `ViewModeSelector`. `Filtros` en resultados es un panel compacto de chips y no vuelve a montar el formulario inicial.

`TravelGlobe` escucha `visual-theme-change` y eventos propios de sus pines.

## 11. Mapa de eventos del navegador

```text
Hero selecciona destino
  -> travel-focus { active: true }

Hero abre/cierra drawer
  -> destination-drawer { open: boolean }

Drawer envia pre-reserva
  -> travel-request { hotel, tarifa, rateKey, precio }

SiteNav cambia tema/estilo
  -> visual-theme-change { style }
```

Estos eventos son comunicación local entre componentes. No sustituyen una API de backend.

## 12. Archivos visuales y estilos

### `app/globals.css`

Define:

- tokens de color para `atlas` y `globe`;
- temas claro y oscuro;
- clases `glass`, `glass-strong` y glows;
- tipografías y colores Tailwind;
- estilos del globo, mapa y escenas.

La interfaz usa variables como `var(--primary)`, `var(--accent-gold)` y `var(--border)`. Para mantener la identidad editorial, reutilizar esos tokens antes de añadir colores nuevos.

### `public/destinations/`

Contiene las imágenes locales usadas como portada de destinos y fallback visual de hoteles mock.

## 13. Que no existe todavia

- No existe endpoint `/api` para buscar hoteles.
- No existe `fetch` hacia Hotelbeds.
- No existe validación runtime con Zod u otra librería.
- No existe base de datos para solicitudes.
- No existe listener para guardar `travel-request`.
- No existe pasarela de pago real.
- No existe confirmación de disponibilidad real.
- El globo usa render 3D, pero no participa en el camino de reserva.
- `SearchPanel` es un formulario compacto legacy y no está montado en el flujo activo de `Hero`.

## 14. Como continuar manualmente

Para cambiar el flujo de hoteles:

1. Revisar primero `components/travel-search.tsx`.
2. Cambiar el modelo de datos en `lib/destinations.ts` solo si cambia el contrato.
3. Mantener `DestinationBottomDrawer` como consumidor de la selección.
4. Mantener `Hero` como coordinador de selección y navegación.
5. Validar que una búsqueda no monte el globo ni dependa de WebGL.
6. Probar el recorrido en ancho móvil antes de añadir otra sección.

Para conectar backend más adelante:

1. Crear una ruta `app/api/hotels/route.ts`.
2. Validar entrada y respuesta externa en el servidor.
3. Mover `MOCK_HOTELS` detrás de un proveedor intercambiable.
4. Mantener `adaptPostmanHotelsResponse` como frontera de normalización.
5. Reemplazar el evento `travel-request` por `POST /api/travel-requests`.
6. Mantener WhatsApp como salida secundaria.

## 15. Comandos de trabajo

```powershell
npm run dev
npm run lint
npm run build
npm test
## 17. Criterios UX para el siguiente sprint
```

Si `npm run dev` falla, guardar y leer el mensaje completo del proceso. El estado de salida por sí solo no identifica si el problema es el puerto, una variable de entorno, una instalación incompleta o un error de compilación.

## 16. Criterios UX para el siguiente sprint

- La primera pantalla móvil debe responder: destino, fechas, viajeros y acción.
- La simulación debe ser visible sin explicar demasiado.
- Los resultados deben aparecer inmediatamente después del CTA.
- Una tarjeta debe mostrar una opción recomendada y permitir cambiarla sin abrir otra pantalla.
- El drawer debe confirmar una pre-reserva, no vender un itinerario inventado.
- Actividades, vuelos y extras deben ser opcionales y posteriores.
- El usuario debe entender qué se envió al agente.
- Toda promesa de disponibilidad debe etiquetarse como simulada hasta conectar backend.
