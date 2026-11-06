(() => {
  'use strict';

  const DEFAULTS = { width: 400, collapsed: 86, mode: 'normal' };
  const state = { ...DEFAULTS };
  const root = document.documentElement;

  const BOOT_MAX_MS = 20000;
  const BOOT_QUIET_MS = 3000;
  const REDUCE_MOTION = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const PANEL_ANIM_MS = REDUCE_MOTION ? 0 : 170;

  // Icono lineal propio (burbuja de chat + engranaje), sin cara ni logotipo
  // oficial: mismo trazo/estilo que los iconos nativos de WhatsApp.
  function chatGearIcon(size) {
    return `<svg viewBox="0 0 24 24" width="${size}" height="${size}" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4.5 6A2.5 2.5 0 0 1 7 3.5h7A2.5 2.5 0 0 1 16.5 6v5A2.5 2.5 0 0 1 14 13.5H9.4l-3 2.4.3-2.5A2.5 2.5 0 0 1 4.5 11V6Z"/><circle cx="17.3" cy="16.7" r="2.6"/><path d="M17.3 12.9v.9M17.3 20.2v.9M21.4 16.7h-.9M14.1 16.7h-.9M20.1 14.1l-.65.65M15.15 18.35l-.65.65M20.1 19.3l-.65-.65M15.15 15.05l-.65-.65"/></svg>`;
  }

  let sidebar = null;
  let structureObserver = null;
  let settingsReady = false;
  let structureReady = false;
  let revealed = false;
  let controlsBuilt = false;
  let bootStartedAt = 0;
  let lastStructuralActivityAt = 0;
  let failsafeInterval = null;
  let panelHideTimer = null;

  const clamp = (n, min, max) => Math.min(max, Math.max(min, Number(n) || min));

  function applySettings() {
    root.style.setProperty('--wsp-sidebar-width', `${state.width}px`);
    root.style.setProperty('--wsp-sidebar-collapsed', `${Math.min(state.collapsed, state.width)}px`);
    if (root.dataset.wspMode !== state.mode) root.dataset.wspMode = state.mode;
    updateUI();
  }

  async function loadSettings() {
    const saved = await chrome.storage.sync.get(DEFAULTS);
    state.width = clamp(saved.width, 180, 620);
    state.collapsed = clamp(saved.collapsed, 72, 120);
    state.mode = ['normal', 'icons', 'auto'].includes(saved.mode) ? saved.mode : 'normal';
    applySettings();
    settingsReady = true;
    tryReveal();
  }

  // Geometría pura: a propósito NO exige visibility!=='hidden', porque
  // #pane-side queda oculto por nuestra propia regla de arranque
  // (html[data-wsp-booting] #pane-side) y aun así debe poder detectarse
  // mientras está oculto. Exigir visibilidad real aquí crea un bloqueo
  // circular (nunca se revela porque nunca se detecta oculto).
  function hasLayout(el) {
    if (!(el instanceof HTMLElement)) return false;
    const r = el.getBoundingClientRect();
    const s = getComputedStyle(el);
    return r.width > 0 && r.height > 0 && s.display !== 'none';
  }

  // Etapa A: ancla estable, existe independientemente de si hay un chat abierto.
  function findPaneSide() {
    const list = document.querySelector(
      '#pane-side, [data-testid="chat-list"], [aria-label="Chat list"], [aria-label="Lista de chats"]'
    );
    return list && hasLayout(list) ? list : null;
  }

  // Etapa B: columna estructural real dentro del layout horizontal. No
  // depende de que exista un panel de conversación: solo de la geometría y
  // el display del ancestro, ambos disponibles apenas WhatsApp pinta el
  // esqueleto de la app.
  function findStructuralSidebar(list) {
    let node = list;
    while (node && node.parentElement && node.id !== 'app') {
      const parent = node.parentElement;
      const nr = node.getBoundingClientRect();
      const pd = getComputedStyle(parent);
      const horizontalLayout = (pd.display === 'flex' && pd.flexDirection === 'row') || pd.display === 'grid';
      // En ventana tipo celular WhatsApp deja la lista en ~30% (≈120px).
      const minWidth = mobileMQ.matches ? 60 : 220;
      if (horizontalLayout && nr.width >= minWidth && nr.width <= 650) {
        return { sidebar: node, layout: parent };
      }
      node = parent;
    }
    return null;
  }

  // Etapa C: panel principal (chat abierto). Puede no existir todavía; eso
  // no debe bloquear las etapas A/B.
  function findConversationPane(sidebarNode, layoutNode) {
    const nr = sidebarNode.getBoundingClientRect();
    // En ventana angosta (modo celular) el panel puede medir menos de 300px.
    const minWidth = mobileMQ.matches ? 120 : 300;
    const siblings = [...layoutNode.children].filter(el => el !== sidebarNode && hasLayout(el));
    return siblings.find(el => {
      const r = el.getBoundingClientRect();
      return r.width >= minWidth && r.left >= nr.right - 4;
    }) || null;
  }

  // ---- Modo celular: un solo panel (lista O chat) en ventanas angostas ----
  const mobileMQ = matchMedia('(max-width: 760px)');
  let forceList = false;   // el usuario pulsó "Volver"
  let lastMain = null;

  function backIcon() {
    return '<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M19 12H5M11 18l-6-6 6-6"/></svg>';
  }

  function updateView() {
    root.dataset.wspMobile = String(mobileMQ.matches);
    // Chat, canal o comunidad abiertos: #main o cualquier cabecera en el panel
    // principal (las pantallas vacías de bienvenida no tienen cabecera).
    const main = document.getElementById('main') || document.querySelector('[data-wsp-main="true"] header');
    if (main !== lastMain) { forceList = false; lastMain = main; } // se abrió otro contenido
    root.dataset.wspView = main && !forceList ? 'chat' : 'list';
  }

  function ensureBackButton() {
    const header = document.querySelector('#main header, [data-wsp-main="true"] header');
    if (!header || header.querySelector('#wsp-back')) return;
    const btn = document.createElement('button');
    btn.id = 'wsp-back';
    btn.type = 'button';
    btn.title = 'Volver a la lista de chats';
    btn.setAttribute('aria-label', 'Volver a la lista de chats');
    btn.innerHTML = backIcon();
    btn.addEventListener('click', e => {
      e.stopPropagation(); // que no abra la info del contacto
      forceList = true;
      root.dataset.wspView = 'list';
    });
    header.prepend(btn);
  }

  function markDividerOwners(layoutNode, sidebarNode, mainNode) {
    document.querySelectorAll('[data-wsp-divider-owner]').forEach(el => el.removeAttribute('data-wsp-divider-owner'));
    const structural = [layoutNode, sidebarNode, mainNode];
    let level = [mainNode];
    for (let depth = 0; depth < 4; depth += 1) {
      level = level.flatMap(el => [...el.children].filter(child => child instanceof HTMLElement));
      structural.push(...level);
    }
    [...new Set(structural)].forEach(el => el.setAttribute('data-wsp-divider-owner', 'true'));
  }

  function markSidebar() {
    const list = findPaneSide();
    if (!list) return false;
    if (!list.hasAttribute('data-wsp-chat-list')) list.setAttribute('data-wsp-chat-list', 'true');

    const structural = findStructuralSidebar(list);
    if (!structural) return false;

    if (sidebar !== structural.sidebar) {
      if (sidebar) sidebar.removeAttribute('data-wsp-sidebar');
      sidebar = structural.sidebar;
      sidebar.setAttribute('data-wsp-sidebar', 'true');
      document.querySelectorAll('[data-wsp-layout="true"]').forEach(el => el.removeAttribute('data-wsp-layout'));
      structural.layout.setAttribute('data-wsp-layout', 'true');
    }

    structureReady = true;
    tryReveal();

    // El chat abierto puede completarse más tarde, de forma idempotente,
    // sin retrasar el marcado inicial del sidebar ni el reveal.
    const conversation = findConversationPane(structural.sidebar, structural.layout);
    if (conversation && !conversation.hasAttribute('data-wsp-main')) {
      document.querySelectorAll('[data-wsp-main="true"]').forEach(el => el.removeAttribute('data-wsp-main'));
      conversation.setAttribute('data-wsp-main', 'true');
      markDividerOwners(structural.layout, structural.sidebar, conversation);
    }

    return true;
  }

  // Se retira data-wsp-booting solo cuando preferencias Y estructura están
  // listas, para no mostrar nunca un ancho intermedio (nativo → normal → modo
  // guardado). Doble rAF: confirma que el layout final ya se pintó antes de
  // revelar.
  function tryReveal() {
    if (revealed || !settingsReady || !structureReady) return;
    revealed = true;
    if (failsafeInterval) clearInterval(failsafeInterval);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        root.removeAttribute('data-wsp-booting');
        root.dataset.wspReady = 'true';
      });
    });
  }

  // Failsafe basado en progreso, no en un timeout fijo: solo actúa cuando
  // pasaron BOOT_MAX_MS desde el arranque Y no hubo actividad estructural
  // relevante en los últimos BOOT_QUIET_MS. Antes de revelar en estado
  // nativo intenta un último marcado síncrono; si al menos #pane-side existe,
  // lo usa como ancla de respaldo verificable en vez de revelar a ciegas.
  function checkFailsafe() {
    if (revealed) { clearInterval(failsafeInterval); return; }
    const now = performance.now();
    if (now - bootStartedAt < BOOT_MAX_MS) return;
    if (now - lastStructuralActivityAt < BOOT_QUIET_MS) return;

    if (markSidebar()) return; // tryReveal() ya corrió dentro de markSidebar()

    const list = findPaneSide();
    if (list) {
      sidebar = list;
      sidebar.setAttribute('data-wsp-sidebar', 'true');
      structureReady = true;
      console.warn('[WSP Sidebar] No se validó el contenedor estructural completo tras quedar quieto; se usa #pane-side como ancla de respaldo.');
      tryReveal();
      return;
    }

    console.warn('[WSP Sidebar] #pane-side no apareció tras quedar quieto; se muestra el estado nativo de WhatsApp.');
    revealed = true;
    clearInterval(failsafeInterval);
    root.removeAttribute('data-wsp-booting');
    root.dataset.wspReady = 'true';
  }

  function updateUI() {
    const panel = document.getElementById('wsp-sidebar-panel');
    if (!panel) return;
    const width = panel.querySelector('#wsp-width');
    const collapsed = panel.querySelector('#wsp-collapsed');
    width.value = state.width;
    collapsed.value = state.collapsed;
    panel.querySelector('#wsp-width-value').textContent = `${state.width}px`;
    panel.querySelector('#wsp-collapsed-value').textContent = `${state.collapsed}px`;
    panel.querySelectorAll('[data-mode]').forEach(btn => btn.setAttribute('aria-pressed', String(btn.dataset.mode === state.mode)));
    panel.dataset.mode = state.mode;
    panel.querySelector('#wsp-mode-hint').textContent = MODE_HINTS[state.mode];
    const phone = mobileMQ.matches;
    panel.querySelector('.wsp-phone').textContent = phone ? '🖥️ Volver a la vista normal' : '📱 Abrir como celular';
    panel.querySelector('.wsp-phone-hint').textContent = phone
      ? 'Toca un chat para abrirlo y usa ← para volver. 📌 Para dejar esta ventana siempre encima: Win + Ctrl + T (requiere PowerToys de Microsoft).'
      : 'Pasa WhatsApp a una ventana pequeña: lista y chat de uno en uno, con botón ← Volver.';
  }

  const MODE_HINTS = {
    normal: 'La lista siempre muestra nombres y mensajes con el ancho elegido.',
    icons: 'Solo se ven las fotos. Ideal para dar más espacio a la conversación.',
    auto: 'Se ve compacta y se abre sola al pasar el cursor sobre ella.'
  };

  // Aplica al instante; persiste solo cuando se pide (evita superar la cuota
  // de escrituras de storage.sync mientras se arrastra un slider).
  function save(partial, persist = true) {
    Object.assign(state, partial);
    applySettings();
    if (persist) chrome.storage.sync.set(partial).catch(() => {});
  }

  function placeRailControl() {
    const trigger = document.getElementById('wsp-sidebar-mini-control');
    if (!trigger) return;

    // La columna de la barra (hijo del layout que contiene la navegación) se
    // oculta en modo celular mientras se ve un chat, como en el teléfono.
    const layout = document.querySelector('[data-wsp-layout="true"]');
    const nav = document.querySelector('[data-testid="navbar-primary-section"]');
    const railColumn = layout && nav && [...layout.children].find(c => c.contains(nav));
    if (railColumn && !railColumn.hasAttribute('data-wsp-rail')) railColumn.setAttribute('data-wsp-rail', 'true');

    const all = [...document.querySelectorAll('button, [role="button"], [aria-label], [title]')];
    const meta = all.find(el => /meta\s*ai/i.test(`${el.getAttribute('aria-label') || ''} ${el.getAttribute('title') || ''} ${el.textContent || ''}`));
    if (!meta) {
      // En ventanas pequeñas WhatsApp oculta Meta AI y Canales: se coloca al
      // final de la sección superior de la barra.
      const primary = document.querySelector('[data-testid="navbar-primary-section"]');
      if (!primary) return;
      trigger.classList.add('wsp-in-rail', 'wsp-in-primary');
      if (primary.lastElementChild !== trigger) primary.append(trigger);
      return;
    }
    trigger.classList.remove('wsp-in-primary');
    const metaItem = meta.closest('button, [role="button"]') || meta;

    /* El wrapper directo de Meta AI es una fila angosta (flex-row) dedicada a
       ese único icono; insertar ahí produce superposición. La barra vertical
       real es el ancestro flex-column con varios íconos hermanos. */
    let railChild = metaItem;
    let rail = railChild.parentElement;
    while (rail && !(rail.children.length > 1 && getComputedStyle(rail).display === 'flex' && getComputedStyle(rail).flexDirection === 'column')) {
      railChild = rail;
      rail = rail.parentElement;
    }
    if (!rail) return;

    trigger.classList.add('wsp-in-rail');
    if (railChild.nextSibling !== trigger) rail.insertBefore(trigger, railChild.nextSibling);
  }

  // Coloca el panel pegado al botón que lo abrió (nunca en una esquina fija
  // de la ventana), con cabida para que no se salga de la pantalla ni
  // produzca scroll horizontal. Cálculo único al abrir, sin observers.
  function positionPanel(panel, trigger) {
    const r = trigger.getBoundingClientRect();
    const margin = 10;
    const pw = panel.offsetWidth;
    const ph = panel.offsetHeight;
    let left = r.right + 8;
    if (left + pw + margin > window.innerWidth) left = Math.max(margin, r.left - pw - 8);
    let top = r.top;
    if (top + ph + margin > window.innerHeight) top = Math.max(margin, window.innerHeight - ph - margin);
    panel.style.left = `${Math.round(left)}px`;
    panel.style.top = `${Math.round(top)}px`;
  }

  function buildControls() {
    if (controlsBuilt || !document.body || document.getElementById('wsp-sidebar-mini-control')) return;
    controlsBuilt = true;

    const trigger = document.createElement('button');
    trigger.id = 'wsp-sidebar-mini-control';
    trigger.type = 'button';
    trigger.title = 'Ajustar lista de chats';
    trigger.setAttribute('aria-label', 'Ajustar lista de chats');
    trigger.innerHTML = chatGearIcon(22);

    const panel = document.createElement('section');
    panel.id = 'wsp-sidebar-panel';
    panel.hidden = true;
    panel.setAttribute('aria-labelledby', 'wsp-panel-title');
    panel.innerHTML = `
      <div class="wsp-head">
        <span class="wsp-head-icon">${chatGearIcon(16)}</span>
        <strong id="wsp-panel-title">Ajustar chats</strong>
        <button type="button" class="wsp-close" aria-label="Cerrar">×</button>
      </div>
      <div class="wsp-section">
        <span class="wsp-row-label" id="wsp-mode-label">1. Elige cómo ver la lista</span>
        <div class="wsp-segmented" role="group" aria-labelledby="wsp-mode-label">
          <button type="button" class="wsp-seg" data-mode="normal" aria-pressed="false" title="Lista completa con ancho fijo">Fijo</button>
          <button type="button" class="wsp-seg" data-mode="icons" aria-pressed="false" title="Solo fotos de los chats">Iconos</button>
          <button type="button" class="wsp-seg" data-mode="auto" aria-pressed="false" title="Compacta, se abre al pasar el cursor">Auto</button>
        </div>
        <p class="wsp-hint" id="wsp-mode-hint" aria-live="polite"></p>
      </div>
      <div class="wsp-section">
        <span class="wsp-row-label">2. Ajusta el tamaño</span>
        <div class="wsp-field" data-field="width">
          <div class="wsp-row-label">
            <label for="wsp-width">Ancho de la lista</label>
            <span class="wsp-value" id="wsp-width-value"></span>
          </div>
          <input id="wsp-width" type="range" min="180" max="620" step="10">
        </div>
        <div class="wsp-field" data-field="collapsed">
          <div class="wsp-row-label">
            <label for="wsp-collapsed">Ancho en iconos</label>
            <span class="wsp-value" id="wsp-collapsed-value"></span>
          </div>
          <input id="wsp-collapsed" type="range" min="72" max="120" step="2">
        </div>
        <button type="button" class="wsp-reset">Restablecer valores</button>
      </div>
      <div class="wsp-section">
        <span class="wsp-row-label">3. Ventana tipo celular</span>
        <button type="button" class="wsp-phone"></button>
        <p class="wsp-hint wsp-phone-hint"></p>
      </div>`;

    document.body.append(trigger, panel);
    placeRailControl();

    function openPanel() {
      clearTimeout(panelHideTimer);
      panel.hidden = false;
      updateUI();
      positionPanel(panel, trigger);
      requestAnimationFrame(() => requestAnimationFrame(() => panel.classList.add('wsp-panel-open')));
    }

    function closePanel() {
      if (panel.hidden) return;
      panel.classList.remove('wsp-panel-open');
      clearTimeout(panelHideTimer);
      panelHideTimer = setTimeout(() => { panel.hidden = true; }, PANEL_ANIM_MS);
    }

    trigger.addEventListener('click', () => { panel.hidden ? openPanel() : closePanel(); });
    panel.querySelector('.wsp-close').addEventListener('click', () => { closePanel(); trigger.focus(); });
    const width = panel.querySelector('#wsp-width');
    const collapsed = panel.querySelector('#wsp-collapsed');
    width.addEventListener('input', () => save({ width: clamp(width.value, 180, 620) }, false));
    width.addEventListener('change', () => save({ width: clamp(width.value, 180, 620) }));
    collapsed.addEventListener('input', () => save({ collapsed: clamp(collapsed.value, 72, 120) }, false));
    collapsed.addEventListener('change', () => save({ collapsed: clamp(collapsed.value, 72, 120) }));
    panel.querySelectorAll('[data-mode]').forEach(btn => btn.addEventListener('click', () => save({ mode: btn.dataset.mode })));
    panel.querySelector('.wsp-reset').addEventListener('click', () => save({ ...DEFAULTS }));
    // Solo el service worker puede mover la pestaña a otra ventana.
    panel.querySelector('.wsp-phone').addEventListener('click', () => {
      chrome.runtime.sendMessage(mobileMQ.matches ? 'desktop' : 'phone').catch(() => {});
    });
    // Captura + stopPropagation: Esc cierra solo el panel, no el chat abierto de WhatsApp.
    window.addEventListener('keydown', e => {
      if (e.key === 'Escape' && !panel.hidden) { e.stopPropagation(); closePanel(); trigger.focus(); }
    }, true);
    // Clic fuera del panel lo cierra, para que nunca quede tapando la lista.
    document.addEventListener('pointerdown', e => {
      if (!panel.hidden && !panel.contains(e.target) && !trigger.contains(e.target)) closePanel();
    }, true);
    updateUI();
  }

  function scheduleDetection() {
    clearTimeout(scheduleDetection.timer);
    scheduleDetection.timer = setTimeout(() => {
      if (!controlsBuilt) buildControls();
      markSidebar();
      placeRailControl();
      ensureBackButton();
      updateView();
    }, 120);
  }

  mobileMQ.addEventListener('change', () => { updateView(); updateUI(); });
  // Tocar un chat de la lista (aunque sea el mismo que estaba abierto)
  // vuelve a mostrar la conversación.
  document.addEventListener('click', e => {
    if (forceList && e.target instanceof Element && e.target.closest('[role="row"], [role="listitem"], [role="gridcell"]')
      && e.target.closest('#pane-side, [data-testid="drawer-left"]')) {
      forceList = false;
      setTimeout(updateView, 50);
    }
  }, true);

  // Solo cuenta como "actividad estructural" lo que ocurre fuera de nuestros
  // propios controles; eso es lo único que el failsafe necesita vigilar para
  // decidir si WhatsApp sigue hidratando o si realmente se quedó quieto.
  function isOwnMutation(mut) {
    const t = mut.target;
    return t instanceof Element && !!t.closest('#wsp-sidebar-mini-control, #wsp-sidebar-panel');
  }

  function startStructuralObserver() {
    structureObserver = new MutationObserver((mutations) => {
      if (mutations.some(m => !isOwnMutation(m))) lastStructuralActivityAt = performance.now();
      scheduleDetection();
    });
    structureObserver.observe(root, { childList: true, subtree: true });
    window.addEventListener('resize', scheduleDetection, { passive: true });
  }

  chrome.storage.onChanged.addListener((changes, area) => {
    if (area !== 'sync') return;
    let changed = false;
    if (changes.width) { state.width = clamp(changes.width.newValue, 180, 620); changed = true; }
    if (changes.collapsed) { state.collapsed = clamp(changes.collapsed.newValue, 72, 120); changed = true; }
    if (changes.mode && ['normal', 'icons', 'auto'].includes(changes.mode.newValue)) {
      state.mode = changes.mode.newValue;
      changed = true;
    }
    if (changed) applySettings();
  });

  // Bootstrap: corre en cuanto el script se evalúa, sin esperar
  // DOMContentLoaded. document.documentElement ya existe siempre; body y
  // #pane-side pueden no existir todavía, por eso buildControls()/
  // markSidebar() se reintentan vía el observer y el primer scheduleDetection.
  root.dataset.wspBooting = 'true';
  bootStartedAt = performance.now();
  lastStructuralActivityAt = bootStartedAt;
  loadSettings();
  startStructuralObserver();
  failsafeInterval = setInterval(checkFailsafe, 500);
  scheduleDetection();
})();
