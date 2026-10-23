/* Collectible item icons, drawn in a 100x100 box centred on (0,0). */
(function () {
  'use strict';
  const G = window.G;
  const A = G.art;
  const INK = '#2a2420';
  const fs = (ctx, f, lw) => A.fillStroke(ctx, f, INK, lw || 4);
  const line = (ctx, pts, color, lw) => {
    ctx.beginPath(); ctx.moveTo(pts[0], pts[1]);
    for (let i = 2; i < pts.length; i += 2) ctx.lineTo(pts[i], pts[i + 1]);
    ctx.strokeStyle = color || INK; ctx.lineWidth = lw || 4; ctx.lineCap = 'round'; ctx.stroke();
  };
  const star = (ctx, n, r1, r2) => {
    ctx.beginPath();
    for (let i = 0; i < n * 2; i++) { const a = -Math.PI / 2 + i * Math.PI / n, r = i % 2 ? r2 : r1; ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r); }
    ctx.closePath();
  };

  const ICONS = {
    lily(ctx) {
      A.ellipse(ctx, 0, 18, 44, 18); fs(ctx, '#5f8f4e');
      for (let i = 0; i < 7; i++) { ctx.save(); ctx.rotate(-1.4 + i * 0.47); A.ellipse(ctx, 0, -18, 9, 24); fs(ctx, i % 2 ? '#f2b6c8' : '#f7d5df', 3); ctx.restore(); }
      A.circle(ctx, 0, 0, 7); fs(ctx, '#f2c94c', 3);
    },
    frog(ctx) {
      A.ellipse(ctx, 0, 10, 38, 28); fs(ctx, '#6aa84f');
      for (const x of [-18, 18]) { A.circle(ctx, x, -18, 13); fs(ctx, '#6aa84f'); A.circle(ctx, x, -18, 6); fs(ctx, '#fff', 2); A.circle(ctx, x, -17, 3); ctx.fillStyle = INK; ctx.fill(); }
      ctx.beginPath(); ctx.arc(0, 8, 16, 0.2, Math.PI - 0.2); ctx.strokeStyle = INK; ctx.lineWidth = 3; ctx.stroke();
    },
    dragonfly(ctx) {
      for (const [a, y] of [[-0.3, -12], [0.3, -12], [-0.15, 4], [0.15, 4]]) for (const sx of [-1, 1]) { A.ellipse(ctx, sx * 24, y, 24, 9, sx * a); fs(ctx, 'rgba(170,220,240,0.85)', 3); }
      A.rrect(ctx, -5, -26, 10, 70, 5); fs(ctx, '#2f7fa3');
      A.circle(ctx, 0, -28, 9); fs(ctx, '#2f7fa3');
    },
    brush(ctx) {
      ctx.save(); ctx.rotate(0.7);
      A.rrect(ctx, -6, -10, 12, 58, 5); fs(ctx, '#b5651d');
      ctx.fillStyle = '#ccc'; ctx.fillRect(-7, -22, 14, 14); ctx.strokeStyle = INK; ctx.lineWidth = 3; ctx.strokeRect(-7, -22, 14, 14);
      ctx.beginPath(); ctx.moveTo(-7, -22); ctx.quadraticCurveTo(-8, -40, 0, -50); ctx.quadraticCurveTo(8, -40, 7, -22); ctx.closePath(); fs(ctx, '#c0392b', 3);
      ctx.restore();
    },
    palette(ctx) {
      ctx.beginPath(); ctx.moveTo(0, -36); ctx.bezierCurveTo(44, -38, 50, 20, 20, 30); ctx.bezierCurveTo(6, 34, 10, 14, -6, 22); ctx.bezierCurveTo(-30, 34, -48, 10, -40, -12); ctx.bezierCurveTo(-34, -30, -18, -36, 0, -36); fs(ctx, '#d9b07a');
      [['#c0392b', -20, -14], ['#f2c94c', 0, -22], ['#2e86c1', 20, -12], ['#27ae60', 24, 10], ['#fff', -24, 8]].forEach(([c, x, y]) => { A.circle(ctx, x, y, 7); fs(ctx, c, 2.5); });
    },
    droplet(ctx) {
      ctx.beginPath(); ctx.moveTo(0, -40); ctx.bezierCurveTo(10, -18, 30, 0, 30, 14); ctx.arc(0, 14, 30, 0, Math.PI); ctx.bezierCurveTo(-30, 0, -10, -18, 0, -40); fs(ctx, '#5dade2');
      A.ellipse(ctx, -10, 12, 6, 10, 0.3); ctx.fillStyle = 'rgba(255,255,255,0.7)'; ctx.fill();
    },
    strawhat(ctx) {
      A.ellipse(ctx, 0, 14, 46, 16); fs(ctx, '#e9c46a');
      ctx.beginPath(); ctx.moveTo(-24, 12); ctx.quadraticCurveTo(-24, -28, 0, -28); ctx.quadraticCurveTo(24, -28, 24, 12); ctx.closePath(); fs(ctx, '#f4d58d');
      ctx.fillStyle = '#2e86c1'; ctx.fillRect(-24, 0, 48, 9); ctx.strokeStyle = INK; ctx.lineWidth = 3; ctx.strokeRect(-24, 0, 48, 9);
    },
    grapes(ctx) {
      line(ctx, [0, -30, 4, -44], '#6b4a2b', 5);
      A.ellipse(ctx, 14, -36, 14, 7, -0.4); fs(ctx, '#6aa84f', 3);
      [[-14, -18], [0, -20], [14, -18], [-8, -4], [8, -4], [0, 10], [-16, -4], [16, -4], [-6, 22], [6, 22]].slice(0, 9).forEach(([x, y]) => { A.circle(ctx, x, y, 10); fs(ctx, '#7d3c98', 3); });
    },
    cup(ctx) {
      ctx.beginPath(); ctx.moveTo(-28, -16); ctx.lineTo(28, -16); ctx.quadraticCurveTo(26, 26, 0, 26); ctx.quadraticCurveTo(-26, 26, -28, -16); fs(ctx, '#fdfefe');
      ctx.beginPath(); ctx.arc(30, 2, 10, -1.2, 1.4); ctx.strokeStyle = INK; ctx.lineWidth = 5; ctx.stroke();
      A.ellipse(ctx, 0, 30, 38, 7); fs(ctx, '#fdfefe', 3);
      ctx.fillStyle = '#5dade2'; ctx.fillRect(-20, -4, 40, 5);
      line(ctx, [-8, -26, -4, -36, -8, -44], 'rgba(255,255,255,0.8)', 3); line(ctx, [8, -26, 12, -36, 8, -44], 'rgba(255,255,255,0.8)', 3);
    },
    ribbon(ctx) {
      for (const s of [-1, 1]) { ctx.beginPath(); ctx.moveTo(0, 0); ctx.quadraticCurveTo(s * 40, -34, s * 40, 0); ctx.quadraticCurveTo(s * 40, 26, 0, 0); fs(ctx, '#e8798f'); }
      for (const s of [-1, 1]) { ctx.beginPath(); ctx.moveTo(0, 4); ctx.lineTo(s * 22, 42); ctx.lineTo(s * 10, 40); ctx.closePath(); fs(ctx, '#e8798f', 3); }
      A.circle(ctx, 0, 0, 9); fs(ctx, '#c0506a', 3);
    },
    fan(ctx) {
      ctx.beginPath(); ctx.moveTo(0, 30); ctx.arc(0, 30, 56, -Math.PI * 0.85, -Math.PI * 0.15); ctx.closePath(); fs(ctx, '#f5b7b1');
      for (let i = 0; i <= 6; i++) { const a = -Math.PI * 0.85 + i * Math.PI * 0.7 / 6; line(ctx, [0, 30, Math.cos(a) * 56, 30 + Math.sin(a) * 56], '#a04050', 2.5); }
      A.circle(ctx, 0, 30, 6); fs(ctx, '#d9b85f', 3);
    },
    slipper(ctx) {
      ctx.beginPath(); ctx.moveTo(-40, 10); ctx.quadraticCurveTo(-40, -8, -14, -6); ctx.lineTo(28, -6); ctx.quadraticCurveTo(46, -4, 44, 12); ctx.quadraticCurveTo(40, 24, 0, 24); ctx.quadraticCurveTo(-40, 26, -40, 10); fs(ctx, '#f5b7c5');
      ctx.beginPath(); ctx.moveTo(-6, -6); ctx.quadraticCurveTo(-10, -36, -30, -44); ctx.moveTo(10, -6); ctx.quadraticCurveTo(14, -36, 30, -44); ctx.strokeStyle = '#e8798f'; ctx.lineWidth = 4; ctx.stroke();
    },
    flower(ctx) {
      line(ctx, [0, 10, 0, 46], '#3d8b37', 5);
      for (let i = 0; i < 6; i++) { ctx.save(); ctx.rotate(i * 1.047); A.ellipse(ctx, 0, -20, 11, 18); fs(ctx, '#e74c3c', 3); ctx.restore(); }
      A.circle(ctx, 0, 0, 10); fs(ctx, '#f4d03f', 3);
    },
    note(ctx) {
      A.ellipse(ctx, -16, 26, 14, 10, -0.4); fs(ctx, '#2a2420'); A.ellipse(ctx, 22, 18, 14, 10, -0.4); fs(ctx, '#2a2420');
      line(ctx, [-4, 24, -4, -36, 34, -46, 34, 16], INK, 6);
      line(ctx, [-4, -22, 34, -32], INK, 8);
    },
    wheat(ctx) {
      line(ctx, [0, 46, 0, -40], '#a67c2e', 4);
      for (let i = 0; i < 5; i++) for (const s of [-1, 1]) { A.ellipse(ctx, s * 9, -30 + i * 13, 6, 11, s * 0.5); fs(ctx, '#e1b955', 2.5); }
    },
    bread(ctx) {
      A.ellipse(ctx, 0, 6, 46, 26); fs(ctx, '#d4a055');
      for (const x of [-20, 0, 20]) line(ctx, [x - 8, -4, x + 8, 14], '#a0682a', 4);
    },
    basket(ctx) {
      ctx.beginPath(); ctx.arc(0, -4, 30, Math.PI, 0); ctx.strokeStyle = '#8b5a2b'; ctx.lineWidth = 6; ctx.stroke();
      ctx.beginPath(); ctx.moveTo(-40, -4); ctx.lineTo(40, -4); ctx.lineTo(30, 36); ctx.lineTo(-30, 36); ctx.closePath(); fs(ctx, '#c68a4a');
      for (const y of [8, 22]) line(ctx, [-36, y, 36, y], '#8b5a2b', 3);
    },
    bird(ctx) {
      A.ellipse(ctx, 0, 6, 30, 22); fs(ctx, '#8d6e63');
      A.circle(ctx, 24, -12, 15); fs(ctx, '#8d6e63');
      A.poly(ctx, [37, -14, 50, -10, 37, -6]); fs(ctx, '#f39c12', 3);
      A.circle(ctx, 28, -15, 3); ctx.fillStyle = INK; ctx.fill();
      A.ellipse(ctx, -6, 2, 18, 10, -0.3); fs(ctx, '#6d4c41', 3);
      A.poly(ctx, [-28, 6, -48, -6, -44, 14]); fs(ctx, '#6d4c41', 3);
    },
    apple(ctx) {
      ctx.beginPath(); ctx.moveTo(0, -20); ctx.bezierCurveTo(30, -38, 50, -6, 32, 22); ctx.bezierCurveTo(22, 40, 6, 38, 0, 32); ctx.bezierCurveTo(-6, 38, -22, 40, -32, 22); ctx.bezierCurveTo(-50, -6, -30, -38, 0, -20); fs(ctx, '#7cb342');
      line(ctx, [0, -20, 4, -38], '#6b4a2b', 5); A.ellipse(ctx, 16, -34, 12, 6, -0.4); fs(ctx, '#558b2f', 3);
      A.ellipse(ctx, -16, -4, 6, 10, 0.4); ctx.fillStyle = 'rgba(255,255,255,0.45)'; ctx.fill();
    },
    hammer(ctx) {
      ctx.save(); ctx.rotate(-0.5);
      A.rrect(ctx, -6, -18, 12, 64, 5); fs(ctx, '#a0682a');
      A.rrect(ctx, -30, -36, 60, 22, 4); fs(ctx, '#7f8c8d');
      ctx.restore();
    },
    stone(ctx) {
      ctx.beginPath(); ctx.moveTo(-40, 10); ctx.lineTo(-28, -20); ctx.lineTo(4, -30); ctx.lineTo(34, -14); ctx.lineTo(42, 14); ctx.lineTo(16, 30); ctx.lineTo(-24, 28); ctx.closePath(); fs(ctx, '#95a5a6');
      line(ctx, [-20, -6, 0, 4, 20, -4], 'rgba(0,0,0,0.25)', 3);
    },
    bowl(ctx) {
      ctx.beginPath(); ctx.moveTo(-44, -6); ctx.lineTo(44, -6); ctx.quadraticCurveTo(40, 34, 0, 34); ctx.quadraticCurveTo(-40, 34, -44, -6); fs(ctx, '#a1887f');
      A.ellipse(ctx, 0, -6, 44, 10); fs(ctx, '#d7b47a', 3);
    },
    shoe(ctx) {
      ctx.beginPath(); ctx.moveTo(-34, -30); ctx.lineTo(-8, -30); ctx.lineTo(-6, 0); ctx.quadraticCurveTo(40, 0, 44, 20); ctx.lineTo(44, 28); ctx.lineTo(-36, 28); ctx.closePath(); fs(ctx, '#6d4c41');
      line(ctx, [-34, 20, 44, 20], '#3e2723', 4);
    },
    hat(ctx) {
      A.ellipse(ctx, 0, 16, 48, 12); fs(ctx, '#5d4037');
      A.rrect(ctx, -26, -26, 52, 44, 12); fs(ctx, '#6d4c41');
      ctx.fillStyle = '#3e2723'; ctx.fillRect(-26, 4, 52, 8);
    },
    ticket(ctx) {
      A.rrect(ctx, -44, -24, 88, 48, 6); fs(ctx, '#f6e7b0');
      ctx.setLineDash([5, 5]); line(ctx, [16, -24, 16, 24], INK, 3); ctx.setLineDash([]);
      ctx.fillStyle = '#c0392b'; ctx.fillRect(-34, -10, 40, 7); ctx.fillRect(-34, 4, 26, 6);
    },
    lantern(ctx) {
      A.glow(ctx, 0, 6, 46, 'rgba(255,200,110,0.6)');
      ctx.beginPath(); ctx.arc(0, -36, 9, Math.PI, 0); ctx.strokeStyle = INK; ctx.lineWidth = 4; ctx.stroke();
      A.rrect(ctx, -20, -30, 40, 8, 3); fs(ctx, '#34495e', 3);
      A.rrect(ctx, -16, -22, 32, 44, 6); fs(ctx, '#ffd98f', 3);
      A.circle(ctx, 0, 2, 7); ctx.fillStyle = '#ff9f43'; ctx.fill();
      A.rrect(ctx, -22, 22, 44, 10, 3); fs(ctx, '#34495e', 3);
    },
    umbrella(ctx) {
      ctx.beginPath(); ctx.moveTo(-46, 0); ctx.quadraticCurveTo(-44, -44, 0, -44); ctx.quadraticCurveTo(44, -44, 46, 0);
      for (let i = 3; i >= -3; i -= 2) ctx.quadraticCurveTo(i * 15 + 8, -10, i * 15 - 7, 0);
      ctx.closePath(); fs(ctx, '#2c3e50');
      line(ctx, [0, -44, 0, 34], INK, 5); ctx.beginPath(); ctx.arc(-8, 34, 8, 0, Math.PI); ctx.stroke();
    },
    clock(ctx) {
      A.circle(ctx, 0, 0, 40); fs(ctx, '#f9e79f');
      A.circle(ctx, 0, 0, 32); fs(ctx, '#fffdf3', 2);
      for (let i = 0; i < 12; i++) { const a = i * Math.PI / 6; line(ctx, [Math.cos(a) * 26, Math.sin(a) * 26, Math.cos(a) * 30, Math.sin(a) * 30], INK, 3); }
      line(ctx, [0, 0, 0, -22], INK, 4); line(ctx, [0, 0, 16, 6], INK, 4);
    },
    meltclock(ctx) {
      ctx.beginPath(); ctx.moveTo(-40, -20); ctx.bezierCurveTo(-30, -44, 30, -44, 40, -20); ctx.bezierCurveTo(46, 0, 30, 4, 24, 20); ctx.bezierCurveTo(20, 44, 6, 48, 4, 30); ctx.bezierCurveTo(0, 14, -30, 14, -40, -20); fs(ctx, '#f4d03f');
      A.ellipse(ctx, 0, -14, 28, 18); fs(ctx, '#fffdf3', 2);
      line(ctx, [0, -14, 0, -28], INK, 3); line(ctx, [0, -14, 14, -10], INK, 3);
    },
    circle(ctx) { A.circle(ctx, 0, 0, 34); fs(ctx, '#2e86c1'); A.circle(ctx, 0, 0, 20); fs(ctx, '#f4d03f', 3); A.circle(ctx, 0, 0, 8); fs(ctx, '#c0392b', 3); },
    triangle(ctx) { A.poly(ctx, [0, -40, 40, 32, -40, 32]); fs(ctx, '#f4d03f'); },
    square(ctx, c) { ctx.fillStyle = c || '#c0392b'; ctx.fillRect(-32, -32, 64, 64); ctx.strokeStyle = INK; ctx.lineWidth = 7; ctx.strokeRect(-32, -32, 64, 64); },
    redsq(ctx) { ICONS.square(ctx, '#c8302a'); },
    bluesq(ctx) { ICONS.square(ctx, '#1f3f8f'); },
    yellowsq(ctx) { ICONS.square(ctx, '#f2c230'); },
    blacksq(ctx) { ICONS.square(ctx, '#151515'); },
    ruler(ctx) {
      ctx.save(); ctx.rotate(-0.6);
      A.rrect(ctx, -50, -12, 100, 24, 3); fs(ctx, '#f5cba7');
      for (let i = -40; i <= 40; i += 10) line(ctx, [i, -12, i, i % 20 === 0 ? 2 : -4], INK, 2.5);
      ctx.restore();
    },
    pencil(ctx) {
      ctx.save(); ctx.rotate(0.7);
      ctx.fillStyle = '#f4d03f'; ctx.fillRect(-9, -36, 18, 60); ctx.strokeStyle = INK; ctx.lineWidth = 3; ctx.strokeRect(-9, -36, 18, 60);
      ctx.fillStyle = '#f1948a'; ctx.fillRect(-9, -46, 18, 10); ctx.strokeRect(-9, -46, 18, 10);
      A.poly(ctx, [-9, 24, 9, 24, 0, 44]); fs(ctx, '#f5deb3', 3);
      A.poly(ctx, [-3, 37, 3, 37, 0, 44]); ctx.fillStyle = INK; ctx.fill();
      ctx.restore();
    },
    cross(ctx) { ctx.fillStyle = '#c0392b'; ctx.fillRect(-12, -40, 24, 80); ctx.fillRect(-40, -12, 80, 24); ctx.strokeStyle = INK; ctx.lineWidth = 3; ctx.strokeRect(-12, -40, 24, 80); },
    bar(ctx) { ctx.save(); ctx.rotate(-0.4); ctx.fillStyle = '#151515'; ctx.fillRect(-46, -10, 92, 20); ctx.fillStyle = '#c0392b'; ctx.fillRect(-26, 14, 52, 12); ctx.restore(); },
    egg(ctx) { A.ellipse(ctx, 0, 4, 28, 38); fs(ctx, '#fdf2e9'); A.ellipse(ctx, -9, -6, 6, 12, 0.3); ctx.fillStyle = 'rgba(255,255,255,0.9)'; ctx.fill(); },
    feather(ctx) {
      ctx.save(); ctx.rotate(0.5);
      ctx.beginPath(); ctx.moveTo(0, -46); ctx.quadraticCurveTo(28, -10, 4, 34); ctx.quadraticCurveTo(-24, -6, 0, -46); fs(ctx, '#a9cce3');
      line(ctx, [0, -40, 2, 46], INK, 3);
      ctx.restore();
    },
    butterfly(ctx) {
      for (const s of [-1, 1]) { A.ellipse(ctx, s * 22, -12, 22, 18, s * 0.4); fs(ctx, '#f39c12'); A.ellipse(ctx, s * 18, 16, 14, 12, -s * 0.4); fs(ctx, '#e67e22'); A.circle(ctx, s * 24, -14, 6); ctx.fillStyle = INK; ctx.fill(); }
      A.rrect(ctx, -4, -26, 8, 50, 4); fs(ctx, INK, 2);
    },
    shell(ctx) {
      ctx.beginPath(); ctx.moveTo(0, 30); ctx.lineTo(-40, -4); ctx.quadraticCurveTo(-30, -40, 0, -40); ctx.quadraticCurveTo(30, -40, 40, -4); ctx.closePath(); fs(ctx, '#f5b7b1');
      for (const x of [-26, -12, 0, 12, 26]) line(ctx, [0, 30, x, -36], '#c0706a', 3);
    },
    bowler(ctx) {
      A.ellipse(ctx, 0, 18, 48, 11); fs(ctx, '#1c1c1c');
      ctx.beginPath(); ctx.moveTo(-28, 16); ctx.quadraticCurveTo(-30, -34, 0, -34); ctx.quadraticCurveTo(30, -34, 28, 16); ctx.closePath(); fs(ctx, '#2a2a2a');
      ctx.fillStyle = '#555'; ctx.fillRect(-28, 4, 56, 7);
    },
    cloud(ctx) {
      ctx.beginPath(); ctx.arc(-22, 8, 20, Math.PI * 0.5, Math.PI * 1.5); ctx.arc(-4, -10, 24, Math.PI, 0); ctx.arc(24, 2, 20, Math.PI * 1.3, Math.PI * 0.5); ctx.closePath(); fs(ctx, '#fdfefe');
    },
    star(ctx) { star(ctx, 5, 44, 18); fs(ctx, '#f4d03f'); },
    moon(ctx) { ctx.beginPath(); ctx.arc(0, 0, 38, 0.6, Math.PI * 2 - 0.6); ctx.arc(18, 0, 28, Math.PI * 2 - 0.9, 0.9, true); ctx.closePath(); fs(ctx, '#f4d03f'); },
    eye(ctx) {
      ctx.beginPath(); ctx.moveTo(-46, 0); ctx.quadraticCurveTo(0, -40, 46, 0); ctx.quadraticCurveTo(0, 40, -46, 0); fs(ctx, '#fff');
      A.circle(ctx, 0, 0, 16); fs(ctx, '#2e86c1', 3); A.circle(ctx, 0, 0, 7); ctx.fillStyle = INK; ctx.fill();
    },
    sun(ctx) {
      for (let i = 0; i < 12; i++) { ctx.save(); ctx.rotate(i * Math.PI / 6); A.poly(ctx, [-7, -30, 0, -48, 7, -30]); fs(ctx, '#e74c3c', 3); ctx.restore(); }
      A.circle(ctx, 0, 0, 28); fs(ctx, '#f4d03f');
    },
    can(ctx) {
      A.rrect(ctx, -26, -38, 52, 76, 6); fs(ctx, '#fdfefe');
      ctx.fillStyle = '#e74c3c'; ctx.fillRect(-26, -38, 52, 32); ctx.strokeStyle = INK; ctx.lineWidth = 3; ctx.strokeRect(-26, -38, 52, 32);
      A.circle(ctx, 0, 14, 9); fs(ctx, '#f4d03f', 3);
      ctx.fillStyle = '#fff'; ctx.font = '800 15px Arial'; ctx.textAlign = 'center'; ctx.fillText('SOUP', 0, -16);
    },
    banana(ctx) {
      ctx.beginPath(); ctx.moveTo(-38, -28); ctx.quadraticCurveTo(-30, 36, 40, 22); ctx.quadraticCurveTo(10, 18, -26, -30); ctx.closePath(); fs(ctx, '#f7dc6f');
      line(ctx, [-38, -28, -40, -38], '#6b4a2b', 6);
    },
    camera(ctx) {
      A.rrect(ctx, -44, -24, 88, 54, 8); fs(ctx, '#fdfefe');
      ctx.fillStyle = '#e74c3c'; ctx.fillRect(-44, -10, 88, 6);
      A.circle(ctx, 0, 8, 17); fs(ctx, '#2c3e50', 3); A.circle(ctx, 0, 8, 8); fs(ctx, '#5dade2', 2);
      A.rrect(ctx, 18, -34, 20, 10, 3); fs(ctx, '#2c3e50', 3);
    },
    heart(ctx) {
      ctx.beginPath(); ctx.moveTo(0, 36); ctx.bezierCurveTo(-60, -6, -30, -50, 0, -20); ctx.bezierCurveTo(30, -50, 60, -6, 0, 36); fs(ctx, '#e74c3c');
    },
    lightning(ctx) { A.poly(ctx, [10, -46, -26, 6, -2, 6, -12, 46, 28, -8, 4, -8]); fs(ctx, '#f4d03f'); },
    speech(ctx) {
      A.ellipse(ctx, 0, -6, 46, 32); fs(ctx, '#fff');
      A.poly(ctx, [-16, 20, -28, 44, 2, 24]); fs(ctx, '#fff', 3);
      ctx.fillStyle = '#fff'; ctx.fillRect(-14, 16, 14, 10);
      ctx.fillStyle = '#e74c3c'; ctx.font = '900 30px Arial'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('!', 0, -4);
    },
    balloon(ctx) {
      line(ctx, [0, 26, -6, 50], INK, 3);
      A.ellipse(ctx, 0, -10, 30, 38); fs(ctx, '#e74c3c');
      A.poly(ctx, [-6, 28, 6, 28, 0, 20]); fs(ctx, '#e74c3c', 3);
      A.ellipse(ctx, -10, -22, 6, 11, 0.4); ctx.fillStyle = 'rgba(255,255,255,0.6)'; ctx.fill();
    },
    crown(ctx) {
      A.poly(ctx, [-42, 26, -42, -18, -22, 4, 0, -32, 22, 4, 42, -18, 42, 26]); fs(ctx, '#f4d03f');
      [[-42, -20], [0, -34], [42, -20]].forEach(([x, y]) => { A.circle(ctx, x, y, 6); fs(ctx, '#e74c3c', 3); });
    },
    dog(ctx) {
      A.ellipse(ctx, -6, 10, 32, 18); fs(ctx, '#fdfefe');
      A.circle(ctx, 26, -10, 16); fs(ctx, '#fdfefe');
      A.ellipse(ctx, 22, -24, 6, 12, -0.4); fs(ctx, '#8d6e63', 3);
      for (const x of [-26, -12, 6, 16]) line(ctx, [x, 24, x, 38], INK, 5);
      A.circle(ctx, 30, -12, 3); ctx.fillStyle = INK; ctx.fill();
      line(ctx, [-36, 4, -48, -10], INK, 4);
    },
  };
  G.ICONS = ICONS;

  G.drawIcon = function (ctx, name, x, y, size, rot) {
    const f = ICONS[name];
    if (!f) return;
    ctx.save();
    ctx.translate(x, y);
    G.ltr(ctx);
    if (rot) ctx.rotate(rot);
    ctx.scale(size / 100, size / 100);
    ctx.lineJoin = 'round';
    f(ctx);
    ctx.restore();
  };
  // small canvas version for DOM HUD slots
  G.iconCanvas = function (name, px) {
    const k = Math.min(window.devicePixelRatio || 1, 2);
    const c = document.createElement('canvas');
    c.width = c.height = Math.round(px * k);
    const ctx = c.getContext('2d');
    ctx.scale(k, k);
    G.drawIcon(ctx, name, px / 2, px / 2, px * 0.82);
    return c;
  };
})();
