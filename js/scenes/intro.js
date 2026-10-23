/* Intro story: three illustrated, lightly animated panels. */
(function () {
  'use strict';
  const G = window.G;
  const A = G.art;

  G.IntroScene = class extends G.Scene {
    constructor() { super(); this.hud = {}; this.panel = -1; }
    enter() {
      G.audio.music('night');
      G.button('skip', 'skip', () => this.finish());
      this.tap = G.txt('div', 'tap-hint', 'tapContinue');
      this.next();
    }
    finish() { G.go(new G.HallScene('chase')); }
    next() {
      this.panel++;
      if (this.panel > 2) { this.finish(); return; }
      this.pt = 0;
      G.audio.sfx('page');
      G.caption(null, { key: 'intro' + (this.panel + 1), cls: 'intro-cap' });
      const b = (this.boy = new G.Boy(0, 0));
      this.guard = null;
      const gy = G.H * 0.8;
      if (this.panel === 0) {
        b.x = -60; b.y = G.H * 0.93; b.s = 0.8;
        b.walkTo(G.W * 0.3, null, 160).then(() => { b.mood = 'wonder'; });
      } else if (this.panel === 1) {
        b.x = G.W * 0.12; b.y = gy + 40; b.crouch = 1; b.mood = 'sneak';
        G.wait(0.6).then(() => b.walkTo(G.W * 0.56, null, 200)).then(() => G.tween(b, { alpha: 0 }, 0.6));
      } else {
        b.x = G.W * 0.3; b.y = gy + 40; b.mood = 'sneak'; b.face = 1;
        const g = (this.guard = new G.Guard(G.W + 120, gy + 50));
        g.face = -1; g.beamAng = Math.PI;
        g.walkTo(G.W * 0.74, null, 180).then(() => {
          G.audio.sfx('whistle'); G.audio.sfx('alert');
          g.mood = 'angry'; g.bubble = G.t('hey'); b.mood = 'scared'; b.bubble = '!';
        });
      }
    }
    down() { if (this.pt > 0.5) this.next(); }
    update(dt) {
      this.pt += dt;
      this.boy.update(dt);
      if (this.guard) this.guard.update(dt);
    }
    onLang() { if (this.guard && this.guard.bubble) this.guard.bubble = G.t('hey'); }
    draw(ctx) {
      const W = G.W, H = G.H;
      if (this.panel === 0) {
        A.museumNight(ctx, W, H, G.time);
      } else if (this.panel === 1) {
        // side wall of the museum with a door left ajar
        A.vgrad(ctx, 0, 0, W, H, ['#0b1622', '#14283a']);
        A.stars(ctx, G.rng(3), W, H * 0.3, 60, G.time);
        const gy = H * 0.8;
        ctx.fillStyle = '#2c4b4c'; ctx.fillRect(0, H * 0.25, W, gy - H * 0.25);
        ctx.strokeStyle = 'rgba(0,0,0,0.25)'; ctx.lineWidth = 2;
        for (let y = H * 0.25, row = 0; y < gy; y += 40, row++) for (let x = (row % 2) * 50; x < W; x += 100) ctx.strokeRect(x, y, 100, 40);
        ctx.fillStyle = '#3f6462'; ctx.fillRect(0, H * 0.25 - 16, W, 16);
        const dx = W * 0.6;
        A.glow(ctx, dx, gy - 110, 260, 'rgba(255,200,120,0.5)');
        ctx.fillStyle = '#ffd98f'; ctx.fillRect(dx - 60, gy - 230, 120, 230);
        ctx.fillStyle = '#4e301b'; A.poly(ctx, [dx - 60, gy - 230, dx - 10, gy - 250, dx - 10, gy + 14, dx - 60, gy]); ctx.fill();
        ctx.fillStyle = 'rgba(255,214,140,0.25)'; A.poly(ctx, [dx - 10, gy, dx + 60, gy, dx + 220, H, dx - 60, H]); ctx.fill();
        A.vgrad(ctx, 0, gy, W, H - gy, ['#18302f', '#0f2020']);
        ctx.fillStyle = 'rgba(255,214,140,0.18)'; A.poly(ctx, [dx - 10, gy, dx + 60, gy, dx + 240, H, dx - 40, H]); ctx.fill();
        A.moon(ctx, W * 0.85, H * 0.12, 34);
      } else {
        // dark corridor, flashlight
        const gy = H * 0.8;
        A.vgrad(ctx, 0, 0, W, gy, ['#0d1a1c', '#16282a']);
        for (let x = 80; x < W; x += 300) A.column(ctx, x, gy, Math.min(gy - 20, 500));
        A.vgrad(ctx, 0, gy, W, H - gy, ['#3a2618', '#24170e']);
        ctx.fillStyle = 'rgba(0,0,0,0.45)'; ctx.fillRect(0, 0, W, H);
      }
      if (this.panel === 2 && this.guard) {
        const g = this.guard, tp = G.guardTorch(g);
        const ang = Math.atan2(this.boy.y - 100 - tp.y, this.boy.x - tp.x);
        G.drawBeam(ctx, tp.x, tp.y, ang, G.dist(tp.x, tp.y, this.boy.x, this.boy.y) + 160, 0.32, 1);
        g.draw(ctx);
      }
      this.boy.draw(ctx);
      if (this.boy.bubble) G.bubble(ctx, this.boy.x, this.boy.y - 215 * this.boy.s, this.boy.bubble, 40);
      // panel border
      ctx.strokeStyle = G.PAL.gold; ctx.lineWidth = 8; ctx.strokeRect(4, 4, W - 8, H - 8);
    }
  };
})();
