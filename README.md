# Chat Sidebar Adjuster for WhatsApp Web

Extensión Manifest V3 para Chrome, Brave, Edge y demás navegadores Chromium que adapta WhatsApp Web al espacio de pantalla del usuario: ancho de la lista de chats, vista tipo celular y ventana flotante siempre visible.

**Versión actual: 1.2.6**. Historial completo en [`CHANGELOG.md`](CHANGELOG.md).

## Funciones

### Lista de chats a tu medida
- Panel guiado **"Ajustar chats"**, abierto desde un botón discreto (burbuja + engranaje) en la barra lateral de WhatsApp Web.
- **1. Elige cómo ver la lista:** **Fijo** (lista completa), **Iconos** (solo fotos) o **Auto** (compacta; se abre al pasar el cursor, con una demora breve para evitar aperturas accidentales). Cada modo muestra su explicación.
- **2. Ajusta el tamaño:** ancho de la lista (180–620 px) y ancho en iconos (72–120 px). El control que no aplica al modo elegido aparece atenuado. Incluye el botón **Restablecer valores**.
- El panel se cierra con ×, con Esc (sin cerrar el chat de WhatsApp) o haciendo clic fuera.

### Modo celular
- **3. Ventana tipo celular → "📱 Abrir como celular"** (también en el popup de la extensión): mueve la misma pestaña, sin abrir otra sesión, a una ventana del tamaño de un **Samsung Galaxy S26 Ultra: 412 × 891 px de área visible**, anclada al borde derecho de la pantalla.
- La ventana se **autocalibra**: el content script informa su área interior y el service worker corrige el tamaño según el marco de la ventana (bordes y barra de título), que guarda para las siguientes veces.
- En ventanas de **760 px o menos** se muestra una pantalla a la vez, como en el teléfono: la lista o el chat, a pantalla completa.
- Botón **← Volver** en la cabecera de cada chat, canal o comunidad. Cierra el chat de verdad (Esc nativo), así no queda seleccionado.
- El chat se abre en el **mensaje más reciente** y con el cursor listo para escribir.
- Estados, Canales, Comunidades, Ajustes, stickers, Multimedia, menús e información de contacto se adaptan al ancho de la ventana.
- "🖥️ Volver a la vista normal" devuelve la pestaña a una ventana maximizada.

### Ventana flotante (siempre visible)
- **"📌 Ventana flotante (siempre encima)"** abre WhatsApp en una ventana **Document Picture-in-Picture**, que el navegador mantiene encima de cualquier aplicación.
- Dentro se carga WhatsApp en un iframe, ya en vista celular (412 × 891). Para permitirlo, `rules.json` cambia `X-Frame-Options: DENY` → `SAMEORIGIN` solo para WhatsApp; el CSP de WhatsApp no tiene `frame-ancestors`.
- WhatsApp admite una sola sesión activa. Mientras la flotante está abierta, la ventana original se **minimiza** si WhatsApp es su única pestaña; si no, se cubre con un aviso "Traer de vuelta a esta pestaña". Al cerrar la flotante, la ventana se restaura y recupera la sesión.

### Navegación con gestos (modo celular y flotante)
- **Dos dedos a la derecha** en el touchpad: volver a la lista (o de Estados/Canales a Chats). **A la izquierda:** reabrir el último chat.
- Lo mismo con los botones **atrás/adelante del mouse**. El navegador ya no sale de WhatsApp con esos gestos.
- Una burbuja breve ← / → confirma cada gesto.

### Encaje automático (ventanas de hasta 1100 px)
- Los menús y paneles con medidas de escritorio que se salen de la ventana (llamadas, adjuntar, stickers, Multimedia…) se **desplazan** lo justo para quedar dentro, o se **achican** si son más anchos que la ventana.
- Los carruseles con scroll propio no se tocan.
- Tiene un **disyuntor**: máximo 4 ajustes por elemento y una pausa automática si el encaje se repite demasiado o tarda mucho. La extensión nunca puede trabar la página.

### Privacidad
- No lee, guarda ni envía mensajes, contactos, fotos ni historial. Sin servidores, analítica ni anuncios. Detalle en [`PRIVACY.md`](PRIVACY.md).

## Instalar (descomprimida, para desarrollo)

1. Abre `chrome://extensions` (`brave://extensions`, `edge://extensions`).
2. Activa **Modo de desarrollador** → **Cargar descomprimida** → elige esta carpeta.
3. Abre o recarga `https://web.whatsapp.com/`.

Tras cambiar el código: pulsa ↻ en la extensión **y recarga WhatsApp (F5)**. Las páginas abiertas no toman el código nuevo hasta recargarse.

