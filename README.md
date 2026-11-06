# Chat Sidebar Adjuster for WhatsApp Web

Extensión Chrome/Edge Manifest V3 para personalizar únicamente la columna de la lista de chats de WhatsApp Web.

La barra vertical de accesos rápidos y la conversación abierta quedan fuera del ajuste.

## Funciones

- **Ancho general ajustable** entre 180 y 620 px (control "Ancho de la lista").
- **Ancho compacto ajustable** entre 72 y 120 px (control "Ancho en iconos"), usado por los modos Iconos y Auto contraído.
- **Modo Fijo:** aplica el ancho general y conserva toda la altura.
- **Modo Iconos:** mantiene la lista reducida al ancho compacto configurado, con los avatares visibles.
- **Modo Auto:** permanece en el ancho compacto y se expande al ancho general al pasar el cursor o enfocar un elemento con el teclado; vuelve a contraerse al salir.
- Panel de ajustes integrado visualmente con el estilo nativo de WhatsApp Web (colores, radios y tipografía tomados de sus propios tokens de diseño cuando están disponibles).
- Botón de acceso discreto, insertado en la barra vertical de WhatsApp Web, debajo del icono de Meta AI.
- Preferencias sincronizadas con `chrome.storage.sync`.
- Sin analítica, anuncios, lectura ni transmisión de mensajes.
- **Modo celular (v1.1.0):** desde el popup de la extensión, "📱 Abrir como celular" mueve la pestaña de WhatsApp Web a una ventana emergente de 420×820. En ventanas de 760 px o menos se muestra un solo panel (lista o chat) y la cabecera del chat incluye un botón **← Volver**. Al agrandar la ventana vuelve la vista normal.
- **Ventana flotante (v1.2.0):** desde el panel, "📌 Ventana flotante" abre WhatsApp en una ventana Picture-in-Picture que se mantiene encima de cualquier aplicación. Al cerrarla, la pestaña original se recarga para retomar la sesión (WhatsApp admite una sola activa).

## Cargar descomprimida

1. Abra `chrome://extensions` (o `edge://extensions`).
2. Active **Modo de desarrollador**.
3. Pulse **Cargar descomprimida**.
4. Seleccione esta carpeta.
5. Abra o recargue `https://web.whatsapp.com/`.

## Uso

1. Abra WhatsApp Web y localice el icono discreto (burbuja + engranaje) debajo de Meta AI en la barra vertical.
2. Haga clic para abrir el panel "Ajustar chats".
3. Ajuste **Ancho de la lista** para el modo Fijo/Auto expandido.
4. Ajuste **Ancho en iconos** para el modo Iconos/Auto contraído.
5. Elija la vista: **Fijo**, **Iconos** o **Auto**.
6. Cierre el panel con el botón × o con la tecla Escape.

## Publicación en Chrome Web Store

Suba el ZIP incluido desde el panel de desarrolladores. Complete ficha, capturas, categoría y datos del desarrollador (ver `STORE_LISTING_ES.md`). La extensión solicita `storage`, `declarativeNetRequestWithHostAccess` (solo para la ventana flotante) y acceso a `https://web.whatsapp.com/*`.

## Privacidad

Ver `PRIVACY.md`. Resumen: no se recopilan mensajes, contactos ni historial; no hay servidores externos; solo se guardan preferencias de visualización (`width`, `collapsed`, `mode`) en `chrome.storage.sync`.

## Permisos

- `storage`: guardar las preferencias de ancho y modo.
- `declarativeNetRequestWithHostAccess`: solo para la **ventana flotante**. Cambia la cabecera `X-Frame-Options` de WhatsApp Web de `DENY` a `SAMEORIGIN` en cargas de subventana (`sub_frame`), para que WhatsApp pueda mostrarse dentro de su propia ventana Picture-in-Picture. `SAMEORIGIN` sigue impidiendo que cualquier otro sitio incruste WhatsApp. No lee ni modifica contenido.
- `https://web.whatsapp.com/*`: aplicar la personalización únicamente dentro de WhatsApp Web.

## Compatibilidad

Chrome y navegadores basados en Chromium (Edge, Brave, etc.) con soporte de Manifest V3.

## Nota de compatibilidad con WhatsApp Web

WhatsApp puede cambiar su estructura interna. El detector usa selectores accesibles y una heurística geométrica para reducir roturas, pero una actualización futura podría requerir ajustar la detección en `content.js`.

## Descargo de afiliación

Proyecto independiente. **No afiliado, respaldado ni patrocinado por WhatsApp LLC o Meta Platforms, Inc.** WhatsApp es una marca de sus respectivos propietarios.

## Soporte

Para reportar un problema o sugerir una mejora, contacte al desarrollador en la dirección indicada en `PRIVACY.md`.

## Versión

1.0.8
