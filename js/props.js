/* Interactive props inside painting worlds. Local origin = bottom centre (on the floor). */
(function () {
  'use strict';
  const G = window.G;
  const A = G.art;
  const INK = '#1d1a16';
  const r0 = G.rng(5);

  const P = {
    reeds: { box: [110, 170], draw(ctx) {
      ctx.lineCap = 'round';
      for (let i = 0; i < 9; i++) { const x = -45 + i * 11, hh = 110 + (i * 37) % 60; ctx.strokeStyle = i % 2 ? '#4f7a3a' : '#6d9a4c'; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(x, 0); ctx.quadraticCurveTo(x + 8, -hh / 2, x + (i % 3 - 1) * 10, -hh); ctx.stroke(); if (i % 3 === 0) { A.ellipse(ctx, x + (i % 3 - 1) * 10, -hh + 10, 5, 14); ctx.fillStyle = '#6b4a2b'; ctx.fill(); } }
    } },
    lilypad: { box: [160, 70], draw(ctx) {
      A.ellipse(ctx, 0, -14, 80, 22); ctx.fillStyle = '#4f86a0'; ctx.fill();
      A.ellipse(ctx, 0, -18, 56, 16); ctx.fillStyle = '#5f8f4e'; ctx.fill();
      ctx.fillStyle = '#4f86a0'; A.poly(ctx, [0, -18, 30, -30, 40, -22]); ctx.fill();
      A.dabs(ctx, r0, -10, -34, 20, 14, ['#f2a7bd', '#f7d5df', '#fff'], 12, 5, 1);
    } },
    bush: { box: [150, 120], draw(ctx, p) {
      const c = p.c || ['#3d6b3f', '#5f8f4e', '#8fb36a'];
      for (let i = 0; i < 7; i++) { A.circle(ctx, -50 + i * 17, -40 - Math.sin(i * 1.3) * 26, 32); ctx.fillStyle = c[i % c.length]; ctx.fill(); }
      A.dabs(ctx, r0, -70, -100, 140, 90, c.concat(p.flowers || []), 40, 9, 0.85);
    } },
    table: { box: [190, 120], draw(ctx) {
      ctx.fillStyle = '#6b4a2b'; ctx.fillRect(-6, -70, 12, 70); ctx.fillRect(-40, -6, 80, 6);
      A.ellipse(ctx, 0, -76, 90, 22); ctx.fillStyle = '#f7f4ee'; ctx.fill();
      ctx.fillStyle = '#ece6da'; ctx.beginPath(); ctx.moveTo(-90, -76); ctx.quadraticCurveTo(-92, -40, -70, -36); ctx.lineTo(70, -36); ctx.quadraticCurveTo(92, -40, 90, -76); ctx.fill();
      ctx.fillStyle = '#2f5a3a'; ctx.fillRect(-40, -120, 12, 40); ctx.fillRect(30, -112, 10, 32);
      A.circle(ctx, 0, -86, 10); ctx.fillStyle = '#e67e22'; ctx.fill(); A.circle(ctx, 14, -84, 8); ctx.fillStyle = '#c0392b'; ctx.fill();
    } },
    chair: { box: [80, 130], draw(ctx) {
      ctx.strokeStyle = '#4a2e1c'; ctx.lineWidth = 6; ctx.lineCap = 'round';
      ctx.beginPath(); ctx.moveTo(-24, 0); ctx.lineTo(-20, -60); ctx.moveTo(24, 0); ctx.lineTo(20, -60); ctx.moveTo(-26, -60); ctx.lineTo(26, -60); ctx.moveTo(-20, -60); ctx.quadraticCurveTo(-28, -130, 0, -128); ctx.quadraticCurveTo(28, -130, 20, -60); ctx.stroke();
    } },
    plant: { box: [100, 160], draw(ctx) {
      ctx.fillStyle = P_TERRA; A.poly(ctx, [-30, -50, 30, -50, 22, 0, -22, 0]); ctx.fill();
      for (let i = 0; i < 9; i++) { ctx.save(); ctx.translate(0, -50); ctx.rotate(-1.3 + i * 0.32); A.ellipse(ctx, 0, -50, 12, 46); ctx.fillStyle = i % 2 ? '#3d6b3f' : '#5f8f4e'; ctx.fill(); ctx.restore(); }
    } },
    bench: { box: [200, 80], draw(ctx, p) {
      ctx.fillStyle = p.c || '#7a5230'; ctx.fillRect(-100, -50, 200, 16); ctx.fillRect(-90, -34, 12, 34); ctx.fillRect(78, -34, 12, 34);
      ctx.fillStyle = 'rgba(0,0,0,0.25)'; ctx.fillRect(-100, -38, 200, 4);
    } },
    watercan: { box: [90, 70], draw(ctx) {
      ctx.fillStyle = '#4f7f5f'; A.rrect(ctx, -30, -56, 50, 56, 8); ctx.fill();
      ctx.strokeStyle = '#4f7f5f'; ctx.lineWidth = 8; ctx.beginPath(); ctx.moveTo(18, -34); ctx.lineTo(48, -64); ctx.stroke();
      ctx.lineWidth = 5; ctx.beginPath(); ctx.arc(-6, -56, 18, Math.PI, 0); ctx.stroke();
    } },
    dancer: { box: [90, 150], draw(ctx, p, t) { A.dancer(ctx, 0, 0, 1.35, p.c || '#7fb3d5', Math.sin(t * 1.5) > 0 ? 1 : 0, null); } },
    haystack: { box: [210, 170], draw(ctx) {
      ctx.fillStyle = '#d9b45a'; ctx.beginPath(); ctx.moveTo(-100, 0); ctx.quadraticCurveTo(-96, -150, 0, -164); ctx.quadraticCurveTo(96, -150, 100, 0); ctx.fill();
      ctx.fillStyle = 'rgba(120,90,40,0.35)'; ctx.beginPath(); ctx.moveTo(0, -164); ctx.quadraticCurveTo(96, -150, 100, 0); ctx.lineTo(20, 0); ctx.fill();
      ctx.strokeStyle = 'rgba(140,100,40,0.6)'; ctx.lineWidth = 2;
      for (let i = 0; i < 30; i++) { const x = -80 + (i * 37) % 160, y = -10 - (i * 53) % 140; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + 8, y - 14); ctx.stroke(); }
    } },
    sheaf: { box: [80, 130], draw(ctx) {
      ctx.strokeStyle = '#c9a24a'; ctx.lineWidth = 4;
      for (let i = -6; i <= 6; i++) { ctx.beginPath(); ctx.moveTo(i * 3, 0); ctx.lineTo(i * 7, -120); ctx.stroke(); A.ellipse(ctx, i * 7, -120, 4, 10, i * 0.06); ctx.fillStyle = '#e1b955'; ctx.fill(); }
      ctx.fillStyle = '#8b5a2b'; ctx.fillRect(-20, -54, 40, 10);
    } },
    rocks: { box: [180, 90], draw(ctx) {
      [[-50, -20, 40], [10, -26, 46], [56, -16, 32], [-10, -60, 34], [36, -56, 26]].forEach(([x, y, s], i) => {
        A.ellipse(ctx, x, y, s * 1.2, s * 0.8); ctx.fillStyle = i % 2 ? '#8d8f8a' : '#a7a69e'; ctx.fill();
        A.ellipse(ctx, x - s * 0.3, y - s * 0.3, s * 0.5, s * 0.3); ctx.fillStyle = 'rgba(255,255,255,0.25)'; ctx.fill();
      });
    } },
    luggage: { box: [130, 120], draw(ctx) {
      ctx.fillStyle = '#5a3a22'; A.rrect(ctx, -60, -60, 120, 60, 8); ctx.fill();
      ctx.fillStyle = '#7a5a3a'; A.rrect(ctx, -44, -106, 90, 48, 8); ctx.fill();
      ctx.fillStyle = '#c9a24a'; ctx.fillRect(-4, -66, 8, 8); ctx.fillRect(-4, -112, 8, 8);
      ctx.strokeStyle = '#2a1a0a'; ctx.lineWidth = 3; ctx.strokeRect(-60, -60, 120, 60); ctx.strokeRect(-44, -106, 90, 48);
    } },
    bigcircle: { box: [160, 170], draw(ctx) {
      ctx.strokeStyle = INK; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, -40); ctx.stroke();
      [[70, '#1f3f8f'], [50, '#8a4fa0'], [32, '#f2c230'], [16, '#c8302a']].forEach(([rr, c]) => { A.circle(ctx, 0, -110, rr); ctx.fillStyle = c; ctx.fill(); });
      ctx.lineWidth = 3; A.circle(ctx, 0, -110, 70); ctx.stroke();
    } },
    wedge: { box: [160, 150], draw(ctx) {
      A.poly(ctx, [-70, 0, 70, 0, -20, -140]); ctx.fillStyle = '#c8302a'; ctx.fill(); ctx.strokeStyle = INK; ctx.lineWidth = 4; ctx.stroke();
      A.poly(ctx, [-30, 0, 20, 0, -12, -60]); ctx.fillStyle = '#f2c230'; ctx.fill();
    } },
    block: { box: [120, 120], draw(ctx, p) {
      ctx.fillStyle = p.c || '#c8302a'; ctx.fillRect(-56, -112, 112, 112);
      ctx.strokeStyle = INK; ctx.lineWidth = 10; ctx.strokeRect(-56, -112, 112, 112);
    } },
    floatsq: { box: [120, 170], draw(ctx, p, t) {
      const y = -110 + Math.sin(t * 1.6) * 8;
      ctx.fillStyle = 'rgba(0,0,0,0.15)'; A.ellipse(ctx, 0, -4, 50, 8); ctx.fill();
      ctx.fillStyle = '#141414'; ctx.fillRect(-50, y - 50, 100, 100);
    } },
    shape: { box: [170, 130], draw(ctx, p, t) {
      ctx.save(); ctx.translate(0, -70 + Math.sin(t * 1.3 + 1) * 6); ctx.rotate(-0.35);
      ctx.fillStyle = p.c || '#c8302a'; ctx.fillRect(-80, -18, 160, 36);
      ctx.fillStyle = '#141414'; ctx.fillRect(-30, 22, 70, 14);
      ctx.restore();
    } },
    clocktree: { box: [170, 230], draw(ctx) { A.deadTree(ctx, -20, 0, 1.1); A.meltClock(ctx, 52, -210, 0.7, 1); } },
    plinth: { box: [170, 110], draw(ctx) {
      ctx.fillStyle = '#6a4a2a'; ctx.fillRect(-80, -80, 160, 80); ctx.fillStyle = '#4e3418'; ctx.fillRect(-80, -20, 160, 20);
      A.meltClock(ctx, 50, -80, 0.7, 1);
    } },
    giantapple: { box: [150, 150], draw(ctx) { G.drawIcon(ctx, 'apple', 0, -70, 150); } },
    lamp: { box: [70, 250], draw(ctx) {
      ctx.fillStyle = '#111'; ctx.fillRect(-4, -230, 8, 230); ctx.fillRect(-16, -8, 32, 8);
      A.glow(ctx, 0, -236, 110, 'rgba(255,214,140,0.6)');
      A.circle(ctx, 0, -236, 14); ctx.fillStyle = '#ffe0a0'; ctx.fill();
    } },
    blob: { box: [140, 150], draw(ctx, p, t) {
      const c = p.c || '#c8302a';
      ctx.strokeStyle = INK; ctx.lineWidth = 4;
      ctx.beginPath(); ctx.moveTo(-26, -20); ctx.lineTo(-36, 0); ctx.moveTo(24, -20); ctx.lineTo(34, 0); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0, -140 + Math.sin(t * 2) * 4); ctx.bezierCurveTo(70, -140, 60, -20, 0, -20); ctx.bezierCurveTo(-60, -20, -70, -140, 0, -140 + Math.sin(t * 2) * 4);
      ctx.fillStyle = c; ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.moveTo(-24, -86); ctx.quadraticCurveTo(0, -104, 24, -86); ctx.quadraticCurveTo(0, -68, -24, -86); ctx.fill(); ctx.stroke();
      A.circle(ctx, 0, -86, 7); ctx.fillStyle = INK; ctx.fill();
      A.miroStar(ctx, 0, -160, 1);
    } },
    ladder: { box: [90, 210], draw(ctx) {
      ctx.strokeStyle = INK; ctx.lineWidth = 5; ctx.lineCap = 'round';
      ctx.beginPath(); ctx.moveTo(-30, 0); ctx.lineTo(-6, -200); ctx.moveTo(20, 0); ctx.lineTo(40, -200);
      for (let i = 1; i < 8; i++) { const k = i / 8; ctx.moveTo(-30 + 24 * k, -200 * k); ctx.lineTo(20 + 20 * k, -200 * k); }
      ctx.stroke();
    } },
    giantcan: { box: [100, 160], draw(ctx, p) { A.soupCan(ctx, 0, 0, 1.05, p.c || '#e53935', '#f4d03f', false); } },
    cubebox: { box: [140, 120], draw(ctx) {
      ctx.fillStyle = '#fdfefe'; ctx.fillRect(-64, -110, 128, 110);
      A.halftone(ctx, -64, -110, 128, 110, '#4fc3f7', 14, 4);
      ctx.fillStyle = '#e53935'; ctx.fillRect(-64, -76, 128, 40);
      ctx.fillStyle = '#fff'; ctx.font = '900 30px Impact, Arial Black, Arial'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('WOW', 0, -56);
      ctx.strokeStyle = INK; ctx.lineWidth = 6; ctx.strokeRect(-64, -110, 128, 110);
    } },
    burst: { box: [180, 160], draw(ctx, p, t) {
      ctx.fillStyle = INK; ctx.fillRect(-4, -40, 8, 40);
      A.burst(ctx, 0, -96, 80 + Math.sin(t * 4) * 3, p.text || 'BAM!', '#f4d03f', '#e74c3c', 0.05);
    } },
    speechprop: { box: [170, 160], draw(ctx) {
      ctx.fillStyle = INK; ctx.fillRect(-4, -40, 8, 40);
      A.ellipse(ctx, 0, -100, 80, 54); ctx.fillStyle = '#fff'; ctx.fill(); ctx.strokeStyle = INK; ctx.lineWidth = 6; ctx.stroke();
      ctx.fillStyle = INK; ctx.font = '900 46px Impact, Arial Black, Arial'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('?!', 0, -98);
    } },
    haringfig: { box: [120, 180], draw(ctx, p, t) { A.haringFig(ctx, 0, 0, 1.2, p.c || '#e74c3c', t * 3); } },
    haringdog: { box: [140, 110], draw(ctx, p, t) {
      ctx.save(); ctx.scale(1, 1);
      for (const [col, lw] of [[INK, 22], [p.c || '#2e86c1', 10]]) {
        ctx.strokeStyle = col; ctx.lineWidth = lw; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
        ctx.beginPath(); ctx.moveTo(-50, -10); ctx.lineTo(-44, -50); ctx.lineTo(30, -50); ctx.lineTo(36, -10);
        ctx.moveTo(30, -50); ctx.lineTo(56, -76 + Math.sin(t * 8) * 4); ctx.lineTo(70, -60);
        ctx.moveTo(-44, -50); ctx.lineTo(-62, -70); ctx.stroke();
      }
      ctx.strokeStyle = INK; ctx.lineWidth = 4;
      for (let i = 0; i < 3; i++) { ctx.beginPath(); ctx.arc(76, -76, 14 + i * 10, -0.6, 0.4); ctx.stroke(); }
      ctx.restore();
    } },
  };
  const P_TERRA = '#b4643a';
  G.PROPS = P;

  G.drawProp = function (ctx, p, t) {
    const def = P[p.type];
    if (!def) return;
    ctx.save();
    ctx.translate(p.x, p.y);
    G.ltr(ctx);
    const s = p.s || 1;
    ctx.scale(s * (p.flip ? -1 : 1), s);
    if (p.shake > 0) ctx.rotate(Math.sin(t * 38) * 0.09 * p.shake);
    def.draw(ctx, p, t);
    ctx.restore();
  };
  G.propBox = function (p) {
    const def = P[p.type], s = p.s || 1;
    const bw = def.box[0] * s, bh = def.box[1] * s;
    return { x: p.x - bw / 2, y: p.y - bh, w: bw, h: bh + 12 };
  };
})();
