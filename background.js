// Mueve la pestaña de WhatsApp (sin recargarla ni abrir otra sesión) entre
// una ventana tipo celular anclada al borde derecho y una ventana normal.
const WA = 'https://web.whatsapp.com/';
// Área visible de un Samsung Galaxy S26 Ultra en píxeles CSS
// (1440×3120 a densidad 3.5×). Debe coincidir con PHONE en content.js.
const PHONE = { w: 412, h: 891 };
// Bordes + barra de título de la ventana; varían según el sistema. Se
// calibran solos la primera vez (ver 'phone-frame') y se recuerdan.
const DEFAULT_FRAME = { w: 16, h: 39 };

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
async function phoneBounds(s) {
  const { frame = DEFAULT_FRAME } = await chrome.storage.local.get('frame');
  const width = PHONE.w + frame.w;
  const height = s ? Math.min(PHONE.h + frame.h, s.h) : PHONE.h + frame.h;
  const bounds = { type: 'popup', width, height };
  if (s) {
    bounds.left = s.l + s.w - width;
    bounds.top = s.t + Math.max(0, Math.round((s.h - height) / 2));
  }
  return bounds;
}

// El content script informa el área interior real; si no es 412×891 se
// corrige el tamaño (manteniendo el borde derecho) y se guarda el marco.
async function calibratePhone(tab, m) {
  if (!tab) return;
  const key = `phone-${tab.windowId}`;
  const { [key]: isPhone } = await chrome.storage.session.get(key);
  if (!isPhone) return;
  await chrome.storage.session.remove(key); // una sola vez por ventana
  if (m.iw === PHONE.w && m.ih === PHONE.h) return;
  const frame = { w: m.fw, h: m.fh };
  await chrome.storage.local.set({ frame });
  const win = await chrome.windows.get(tab.windowId);
  const width = PHONE.w + frame.w;
  await chrome.windows.update(win.id, {
    left: win.left + win.width - width,
    width,
    height: Math.min(PHONE.h + frame.h, m.sh || Infinity) // pantallas bajas: no salirse
  });
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
