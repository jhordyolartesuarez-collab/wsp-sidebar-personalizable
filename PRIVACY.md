# Política de privacidad

**Última actualización: 5 de noviembre de 2026**

**Chat Sidebar Adjuster for WhatsApp Web** es un proyecto independiente. No afiliado, respaldado ni patrocinado por WhatsApp LLC o Meta Platforms, Inc.

## Qué NO se recopila

- No se recopilan mensajes.
- No se recopilan contactos.
- No se recopila historial de navegación ni de chats.
- No se transmiten datos a ningún servidor externo.
- No existen servidores externos: la extensión no realiza ninguna llamada de red propia.
- No se usa analítica, publicidad ni telemetría.
- No se leen ni almacenan credenciales.

## Qué SÍ se guarda

`chrome.storage.sync` guarda únicamente estas tres preferencias, dentro de la cuenta/navegador del propio usuario:

- `width`: ancho general de la lista de chats (px).
- `collapsed`: ancho compacto usado por los modos Iconos y Auto contraído (px).
- `mode`: vista seleccionada (`normal`, `icons` o `auto`).

Este almacenamiento se usa exclusivamente para conservar las preferencias visuales personales del usuario entre sesiones y dispositivos sincronizados con su cuenta de navegador. Ningún dato guardado se vende, comparte ni transmite a terceros.

Además, solo para que las ventanas funcionen bien:

- `chrome.storage.local` guarda el tamaño del marco de la ventana (bordes, barra de título, pestañas y barra de direcciones, en px) para ajustar el alto de la ventana celular al de la pantalla de un Galaxy S26 Ultra (891 px). El ancho lo limita Chrome, que no permite ventanas normales por debajo de ~500 px.
- `chrome.storage.session` guarda temporalmente si una ventana es la ventana celular y el estado de la ventana original mientras la ventana flotante está abierta; se borra al cerrar el navegador.

## Permisos utilizados

- `storage`: guardar las preferencias y los datos de ventana descritos arriba.
- `declarativeNetRequestWithHostAccess`: solo para la **ventana flotante**. Cambia la cabecera `X-Frame-Options` de WhatsApp Web de `DENY` a `SAMEORIGIN` en cargas de subventana (`sub_frame`), para que WhatsApp pueda mostrarse dentro de su propia ventana Picture-in-Picture. `SAMEORIGIN` sigue impidiendo que cualquier otro sitio incruste WhatsApp. No lee ni modifica contenido.
- `https://web.whatsapp.com/*`: aplicar la personalización visual únicamente dentro de WhatsApp Web.

## Contacto del desarrollador

`[REEMPLAZAR ANTES DE PUBLICAR: correo-de-contacto@ejemplo.com]`
