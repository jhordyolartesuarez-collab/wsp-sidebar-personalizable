# Chat Sidebar Adjuster for WhatsApp Web — v1.0.8 (cierre de proyecto)

Fecha de cierre: 2026-08-24

## Estado

Listo para publicar en la Chrome Web Store. Código, empaquetado y recursos promocionales terminados.

## Qué contiene esta carpeta

- `manifest.json`, `content.js`, `content.css`, `popup.*`, `icons/` — extensión funcional (MV3, solo permiso `storage`, host permission único a `web.whatsapp.com`).
- `README.md`, `PRIVACY.md`, `STORE_LISTING_ES.md` — documentación y ficha de tienda.
- `../wsp-sidebar-personalizable-v1.0.8.zip` — paquete listo para subir.
- `../STORE_ASSETS_1.0.8/` — capturas y mosaicos promocionales (ver detalle abajo).

## Qué hace la extensión

Controla el ancho de la lista de chats de WhatsApp Web desde un panel propio ("Ajustar chats"):
ancho fijo (180–620px), vista compacta en iconos (72–120px) y modo automático que expande la lista al pasar el cursor. Sin lectura, guardado ni transmisión de mensajes.

## Recursos de tienda (`STORE_ASSETS_1.0.8/`)

| Archivo | Dimensiones | Contenido |
|---|---|---|
| `01-panel-configuracion-1280x800.png` | 1280×800 | Panel "Ajustar chats" abierto, vista Fijo |
| `02-modo-iconos-1280x800.png` | 1280×800 | Lista colapsada en iconos, panel cerrado |
| `03-modo-auto-expandido-1280x800.png` | 1280×800 | Modo Auto con lista expandida por hover |
| `promo-small-440x280.png` | 440×280 | Mosaico pequeño de tienda |
| `promo-marquee-1400x560.png` | 1400×560 | Mosaico con desplazamiento |
| `00-hoja-de-contacto.html` | — | Hoja de revisión con miniaturas y validación técnica |

Todas las capturas cumplen: PNG 24-bit RGB, sin canal alfa, dimensiones exactas.

Se descartó una 4ª captura opcional (ancho intermedio 500px) por resultar visualmente redundante con la captura 1.

## Método y privacidad (capturas 1–3)

Generadas sobre la sesión real de WhatsApp Web del usuario, con anonimización temporal del DOM antes de cada captura:

- Nombres de chats/grupos, mensajes, horas y contadores reemplazados por una lista ficticia cerrada (Aventureros, Recetas de la Abuela, etc.).
- Avatares reales sustituidos por gradientes/formas sintéticas generadas por SVG.
- Fila especial "Mensaje para ti" (exponía teléfono real y una URL) ocultada por completo.
- Verificación de texto visible contra la lista autorizada antes de guardar cada archivo (lectura directa del DOM renderizado, no OCR).
- Ninguna anonimización tocó `chrome.storage`, `localStorage` ni IndexedDB; la pestaña se recargó al finalizar para restaurar el estado real del usuario.

Los dos mosaicos promocionales se construyeron desde cero (HTML/CSS local), sin usar la sesión real como base, con el ícono original de la extensión y la lista ficticia.

## Limitación técnica conocida

El entorno de captura no permitió redimensionar la ventana del navegador a 1280×800 nativos (quedó maximizada). Las 3 capturas de WhatsApp se generaron recortando la región CSS equivalente y reescalando con LANCZOS a las dimensiones exactas — nítidas pero no un recorte 1:1 nativo. Los mosaicos sí son downscale puro, sin pérdida perceptible.

## Siguiente paso

Subir el ZIP y los assets al panel de desarrollador de Chrome Web Store.
