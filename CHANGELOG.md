# Historial de cambios

## 1.2.6 — 2026-11-05
- Ventana celular y flotante con el área visible del Samsung Galaxy S26 Ultra (412 × 891 px), autocalibrada según el marco de la ventana.
- Ficha de la Chrome Web Store reescrita (`STORE_LISTING_ES.md`), imágenes de presentación en `store/` (5 capturas, mosaico de 440×280 y de 1400×560) y `build-zip.py`.

## 1.2.5
- Ventana flotante: la ventana original se minimiza si WhatsApp es su única pestaña, y se restaura al cerrar la flotante (una sola ventana a la vista).

## 1.2.4
- Encaje general seguro: las capas flotantes se recolocan con `translate` en vez de forzar `left`/`right` (eso peleaba con el menú de llamadas y podía trabar la página).
- Disyuntor de encaje: límite de intentos por elemento y pausa si se repite o tarda demasiado.
- Encaje activo en ventanas de hasta 1100 px.
- Prueba automática `test/fit.html`.

## 1.2.3
- Modo celular: al abrir un chat, el cursor queda listo en "Escribe un mensaje".

## 1.2.2
- Gestos de touchpad y botones atrás/adelante del mouse para volver y avanzar.
- Multimedia sin scroll lateral: solo se respetan los carruseles bajos.

## 1.2.1
- El chat abre en el mensaje más reciente: el panel oculto ya no usa `display:none`.
- Aviso "Traer de vuelta a esta pestaña" mientras la ventana flotante está abierta.

## 1.2.0
- Ventana flotante siempre visible (Document Picture-in-Picture) con la regla `declarativeNetRequestWithHostAccess` (`X-Frame-Options` → `SAMEORIGIN`).
- Content script en todos los frames.
- Panel de stickers sin recorte superior.

## 1.1.4
- "Volver" cierra el chat (Esc nativo); ya no se reabre al cambiar de sección.
- Encaje general a la ventana para paneles con medidas de escritorio.
- Ventana celular anclada al borde derecho.

## 1.1.3
- Botón de la extensión en la barra aunque falte Meta AI (ventana pequeña); nunca flota sobre el chat.

## 1.1.2
- Modo celular por vistas: Canales/Estados/Comunidades a ancho completo, sin línea gris, stickers ajustados e info de contacto a pantalla completa.
- Detección de la lista aunque WhatsApp cargue ya en una ventana angosta.

## 1.1.1
- Sección "3. Ventana tipo celular" en el panel y `background.js` para mover la pestaña entre ventanas.

## 1.1.0
- Modo celular: un solo panel en ventanas de 760 px o menos, botón ← Volver y "Abrir como celular" en el popup.

## 1.0.9
- Panel más didáctico: pasos guiados, explicación por modo, control atenuado y botón Restablecer.
- Clic fuera cierra el panel; Esc ya no cierra el chat de WhatsApp.
- Sliders que guardan al soltar (cuota de `storage.sync`).
- Modo Auto con demora anti-accidental.

## 1.0.8
- Versión inicial publicada: anchos Fijo/Iconos/Auto para la lista de chats.
