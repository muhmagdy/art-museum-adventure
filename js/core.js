/* Core engine: canvas, logical resolution, loop, input, scenes, timers & tweens. */
(function () {
  'use strict';
  const G = (window.G = window.G || {});

  G.PAL = {
    teal: '#345C59', cream: '#E8DCC5', terra: '#C77A47', gold: '#D9B85F',
    ink: '#24282a', night: '#0e1a22', deep: '#16282c',
  };
  G.FONT = "'Baloo Bhaijaan 2', Tahoma, 'Segoe UI', Arial, sans-serif";
  G.time = 0;

  // ---------- math helpers ----------
  G.clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
  G.lerp = (a, b, t) => a + (b - a) * t;
  G.dist = (x1, y1, x2, y2) => Math.hypot(x2 - x1, y2 - y1);
  G.ease = {
    linear: (t) => t,
    inOut: (t) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2),
    out: (t) => 1 - Math.pow(1 - t, 3),
    in: (t) => t * t * t,
    back: (t) => { const c1 = 1.70158, c3 = c1 + 1; return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2); },
  };
  G.rng = function (seed) {
    let a = (seed >>> 0) || 1;
    const f = function () {
      a |= 0; a = (a + 0x6d2b79f5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
    f.range = (lo, hi) => lo + f() * (hi - lo);
    f.int = (lo, hi) => Math.floor(lo + f() * (hi - lo + 1));
    f.pick = (arr) => arr[Math.floor(f() * arr.length)];
    return f;
  };

  // ---------- timers & tweens (cleared on scene change, which cancels cutscene scripts) ----------
  G.timers = [];
  G.tweens = [];
  G.wait = (s) => new Promise((r) => G.timers.push({ t: s, r }));
  G.tween = (obj, to, dur, ease) => new Promise((r) => {
    const from = {};
    for (const k in to) from[k] = obj[k];
    G.tweens.push({ obj, from, to, dur: Math.max(dur, 1e-4), t: 0, ease: ease || G.ease.inOut, r });
  });
  function stepTasks(dt) {
    const tm = G.timers; G.timers = [];
    for (const x of tm) { x.t -= dt; if (x.t <= 0) x.r(); else G.timers.push(x); }
    const tw = G.tweens; G.tweens = [];
    for (const x of tw) {
      x.t += dt;
      const k = Math.min(1, x.t / x.dur), e = x.ease(k);
      for (const p in x.to) x.obj[p] = x.from[p] + (x.to[p] - x.from[p]) * e;
      if (k >= 1) x.r(); else G.tweens.push(x);
    }
  }

  // ---------- canvas helpers ----------
  G.makeCanvas = function (w, h, res) {
    res = res || 1;
    const c = document.createElement('canvas');
    c.width = Math.max(1, Math.ceil(w * res));
    c.height = Math.max(1, Math.ceil(h * res));
    const ctx = c.getContext('2d');
    ctx.scale(res, res);
    c.lw = w; c.lh = h;
    return { c, ctx };
  };
  G.bgRes = () => G.clamp(G.scale * G.dpr, 0.75, 1.5);

  G.setDir = function (ctx) {
    try { ctx.direction = G.lang === 'ar' ? 'rtl' : 'ltr'; } catch (e) { /* unsupported */ }
  };
  // Latin art lettering (POW!, SOUP...) must not inherit the page's RTL direction
  G.ltr = function (ctx) { try { ctx.direction = 'ltr'; } catch (e) { /* unsupported */ } };
  G.text = function (ctx, str, x, y, size, color, o) {
    o = o || {};
    ctx.save();
    G.setDir(ctx);
    ctx.font = (o.weight || 700) + ' ' + size + 'px ' + G.FONT;
    ctx.textAlign = o.align || 'center';
    ctx.textBaseline = o.baseline || 'middle';
    if (o.maxW) {
      const w = ctx.measureText(str).width;
      if (w > o.maxW) { size = size * o.maxW / w; ctx.font = (o.weight || 700) + ' ' + size + 'px ' + G.FONT; }
    }
    if (o.stroke) { ctx.lineJoin = 'round'; ctx.lineWidth = o.strokeW || size * 0.18; ctx.strokeStyle = o.stroke; ctx.strokeText(str, x, y); }
    ctx.fillStyle = color;
    ctx.fillText(str, x, y);
    ctx.restore();
  };

  // ---------- scenes ----------
  G.Scene = class {
    enter() {} exit() {} update() {} draw() {} down() {} move() {} up() {} resize() {} onLang() {}
  };
  G.fade = { a: 0, dir: 0, next: null, color: '#000', speed: 0.35 };
  G.go = function (scene, opt) {
    opt = opt || {};
    if (!G.scene) { G.fade.next = scene; swap(); return; }
    if (G.fade.dir > 0) return;
    G.fade.next = scene; G.fade.dir = 1;
    G.fade.color = opt.color || '#000';
    G.fade.speed = opt.speed || 0.35;
  };
  function swap() {
    const s = G.fade.next; G.fade.next = null;
    if (G.scene) G.scene.exit();
    G.timers = []; G.tweens = [];
    G.pointer.down = false;
    G.ui.innerHTML = '';
    G.scene = s;
    G.buildHud(s.hud || {});
    s.enter();
  }

  // ---------- resize: the short side of the screen is always 720 logical units ----------
  G.resize = function () {
    const sw = window.innerWidth, sh = window.innerHeight;
    G.dpr = Math.min(window.devicePixelRatio || 1, 2);
    G.scale = Math.min(sw, sh) / 720;
    G.W = sw / G.scale;
    G.H = sh / G.scale;
    G.portrait = sh > sw * 1.05;
    G.canvas.width = Math.round(sw * G.dpr);
    G.canvas.height = Math.round(sh * G.dpr);
    G.canvas.style.width = sw + 'px';
    G.canvas.style.height = sh + 'px';
    document.documentElement.style.setProperty('--u', G.scale + 'px');
  };

  // ---------- input ----------
  G.pointer = { x: 0, y: 0, down: false, id: null };
  function toLogical(e) {
    const r = G.canvas.getBoundingClientRect();
    return { x: (e.clientX - r.left) / G.scale, y: (e.clientY - r.top) / G.scale };
  }
  function bindInput() {
    const c = G.canvas;
    c.addEventListener('pointerdown', (e) => {
      G.audio.unlock();
      if (G.pointer.down && e.pointerId !== G.pointer.id) return;
      if (G.fade.dir !== 0 || !G.scene) return;
      try { c.setPointerCapture(e.pointerId); } catch (err) { /* ignore */ }
      const p = toLogical(e);
      Object.assign(G.pointer, p, { down: true, id: e.pointerId });
      G.scene.down(p.x, p.y);
      e.preventDefault();
    });
    c.addEventListener('pointermove', (e) => {
      const p = toLogical(e);
      if (G.pointer.down && e.pointerId !== G.pointer.id) return;
      G.pointer.x = p.x; G.pointer.y = p.y;
      if (G.scene && G.fade.dir === 0) G.scene.move(p.x, p.y);
    });
    const up = (e) => {
      if (!G.pointer.down || e.pointerId !== G.pointer.id) return;
      const p = toLogical(e);
      G.pointer.down = false;
      if (G.scene) G.scene.up(p.x, p.y);
    };
    c.addEventListener('pointerup', up);
    c.addEventListener('pointercancel', up);
    c.addEventListener('contextmenu', (e) => e.preventDefault());
    document.addEventListener('gesturestart', (e) => e.preventDefault());
  }

  // ---------- main loop ----------
  let last = 0;
  function frame(now) {
    requestAnimationFrame(frame);
    let dt = last ? (now - last) / 1000 : 0.016;
    last = now;
    if (dt > 0.05) dt = 0.05;
    G.time += dt;
    const f = G.fade;
    if (f.dir > 0) { f.a += dt / f.speed; if (f.a >= 1) { f.a = 1; swap(); f.dir = -1; } }
    else if (f.dir < 0) { f.a -= dt / 0.4; if (f.a <= 0) { f.a = 0; f.dir = 0; } }
    stepTasks(dt);
    const ctx = G.ctx;
    if (G.scene) {
      G.scene.update(dt);
      ctx.setTransform(G.dpr * G.scale, 0, 0, G.dpr * G.scale, 0, 0);
      ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over';
      ctx.save();
      G.scene.draw(ctx);
      ctx.restore();
    }
    if (f.a > 0) {
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.globalAlpha = f.a; ctx.fillStyle = f.color;
      ctx.fillRect(0, 0, G.canvas.width, G.canvas.height);
      ctx.globalAlpha = 1;
    }
  }

  G.start = function (firstScene) {
    G.canvas = document.getElementById('game');
    G.ctx = G.canvas.getContext('2d');
    G.ui = document.getElementById('ui');
    G.resize();
    let rt = null;
    window.addEventListener('resize', () => {
      G.resize();
      clearTimeout(rt);
      rt = setTimeout(() => { G.resize(); if (G.scene) G.scene.resize(); }, 160);
    });
    bindInput();
    G.go(firstScene);
    requestAnimationFrame(frame);
  };
})();
