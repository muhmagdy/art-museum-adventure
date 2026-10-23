/* The boy (orange hoodie, teal backpack, shorts, sneakers) and the security guard. */
(function () {
  'use strict';
  const G = window.G;
  const A = G.art;
  const INK = '#2a2420';
  const SKIN = '#e3a57a', SKIN_D = '#c98a60';

  function limb(ctx, x, y, ang, len, w, color) {
    ctx.save(); ctx.translate(x, y); ctx.rotate(ang);
    A.rrect(ctx, -w / 2, -w / 2, w, len + w / 2, w / 2);
    A.fillStroke(ctx, color, INK, 3);
    ctx.restore();
  }

  // ---------------- boy ----------------
  G.Boy = class {
    constructor(x, y) {
      Object.assign(this, { x, y, s: 1, face: 1, phase: 0, walking: false, mood: 'idle', speed: 260, alpha: 1, rot: 0, crouch: 0, run: false, target: null, onArrive: null, stepAcc: 0, armsUp: 0, sound: true });
    }
    walkTo(x, y, speed) {
      this.speed = speed || (this.run ? 420 : 260);
      return new Promise((res) => {
        if (this.onArrive) this.onArrive(false);
        this.target = { x, y: y == null ? this.y : y };
        this.onArrive = res;
      });
    }
    stop() { this.target = null; this.walking = false; if (this.onArrive) { const f = this.onArrive; this.onArrive = null; f(false); } }
    update(dt) {
      if (this.target) {
        const dx = this.target.x - this.x, dy = this.target.y - this.y, d = Math.hypot(dx, dy);
        const st = this.speed * dt * (this.crouch ? 0.55 : 1);
        if (Math.abs(dx) > 2) this.face = dx > 0 ? 1 : -1;
        if (d <= st) {
          this.x = this.target.x; this.y = this.target.y; this.target = null; this.walking = false;
          const f = this.onArrive; this.onArrive = null; if (f) f(true);
        } else {
          this.x += dx / d * st; this.y += dy / d * st; this.walking = true;
          const prev = this.phase;
          this.phase += dt * (this.run ? 15 : 10) * (this.crouch ? 0.6 : 1);
          if (this.sound && Math.floor(prev / Math.PI) !== Math.floor(this.phase / Math.PI)) G.audio.sfx('step', { vol: this.crouch ? 0.4 : 1 });
        }
      } else this.walking = false;
    }
    draw(ctx) { G.drawBoy(ctx, this); }
  };

  G.drawBoy = function (ctx, b) {
    if (b.alpha <= 0) return;
    ctx.save();
    ctx.globalAlpha = b.alpha;
    ctx.translate(b.x, b.y);
    ctx.fillStyle = 'rgba(0,0,0,0.25)';
    A.ellipse(ctx, 0, 0, 34 * b.s, 8 * b.s); ctx.fill();
    ctx.rotate(b.rot || 0);
    ctx.scale(b.s * b.face, b.s);
    const amp = b.run ? 0.85 : 0.5;
    const sw = b.walking ? Math.sin(b.phase) * amp : 0;
    const bob = b.walking ? Math.abs(Math.cos(b.phase)) * 4 : Math.sin(G.time * 2.2) * 1.2;
    ctx.translate(0, -bob);
    if (b.crouch) { ctx.translate(0, 0); ctx.scale(1, 1 - 0.12 * b.crouch); ctx.rotate(0.12 * b.crouch); }
    if (b.run && b.walking) ctx.rotate(0.12);
    const shorts = '#2e4a63', hood = '#ee8434', hoodD = '#cf6a22', pack = '#2e8b83', packD = '#1f6660';

    const leg = (ang, back) => {
      ctx.save(); ctx.translate(back ? -4 : 4, -62); ctx.rotate(ang);
      ctx.fillStyle = back ? SKIN_D : SKIN; ctx.fillRect(-6, 14, 12, 36); ctx.strokeStyle = INK; ctx.lineWidth = 3; ctx.strokeRect(-6, 14, 12, 36);
      ctx.fillStyle = '#f4f1ea'; ctx.fillRect(-6, 44, 12, 8);
      // sneaker
      A.rrect(ctx, -11, 50, 33, 13, 6); A.fillStroke(ctx, back ? '#d9d4c8' : '#ffffff', INK, 3);
      ctx.fillStyle = back ? '#8a3b2a' : '#c0392b'; ctx.fillRect(-2, 53, 14, 4);
      ctx.fillStyle = '#5b5b5b'; ctx.fillRect(-10, 60, 31, 3);
      // shorts leg
      A.rrect(ctx, -12, -4, 24, 24, 6); A.fillStroke(ctx, back ? '#253d52' : shorts, INK, 3);
      ctx.restore();
    };
    const arm = (ang, back) => {
      ctx.save(); ctx.translate(back ? -6 : 6, -112); ctx.rotate(ang);
      A.rrect(ctx, -8, -6, 16, 44, 8); A.fillStroke(ctx, back ? hoodD : hood, INK, 3);
      A.circle(ctx, 0, 42, 7.5); A.fillStroke(ctx, back ? SKIN_D : SKIN, INK, 3);
      ctx.restore();
    };
    const up = b.armsUp || 0;
    // back limbs
    leg(-sw, true);
    arm(up ? -2.5 * up + 0.3 : sw * 0.9, true);
    // backpack
    A.rrect(ctx, -44, -124, 26, 60, 9); A.fillStroke(ctx, pack, INK, 3);
    A.rrect(ctx, -46, -108, 18, 26, 6); A.fillStroke(ctx, packD, INK, 2.5);
    // torso (hoodie)
    leg(sw, false);
    A.rrect(ctx, -24, -124, 48, 70, 16); A.fillStroke(ctx, hood, INK, 3);
    ctx.fillStyle = hoodD; ctx.fillRect(-22, -64, 44, 8);
    A.rrect(ctx, -6, -90, 26, 18, 6); A.fillStroke(ctx, hoodD, INK, 2.5); // pocket
    // backpack strap
    ctx.strokeStyle = packD; ctx.lineWidth = 6;
    ctx.beginPath(); ctx.moveTo(-14, -122); ctx.quadraticCurveTo(-4, -100, -12, -74); ctx.stroke();
    // hood behind head
    A.ellipse(ctx, -12, -128, 20, 12, -0.3); A.fillStroke(ctx, hoodD, INK, 3);
    // drawstrings
    ctx.strokeStyle = '#f4f1ea'; ctx.lineWidth = 2.5;
    ctx.beginPath(); ctx.moveTo(8, -120); ctx.lineTo(9, -102); ctx.moveTo(16, -120); ctx.lineTo(18, -104); ctx.stroke();
    // head
    ctx.save();
    if (b.mood === 'wonder') ctx.rotate(-0.08);
    A.circle(ctx, 6, -154, 29); A.fillStroke(ctx, SKIN, INK, 3);
    A.ellipse(ctx, -12, -152, 6, 8); A.fillStroke(ctx, SKIN_D, INK, 2.5); // ear
    // hair
    ctx.fillStyle = '#3b2618'; ctx.strokeStyle = INK; ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(-22, -150); ctx.quadraticCurveTo(-26, -186, 6, -186); ctx.quadraticCurveTo(30, -188, 36, -162);
    ctx.lineTo(28, -170); ctx.lineTo(22, -160); ctx.lineTo(16, -172); ctx.lineTo(4, -164); ctx.lineTo(-4, -172); ctx.lineTo(-10, -158);
    ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(-2, -186); ctx.lineTo(4, -196); ctx.lineTo(10, -186); ctx.fill();
    // face
    const m = b.mood;
    const look = m === 'sneak' ? 3 : 0;
    if (m === 'wonder' || m === 'scared') {
      for (const ex of [14, 26]) {
        A.ellipse(ctx, ex, -156, 5.5, 7); A.fillStroke(ctx, '#fff', INK, 2);
        A.circle(ctx, ex + 1, -155, 3.2); ctx.fillStyle = INK; ctx.fill();
        A.circle(ctx, ex + 2.2, -157, 1.2); ctx.fillStyle = '#fff'; ctx.fill();
      }
    } else if (m === 'happy') {
      ctx.strokeStyle = INK; ctx.lineWidth = 2.5;
      for (const ex of [14, 26]) { ctx.beginPath(); ctx.arc(ex, -154, 4, Math.PI * 1.1, Math.PI * 1.9); ctx.stroke(); }
    } else {
      const blink = (G.time % 3.6) < 0.12;
      ctx.fillStyle = INK;
      for (const ex of [14, 26]) { if (blink) ctx.fillRect(ex - 3 + look, -155, 6, 2); else { A.ellipse(ctx, ex + look, -155, 3, 4.2); ctx.fill(); } }
    }
    // brows
    ctx.strokeStyle = '#3b2618'; ctx.lineWidth = 2.5;
    ctx.beginPath();
    if (m === 'wonder') { ctx.moveTo(9, -168); ctx.lineTo(17, -170); ctx.moveTo(22, -170); ctx.lineTo(30, -168); }
    else if (m === 'scared') { ctx.moveTo(9, -164); ctx.lineTo(17, -167); ctx.moveTo(22, -167); ctx.lineTo(30, -164); }
    else { ctx.moveTo(10, -164); ctx.lineTo(17, -165); ctx.moveTo(22, -165); ctx.lineTo(29, -164); }
    ctx.stroke();
    // nose & cheeks
    ctx.fillStyle = SKIN_D; A.circle(ctx, 33, -147, 3.5); ctx.fill();
    ctx.fillStyle = 'rgba(230,110,90,0.35)'; A.circle(ctx, 28, -141, 5); ctx.fill();
    // mouth
    ctx.strokeStyle = INK; ctx.lineWidth = 2.5;
    if (m === 'wonder') { A.ellipse(ctx, 22, -137, 4.5, 6); ctx.fillStyle = '#7a2a22'; ctx.fill(); ctx.stroke(); }
    else if (m === 'scared') { ctx.beginPath(); ctx.moveTo(15, -136); ctx.quadraticCurveTo(19, -140, 22, -136); ctx.quadraticCurveTo(25, -132, 28, -136); ctx.stroke(); }
    else if (m === 'sneak') { ctx.beginPath(); ctx.moveTo(17, -137); ctx.lineTo(26, -138); ctx.stroke(); }
    else { ctx.beginPath(); ctx.arc(21, -142, 7, 0.3, Math.PI - 0.5); ctx.stroke(); }
    if (m === 'scared') { ctx.fillStyle = '#9fd3ff'; ctx.beginPath(); ctx.moveTo(-4, -176); ctx.quadraticCurveTo(-10, -164, -4, -162); ctx.quadraticCurveTo(2, -164, -4, -176); ctx.fill(); }
    ctx.restore();
    // front arm
    if (m === 'sneak' && !b.walking) {
      ctx.save(); ctx.translate(6, -112); ctx.rotate(-2.2);
      A.rrect(ctx, -8, -6, 16, 38, 8); A.fillStroke(ctx, hood, INK, 3);
      A.circle(ctx, 0, 36, 7); A.fillStroke(ctx, SKIN, INK, 3);
      ctx.restore();
    } else arm(up ? -2.5 * up - 0.2 : -sw * 0.9, false);
    ctx.restore();
  };

  // ---------------- guard ----------------
  G.Guard = class {
    constructor(x, y) {
      Object.assign(this, { x, y, s: 1, face: -1, phase: 0, walking: false, mood: 'patrol', speed: 150, alpha: 1, target: null, onArrive: null, beam: true, beamAng: 0, beamLen: 420, bubble: null, sound: true, vol: 1 });
    }
    walkTo(x, y, speed) {
      this.speed = speed || 150;
      return new Promise((res) => { if (this.onArrive) this.onArrive(false); this.target = { x, y: y == null ? this.y : y }; this.onArrive = res; });
    }
    update(dt) {
      if (this.target) {
        const dx = this.target.x - this.x, dy = this.target.y - this.y, d = Math.hypot(dx, dy), st = this.speed * dt;
        if (Math.abs(dx) > 2) this.face = dx > 0 ? 1 : -1;
        if (d <= st) { this.x = this.target.x; this.y = this.target.y; this.target = null; this.walking = false; const f = this.onArrive; this.onArrive = null; if (f) f(true); }
        else {
          this.x += dx / d * st; this.y += dy / d * st; this.walking = true;
          const prev = this.phase; this.phase += dt * 7 * (this.speed / 150);
          if (this.sound && Math.floor(prev / Math.PI) !== Math.floor(this.phase / Math.PI)) G.audio.sfx('gstep', { vol: this.vol });
        }
      } else this.walking = false;
    }
    draw(ctx) { G.drawGuard(ctx, this); }
  };

  G.drawBeam = function (ctx, x, y, ang, len, spread, alpha) {
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    ctx.translate(x, y); ctx.rotate(ang);
    const g = ctx.createLinearGradient(0, 0, len, 0);
    g.addColorStop(0, 'rgba(255,236,170,' + 0.55 * alpha + ')'); g.addColorStop(1, 'rgba(255,236,170,0)');
    ctx.fillStyle = g;
    ctx.beginPath(); ctx.moveTo(0, -4); ctx.lineTo(len, -len * spread); ctx.lineTo(len, len * spread); ctx.lineTo(0, 4); ctx.closePath(); ctx.fill();
    ctx.restore();
  };

  G.drawGuard = function (ctx, g) {
    if (g.alpha <= 0) return;
    ctx.save();
    ctx.globalAlpha = g.alpha;
    ctx.translate(g.x, g.y);
    ctx.fillStyle = 'rgba(0,0,0,0.28)'; A.ellipse(ctx, 0, 0, 46 * g.s, 10 * g.s); ctx.fill();
    ctx.scale(g.s * g.face, g.s);
    const sw = g.walking ? Math.sin(g.phase) * 0.45 : 0;
    const bob = g.walking ? Math.abs(Math.cos(g.phase)) * 3 : 0;
    ctx.translate(0, -bob);
    const navy = '#2f3a56', navyD = '#232c42', shirt = '#4a5a78', skin = '#d9a27a';
    const leg = (ang, back) => {
      ctx.save(); ctx.translate(back ? -8 : 8, -96); ctx.rotate(ang);
      A.rrect(ctx, -12, -4, 24, 92, 10); A.fillStroke(ctx, back ? navyD : navy, INK, 3);
      A.rrect(ctx, -14, 84, 38, 14, 6); A.fillStroke(ctx, '#151515', INK, 3);
      ctx.restore();
    };
    const arm = (ang, back, torch) => {
      ctx.save(); ctx.translate(back ? -10 : 12, -178); ctx.rotate(ang);
      A.rrect(ctx, -10, -6, 20, 70, 10); A.fillStroke(ctx, back ? navyD : shirt, INK, 3);
      A.circle(ctx, 0, 66, 9); A.fillStroke(ctx, skin, INK, 3);
      if (torch) { ctx.save(); ctx.translate(0, 66); ctx.rotate(-ang - 0.0); A.rrect(ctx, -2, -6, 30, 12, 4); A.fillStroke(ctx, '#3a3a3a', INK, 2.5); ctx.fillStyle = '#fff3b0'; ctx.fillRect(26, -5, 4, 10); ctx.restore(); }
      ctx.restore();
    };
    leg(-sw, true);
    arm(sw * 0.7, true);
    leg(sw, false);
    // body with belly
    ctx.beginPath(); ctx.moveTo(-30, -186); ctx.quadraticCurveTo(40, -190, 34, -140); ctx.quadraticCurveTo(46, -100, 24, -90); ctx.lineTo(-30, -90); ctx.closePath();
    A.fillStroke(ctx, shirt, INK, 3);
    ctx.fillStyle = '#1b1b1b'; ctx.fillRect(-30, -104, 62, 12);
    ctx.fillStyle = G.PAL.gold; ctx.fillRect(4, -103, 10, 10);
    ctx.fillStyle = G.PAL.gold; A.poly(ctx, [16, -164, 24, -168, 28, -158, 22, -150, 14, -156]); ctx.fill();
    ctx.strokeStyle = INK; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(2, -186); ctx.lineTo(4, -108); ctx.stroke();
    // head
    ctx.save();
    if (g.mood === 'puzzled') { ctx.translate(4, -196); ctx.rotate(-0.15); ctx.translate(-4, 196); }
    A.circle(ctx, 6, -220, 30); A.fillStroke(ctx, skin, INK, 3);
    // cap
    ctx.beginPath(); ctx.moveTo(-26, -228); ctx.quadraticCurveTo(-20, -262, 10, -260); ctx.quadraticCurveTo(36, -258, 38, -228); ctx.closePath();
    A.fillStroke(ctx, navy, INK, 3);
    A.rrect(ctx, 14, -234, 34, 9, 4); A.fillStroke(ctx, '#151515', INK, 2.5);
    ctx.fillStyle = G.PAL.gold; A.circle(ctx, 8, -246, 6); ctx.fill();
    // face
    ctx.fillStyle = INK;
    if (g.mood === 'angry') {
      ctx.strokeStyle = INK; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(12, -222); ctx.lineTo(22, -216); ctx.moveTo(26, -216); ctx.lineTo(34, -222); ctx.stroke();
    }
    A.ellipse(ctx, 18, -212, 3, 4); ctx.fill(); A.ellipse(ctx, 30, -212, 3, 4); ctx.fill();
    ctx.fillStyle = '#c4865f'; A.circle(ctx, 36, -204, 6); ctx.fill();
    // mustache
    ctx.fillStyle = '#5a4030'; ctx.beginPath(); ctx.ellipse(28, -196, 14, 5, 0, 0, Math.PI * 2); ctx.fill();
    if (g.mood === 'angry') { ctx.fillStyle = '#5b1a14'; A.ellipse(ctx, 28, -186, 6, 5); ctx.fill(); }
    ctx.restore();
    arm(g.beam ? -1.35 : -sw * 0.7, false, g.beam);
    ctx.restore();
    if (g.bubble) G.bubble(ctx, g.x + 10 * g.s * g.face, g.y - 290 * g.s, g.bubble, 30 * Math.max(0.8, g.s));
  };
  G.guardTorch = function (g) {
    // world position of the torch tip (approx)
    return { x: g.x + g.face * 95 * g.s, y: g.y - 190 * g.s };
  };

  // speech / thought bubble
  G.bubble = function (ctx, x, y, text, size) {
    ctx.save();
    G.setDir(ctx);
    ctx.font = '800 ' + size + 'px ' + G.FONT;
    const tw = Math.max(ctx.measureText(text).width + size, size * 1.6);
    const h = size * 1.6;
    ctx.fillStyle = '#fffaf0'; ctx.strokeStyle = INK; ctx.lineWidth = 3;
    A.rrect(ctx, x - tw / 2, y - h, tw, h, h / 2); ctx.fill(); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(x - 8, y - 2); ctx.lineTo(x, y + 14); ctx.lineTo(x + 10, y - 2); ctx.closePath(); ctx.fill();
    ctx.beginPath(); ctx.moveTo(x - 8, y); ctx.lineTo(x, y + 14); ctx.lineTo(x + 10, y); ctx.stroke();
    ctx.fillStyle = INK; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText(text, x, y - h / 2 + 2);
    ctx.restore();
  };
})();
