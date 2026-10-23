/* Ending: the boy walks out of the museum into the sunrise, full of art knowledge. */
(function () {
  'use strict';
  const G = window.G;
  const A = G.art;

  G.EndScene = class extends G.Scene {
    constructor() { super(); this.hud = {}; }
    enter() {
      G.audio.music('ending');
      this.fx = new G.Particles();
      this.boy = new G.Boy(G.W / 2, G.H * 0.79);
      this.boy.s = 0.5; this.boy.alpha = 0; this.boy.sound = false;
      this.orbit = G.ROOMS.flatMap((r) => r.paintings.map((p) => p.items[0].icon));
      this.orbitA = 0;
      this.seq();
    }
    async seq() {
      const b = this.boy;
      await G.tween(b, { alpha: 1 }, 0.6);
      await Promise.all([G.tween(b, { s: 0.85, y: G.H * 0.93 }, 1.6), b.walkTo(G.W * 0.5, null, 100)]);
      b.mood = 'happy';
      await G.tween(b, { armsUp: 1 }, 0.4);
      G.audio.sfx('wow');
      G.caption(null, { key: 'end1', cls: 'top' });
      await G.wait(2.6);
      G.clearCaption();
      this.orbitOn = true;
      const panel = G.el('div', 'center-panel end-panel');
      G.txt('h2', '', 'theEnd', panel);
      const chips = G.el('div', 'chips', panel);
      this.chips = G.ROOMS.map((r) => { const c = G.el('div', 'chip', chips); c.textContent = G.tr(r.name); c._room = r; return c; });
      G.txt('p', '', 'end2', panel);
      const row = G.el('div', 'row', panel);
      row.style.visibility = 'hidden';
      G.button('playAgain', 'primary', () => { G.state = G.newState(); G.go(new G.TitleScene()); }, row);
      for (const c of this.chips) { await G.wait(0.35); c.classList.add('show'); G.audio.sfx('pickup', { style: 'impressionism' }); }
      row.style.visibility = 'visible';
    }
    onLang() { (this.chips || []).forEach((c) => { c.textContent = G.tr(c._room.name); }); }
    update(dt) {
      this.boy.update(dt);
      this.fx.update(dt);
      this.orbitA += dt * 0.8;
      if (Math.random() < dt * 6) this.fx.burst(Math.random() * G.W, -10, 2, ['#D9B85F', '#C77A47', '#E8DCC5', '#345C59', '#f2a7bd'], { speed: 40, gravity: 60, life: 4, size: 6, shape: 'rect', angle: Math.PI / 2, spread: 1 });
    }
    draw(ctx) {
      A.museumNight(ctx, G.W, G.H, G.time, { dawn: true });
      if (this.orbitOn) { ctx.fillStyle = 'rgba(14,26,34,0.4)'; ctx.fillRect(0, 0, G.W, G.H); }
      this.boy.draw(ctx);
      if (this.orbitOn) {
        const cx = this.boy.x, cy = this.boy.y - 120 * this.boy.s, n = this.orbit.length;
        for (let i = 0; i < n; i++) {
          const a = this.orbitA + i / n * Math.PI * 2;
          const x = cx + Math.cos(a) * 170, y = cy + Math.sin(a) * 60 - 40;
          G.drawIcon(ctx, this.orbit[i], x, y, Math.sin(a) > 0 ? 34 : 26);
        }
      }
      this.fx.draw(ctx);
    }
  };
})();
