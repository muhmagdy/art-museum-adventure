/* Room backgrounds, one per art movement, all at night with warm lamp light. */
(function () {
  'use strict';
  const G = window.G;
  const A = G.art;
  const P = G.PAL;

  // layout shared by the room scene and the background renderer
  G.roomLayout = function (W, H) {
    const SH = Math.min(H, 1000);
    const floorY = H / 2 + SH * 0.24;
    const RW = Math.max(W, 1500);
    const pw = 270, ph = 202;
    const py = floorY - 150 - ph;
    const xs = [0.3, 0.55, 0.8].map((f) => RW * f);
    return { RW, floorY, pw, ph, py, xs, doorX: RW * 0.08 + 60, walkY: floorY + 70 };
  };

  const STYLE = {
    impressionism(ctx, L, H, r) {
      const { RW, floorY } = L;
      A.vgrad(ctx, 0, 0, RW, floorY, ['#2c4a4e', '#3d5f63', '#4b6c6c']);
      A.dabs(ctx, r, 0, 0, RW, floorY, ['#5d7f7a', '#4a6d6b', '#6d7fa3', '#7a8f6a', '#8a7aa3'], Math.floor(RW * floorY / 700), 18, 0.25);
      wood(ctx, RW, floorY, H, '#6e4a2e', '#4a3020');
      // potted ferns
      [RW * 0.18, RW * 0.68, RW * 0.94].forEach((x) => fern(ctx, x, floorY + 10, r));
    },
    realism(ctx, L, H, r) {
      const { RW, floorY } = L;
      A.vgrad(ctx, 0, 0, RW, floorY, ['#2e2a1e', '#3f3826', '#4a4230']);
      ctx.fillStyle = '#3a2a1a'; ctx.fillRect(0, floorY - 200, RW, 200);
      ctx.strokeStyle = 'rgba(0,0,0,0.3)'; ctx.lineWidth = 3;
      for (let x = 0; x < RW; x += 140) { ctx.strokeRect(x + 12, floorY - 186, 116, 170); }
      ctx.fillStyle = '#6b4a2b'; ctx.fillRect(0, floorY - 206, RW, 10);
      wood(ctx, RW, floorY, H, '#5a3e24', '#3a2716');
      // wheat sheaf and stool
      G.drawProp(ctx, { type: 'sheaf', x: RW * 0.18, y: floorY + 20, s: 0.8 }, 0);
      G.drawProp(ctx, { type: 'sheaf', x: RW * 0.95, y: floorY + 24, s: 0.9 }, 0);
      ctx.fillStyle = '#4a3020'; ctx.fillRect(RW * 0.67 - 30, floorY - 30, 60, 10); ctx.fillRect(RW * 0.67 - 26, floorY - 20, 8, 40); ctx.fillRect(RW * 0.67 + 18, floorY - 20, 8, 40);
    },
    abstract(ctx, L, H, r) {
      const { RW, floorY } = L;
      A.vgrad(ctx, 0, 0, RW, floorY, ['#3b4446', '#4e5856', '#5a6460']);
      // faint bauhaus shapes on the wall
      ctx.globalAlpha = 0.28;
      for (let x = 100; x < RW; x += 330) {
        const k = Math.floor(x / 330) % 3;
        ctx.fillStyle = ['#c8302a', '#f2c230', '#1f3f8f'][k];
        if (k === 0) { A.circle(ctx, x, floorY - 420, 60); ctx.fill(); }
        else if (k === 1) { A.poly(ctx, [x, floorY - 500, x + 70, floorY - 380, x - 70, floorY - 380]); ctx.fill(); }
        else ctx.fillRect(x - 60, floorY - 480, 120, 90);
      }
      ctx.globalAlpha = 1;
      ctx.strokeStyle = 'rgba(20,20,20,0.5)'; ctx.lineWidth = 6;
      ctx.beginPath(); ctx.moveTo(0, floorY - 130); ctx.lineTo(RW, floorY - 130); ctx.stroke();
      // floor tiles teal / cream
      for (let y = floorY, row = 0; y < H; y += 46, row++) for (let x = 0, i = row; x < RW; x += 46, i++) { ctx.fillStyle = i % 2 ? '#2f4f4c' : '#8a8676'; ctx.fillRect(x, y, 46, 46); }
      ctx.fillStyle = 'rgba(0,0,0,0.35)'; ctx.fillRect(0, floorY, RW, H - floorY);
    },
    surrealism(ctx, L, H, r) {
      const { RW, floorY } = L;
      A.vgrad(ctx, 0, 0, RW, floorY, ['#1e1838', '#3a2f5c', '#6b4f7a', '#a9776a']);
      // painted clouds on the wall
      ctx.fillStyle = 'rgba(232,220,197,0.18)';
      for (let i = 0; i < RW / 200; i++) { const cx = r() * RW, cy = r() * floorY * 0.7; for (let k = 0; k < 5; k++) { A.circle(ctx, cx + k * 26, cy + Math.sin(k) * 8, 22 + r() * 10); ctx.fill(); } }
      // floating stones
      for (let i = 0; i < RW / 500; i++) { const x = 250 + i * 500 + r() * 100, y = floorY - 470 - r() * 60; ctx.fillStyle = '#7a6a5a'; A.ellipse(ctx, x, y, 40, 22); ctx.fill(); ctx.fillStyle = 'rgba(0,0,0,0.2)'; A.ellipse(ctx, x, y + 120, 30, 6); ctx.fill(); }
      // checkered perspective floor
      const vx = RW / 2;
      for (let row = 0; row < 8; row++) {
        const y0 = floorY + Math.pow(row / 8, 1.6) * (H - floorY), y1 = floorY + Math.pow((row + 1) / 8, 1.6) * (H - floorY);
        for (let c = -20; c < 20; c++) {
          const s0 = 1 + row * 0.5, s1 = 1 + (row + 1) * 0.5;
          ctx.fillStyle = (row + c) % 2 ? '#e8dcc5' : '#345C59';
          A.poly(ctx, [vx + c * 60 * s0, y0, vx + (c + 1) * 60 * s0, y0, vx + (c + 1) * 60 * s1, y1, vx + c * 60 * s1, y1]); ctx.fill();
        }
      }
      ctx.fillStyle = 'rgba(10,8,20,0.45)'; ctx.fillRect(0, floorY, RW, H - floorY);
      A.meltClock(ctx, RW * 0.68, floorY - 100, 0.6, 1);
    },
    pop(ctx, L, H, r) {
      const { RW, floorY } = L;
      const cols = ['#b8436a', '#c9a227', '#2f8fa8', '#d8673c'];
      for (let x = 0, i = 0; x < RW; x += 300, i++) { ctx.fillStyle = cols[i % 4]; ctx.fillRect(x, 0, 300, floorY); A.halftone(ctx, x, 0, 300, floorY, 'rgba(255,255,255,0.12)', 22, 6); }
      ctx.fillStyle = 'rgba(14,20,30,0.45)'; ctx.fillRect(0, 0, RW, floorY);
      A.burst(ctx, RW * 0.18, floorY - 420, 70, 'POW!', '#f4d03f', '#e74c3c', -0.2);
      A.burst(ctx, RW * 0.92, floorY - 440, 60, 'ZAP!', '#4fc3f7', '#f4d03f', 0.2);
      ctx.fillStyle = '#151515'; ctx.fillRect(0, floorY - 8, RW, 10);
      for (let x = 0, i = 0; x < RW; x += 60, i++) { ctx.fillStyle = i % 2 ? '#e8dcc5' : '#d9b85f'; ctx.fillRect(x, floorY + 2, 60, H - floorY); }
      A.halftone(ctx, 0, floorY, RW, H - floorY, 'rgba(199,122,71,0.35)', 18, 4);
      ctx.fillStyle = 'rgba(0,0,0,0.35)'; ctx.fillRect(0, floorY, RW, H - floorY);
      G.drawProp(ctx, { type: 'giantcan', x: RW * 0.68, y: floorY + 30, s: 0.7, c: '#e53935' }, 0);
    },
  };

  function wood(ctx, RW, floorY, H, c1, c2) {
    A.vgrad(ctx, 0, floorY, RW, H - floorY, [c1, c2]);
    ctx.strokeStyle = 'rgba(0,0,0,0.2)'; ctx.lineWidth = 2;
    for (let y = floorY + 20, k = 0; y < H; y += 20 + k * 5, k++) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(RW, y); ctx.stroke(); }
  }
  function fern(ctx, x, y, r) {
    ctx.fillStyle = P.terra; A.poly(ctx, [x - 30, y - 60, x + 30, y - 60, x + 22, y, x - 22, y]); ctx.fill();
    A.dabs(ctx, r, x - 70, y - 170, 140, 120, ['#3d6b3f', '#5f8f4e', '#8fb36a'], 70, 12, 0.85);
  }

  G.renderRoomBg = function (ri, W, H) {
    const L = G.roomLayout(W, H);
    const room = G.ROOMS[ri];
    const res = G.bgRes();
    const { c, ctx } = G.makeCanvas(L.RW, H, res);
    const r = G.rng(100 + ri);
    STYLE[room.id](ctx, L, H, r);
    // baseboard
    ctx.fillStyle = 'rgba(0,0,0,0.35)'; ctx.fillRect(0, L.floorY - 4, L.RW, 8);
    // room title banner high on the wall
    const by = Math.max(70, L.py - 120);
    // entrance door (back to the hall)
    A.door(ctx, L.doorX, L.floorY + 4, 150, 250, {});
    // picture lights & warm pools
    for (const x of L.xs) {
      A.glow(ctx, x, L.py + L.ph / 2, 260, 'rgba(255,200,120,0.32)');
      A.glow(ctx, x, L.floorY + 40, 200, 'rgba(255,190,110,0.12)');
      ctx.fillStyle = '#8a6d2a'; A.rrect(ctx, x - 50, L.py - 52, 100, 12, 6); ctx.fill();
      ctx.fillRect(x - 3, L.py - 44, 6, 22);
    }
    A.vignette(ctx, L.RW, H, 0.55);
    c.L = L; c.bannerY = by;
    return c;
  };
})();
