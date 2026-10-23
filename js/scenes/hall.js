/* Main hall: the opening chase, and sneaking past the patrolling guard between rooms. */
(function () {
  'use strict';
  const G = window.G;
  const A = G.art;
  const HL = A.HALL;

  G.HallScene = class extends G.Scene {
    // mode 'chase' | 'sneak'; from = room index the boy leaves (sneak)
    constructor(mode, from) { super(); this.mode = mode; this.from = from || 0; this.hud = { home: true }; }
    enter() {
      G.audio.music(this.mode === 'chase' ? 'tension' : 'night');
      if (this.mode === 'chase') G.audio.setParam('urgency', 0.4);
      this.doors = [0, 0, 0, 0, 0, 0].map(() => ({ open: 0 }));
      this.layout();
      const y = this.walkY;
      this.boy = new G.Boy(0, y);
      this.guard = new G.Guard(0, y + 6);
      this.cam = 0;
      this.camTarget = null;
      G.button('skip', 'skip', () => this.finish());
      if (this.mode === 'chase') this.chase(); else this.sneak();
    }
    layout() {
      const SH = Math.min(G.H, 1000);
      this.floorY = G.H / 2 + SH * 0.22;
      this.walkY = this.floorY + 64;
      const res = G.bgRes();
      const { c, ctx } = G.makeCanvas(HL.width, G.H, res);
      A.hallBg(ctx, HL.width, G.H, this.floorY);
      this.bg = c;
      this.statues = [];
      for (let i = 0; i < 4; i++) this.statues.push((HL.doorX[i] + HL.doorX[i + 1]) / 2);
      this.statues.push((HL.doorX[4] + HL.exitX) / 2);
    }
    resize() {
      const oldY = this.walkY; this.layout();
      const dy = this.walkY - oldY; this.boy.y += dy; this.guard.y += dy;
      if (this.boy.target) this.boy.target.y += dy;
      if (this.guard.target) this.guard.target.y += dy;
    }
    doorX(i) { return i >= 5 ? HL.exitX : HL.doorX[i]; }
    finish() {
      if (this.done) return; this.done = true;
      if (this.mode === 'chase') G.go(new G.RoomScene(0, { intro: true }));
      else G.go(new G.PuzzleScene(this.from + 1));
    }

    async chase() {
      const b = this.boy, g = this.guard;
      b.x = HL.exitX + 150; b.run = true; b.mood = 'scared'; b.face = -1;
      g.x = HL.exitX + 520; g.face = -1; g.mood = 'angry';
      this.doors[0].open = 1;
      G.caption(null, { key: 'chase1' });
      this.camTarget = b;
      g.walkTo(HL.doorX[0] + 300, null, 300);
      await b.walkTo(HL.doorX[1], null, 420);
      G.caption(null, { key: 'chase2' });
      await b.walkTo(HL.doorX[0], null, 420);
      // into the open door
      b.run = false; b.walking = false;
      this.camTarget = null; this.camFixed = HL.doorX[0] + 160;
      await G.tween(b, { y: this.floorY + 10, s: 0.82, alpha: 0 }, 0.5);
      G.audio.sfx('door');
      await G.tween(this.doors[0], { open: 0 }, 0.8);
      G.audio.sfx('thud');
      await new Promise((res) => { const chk = () => (g.target ? G.wait(0.1).then(chk) : res()); chk(); });
      g.mood = 'puzzled'; g.bubble = '?';
      G.caption(null, { key: 'chase3' });
      for (let i = 0; i < 4; i++) { await G.wait(0.55); g.face *= -1; }
      g.bubble = null; g.mood = 'patrol';
      G.audio.music('night');
      await g.walkTo(HL.doorX[0] + 1300, null, 150);
      G.caption(null, { key: 'chase4' });
      await G.wait(3.2);
      this.finish();
    }

    async sneak() {
      const b = this.boy, g = this.guard;
      const from = this.from, to = from + 1;
      const fx = this.doorX(from), tx = this.doorX(to), hide = this.statues[from];
      b.x = fx; b.y = this.floorY + 10; b.alpha = 0; b.s = 0.85; b.mood = 'sneak'; b.face = 1;
      g.x = tx + 650; g.face = -1; g.beamAng = Math.PI; g.sound = true; g.vol = 0.6;
      this.camTarget = b;
      G.caption(null, { key: to === 5 ? 'sneakExit' : 'sneak' });
      G.audio.sfx('door');
      await G.tween(this.doors[from], { open: 0.6 }, 0.5);
      await Promise.all([G.tween(b, { alpha: 1, s: 1 }, 0.4), b.walkTo(fx + 10, this.walkY, 160)]);
      G.tween(this.doors[from], { open: 0 }, 0.6).then(() => G.audio.sfx('thud'));
      b.crouch = 1;
      g.walkTo(hide + 330, null, 120);
      await b.walkTo(hide, null, 260);
      b.face = 1; b.mood = 'scared';
      // the guard sweeps his flashlight while the boy hides behind the statue
      await new Promise((res) => { const chk = () => (g.target ? G.wait(0.1).then(chk) : res()); chk(); });
      this.sweep = 0;
      await G.tween(this, { sweep: 1 }, 2.2, G.ease.linear);
      this.sweep = null;
      g.mood = 'puzzled'; g.bubble = '?';
      await G.wait(0.7);
      g.bubble = null; g.mood = 'patrol';
      g.walkTo(tx + 1200, null, 140);
      await G.wait(0.9);
      b.mood = 'sneak';
      await b.walkTo(tx, null, 240);
      b.crouch = 0; b.face = 1;
      await G.wait(0.4);
      this.finish();
    }

    update(dt) {
      this.boy.update(dt);
      this.guard.update(dt);
      if (this.sweep != null) this.guard.beamAng = Math.PI + Math.sin(this.sweep * Math.PI * 3) * 0.35;
      else this.guard.beamAng = this.guard.face > 0 ? 0.12 : Math.PI - 0.12;
      const target = this.camTarget ? this.camTarget.x : (this.camFixed || this.boy.x);
      const desired = G.W >= HL.width ? (HL.width - G.W) / 2 : G.clamp(target - G.W / 2, 0, HL.width - G.W);
      this.cam += (desired - this.cam) * Math.min(1, dt * 4);
      if (this.firstFrame !== false) { this.cam = desired; this.firstFrame = false; }
    }
    onLang() { /* canvas text is re-read every frame */ }

    draw(ctx) {
      ctx.fillStyle = '#0e1a22'; ctx.fillRect(0, 0, G.W, G.H);
      ctx.save();
      ctx.translate(-Math.round(this.cam), 0);
      ctx.drawImage(this.bg, 0, 0, HL.width, G.H);
      this.drawDoors(ctx);
      const g = this.guard, b = this.boy;
      // beam behind characters
      ctx.fillStyle = 'rgba(4,8,16,0.32)'; ctx.fillRect(this.cam, 0, G.W, G.H);
      if (g.beam && g.alpha > 0) { const tp = G.guardTorch(g); G.drawBeam(ctx, tp.x, tp.y, g.beamAng, 520, 0.3, 0.9); }
      const actors = [b, g].sort((p, q) => p.y - q.y);
      actors.forEach((a) => a.draw(ctx));
      // foreground statues
      for (const sx of this.statues) {
        ctx.save(); ctx.translate(sx, this.walkY + 40); ctx.scale(0.85, 0.85);
        A.statue(ctx, 0, 0);
        ctx.restore();
      }
      ctx.restore();
    }
    drawDoors(ctx) {
      const fy = this.floorY + 4;
      for (let i = 0; i <= 5; i++) {
        const x = this.doorX(i), exit = i === 5;
        const w = exit ? 210 : HL.doorW, h = exit ? 330 : HL.doorH;
        const unlocked = exit ? false : (i <= G.state.room);
        const room = G.ROOMS[i];
        A.door(ctx, x, fy, w, h, { open: this.doors[i].open, glow: (this.mode === 'chase' && i === 0) ? 0.7 + 0.3 * Math.sin(G.time * 4) : 0, wood: exit ? '#5a3a20' : undefined });
        const label = exit ? G.t('exitName') : G.tr(room.name);
        A.plaque(ctx, x, fy - h - 38, label, 22, unlocked || exit);
        if (!exit && !unlocked) {
          // small padlock to show the door is shut
          ctx.fillStyle = '#9a7d3a'; A.rrect(ctx, x - 10, fy - h * 0.45, 20, 18, 4); ctx.fill();
          ctx.strokeStyle = '#9a7d3a'; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(x, fy - h * 0.45, 7, Math.PI, 0); ctx.stroke();
        }
      }
    }
  };
})();
