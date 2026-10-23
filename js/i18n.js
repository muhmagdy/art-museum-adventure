/* Localisation: Arabic (RTL, default) and English. */
(function () {
  'use strict';
  const G = window.G;

  const S = {
    title: { ar: 'مغامرة في متحف الفن', en: 'Art Museum Adventure' },
    subtitle: { ar: 'رحلة ليلية عبر مدارس الفن', en: 'A night journey through art movements' },
    play: { ar: 'ابدأ المغامرة', en: 'Start the adventure' },
    langBtn: { ar: 'English', en: 'عربي' },
    next: { ar: 'التالي', en: 'Next' },
    skip: { ar: 'تخطَّ', en: 'Skip' },
    tapContinue: { ar: 'المس الشاشة للمتابعة', en: 'Tap to continue' },
    sound: { ar: 'الصوت', en: 'Sound' },
    home: { ar: 'الشاشة الرئيسية', en: 'Title screen' },
    leaveQ: { ar: 'هل تريد العودة إلى الشاشة الرئيسية؟ ستبدأ المغامرة من جديد.', en: 'Go back to the title screen? The adventure will start over.' },
    yes: { ar: 'نعم', en: 'Yes' },
    no: { ar: 'لا', en: 'No' },

    intro1: { ar: 'في ليلة هادئة يضيئها القمر، وقف ولد فضولي يحب الفن والاستكشاف أمام متحف الفن.', en: 'On a quiet moonlit night, a curious boy who loves art and exploring stood in front of the art museum.' },
    intro2: { ar: 'وجد بابًا جانبيًا مواربًا… فتسلّل إلى الداخل على أطراف أصابعه.', en: 'He found a side door left ajar… and tiptoed inside.' },
    intro3: { ar: 'فجأة! أضاء مصباح يدوي في وجهه. لقد رآه حارس الأمن!', en: 'Suddenly, a flashlight shone on him. The security guard had spotted him!' },
    hey: { ar: 'توقّف!', en: 'Hey! Stop!' },
    chase1: { ar: 'ركض الولد إلى القاعة الرئيسية. فيها خمسة أبواب، على كل باب اسم مدرسة فنية.', en: 'The boy ran into the main hall. It had five doors, each labeled with an art movement.' },
    chase2: { ar: 'كان الباب الأول وحده مفتوحًا: الانطباعية!', en: 'Only the first door was open: Impressionism!' },
    chase3: { ar: 'أضاعه الحارس… فهزّ رأسه وابتعد.', en: 'The guard lost him… shrugged, and walked away.' },
    chase4: { ar: 'أُغلق الباب خلفه. صار محبوسًا داخل المتحف! عليه أن يستكشف كل الغرف ليخرج.', en: 'The door clicked shut behind him. He was locked inside! He must explore every room to get out.' },

    roomHint: { ar: 'المس لوحة لتقترب منها', en: 'Tap a painting to step closer' },
    roomDone: { ar: 'استكشفتَ اللوحات الثلاث! المس الباب لتتسلّل إلى القاعة…', en: 'All three paintings explored! Tap the door to sneak back into the hall…' },
    explored: { ar: 'استكشفتَ هذه اللوحة', en: 'Already explored' },
    worldHint: { ar: 'اجمع الأشياء المخفية! المس ما حولك، فبعضها مختبئ.', en: 'Collect the hidden items! Tap things around you — some are hiding.' },
    hint: { ar: 'تلميح', en: 'Hint' },
    allFound: { ar: 'وجدتَ كل شيء!', en: 'You found everything!' },
    wow: { ar: 'واو!', en: 'Wow!' },
    styleOf: { ar: 'على طريقة {a}', en: 'In the style of {a}' },

    sneak: { ar: 'الحارس يتجوّل في القاعة… تسلّل بهدوء!', en: 'The guard patrols the hall… sneak quietly!' },
    sneakExit: { ar: 'باب المخرج! تسلّل إليه بهدوء…', en: 'The exit door! Sneak over quietly…' },
    puzzle: { ar: 'اسحب القطع إلى أماكنها لتفتح الباب قبل أن يصل الحارس!', en: 'Drag the pieces into place to open the door before the guard arrives!' },
    opened: { ar: 'فُتح الباب!', en: 'The door is open!' },
    enter: { ar: 'ادخل', en: 'Go in' },
    caught: { ar: 'أمسك بك الحارس!', en: 'The guard caught you!' },
    caught2: { ar: 'أعاد الحارس الولد إلى بيته… لكنه سيعود ويحاول من جديد، من الغرفة الأولى!', en: 'The guard sent the boy home… but he will come back and try again, from the very first room!' },
    tryAgain: { ar: 'حاول مرة أخرى', en: 'Try again' },
    exitName: { ar: 'المخرج', en: 'EXIT' },
    exitDesc: { ar: 'لقد استكشفتَ المتحف كله! حان وقت العودة إلى البيت.', en: 'You explored the whole museum! Time to go home.' },
    end1: { ar: 'خرج الولد من المتحف مع شروق الشمس، ورأسه مليء بمعرفة الفن!', en: 'The boy stepped out into the sunrise, his head full of art!' },
    end2: { ar: 'اكتشفتَ ٥ مدارس فنية و١٥ لوحة', en: 'You discovered 5 art movements and 15 paintings' },
    playAgain: { ar: 'العب مرة أخرى', en: 'Play again' },
    theEnd: { ar: 'النهاية', en: 'The End' },
    back: { ar: 'عاد مرة أخرى!', en: 'Back again!' },
  };
  G.STR = S;

  let lang = 'ar';
  try { lang = localStorage.getItem('ama-lang') || 'ar'; } catch (e) { /* storage blocked */ }
  if (lang !== 'ar' && lang !== 'en') lang = 'ar';
  G.lang = lang;

  G.t = function (key, vars) {
    const e = S[key];
    let s = e ? e[G.lang] : key;
    if (vars) for (const k in vars) s = s.replace('{' + k + '}', vars[k]);
    return s;
  };
  G.tr = (obj) => (obj ? obj[G.lang] || obj.en : '');
  G.num = function (n) {
    const s = String(n);
    return G.lang === 'ar' ? s.replace(/[0-9]/g, (d) => '٠١٢٣٤٥٦٧٨٩'[d]) : s;
  };

  G.applyLang = function () {
    const html = document.documentElement;
    html.lang = G.lang;
    html.dir = G.lang === 'ar' ? 'rtl' : 'ltr';
    document.title = G.t('title');
    document.querySelectorAll('[data-i18n]').forEach((el) => { el.textContent = G.t(el.dataset.i18n); });
  };
  G.setLang = function (l) {
    G.lang = l;
    try { localStorage.setItem('ama-lang', l); } catch (e) { /* ignore */ }
    G.applyLang();
    if (G.scene) G.scene.onLang();
  };
})();
