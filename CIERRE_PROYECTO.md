# Chat Sidebar Adjuster for WhatsApp Web — cierre v1.2.6

Fecha de cierre: 2026-11-05

## Estado

Listo para publicar en la Chrome Web Store como **v1.2.6**. El código, el paquete, la ficha y las imágenes están terminados. La ficha se completó a mano en el panel de desarrolladores, porque el navegador no permite automatizar las páginas de la Web Store.

**Pendiente:** reemplazar el correo de contacto de ejemplo en `PRIVACY.md` (también es la URL de la política de privacidad de la ficha).

## Qué se hizo en esta etapa (1.0.8 → 1.2.6)

1. Repositorio público en GitHub y mapa del código con graphify (`graphify-out/graph.html`).
2. Panel didáctico (v1.0.9): pasos guiados, explicación por modo, Restablecer, cierre al hacer clic fuera.
3. Modo celular (v1.1.x): un solo panel con ← Volver, adaptación de todas las vistas y ventana anclada al borde derecho.
4. Ventana flotante siempre visible (v1.2.x) con Document Picture-in-Picture y una sola ventana a la vista.
5. Gestos de touchpad/mouse, foco automático al abrir un chat y apertura en el mensaje más reciente.
6. Encaje automático seguro para menús y paneles, con disyuntor y prueba automática (`test/fit.html`, 8/8).
7. Medidas del Galaxy S26 Ultra (412 × 891) con autocalibración.
8. Material de la tienda: `STORE_LISTING_ES.md`, `store/out/` (5 capturas + 2 mosaicos) y `build-zip.py`.

Detalle por versión en `CHANGELOG.md`; los PR #1, #2 y #3 del repositorio documentan cada etapa.

## Cómo se probó

- `test/fit.html`: prueba automática del encaje con el código real en una ventana de 420×820.
- Pruebas en WhatsApp Web (Brave), hechas por el usuario con capturas, tras cada versión.
- Las páginas de prueba se sirvieron en localhost. Las imágenes de la tienda son maquetas con datos ficticios, no la sesión real.

## Lecciones para la próxima sesión

- Brave cargaba una copia vieja desde OneDrive. Si un cambio "no aparece", revisar desde qué carpeta está cargada la extensión.
- Tras ↻ en `brave://extensions` hay que recargar WhatsApp (F5).
- WhatsApp admite una sola sesión activa. Abrir WhatsApp en otra pestaña para probar desconecta la del usuario (y en una ocasión cerró la sesión). Probar en local (`test/`) o pedir capturas.
- Claude in Chrome no puede abrir `file://`, páginas `brave://`, el popup de la extensión ni la Chrome Web Store.
