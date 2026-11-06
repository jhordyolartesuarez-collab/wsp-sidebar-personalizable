const WA = 'https://web.whatsapp.com/';
const findTab = async () => (await chrome.tabs.query({ url: WA + '*' }))[0];
const screenArea = () => ({ w: screen.availWidth, h: screen.availHeight, l: screen.availLeft, t: screen.availTop });

// Mueve la pestaña existente (WhatsApp solo permite una sesión activa) a una
// ventana tipo celular anclada al borde derecho de la pantalla.
document.getElementById('phone').addEventListener('click', async () => {
  const tab = await findTab();
  await chrome.runtime.sendMessage({ cmd: 'phone', tabId: tab?.id, screen: screenArea() }).catch(() => {});
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