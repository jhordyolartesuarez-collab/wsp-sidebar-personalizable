// Mueve la pestaña de WhatsApp (sin recargarla ni abrir otra sesión) entre
// una ventana emergente tipo celular y una ventana normal.
chrome.runtime.onMessage.addListener(async (msg, sender) => {
  const tab = sender.tab;
  if (!tab || (msg !== 'phone' && msg !== 'desktop')) return;
  if (tab.pinned) await chrome.tabs.update(tab.id, { pinned: false });
  const opts = msg === 'phone'
    ? { type: 'popup', width: 420, height: 820 }
    : { type: 'normal', state: 'maximized' };
  await chrome.windows.create({ ...opts, tabId: tab.id, focused: true });
});