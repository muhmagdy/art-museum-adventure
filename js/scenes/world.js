/* Inside a painting: a small explorable world in the painting's style. Collect every hidden item. */
(function () {
  'use strict';
  const G = window.G;
  const A = G.art;

  const MOTES = {
    impressionism: ['rgba(255,240,200,0.7)', 'rgba(200,230,255,0.6)', 'rgba(255,200,220,0.6)'],
    realism: ['rgba(255,230,170,0.5)', 'rgba(240,220,190,0.4)'],
    abstract: ['rgba(200,48,42,0.6)', 'rgba(31,63,143,0.6)', 'rgba(242,194,48,0.7)'],
    surrealism: ['rgba(255,255,255,0.5)', 'rgba(200,180,255,0.5)'],
    pop: ['rgba(255,80,140,0.6)', 'rgba(80,200,255,0.6)', 'rgba(255,220,60,0.7)'],
  };

  G.WorldScene = class extends G.Scene {
    constructor(ri, pi) { super(); this.ri = ri; this.pi = pi; this.hud = { home: true }; }
    enter() {
      this.room = G.ROOMS[this.ri];
      this.p = this.room.paintings[this.pi];
      G.audio.music(this.room.music);
      this.fx = new G.Particles();
      this.busy = true;
      this.idle = 0;
      this.hintT = 0;
      this.got = 0;
      this.items = this.p.items.map((it, i) => ({ icon: it.icon, prop: it.prop, fx: it.fx, fy: it.fy, i, state: it.prop != null ? 'hidden' : 'visible', x: 0, y: 0, pop: 0, alpha: 1 }));
      this.props = this.p.props.map((pr) => Object.assign({ shake: 0 }, pr));
      this.build();
      this.boy = new G.Boy(this.WW * 0.5, this.y0 + 0.08 * (this.y1 - this.y0));
      this.cam = this.camFor(this.boy.x);
      this.motes = Array.from({ length: 36 }, () => ({ x: Math.random(), y: Math.random(), v: 0.2 + Math.random() * 0.6, c: Math.floor(Math.random() * 3) }));
      // HUD: item slots + hint
      const slots = G.el('div', 'slots', G.hud.mid);
      this.slotEls = this.items.map((it) => { const s = G.el('div', 'slot', slots); s.appendChild(G.iconCanvas(it.icon, 56)); return s; });
      const hb = G.el('button', 'ibtn ia hint-btn', G.hud.start, G.ICON_SVG.hint);
      hb.type = 'button';
      hb.setAttribute('aria-label', G.t('hint'));
      hb.addEventListener('click', (e) => { e.stopPropagation(); G.audio.sfx('click'); this.showHint(); });
      this.dropIn();
    }
    build() {
      this.WH = Math.min(G.H, 1000);
      this.oy = (G.H - this.WH) / 2;
      this.WW = Math.max(2400, Math.round(G.W * 1.8));
      const res = G.bgRes();
      const { c, ctx } = G.makeCanvas(this.WW, this.WH, res);
      G.PAINTERS[this.p.painter](ctx, this.WW, this.WH, G.rng(this.p.seed + 1000), false);
      this.bg = c;
      this.y0 = this.WH * this.p.band[0];
      this.y1 = this.WH * this.p.band[1];
      const by = (f) => this.y0 + f * (this.y1 - this.y0);
      for (const pr of this.props) { pr.x = pr.fx * this.WW; pr.y = by(pr.fy); pr.s = (pr.s0 || (pr.s0 = pr.s || 1)) * (0.92 + 0.16 * pr.fy); }
      for (const it of this.items) {
        if (it.prop != null) {
          const pr = this.props[it.prop];
          const side = pr.fx > 0.5 ? -1 : 1;
          it.x = pr.x + side * (G.PROPS[pr.type].box[0] * pr.s * 0.5 + 40);
          it.y = Math.min(this.y1, pr.y + 18);
        } else { it.x = it.fx * this.WW; it.y = by(it.fy); }
      }
    }
    resize() {
      const fx = this.boy.x / this.WW, fy = (this.boy.y - this.y0) / (this.y1 - this.y0);
      this.build();
      this.boy.stop();
      this.boy.x = fx * this.WW; this.boy.y = this.y0 + fy * (this.y1 - this.y0);
      this.cam = this.camFor(this.boy.x);
    }
    camFor(x) { return G.clamp(x - G.W / 2, 0, this.WW - G.W); }
    depth(y) { return 0.9 + 0.2 * G.clamp((y - this.y0) / (this.y1 - this.y0), 0, 1); }

    async dropIn() {
      const b = this.boy, ty = b.y;
      b.y = ty - 420; b.s = 0.3; b.rot = -4; b.alpha = 0;
      G.audio.sfx('whoosh');
      await G.tween(b, { y: ty, s: this.depth(ty), rot: 0, alpha: 1 }, 0.8, G.ease.out);
      this.fx.burst(b.x, b.y, 30, MOTES[this.room.id], { speed: 240, gravity: 120, life: 0.9, size: 5 });
      b.mood = 'wonder';
      await G.wait(0.5);
      b.mood = 'idle';
      G.caption(null, { key: 'worldHint' });
      this.busy = false;
      await G.wait(6);
      G.clearCaption();
    }

    down(sx, sy) {
      if (this.busy) return;
      const wx = sx + this.cam, wy = sy - this.oy;
      this.idle = 0;
      // visible items
      for (const it of this.items) {
        if (it.state !== 'visible') continue;
        if (G.dist(wx, wy, it.x, it.y - 34) < 60) { this.goTo(it.x, it.y); return; }
      }
      // props
      for (let i = this.props.length - 1; i >= 0; i--) {
        const pr = this.props[i], bx = G.propBox(pr);
        if (wx > bx.x && wx < bx.x + bx.w && wy > bx.y && wy < bx.y + bx.h) { this.useProp(pr, i); return; }
      }
      this.goTo(wx, wy);
      this.fx.burst(G.clamp(wx, 40, this.WW - 40), G.clamp(wy, this.y0, this.y1), 5, ['#fff'], { speed: 50, gravity: 0, life: 0.35, size: 3 });
    }
    goTo(x, y) { return this.boy.walkTo(G.clamp(x, 50, this.WW - 50), G.clamp(y, this.y0, this.y1)); }
    async useProp(pr, idx) {
      const side = this.boy.x < pr.x ? -1 : 1;
      const arrived = await this.goTo(pr.x + side * (G.PROPS[pr.type].box[0] * pr.s * 0.35), pr.y + 14);
      if (!arrived) return;
      this.boy.face = -side;
      pr.shake = 1;
      G.audio.sfx('rustle');
      const it = this.items.find((q) => q.prop === idx && q.state === 'hidden');
      if (it) {
        it.state = 'popping'; it.pop = 0;
        G.audio.sfx('sparkle');
        this.fx.burst(pr.x, pr.y - 60, 24, MOTES[this.room.id], { speed: 200, gravity: 200, life: 0.8, size: 5 });
        await G.tween(it, { pop: 1 }, 0.7, G.ease.out);
        it.state = 'visible';
        this.goTo(it.x, it.y);
      }
    }
    collect(it) {
      it.state = 'taken';
      this.got++;
      this.idle = 0; this.hintT = 0;
      G.audio.sfx('pickup', { style: this.room.sfx });
      this.fx.burst(it.x, it.y - 34, 26, ['#D9B85F', '#E8DCC5', '#fff'].concat(MOTES[this.room.id]), { speed: 240, gravity: 160, life: 0.9, size: 5, shape: 'star' });
      it.fly = 0;
      G.tween(it, { fly: 1 }, 0.6, G.ease.in);
      const s = this.slotEls[it.i]; if (s) s.classList.add('got');
      if (this.got >= this.items.length) this.finish();
    }
    async finish() {
      this.busy = true;
      this.boy.stop();
      G.state.done[this.ri][this.pi] = true;
      await G.wait(0.5);
      G.toast('allFound', 1800);
      G.audio.sfx('success');
      this.boy.mood = 'happy';
      await G.tween(this.boy, { armsUp: 1 }, 0.3);
      await G.wait(1.3);
      // the painting pushes him back out
      this.swirl = 0;
      G.audio.sfx('portalOut');
      G.tween(this, { swirl: 1 }, 1.2, G.ease.in);
      await G.tween(this.boy, { s: 0.2, rot: 8, y: this.boy.y - 200, alpha: 0 }, 1.1, G.ease.in);
      G.go(new G.RoomScene(this.ri, { reveal: this.pi }), { color: '#fff7e0', speed: 0.3 });
    }
    showHint() {
      const left = this.items.filter((q) => q.state === 'hidden' || q.state === 'visible');
      if (!left.length) return;
      left.sort((a, b) => Math.abs(a.x - this.boy.x) - Math.abs(b.x - this.boy.x));
      const it = left[0];
      this.hint = it.state === 'hidden' ? { x: this.props[it.prop].x, y: this.props[it.prop].y - 70 } : { x: it.x, y: it.y - 34 };
      this.hintT = 3.5;
      G.audio.sfx('sparkle');
    }

    update(dt) {
      const b = this.boy;
      b.update(dt);
      if (!this.busy) b.s = this.depth(b.y);
      this.fx.update(dt);
      for (const pr of this.props) if (pr.shake > 0) pr.shake = Math.max(0, pr.shake - dt * 1.8);
      if (!this.busy) for (const it of this.items) if (it.state === 'visible' && G.dist(b.x, b.y, it.x, it.y) < 70) this.collect(it);
      this.cam += (this.camFor(b.x) - this.cam) * Math.min(1, dt * 5);
      if (!this.busy) { this.idle += dt; if (this.idle > 25) { this.idle = 0; this.showHint(); } }
      if (this.hintT > 0) this.hintT -= dt;
      for (const m of this.motes) { m.y -= m.v * dt * 0.05; m.x += Math.sin(G.time + m.v * 10) * dt * 0.01; if (m.y < 0) { m.y = 1; m.x = Math.random(); } }
    }

    draw(ctx) {
      const W = G.W, H = G.H, oy = this.oy;
      ctx.fillStyle = '#0e1a22'; ctx.fillRect(0, 0, W, H);
      ctx.save();
      if (this.swirl) { ctx.translate(W / 2, H / 2); ctx.rotate(this.swirl * this.swirl * 1.2); ctx.scale(1 - this.swirl * 0.6, 1 - this.swirl * 0.6); ctx.translate(-W / 2, -H / 2); }
      ctx.translate(-Math.round(this.cam), oy);
      ctx.drawImage(this.bg, 0, 0, this.WW, this.WH);
      // drawables sorted by depth
      const list = [];
      this.props.forEach((pr) => list.push({ y: pr.y, d: () => G.drawProp(ctx, pr, G.time) }));
      this.items.forEach((it) => {
        if (it.state === 'hidden') return;
        if (it.state === 'taken') { if (it.fly < 1) list.push({ y: 9999, d: () => this.drawItem(ctx, it) }); return; }
        list.push({ y: it.y - 1, d: () => this.drawItem(ctx, it) });
      });
      list.push({ y: this.boy.y, d: () => this.boy.draw(ctx) });
      list.sort((a, b) => a.y - b.y).forEach((o) => o.d());
      // hint ring
      if (this.hintT > 0 && this.hint) {
        const k = (G.time * 2) % 1;
        ctx.strokeStyle = 'rgba(255,230,140,' + (1 - k) + ')'; ctx.lineWidth = 6;
        A.circle(ctx, this.hint.x, this.hint.y, 40 + k * 50); ctx.stroke();
      }
      this.fx.draw(ctx);
      ctx.restore();
      // floating motes in the painting's colours
      const cols = MOTES[this.room.id];
      for (const m of this.motes) { ctx.fillStyle = cols[m.c % cols.length]; A.circle(ctx, m.x * W, oy + m.y * this.WH, 2.5 + m.v * 2); ctx.fill(); }
      // off-screen hint arrow
      if (this.hintT > 0 && this.hint) {
        const sx = this.hint.x - this.cam;
        if (sx < 0 || sx > W) {
          const left = sx < 0, ax = left ? 50 : W - 50, ay = oy + this.hint.y;
          ctx.fillStyle = '#D9B85F'; ctx.strokeStyle = '#2a2420'; ctx.lineWidth = 3;
          A.poly(ctx, left ? [ax - 26, ay, ax + 10, ay - 26, ax + 10, ay + 26] : [ax + 26, ay, ax - 10, ay - 26, ax - 10, ay + 26]); ctx.fill(); ctx.stroke();
        }
      }
      // ornate frame edges (portrait screens show the frame above and below the world)
      if (oy > 4) {
        for (const y of [oy - 28, oy + this.WH]) {
          const g = ctx.createLinearGradient(0, y, 0, y + 28);
          g.addColorStop(0, '#9a7632'); g.addColorStop(0.5, '#f0d78a'); g.addColorStop(1, '#8a6a2c');
          ctx.fillStyle = g; ctx.fillRect(0, y, W, 28);
        }
      }
      if (this.swirl) { ctx.fillStyle = 'rgba(255,247,224,' + this.swirl * 0.8 + ')'; ctx.fillRect(0, 0, W, H); }
    }
    drawItem(ctx, it) {
      let x = it.x, y = it.y - 34 + Math.sin(G.time * 2.5 + it.i) * 5, s = 54, a = 1;
      if (it.state === 'popping') {
        const pr = this.props[it.prop];
        const k = it.pop;
        x = G.lerp(pr.x, it.x, k); y = G.lerp(pr.y - 80, it.y - 34, k) - Math.sin(k * Math.PI) * 120; s = 54 * (0.4 + 0.6 * k);
      }
      if (it.state === 'taken') { y -= it.fly * 120; s = 54 * (1 + it.fly * 0.6); a = 1 - it.fly; }
      ctx.globalAlpha = a;
      A.glow(ctx, x, y, 46, 'rgba(255,236,170,' + (0.35 + 0.15 * Math.sin(G.time * 4 + it.i)) + ')');
      G.drawIcon(ctx, it.icon, x, y, s, Math.sin(G.time * 2 + it.i) * 0.08);
      // glint
      const gk = (G.time * 0.5 + it.i * 0.37) % 1;
      if (gk < 0.12) { ctx.fillStyle = '#fff'; const gs = Math.sin(gk / 0.12 * Math.PI) * 10; ctx.fillRect(x + 16 - gs, y - 18 - 1, gs * 2, 2); ctx.fillRect(x + 16 - 1, y - 18 - gs, 2, gs * 2); }
      ctx.globalAlpha = 1;
    }
  };
})();
