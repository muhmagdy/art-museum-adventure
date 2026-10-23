/* Visual effects: particle bursts and the "items spell the title" reveal. */
(function () {
  'use strict';
  const G = window.G;
  const A = G.art;

  // ---------- simple particle system ----------
  G.Particles = class {
    constructor() { this.list = []; }
    burst(x, y, n, colors, o) {
      o = o || {};
      for (let i = 0; i < n; i++) {
        const a = o.angle != null ? o.angle + (Math.random() - 0.5) * (o.spread || 6.28) : Math.random() * 6.28;
        const sp = (o.speed || 200) * (0.3 + Math.random() * 0.9);
        this.list.push({
          x, y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, life: (o.life || 1) * (0.6 + Math.random() * 0.6), t: 0,
          size: (o.size || 5) * (0.5 + Math.random()), color: colors[(Math.random() * colors.length) | 0],
          g: o.gravity == null ? 300 : o.gravity, shape: o.shape || 'dot', rot: Math.random() * 6, vr: (Math.random() - 0.5) * 10,
        });
      }
    }
    update(dt) {
      this.list = this.list.filter((p) => {
        p.t += dt; p.x += p.vx * dt; p.y += p.vy * dt; p.vy += p.g * dt; p.vx *= 0.99; p.rot += p.vr * dt;
        return p.t < p.life;
      });
    }
    draw(ctx) {
      for (const p of this.list) {
        ctx.globalAlpha = Math.max(0, 1 - p.t / p.life);
        ctx.fillStyle = p.color;
        if (p.shape === 'rect') { ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot); ctx.fillRect(-p.size, -p.size / 2, p.size * 2, p.size); ctx.restore(); }
        else if (p.shape === 'star') { ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot); ctx.fillRect(-p.size, -1, p.size * 2, 2); ctx.fillRect(-1, -p.size, 2, p.size * 2); ctx.restore(); }
        else { A.circle(ctx, p.x, p.y, p.size); ctx.fill(); }
      }
      ctx.globalAlpha = 1;
    }
  };

  // ---------- items fly out and arrange themselves into text ----------
  G.LetterReveal = class {
    constructor(lines, cx, cy, maxW, from, icons, o) {
      o = o || {};
      this.t = 0; this.cx = cx; this.cy = cy; this.done = false;
      this.colors = o.colors || ['#D9B85F', '#E8DCC5', '#f6e6b0', '#C77A47', '#ffffff'];
      const pad = 16;
      // fit lines into maxW
      const tmp = G.makeCanvas(10, 10, 1).ctx;
      const fitted = lines.map((L) => {
        let size = L.size;
        tmp.font = '800 ' + size + 'px ' + G.FONT;
        const w = tmp.measureText(L.text).width;
        if (w > maxW) size = Math.floor(size * maxW / w);
        return Object.assign({}, L, { size });
      });
      const gap = 10;
      const totalH = fitted.reduce((s, L) => s + L.size * 1.25, 0) + gap * (fitted.length - 1);
      const cw = maxW + pad * 2, chh = totalH + pad * 2;
      const res = Math.min(2, G.scale * G.dpr);
      const tc = G.makeCanvas(cw, chh, res);
      const ctx = tc.ctx;
      G.setDir(ctx);
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      let y = pad;
      for (const L of fitted) {
        ctx.font = '800 ' + L.size + 'px ' + G.FONT;
        const yy = y + L.size * 0.62;
        ctx.lineJoin = 'round'; ctx.lineWidth = L.size * 0.16; ctx.strokeStyle = 'rgba(20,28,32,0.9)';
        ctx.strokeText(L.text, cw / 2, yy);
        ctx.fillStyle = L.color || '#D9B85F'; ctx.fillText(L.text, cw / 2, yy);
        y += L.size * 1.25 + gap;
      }
      this.img = tc.c; this.iw = cw; this.ih = chh;
      // sample points from a plain fill version
      const sc = G.makeCanvas(cw, chh, 1);
      const sctx = sc.ctx; G.setDir(sctx);
      sctx.textAlign = 'center'; sctx.textBaseline = 'middle'; sctx.fillStyle = '#fff';
      y = pad;
      for (const L of fitted) { sctx.font = '800 ' + L.size + 'px ' + G.FONT; sctx.fillText(L.text, cw / 2, y + L.size * 0.62); y += L.size * 1.25 + gap; }
      const data = sctx.getImageData(0, 0, sc.c.width, sc.c.height).data;
      let step = 3, pts = [];
      for (;;) {
        pts = [];
        for (let yy = 0; yy < sc.c.height; yy += step) for (let xx = 0; xx < sc.c.width; xx += step) if (data[(yy * sc.c.width + xx) * 4 + 3] > 128) pts.push([xx, yy]);
        if (pts.length <= 1800 || step > 8) break;
        step++;
      }
      this.left = cx - cw / 2; this.top = cy - chh / 2;
      // icons pop out of the boy into an arc, then dissolve into letters
      const n = icons.length;
      this.icons = icons.map((name, i) => {
        const a = Math.PI + (i + 0.5) / n * Math.PI;
        return { name, x0: from.x, y0: from.y, x1: from.x + Math.cos(a) * 150, y1: from.y - 60 + Math.sin(a) * 110, x: from.x, y: from.y };
      });
      const rtl = G.lang === 'ar';
      this.parts = pts.map((p, i) => {
        const order = rtl ? 1 - p[0] / cw : p[0] / cw;
        return {
          src: i % Math.max(1, n), tx: this.left + p[0], ty: this.top + p[1],
          delay: 1.1 + order * 1.4 + Math.random() * 0.25, dur: 0.9 + Math.random() * 0.3,
          c: this.colors[(Math.random() * this.colors.length) | 0], bend: (Math.random() - 0.5) * 220,
        };
      });
      this.end = 1.1 + 1.4 + 0.25 + 1.2;
      this.sparkled = false;
    }
    update(dt) {
      this.t += dt;
      const k = G.ease.back(G.clamp(this.t / 0.8, 0, 1));
      for (const ic of this.icons) { ic.x = G.lerp(ic.x0, ic.x1, k); ic.y = G.lerp(ic.y0, ic.y1, k) + Math.sin(this.t * 3 + ic.x1) * 4; }
      if (this.t > this.end && !this.sparkled) { this.sparkled = true; G.audio.sfx('wow'); }
      if (this.t > this.end + 0.6) this.done = true;
    }
    draw(ctx) {
      const t = this.t;
      // panel behind text
      const pa = G.clamp((t - this.end + 0.4) / 0.6, 0, 1);
      if (pa > 0) {
        ctx.save(); ctx.globalAlpha = pa * 0.75; ctx.fillStyle = '#0e1a22';
        A.rrect(ctx, this.left - 10, this.top - 6, this.iw + 20, this.ih + 12, 24); ctx.fill();
        ctx.globalAlpha = pa; ctx.strokeStyle = 'rgba(217,184,95,0.8)'; ctx.lineWidth = 3; ctx.stroke(); ctx.restore();
      }
      // icons
      for (let i = 0; i < this.icons.length; i++) {
        const ic = this.icons[i];
        const a = 1 - G.clamp((t - 1.1 - i * 0.12) / 1.2, 0, 1);
        if (a <= 0) continue;
        ctx.globalAlpha = a;
        A.glow(ctx, ic.x, ic.y, 50, 'rgba(255,230,160,0.6)');
        G.drawIcon(ctx, ic.name, ic.x, ic.y, 60 * (0.4 + 0.6 * G.clamp(t / 0.5, 0, 1)));
      }
      ctx.globalAlpha = 1;
      // particles
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      const fadeP = 1 - G.clamp((t - this.end) / 0.8, 0, 0.85);
      for (const p of this.parts) {
        const k = (t - p.delay) / p.dur;
        if (k <= 0) continue;
        const e = G.ease.inOut(Math.min(1, k));
        const ic = this.icons[p.src] || this.icons[0];
        const sx = ic ? ic.x : this.cx, sy = ic ? ic.y : this.cy;
        const mx = (sx + p.tx) / 2 + p.bend, my = Math.min(sy, p.ty) - 80;
        const x = (1 - e) * (1 - e) * sx + 2 * (1 - e) * e * mx + e * e * p.tx;
        const y = (1 - e) * (1 - e) * sy + 2 * (1 - e) * e * my + e * e * p.ty;
        ctx.globalAlpha = fadeP * (k >= 1 ? 0.6 + 0.4 * Math.sin(t * 6 + p.tx) : 1);
        ctx.fillStyle = p.c;
        ctx.fillRect(x - 1.6, y - 1.6, 3.2, 3.2);
      }
      ctx.restore();
      // crisp text
      const ta = G.clamp((t - this.end + 0.2) / 0.6, 0, 1);
      if (ta > 0) { ctx.globalAlpha = ta; ctx.drawImage(this.img, this.left, this.top, this.iw, this.ih); ctx.globalAlpha = 1; }
    }
  };
})();
