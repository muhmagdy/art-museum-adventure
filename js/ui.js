/* DOM overlay: HUD buttons, captions, panels, modal. All text is localised via data-i18n. */
(function () {
  'use strict';
  const G = window.G;

  const ICON = {
    home: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 11.5 12 4l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z" fill="currentColor"/></svg>',
    soundOn: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9h4l5-4v14l-5-4H4z" fill="currentColor"/><path d="M16 8.5a5 5 0 0 1 0 7M18.5 6a8.5 8.5 0 0 1 0 12" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round"/></svg>',
    soundOff: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9h4l5-4v14l-5-4H4z" fill="currentColor"/><path d="m16 9 6 6m0-6-6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
    hint: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2a7 7 0 0 0-4 12.7V17h8v-2.3A7 7 0 0 0 12 2zM9 19h6v1.5a1.5 1.5 0 0 1-1.5 1.5h-3A1.5 1.5 0 0 1 9 20.5z" fill="currentColor"/></svg>',
    timer: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="13" r="8" stroke="currentColor" stroke-width="2.2" fill="none"/><path d="M12 9v4l3 2M9 2h6" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/></svg>',
  };
  G.ICON_SVG = ICON;

  G.el = function (tag, cls, parent, html) {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html != null) e.innerHTML = html;
    (parent || G.ui).appendChild(e);
    return e;
  };
  G.txt = function (tag, cls, key, parent) {
    const e = G.el(tag, cls, parent);
    e.dataset.i18n = key;
    e.textContent = G.t(key);
    return e;
  };
  G.button = function (key, cls, onClick, parent) {
    const b = G.txt('button', 'btn ia ' + (cls || ''), key, parent);
    b.type = 'button';
    b.addEventListener('click', (e) => { e.stopPropagation(); G.audio.unlock(); G.audio.sfx('click'); onClick(e); });
    return b;
  };
  function iconBtn(svg, label, onClick, parent) {
    const b = G.el('button', 'ibtn ia', parent, svg);
    b.type = 'button';
    b.setAttribute('aria-label', label);
    b.addEventListener('click', (e) => { e.stopPropagation(); G.audio.unlock(); G.audio.sfx('click'); onClick(b); });
    return b;
  }

  G.buildHud = function (o) {
    const bar = G.el('div', 'hud');
    const start = G.el('div', 'hud-side', bar);
    G.el('div', 'hud-mid', bar);
    const end = G.el('div', 'hud-side', bar);
    if (o.home) iconBtn(ICON.home, G.t('home'), () => G.confirm(G.t('leaveQ'), () => { G.state = G.newState(); G.go(new G.TitleScene()); }), start);
    const lang = G.el('button', 'ibtn lang ia', end);
    lang.type = 'button';
    lang.dataset.i18n = 'langBtn';
    lang.textContent = G.t('langBtn');
    lang.addEventListener('click', (e) => { e.stopPropagation(); G.audio.unlock(); G.audio.sfx('click'); G.setLang(G.lang === 'ar' ? 'en' : 'ar'); });
    const snd = iconBtn(G.audio.muted ? ICON.soundOff : ICON.soundOn, G.t('sound'), (b) => {
      G.audio.setMuted(!G.audio.muted);
      b.innerHTML = G.audio.muted ? ICON.soundOff : ICON.soundOn;
    }, end);
    G.hud = { bar, start, mid: bar.children[1], end, snd };
  };

  G.caption = function (text, o) {
    o = o || {};
    G.clearCaption();
    const c = G.el('div', 'caption ' + (o.cls || ''));
    if (o.key) { c.dataset.i18n = o.key; c.textContent = G.t(o.key); } else c.textContent = text;
    G._caption = c;
    requestAnimationFrame(() => c.classList.add('show'));
    return c;
  };
  G.clearCaption = function () {
    if (G._caption) { const c = G._caption; c.classList.remove('show'); setTimeout(() => c.remove(), 300); G._caption = null; }
  };

  G.toast = function (key, ms) {
    const t = G.txt('div', 'toast', key);
    requestAnimationFrame(() => t.classList.add('show'));
    setTimeout(() => { t.classList.remove('show'); setTimeout(() => t.remove(), 400); }, ms || 2200);
    return t;
  };

  G.confirm = function (msg, onYes) {
    const back = G.el('div', 'modal-back ia');
    const box = G.el('div', 'modal', back);
    G.el('p', '', box).textContent = msg;
    const row = G.el('div', 'row', box);
    G.button('yes', 'primary', () => { back.remove(); onYes(); }, row);
    G.button('no', '', () => back.remove(), row);
    back.addEventListener('click', (e) => { if (e.target === back) back.remove(); });
  };

  // card that reveals an art movement (title + description)
  G.movementCard = function (room, o) {
    o = o || {};
    const card = G.el('div', 'mcard ' + (o.cls || ''));
    const h = G.el('h2', '', card); h.textContent = G.tr(room.name);
    const p = G.el('p', '', card); p.textContent = G.tr(room.desc);
    card._room = room;
    requestAnimationFrame(() => card.classList.add('show'));
    return card;
  };
  G.refreshCards = function () {
    document.querySelectorAll('.mcard').forEach((c) => { if (c._room) { c.children[0].textContent = G.tr(c._room.name); c.children[1].textContent = G.tr(c._room.desc); } });
  };
})();
