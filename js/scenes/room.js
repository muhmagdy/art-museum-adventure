/* A movement room with three paintings. Paintings pull the boy inside; finished ones reveal their title. */
(function () {
  'use strict';
  const G = window.G;
  const A = G.art;

  G.RoomScene = class extends G.Scene {
    constructor(ri, opt) { super(); this.ri = ri; this.opt = opt || {}; this.hud = { home: true }; }
    enter() {
      G.state.room = Math.max(G.state.room, this.ri);
      this.room = G.ROOMS[this.ri];
      G.audio.music(this.room.music);
      this.fx = new G.Particles();
      this.zoom = 1;
      this.busy = true;
      this.build();
      const L = this.L;
      this.boy = new G.Boy(L.doorX, L.walkY);
      this.cam = 0;
      if (this.opt.reveal != null) this.revealSeq(this.opt.reveal);
      else this.entrySeq();
    }
    build() {
      this.bg = G.renderRoomBg(this.ri, G.W, G.H);
      this.L = this.bg.L;
      this.thumbs = [0, 1, 2].map((i) => G.paintingImage(this.ri, i, this.L.pw, this.L.ph));
    }
    resize() {
      const ox = this.boy.x / this.L.RW;
      this.build();
      this.boy.y = this.L.walkY; this.boy.x = ox * this.L.RW; this.boy.stop();
      if (this.reveal) { this.reveal = null; this.afterReveal(); }
    }
    allDone() { return G.state.done[this.ri].every(Boolean); }

    async entrySeq() {
      const L = this.L, b = this.boy;
      this.doorOpen = 1;
      b.alpha = 0; b.s = 0.85;
      await Promise.all([G.tween(b, { alpha: 1, s: 1 }, 0.6), b.walkTo(L.doorX + 140, L.walkY, 200)]);
      G.tween(this, { doorOpen: 0 }, 0.6).then(() => G.audio.sfx('thud'));
      this.card = G.movementCard(this.room, { cls: 'bottom' });
      if (this.opt.retry) G.toast('back', 1800);
      this.busy = false;
      await G.wait(5);
      if (this.card) { this.card.classList.remove('show'); const c = this.card; setTimeout(() => c.remove(), 600); this.card = null; }
      if (!this.busy && !this.reveal) G.caption(null, { key: this.allDone() ? 'roomDone' : 'roomHint' });
    }

    async revealSeq(pi) {
      const L = this.L, b = this.boy, p = this.room.paintings[pi];
      const px = L.xs[pi], pcy = L.py + L.ph / 2;
      this.cam = this.camFor(px);
      b.x = px; b.y = pcy + 40; b.s = 0.15; b.alpha = 0; b.rot = 3;
      this.glowP = pi;
      G.audio.sfx('portalOut');
      await G.wait(0.3);
      this.fx.burst(px, pcy, 40, ['#D9B85F', '#E8DCC5', '#fff'], { speed: 260, gravity: 0, life: 0.9, shape: 'star', size: 6 });
      await G.tween(b, { alpha: 1, s: 1, y: L.walkY, rot: 0 }, 0.9, G.ease.out);
      this.glowP = null;
      b.mood = 'wonder';
      await G.tween(b, { armsUp: 1 }, 0.3);
      this.bubble = G.t('wow');
      G.audio.sfx('sparkle');
      const lines = G.paintingTitleLines(p);
      const maxW = Math.min(G.W * 0.9, 920);
      const cy = Math.max(110 + 90, L.py - 40 - 86);
      this.reveal = new G.LetterReveal(
        [{ text: lines[0], size: 62, color: '#D9B85F' }, { text: lines[1], size: 40, color: '#E8DCC5' }],
        G.W / 2, cy, maxW, { x: b.x - this.cam, y: b.y - 130 }, p.items.map((it) => it.icon));
      G.audio.sfx('whoosh');
      await new Promise((res) => { const chk = () => (this.reveal && !this.reveal.done ? G.wait(0.1).then(chk) : res()); chk(); });
      if (!this.reveal) return;
      G.caption(G.tr(p.fact));
      this.waitTap = true;
      this.factP = p;
    }
    afterReveal() {
      this.waitTap = false; this.reveal = null; this.bubble = null; this.factP = null;
      this.boy.mood = 'happy'; G.tween(this.boy, { armsUp: 0 }, 0.3);
      G.caption(null, { key: this.allDone() ? 'roomDone' : 'roomHint' });
      this.busy = false;
    }

    camFor(x) { return this.L.RW <= G.W ? (this.L.RW - G.W) / 2 : G.clamp(x - G.W / 2, 0, this.L.RW - G.W); }

    down(sx, sy) {
      if (this.waitTap) { if (this.reveal && this.reveal.done) this.afterReveal(); return; }
      if (this.busy) return;
      const L = this.L, x = sx + this.cam, y = sy;
      // paintings
      for (let i = 0; i < 3; i++) {
        const px = L.xs[i];
        if (x > px - L.pw / 2 - 30 && x < px + L.pw / 2 + 30 && y > L.py - 30 && y < L.py + L.ph + 70) {
          if (G.state.done[this.ri][i]) { G.toast('explored', 1400); G.audio.sfx('tap'); return; }
          this.enterPainting(i);
          return;
        }
      }
      // door back to the hall
      if (Math.abs(x - L.doorX) < 90 && y > L.floorY - 270 && y < L.floorY + 40) {
        if (this.allDone()) { this.leave(); return; }
        G.audio.sfx('thud');
      }
      if (y > L.floorY - 40) {
        this.boy.walkTo(G.clamp(x, 60, L.RW - 60), L.walkY);
        this.fx.burst(x, L.walkY, 6, ['#E8DCC5'], { speed: 60, gravity: 0, life: 0.4, size: 3 });
      }
    }
    async enterPainting(i) {
      this.busy = true;
      G.clearCaption();
      if (this.card) { this.card.remove(); this.card = null; }
      const L = this.L, b = this.boy, px = L.xs[i], pcy = L.py + L.ph / 2;
      await b.walkTo(px, L.walkY);
      b.face = 1; b.mood = 'wonder';
      this.glowP = i;
      G.audio.sfx('portalIn');
      this.zcx = px; this.zcy = pcy;
      G.tween(b, { y: pcy + 60, s: 0.2, rot: 6, alpha: 0.2 }, 1.1, G.ease.in);
      await G.wait(0.4);
      await G.tween(this, { zoom: 4.5 }, 1.0, G.ease.in);
      G.go(new G.WorldScene(this.ri, i), { color: '#fff7e0', speed: 0.25 });
    }
    async leave() {
      this.busy = true;
      G.clearCaption();
      const L = this.L, b = this.boy;
      b.mood = 'sneak';
      await b.walkTo(L.doorX, L.walkY);
      G.audio.sfx('door');
      await G.tween(this, { doorOpen: 0.7 }, 0.5);
      await G.tween(b, { alpha: 0, y: L.floorY + 10, s: 0.85 }, 0.5);
      G.go(new G.HallScene('sneak', this.ri));
    }

    update(dt) {
      this.boy.update(dt);
      this.fx.update(dt);
      if (this.reveal) this.reveal.update(dt);
      const want = this.camFor(this.boy.x);
      if (this.reveal || this.zoom > 1) { /* keep camera still */ } else this.cam += (want - this.cam) * Math.min(1, dt * 4);
    }
    onLang() { if (this.bubble) this.bubble = G.t('wow'); if (this.factP) G.caption(G.tr(this.factP.fact)); G.refreshCards(); }

    draw(ctx) {
      const L = this.L;
      ctx.fillStyle = '#0e1a22'; ctx.fillRect(0, 0, G.W, G.H);
      ctx.save();
      if (this.zoom > 1) {
        const sx = this.zcx - this.cam, sy = this.zcy;
        const k = (this.zoom - 1) / 3.5;
        ctx.translate(G.lerp(sx, G.W / 2, k), G.lerp(sy, G.H / 2, k)); ctx.scale(this.zoom, this.zoom); ctx.translate(-sx, -sy);
      }
      ctx.translate(-Math.round(this.cam), 0);
      ctx.drawImage(this.bg, 0, 0, L.RW, G.H);
      // entrance door state
      if (this.doorOpen > 0 || this.allDone()) {
        A.door(ctx, L.doorX, L.floorY + 4, 150, 250, { open: this.doorOpen || 0, glow: this.allDone() && !this.busy ? 0.7 + 0.3 * Math.sin(G.time * 4) : 0 });
      }
      // paintings
      for (let i = 0; i < 3; i++) {
        const px = L.xs[i], done = G.state.done[this.ri][i];
        if (this.glowP === i || (!done && !this.busy)) A.glow(ctx, px, L.py + L.ph / 2, L.pw * (this.glowP === i ? 1.3 : 0.85), 'rgba(255,220,150,' + (this.glowP === i ? 0.7 : 0.18 + 0.12 * Math.sin(G.time * 3 + i)) + ')');
        A.frame(ctx, px - L.pw / 2, L.py, L.pw, L.ph, this.thumbs[i]);
        const p = this.room.paintings[i];
        if (done) {
          A.plaque(ctx, px, L.py + L.ph + 48, G.tr(p.title), 18, true);
          ctx.fillStyle = '#2e8b57'; A.circle(ctx, px + L.pw / 2 + 4, L.py - 4, 16); ctx.fill();
          ctx.strokeStyle = '#fff'; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(px + L.pw / 2 - 4, L.py - 4); ctx.lineTo(px + L.pw / 2 + 1, L.py + 2); ctx.lineTo(px + L.pw / 2 + 12, L.py - 10); ctx.stroke();
        } else A.plaque(ctx, px, L.py + L.ph + 48, '?', 18, false);
      }
      if (this.zoom > 1) { ctx.globalAlpha = G.clamp((this.zoom - 1) / 3.5, 0, 1); ctx.drawImage(this.thumbs[this.glowP], L.xs[this.glowP] - L.pw / 2, L.py, L.pw, L.ph); ctx.globalAlpha = 1; }
      this.boy.draw(ctx);
      if (this.bubble) G.bubble(ctx, this.boy.x + 30, this.boy.y - 215, this.bubble, 34);
      this.fx.draw(ctx);
      ctx.restore();
      // room name banner, pinned to the screen
      if (this.zoom <= 1) {
        const bw = Math.min(520, G.W - 220), by = G.portrait ? 132 : this.bg.bannerY;
        ctx.fillStyle = 'rgba(14,26,34,0.65)'; A.rrect(ctx, G.W / 2 - bw / 2, by - 34, bw, 68, 34); ctx.fill();
        ctx.strokeStyle = G.PAL.gold; ctx.lineWidth = 3; ctx.stroke();
        G.text(ctx, G.tr(this.room.name), G.W / 2, by + 2, 38, '#D9B85F', { maxW: bw - 40 });
      }
      if (this.reveal) this.reveal.draw(ctx);
    }
  };
})();
