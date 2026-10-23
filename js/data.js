/* Game content: rooms (art movements), paintings, hidden items, props and door puzzles. */
(function () {
  'use strict';
  const G = window.G;

  const art = (en, ar) => ({ en, ar });

  G.ROOMS = [
    {
      id: 'impressionism', music: 'impressionism', sfx: 'impressionism',
      name: art('Impressionism', 'الانطباعية'),
      desc: art('Artists painted outdoors with quick, visible brushstrokes to catch light and colour in a single moment.',
        'رسم الفنانون في الهواء الطلق بضربات فرشاة سريعة وظاهرة ليلتقطوا الضوء والألوان في لحظة واحدة.'),
      paintings: [
        {
          painter: 'monetLilies', seed: 11, year: '1899',
          title: art('Water Lilies', 'زنابق الماء'), artist: art('Claude Monet', 'كلود مونيه'),
          fact: art('Monet painted the water lilies of his own garden pond about 250 times!', 'رسم مونيه زنابق الماء في بركة حديقته نحو ٢٥٠ مرة!'),
          band: [0.76, 0.95],
          props: [{ type: 'lilypad', fx: 0.3, fy: 0.15 }, { type: 'reeds', fx: 0.74, fy: 0.05 }, { type: 'bush', fx: 0.52, fy: 0.02, c: ['#3d6b3f', '#5f8f4e', '#8fb36a'], flowers: ['#f2a7bd', '#e8dcc5'] }],
          items: [{ icon: 'lily', prop: 0 }, { icon: 'frog', prop: 1 }, { icon: 'dragonfly', fx: 0.9, fy: 0.3 }, { icon: 'brush', fx: 0.12, fy: 0.85 }, { icon: 'droplet', fx: 0.6, fy: 0.9 }],
        },
        {
          painter: 'renoirLuncheon', seed: 12, year: '1881',
          title: art('Luncheon of the Boating Party', 'غداء حفلة القوارب'), artist: art('Pierre-Auguste Renoir', 'بيير أوغست رينوار'),
          fact: art('Renoir painted his friends enjoying lunch on a restaurant balcony by the river.', 'رسم رينوار أصدقاءه وهم يستمتعون بالغداء على شرفة مطعم بجانب النهر.'),
          band: [0.68, 0.95],
          props: [{ type: 'table', fx: 0.35, fy: 0.3 }, { type: 'plant', fx: 0.8, fy: 0.1 }, { type: 'chair', fx: 0.56, fy: 0.25 }],
          items: [{ icon: 'grapes', prop: 0 }, { icon: 'ribbon', prop: 1 }, { icon: 'strawhat', fx: 0.1, fy: 0.6 }, { icon: 'cup', fx: 0.66, fy: 0.85 }, { icon: 'fan', fx: 0.93, fy: 0.5 }],
        },
        {
          painter: 'degasDance', seed: 13, year: '1874',
          title: art('The Dance Class', 'درس الرقص'), artist: art('Edgar Degas', 'إدغار ديغا'),
          fact: art('Degas loved painting ballet dancers while they practised and rested.', 'أحبّ ديغا رسم راقصات الباليه وهنّ يتدرّبن ويسترحن.'),
          band: [0.72, 0.95],
          props: [{ type: 'bench', fx: 0.25, fy: 0.2 }, { type: 'watercan', fx: 0.7, fy: 0.35 }, { type: 'dancer', fx: 0.5, fy: 0.1, c: '#82c39a' }],
          items: [{ icon: 'slipper', prop: 0 }, { icon: 'flower', prop: 1 }, { icon: 'fan', fx: 0.08, fy: 0.7 }, { icon: 'note', fx: 0.9, fy: 0.25 }, { icon: 'ribbon', fx: 0.4, fy: 0.9 }],
        },
      ],
    },
    {
      id: 'realism', music: 'realism', sfx: 'realism',
      name: art('Realism', 'الواقعية'),
      desc: art('Artists painted ordinary people and everyday life truthfully: workers, farmers and travellers.',
        'رسم الفنانون الناس العاديين والحياة اليومية كما هي بصدق: العمّال والفلاحين والمسافرين.'),
      paintings: [
        {
          painter: 'milletGleaners', seed: 21, year: '1857',
          title: art('The Gleaners', 'جامعات السنابل'), artist: art('Jean-François Millet', 'جان فرانسوا ميليه'),
          fact: art('Three poor women gather the leftover grains of wheat after the harvest.', 'ثلاث نساء فقيرات يجمعن ما تبقّى من سنابل القمح بعد الحصاد.'),
          band: [0.72, 0.95],
          props: [{ type: 'haystack', fx: 0.3, fy: 0.05 }, { type: 'sheaf', fx: 0.68, fy: 0.3 }, { type: 'sheaf', fx: 0.85, fy: 0.1 }],
          items: [{ icon: 'basket', prop: 0 }, { icon: 'bird', prop: 1 }, { icon: 'wheat', fx: 0.12, fy: 0.7 }, { icon: 'bread', fx: 0.5, fy: 0.85 }, { icon: 'apple', fx: 0.94, fy: 0.75 }],
        },
        {
          painter: 'courbetStone', seed: 22, year: '1849',
          title: art('The Stone Breakers', 'كسّارو الحجارة'), artist: art('Gustave Courbet', 'غوستاف كوربيه'),
          fact: art('Courbet showed two workers doing hard work on a road, without making it look pretty.', 'أظهر كوربيه عاملَين يقومان بعمل شاقّ على الطريق دون تجميل.'),
          band: [0.72, 0.95],
          props: [{ type: 'rocks', fx: 0.4, fy: 0.2 }, { type: 'bush', fx: 0.76, fy: 0.02, c: ['#2a3a22', '#3b4a2a', '#4a4a30'] }, { type: 'rocks', fx: 0.15, fy: 0.05, s: 0.8 }],
          items: [{ icon: 'hammer', prop: 0 }, { icon: 'hat', prop: 1 }, { icon: 'stone', fx: 0.06, fy: 0.8 }, { icon: 'bowl', fx: 0.58, fy: 0.85 }, { icon: 'shoe', fx: 0.92, fy: 0.6 }],
        },
        {
          painter: 'daumierCarriage', seed: 23, year: '1864',
          title: art('The Third-Class Carriage', 'عربة الدرجة الثالثة'), artist: art('Honoré Daumier', 'أونوريه دومييه'),
          fact: art('Daumier painted tired travellers squeezed into a crowded, cheap train carriage.', 'رسم دومييه مسافرين متعبين في عربة قطار مزدحمة ورخيصة.'),
          band: [0.73, 0.95],
          props: [{ type: 'luggage', fx: 0.3, fy: 0.25 }, { type: 'bench', fx: 0.66, fy: 0.1, c: '#5a4026' }],
          items: [{ icon: 'umbrella', prop: 0 }, { icon: 'ticket', prop: 1 }, { icon: 'lantern', fx: 0.1, fy: 0.5 }, { icon: 'clock', fx: 0.48, fy: 0.9 }, { icon: 'basket', fx: 0.9, fy: 0.7 }],
        },
      ],
    },
    {
      id: 'abstract', music: 'abstract', sfx: 'abstract',
      name: art('Abstract Art', 'الفن التجريدي'),
      desc: art('Artists used shapes, lines and colours instead of real things, to show feelings, like music.',
        'استخدم الفنانون الأشكال والخطوط والألوان بدلًا من الأشياء الحقيقية، ليعبّروا عن المشاعر مثل الموسيقى.'),
      paintings: [
        {
          painter: 'kandinsky7', seed: 31, year: '1913',
          title: art('Composition VII', 'التكوين السابع'), artist: art('Wassily Kandinsky', 'فاسيلي كاندينسكي'),
          fact: art('Kandinsky believed colours could sound like music.', 'كان كاندينسكي يؤمن بأن للألوان أصواتًا مثل الموسيقى.'),
          band: [0.76, 0.95],
          props: [{ type: 'bigcircle', fx: 0.32, fy: 0.15 }, { type: 'wedge', fx: 0.7, fy: 0.25 }],
          items: [{ icon: 'note', prop: 0 }, { icon: 'triangle', prop: 1 }, { icon: 'circle', fx: 0.1, fy: 0.6 }, { icon: 'brush', fx: 0.5, fy: 0.9 }, { icon: 'palette', fx: 0.92, fy: 0.5 }],
        },
        {
          painter: 'mondrian', seed: 32, year: '1930',
          title: art('Composition with Red, Blue and Yellow', 'تكوين بالأحمر والأزرق والأصفر'), artist: art('Piet Mondrian', 'بيت موندريان'),
          fact: art('Mondrian used only straight black lines and the primary colours red, blue and yellow.', 'استخدم موندريان خطوطًا سوداء مستقيمة والألوان الأساسية فقط: الأحمر والأزرق والأصفر.'),
          band: [0.75, 0.94],
          props: [{ type: 'block', fx: 0.28, fy: 0.2, c: '#f2c230' }, { type: 'block', fx: 0.66, fy: 0.3, c: '#1f3f8f' }, { type: 'block', fx: 0.86, fy: 0.05, c: '#f3efe6', s: 0.8 }],
          items: [{ icon: 'yellowsq', prop: 0 }, { icon: 'bluesq', prop: 1 }, { icon: 'redsq', fx: 0.1, fy: 0.7 }, { icon: 'ruler', fx: 0.47, fy: 0.85 }, { icon: 'pencil', fx: 0.95, fy: 0.75 }],
        },
        {
          painter: 'malevich', seed: 33, year: '1915',
          title: art('Black Square', 'المربع الأسود'), artist: art('Kazimir Malevich', 'كازيمير ماليفيتش'),
          fact: art('Malevich painted a simple black square to show that art can be pure feeling.', 'رسم ماليفيتش مربعًا أسود بسيطًا ليُظهر أن الفن يمكن أن يكون شعورًا خالصًا.'),
          band: [0.76, 0.95],
          props: [{ type: 'floatsq', fx: 0.26, fy: 0.2 }, { type: 'shape', fx: 0.72, fy: 0.3, c: '#c8302a' }, { type: 'shape', fx: 0.9, fy: 0.05, c: '#f2c230' }],
          items: [{ icon: 'blacksq', prop: 0 }, { icon: 'bar', prop: 1 }, { icon: 'cross', fx: 0.08, fy: 0.75 }, { icon: 'circle', fx: 0.5, fy: 0.9 }, { icon: 'triangle', fx: 0.95, fy: 0.7 }],
        },
      ],
    },
    {
      id: 'surrealism', music: 'surrealism', sfx: 'surrealism',
      name: art('Surrealism', 'السريالية'),
      desc: art('Artists painted dreams: melting clocks, floating objects and impossible places.',
        'رسم الفنانون الأحلام: ساعات تذوب، وأشياء تطفو، وأماكن مستحيلة.'),
      paintings: [
        {
          painter: 'daliMelting', seed: 41, style: true,
          title: art('The Melting Afternoon', 'ظهيرة ذائبة'), artist: art('Salvador Dalí', 'سلفادور دالي'),
          fact: art('Dalí painted soft, melting clocks to show that time feels different in dreams.', 'رسم دالي ساعات ليّنة تذوب ليُظهر أن الوقت يبدو مختلفًا في الأحلام.'),
          band: [0.72, 0.95],
          props: [{ type: 'clocktree', fx: 0.3, fy: 0.05 }, { type: 'plinth', fx: 0.68, fy: 0.3 }],
          items: [{ icon: 'meltclock', prop: 0 }, { icon: 'egg', prop: 1 }, { icon: 'feather', fx: 0.1, fy: 0.7 }, { icon: 'butterfly', fx: 0.5, fy: 0.9 }, { icon: 'shell', fx: 0.92, fy: 0.6 }],
        },
        {
          painter: 'magritteHats', seed: 42, style: true,
          title: art('The Floating Hats', 'القبعات الطائرة'), artist: art('René Magritte', 'رينيه ماغريت'),
          fact: art('Magritte mixed ordinary things in strange ways, like day and night at the same time.', 'مزج ماغريت أشياء عادية بطرق غريبة، مثل النهار والليل في الوقت نفسه.'),
          band: [0.72, 0.95],
          props: [{ type: 'giantapple', fx: 0.34, fy: 0.25 }, { type: 'bush', fx: 0.7, fy: 0.05, c: ['#0f1f14', '#1a2e1e', '#24402a'] }, { type: 'lamp', fx: 0.88, fy: 0.02 }],
          items: [{ icon: 'apple', prop: 0 }, { icon: 'umbrella', prop: 1 }, { icon: 'bowler', fx: 0.1, fy: 0.75 }, { icon: 'cloud', fx: 0.52, fy: 0.88 }, { icon: 'bird', fx: 0.95, fy: 0.6 }],
        },
        {
          painter: 'miroGarden', seed: 43, style: true,
          title: art('The Dream Garden', 'حديقة الأحلام'), artist: art('Joan Miró', 'خوان ميرو'),
          fact: art('Miró painted playful signs (stars, eyes and moons) like a secret alphabet.', 'رسم ميرو رموزًا مرحة، نجومًا وعيونًا وأقمارًا، كأنها أبجدية سرية.'),
          band: [0.76, 0.95],
          props: [{ type: 'blob', fx: 0.3, fy: 0.2, c: '#c8302a' }, { type: 'ladder', fx: 0.68, fy: 0.05 }, { type: 'blob', fx: 0.86, fy: 0.3, c: '#1f3f8f' }],
          items: [{ icon: 'eye', prop: 0 }, { icon: 'moon', prop: 1 }, { icon: 'star', fx: 0.1, fy: 0.7 }, { icon: 'sun', fx: 0.5, fy: 0.85 }, { icon: 'bird', fx: 0.96, fy: 0.8 }],
        },
      ],
    },
    {
      id: 'pop', music: 'pop', sfx: 'pop',
      name: art('Pop Art', 'فن البوب'),
      desc: art('Artists turned everyday things (comics, adverts and food cans) into bold, bright art.',
        'حوّل الفنانون الأشياء اليومية، كالقصص المصوّرة والإعلانات وعلب الطعام، إلى فن جريء زاهي الألوان.'),
      paintings: [
        {
          painter: 'warholCans', seed: 51, style: true,
          title: art('Soup Can Parade', 'استعراض علب الحساء'), artist: art('Andy Warhol', 'آندي وارهول'),
          fact: art('Warhol repeated everyday products again and again, like on a supermarket shelf.', 'كرّر وارهول المنتجات اليومية مرة بعد مرة، كما على رفوف السوبرماركت.'),
          band: [0.75, 0.95],
          props: [{ type: 'giantcan', fx: 0.3, fy: 0.2, c: '#1e88e5' }, { type: 'cubebox', fx: 0.68, fy: 0.3 }, { type: 'giantcan', fx: 0.86, fy: 0.05, c: '#8e24aa' }],
          items: [{ icon: 'can', prop: 0 }, { icon: 'banana', prop: 1 }, { icon: 'camera', fx: 0.1, fy: 0.7 }, { icon: 'star', fx: 0.5, fy: 0.9 }, { icon: 'heart', fx: 0.96, fy: 0.75 }],
        },
        {
          painter: 'lichtComic', seed: 52, style: true,
          title: art('Comic Surprise', 'مفاجأة مصوّرة'), artist: art('Roy Lichtenstein', 'روي ليختنشتاين'),
          fact: art('Lichtenstein painted giant comic-book pictures made of tiny printed dots.', 'رسم ليختنشتاين صورًا عملاقة من القصص المصوّرة مصنوعة من نقاط طباعة صغيرة.'),
          band: [0.75, 0.95],
          props: [{ type: 'burst', fx: 0.3, fy: 0.15, text: 'BAM!' }, { type: 'speechprop', fx: 0.7, fy: 0.25 }],
          items: [{ icon: 'lightning', prop: 0 }, { icon: 'speech', prop: 1 }, { icon: 'star', fx: 0.08, fy: 0.75 }, { icon: 'brush', fx: 0.5, fy: 0.9 }, { icon: 'droplet', fx: 0.94, fy: 0.6 }],
        },
        {
          painter: 'haringDance', seed: 53, style: true,
          title: art('Dancing Lines', 'خطوط راقصة'), artist: art('Keith Haring', 'كيث هارينغ'),
          fact: art('Keith Haring drew bold, happy figures full of movement.', 'رسم كيث هارينغ شخصيات جريئة وسعيدة مليئة بالحركة.'),
          band: [0.75, 0.95],
          props: [{ type: 'haringfig', fx: 0.3, fy: 0.15, c: '#8e44ad' }, { type: 'haringdog', fx: 0.7, fy: 0.3, c: '#27ae60' }],
          items: [{ icon: 'heart', prop: 0 }, { icon: 'note', prop: 1 }, { icon: 'star', fx: 0.1, fy: 0.7 }, { icon: 'balloon', fx: 0.5, fy: 0.88 }, { icon: 'crown', fx: 0.95, fy: 0.65 }],
        },
      ],
    },
  ];

  // door puzzles: doors 1..4 lead to rooms 1..4, door 5 is the museum exit
  G.DOORS = [
    null,
    { room: 1, cols: 3, rows: 3, time: 80 },
    { room: 2, cols: 4, rows: 3, time: 95 },
    { room: 3, cols: 4, rows: 3, time: 90 },
    { room: 4, cols: 4, rows: 4, time: 120 },
    { exit: true, cols: 5, rows: 4, time: 150 },
  ];

  G.newState = () => ({ room: 0, done: G.ROOMS.map(() => [false, false, false]) });
  G.state = G.newState();

  // painting thumbnails are cached per size
  const cache = {};
  G.paintingImage = function (ri, pi, w, h) {
    const key = ri + '-' + pi + '-' + Math.round(w) + 'x' + Math.round(h);
    if (cache[key]) return cache[key];
    const p = G.ROOMS[ri].paintings[pi];
    const res = Math.min(2, G.dpr * G.scale * 1.2);
    const { c, ctx } = G.makeCanvas(w, h, Math.max(1, res));
    G.PAINTERS[p.painter](ctx, w, h, G.rng(p.seed), true);
    cache[key] = c;
    return c;
  };
  G.paintingTitleLines = function (p) {
    const artist = G.tr(p.artist);
    return [G.tr(p.title), p.style ? G.t('styleOf', { a: artist }) : artist + (p.year ? (G.lang === 'ar' ? '، ' : ', ') + G.num(p.year) : '')];
  };
})();
