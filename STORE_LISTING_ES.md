# Ficha para Chrome Web Store (v1.2.6)

Textos listos para copiar y pegar en el panel de desarrolladores, en el mismo orden de las pestañas.

---

## Pestaña «Ficha de Play Store»

### Nombre (está en el manifest; máx. 75)

Chat Sidebar Adjuster for WhatsApp Web

### Resumen (máx. 132 caracteres)

Ajusta la lista de chats de WhatsApp Web, úsalo como en tu celular o en una ventana flotante siempre visible.

### Descripción

Haz que WhatsApp Web se adapte a ti: elige cuánto espacio ocupa la lista de chats, úsalo en una ventana del tamaño de un celular o déjalo flotando encima de cualquier programa mientras trabajas.

★ LISTA DE CHATS A TU MEDIDA
• Tres vistas: Fijo (lista completa), Iconos (solo fotos) y Auto (compacta, se abre sola al pasar el cursor).
• Ancho exacto con controles deslizantes y vista previa al instante.
• Panel guiado paso a paso, con una explicación de cada opción y botón «Restablecer valores».
• Se abre desde un botón discreto en la barra lateral de WhatsApp Web.

★ MODO CELULAR
• «📱 Abrir como celular» pasa WhatsApp a una ventana del tamaño de un Samsung Galaxy S26 Ultra (412 × 891 px), anclada al borde derecho de la pantalla.
• Una pantalla a la vez, como en el teléfono: la lista o el chat, a pantalla completa.
• Botón ← Volver en cada chat, canal o comunidad.
• Estados, Canales, Comunidades, stickers, multimedia, menús e información de contacto se adaptan al tamaño de la ventana.
• El chat se abre en el mensaje más reciente y listo para escribir.

★ VENTANA FLOTANTE, SIEMPRE VISIBLE
• «📌 Ventana flotante» deja WhatsApp encima de cualquier aplicación, aunque cambies de programa.
• Una sola sesión: la ventana original se aparta sola y vuelve al cerrar la flotante.
• Incluido en la extensión, sin instalar nada más.

★ NAVEGACIÓN NATURAL
• Desliza dos dedos a la derecha en el touchpad para volver a la lista (o de Estados/Canales a Chats); a la izquierda para reabrir el último chat.
• También con los botones atrás/adelante del mouse.

★ PRIVADO POR DISEÑO
• No lee, guarda ni envía mensajes, contactos, fotos ni historial.
• Sin servidores externos, sin analítica y sin anuncios.
• Solo guarda tus preferencias de visualización, en tu propio navegador.

Proyecto independiente: no está afiliado, respaldado ni patrocinado por WhatsApp LLC ni Meta Platforms, Inc. «WhatsApp» es una marca de sus respectivos titulares y se usa solo para indicar compatibilidad.

### Categoría

Productividad → Comunicación

### Idioma

Español

### Recursos gráficos (generados en `store/out/`)

| Campo | Archivo | Medida |
|---|---|---|
| Icono de la tienda | `icons/icon128.png` | 128 × 128 |
| Capturas de pantalla (1 a 5) | `captura-1-panel.png` … `captura-5-privacidad.png` | 1280 × 800 |
| Mosaico promocional pequeño | `mosaico-440x280.png` | 440 × 280 |
| Mosaico promocional con desplazamiento | `mosaico-1400x560.png` | 1400 × 560 |

Para regenerarlos: sirve el repo (`python -m http.server`), abre `store/slides.html?s=1` … `?s=5` en una ventana de 1280×800 (`?s=tile` en 440×280 y `?s=marquee` en 1400×560) y captura la vista.

---

## Pestaña «Prácticas de privacidad»

### Propósito único

Adaptar la interfaz de WhatsApp Web al espacio de pantalla del usuario: ancho de la lista de chats, vista tipo celular y ventana flotante.

### Justificación del permiso `storage`

Guarda únicamente preferencias de visualización: el ancho de la lista, el ancho compacto y el modo de vista (`chrome.storage.sync`); el tamaño del marco de la ventana para que la ventana celular mida exactamente 412 × 891 px (`chrome.storage.local`); y, mientras la ventana flotante está abierta, el estado de la ventana original para restaurarla al cerrar (`chrome.storage.session`). No se guarda ningún otro dato.

### Justificación del permiso `declarativeNetRequestWithHostAccess`

Se usa solo para la función «Ventana flotante». Una regla estática cambia la cabecera `X-Frame-Options` de `web.whatsapp.com` de `DENY` a `SAMEORIGIN` en cargas de tipo `sub_frame`, para que WhatsApp Web pueda mostrarse dentro de su propia ventana Picture-in-Picture (siempre encima). `SAMEORIGIN` mantiene bloqueado que terceros incrusten WhatsApp. No se leen, recopilan ni modifican mensajes ni otros datos.

### Justificación del permiso de host (`https://web.whatsapp.com/*`)

Es el único sitio donde se ejecuta la extensión. Hace falta para aplicar los ajustes visuales (ancho, modo celular, encaje de paneles y botón Volver) sobre la página de WhatsApp Web, y para que la regla de la ventana flotante actúe solo sobre ese dominio.

### ¿Usas código remoto?

No. Todo el JavaScript y CSS va incluido en el paquete; no se cargan scripts ni recursos desde servidores externos.

### Uso de datos

Marca que **no** se recopila ninguno de los tipos de datos de la lista. Marca las tres certificaciones:
- No vendo ni transfiero datos de usuario a terceros, salvo en los casos de uso aprobados.
- No uso ni transfiero datos de usuario para fines no relacionados con el propósito único del elemento.
- No uso ni transfiero datos de usuario para determinar la solvencia crediticia ni para conceder préstamos.

### URL de la política de privacidad

https://github.com/jhordyolartesuarez-collab/wsp-sidebar-personalizable/blob/main/PRIVACY.md

---

## Pestaña «Paquete»

Sube `dist/chat-sidebar-adjuster-v1.2.6.zip`. Contiene solo los archivos de la extensión, sin `test/`, `store/`, `graphify-out/` ni `.claude/`.
