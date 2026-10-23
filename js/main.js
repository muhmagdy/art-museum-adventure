/* Boot. */
(function () {
  'use strict';
  const G = window.G;
  G.applyLang();
  const boot = () => G.start(new G.TitleScene());
  // wait (briefly) for the web font so canvas text uses it; fall back if offline
  if (document.fonts && document.fonts.load) {
    Promise.race([
      Promise.all([document.fonts.load('800 40px "Baloo Bhaijaan 2"'), document.fonts.load('700 40px "Baloo Bhaijaan 2"')]),
      new Promise((r) => setTimeout(r, 1500)),
    ]).then(boot, boot);
  } else boot();
})();
