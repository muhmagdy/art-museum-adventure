/* Title screen: the museum at night. */
(function () {
  'use strict';
  const G = window.G;

  G.TitleScene = class extends G.Scene {
    constructor() { super(); this.hud = {}; }
    enter() {
      G.audio.music('night');
      const wrap = G.el('div', 'title-wrap');
      G.txt('h1', '', 'title', wrap);
      G.txt('div', 'sub', 'subtitle', wrap);
      G.button('play', 'primary title-play', () => {
        G.state = G.newState();
        G.go(new G.IntroScene());
      });
      this.boy = new G.Boy(0, 0);
      this.boy.sound = false;
      this.layout();
    }
    layout() {
      this.boy.x = G.portrait ? G.W * 0.16 : G.W * 0.5 - Math.min(G.W * 0.62, G.H * 0.9) * 0.66;
      this.boy.y = G.portrait ? G.H * 0.95 : G.H * 0.9;
      this.boy.s = G.portrait ? 0.9 : 0.75;
    }
    resize() { this.layout(); }
    update(dt) { this.boy.update(dt); }
    draw(ctx) {
      G.art.museumNight(ctx, G.W, G.H, G.time);
      this.boy.mood = 'wonder';
      this.boy.draw(ctx);
    }
  };
})();