## Permisos

| Permiso | Para qué |
|---|---|
| `storage` | Preferencias (`width`, `collapsed`, `mode` en `storage.sync`), marco de la ventana celular (`storage.local`) y estado temporal de ventanas (`storage.session`). |
| `declarativeNetRequestWithHostAccess` | Solo para la ventana flotante: `X-Frame-Options` DENY → SAMEORIGIN en `sub_frame` de WhatsApp. Sin advertencia al instalar; no lee contenido. |
| `https://web.whatsapp.com/*` | Único sitio donde se ejecuta la extensión. |

## Estructura del código

| Archivo | Rol |
|---|---|
| `manifest.json` | MV3: permisos, content script en todos los frames de WhatsApp, service worker y regla DNR. |
| `content.js` | Todo lo que ocurre en la página: detección de la lista (heurística geométrica + selectores accesibles), panel, modos, modo celular (`updateView`, `goBack`/`goForward`, gestos), encaje (`fitToViewport`), ventana flotante (`openFloating`) y calibración de la ventana celular (`reportFrame`). |
| `content.css` | Estilos del panel y reglas por atributos `data-wsp-*` (`data-wsp-mode`, `data-wsp-mobile`, `data-wsp-view`, `data-wsp-fit`…). |
| `background.js` | Service worker: mover la pestaña a la ventana celular o normal, calibrar 412×891, minimizar/restaurar la ventana original con la flotante. |
| `rules.json` | Regla `declarativeNetRequest` de la ventana flotante. |
| `popup.*` | Popup de la extensión: "Abrir como celular" y "Abrir en pestaña". |
| `test/fit.html` | Prueba automática del encaje (ver abajo). |
| `store/` | Imágenes de la ficha: `slides.html` (fuente) y `out/` (PNG generados). |
| `build-zip.py` | Genera el ZIP para la Chrome Web Store en `dist/`. |
| `graphify-out/` | Mapa del código generado con [graphify](https://graphify.com) (`graph.html`). |

## Pruebas

**Encaje automático.** Sirve el repo y abre la prueba:

```
python -m http.server 8766
# abrir http://127.0.0.1:8766/test/fit.html
```

Carga `content.js` y `content.css` reales dentro de una ventana de 420×820 y comprueba 8 casos: menú de llamadas, panel más ancho que la ventana, menú adjuntar, carrusel intacto, contenedor alto sin scroll lateral y una capa que "pelea" con la extensión sin trabar la página. Las 8 deben salir en verde.

**Manual en WhatsApp Web.** Prueba los modos Fijo/Iconos/Auto, "Abrir como celular" (tamaño 412×891, lista ↔ chat, ← Volver, gestos), la ventana flotante (la ventana original se minimiza y vuelve al cerrar) y el encaje de stickers, Multimedia y el menú de llamadas.

## Publicar en la Chrome Web Store

1. Genera el paquete: `python build-zip.py` → `dist/chat-sidebar-adjuster-v<versión>.zip`. Incluye solo los archivos de la extensión y valida que estén todos los que pide el manifest.
2. Textos de la ficha y de "Prácticas de privacidad", campo por campo: [`STORE_LISTING_ES.md`](STORE_LISTING_ES.md).
3. Imágenes (PNG de 24 bits, sin alfa) en `store/out/`: 5 capturas de 1280×800, mosaico de 440×280 y mosaico de 1400×560.
4. **Pendiente antes de publicar:** reemplazar el correo de contacto de ejemplo en `PRIVACY.md`.

Las páginas de la Chrome Web Store no se pueden automatizar desde extensiones (el navegador lo bloquea), así que la ficha se actualiza a mano.

## Limitaciones conocidas

- WhatsApp puede cambiar su estructura interna. La detección usa selectores accesibles y heurísticas geométricas, pero una actualización suya podría requerir ajustes en `content.js`.
- La ventana flotante depende de Document Picture-in-Picture. Si el navegador lo tiene desactivado, el panel lo indica y se puede usar "Abrir como celular".
- "Volver" cierra el chat enviando Esc a WhatsApp. Si WhatsApp ignorara ese evento, la lista se muestra igual, pero el chat queda seleccionado detrás.
- Las extensiones no pueden fijar una ventana normal "siempre encima"; para eso existe la ventana flotante.

## Descargo de afiliación

Proyecto independiente. **No afiliado, respaldado ni patrocinado por WhatsApp LLC ni Meta Platforms, Inc.** WhatsApp es una marca de sus respectivos titulares.
