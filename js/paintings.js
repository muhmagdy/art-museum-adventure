/* Procedural painters. Each painter draws a painting at any size:
   frame=true  -> the composition as it hangs in the museum (about 4:3),
   frame=false -> a wide explorable world in the same style (the boy walks along the bottom band). */
(function () {
  'use strict';
  const G = window.G;
  const A = G.art;
  const PT = (G.PAINTERS = {});
  const INK = '#1d1a16';
  const nd = (area, size) => Math.floor(area / (size * size * 0.9));

  A.texture = function (ctx, w, h, r, alpha) {
    ctx.save();
    for (let i = 0, n = Math.floor(w * h / 260); i < n; i++) {
      ctx.globalAlpha = (alpha || 0.05) * r();
      ctx.fillStyle = r() < 0.5 ? '#000' : '#fff';
      ctx.fillRect(r() * w, r() * h, 2, 2);
    }
    ctx.restore();
  };
  // positions spread across a world (or a single centred one for frames)
  const spots = (w, frame, every, fxs) => (frame ? (fxs || [0.5]).map((f) => f * w) : Array.from({ length: Math.max(1, Math.floor(w / every)) }, (_, i) => (i + 0.5) * w / Math.max(1, Math.floor(w / every))));

  // ======================= IMPRESSIONISM =======================
  PT.monetLilies = function (ctx, w, h, r, frame) {
    const u = frame ? h / 720 : 1;
    const hor = frame ? h * 0.38 : h * 0.34, bank = frame ? h : h * 0.7;
    A.vgrad(ctx, 0, 0, w, h, ['#27493f', '#2f5a5a', '#3d6f7d']);
    A.dabs(ctx, r, -20, -20, w + 40, hor + 40 * u, ['#2c4d3a', '#3d6b3f', '#5f8f4e', '#8fb36a', '#a9c27a', '#4a6d6b', '#6d7fa3', '#c9d98a'], nd(w * hor, 12 * u), 16 * u, 0.85);
    A.vgrad(ctx, 0, hor, w, bank - hor, ['#5b8fa0', '#3f7088', '#2f5a6e']);
    A.dabs(ctx, r, 0, hor, w, (bank - hor) * 0.6, ['#3d6b3f', '#5f8f4e', '#4a6d6b', '#6d7fa3'], nd(w * (bank - hor) * 0.6, 14 * u) * 0.5, 14 * u, 0.5, Math.PI / 2);
    A.dabs(ctx, r, 0, hor, w, bank - hor, ['#9ec3d9', '#c9dce8', '#b9a5d6', '#7fa7bf', '#e8dcc5'], nd(w * (bank - hor), 12 * u) * 0.35, 12 * u, 0.55, 0);
    // japanese bridge
    const bx = frame ? w * 0.5 : w * 0.55, bw = frame ? w * 0.86 : 820 * u;
    const by = hor - 10 * u;
    ctx.save(); ctx.lineCap = 'round';
    for (const [off, lw, col] of [[0, 18, '#557d5a'], [-52, 9, '#6f9a6a'], [-26, 5, '#7faa74']]) {
      ctx.strokeStyle = col; ctx.lineWidth = lw * u;
      ctx.beginPath(); ctx.moveTo(bx - bw / 2, by + 60 * u + off * u); ctx.quadraticCurveTo(bx, by - 70 * u + off * u, bx + bw / 2, by + 60 * u + off * u); ctx.stroke();
    }
    ctx.strokeStyle = '#5f8a62'; ctx.lineWidth = 6 * u;
    for (let i = 1; i < 14; i++) {
      const t = i / 14, x = bx - bw / 2 + bw * t, yb = by + 60 * u + (-130 * u) * t * (1 - t) * 2;
      ctx.beginPath(); ctx.moveTo(x, yb); ctx.lineTo(x, yb - 52 * u); ctx.stroke();
    }
    ctx.restore();
    A.dabs(ctx, r, bx - bw / 2, by - 60 * u, bw, 130 * u, ['#7faa74', '#9fc08a', '#557d5a'], 260 * (bw / 800), 8 * u, 0.4);
    // lily pads
    const nPads = Math.floor(w * (bank - hor) / (9000 * u * u));
    for (let i = 0; i < nPads; i++) {
      const y = hor + 30 * u + r() * (bank - hor - 40 * u), p = 0.6 + (y - hor) / (bank - hor) * 0.9;
      const x = r() * w, rx = (16 + r() * 22) * u * p;
      A.ellipse(ctx, x, y, rx, rx * 0.36); ctx.fillStyle = r() < 0.5 ? '#4f7f3f' : '#6e9b4c'; ctx.fill();
      A.dabs(ctx, r, x - rx, y - rx * 0.3, rx * 2, rx * 0.6, ['#7fb35a', '#3d6b3f', '#a9c27a'], 6, 5 * u * p, 0.7, 0);
      if (r() < 0.35) A.dabs(ctx, r, x - 6 * u * p, y - 8 * u * p, 12 * u * p, 8 * u * p, [r() < 0.6 ? '#f2a7bd' : '#f7f1e4', '#f7d5df', '#fff'], 7, 4 * u * p, 0.95);
    }
    if (!frame) {
      // grassy bank where the boy walks
      ctx.fillStyle = '#4f7a3a';
      ctx.beginPath(); ctx.moveTo(0, h);
      for (let x = 0; x <= w; x += 40 * u) ctx.lineTo(x, bank - 6 * u + Math.sin(x * 0.01) * 10 * u + r() * 8 * u);
      ctx.lineTo(w, h); ctx.closePath(); ctx.fill();
      A.dabs(ctx, r, 0, bank, w, h - bank, ['#5f8f4e', '#6d9a4c', '#8fb36a', '#3d6b3f', '#a9c27a'], nd(w * (h - bank), 10 * u), 12 * u, 0.85);
      A.dabs(ctx, r, 0, bank + 10 * u, w, h - bank, ['#f2a7bd', '#f4d03f', '#e8dcc5', '#b9a5d6'], nd(w * (h - bank), 40 * u), 5 * u, 0.9);
    }
    A.texture(ctx, w, h, r, 0.06);
  };

  A.softFigure = function (ctx, x, y, s, o, r) {
    // seated / standing figure built from soft dabs. y = waist line
    const top = o.top || '#f4f1ea';
    A.ellipse(ctx, x, y, 22 * s, 36 * s); ctx.fillStyle = top; ctx.fill();
    A.dabs(ctx, r, x - 20 * s, y - 34 * s, 40 * s, 66 * s, [top, o.top2 || '#d8d0c0'], 18, 6 * s, 0.7);
    A.circle(ctx, x, y - 46 * s, 13 * s); ctx.fillStyle = o.skin || '#e8b896'; ctx.fill();
    A.dabs(ctx, r, x - 10 * s, y - 56 * s, 20 * s, 20 * s, ['#f0c4a4', '#d99f80'], 6, 4 * s, 0.6);
    if (o.hat === 'straw') { A.ellipse(ctx, x, y - 56 * s, 22 * s, 6 * s); ctx.fillStyle = '#e9c46a'; ctx.fill(); A.ellipse(ctx, x, y - 61 * s, 11 * s, 7 * s); ctx.fill(); }
    else if (o.hat === 'flower') { A.ellipse(ctx, x, y - 58 * s, 17 * s, 7 * s); ctx.fillStyle = '#3b3a5a'; ctx.fill(); A.dabs(ctx, r, x - 12 * s, y - 64 * s, 24 * s, 8 * s, ['#e74c3c', '#f2a7bd', '#fff'], 8, 3 * s, 1); }
    else if (o.hat === 'hair') { A.ellipse(ctx, x, y - 52 * s, 14 * s, 9 * s); ctx.fillStyle = '#5a3a22'; ctx.fill(); }
  };

  PT.renoirLuncheon = function (ctx, w, h, r, frame) {
    const u = frame ? h / 720 : 1;
    const awn = h * 0.14, rail = h * 0.5;
    A.vgrad(ctx, 0, 0, w, h, ['#cfdad0', '#9cb59a', '#d9c49a']);
    // background foliage, sky and river
    A.dabs(ctx, r, 0, awn, w, rail - awn, ['#5f8f4e', '#8fb36a', '#c9d98a', '#3d6b3f', '#e8e2c0', '#bcd4dc'], nd(w * (rail - awn), 12 * u), 14 * u, 0.85);
    A.dabs(ctx, r, 0, rail - 70 * u, w, 50 * u, ['#9ec3d9', '#c9dce8', '#e8f0f2'], nd(w * 50 * u, 10 * u) * 0.6, 12 * u, 0.8, 0);
    if (!frame) for (let x = 200 * u; x < w; x += 520 * u) { ctx.fillStyle = 'rgba(250,248,240,0.9)'; A.poly(ctx, [x, rail - 30 * u, x + 26 * u, rail - 30 * u, x + 10 * u, rail - 90 * u]); ctx.fill(); }
    // awning
    for (let x = 0, i = 0; x < w; x += 44 * u, i++) {
      ctx.fillStyle = i % 2 ? '#f1e6d0' : '#c8553d'; ctx.fillRect(x, 0, 44 * u, awn);
      ctx.beginPath(); ctx.arc(x + 22 * u, awn, 22 * u, 0, Math.PI); ctx.fill();
    }
    A.dabs(ctx, r, 0, 0, w, awn, ['#e07a5f', '#f4ead5', '#b84a33'], nd(w * awn, 14 * u) * 0.3, 10 * u, 0.4, Math.PI / 2);
    // terrace floor
    A.vgrad(ctx, 0, rail, w, h - rail, ['#d9b88a', '#c9a06a']);
    A.dabs(ctx, r, 0, rail, w, h - rail, ['#e6cfa3', '#c9a06a', '#b88c5a', '#f2e2c0', '#a9c2c8'], nd(w * (h - rail), 12 * u) * 0.8, 14 * u, 0.7, 0);
    // railing
    ctx.fillStyle = '#f2ece0'; ctx.fillRect(0, rail - 12 * u, w, 12 * u);
    for (let x = 10 * u; x < w; x += 60 * u) ctx.fillRect(x, rail - 10 * u, 7 * u, 42 * u);
    ctx.fillRect(0, rail + 26 * u, w, 8 * u);
    // figures
    const tones = [['#f4f1ea', 'straw'], ['#2b3550', 'flower'], ['#f4f1ea', 'straw'], ['#3a3a3a', 'hair'], ['#e9dccb', 'flower'], ['#f4f1ea', 'straw']];
    if (frame) {
      const pos = [[0.14, 0.62, 1.5], [0.3, 0.55, 1.2], [0.46, 0.6, 1.25], [0.62, 0.55, 1.2], [0.8, 0.63, 1.5], [0.7, 0.86, 1.8], [0.25, 0.88, 1.9]];
      pos.forEach(([fx, fy, s], i) => A.softFigure(ctx, fx * w, fy * h, s * h / 500, { top: tones[i % 6][0], hat: tones[i % 6][1] }, r));
      // table
      A.ellipse(ctx, w * 0.45, h * 0.82, w * 0.22, h * 0.08); ctx.fillStyle = '#f7f4ee'; ctx.fill();
      A.dabs(ctx, r, w * 0.27, h * 0.76, w * 0.36, h * 0.1, ['#7d3c98', '#c0392b', '#f4d03f', '#fdfefe', '#9cc0c8'], 70, h / 100, 0.9);
    } else {
      spots(w, false, 560 * u).forEach((x, k) => {
        for (let j = 0; j < 3; j++) A.softFigure(ctx, x + (j - 1) * 60 * u + r() * 20 * u, rail + 6 * u + r() * 12 * u, 0.95 * u, { top: tones[(k + j) % 6][0], hat: tones[(k * 2 + j) % 6][1] }, r);
      });
    }
    A.texture(ctx, w, h, r, 0.06);
  };

  A.dancer = function (ctx, x, y, s, sash, pose, r) {
    // y = feet
    ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
    ctx.strokeStyle = '#efd9c4'; ctx.lineWidth = 5; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(-4, -48); ctx.lineTo(pose ? -14 : -6, 0); ctx.moveTo(4, -48); ctx.lineTo(pose ? 18 : 6, pose ? -10 : 0); ctx.stroke();
    for (let i = 0; i < 3; i++) { A.ellipse(ctx, 0, -52 + i * 2, 34 - i * 6, 9 + i); ctx.fillStyle = 'rgba(250,248,242,' + (0.55 + i * 0.15) + ')'; ctx.fill(); }
    A.rrect(ctx, -8, -84, 16, 32, 6); ctx.fillStyle = '#f7f4ee'; ctx.fill();
    ctx.fillStyle = sash; ctx.fillRect(-9, -60, 18, 6);
    ctx.beginPath(); ctx.moveTo(-8, -80); ctx.lineTo(pose ? -30 : -22, pose ? -104 : -58); ctx.moveTo(8, -80); ctx.lineTo(pose ? 28 : 22, pose ? -108 : -60); ctx.stroke();
    A.circle(ctx, 0, -94, 9); ctx.fillStyle = '#efd9c4'; ctx.fill();
    A.circle(ctx, 2, -100, 7); ctx.fillStyle = '#4a2e1c'; ctx.fill();
    ctx.restore();
    if (r) A.dabs(ctx, r, x - 30 * s, y - 70 * s, 60 * s, 30 * s, ['#ffffff', '#f2ece0'], 10, 4 * s, 0.5);
  };

  PT.degasDance = function (ctx, w, h, r, frame) {
    const u = frame ? h / 720 : 1;
    const fl = frame ? h * 0.55 : h * 0.62;
    A.vgrad(ctx, 0, 0, w, fl, ['#c2bd92', '#b0aa80']);
    A.dabs(ctx, r, 0, 0, w, fl, ['#c9c49a', '#a7a27a', '#d6cfa8', '#9ab0a0'], nd(w * fl, 18 * u) * 0.5, 18 * u, 0.35, Math.PI / 2);
    // pilasters & mirror
    for (let x = 120 * u, i = 0; x < w; x += 340 * u, i++) {
      ctx.fillStyle = '#d8d2b0'; ctx.fillRect(x, 0, 36 * u, fl); ctx.fillStyle = 'rgba(0,0,0,0.08)'; ctx.fillRect(x + 24 * u, 0, 12 * u, fl);
      if (i % 2 === 0 || frame) { ctx.fillStyle = '#6f7a6a'; ctx.fillRect(x + 70 * u, fl * 0.18, 180 * u, fl * 0.62); A.dabs(ctx, r, x + 70 * u, fl * 0.18, 180 * u, fl * 0.62, ['#8a9584', '#5b6656', '#a7b0a0'], 60, 10 * u, 0.5, Math.PI / 2); }
    }
    ctx.fillStyle = '#9a8f6a'; ctx.fillRect(0, fl - 14 * u, w, 14 * u);
    // floor boards with perspective
    A.vgrad(ctx, 0, fl, w, h - fl, ['#d4a974', '#b98a55']);
    ctx.strokeStyle = 'rgba(90,60,30,0.35)'; ctx.lineWidth = 2 * u;
    const vx = frame ? w * 0.85 : null;
    for (let x = -w; x < w * 2; x += 46 * u) { ctx.beginPath(); ctx.moveTo(vx ? vx + (x - vx) * 0.12 : x, fl); ctx.lineTo(vx ? x : x - 220 * u, h); ctx.stroke(); }
    A.dabs(ctx, r, 0, fl, w, h - fl, ['#e3bd88', '#c79a63', '#f0d6aa'], nd(w * (h - fl), 16 * u) * 0.4, 16 * u, 0.35, 0.2);
    const sashes = ['#7fb3d5', '#82c39a', '#f2a7bd', '#f4d03f', '#e59866'];
    if (frame) {
      [[0.12, 0.66, 1.5, 0], [0.22, 0.6, 1.3, 1], [0.08, 0.92, 2.1, 0], [0.38, 0.86, 1.9, 1], [0.86, 0.95, 2.2, 0], [0.72, 0.64, 1.3, 1]].forEach(([fx, fy, s, p], i) => A.dancer(ctx, fx * w, fy * h, s * h / 620, sashes[i % 5], p, r));
      // ballet master with cane
      const mx = w * 0.56, my = h * 0.86, s = h / 390;
      ctx.fillStyle = '#3b3a40'; A.rrect(ctx, mx - 22 * s, my - 140 * s, 44 * s, 100 * s, 14 * s); ctx.fill();
      ctx.fillRect(mx - 16 * s, my - 44 * s, 12 * s, 44 * s); ctx.fillRect(mx + 4 * s, my - 44 * s, 12 * s, 44 * s);
      A.circle(ctx, mx, my - 156 * s, 18 * s); ctx.fillStyle = '#e8c0a0'; ctx.fill();
      ctx.fillStyle = '#f2f2f2'; A.ellipse(ctx, mx + 4 * s, my - 168 * s, 18 * s, 8 * s); ctx.fill();
      ctx.strokeStyle = '#4a2e1c'; ctx.lineWidth = 5 * s; ctx.beginPath(); ctx.moveTo(mx + 30 * s, my - 100 * s); ctx.lineTo(mx + 46 * s, my); ctx.stroke();
    } else {
      spots(w, false, 300 * u).forEach((x, i) => A.dancer(ctx, x + r() * 60 * u, fl + 8 * u + r() * 10 * u, 1.05 * u, sashes[i % 5], i % 2, r));
    }
    A.texture(ctx, w, h, r, 0.07);
  };

  // ======================= REALISM =======================
  A.gleaner = function (ctx, x, y, s, skirt, cap, flip) {
    // a woman bending forward to pick up grain, facing right; y = ground
    ctx.save(); ctx.translate(x, y); ctx.scale(s * (flip ? -1 : 1), s);
    const skin = '#b07a52', blouse = '#d8cdb0';
    ctx.fillStyle = 'rgba(60,40,10,0.25)'; A.ellipse(ctx, 6, 0, 52, 7); ctx.fill();
    ctx.fillStyle = '#3e2e1e'; A.ellipse(ctx, 30, -4, 13, 5); ctx.fill(); A.ellipse(ctx, -30, -4, 12, 5); ctx.fill();
    // full skirt from the hips down
    let g = ctx.createLinearGradient(-44, 0, 36, 0); g.addColorStop(0, skirt); g.addColorStop(1, 'rgba(0,0,0,0.55)');
    ctx.fillStyle = skirt; ctx.beginPath(); ctx.moveTo(-28, -72); ctx.quadraticCurveTo(-50, -34, -44, -6); ctx.lineTo(38, -6); ctx.quadraticCurveTo(30, -42, 12, -72); ctx.closePath(); ctx.fill();
    ctx.fillStyle = g; ctx.globalAlpha = 0.45; ctx.fill(); ctx.globalAlpha = 1;
    // apron bundle tied at the back
    ctx.fillStyle = '#c9b48a'; A.ellipse(ctx, -26, -64, 16, 12, -0.3); ctx.fill();
    // rounded back, bent almost level
    ctx.fillStyle = blouse; ctx.beginPath(); ctx.moveTo(-26, -66); ctx.quadraticCurveTo(-28, -108, 14, -106); ctx.quadraticCurveTo(48, -104, 60, -80); ctx.quadraticCurveTo(52, -66, 36, -70); ctx.quadraticCurveTo(12, -76, 8, -64); ctx.closePath(); ctx.fill();
    g = ctx.createLinearGradient(0, -108, 0, -66); g.addColorStop(0, 'rgba(255,250,230,0.5)'); g.addColorStop(1, 'rgba(60,40,20,0.35)');
    ctx.fillStyle = g; ctx.fill();
    // head hangs low, covered by a cap
    A.circle(ctx, 68, -64, 12); ctx.fillStyle = skin; ctx.fill();
    ctx.fillStyle = cap; ctx.beginPath(); ctx.ellipse(62, -70, 15, 11, 0.5, 0, Math.PI * 2); ctx.fill();
    // arm reaching to the stubble
    ctx.lineCap = 'round';
    ctx.strokeStyle = blouse; ctx.lineWidth = 11; ctx.beginPath(); ctx.moveTo(50, -84); ctx.lineTo(60, -40); ctx.stroke();
    ctx.strokeStyle = skin; ctx.lineWidth = 8; ctx.beginPath(); ctx.moveTo(60, -40); ctx.lineTo(64, -12); ctx.stroke();
    // other hand holds gathered stalks behind her back
    ctx.strokeStyle = blouse; ctx.lineWidth = 10; ctx.beginPath(); ctx.moveTo(22, -100); ctx.lineTo(-4, -86); ctx.stroke();
    ctx.strokeStyle = '#e1b955'; ctx.lineWidth = 2.5;
    for (let i = -2; i <= 2; i++) { ctx.beginPath(); ctx.moveTo(-6, -86); ctx.lineTo(-24 + i * 4, -112); ctx.stroke(); }
    ctx.restore();
  };
  PT.milletGleaners = function (ctx, w, h, r, frame) {
    const u = frame ? h / 720 : 1, hor = h * (frame ? 0.36 : 0.38);
    A.vgrad(ctx, 0, 0, w, hor, ['#e9dcb4', '#efe2bd', '#e3cf98']);
    A.dabs(ctx, r, 0, 0, w, hor * 0.8, ['#fff6dd', '#f3e7c5', '#d9cfae'], nd(w * hor, 30 * u) * 0.4, 30 * u, 0.25, 0);
    A.vgrad(ctx, 0, hor, w, h - hor, ['#d9be72', '#c9a95a', '#a4813f', '#8f6e36']);
    // distant haystacks, cart and workers
    for (let x = 40 * u + r() * 100 * u; x < w; x += (frame ? 140 : 260) * u + r() * 160 * u) {
      const s = (0.6 + r() * 0.5) * u;
      ctx.fillStyle = '#d9b45a'; ctx.beginPath(); ctx.moveTo(x - 50 * s, hor + 10 * u); ctx.quadraticCurveTo(x - 46 * s, hor - 70 * s, x, hor - 76 * s); ctx.quadraticCurveTo(x + 46 * s, hor - 70 * s, x + 50 * s, hor + 10 * u); ctx.fill();
      ctx.fillStyle = 'rgba(120,90,40,0.35)'; ctx.beginPath(); ctx.moveTo(x, hor - 76 * s); ctx.quadraticCurveTo(x + 46 * s, hor - 70 * s, x + 50 * s, hor + 10 * u); ctx.lineTo(x + 10 * s, hor + 10 * u); ctx.fill();
      for (let k = 0; k < 3; k++) { ctx.fillStyle = '#5a4a30'; ctx.fillRect(x + 70 * s + k * 14 * u, hor - 8 * u, 4 * u, 12 * u); }
    }
    ctx.fillStyle = '#6b5a3a'; ctx.fillRect(w * 0.7, hor - 22 * u, 60 * u, 16 * u); A.circle(ctx, w * 0.7 + 12 * u, hor, 8 * u); ctx.fill(); A.circle(ctx, w * 0.7 + 50 * u, hor, 8 * u); ctx.fill();
    // stubble strokes
    ctx.save(); ctx.strokeStyle = '#7a5c2c'; ctx.lineWidth = 1.5 * u;
    for (let i = 0, n = nd(w * (h - hor), 14 * u); i < n; i++) {
      const y = hor + r() * (h - hor), x = r() * w, len = (3 + (y - hor) / h * 14) * u;
      ctx.globalAlpha = 0.35 * r(); ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + (r() - 0.5) * 3 * u, y - len); ctx.stroke();
    }
    ctx.restore();
    // the three gleaners
    if (frame) {
      A.gleaner(ctx, w * 0.12, h * 0.9, h / 250, '#3b4a6b', '#c0392b', false);
      A.gleaner(ctx, w * 0.42, h * 0.92, h / 240, '#7a5a3a', '#2e5a8a', false);
      A.gleaner(ctx, w * 0.8, h * 0.88, h / 280, '#5a5040', '#e8dcc5', true);
    } else {
      spots(w, false, 700 * u).forEach((x, i) => {
        A.gleaner(ctx, x - 90 * u, h * 0.64, u * 0.95, '#3b4a6b', '#c0392b', false);
        A.gleaner(ctx, x + 40 * u, h * 0.645, u * 1.0, '#7a5a3a', '#2e5a8a', false);
        A.gleaner(ctx, x + 180 * u, h * 0.635, u * 0.9, '#5a5040', '#e8dcc5', i % 2 === 0);
      });
    }
    A.texture(ctx, w, h, r, 0.06);
  };

  A.stoneWorker = function (ctx, x, y, s, kind) {
    ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
    ctx.lineCap = 'round';
    if (kind === 0) { // old man kneeling, hammer raised
      ctx.fillStyle = '#3c4a5a'; A.poly(ctx, [-30, -50, 20, -50, 40, 0, -40, 0]); ctx.fill();
      ctx.fillStyle = '#ece5d4'; A.rrect(ctx, -26, -120, 46, 74, 12); ctx.fill();
      ctx.fillStyle = '#4a3a2a'; A.rrect(ctx, -26, -110, 46, 40, 8); ctx.fill();
      A.circle(ctx, 0, -136, 16); ctx.fillStyle = '#b07a52'; ctx.fill();
      ctx.fillStyle = '#8a7a50'; A.ellipse(ctx, 0, -148, 26, 7); ctx.fill(); A.ellipse(ctx, 0, -154, 14, 9); ctx.fill();
      ctx.strokeStyle = '#ece5d4'; ctx.lineWidth = 12; ctx.beginPath(); ctx.moveTo(14, -112); ctx.lineTo(38, -150); ctx.stroke();
      ctx.strokeStyle = '#6b4a2b'; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(38, -150); ctx.lineTo(60, -190); ctx.stroke();
      ctx.fillStyle = '#6f7a80'; ctx.save(); ctx.translate(60, -190); ctx.rotate(-1); ctx.fillRect(-16, -6, 32, 12); ctx.restore();
    } else { // young man carrying a basket of stones
      ctx.fillStyle = '#5a4a3a'; ctx.fillRect(-18, -80, 14, 80); ctx.fillRect(4, -80, 14, 80);
      ctx.fillStyle = '#ece5d4'; A.rrect(ctx, -22, -150, 44, 76, 12); ctx.fill();
      ctx.fillStyle = '#7a6040'; A.rrect(ctx, -22, -110, 44, 18, 4); ctx.fill();
      A.circle(ctx, -4, -166, 15); ctx.fillStyle = '#c08a62'; ctx.fill();
      ctx.fillStyle = '#4a3020'; A.ellipse(ctx, -4, -176, 15, 8); ctx.fill();
      ctx.fillStyle = '#8b6a3b'; A.ellipse(ctx, 18, -104, 34, 18); ctx.fill();
      ctx.fillStyle = '#9aa0a0'; for (let i = 0; i < 5; i++) { A.circle(ctx, 2 + i * 8, -116 + (i % 2) * 4, 7); ctx.fill(); }
    }
    ctx.restore();
  };
  PT.courbetStone = function (ctx, w, h, r, frame) {
    const u = frame ? h / 720 : 1, gy = h * (frame ? 0.58 : 0.62);
    A.vgrad(ctx, 0, 0, w, gy, ['#2f3222', '#3f3b28', '#5a5236']);
    // sky openings
    const skyX = frame ? [w * 0.86] : spots(w, false, 900 * u);
    skyX.forEach((sx) => { ctx.fillStyle = '#9fb6c6'; ctx.beginPath(); ctx.moveTo(sx - 60 * u, 0); ctx.lineTo(sx + 160 * u, 0); ctx.lineTo(sx + 160 * u, h * 0.18); ctx.quadraticCurveTo(sx + 40 * u, h * 0.2, sx - 60 * u, 0); ctx.fill(); });
    A.dabs(ctx, r, 0, 0, w, gy, ['#2a3a22', '#3b4a2a', '#4a4a30', '#5a5a3a', '#252a1a'], nd(w * gy, 16 * u) * 0.6, 18 * u, 0.6);
    A.vgrad(ctx, 0, gy, w, h - gy, ['#8a7350', '#7a6444', '#5e4c33']);
    A.dabs(ctx, r, 0, gy, w, h - gy, ['#9a8360', '#6e5a3c', '#a89070'], nd(w * (h - gy), 14 * u) * 0.4, 12 * u, 0.45, 0);
    for (let i = 0, n = Math.floor(w / (26 * u)); i < n; i++) {
      const x = r() * w, y = gy + r() * (h - gy) * 0.95, s = (4 + r() * 10) * u * (0.6 + (y - gy) / (h - gy));
      A.ellipse(ctx, x, y, s * 1.3, s * 0.8); ctx.fillStyle = r() < 0.5 ? '#8d8f8a' : '#a7a69e'; ctx.fill();
      A.ellipse(ctx, x - s * 0.3, y - s * 0.3, s * 0.5, s * 0.3); ctx.fillStyle = 'rgba(255,255,255,0.25)'; ctx.fill();
    }
    if (frame) { A.stoneWorker(ctx, w * 0.62, h * 0.9, h / 380, 0); A.stoneWorker(ctx, w * 0.26, h * 0.92, h / 380, 1); }
    else spots(w, false, 800 * u).forEach((x) => { A.stoneWorker(ctx, x + 120 * u, gy + 18 * u, u * 0.9, 0); A.stoneWorker(ctx, x - 140 * u, gy + 14 * u, u * 0.85, 1); });
    A.texture(ctx, w, h, r, 0.07);
  };

  A.passenger = function (ctx, x, y, s, kind, r) {
    ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
    const col = ['#3a3428', '#4a3c2c', '#2c2a28', '#5a4a3a'][kind % 4];
    A.rrect(ctx, -30, -110, 60, 110, 22); ctx.fillStyle = col; ctx.fill();
    A.circle(ctx, 0, -126, 18); ctx.fillStyle = '#b08460'; ctx.fill();
    if (kind === 0) { ctx.fillStyle = '#e8dcc5'; A.ellipse(ctx, 0, -134, 22, 14); ctx.fill(); ctx.fillStyle = '#8b6a3b'; A.ellipse(ctx, 0, -20, 34, 18); ctx.fill(); }
    if (kind === 1) { ctx.fillStyle = '#c9b48a'; A.ellipse(ctx, 14, -66, 18, 14); ctx.fill(); A.circle(ctx, 20, -80, 8); ctx.fillStyle = '#d8a882'; ctx.fill(); }
    if (kind === 2) { ctx.fillStyle = '#1a1a1a'; A.ellipse(ctx, 0, -142, 22, 6); ctx.fill(); ctx.fillRect(-13, -164, 26, 22); }
    ctx.restore();
    ctx.save(); ctx.strokeStyle = 'rgba(20,14,8,0.6)'; ctx.lineWidth = 2.5 * s;
    for (let i = 0; i < 6; i++) { ctx.beginPath(); ctx.moveTo(x + (r() - 0.5) * 60 * s, y - r() * 120 * s); ctx.lineTo(x + (r() - 0.5) * 60 * s, y - r() * 120 * s); ctx.stroke(); }
    ctx.restore();
  };
  PT.daumierCarriage = function (ctx, w, h, r, frame) {
    const u = frame ? h / 720 : 1, fl = h * (frame ? 0.62 : 0.64);
    A.vgrad(ctx, 0, 0, w, fl, ['#2c2418', '#4a3d2a', '#5a4a33']);
    // windows
    for (let x = 40 * u; x < w; x += 190 * u) {
      ctx.fillStyle = '#c9c09a'; ctx.fillRect(x, h * 0.1, 140 * u, h * 0.22);
      A.dabs(ctx, r, x, h * 0.1, 140 * u, h * 0.22, ['#e3dcb8', '#a8a080', '#d6cfa8'], 30, 10 * u, 0.5);
      ctx.strokeStyle = '#2a2016'; ctx.lineWidth = 6 * u; ctx.strokeRect(x, h * 0.1, 140 * u, h * 0.22);
      ctx.beginPath(); ctx.moveTo(x + 70 * u, h * 0.1); ctx.lineTo(x + 70 * u, h * 0.32); ctx.stroke();
    }
    // background heads with hats
    for (let x = 20 * u; x < w; x += 46 * u + r() * 30 * u) {
      const y = h * 0.44 + r() * 14 * u;
      ctx.fillStyle = '#2a2219'; A.circle(ctx, x, y, 16 * u); ctx.fill();
      if (r() < 0.6) { ctx.fillRect(x - 14 * u, y - 30 * u, 28 * u, 18 * u); A.ellipse(ctx, x, y - 12 * u, 22 * u, 5 * u); ctx.fill(); }
      A.rrect(ctx, x - 24 * u, y + 10 * u, 48 * u, 50 * u, 12 * u); ctx.fill();
    }
    // bench backs
    ctx.fillStyle = '#6a5236'; ctx.fillRect(0, h * 0.52, w, 16 * u); ctx.fillRect(0, h * 0.56, w, 12 * u);
    ctx.fillStyle = '#3b2d1c'; ctx.fillRect(0, h * 0.6, w, 8 * u);
    // floor
    A.vgrad(ctx, 0, fl, w, h - fl, ['#3e3122', '#2e2418']);
    ctx.strokeStyle = 'rgba(0,0,0,0.3)'; ctx.lineWidth = 2 * u;
    for (let y = fl + 20 * u; y < h; y += 30 * u) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke(); }
    if (frame) {
      ctx.fillStyle = '#5a4630'; ctx.fillRect(0, h * 0.8, w, 20 * u);
      A.passenger(ctx, w * 0.18, h * 0.96, h / 380, 1, r);
      A.passenger(ctx, w * 0.44, h * 0.97, h / 350, 0, r);
      A.passenger(ctx, w * 0.7, h * 0.95, h / 390, 3, r);
      A.passenger(ctx, w * 0.9, h * 0.92, h / 440, 2, r);
    } else spots(w, false, 600 * u).forEach((x, i) => { A.passenger(ctx, x - 70 * u, fl + 4 * u, u * 0.8, i % 4, r); A.passenger(ctx, x + 60 * u, fl + 4 * u, u * 0.78, (i + 2) % 4, r); });
    A.vignette(ctx, w, h, 0.45);
    A.texture(ctx, w, h, r, 0.07);
  };

  // ======================= ABSTRACT =======================
  PT.kandinsky7 = function (ctx, w, h, r, frame) {
    const u = frame ? h / 720 : 1;
    ctx.fillStyle = '#e9e0c9'; ctx.fillRect(0, 0, w, h);
    const washes = ['rgba(46,90,160,', 'rgba(200,48,42,', 'rgba(242,194,48,', 'rgba(120,70,150,', 'rgba(60,140,90,', 'rgba(230,120,50,'];
    for (let i = 0, n = Math.floor(w * h / (60000 * u * u)) + 6; i < n; i++) {
      const x = r() * w, y = r() * h * 0.8, rad = (60 + r() * 160) * u, c = washes[(r() * washes.length) | 0];
      const g = ctx.createRadialGradient(x, y, 0, x, y, rad); g.addColorStop(0, c + '0.55)'); g.addColorStop(1, c + '0)');
      ctx.fillStyle = g; ctx.fillRect(x - rad, y - rad, rad * 2, rad * 2);
    }
    const cols = ['#1f3f8f', '#c8302a', '#f2c230', '#2a2a2a', '#3c8c5a', '#8a4fa0', '#e67e22'];
    const n = Math.floor(w * h / (9000 * u * u));
    for (let i = 0; i < n; i++) {
      const x = r() * w, y = r() * h * (frame ? 1 : 0.68), k = r();
      ctx.save(); ctx.translate(x, y); ctx.rotate(r() * 6.28);
      if (k < 0.18) { const rad = (10 + r() * 40) * u; for (let j = 3; j > 0; j--) { A.circle(ctx, 0, 0, rad * j / 3); ctx.fillStyle = cols[(r() * cols.length) | 0]; ctx.fill(); } }
      else if (k < 0.42) { ctx.strokeStyle = INK; ctx.lineWidth = (1.5 + r() * 5) * u; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(0, 0); ctx.bezierCurveTo(r() * 120 * u, -r() * 120 * u, r() * 160 * u, r() * 80 * u, (r() - 0.5) * 260 * u, (r() - 0.5) * 140 * u); ctx.stroke(); }
      else if (k < 0.55) { ctx.fillStyle = cols[(r() * cols.length) | 0]; A.poly(ctx, [0, 0, (30 + r() * 80) * u, 6 * u, 0, (10 + r() * 30) * u]); ctx.fill(); }
      else if (k < 0.63) { const s = 8 * u; for (let a = 0; a < 4; a++) for (let b = 0; b < 4; b++) { ctx.fillStyle = (a + b) % 2 ? INK : cols[(r() * 3) | 0]; ctx.fillRect(a * s, b * s, s, s); } }
      else if (k < 0.75) { ctx.strokeStyle = cols[(r() * cols.length) | 0]; ctx.lineWidth = 3 * u; ctx.beginPath(); for (let t = 0; t < 8; t++) ctx.lineTo(t * 12 * u, Math.sin(t * 1.4) * 10 * u); ctx.stroke(); }
      else if (k < 0.88) { ctx.fillStyle = cols[(r() * cols.length) | 0]; ctx.globalAlpha = 0.85; A.ellipse(ctx, 0, 0, (20 + r() * 50) * u, (8 + r() * 26) * u); ctx.fill(); }
      else { ctx.strokeStyle = INK; ctx.lineWidth = 2 * u; for (let t = 0; t < 5; t++) { ctx.beginPath(); ctx.moveTo(t * 8 * u, 0); ctx.lineTo(t * 8 * u + 30 * u, 50 * u); ctx.stroke(); } }
      ctx.restore();
    }
    if (frame) { // central dark vortex of Composition VII
      ctx.strokeStyle = INK; ctx.lineWidth = 4 * u;
      for (let i = 0; i < 4; i++) { ctx.beginPath(); ctx.ellipse(w * 0.48, h * 0.48, (40 + i * 22) * u, (24 + i * 14) * u, -0.5 + i * 0.3, 0, 4.5); ctx.stroke(); }
    } else {
      const gy = h * 0.68;
      ctx.fillStyle = 'rgba(233,224,201,0.85)'; ctx.fillRect(0, gy, w, h - gy);
      ctx.strokeStyle = INK; ctx.lineWidth = 6 * u; ctx.beginPath();
      for (let x = 0; x <= w; x += 20 * u) ctx.lineTo(x, gy + Math.sin(x * 0.006) * 14 * u);
      ctx.stroke();
      for (let x = 0; x < w; x += 70 * u) { ctx.fillStyle = cols[(r() * cols.length) | 0]; ctx.globalAlpha = 0.35; A.circle(ctx, x + r() * 40 * u, gy + 40 * u + r() * (h - gy - 60 * u), (6 + r() * 16) * u); ctx.fill(); ctx.globalAlpha = 1; }
    }
    A.texture(ctx, w, h, r, 0.05);
  };

  PT.mondrian = function (ctx, w, h, r, frame) {
    const u = frame ? h / 720 : 1, lw = (frame ? h * 0.035 : 14 * u);
    ctx.fillStyle = '#f3efe6'; ctx.fillRect(0, 0, w, h);
    const RED = '#c8302a', BLUE = '#1f3f8f', YEL = '#f2c230';
    const vline = (x, y0, y1) => { ctx.fillStyle = INK; ctx.fillRect(x - lw / 2, y0, lw, y1 - y0); };
    const hline = (y, x0, x1) => { ctx.fillStyle = INK; ctx.fillRect(x0, y - lw / 2, x1 - x0, lw); };
    if (frame) {
      const x1 = w * 0.25, y1 = h * 0.33, y2 = h * 0.72, x2 = w * 0.92, y3 = h * 0.86;
      ctx.fillStyle = RED; ctx.fillRect(x1, 0, w - x1, y2);
      ctx.fillStyle = BLUE; ctx.fillRect(0, y2, x1, h - y2);
      ctx.fillStyle = YEL; ctx.fillRect(x2, y3, w - x2, h - y3);
      vline(x1, 0, h); hline(y1, 0, x1); hline(y2, 0, w); vline(x2, y2, h); hline(y3, x2, w);
    } else {
      const gy = h * 0.66;
      let x = 0;
      while (x < w) {
        const cw = (120 + r() * 260) * u, ys = [0];
        let y = 0;
        while (y < gy - 80 * u) { y += (90 + r() * 200) * u; ys.push(Math.min(y, gy)); }
        if (ys[ys.length - 1] < gy) ys.push(gy);
        for (let i = 0; i < ys.length - 1; i++) {
          const k = r();
          if (k < 0.12) ctx.fillStyle = RED; else if (k < 0.2) ctx.fillStyle = BLUE; else if (k < 0.28) ctx.fillStyle = YEL; else continue;
          ctx.fillRect(x, ys[i], cw, ys[i + 1] - ys[i]);
        }
        for (let i = 1; i < ys.length - 1; i++) hline(ys[i], x, x + cw);
        x += cw; vline(x, 0, gy);
      }
      hline(gy, 0, w);
      ctx.fillStyle = '#ebe6da'; ctx.fillRect(0, gy + lw / 2, w, h - gy);
      for (let xx = 200 * u; xx < w; xx += (300 + r() * 400) * u) vline(xx, gy, h);
      hline(h * 0.97, 0, w);
    }
    A.texture(ctx, w, h, r, 0.04);
  };

  PT.malevich = function (ctx, w, h, r, frame) {
    const u = frame ? h / 720 : 1;
    ctx.fillStyle = '#ece6d4'; ctx.fillRect(0, 0, w, h);
    A.dabs(ctx, r, 0, 0, w, h, ['#e3dcc6', '#f2ecdc', '#d9d0b8'], nd(w * h, 30 * u) * 0.3, 30 * u, 0.3);
    const sq = (cx, cy, s, rot) => {
      ctx.save(); ctx.translate(cx, cy); ctx.rotate(rot || 0);
      ctx.fillStyle = '#141414'; A.poly(ctx, [-s / 2 + r() * 4 * u, -s / 2, s / 2, -s / 2 + r() * 4 * u, s / 2 - r() * 4 * u, s / 2, -s / 2, s / 2 - r() * 4 * u]); ctx.fill();
      ctx.strokeStyle = 'rgba(200,190,160,0.25)'; ctx.lineWidth = 1.2 * u;
      for (let i = 0; i < s / (6 * u); i++) { let x = (r() - 0.5) * s, y = (r() - 0.5) * s; ctx.beginPath(); ctx.moveTo(x, y); for (let k = 0; k < 4; k++) { x += (r() - 0.5) * 30 * u; y += (r() - 0.5) * 30 * u; ctx.lineTo(G.clamp(x, -s / 2, s / 2), G.clamp(y, -s / 2, s / 2)); } ctx.stroke(); }
      ctx.restore();
    };
    if (frame) sq(w / 2, h / 2, h * 0.64, 0);
    else {
      const gy = h * 0.68;
      sq(w * 0.5, gy * 0.48, gy * 0.62, 0);
      const cols = ['#141414', '#c8302a', '#f2c230', '#1f3f8f', '#3c8c5a'];
      for (let i = 0, n = Math.floor(w / (110 * u)); i < n; i++) {
        const x = r() * w; if (Math.abs(x - w * 0.5) < gy * 0.4) continue;
        ctx.save(); ctx.translate(x, r() * gy * 0.85 + 30 * u); ctx.rotate((r() - 0.5) * 1.2);
        ctx.fillStyle = cols[(r() * cols.length) | 0];
        const k = r();
        if (k < 0.55) ctx.fillRect(-(20 + r() * 90) * u, -(5 + r() * 14) * u, (40 + r() * 180) * u, (10 + r() * 28) * u);
        else if (k < 0.8) { A.circle(ctx, 0, 0, (10 + r() * 30) * u); ctx.fill(); }
        else { A.poly(ctx, [0, -30 * u, 40 * u, 20 * u, -40 * u, 20 * u]); ctx.fill(); }
        ctx.restore();
      }
      ctx.fillStyle = 'rgba(0,0,0,0.06)'; ctx.fillRect(0, gy, w, h - gy);
      ctx.fillStyle = 'rgba(0,0,0,0.25)'; ctx.fillRect(0, gy, w, 3 * u);
    }
    // craquelure
    ctx.strokeStyle = 'rgba(80,70,50,0.18)'; ctx.lineWidth = 1 * u;
    for (let i = 0, n = Math.floor(w * h / (4000 * u * u)); i < n; i++) { let x = r() * w, y = r() * h; ctx.beginPath(); ctx.moveTo(x, y); for (let k = 0; k < 3; k++) { x += (r() - 0.5) * 40 * u; y += (r() - 0.5) * 40 * u; ctx.lineTo(x, y); } ctx.stroke(); }
    A.texture(ctx, w, h, r, 0.05);
  };

  // ======================= SURREALISM (originals) =======================
  A.meltClock = function (ctx, x, y, s, kind) {
    // a soft clock drooping over an edge at (x, y)
    ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
    ctx.fillStyle = '#e8c45a'; ctx.strokeStyle = '#6a5020'; ctx.lineWidth = 3;
    ctx.beginPath();
    if (kind === 1) { ctx.moveTo(-50, -6); ctx.bezierCurveTo(-46, -30, 30, -34, 48, -8); ctx.bezierCurveTo(54, 6, 28, 10, 22, 34); ctx.bezierCurveTo(18, 70, 2, 80, 0, 50); ctx.bezierCurveTo(-4, 20, -50, 20, -50, -6); }
    else { ctx.moveTo(-60, 0); ctx.bezierCurveTo(-50, -22, 50, -22, 60, 0); ctx.bezierCurveTo(62, 20, 40, 40, 30, 70); ctx.bezierCurveTo(26, 90, 10, 92, 8, 70); ctx.bezierCurveTo(4, 40, -20, 30, -40, 40); ctx.bezierCurveTo(-60, 46, -66, 20, -60, 0); }
    ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#fbf3dc';
    ctx.beginPath(); ctx.ellipse(0, kind === 1 ? -4 : 6, 38, kind === 1 ? 16 : 22, 0.05, 0, 6.28); ctx.fill();
    ctx.strokeStyle = '#3a2a10'; ctx.lineWidth = 2;
    for (let i = 0; i < 12; i++) { const a = i * Math.PI / 6; ctx.beginPath(); ctx.moveTo(Math.cos(a) * 30, (kind === 1 ? -4 : 6) + Math.sin(a) * 13); ctx.lineTo(Math.cos(a) * 35, (kind === 1 ? -4 : 6) + Math.sin(a) * 15); ctx.stroke(); }
    ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(0, kind === 1 ? -4 : 6); ctx.lineTo(18, kind === 1 ? -10 : 0); ctx.moveTo(0, kind === 1 ? -4 : 6); ctx.lineTo(-6, kind === 1 ? 6 : 20); ctx.stroke();
    ctx.restore();
  };
  A.deadTree = function (ctx, x, y, s) {
    ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
    ctx.fillStyle = '#5a3e26';
    ctx.beginPath(); ctx.moveTo(-10, 0); ctx.lineTo(-6, -150); ctx.quadraticCurveTo(10, -190, 70, -196); ctx.lineTo(72, -186); ctx.quadraticCurveTo(20, -180, 8, -140); ctx.lineTo(10, 0); ctx.fill();
    ctx.restore();
  };
  PT.daliMelting = function (ctx, w, h, r, frame) {
    const u = frame ? h / 720 : 1, hor = h * (frame ? 0.52 : 0.5);
    A.vgrad(ctx, 0, 0, w, hor, ['#1f3f73', '#4f7fae', '#a9c4d8', '#f2dfa7']);
    ctx.fillStyle = '#4a7ba6'; ctx.fillRect(0, hor - 14 * u, w, 18 * u);
    ctx.fillStyle = 'rgba(255,240,200,0.6)'; ctx.fillRect(0, hor - 14 * u, w, 2 * u);
    // golden cliffs
    const cliffs = frame ? [w * 0.86] : spots(w, false, 900 * u);
    cliffs.forEach((cx) => {
      ctx.fillStyle = '#d4a24c'; ctx.beginPath(); ctx.moveTo(cx - 200 * u, hor + 4 * u);
      ctx.lineTo(cx - 140 * u, hor - 80 * u); ctx.lineTo(cx - 60 * u, hor - 110 * u); ctx.lineTo(cx + 40 * u, hor - 150 * u); ctx.lineTo(cx + 160 * u, hor - 120 * u); ctx.lineTo(cx + 240 * u, hor + 4 * u); ctx.fill();
      ctx.fillStyle = '#a8741f'; ctx.beginPath(); ctx.moveTo(cx + 40 * u, hor - 150 * u); ctx.lineTo(cx + 160 * u, hor - 120 * u); ctx.lineTo(cx + 240 * u, hor + 4 * u); ctx.lineTo(cx + 60 * u, hor + 4 * u); ctx.fill();
    });
    A.vgrad(ctx, 0, hor, w, h - hor, ['#a07a44', '#7a5a30', '#4e3a20']);
    ctx.fillStyle = 'rgba(30,20,10,0.35)';
    for (let x = 0; x < w; x += 300 * u) { ctx.beginPath(); ctx.moveTo(x, hor + 40 * u); ctx.lineTo(x + 600 * u, hor + 70 * u); ctx.lineTo(x + 600 * u, hor + 100 * u); ctx.lineTo(x, hor + 50 * u); ctx.fill(); }
    // long-legged elephant in the distance
    const ex = frame ? w * 0.6 : w * 0.35;
    ctx.strokeStyle = '#2a2018'; ctx.fillStyle = '#2a2018'; ctx.lineWidth = 2 * u;
    ctx.beginPath(); for (const lx of [-14, -6, 6, 14]) { ctx.moveTo(ex + lx * u, hor - 4 * u); ctx.lineTo(ex + lx * u * 0.6, hor - 110 * u); } ctx.stroke();
    A.ellipse(ctx, ex, hor - 118 * u, 22 * u, 12 * u); ctx.fill();
    ctx.beginPath(); ctx.moveTo(ex + 20 * u, hor - 118 * u); ctx.quadraticCurveTo(ex + 34 * u, hor - 100 * u, ex + 30 * u, hor - 84 * u); ctx.stroke();
    if (frame) {
      A.deadTree(ctx, w * 0.2, h * 0.72, h / 392);
      A.meltClock(ctx, w * 0.2 + 66 * h / 392, h * 0.72 - 192 * h / 392, h / 520, 1);
      ctx.fillStyle = '#5a4026'; ctx.fillRect(0, h * 0.72, w * 0.42, h * 0.1); ctx.fillStyle = '#3e2a16'; ctx.fillRect(0, h * 0.82, w * 0.42, h * 0.04);
      A.meltClock(ctx, w * 0.36, h * 0.74, h / 420, 1);
      A.meltClock(ctx, w * 0.6, h * 0.88, h / 380, 0);
    } else {
      for (let x = 500 * u; x < w; x += 900 * u) A.meltClock(ctx, x, hor + 40 * u, 0.8 * u, 0);
    }
    A.texture(ctx, w, h, r, 0.05);
  };

  A.bowlerMan = function (ctx, x, y, s) {
    ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
    ctx.fillStyle = '#1e1e24'; A.rrect(ctx, -12, -10, 24, 46, 8); ctx.fill();
    A.circle(ctx, 0, -18, 9); ctx.fillStyle = '#d9b08a'; ctx.fill();
    ctx.fillStyle = '#141418'; A.ellipse(ctx, 0, -24, 13, 3.5); ctx.fill(); A.ellipse(ctx, 0, -28, 8, 7); ctx.fill();
    ctx.restore();
  };
  PT.magritteHats = function (ctx, w, h, r, frame) {
    const u = frame ? h / 720 : 1, hz = h * (frame ? 0.52 : 0.5);
    A.vgrad(ctx, 0, 0, w, hz, ['#4f97d6', '#7fb8e6', '#bfe0f5']);
    for (let i = 0, n = Math.max(4, Math.floor(w / (260 * u))); i < n; i++) {
      const cx = r() * w, cy = r() * hz * 0.6 + 30 * u, s = (0.7 + r() * 0.8) * u;
      ctx.fillStyle = '#ffffff';
      for (let k = 0; k < 6; k++) { A.circle(ctx, cx + (k - 2.5) * 26 * s, cy + Math.sin(k * 1.7) * 10 * s, (24 + r() * 14) * s); ctx.fill(); }
      ctx.fillStyle = 'rgba(160,190,220,0.4)'; A.ellipse(ctx, cx, cy + 22 * s, 80 * s, 10 * s); ctx.fill();
    }
    // night street
    A.vgrad(ctx, 0, hz - 120 * u, w, h - hz + 120 * u, [[0, 'rgba(10,16,14,0)'], [0.25, '#0f1a14'], [1, '#0b0f10']]);
    ctx.fillStyle = '#0d1611';
    for (let x = -40; x < w; x += 70 * u) { A.circle(ctx, x, hz - 40 * u - r() * 60 * u, (40 + r() * 30) * u); ctx.fill(); }
    const houses = frame ? [w * 0.5] : spots(w, false, 700 * u);
    houses.forEach((hx) => {
      ctx.fillStyle = '#26262c'; ctx.fillRect(hx - 130 * u, hz - 70 * u, 260 * u, 150 * u);
      A.poly(ctx, [hx - 145 * u, hz - 66 * u, hx, hz - 140 * u, hx + 145 * u, hz - 66 * u]); ctx.fill();
      for (const [wx, wy] of [[-90, -40], [50, -40], [-90, 20], [50, 20]]) {
        A.glow(ctx, hx + (wx + 20) * u, hz + (wy + 15) * u, 50 * u, 'rgba(255,200,110,0.4)');
        ctx.fillStyle = '#ffcf7a'; ctx.fillRect(hx + wx * u, hz + wy * u, 40 * u, 30 * u);
      }
      // street lamp
      const lx = hx + 190 * u;
      ctx.fillStyle = '#111'; ctx.fillRect(lx - 3 * u, hz - 40 * u, 6 * u, 130 * u);
      A.glow(ctx, lx, hz - 44 * u, 90 * u, 'rgba(255,214,140,0.7)');
      A.circle(ctx, lx, hz - 44 * u, 9 * u); ctx.fillStyle = '#ffe0a0'; ctx.fill();
    });
    ctx.fillStyle = '#1c1d22'; ctx.fillRect(0, hz + 80 * u, w, h - hz - 80 * u);
    ctx.strokeStyle = 'rgba(255,255,255,0.05)'; ctx.lineWidth = 2 * u;
    for (let y = hz + 100 * u; y < h; y += 28 * u) for (let x = (y / (28 * u)) % 2 * 20 * u; x < w; x += 40 * u) ctx.strokeRect(x, y, 40 * u, 28 * u);
    // raining gentlemen
    for (let yy = 30 * u, row = 0; yy < hz - 20 * u; yy += 90 * u, row++) for (let x = (row % 2) * 60 * u + 30 * u; x < w; x += 120 * u) A.bowlerMan(ctx, x + r() * 20 * u, yy + r() * 20 * u, (0.6 + 0.3 * (yy / hz)) * u * (frame ? 0.8 : 1));
    A.texture(ctx, w, h, r, 0.04);
  };

  A.miroStar = function (ctx, x, y, s) {
    ctx.strokeStyle = INK; ctx.lineWidth = 3 * s; ctx.lineCap = 'round';
    ctx.beginPath(); for (let i = 0; i < 4; i++) { const a = i * Math.PI / 4; ctx.moveTo(x - Math.cos(a) * 16 * s, y - Math.sin(a) * 16 * s); ctx.lineTo(x + Math.cos(a) * 16 * s, y + Math.sin(a) * 16 * s); } ctx.stroke();
  };
  PT.miroGarden = function (ctx, w, h, r, frame) {
    const u = frame ? h / 720 : 1;
    A.vgrad(ctx, 0, 0, w, h, ['#a9c8dc', '#d6dccb', '#ece2c6']);
    ctx.fillStyle = 'rgba(255,255,255,0.25)'; for (let i = 0; i < w / (80 * u); i++) { A.circle(ctx, r() * w, r() * h, (30 + r() * 80) * u); ctx.fill(); }
    const cols = ['#c8302a', '#f2c230', '#1f3f8f', '#2f7a4a', '#151515'];
    const n = Math.floor(w * h / (22000 * u * u)) + 5;
    for (let i = 0; i < n; i++) {
      const x = r() * w, y = r() * h * (frame ? 0.95 : 0.66) + 20 * u, k = r(), s = (0.7 + r() * 0.9) * u;
      ctx.lineWidth = 3 * s; ctx.strokeStyle = INK;
      if (k < 0.22) A.miroStar(ctx, x, y, s * 1.4);
      else if (k < 0.34) { ctx.fillStyle = cols[i % 5]; ctx.beginPath(); ctx.arc(x, y, 22 * s, 0.7, Math.PI * 2 - 0.7); ctx.arc(x + 12 * s, y, 18 * s, Math.PI * 2 - 1, 1, true); ctx.closePath(); ctx.fill(); ctx.stroke(); }
      else if (k < 0.48) { ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.moveTo(x - 28 * s, y); ctx.quadraticCurveTo(x, y - 22 * s, x + 28 * s, y); ctx.quadraticCurveTo(x, y + 22 * s, x - 28 * s, y); ctx.fill(); ctx.stroke(); A.circle(ctx, x, y, 8 * s); ctx.fillStyle = INK; ctx.fill(); }
      else if (k < 0.72) { ctx.fillStyle = cols[(r() * 5) | 0]; ctx.beginPath(); ctx.moveTo(x, y - 30 * s); ctx.bezierCurveTo(x + 50 * s, y - 34 * s, x + 30 * s, y + 30 * s, x, y + 26 * s); ctx.bezierCurveTo(x - 36 * s, y + 24 * s, x - 40 * s, y - 26 * s, x, y - 30 * s); ctx.fill(); ctx.stroke(); }
      else if (k < 0.86) { ctx.beginPath(); ctx.moveTo(x, y); ctx.bezierCurveTo(x + 60 * s, y - 80 * s, x + 120 * s, y + 40 * s, x + 200 * s, y - 20 * s); ctx.stroke(); A.circle(ctx, x + 200 * s, y - 20 * s, 7 * s); ctx.fillStyle = INK; ctx.fill(); }
      else { ctx.beginPath(); for (let t = 0; t < 22; t++) { const a = t * 0.6, rr = t * 1.4 * s; ctx.lineTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr); } ctx.stroke(); }
    }
    if (!frame) {
      const gy = h * 0.68;
      ctx.fillStyle = 'rgba(236,226,198,0.9)'; ctx.fillRect(0, gy, w, h - gy);
      ctx.strokeStyle = INK; ctx.lineWidth = 3 * u; ctx.beginPath(); ctx.moveTo(0, gy); ctx.lineTo(w, gy); ctx.stroke();
    } else {
      ctx.fillStyle = '#f2c230'; A.circle(ctx, w * 0.78, h * 0.22, h * 0.08); ctx.fill(); ctx.lineWidth = 3 * u; ctx.stroke();
    }
    A.texture(ctx, w, h, r, 0.05);
  };

  // ======================= POP ART (originals) =======================
  A.soupCan = function (ctx, x, y, s, top, mid, off) {
    // y = bottom
    ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
    if (off) { ctx.globalAlpha = 0.5; ctx.fillStyle = top; A.rrect(ctx, -36 + 5, -150 + 3, 72, 150, 8); ctx.fill(); ctx.globalAlpha = 1; }
    A.rrect(ctx, -36, -150, 72, 150, 8); ctx.fillStyle = '#f7f4ee'; ctx.fill();
    ctx.fillStyle = top; ctx.fillRect(-36, -142, 72, 64);
    A.ellipse(ctx, 0, -150, 36, 9); ctx.fillStyle = '#c9c9c9'; ctx.fill(); ctx.strokeStyle = INK; ctx.lineWidth = 3; ctx.stroke();
    ctx.fillStyle = '#fff'; ctx.font = '900 20px Arial'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('SOUP', 0, -112);
    A.circle(ctx, 0, -60, 13); ctx.fillStyle = mid; ctx.fill(); ctx.stroke();
    ctx.fillStyle = INK; ctx.font = '800 13px Arial'; ctx.fillText('TOMATO', 0, -28);
    A.rrect(ctx, -36, -150, 72, 150, 8); ctx.stroke();
    ctx.restore();
  };
  PT.warholCans = function (ctx, w, h, r, frame) {
    const u = frame ? h / 720 : 1;
    const bgs = ['#f06292', '#ffd54f', '#4fc3f7', '#ff8a65', '#aed581', '#ba68c8'];
    const tops = ['#e53935', '#1e88e5', '#8e24aa', '#43a047', '#fb8c00', '#e53935'];
    if (frame) {
      const cols = 3, rows = 2, cw = w / cols, ch = h / rows;
      for (let i = 0; i < cols * rows; i++) {
        const cx = (i % cols) * cw, cy = Math.floor(i / cols) * ch;
        ctx.fillStyle = bgs[i]; ctx.fillRect(cx, cy, cw, ch);
        A.soupCan(ctx, cx + cw / 2, cy + ch * 0.9, ch / 190, tops[i], bgs[(i + 2) % 6], true);
      }
    } else {
      const gy = h * 0.66, ps = gy / 3;
      for (let row = 0; row < 3; row++) for (let x = 0, i = row; x < w; x += ps, i++) {
        ctx.fillStyle = bgs[i % 6]; ctx.fillRect(x, row * ps, ps, ps);
        A.soupCan(ctx, x + ps / 2, row * ps + ps * 0.88, ps / 190, tops[(i * 5) % 6], bgs[(i + 3) % 6], r() < 0.5);
      }
      ctx.fillStyle = INK; ctx.fillRect(0, gy - 4 * u, w, 8 * u);
      for (let x = 0, i = 0; x < w; x += 80 * u, i++) { ctx.fillStyle = i % 2 ? '#fce4ec' : '#fff9c4'; ctx.fillRect(x, gy + 4 * u, 80 * u, h - gy); }
      A.halftone(ctx, 0, gy + 4 * u, w, h - gy, 'rgba(240,98,146,0.25)', 18 * u, 4 * u);
    }
    A.texture(ctx, w, h, r, 0.03);
  };

  A.burst = function (ctx, x, y, rad, text, c1, c2, rot) {
    ctx.save(); ctx.translate(x, y); ctx.rotate(rot || 0); G.ltr(ctx);
    const star = (rr, col) => {
      ctx.beginPath();
      for (let i = 0; i < 24; i++) { const a = i * Math.PI / 12, k = i % 2 ? 0.62 : 1 + (i % 4 === 0 ? 0.15 : 0); ctx.lineTo(Math.cos(a) * rr * k, Math.sin(a) * rr * k * 0.8); }
      ctx.closePath(); ctx.fillStyle = col; ctx.fill(); ctx.strokeStyle = INK; ctx.lineWidth = rad * 0.05; ctx.stroke();
    };
    star(rad, c1 || '#f4d03f'); star(rad * 0.66, c2 || '#e74c3c');
    if (text) {
      ctx.font = '900 ' + rad * 0.42 + 'px Impact, Arial Black, Arial'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.lineWidth = rad * 0.07; ctx.strokeStyle = INK; ctx.strokeText(text, 0, 0); ctx.fillStyle = '#fff'; ctx.fillText(text, 0, 0);
    }
    ctx.restore();
  };
  A.brushStroke = function (ctx, x, y, s) {
    ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
    ctx.beginPath(); ctx.moveTo(-120, 30); ctx.bezierCurveTo(-60, -60, 40, -70, 130, -20); ctx.bezierCurveTo(140, -10, 130, 10, 110, 4); ctx.bezierCurveTo(30, -30, -40, -20, -96, 46); ctx.closePath();
    ctx.fillStyle = '#f4d03f'; ctx.fill(); ctx.strokeStyle = INK; ctx.lineWidth = 7; ctx.stroke();
    ctx.lineWidth = 4; for (let i = 0; i < 4; i++) { ctx.beginPath(); ctx.moveTo(-80 + i * 10, 20 - i * 6); ctx.bezierCurveTo(-30, -30 - i * 4, 40, -40 - i * 3, 110, -6 - i * 2); ctx.stroke(); }
    ctx.restore();
  };
  PT.lichtComic = function (ctx, w, h, r, frame) {
    const u = frame ? h / 720 : 1;
    ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, w, h);
    if (frame) {
      A.halftone(ctx, 0, 0, w, h, '#5dade2', h * 0.028, h * 0.009);
      A.burst(ctx, w * 0.6, h * 0.45, h * 0.36, 'POP!', '#f4d03f', '#e74c3c', -0.08);
      A.brushStroke(ctx, w * 0.26, h * 0.8, h / 520);
      ctx.strokeStyle = INK; ctx.lineWidth = h * 0.03; ctx.strokeRect(0, 0, w, h);
    } else {
      const gy = h * 0.66, pw = 380 * u;
      const words = ['POW!', 'ZAP!', 'WOW!', 'POP!', 'BAM!'];
      for (let x = 0, i = 0; x < w; x += pw, i++) {
        ctx.fillStyle = ['#fff', '#fdebd0', '#e8f6ff'][i % 3]; ctx.fillRect(x, 0, pw, gy);
        A.halftone(ctx, x, 0, pw, gy, ['#5dade2', '#f1948a', '#f7dc6f'][i % 3], 22 * u, 6 * u);
        if (i % 2 === 0) A.burst(ctx, x + pw / 2, gy * 0.45, 120 * u, words[(i / 2) % 5 | 0], i % 4 ? '#f4d03f' : '#5dade2', '#e74c3c', (r() - 0.5) * 0.3);
        else { A.brushStroke(ctx, x + pw / 2, gy * 0.5, 0.9 * u); }
        ctx.strokeStyle = INK; ctx.lineWidth = 10 * u; ctx.strokeRect(x + 8 * u, 8 * u, pw - 16 * u, gy - 16 * u);
      }
      ctx.fillStyle = '#fff3c4'; ctx.fillRect(0, gy, w, h - gy);
      A.halftone(ctx, 0, gy, w, h - gy, 'rgba(231,76,60,0.55)', 20 * u, 5 * u);
      ctx.fillStyle = INK; ctx.fillRect(0, gy - 5 * u, w, 10 * u);
    }
  };

  A.haringFig = function (ctx, x, y, s, color, pose) {
    ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
    const t = pose || 0;
    const limbs = [
      [0, -70, -34 - 10 * Math.sin(t), -120 + 10 * Math.cos(t)], [0, -70, 34 + 10 * Math.sin(t), -110 - 12 * Math.cos(t)],
      [0, -40, -26 - 8 * Math.cos(t), 0], [0, -40, 30, -10 + 10 * Math.sin(t)],
      [0, -90, 0, -40],
    ];
    for (const pass of [[INK, 26], [color, 14]]) {
      ctx.strokeStyle = pass[0]; ctx.lineWidth = pass[1]; ctx.lineCap = 'round';
      for (const l of limbs) { ctx.beginPath(); ctx.moveTo(l[0], l[1]); ctx.lineTo(l[2], l[3]); ctx.stroke(); }
      ctx.fillStyle = pass[0]; A.circle(ctx, 0, -112, pass[1] === 26 ? 22 : 15); ctx.fill();
    }
    ctx.strokeStyle = INK; ctx.lineWidth = 5;
    for (const [a, rr] of [[-2.6, 40], [-2.2, 46], [-0.5, 44], [-0.9, 40], [-1.57, 48]]) { ctx.beginPath(); ctx.moveTo(Math.cos(a) * rr, -112 + Math.sin(a) * rr); ctx.lineTo(Math.cos(a) * (rr + 16), -112 + Math.sin(a) * (rr + 16)); ctx.stroke(); }
    ctx.restore();
  };
  A.haringHeart = function (ctx, x, y, s, color) {
    ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
    ctx.beginPath(); ctx.moveTo(0, 40); ctx.bezierCurveTo(-70, -6, -36, -60, 0, -26); ctx.bezierCurveTo(36, -60, 70, -6, 0, 40);
    ctx.fillStyle = color; ctx.fill(); ctx.strokeStyle = INK; ctx.lineWidth = 9; ctx.stroke();
    for (let i = 0; i < 8; i++) { const a = i * Math.PI / 4; ctx.beginPath(); ctx.moveTo(Math.cos(a) * 60, Math.sin(a) * 52); ctx.lineTo(Math.cos(a) * 76, Math.sin(a) * 66); ctx.stroke(); }
    ctx.restore();
  };
  PT.haringDance = function (ctx, w, h, r, frame) {
    const u = frame ? h / 720 : 1;
    const cols = ['#e74c3c', '#2e86c1', '#27ae60', '#8e44ad', '#f39c12'];
    if (frame) {
      ctx.fillStyle = '#f39c12'; ctx.fillRect(0, 0, w, h);
      A.haringHeart(ctx, w * 0.5, h * 0.22, h / 700, '#e74c3c');
      A.haringFig(ctx, w * 0.22, h * 0.86, h / 300, '#2e86c1', 0.5);
      A.haringFig(ctx, w * 0.5, h * 0.9, h / 280, '#e74c3c', 2.2);
      A.haringFig(ctx, w * 0.78, h * 0.86, h / 300, '#27ae60', 4);
    } else {
      const gy = h * 0.66, bg = ['#f39c12', '#f7dc6f', '#f5b7b1', '#76d7c4'];
      for (let x = 0, i = 0; x < w; x += 600 * u, i++) { ctx.fillStyle = bg[i % 4]; ctx.fillRect(x, 0, 600 * u, gy); }
      for (let x = 160 * u, i = 0; x < w; x += 300 * u, i++) {
        if (i % 3 === 1) A.haringHeart(ctx, x, gy * 0.35, 0.9 * u, cols[i % 5]);
        else A.haringFig(ctx, x, gy - 10 * u, 1.3 * u, cols[i % 5], i * 1.3);
      }
      ctx.fillStyle = INK; ctx.fillRect(0, gy - 4 * u, w, 10 * u);
      ctx.fillStyle = '#fdfefe'; ctx.fillRect(0, gy + 6 * u, w, h - gy);
      ctx.strokeStyle = INK; ctx.lineWidth = 6 * u;
      for (let x = 0; x < w; x += 140 * u) { ctx.beginPath(); ctx.moveTo(x, gy + 30 * u); ctx.lineTo(x + 40 * u, gy + 60 * u); ctx.stroke(); }
    }
  };
})();
