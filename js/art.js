/* Shared drawing helpers and museum environments (exterior, hall, doors, frames). */
(function () {
  'use strict';
  const G = window.G;
  const P = G.PAL;
  const A = (G.art = {});

  A.ellipse = function (ctx, x, y, rx, ry, rot) {
    ctx.beginPath(); ctx.ellipse(x, y, Math.abs(rx), Math.abs(ry), rot || 0, 0, Math.PI * 2);
  };
  A.circle = function (ctx, x, y, r) { ctx.beginPath(); ctx.arc(x, y, Math.abs(r), 0, Math.PI * 2); };
  A.rrect = function (ctx, x, y, w, h, r) {
    r = Math.min(r, w / 2, h / 2);
    ctx.beginPath();
    ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath();
  };
  A.poly = function (ctx, pts) {
    ctx.beginPath(); ctx.moveTo(pts[0], pts[1]);
    for (let i = 2; i < pts.length; i += 2) ctx.lineTo(pts[i], pts[i + 1]);
    ctx.closePath();
  };
  A.fillStroke = function (ctx, fill, stroke, lw) {
    if (fill) { ctx.fillStyle = fill; ctx.fill(); }
    if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = lw || 3; ctx.stroke(); }
  };
  A.vgrad = function (ctx, x, y, w, h, stops) {
    const g = ctx.createLinearGradient(0, y, 0, y + h);
    stops.forEach((s, i) => g.addColorStop(Array.isArray(s) ? s[0] : i / (stops.length - 1), Array.isArray(s) ? s[1] : s));
    ctx.fillStyle = g; ctx.fillRect(x, y, w, h);
  };
  A.glow = function (ctx, x, y, r, color, alpha) {
    const g = ctx.createRadialGradient(x, y, 0, x, y, r);
    g.addColorStop(0, color); g.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.save(); ctx.globalAlpha = alpha == null ? 1 : alpha; ctx.fillStyle = g;
    ctx.fillRect(x - r, y - r, r * 2, r * 2); ctx.restore();
  };
  // impressionist brush dabs
  A.dabs = function (ctx, r, x, y, w, h, colors, n, size, alpha, angle) {
    ctx.save(); ctx.globalAlpha = alpha == null ? 0.8 : alpha;
    for (let i = 0; i < n; i++) {
      ctx.fillStyle = colors[(r() * colors.length) | 0];
      const px = x + r() * w, py = y + r() * h, s = size * (0.6 + r() * 0.8);
      ctx.beginPath();
      ctx.ellipse(px, py, s, s * (0.28 + r() * 0.2), angle == null ? r() * 3.14 : angle + (r() - 0.5) * 0.5, 0, 6.283);
      ctx.fill();
    }
    ctx.restore();
  };
  A.halftone = function (ctx, x, y, w, h, color, step, rad) {
    ctx.save(); ctx.fillStyle = color;
    let row = 0;
    for (let yy = y; yy < y + h + step; yy += step, row++) {
      ctx.beginPath();
      for (let xx = x + (row % 2) * step / 2; xx < x + w + step; xx += step) { ctx.moveTo(xx + rad, yy); ctx.arc(xx, yy, rad, 0, 6.283); }
      ctx.fill();
    }
    ctx.restore();
  };
  A.stars = function (ctx, r, w, h, n, t) {
    for (let i = 0; i < n; i++) {
      const x = r() * w, y = r() * h, s = r() * 1.6 + 0.5, ph = r() * 6;
      ctx.globalAlpha = 0.45 + 0.55 * Math.abs(Math.sin((t || 0) * (0.6 + r()) + ph));
      ctx.fillStyle = '#fff6dc';
      ctx.fillRect(x, y, s, s);
    }
    ctx.globalAlpha = 1;
  };
  A.moon = function (ctx, x, y, rad) {
    A.glow(ctx, x, y, rad * 4, 'rgba(232,220,197,0.35)');
    A.circle(ctx, x, y, rad); ctx.fillStyle = '#f3ead2'; ctx.fill();
    ctx.fillStyle = 'rgba(190,175,140,0.35)';
    A.circle(ctx, x - rad * 0.3, y - rad * 0.2, rad * 0.22); ctx.fill();
    A.circle(ctx, x + rad * 0.25, y + rad * 0.3, rad * 0.15); ctx.fill();
    A.circle(ctx, x + rad * 0.35, y - rad * 0.35, rad * 0.1); ctx.fill();
  };
  A.vignette = function (ctx, w, h, strength) {
    const g = ctx.createRadialGradient(w / 2, h / 2, Math.min(w, h) * 0.35, w / 2, h / 2, Math.max(w, h) * 0.75);
    g.addColorStop(0, 'rgba(5,10,14,0)'); g.addColorStop(1, 'rgba(5,10,14,' + (strength == null ? 0.6 : strength) + ')');
    ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
  };

  // ---------- museum exterior at night (title, intro, puzzle image for the exit) ----------
  A.museumNight = function (ctx, w, h, t, opt) {
    opt = opt || {};
    const r = G.rng(7);
    A.vgrad(ctx, 0, 0, w, h, opt.dawn ? ['#3b4f7a', '#c77a8a', '#f2b77a', '#f6d79a'] : ['#0b1622', '#14283a', '#21414a']);
    if (!opt.dawn) A.stars(ctx, r, w, h * 0.6, Math.floor(w * h / 5000), t);
    if (opt.dawn) { A.glow(ctx, w * 0.5, h * 0.62, h * 0.7, 'rgba(255,214,140,0.8)'); A.circle(ctx, w * 0.5, h * 0.64, h * 0.08); ctx.fillStyle = '#ffe3a3'; ctx.fill(); }
    else A.moon(ctx, w * 0.8, h * 0.18, Math.min(w, h) * 0.07);
    const gy = h * 0.8;
    // distant trees
    ctx.fillStyle = opt.dawn ? '#5b5a6e' : '#10232a';
    for (let x = -40; x < w + 60; x += 40 + r() * 30) { A.circle(ctx, x, gy - 20 - r() * 40, 40 + r() * 30); ctx.fill(); }
    // museum
    const mw = Math.min(w * (h > w ? 0.94 : 0.62), h * 0.9), mx = w / 2 - mw / 2, mh = mw * 0.42, my = gy - mh;
    const wall = opt.dawn ? '#d9c7a8' : '#2c4b4c', wallD = opt.dawn ? '#b9a585' : '#223b3c', trim = opt.dawn ? '#efe3ca' : '#3f6462';
    // steps
    for (let i = 0; i < 4; i++) { ctx.fillStyle = i % 2 ? wallD : trim; ctx.fillRect(mx - 20 - i * 12, gy - 10 + i * 6, mw + 40 + i * 24, 8); }
    ctx.fillStyle = wall; ctx.fillRect(mx, my + mh * 0.12, mw, mh * 0.88 - 8);
    // pediment
    A.poly(ctx, [mx - 24, my + mh * 0.14, mx + mw / 2, my - mh * 0.32, mx + mw + 24, my + mh * 0.14]);
    A.fillStroke(ctx, trim, wallD, 4);
    A.poly(ctx, [mx + mw * 0.12, my + mh * 0.08, mx + mw / 2, my - mh * 0.2, mx + mw * 0.88, my + mh * 0.08]);
    ctx.fillStyle = wallD; ctx.fill();
    // gold medallion with a palette
    A.circle(ctx, mx + mw / 2, my - mh * 0.04, mh * 0.08); A.fillStroke(ctx, P.gold, '#8a6d2a', 3);
    ctx.fillStyle = trim; ctx.fillRect(mx - 10, my + mh * 0.12, mw + 20, mh * 0.06);
    // columns + windows
    const n = 6, cw = mw / (n * 2 - 1);
    for (let i = 0; i < n; i++) {
      const cx = mx + i * cw * 2;
      ctx.fillStyle = trim; ctx.fillRect(cx, my + mh * 0.2, cw, mh * 0.8 - 10);
      ctx.fillStyle = 'rgba(0,0,0,0.12)'; ctx.fillRect(cx + cw * 0.65, my + mh * 0.2, cw * 0.35, mh * 0.8 - 10);
      ctx.fillStyle = trim; ctx.fillRect(cx - 4, my + mh * 0.18, cw + 8, 8);
      if (i < n - 1) {
        const wx = cx + cw * 1.2, ww = cw * 0.6, wy = my + mh * 0.32, wh = mh * 0.45;
        const lit = i === 2 ? 1 : (i % 2 ? 0.75 : 0.5);
        if (i === 2) { // big door
          ctx.fillStyle = opt.dawn ? '#7a4a2a' : '#3b2618'; A.rrect(ctx, wx - ww * 0.2, wy, ww * 1.4, mh * 0.62, ww * 0.7); ctx.fill();
          ctx.strokeStyle = P.gold; ctx.lineWidth = 2; ctx.stroke();
        } else {
          A.glow(ctx, wx + ww / 2, wy + wh / 2, wh, 'rgba(255,190,110,' + (opt.dawn ? 0.15 : 0.4 * lit) + ')');
          A.rrect(ctx, wx, wy, ww, wh, ww / 2); ctx.fillStyle = opt.dawn ? '#f3dfb5' : 'rgba(255,196,120,' + (0.55 + 0.4 * lit) + ')'; ctx.fill();
          ctx.strokeStyle = wallD; ctx.lineWidth = 3; ctx.stroke();
          ctx.beginPath(); ctx.moveTo(wx + ww / 2, wy); ctx.lineTo(wx + ww / 2, wy + wh); ctx.stroke();
        }
      }
    }
    // ground
    A.vgrad(ctx, 0, gy, w, h - gy, opt.dawn ? ['#8a8f6a', '#6f7556'] : ['#18302f', '#0f2020']);
    // lamp posts
    [mx - mw * 0.12, mx + mw * 1.12].forEach((lx) => {
      ctx.fillStyle = '#1c1c1c'; ctx.fillRect(lx - 3, gy - h * 0.2, 6, h * 0.2);
      A.glow(ctx, lx, gy - h * 0.21, h * 0.14, 'rgba(255,200,120,0.55)');
      A.circle(ctx, lx, gy - h * 0.21, 9); ctx.fillStyle = '#ffd98f'; ctx.fill();
    });
    // title banner on museum
    if (opt.banner !== false) {
      ctx.fillStyle = P.terra; A.rrect(ctx, mx + mw * 0.3, my + mh * 0.19, mw * 0.4, mh * 0.09, 4); ctx.fill();
      G.ltr(ctx); ctx.fillStyle = P.cream; ctx.font = '700 ' + Math.round(mh * 0.06) + 'px ' + G.FONT;
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText(opt.dawn ? '☼ MUSEUM ☼' : 'MUSEUM', mx + mw / 2, my + mh * 0.236);
    }
    return { gy, mx, mw };
  };

  // ---------- frames ----------
  A.frame = function (ctx, x, y, w, h, img, opt) {
    opt = opt || {};
    const b = opt.border || Math.max(10, w * 0.07);
    ctx.save();
    ctx.shadowColor = 'rgba(0,0,0,0.5)'; ctx.shadowBlur = 18; ctx.shadowOffsetY = 8;
    ctx.fillStyle = '#8a6a2c'; ctx.fillRect(x - b, y - b, w + b * 2, h + b * 2);
    ctx.restore();
    const g = ctx.createLinearGradient(x - b, y - b, x + w + b, y + h + b);
    g.addColorStop(0, '#f0d78a'); g.addColorStop(0.5, P.gold); g.addColorStop(1, '#9a7632');
    ctx.fillStyle = g; ctx.fillRect(x - b, y - b, w + b * 2, h + b * 2);
    ctx.strokeStyle = '#7a5a22'; ctx.lineWidth = 2;
    ctx.strokeRect(x - b + 3, y - b + 3, w + b * 2 - 6, h + b * 2 - 6);
    ctx.strokeRect(x - 3, y - 3, w + 6, h + 6);
    if (img) ctx.drawImage(img, x, y, w, h);
    else { ctx.fillStyle = '#222'; ctx.fillRect(x, y, w, h); }
  };

  // ---------- door (hall) ----------
  A.door = function (ctx, x, y, w, h, opt) {
    // x = center, y = bottom
    opt = opt || {};
    const left = x - w / 2, top = y - h;
    ctx.fillStyle = '#c9b48a'; // frame
    A.rrect(ctx, left - 16, top - 16, w + 32, h + 16, w * 0.5); ctx.fill();
    ctx.strokeStyle = '#8f7a52'; ctx.lineWidth = 3; ctx.stroke();
    const open = opt.open || 0;
    // opening / light
    A.rrect(ctx, left, top, w, h, w * 0.46);
    ctx.save(); ctx.clip();
    ctx.fillStyle = opt.inside || '#1b1209'; ctx.fillRect(left, top, w, h);
    if (open > 0) {
      ctx.globalAlpha = open; A.glow(ctx, x, y - h * 0.4, h * 0.9, opt.light || 'rgba(255,210,140,0.95)'); ctx.globalAlpha = 1;
      const lw = (w / 2) * (1 - open * 0.85);
      drawLeaf(ctx, left, top, lw, h, 1, opt);
      drawLeaf(ctx, left + w - lw, top, lw, h, -1, opt);
    } else {
      drawLeaf(ctx, left, top, w / 2, h, 1, opt);
      drawLeaf(ctx, left + w / 2, top, w / 2, h, -1, opt);
    }
    ctx.restore();
    if (opt.glow) A.glow(ctx, x, y - h / 2, h * 0.8, 'rgba(217,184,95,' + (0.25 * opt.glow) + ')');
  };
  function drawLeaf(ctx, x, y, w, h, side, opt) {
    if (w < 1) return;
    const g = ctx.createLinearGradient(x, 0, x + w, 0);
    g.addColorStop(0, opt.wood || '#6b4428'); g.addColorStop(1, opt.wood2 || '#4e301b');
    ctx.fillStyle = g; ctx.fillRect(x, y, w, h);
    ctx.strokeStyle = 'rgba(0,0,0,0.35)'; ctx.lineWidth = 2;
    ctx.strokeRect(x + w * 0.15, y + h * 0.3, w * 0.7, h * 0.25);
    ctx.strokeRect(x + w * 0.15, y + h * 0.62, w * 0.7, h * 0.28);
    ctx.fillStyle = P.gold; A.circle(ctx, side > 0 ? x + w - 8 : x + 8, y + h * 0.58, 4); ctx.fill();
  }
  A.plaque = function (ctx, x, y, text, size, lit) {
    ctx.save();
    ctx.font = '700 ' + size + 'px ' + G.FONT;
    G.setDir(ctx);
    const tw = Math.max(ctx.measureText(text).width + size * 1.2, size * 3);
    ctx.fillStyle = lit ? P.gold : '#7d6a3a';
    A.rrect(ctx, x - tw / 2, y - size * 0.8, tw, size * 1.6, size * 0.4); ctx.fill();
    ctx.strokeStyle = '#5b4a1e'; ctx.lineWidth = 2; ctx.stroke();
    ctx.fillStyle = lit ? '#2b2210' : '#3b321c';
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText(text, x, y + size * 0.06);
    ctx.restore();
  };

  // ---------- main hall background (static parts) ----------
  A.HALL = { width: 2500, doorX: [360, 720, 1080, 1440, 1800], exitX: 2200, doorW: 170, doorH: 290 };
  A.hallBg = function (ctx, w, h, floorY) {
    A.vgrad(ctx, 0, 0, w, floorY, ['#1d3a3b', '#28494a', P.teal]);
    // wainscot
    ctx.fillStyle = '#c8b894'; ctx.fillRect(0, floorY - 90, w, 90);
    ctx.fillStyle = '#b3a27c'; for (let x = 0; x < w; x += 120) ctx.fillRect(x + 10, floorY - 78, 100, 66);
    ctx.fillStyle = '#e8dcc5'; ctx.fillRect(0, floorY - 96, w, 8);
    // tall moonlit windows high up
    for (let x = 180; x < w; x += 360) {
      const wy = Math.max(30, floorY - 560), wh = Math.min(140, floorY - 420 - wy + 140);
      ctx.fillStyle = '#16303a'; A.rrect(ctx, x - 40, wy, 80, wh, 40); ctx.fill();
      ctx.fillStyle = 'rgba(160,190,210,0.25)'; A.rrect(ctx, x - 34, wy + 6, 68, wh - 10, 34); ctx.fill();
      ctx.save(); ctx.globalAlpha = 0.07; ctx.fillStyle = '#cfe3ff';
      A.poly(ctx, [x - 34, wy + wh, x + 34, wy + wh, x + 140, floorY + 120, x + 20, floorY + 120]); ctx.fill(); ctx.restore();
    }
    // crown molding
    ctx.fillStyle = '#c9b48a'; ctx.fillRect(0, 0, w, 14);
    // floor (parquet)
    A.vgrad(ctx, 0, floorY, w, h - floorY, ['#6e4a2e', '#4a3020']);
    ctx.strokeStyle = 'rgba(0,0,0,0.18)'; ctx.lineWidth = 2;
    for (let y = floorY + 18, k = 0; y < h; y += 18 + k * 4, k++) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke(); }
    for (let x = 0; x < w; x += 90) { ctx.beginPath(); ctx.moveTo(x, floorY); ctx.lineTo(x + (x - w / 2) * 0.4, h); ctx.stroke(); }
    // carpet runner
    ctx.fillStyle = '#7a3b2a'; ctx.fillRect(0, floorY + 40, w, 46);
    ctx.fillStyle = P.gold; ctx.fillRect(0, floorY + 44, w, 3); ctx.fillRect(0, floorY + 79, w, 3);
    ctx.fillStyle = P.terra; ctx.fillRect(0, floorY + 40, w, 2);
    // columns between doors
    const H = A.HALL;
    const cols = [];
    for (let i = 0; i <= 5; i++) cols.push((i === 0 ? 180 : (i === 5 ? (H.doorX[4] + H.exitX) / 2 : (H.doorX[i - 1] + H.doorX[i]) / 2)));
    cols.push(H.exitX + 200);
    cols.forEach((cx) => A.column(ctx, cx, floorY, Math.min(floorY - 20, 520)));
    // wall sconces
    cols.forEach((cx) => {
      const sy = floorY - 300;
      A.glow(ctx, cx, sy, 160, 'rgba(255,190,110,0.35)');
      ctx.fillStyle = '#8a6d2a'; ctx.fillRect(cx - 4, sy, 8, 26);
      A.circle(ctx, cx, sy - 4, 10); ctx.fillStyle = '#ffd98f'; ctx.fill();
    });
    return cols;
  };
  A.column = function (ctx, x, floorY, hgt) {
    const w = 46, top = floorY - hgt;
    ctx.fillStyle = '#d8c8a4'; ctx.fillRect(x - w / 2, top, w, hgt);
    ctx.fillStyle = 'rgba(0,0,0,0.15)'; ctx.fillRect(x + w * 0.15, top, w * 0.35, hgt);
    ctx.fillStyle = 'rgba(255,255,255,0.18)'; ctx.fillRect(x - w * 0.35, top, w * 0.12, hgt);
    ctx.fillStyle = '#e8dcc5'; ctx.fillRect(x - w / 2 - 8, top, w + 16, 16); ctx.fillRect(x - w / 2 - 8, floorY - 16, w + 16, 16);
  };
  A.statue = function (ctx, x, floorY) {
    ctx.fillStyle = '#b9ab8c'; ctx.fillRect(x - 40, floorY - 110, 80, 110);
    ctx.fillStyle = '#d6c9aa'; ctx.fillRect(x - 46, floorY - 118, 92, 12);
    ctx.fillStyle = '#e4dccb';
    A.circle(ctx, x, floorY - 190, 22); ctx.fill();
    A.rrect(ctx, x - 26, floorY - 170, 52, 56, 18); ctx.fill();
    ctx.fillStyle = 'rgba(0,0,0,0.12)'; A.rrect(ctx, x + 2, floorY - 170, 24, 56, 12); ctx.fill();
  };
})();
