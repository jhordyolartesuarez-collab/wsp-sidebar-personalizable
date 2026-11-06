# Ficha para Chrome Web Store

## Nombre

Chat Sidebar Adjuster for WhatsApp Web

## Resumen corto (máx. 132 caracteres)

Personaliza el ancho y la vista compacta de la lista de chats de WhatsApp Web.

## Descripción extensa

Chat Sidebar Adjuster ajusta visualmente la columna de la lista de chats de WhatsApp Web, sin tocar la conversación abierta ni la barra de accesos rápidos.

**Funciones principales:**

- **Ancho ajustable:** define el ancho de la lista de chats para el modo Fijo y para el estado expandido del modo Auto.
- **Modo Fijo:** la lista mantiene siempre el ancho elegido.
- **Modo Iconos:** la lista queda reducida a un ancho compacto configurable, mostrando solo los avatares.
- **Modo Auto:** la lista permanece en su ancho compacto y se expande suavemente al acercar el cursor o al enfocar un elemento con el teclado; vuelve a contraerse al alejar el cursor.
- **Ancho compacto configurable:** ajusta por separado el ancho reducido usado en los modos Iconos y Auto contraído.
- **Preferencias persistentes:** los ajustes se guardan automáticamente y se restauran en cada sesión.
- **Interfaz integrada:** el panel de ajustes y el icono de acceso se diseñaron para verse como parte natural de WhatsApp Web, sin colores llamativos ni elementos ajenos a su estética.
- **Sin recopilación de datos:** no lee, guarda ni transmite mensajes, contactos ni ninguna información personal. Solo conserva las preferencias de visualización elegidas por el usuario.
- **Proyecto independiente:** no afiliado, respaldado ni patrocinado por WhatsApp LLC o Meta Platforms, Inc.

## Categoría

Productividad

## Idioma principal

Español

## Propósito único (Single Purpose)

Personalizar visualmente el ancho y comportamiento de la lista de chats de WhatsApp Web.

## Respuestas sugeridas para el formulario de revisión

**Justificación del permiso `storage`:**
Se usa exclusivamente para guardar tres preferencias de visualización del usuario (ancho general, ancho compacto y modo de vista) mediante `chrome.storage.sync`, de modo que persistan entre sesiones y dispositivos sincronizados. No se guarda ningún otro dato.

**Justificación del permiso `declarativeNetRequest`:**
Se usa únicamente para la función "Ventana flotante": una regla estática cambia la cabecera `X-Frame-Options` de `web.whatsapp.com` de `DENY` a `SAMEORIGIN` en cargas de tipo `sub_frame`, para que WhatsApp Web pueda mostrarse dentro de su propia ventana Picture-in-Picture (siempre encima). `SAMEORIGIN` mantiene bloqueado que terceros incrusten WhatsApp. No se leen, recopilan ni modifican mensajes ni otros datos.

**Justificación del host permission (`https://web.whatsapp.com/*`):**
Es el único dominio donde se inyecta el content script, necesario para poder leer la estructura visual de la página y aplicar los ajustes de ancho/modo sobre la columna de la lista de chats. La extensión no funciona ni se ejecuta en ningún otro sitio.

**Uso de datos:**
La extensión no recopila, transmite ni comparte datos de ningún tipo. Las únicas tres preferencias guardadas (ancho, ancho compacto y modo) permanecen en el almacenamiento local/sincronizado del propio navegador del usuario y nunca salen de él.

**Uso remoto de código:**
No se ejecuta código remoto. Todo el JavaScript y CSS de la extensión está empaquetado localmente en el propio paquete; no se cargan scripts ni recursos desde servidores externos.

**Declaración de privacidad:**
Ver `PRIVACY.md`. La extensión no recopila mensajes, contactos, historial ni ningún dato personal; no existen servidores externos; no hay analítica ni publicidad.
