const WA = 'https://web.whatsapp.com/';
const findTab = async () => (await chrome.tabs.query({ url: WA + '*' }))[0];

// Mueve la pestaña existente (no abre otra: WhatsApp solo permite una sesión
// activa) a una ventana emergente con tamaño de celular.
document.getElementById('phone').addEventListener('click', async () => {
  const opts = { type: 'popup', width: 420, height: 820, focused: true };
  const tab = await findTab();
  if (tab) {
    if (tab.pinned) await chrome.tabs.update(tab.id, { pinned: false });
    await chrome.windows.create({ ...opts, tabId: tab.id });
  } else {
    await chrome.windows.create({ ...opts, url: WA });
  }
  window.close();
});

document.getElementById('open').addEventListener('click', async () => {
  const tab = await findTab();
  if (tab) {
    await chrome.tabs.update(tab.id, { active: true });
    await chrome.windows.update(tab.windowId, { focused: true });
  } else {
    await chrome.tabs.create({ url: WA });
  }
  window.close();
});