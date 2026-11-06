// Mueve la pestaña de WhatsApp (sin recargarla ni abrir otra sesión) entre
// una ventana tipo celular anclada al borde derecho y una ventana normal.
const WA = 'https://web.whatsapp.com/';
const PHONE_WIDTH = 420;

chrome.runtime.onMessage.addListener(async (msg, sender) => {
  if (!msg || (msg.cmd !== 'phone' && msg.cmd !== 'desktop')) return;
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