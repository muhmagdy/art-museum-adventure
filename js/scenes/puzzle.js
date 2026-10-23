/* Door puzzle: drag jigsaw pieces into place before the countdown ends and the guard arrives. */
(function () {
  'use strict';
  const G = window.G;
  const A = G.art;

  function edge(ctx, x0, y0, x1, y1, s, tab) {
    if (!s) { ctx.lineTo(x1, y1); return; }
    const dx = x1 - x0, dy = y1 - y0, L = Math.hypot(dx, dy), ux = dx / L, uy = dy / L, nx = uy, ny = -ux;
    const P = (t, h) => [x0 + ux * L * t + nx * h * s * tab, y0 + uy * L * t + ny * h * s * tab];
    ctx.lineTo(...P(0.36, 0));
    ctx.bezierCurveTo(...P(0.42, 0.25), ...P(0.28, 1.0), ...P(0.5, 1.0));
    ctx.bezierCurveTo(...P(0.72, 1.0), ...P(0.58, 0.25), ...P(0.64, 0));
    ctx.lineTo(x1, y1);
  }

  G.PuzzleScene = class extends G.Scene {
    constructor(di) { super(); this.di = di; this.d = G.DOORS[di]; this.hud = { home: true }; }
    enter() {
      G.audio.music('tension');
      G.audio.setParam('urgency', 0);
      this.fx = new G.Particles();
      this.left = this.d.time;
      this.running = false;
      this.state = 'intro';
      this.drag = null;
      this.gk = 0; // guard progress 0..1
      this.open = 0;
      this.layout(true);
      this.boy = new G.Boy(this.boyX, this.boyY);
      this.boy.mood = 'scared'; this.boy.s = 0.8; this.boy.face = 1;
      this.guard = new G.Guard(0, 0); this.guard.mood = 'patrol'; this.guard.face = -1; this.guard.sound = false;
      // timer HUD
      this.timerEl = G.el('div', 'timer', G.hud.mid, G.ICON_SVG.timer + '<span></span>');
      this.timerTxt = this.timerEl.querySelector('span');
      this.updateTimer();
      G.caption(null, { key: 'puzzle', cls: 'top' });
      G.wait(2.2).then(() => { if (this.state === 'play') G.clearCaption(); });
      this.state = 'play'; this.running = true;
      this.lastSec = Math.ceil(this.left);
    }
    layout(first) {
      const W = G.W, H = G.H;
      let bw;
      if (G.portrait) { bw = Math.min(W * 0.88, 700); this.bx = (W - bw) / 2; this.by = 130; }
      else { bw = Math.min(H * 0.56 * 4 / 3, W * 0.42); this.bx = (W - bw) / 2; this.by = H * 0.54 - bw * 0.375; }
      this.bw = bw; this.bh = bw * 0.75;
      this.cw = bw / this.d.cols; this.ch = this.bh / this.d.rows;
      this.tab = Math.min(this.cw, this.ch) * 0.22;
      this.floorY = G.portrait ? H * 0.9 : H * 0.84;
      this.boyX = G.portrait ? W * 0.14 : this.bx - 70;
      this.boyY = G.portrait ? H - 30 : H - 24;
      // image
      if (this.d.exit) {
        const { c, ctx } = G.makeCanvas(this.bw, this.bh, Math.min(2, G.scale * G.dpr));
        A.museumNight(ctx, this.bw, this.bh, 0, { dawn: true });
        this.img = c;
      } else this.img = G.paintingImage(this.d.room, 0, this.bw, this.bh);
      this.renderBg();
      const old = this.pieces;
      this.makePieces();
      if (!first && old) {
        // keep progress across a resize
        old.forEach((o, i) => { const p = this.pieces[i]; p.placed = o.placed; if (p.placed) { p.x = p.tx; p.y = p.ty; } });
      }
      if (this.boy) { this.boy.x = this.boyX; this.boy.y = this.boyY; }
    }
    resize() { this.drag = null; this.layout(false); }

    renderBg() {
      const W = G.W, H = G.H;
      const { c, ctx } = G.makeCanvas(W, H, G.bgRes());
      A.vgrad(ctx, 0, 0, W, this.floorY, ['#1d3a3b', '#28494a', G.PAL.teal]);
      ctx.fillStyle = '#c8b894'; ctx.fillRect(0, this.floorY - 80, W, 80);
      ctx.fillStyle = '#e8dcc5'; ctx.fillRect(0, this.floorY - 86, W, 8);
      A.vgrad(ctx, 0, this.floorY, W, H - this.floorY, ['#6e4a2e', '#3a2618']);
      // far archway where the guard appears
      const ax = this.guardPos(0).x, ay = this.guardPos(0).y;
      ctx.fillStyle = '#0b1416'; A.rrect(ctx, ax - 55, ay - 150, 110, 154, 55); ctx.fill();
      A.glow(ctx, ax, ay - 60, 120, 'rgba(255,220,150,0.12)');
      // big door around the board
      const pad = 34, dx = this.bx - pad, dy = this.by - pad - 60, dw = this.bw + pad * 2, dh = this.bh + pad * 2 + 60;
      ctx.fillStyle = '#c9b48a'; A.rrect(ctx, dx - 22, dy - 22, dw + 44, dh + 44, 60); ctx.fill();
      ctx.fillStyle = '#4e301b'; A.rrect(ctx, dx, dy, dw, dh, 46); ctx.fill();
      ctx.strokeStyle = 'rgba(0,0,0,0.4)'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(dx + dw / 2, dy); ctx.lineTo(dx + dw / 2, dy + dh); ctx.stroke();
      // sconces
      [dx - 80, dx + dw + 80].forEach((x) => { A.glow(ctx, x, this.by, 140, 'rgba(255,190,110,0.35)'); A.circle(ctx, x, this.by, 9); ctx.fillStyle = '#ffd98f'; ctx.fill(); });
      // board recess with a faint ghost of the picture
      ctx.fillStyle = '#1a120a'; ctx.fillRect(this.bx - 6, this.by - 6, this.bw + 12, this.bh + 12);
      ctx.globalAlpha = Math.max(0.1, 0.24 - this.di * 0.03); ctx.drawImage(this.img, this.bx, this.by, this.bw, this.bh); ctx.globalAlpha = 1;
      ctx.strokeStyle = 'rgba(232,220,197,0.18)'; ctx.lineWidth = 1.5;
      for (let i = 1; i < this.d.cols; i++) { ctx.beginPath(); ctx.moveTo(this.bx + i * this.cw, this.by); ctx.lineTo(this.bx + i * this.cw, this.by + this.bh); ctx.stroke(); }
      for (let j = 1; j < this.d.rows; j++) { ctx.beginPath(); ctx.moveTo(this.bx, this.by + j * this.ch); ctx.lineTo(this.bx + this.bw, this.by + j * this.ch); ctx.stroke(); }
      this.bg = c;
    }
    guardPos(k) {
      const W = G.W, H = G.H, e = k * k;
      if (G.portrait) return { x: G.lerp(W * 0.9, W * 0.8, e), y: G.lerp(H * 0.9, H + 40, e), s: G.lerp(0.3, 1.05, e) };
      return { x: G.lerp(W * 0.93, W * 0.8, e), y: G.lerp(this.floorY - 2, H + 40, e), s: G.lerp(0.3, 1.2, e) };
    }

    makePieces() {
      const { cols, rows } = this.d, r = G.rng(900 + this.di);
      const hE = [], vE = [];
      for (let y = 0; y < rows; y++) { hE.push([]); vE.push([]); for (let x = 0; x < cols; x++) { hE[y].push(r() < 0.5 ? 1 : -1); vE[y].push(r() < 0.5 ? 1 : -1); } }
      const cw = this.cw, ch = this.ch, tab = this.tab;
      const res = Math.min(2, G.scale * G.dpr);
      this.pieces = [];
      for (let y = 0; y < rows; y++) for (let x = 0; x < cols; x++) {
        const top = y === 0 ? 0 : -hE[y - 1][x], bottom = y === rows - 1 ? 0 : hE[y][x];
        const left = x === 0 ? 0 : -vE[y][x - 1], right = x === cols - 1 ? 0 : vE[y][x];
        const { c, ctx } = G.makeCanvas(cw + tab * 2, ch + tab * 2, res);
        const path = () => {
          ctx.beginPath(); ctx.moveTo(tab, tab);
          edge(ctx, tab, tab, tab + cw, tab, top, tab);
          edge(ctx, tab + cw, tab, tab + cw, tab + ch, right, tab);
          edge(ctx, tab + cw, tab + ch, tab, tab + ch, bottom, tab);
          edge(ctx, tab, tab + ch, tab, tab, left, tab);
          ctx.closePath();
        };
        ctx.save(); path(); ctx.clip();
        ctx.drawImage(this.img, tab - x * cw, tab - y * ch, this.bw, this.bh);
        ctx.restore();
        path(); ctx.strokeStyle = 'rgba(40,25,10,0.7)'; ctx.lineWidth = 2.5; ctx.stroke();
        ctx.save(); ctx.translate(-1, -1); path(); ctx.strokeStyle = 'rgba(255,240,210,0.45)'; ctx.lineWidth = 1.2; ctx.stroke(); ctx.restore();
        this.pieces.push({ c: x, r: y, canvas: c, tx: this.bx + x * cw + cw / 2, ty: this.by + y * ch + ch / 2, x: 0, y: 0, placed: false });
      }
      this.scatter(r);
    }
    scatter(r) {
      const W = G.W, H = G.H, pw = this.cw, ph = this.ch, top = 110;
      const regions = [];
      const add = (x0, y0, x1, y1) => { if (x1 - x0 >= pw * 0.9 && y1 - y0 >= ph * 0.9) regions.push([x0 + pw / 2, y0 + ph / 2, x1 - pw / 2, y1 - ph / 2, (x1 - x0) * (y1 - y0)]); };
      const m = 12;
      if (G.portrait) {
        add(m, this.by + this.bh + 30, W - m, H * 0.78);
        add(m, H * 0.78, W * 0.58, H - m);
      } else {
        add(m, top, this.bx - m - 20, H - m);
        add(this.bx + this.bw + m + 20, top, W - m, H * 0.5);
      }
      if (!regions.length) add(m, top, W - m, H - m);
      const total = regions.reduce((s, q) => s + q[4], 0);
      for (const p of this.pieces) {
        let k = r() * total, reg = regions[0];
        for (const q of regions) { if (k < q[4]) { reg = q; break; } k -= q[4]; }
        p.x = G.lerp(reg[0], Math.max(reg[0], reg[2]), r());
        p.y = G.lerp(reg[1], Math.max(reg[1], reg[3]), r());
        p.rot = (r() - 0.5) * 0.25;
      }
      // shuffle drawing order
      this.pieces.sort(() => r() - 0.5);
    }

    down(x, y) {
      if (this.state !== 'play') return;
      for (let i = this.pieces.length - 1; i >= 0; i--) {
        const p = this.pieces[i];
        if (p.placed) continue;
        if (Math.abs(x - p.x) < this.cw / 2 + this.tab * 0.5 && Math.abs(y - p.y) < this.ch / 2 + this.tab * 0.5) {
          this.pieces.splice(i, 1); this.pieces.push(p);
          this.drag = { p, ox: p.x - x, oy: p.y - y };
          p.rot = 0;
          G.audio.sfx('pick');
          return;
        }
      }
    }
    move(x, y) {
      if (!this.drag) return;
      const p = this.drag.p;
      p.x = G.clamp(x + this.drag.ox, 10, G.W - 10);
      p.y = G.clamp(y + this.drag.oy, 10, G.H - 10);
    }
    up() {
      if (!this.drag) return;
      const p = this.drag.p;
      this.drag = null;
      if (G.dist(p.x, p.y, p.tx, p.ty) < Math.min(this.cw, this.ch) * 0.42) {
        p.x = p.tx; p.y = p.ty; p.placed = true;
        // placed pieces go to the bottom of the stack
        this.pieces.splice(this.pieces.indexOf(p), 1); this.pieces.unshift(p);
        G.audio.sfx('snap');
        this.fx.burst(p.x, p.y, 14, ['#D9B85F', '#fff'], { speed: 160, gravity: 0, life: 0.5, size: 4, shape: 'star' });
        if (this.pieces.every((q) => q.placed)) this.win();
      } else G.audio.sfx('drop');
    }

    updateTimer() {
      const s = Math.max(0, Math.ceil(this.left));
      const mm = Math.floor(s / 60), ss = String(s % 60).padStart(2, '0');
      this.timerTxt.textContent = G.num(mm + ':' + ss);
      this.timerEl.classList.toggle('warn', s <= 15 && this.running);
    }

    async win() {
      this.running = false; this.state = 'win';
      G.audio.setParam('urgency', 0);
      G.clearCaption();
      this.timerEl.style.visibility = 'hidden';
      G.audio.sfx('success');
      this.guard.mood = 'puzzled'; this.guard.bubble = '?';
      this.fx.burst(this.bx + this.bw / 2, this.by + this.bh / 2, 80, ['#D9B85F', '#E8DCC5', '#C77A47', '#fff'], { speed: 420, gravity: 200, life: 1.4, size: 6, shape: 'rect' });
      this.glow = 0;
      await G.tween(this, { glow: 1 }, 0.6);
      const room = this.d.exit ? null : G.ROOMS[this.d.room];
      const name = room ? G.tr(room.name) : G.t('exitName');
      this.reveal = new G.LetterReveal([{ text: name, size: 80, color: '#D9B85F' }], this.bx + this.bw / 2, Math.max(150, this.by - 10), Math.min(G.W * 0.86, 820),
        { x: this.bx + this.bw / 2, y: this.by + this.bh * 0.6 }, this.d.exit ? ['star', 'heart', 'star'] : ['star', 'palette', 'brush', 'star']);
      await new Promise((res) => { const chk = () => (this.reveal && !this.reveal.done ? G.wait(0.1).then(chk) : res()); chk(); });
      if (room) this.card = G.movementCard(room, { cls: 'bottom' });
      else this.card = (() => { const c = G.el('div', 'mcard bottom'); G.txt('h2', '', 'opened', c); G.txt('p', '', 'exitDesc', c); requestAnimationFrame(() => c.classList.add('show')); return c; })();
      await G.wait(3.2);
      G.audio.sfx('door');
      await G.tween(this, { open: 1 }, 1.2);
      this.boy.mood = 'happy'; this.boy.crouch = 0;
      await this.boy.walkTo(this.bx + this.bw / 2, this.boyY, 260);
      await G.tween(this.boy, { s: 0.45, alpha: 0, y: this.by + this.bh + 40 }, 0.8);
      if (this.d.exit) G.go(new G.EndScene(), { color: '#fff7e0', speed: 0.5 });
      else G.go(new G.RoomScene(this.d.room, {}));
    }
    async lose() {
      this.running = false; this.state = 'lose';
      this.drag = null;
      G.clearCaption();
      G.audio.music(null);
      G.audio.sfx('whistle');
      this.guard.mood = 'angry'; this.guard.bubble = G.t('hey');
      this.boy.mood = 'scared';
      await G.tween(this, { gk: 1.15 }, 0.9, G.ease.in);
      this.flash = 1;
      G.audio.sfx('caught');
      G.tween(this, { flash: 0 }, 0.6);
      await G.wait(1.0);
      G.go(new G.CaughtScene(), { speed: 0.5 });
    }

    update(dt) {
      this.fx.update(dt);
      this.boy.update(dt);
      if (this.reveal) this.reveal.update(dt);
      if (this.running) {
        this.left -= dt;
        const s = Math.ceil(this.left);
        if (s !== this.lastSec) { this.lastSec = s; G.audio.sfx('tick', { hi: s <= 10 }); this.updateTimer(); if (s % 2 === 0) G.audio.sfx('gstep', { vol: 0.3 + this.gk }); }
        this.gk = G.clamp(1 - this.left / this.d.time, 0, 1);
        G.audio.setParam('urgency', this.gk);
        if (this.left <= 0) { this.left = 0; this.updateTimer(); this.lose(); }
      }
      const gp = this.guardPos(Math.min(this.gk, 1.15));
      Object.assign(this.guard, { x: gp.x, y: gp.y, s: gp.s, walking: this.running || this.state === 'lose' });
      if (this.guard.walking) this.guard.phase += dt * 6;
    }
    onLang() { this.updateTimer(); if (this.guard.bubble && this.guard.bubble !== '?') this.guard.bubble = G.t('hey'); G.refreshCards(); }

    draw(ctx) {
      ctx.drawImage(this.bg, 0, 0, G.W, G.H);
      // door opening: light floods out from behind the finished picture
      if (this.open > 0) {
        const cx = this.bx + this.bw / 2;
        A.glow(ctx, cx, this.by + this.bh / 2, this.bw, 'rgba(255,214,140,' + 0.9 * this.open + ')');
      }
      // guard + beam (behind the pieces)
      const g = this.guard, tp = G.guardTorch(g);
      G.drawBeam(ctx, tp.x, tp.y, Math.PI - 0.25, 300 + 500 * g.s, 0.28, 0.5 + 0.5 * this.gk);
      g.draw(ctx);
      this.boy.draw(ctx);
      // placed pieces form the picture; when solved draw it whole
      const solved = this.state === 'win';
      if (solved) {
        const k = 1 - this.open;
        if (k > 0) {
          const half = this.bw / 2 * k;
          ctx.drawImage(this.img, 0, 0, this.img.width / 2, this.img.height, this.bx, this.by, half, this.bh);
          ctx.drawImage(this.img, this.img.width / 2, 0, this.img.width / 2, this.img.height, this.bx + this.bw - half, this.by, half, this.bh);
        }
        if (this.glow) { ctx.strokeStyle = 'rgba(217,184,95,' + this.glow + ')'; ctx.lineWidth = 8; ctx.strokeRect(this.bx - 4, this.by - 4, this.bw + 8, this.bh + 8); }
      } else {
        const pw = this.cw + this.tab * 2, ph = this.ch + this.tab * 2;
        for (const p of this.pieces) {
          ctx.save();
          ctx.translate(p.x, p.y);
          if (!p.placed) {
            const dragging = this.drag && this.drag.p === p;
            ctx.rotate(p.rot || 0);
            if (dragging) ctx.scale(1.06, 1.06);
            ctx.shadowColor = 'rgba(0,0,0,0.55)'; ctx.shadowBlur = dragging ? 22 : 8; ctx.shadowOffsetY = dragging ? 12 : 4;
          }
          ctx.drawImage(p.canvas, -pw / 2, -ph / 2, pw, ph);
          ctx.restore();
        }
      }
      if (this.reveal) this.reveal.draw(ctx);
      this.fx.draw(ctx);
      // danger vignette as the guard gets close
      if (this.running && this.gk > 0.7) {
        const a = (this.gk - 0.7) / 0.3 * (0.35 + 0.15 * Math.sin(G.time * 8));
        const gr = ctx.createRadialGradient(G.W / 2, G.H / 2, Math.min(G.W, G.H) * 0.3, G.W / 2, G.H / 2, Math.max(G.W, G.H) * 0.7);
        gr.addColorStop(0, 'rgba(160,20,10,0)'); gr.addColorStop(1, 'rgba(160,20,10,' + a + ')');
        ctx.fillStyle = gr; ctx.fillRect(0, 0, G.W, G.H);
      }
      if (this.flash) { ctx.fillStyle = 'rgba(255,255,255,' + this.flash + ')'; ctx.fillRect(0, 0, G.W, G.H); }
    }
  };
})();
