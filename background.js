// Mueve la pestaña de WhatsApp (sin recargarla ni abrir otra sesión) entre
// una ventana estrecha anclada al borde derecho y una ventana normal.
const WA = 'https://web.whatsapp.com/';
// Área visible de un Samsung Galaxy S26 Ultra en píxeles CSS
// (1440×3120 a densidad 3.5×). Debe coincidir con PHONE en content.js.
const PHONE = { w: 412, h: 891 };
// Marco de una ventana NORMAL: bordes, barra de título, pestañas y omnibox.
// Varía según el sistema y el escalado de pantalla; se calibra solo la primera
// vez (ver 'phone-frame') y se recuerda.
const DEFAULT_FRAME = { w: 16, h: 111 };

chrome.runtime.onMessage.addListener(async (msg, sender) => {
  if (!msg) return;
  if (msg.cmd === 'hide-opener') return hideOpener(sender.tab);
  if (msg.cmd === 'restore-opener') return restoreOpener(sender.tab);
  if (msg.cmd === 'phone-frame') return calibratePhone(sender.tab, msg);
  if (msg.cmd !== 'phone' && msg.cmd !== 'desktop') return;
  const tabId = msg.tabId ?? sender.tab?.id;
  const opts = msg.cmd === 'phone' ? await phoneBounds(msg.screen) : { type: 'normal', state: 'maximized' };
  if (tabId) {
    const tab = await chrome.tabs.get(tabId);
    if (tab.pinned) await chrome.tabs.update(tabId, { pinned: false });
    opts.tabId = tabId;
  } else {
    opts.url = WA;
  }
  const win = await chrome.windows.create({ ...opts, focused: true });
  if (msg.cmd === 'phone') await chrome.storage.session.set({ [`phone-${win.id}`]: true });
});

// Ventana del tamaño del S26 Ultra, pegada al borde derecho y centrada en
// vertical (sin pasarse del área útil de la pantalla).
//
// Es una ventana NORMAL, no un popup, a propósito: Chrome trata los popups
// aparte al cerrar el navegador (no los restaura como una pestaña más y puede
// no conservar el estado de sesión del sitio), y WhatsApp guarda su sesión en
// ese estado. Con una ventana normal la sesión sobrevive al reinicio aunque
// sea la única ventana abierta, y no queda el dispositivo vinculado en el
// teléfono sin sesión en el navegador.
// Efecto lateral conocido: Chrome no permite ventanas normales de menos de
// ~500 px, así que el ancho se recorta (ver calibratePhone) y el alto sí puede
// quedar exacto en 891 px.
async function phoneBounds(s) {
  const { frame = DEFAULT_FRAME } = await chrome.storage.local.get('frame-normal');
  const width = PHONE.w + frame.w;
  const height = s ? Math.min(PHONE.h + frame.h, s.h) : PHONE.h + frame.h;
  const bounds = { type: 'normal', width, height };
  if (s) {
    bounds.left = s.l + s.w - width;
    bounds.top = s.t + Math.max(0, Math.round((s.h - height) / 2));
  }
  return bounds;
}

// El content script informa el área interior real; se guarda el marco y se
// corrige lo que Chrome sí permite: la altura exacta y el borde derecho.
// El ancho no se toca porque Chrome lo recorta a su mínimo (~500 px): pedir
// 412 solo movería la ventana sin lograr el tamaño.
async function calibratePhone(tab, m) {
  if (!tab) return;
  const key = `phone-${tab.windowId}`;
  const { [key]: isPhone } = await chrome.storage.session.get(key);
  if (!isPhone) return;
  await chrome.storage.session.remove(key); // una sola vez por ventana
  const frame = { w: m.fw, h: m.fh };
  await chrome.storage.local.set({ 'frame-normal': frame });

  const win = await chrome.windows.get(tab.windowId);
  const update = {};
  const height = Math.min(PHONE.h + frame.h, m.sh || Infinity); // pantallas bajas: no salirse
  if (Math.abs(win.height - height) >= 2) update.height = height;
  if (Number.isFinite(win.left) && Number.isFinite(m.sw) && Number.isFinite(m.sl)
    && Math.abs(win.left + win.width - (m.sl + m.sw)) >= 2) {
    update.left = m.sl + m.sw - win.width; // borde derecho pegado a la pantalla
  }
  if (Object.keys(update).length) await chrome.windows.update(win.id, update);
}

// Ventana flotante abierta: la pestaña original debe seguir viva (la
// flotante depende de ella), pero no a la vista. Si WhatsApp está solo en
// su ventana (p. ej. la ventana celular) se minimiza; si comparte ventana
// con otras pestañas no se toca, para no esconder el resto.
async function hideOpener(tab) {
  if (!tab) return;
  const win = await chrome.windows.get(tab.windowId, { populate: true });
  if (win.tabs.length !== 1 || win.state === 'minimized') return;
  await chrome.storage.session.set({ [`opener-${win.id}`]: win.state });
  await chrome.windows.update(win.id, { state: 'minimized' });
}

async function restoreOpener(tab) {
  if (!tab) return;
  const key = `opener-${tab.windowId}`;
  const { [key]: state } = await chrome.storage.session.get(key);
  if (!state) return;
  await chrome.storage.session.remove(key);
  await chrome.windows.update(tab.windowId, { state, focused: true });
}
