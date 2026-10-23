/* Procedural audio: generative ambient music per art movement + synthesized sound effects (WebAudio). */
(function () {
  'use strict';
  const G = window.G;
  const A = (G.audio = { ctx: null, current: null, songName: null, muted: false });
  try { A.muted = localStorage.getItem('ama-muted') === '1'; } catch (e) { /* ignore */ }

  const mtof = (m) => 440 * Math.pow(2, (m - 69) / 12);
  let c = null;

  A.unlock = function () {
    if (A.ctx) { if (A.ctx.state === 'suspended') A.ctx.resume(); return; }
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    try { A.ctx = c = new AC(); } catch (e) { return; }
    A.master = c.createGain();
    A.master.gain.value = A.muted ? 0 : 0.9;
    const comp = c.createDynamicsCompressor();
    comp.threshold.value = -14; comp.ratio.value = 4;
    A.master.connect(comp); comp.connect(c.destination);
    A.musicBus = c.createGain(); A.musicBus.gain.value = 0.5;
    A.sfxBus = c.createGain(); A.sfxBus.gain.value = 0.8;
    A.rev = c.createConvolver(); A.rev.buffer = impulse(2.6);
    A.revSend = c.createGain(); A.revSend.gain.value = 0.32;
    A.musicBus.connect(A.master); A.musicBus.connect(A.revSend);
    A.sfxBus.connect(A.master);
    A.sfxRev = c.createGain(); A.sfxRev.gain.value = 0.2; A.sfxBus.connect(A.sfxRev); A.sfxRev.connect(A.rev);
    A.revSend.connect(A.rev); A.rev.connect(A.master);
    A.noise = noiseBuffer();
    setInterval(tick, 30);
    const want = A.songName; A.songName = null;
    if (want) A.music(want);
  };

  A.setMuted = function (m) {
    A.muted = m;
    try { localStorage.setItem('ama-muted', m ? '1' : '0'); } catch (e) { /* ignore */ }
    if (A.master) A.master.gain.setTargetAtTime(m ? 0 : 0.9, c.currentTime, 0.05);
  };

  function impulse(sec) {
    const len = Math.floor(c.sampleRate * sec), buf = c.createBuffer(2, len, c.sampleRate);
    for (let ch = 0; ch < 2; ch++) {
      const d = buf.getChannelData(ch);
      for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 2.6);
    }
    return buf;
  }
  function noiseBuffer() {
    const len = c.sampleRate, buf = c.createBuffer(1, len, c.sampleRate), d = buf.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
    return buf;
  }

  // ---------- instruments ----------
  function tone(dest, type, freq, t, vol, attack, release, o) {
    o = o || {};
    const osc = c.createOscillator(); osc.type = type;
    osc.frequency.setValueAtTime(freq, t);
    if (o.toFreq) osc.frequency.exponentialRampToValueAtTime(o.toFreq, t + (o.glide || attack + release));
    if (o.detune) osc.detune.value = o.detune;
    const g = c.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(Math.max(vol, 0.0002), t + attack);
    if (o.hold) g.gain.setValueAtTime(Math.max(vol, 0.0002), t + attack + o.hold);
    g.gain.exponentialRampToValueAtTime(0.0001, t + attack + (o.hold || 0) + release);
    let node = osc;
    if (o.lp) { const f = c.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = o.lp; f.Q.value = o.q || 0.7; osc.connect(f); node = f; }
    if (o.vib) {
      const l = c.createOscillator(), lg = c.createGain();
      l.frequency.value = o.vibRate || 5.5; lg.gain.value = o.vib;
      l.connect(lg); lg.connect(osc.frequency); l.start(t); l.stop(t + attack + (o.hold || 0) + release + 0.1);
    }
    node.connect(g); g.connect(dest);
    osc.start(t); osc.stop(t + attack + (o.hold || 0) + release + 0.1);
    return osc;
  }
  function noise(dest, t, vol, dur, type, freq, q, o) {
    o = o || {};
    const s = c.createBufferSource(); s.buffer = A.noise;
    const f = c.createBiquadFilter(); f.type = type; f.frequency.setValueAtTime(freq, t); f.Q.value = q || 1;
    if (o.toFreq) f.frequency.exponentialRampToValueAtTime(o.toFreq, t + dur);
    const g = c.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(vol, t + (o.attack || 0.005));
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    s.connect(f); f.connect(g); g.connect(dest);
    s.start(t, Math.random() * 0.5); s.stop(t + dur + 0.05);
  }
  const I = {
    pluck: (d, t, m, v, dec) => { tone(d, 'triangle', mtof(m), t, v, 0.004, dec || 0.8, { lp: 3200 }); tone(d, 'sine', mtof(m + 12), t, v * 0.3, 0.003, (dec || 0.8) * 0.5); },
    box: (d, t, m, v) => { tone(d, 'sine', mtof(m), t, v, 0.003, 1.3); tone(d, 'sine', mtof(m) * 4.01, t, v * 0.12, 0.002, 0.25); },
    bell: (d, t, m, v, dec) => {
      const car = c.createOscillator(), mod = c.createOscillator(), mg = c.createGain(), g = c.createGain();
      const f = mtof(m); dec = dec || 1.6;
      car.frequency.value = f; mod.frequency.value = f * 3.5;
      mg.gain.setValueAtTime(f * 2.2, t); mg.gain.exponentialRampToValueAtTime(1, t + dec);
      g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(v, t + 0.004); g.gain.exponentialRampToValueAtTime(0.0001, t + dec);
      mod.connect(mg); mg.connect(car.frequency); car.connect(g); g.connect(d);
      car.start(t); mod.start(t); car.stop(t + dec + 0.1); mod.stop(t + dec + 0.1);
    },
    pad: (d, t, ms, dur, v, type, lp) => {
      for (const m of ms) for (const dt of [-8, 8]) tone(d, type || 'sawtooth', mtof(m), t, v / ms.length, dur * 0.35, dur * 0.65, { detune: dt, lp: lp || 900, hold: dur * 0.2 });
    },
    bass: (d, t, m, dur, v) => { tone(d, 'square', mtof(m), t, v * 0.5, 0.005, dur, { lp: 520 }); tone(d, 'sine', mtof(m), t, v, 0.005, dur); },
    kick: (d, t, v) => tone(d, 'sine', 140, t, v, 0.002, 0.28, { toFreq: 42, glide: 0.12 }),
    snare: (d, t, v) => { noise(d, t, v, 0.16, 'bandpass', 1900, 0.8); tone(d, 'triangle', 190, t, v * 0.5, 0.002, 0.08); },
    hat: (d, t, v) => noise(d, t, v, 0.045, 'highpass', 7500, 0.7),
    wood: (d, t, m, v) => tone(d, 'sine', mtof(m), t, v, 0.001, 0.07),
    bowed: (d, t, m, dur, v) => tone(d, 'sawtooth', mtof(m), t, v, 0.18, dur * 0.7, { lp: 1300, hold: dur * 0.3, vib: 3, vibRate: 5 }),
    flute: (d, t, m, dur, v) => tone(d, 'sine', mtof(m), t, v, 0.08, dur * 0.7, { hold: dur * 0.3, vib: 4, vibRate: 5.2 }),
    lead: (d, t, m, dur, v) => tone(d, 'square', mtof(m), t, v, 0.005, dur, { lp: 2400 }),
    glide: (d, t, m1, m2, dur, v) => tone(d, 'sine', mtof(m1), t, v, 0.3, dur, { toFreq: mtof(m2), glide: dur, vib: 7, vibRate: 6, hold: 0.2 }),
  };

  // ---------- songs (one step = a 16th note) ----------
  const pick = (a) => a[Math.floor(Math.random() * a.length)];
  const SONGS = {
    night: {
      bpm: 70,
      step(s, t, d) {
        const ch = [[57, 60, 64], [53, 57, 60], [48, 52, 55], [55, 59, 62]][Math.floor(s / 16) % 4];
        if (s % 16 === 0) I.pad(d, t, ch.map((m) => m - 12), 3.4, 0.05, 'triangle', 700);
        if (s % 2 === 0 && Math.random() < 0.8) {
          const pat = [0, 1, 2, 1, 2, 0, 1, 2][(s / 2) % 8];
          I.box(d, t, ch[pat] + 12 + (Math.random() < 0.2 ? 12 : 0), 0.06);
        }
      },
    },
    impressionism: {
      bpm: 64,
      step(s, t, d) {
        const chords = [[53, 57, 60, 64, 71], [52, 55, 59, 62, 66], [50, 53, 57, 60, 64], [48, 52, 55, 59, 62]];
        const ch = chords[Math.floor(s / 32) % 4];
        if (s % 32 === 0) I.pad(d, t, [ch[0] - 12, ch[1], ch[3]], 7, 0.05, 'triangle', 1000);
        const seq = [0, 1, 2, 3, 4, 3, 2, 1];
        const k = s % 16;
        if (k < 8 || Math.random() < 0.35) I.pluck(d, t, ch[seq[k % 8]] + 12, 0.045, 1.6);
        if (s % 16 === 8 && Math.random() < 0.5) {
          const sc = [65, 67, 69, 71, 72, 74, 76];
          I.flute(d, t, pick(sc) + 12, 1.4, 0.035);
        }
      },
    },
    realism: {
      bpm: 58,
      tune: [[62, 4], [64, 2], [65, 2], [67, 4], [69, 4], [67, 2], [65, 2], [64, 4], [62, 8], [60, 4], [62, 4], [64, 4], [65, 4], [64, 6], [62, 2], [62, 8]],
      init(st) { st.ti = 0; st.tleft = 0; },
      step(s, t, d, st) {
        if (s % 64 === 0) I.pad(d, t, [38, 45, 50], 16, 0.07, 'sawtooth', 420);
        const ch = [[50, 53, 57], [48, 52, 55], [50, 53, 57], [45, 48, 52]][Math.floor(s / 16) % 4];
        if (s % 4 === 0) I.pluck(d, t, ch[(s / 4) % 3], 0.04, 1.1);
        if (st.tleft <= 0) {
          const n = this.tune[st.ti % this.tune.length];
          st.ti++; st.tleft = n[1];
          const dur = n[1] * 60 / this.bpm / 4;
          if (Math.random() < 0.92) I.bowed(d, t, n[0], dur, 0.045);
        }
        st.tleft--;
      },
    },
    abstract: {
      bpm: 96,
      step(s, t, d) {
        const wt = [60, 62, 64, 66, 68, 70];
        if (Math.random() < 0.2) I.bell(d, t, pick(wt) + pick([0, 12, 12, 24]), 0.035, 1.8);
        if (s % 3 === 0) I.wood(d, t, s % 9 === 0 ? 84 : 79, 0.05);
        if (s % 5 === 0) I.wood(d, t, 72, 0.03);
        if (s % 16 === 0) I.bass(d, t, pick([36, 38, 42, 44]), 0.6, 0.12);
        if (s % 32 === 16) I.pad(d, t, [pick(wt), pick(wt) + 6], 3, 0.03, 'square', 600);
      },
    },
    surrealism: {
      bpm: 50,
      step(s, t, d) {
        const chords = [[51, 55, 58, 62], [49, 53, 56, 60], [47, 51, 54, 58], [50, 54, 57, 61]];
        const ch = chords[Math.floor(s / 32) % 4];
        if (s % 32 === 0) for (const m of ch) tone(d, 'triangle', mtof(m), t, 0.025, 2.5, 6, { vib: 5, vibRate: 0.7 + Math.random(), lp: 1200, hold: 1 });
        if (s % 32 === 12 && Math.random() < 0.8) I.glide(d, t, pick(ch) + 12, pick(ch) + 24, 2.5, 0.03);
        if (s % 8 === 4 && Math.random() < 0.5) tone(d, 'sine', mtof(pick(ch) + 24), t, 0.03, 0.9, 0.08);
      },
    },
    pop: {
      bpm: 118,
      mel: [72, 0, 74, 76, 0, 79, 76, 0, 74, 0, 72, 74, 76, 0, 0, 0, 79, 0, 81, 79, 0, 76, 74, 0, 72, 0, 74, 0, 72, 0, 0, 0],
      step(s, t, d) {
        const k = s % 16;
        if (k % 4 === 0) I.kick(d, t, 0.32);
        if (k === 4 || k === 12) I.snare(d, t, 0.13);
        if (k % 2 === 1) I.hat(d, t, 0.05);
        const root = [48, 45, 41, 43][Math.floor(s / 16) % 4];
        if ([0, 3, 6, 8, 10, 14].includes(k)) I.bass(d, t, root - 12 + (k === 10 ? 12 : 0), 0.18, 0.14);
        const m = this.mel[s % 32];
        if (m && Math.floor(s / 64) % 2 === 0) I.lead(d, t, m, 0.14, 0.03);
        if (Math.floor(s / 64) % 2 === 1 && k % 4 === 2) I.pluck(d, t, root + 24 + [0, 4, 7][(s / 4 | 0) % 3], 0.04, 0.3);
      },
    },
    tension: {
      bpm: (st) => 100 + (st.urgency || 0) * 70,
      step(s, t, d, st) {
        const u = st.urgency || 0;
        const root = Math.floor(s / 32) % 2 ? 41 : 40;
        if (s % 2 === 0) I.bass(d, t, root, 0.12, 0.07 + u * 0.05);
        if (s % 32 === 0) I.pad(d, t, [52, 53, 59], 3, 0.04 + u * 0.03, 'sawtooth', 900 + u * 1200);
        if (u > 0.55 && (s % 8 === 0 || s % 8 === 2)) I.kick(d, t, 0.18 + u * 0.12);
        if (s % 4 === 2) I.hat(d, t, 0.02 + u * 0.03);
      },
    },
    ending: {
      bpm: 100,
      mel: [76, 0, 79, 0, 81, 0, 79, 76, 74, 0, 72, 0, 74, 76, 0, 0],
      step(s, t, d) {
        const ch = [[48, 52, 55], [43, 47, 50], [45, 48, 52], [41, 45, 48]][Math.floor(s / 16) % 4];
        if (s % 16 === 0) I.pad(d, t, ch, 2.4, 0.05, 'triangle', 1400);
        if (s % 2 === 0) I.pluck(d, t, ch[(s / 2) % 3] + 24, 0.04, 0.6);
        if (s % 4 === 2) I.hat(d, t, 0.025);
        const m = this.mel[s % 16];
        if (m && Math.floor(s / 32) % 2 === 1) I.bell(d, t, m, 0.04, 1.2);
      },
    },
  };

  A.music = function (name) {
    if (A.songName === name) return;
    A.songName = name;
    if (!c) return;
    if (A.current) {
      const old = A.current;
      old.gain.gain.cancelScheduledValues(c.currentTime);
      old.gain.gain.setTargetAtTime(0, c.currentTime, 0.5);
      setTimeout(() => { try { old.gain.disconnect(); } catch (e) { /* ignore */ } }, 4000);
    }
    A.current = null;
    const song = SONGS[name];
    if (!song) return;
    const g = c.createGain();
    g.gain.value = 0.0001;
    g.gain.setTargetAtTime(1, c.currentTime, 0.8);
    g.connect(A.musicBus);
    A.current = { song, gain: g, step: 0, next: c.currentTime + 0.15, st: {} };
    if (song.init) song.init(A.current.st);
  };
  A.setParam = function (k, v) { if (A.current) A.current.st[k] = v; };

  function tick() {
    const cur = A.current;
    if (!cur || c.state !== 'running') return;
    if (cur.next < c.currentTime - 0.5) cur.next = c.currentTime + 0.05;
    while (cur.next < c.currentTime + 0.15) {
      cur.song.step(cur.step, cur.next, cur.gain, cur.st);
      const bpm = typeof cur.song.bpm === 'function' ? cur.song.bpm(cur.st) : cur.song.bpm;
      cur.next += 60 / bpm / 4;
      cur.step++;
    }
  }

  // ---------- sound effects ----------
  A.sfx = function (name, opt) {
    if (!c || c.state !== 'running') return;
    opt = opt || {};
    const t = c.currentTime + 0.01, d = A.sfxBus;
    switch (name) {
      case 'tap': I.wood(d, t, 88, 0.08); break;
      case 'step': noise(d, t, 0.05 * (opt.vol || 1), 0.07, 'lowpass', 500 + Math.random() * 300, 1); break;
      case 'gstep': noise(d, t, 0.1 * (opt.vol || 1), 0.12, 'lowpass', 260, 1.2); tone(d, 'sine', 70, t, 0.08 * (opt.vol || 1), 0.003, 0.1); break;
      case 'pickup': {
        const st = opt.style || 'impressionism';
        if (st === 'impressionism') [72, 76, 79, 83, 86].forEach((m, i) => I.pluck(d, t + i * 0.05, m, 0.09, 1.2));
        else if (st === 'realism') { I.wood(d, t, 70, 0.15); I.pluck(d, t + 0.06, 74, 0.1, 1); I.pluck(d, t + 0.14, 81, 0.08, 1.2); }
        else if (st === 'abstract') [84, 88, 91, 96].forEach((m, i) => tone(d, 'square', mtof(m), t + i * 0.045, 0.04, 0.002, 0.07, { lp: 4000 }));
        else if (st === 'surrealism') { I.glide(d, t, 72, 84, 0.6, 0.08); I.bell(d, t + 0.25, 88, 0.05, 1.4); }
        else { tone(d, 'sine', 400, t, 0.15, 0.002, 0.12, { toFreq: 1400, glide: 0.1 }); I.bell(d, t + 0.08, 91, 0.05, 0.6); }
        break;
      }
      case 'rustle': noise(d, t, 0.12, 0.35, 'bandpass', 2500, 0.6, { attack: 0.04 }); break;
      case 'whoosh': noise(d, t, 0.25, 0.9, 'bandpass', 300, 1.5, { toFreq: 3200, attack: 0.3 }); break;
      case 'portalIn': noise(d, t, 0.22, 1.2, 'bandpass', 400, 2, { toFreq: 4000, attack: 0.4 }); [60, 64, 67, 72, 76, 79, 84].forEach((m, i) => I.bell(d, t + i * 0.09, m + 12, 0.04, 1)); break;
      case 'portalOut': noise(d, t, 0.22, 1.0, 'bandpass', 3500, 2, { toFreq: 300, attack: 0.2 }); [84, 79, 76, 72, 67].forEach((m, i) => I.bell(d, t + i * 0.08, m, 0.04, 1)); break;
      case 'sparkle': for (let i = 0; i < 6; i++) I.bell(d, t + i * 0.07, 84 + Math.floor(Math.random() * 12), 0.025, 0.8); break;
      case 'wow': [67, 71, 74, 79, 83].forEach((m, i) => I.bell(d, t + i * 0.06, m + 12, 0.04, 1.6)); break;
      case 'pick': I.wood(d, t, 80, 0.06); break;
      case 'drop': I.wood(d, t, 70, 0.05); break;
      case 'snap': I.wood(d, t, 76, 0.12); tone(d, 'sine', 180, t, 0.12, 0.002, 0.12); I.bell(d, t + 0.03, 91, 0.025, 0.5); break;
      case 'tick': I.wood(d, t, opt.hi ? 96 : 89, opt.hi ? 0.1 : 0.06); break;
      case 'door': {
        const o = tone(d, 'sawtooth', 85, t, 0.08, 0.1, 1.2, { lp: 700, q: 6, hold: 0.3 });
        o.frequency.setValueAtTime(85, t); o.frequency.linearRampToValueAtTime(120, t + 0.5); o.frequency.linearRampToValueAtTime(70, t + 1.4);
        tone(d, 'sine', 60, t + 1.3, 0.2, 0.004, 0.3);
        break;
      }
      case 'thud': tone(d, 'sine', 70, t, 0.25, 0.003, 0.3); noise(d, t, 0.1, 0.2, 'lowpass', 300, 1); break;
      case 'success': [60, 64, 67, 72, 76, 79, 84].forEach((m, i) => { I.pluck(d, t + i * 0.08, m, 0.08, 1.2); I.bell(d, t + i * 0.08, m + 12, 0.025, 1); }); break;
      case 'caught': [67, 63, 60, 55].forEach((m, i) => tone(d, 'triangle', mtof(m), t + i * 0.28, 0.12, 0.02, 0.3, { vib: 6, hold: 0.1 })); break;
      case 'whistle': tone(d, 'sine', 2600, t, 0.08, 0.02, 0.5, { vib: 120, vibRate: 22, hold: 0.25 }); break;
      case 'alert': tone(d, 'square', 880, t, 0.06, 0.003, 0.12, { lp: 2500 }); tone(d, 'square', 1175, t + 0.13, 0.06, 0.003, 0.18, { lp: 2500 }); break;
      case 'page': noise(d, t, 0.06, 0.25, 'highpass', 2000, 0.5, { attack: 0.05 }); break;
      case 'click': I.wood(d, t, 92, 0.05); break;
    }
  };
})();
