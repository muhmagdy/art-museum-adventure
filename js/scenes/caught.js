/* Failure: the guard catches the boy and sends him home. The game restarts from Impressionism. */
(function () {
  'use strict';
  const G = window.G;
  const A = G.art;

  G.CaughtScene = class extends G.Scene {
    constructor() { super(); this.hud = {}; }
    enter() {
      G.audio.music('night');
      this.guard = new G.Guard(G.W * 0.42, G.H * 0.86);
      this.guard.face = 1; this.guard.mood = 'angry'; this.guard.beam = false; this.guard.vol = 0.5;
      this.boy = new G.Boy(0, 0); this.boy.mood = 'scared'; this.boy.sound = false;
      this.guard.walkTo(G.W * 0.62, null, 70);
      const panel = G.el('div', 'center-panel');
      panel.style.top = '30%';
      G.txt('h2', '', 'caught', panel);
      G.txt('p', '', 'caught2', panel);
      const row = G.el('div', 'row', panel);
      row.style.visibility = 'hidden';
      G.button('tryAgain', 'primary', () => { G.state = G.newState(); G.go(new G.RoomScene(0, { retry: true })); }, row);
      G.button('home', '', () => { G.state = G.newState(); G.go(new G.TitleScene()); }, row);
      G.wait(1.4).then(() => { row.style.visibility = 'visible'; });
    }
    update(dt) {
      this.guard.update(dt);
      const g = this.guard;
      // the boy dangles from the guard's hand by his hood
      Object.assign(this.boy, { x: g.x + 80 * g.face, y: g.y - 30 + Math.sin(G.time * 6) * 3, face: -g.face, walking: true, phase: G.time * 8, s: 0.9, rot: Math.sin(G.time * 3) * 0.05 });
    }
    draw(ctx) {
      const W = G.W, H = G.H, fy = H * 0.86;
      A.vgrad(ctx, 0, 0, W, fy, ['#1d3a3b', '#28494a', G.PAL.teal]);
      for (let x = 100; x < W; x += 320) A.column(ctx, x, fy, Math.min(fy - 20, 500));
      A.vgrad(ctx, 0, fy, W, H - fy, ['#6e4a2e', '#3a2618']);
      ctx.fillStyle = 'rgba(4,8,16,0.4)'; ctx.fillRect(0, 0, W, H);
      this.boy.draw(ctx);
      this.guard.draw(ctx);
      A.vignette(ctx, W, H, 0.7);
    }
  };
})();
