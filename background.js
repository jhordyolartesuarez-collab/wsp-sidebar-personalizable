// Mueve la pestaña de WhatsApp (sin recargarla ni abrir otra sesión) entre
// una ventana tipo celular anclada al borde derecho y una ventana normal.
const WA = 'https://web.whatsapp.com/';
const PHONE_WIDTH = 420;

chrome.runtime.onMessage.addListener(async (msg, sender) => {
  if (!msg) return;
  if (msg.cmd === 'hide-opener') return hideOpener(sender.tab);
  if (msg.cmd === 'restore-opener') return restoreOpener(sender.tab);
  if (msg.cmd !== 'phone' && msg.cmd !== 'desktop') return;
  const tabId = msg.tabId ?? sender.tab?.id;
  const s = msg.screen; // área útil de la pantalla (sin barra de tareas)
  const opts = msg.cmd === 'phone'
    ? s
      ? { type: 'popup', width: PHONE_WIDTH, height: s.h, left: s.l + s.w - PHONE_WIDTH, top: s.t }
      : { type: 'popup', width: PHONE_WIDTH, height: 820 }
    : { type: 'normal', state: 'maximized' };
  if (tabId) {
    const tab = await chrome.tabs.get(tabId);
    if (tab.pinned) await chrome.tabs.update(tabId, { pinned: false });
    opts.tabId = tabId;
  } else {
    opts.url = WA;
  }
  await chrome.windows.create({ ...opts, focused: true });
});

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