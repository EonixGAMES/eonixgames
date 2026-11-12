/* EONIX GAMES — shared renderer. Used by the public site (home cards) and by the admin
   (preview + website export). Contains no credentials and no private logic. */
(function (root) {
  'use strict';

  var NAME = 'EONIX GAMES';
  var SLOGAN = 'PLAY \u2022 DREAM \u2022 EXPLORE';
  var SOCIAL = [
    ['Facebook', 'https://www.facebook.com/profile.php?id=61596593152029'],
    ['Instagram', 'https://www.instagram.com/eonixgamesstudio/'],
    ['TikTok', 'https://www.tiktok.com/@eonixgamesstudio'],
    ['YouTube', 'https://www.youtube.com/channel/UCOJLnyj9GXE_ybrs91NsTeg'],
    ['X', 'https://x.com/EonixGameStudio']
  ];
  var UI = {
    home: ['HOME', 'الرئيسية'], pc: ['PC GAMES', 'ألعاب الحاسوب'], mobile: ['MOBILE GAMES', 'ألعاب الهاتف'],
    news: ['NEWS', 'الأخبار'], about: ['ABOUT', 'من نحن'], media: ['MEDIA', 'الوسائط'], contact: ['CONTACT', 'تواصل معنا'],
    details: ['Game details', 'تفاصيل اللعبة'], read: ['READ ARTICLE', 'اقرأ المقال'], allnews: ['All news', 'كل الأخبار'],
    backGames: ['Back to games', 'العودة إلى الألعاب'], backNews: ['Back to news', 'العودة إلى الأخبار'],
    related: ['Related news', 'أخبار ذات صلة'], moreNews: ['More articles', 'مقالات أخرى'],
    shots: ['Screenshots', 'لقطات الشاشة'], trailer: ['Trailer', 'العرض التشويقي'], features: ['Features', 'المميزات'],
    aboutGame: ['About the game', 'عن اللعبة'], release: ['Release date', 'تاريخ الإصدار'], platform: ['Platform', 'المنصة'],
    status: ['Status', 'الحالة'], gplay: ['Google Play', 'Google Play'], appstore: ['App Store', 'App Store'],
    pcstore: ['PC store', 'متجر الحاسوب'], download: ['Download', 'تحميل'], tba: ['To Be Announced', 'سيُعلن عنه لاحقًا'],
    next: ['NEXT PROJECT', 'المشروع القادم'], noNews: ['No articles published yet.', 'لا توجد مقالات منشورة بعد.'],
    watch: ['Watch the trailer', 'شاهد العرض التشويقي'], newsTitle: ['News & Articles', 'الأخبار والمقالات'],
    company: ['AN EONIXSOFT COMPANY', 'شركة تابعة لـ EONIXSOFT'], rights: ['All rights reserved.', 'جميع الحقوق محفوظة.']
  };
  var STATUS = { 'In Development': ['In Development', 'قيد التطوير'], 'Coming Soon': ['Coming Soon', 'قريبًا'], 'Released': ['Released', 'متوفرة الآن'] };
  var PLATFORM = { 'PC': ['PC', 'الحاسوب'], 'Mobile': ['Mobile', 'الهاتف'], 'PC & Mobile': ['PC & Mobile', 'الحاسوب والهاتف'] };

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function slugify(s) {
    return String(s || '').normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
      .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  }
  function safeUrl(u) { u = String(u || '').trim(); return /^https?:\/\//i.test(u) ? u : ''; }
  function U(p, base) {
    if (!p) return '';
    return /^(https?:|blob:|data:|\/)/i.test(p) ? p : (base || '') + p;
  }
  function pair(arr) { return '<span class="en">' + esc(arr[0]) + '</span><span class="ar">' + esc(arr[1]) + '</span>'; }
  function t(k) { return pair(UI[k]); }
  function bi(o) {
    o = o || {};
    var en = o.en || o.ar || '', ar = o.ar || o.en || '';
    if (!en && !ar) return '';
    return '<span class="en">' + esc(en) + '</span><span class="ar">' + esc(ar) + '</span>';
  }
  function statusPill(s) { return '<span class="pill pill--' + esc(slugify(s)) + '">' + pair(STATUS[s] || [s, s]) + '</span>'; }
  function platformPill(p) { return '<span class="pill pill--plat">' + pair(PLATFORM[p] || [p, p]) + '</span>'; }
  function fmtDate(iso, loc) {
    var d = new Date(String(iso).slice(0, 10) + 'T00:00:00');
    if (isNaN(d)) return esc(iso);
    try { return d.toLocaleDateString(loc === 'ar' ? 'ar-DZ-u-nu-latn' : 'en-GB', { year: 'numeric', month: 'long', day: 'numeric' }); }
    catch (e) { return String(iso).slice(0, 10); }
  }
  function biDate(iso) {
    return iso ? '<time datetime="' + esc(String(iso).slice(0, 10)) + '"><span class="en">' + fmtDate(iso, 'en') + '</span><span class="ar">' + fmtDate(iso, 'ar') + '</span></time>' : '';
  }
  function paras(txt) {
    return String(txt || '').split(/\n{2,}/).map(function (p) { return p.trim(); }).filter(Boolean)
      .map(function (p) { return '<p>' + esc(p).replace(/\n/g, '<br>') + '</p>'; }).join('');
  }
  function proseBi(o) {
    o = o || {};
    var en = o.en || o.ar || '', ar = o.ar || o.en || '';
    if (!en && !ar) return '';
    return '<div class="prose en">' + paras(en) + '</div><div class="prose ar">' + paras(ar) + '</div>';
  }
  function plainMd(s) { return paras(s); }

  /* ---------- Cards (shared by home and generated pages) ---------- */
  function coverImg(g, base) {
    var src = U(g.cover, base);
    return src ? '<img src="' + esc(src) + '" alt="' + esc((g.title && g.title.en) || '') + ' cover" loading="lazy">'
      : '<div class="cover-ph"><span>' + esc((g.title && g.title.en) || '') + '</span></div>';
  }
  function gameHref(g, base) { return (base || '') + 'games/' + g.slug + '/index.html'; }
  function latestCard(g, base) {
    if (g.placeholder) {
      return '<div class="cv cv--tba" tabindex="0"><div class="cover-ph"><span>' + t('next') + '</span></div>' +
        '<div class="cv-info"><h3>' + t('next') + '</h3><span class="pill pill--tba">' + t('tba') + '</span></div></div>';
    }
    return '<a class="cv" href="' + esc(gameHref(g, base)) + '">' + coverImg(g, base) +
      '<div class="cv-info"><h3>' + bi(g.title) + '</h3>' + statusPill(g.status) + '</div></a>';
  }
  function storeButtons(g) {
    var s = g.stores || {}, o = '';
    if (safeUrl(s.googlePlay)) o += '<a class="btn" target="_blank" rel="noopener" href="' + esc(safeUrl(s.googlePlay)) + '">' + t('gplay') + '</a>';
    if (safeUrl(s.appStore)) o += '<a class="btn" target="_blank" rel="noopener" href="' + esc(safeUrl(s.appStore)) + '">' + t('appstore') + '</a>';
    if (safeUrl(s.pc)) o += '<a class="btn" target="_blank" rel="noopener" href="' + esc(safeUrl(s.pc)) + '">' + t('pcstore') + '</a>';
    if (safeUrl(g.download)) o += '<a class="btn" target="_blank" rel="noopener" href="' + esc(safeUrl(g.download)) + '">' + t('download') + '</a>';
    return o;
  }
  function gameCard(g, base, opts) {
    opts = opts || {};
    var stores = opts.mobileStores ? (function () {
      var s = g.stores || {}, o = '';
      if (safeUrl(s.googlePlay)) o += '<a class="btn" target="_blank" rel="noopener" href="' + esc(safeUrl(s.googlePlay)) + '">' + t('gplay') + '</a>';
      if (safeUrl(s.appStore)) o += '<a class="btn" target="_blank" rel="noopener" href="' + esc(safeUrl(s.appStore)) + '">' + t('appstore') + '</a>';
      return o;
    })() : '';
    return '<article class="gcard"><a class="gcard-cover" href="' + esc(gameHref(g, base)) + '" tabindex="-1" aria-hidden="true">' + coverImg(g, base) + '</a>' +
      '<div class="gcard-body">' + statusPill(g.status) + '<h3>' + bi(g.title) + '</h3>' +
      (g.short ? '<p>' + bi(g.short) + '</p>' : '') +
      '<div class="actions"><a class="btn btn--ghost" href="' + esc(gameHref(g, base)) + '">' + t('details') + '</a>' + stores + '</div></div></article>';
  }
  function articleHref(a, base) { return (base || '') + 'news/' + a.slug + '/index.html'; }
  function newsCard(a, base) {
    var src = U(a.cover, base);
    return '<article class="ncard"><a class="ncard-cover" href="' + esc(articleHref(a, base)) + '" tabindex="-1" aria-hidden="true">' +
      (src ? '<img src="' + esc(src) + '" alt="' + esc((a.title && a.title.en) || '') + '" loading="lazy">' : '<div class="cover-ph"><span>' + esc(NAME) + '</span></div>') + '</a>' +
      '<div class="ncard-body">' + biDate(a.date) + '<h3>' + bi(a.title) + '</h3>' +
      (a.excerpt ? '<p>' + bi(a.excerpt) + '</p>' : '') +
      '<a class="btn btn--ghost" href="' + esc(articleHref(a, base)) + '">' + t('read') + '</a></div></article>';
  }
  function launchHero(L, base) {
    var img = U(L.image, base), href = (base || '') + 'games/' + L.gameSlug + '/index.html';
    var fx = Number(L.focusX); if (isNaN(fx)) fx = 50;
    var fy = Number(L.focusY); if (isNaN(fy)) fy = 50;
    var copy = '';
    var hasT = L.text && (L.text.en || L.text.ar), hasB = L.button && (L.button.en || L.button.ar);
    if (hasT || hasB) copy = '<span class="launch-copy">' + (hasT ? '<strong>' + bi(L.text) + '</strong>' : '') + (hasB ? '<span class="btn">' + bi(L.button) + '</span>' : '') + '</span>';
    return '<a class="launch-link" href="' + esc(href) + '" aria-label="' + esc(L.title || 'Game launch') + '">' +
      '<img class="launch-img" src="' + esc(img) + '" alt="' + esc(L.title || '') + '" style="object-position:' + fx + '% ' + fy + '%">' +
      '<span class="launch-shade"></span>' + copy + '</a>';
  }

  /* ---------- Data mapping ---------- */
  function mapGame(g, res) {
    var r = function (x) { return x ? res(x) : ''; };
    return {
      id: g.id || g.slug, slug: g.slug, title: g.title || {}, short: g.short || g.shortDescription || {}, shortDescription: g.shortDescription || g.short || {}, full: g.full || {}, published: g.published !== false,
      cover: r(g.cover), banner: r(g.banner), shots: (g.shots || []).map(r).filter(Boolean),
      trailer: safeUrl(g.trailer), platform: g.platform, status: g.status, releaseDate: g.releaseDate || '',
      stores: { googlePlay: safeUrl((g.stores || {}).googlePlay), appStore: safeUrl((g.stores || {}).appStore), pc: safeUrl((g.stores || {}).pc) },
      download: safeUrl(g.download), features: g.features || { en: [], ar: [] }, featured: !!g.featured
    };
  }
  function mapArticle(a, res, games) {
    var g = games.filter(function (x) { return x.id === a.gameId && x.published; })[0];
    return {
      id: a.id || a.slug, slug: a.slug, title: a.title || {}, excerpt: a.excerpt || {}, body: a.body || {}, published: a.published !== false,
      cover: a.cover ? res(a.cover) : '', date: a.date || '', category: a.category || '', gameSlug: g ? g.slug : ''
    };
  }
  function buildPublicData(state, res) {
    var games = (state.games || []).filter(function (g) { return g.published; })
      .sort(function (a, b) { return (a.created || 0) - (b.created || 0); });
    var articles = (state.articles || []).filter(function (a) { return a.published; })
      .sort(function (a, b) { return String(b.date).localeCompare(String(a.date)); });
    var L = state.launch || {};
    var lg = games.filter(function (g) { return g.id === L.gameId; })[0];
    var ok = !!(L.enabled && lg && L.image);
    return {
      generated: new Date().toISOString(),
      launch: {
        enabled: ok, gameSlug: ok ? lg.slug : '', title: ok ? ((lg.title || {}).en || '') : '',
        image: ok ? res(L.image) : '', focusX: L.focusX == null ? 50 : L.focusX, focusY: L.focusY == null ? 50 : L.focusY,
        text: L.text || {}, button: L.button || {}
      },
      games: games.map(function (g) { return mapGame(g, res); }),
      articles: articles.map(function (a) { return mapArticle(a, res, state.games || []); })
    };
  }

  /* ---------- Layout ---------- */
  function homeBase(base) { return base ? base + 'index.html' : ''; }
  function header(base) {
    var H = homeBase(base);
    var links = [['home', H], ['mobile', (base || '') + 'mobile-games/index.html'], ['pc', (base || '') + 'pc-games/index.html'], ['news', (base || '') + 'news/index.html'],
      ['about', (base || '') + 'about/index.html']];
    return '<header class="site-header" id="top"><div class="wrap bar">' +
      '<a class="brand" href="' + (H || '#home') + '"><img src="' + (base || '') + 'assets/images/brand/eonix-games-logo.png" alt="' + NAME + '"></a>' +
      '<nav id="nav" aria-label="Main">' + links.map(function (l) { return '<a href="' + l[1] + '" data-nav="' + l[0] + '">' + t(l[0]) + '</a>'; }).join('') + '</nav>' +
      '<div class="bar-end"><button class="lang-btn" id="langBtn" type="button" aria-label="Switch language"><span class="en">العربية</span><span class="ar">English</span></button>' +
      '<button class="burger" id="burger" type="button" aria-expanded="false" aria-controls="nav" aria-label="Menu"><span></span><span></span><span></span></button></div></div></header>';
  }
  function footer(base) {
    var H = homeBase(base);
    return '<footer class="site-footer"><div class="wrap foot">' +
      '<div><img class="foot-logo" src="' + (base || '') + 'assets/images/brand/eonix-games-logo.png" alt="' + NAME + '"><p class="slogan">' + SLOGAN + '</p></div>' +
      '<nav aria-label="Footer"><a href="' + (H || '#home') + '">' + t('home') + '</a><a href="' + (base || '') + 'mobile-games/index.html">' + t('mobile') + '</a><a href="' + (base || '') + 'pc-games/index.html">' + t('pc') + '</a><a href="' + (base || '') + 'news/index.html">' + t('news') + '</a><a href="' + (base || '') + 'about/index.html">' + t('about') + '</a><a href="' + H + '#contact">' + t('contact') + '</a></nav>' +
      '<div class="social">' + SOCIAL.map(function (s) { return '<a href="' + s[1] + '" target="_blank" rel="noopener">' + s[0] + '</a>'; }).join('') + '</div></div>' +
      '<div class="wrap legal"><span>\u00a9 ' + new Date().getFullYear() + ' ' + NAME + '. ' + t('rights') + '</span><span>' + t('company') + '</span></div></footer>';
  }
  function absUrl(siteUrl, path) { return siteUrl && path ? siteUrl + '/' + path.replace(/^\//, '') : ''; }
  function layout(o) {
    var base = o.base || '', desc = o.desc || (NAME + ' \u2014 an independent Algerian game studio.');
    var h = '<!DOCTYPE html>\n<html lang="en" dir="ltr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">' +
      '<title>' + esc(o.title) + '</title><meta name="description" content="' + esc(desc) + '">';
    if (o.canonical) h += '<link rel="canonical" href="' + esc(o.canonical) + '"><meta property="og:url" content="' + esc(o.canonical) + '">';
    h += '<meta property="og:type" content="' + (o.ogType || 'website') + '"><meta property="og:site_name" content="' + NAME + '">' +
      '<meta property="og:title" content="' + esc(o.title) + '"><meta property="og:description" content="' + esc(desc) + '">';
    if (o.ogImage) h += '<meta property="og:image" content="' + esc(o.ogImage) + '">';
    h += '<meta name="twitter:card" content="' + (o.ogImage ? 'summary_large_image' : 'summary') + '"><meta name="twitter:title" content="' + esc(o.title) + '"><meta name="twitter:description" content="' + esc(desc) + '">';
    if (o.ogImage) h += '<meta name="twitter:image" content="' + esc(o.ogImage) + '">';
    h += '<link rel="icon" href="' + base + 'assets/images/brand/eonix-games-logo.png">' +
      '<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>' +
      '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700&family=Inter:wght@400;500;600&family=Orbitron:wght@500;700;900&display=swap">' +
      '<link rel="stylesheet" href="' + base + 'css/site.css">' +
      '<script>try{if(localStorage.getItem("eonix-lang")==="ar"){document.documentElement.lang="ar";document.documentElement.dir="rtl"}}catch(e){}</script>' +
      '</head><body class="' + (o.bodyClass || '') + '">' + header(base) + '<main id="main">' + o.content + '</main>' + footer(base) +
      '<script src="' + base + 'js/render.js"></script><script src="' + base + 'js/site.js"></script></body></html>';
    return h;
  }

  /* ---------- Game page ---------- */
  function ytEmbed(url) {
    var m = String(url).match(/(?:youtube\.com\/watch\?(?:.*&)?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/shorts\/)([\w-]{6,15})/i);
    if (m) return 'https://www.youtube-nocookie.com/embed/' + m[1];
    m = String(url).match(/vimeo\.com\/(\d+)/i);
    return m ? 'https://player.vimeo.com/video/' + m[1] : '';
  }
  function trailerBlock(url) {
    if (!url) return '';
    var emb = ytEmbed(url);
    var body = emb ? '<div class="video"><iframe src="' + esc(emb) + '" title="Trailer" loading="lazy" allow="accelerometer; encrypted-media; picture-in-picture" allowfullscreen></iframe></div>'
      : /\.(mp4|webm)(\?|$)/i.test(url) ? '<div class="video"><video controls preload="metadata" src="' + esc(url) + '"></video></div>'
        : '<p><a class="btn" target="_blank" rel="noopener" href="' + esc(url) + '">' + t('watch') + '</a></p>';
    return '<section class="block"><h2>' + t('trailer') + '</h2>' + body + '</section>';
  }
  function gamePage(g, pub, ctx) {
    var base = ctx.base || '', H = homeBase(base);
    var hero = U(g.banner || g.cover, base);
    var related = (pub.articles || []).filter(function (a) { return a.gameSlug === g.slug; }).slice(0, 3);
    var feats = g.features || {}, fen = feats.en || [], far = feats.ar && feats.ar.length ? feats.ar : fen;
    var c = '<section class="g-hero">' + (hero ? '<img class="g-hero-img" src="' + esc(hero) + '" alt="' + esc(g.title.en) + '">' : '') +
      '<div class="g-hero-shade"></div><div class="wrap g-hero-copy"><a class="crumb" href="' + H + '#latest">' + t('backGames') + '</a>' +
      '<div class="pills">' + statusPill(g.status) + platformPill(g.platform) + '</div><h1>' + bi(g.title) + '</h1>' +
      (g.short && (g.short.en || g.short.ar) ? '<p class="lede">' + bi(g.short) + '</p>' : '') +
      (storeButtons(g) ? '<div class="actions">' + storeButtons(g) + '</div>' : '') + '</div></section><div class="wrap page">';
    if (g.full && (g.full.en || g.full.ar)) c += '<section class="block"><h2>' + t('aboutGame') + '</h2>' + proseBi(g.full) + '</section>';
    c += '<section class="block facts"><dl><div><dt>' + t('platform') + '</dt><dd>' + pair(PLATFORM[g.platform] || [g.platform, g.platform]) + '</dd></div>' +
      '<div><dt>' + t('status') + '</dt><dd>' + pair(STATUS[g.status] || [g.status, g.status]) + '</dd></div>' +
      (g.releaseDate ? '<div><dt>' + t('release') + '</dt><dd>' + biDate(g.releaseDate) + '</dd></div>' : '') + '</dl></section>';
    c += trailerBlock(g.trailer);
    if (fen.length) c += '<section class="block"><h2>' + t('features') + '</h2><ul class="feat en">' + fen.map(function (f) { return '<li>' + esc(f) + '</li>'; }).join('') +
      '</ul><ul class="feat ar">' + far.map(function (f) { return '<li>' + esc(f) + '</li>'; }).join('') + '</ul></section>';
    if ((g.shots || []).length) c += '<section class="block"><h2>' + t('shots') + '</h2><div class="gallery">' + g.shots.map(function (s, i) {
      return '<img data-lightbox src="' + esc(U(s, base)) + '" alt="' + esc(g.title.en) + ' screenshot ' + (i + 1) + '" loading="lazy">';
    }).join('') + '</div></section>';
    if (related.length) c += '<section class="block"><h2>' + t('related') + '</h2><div class="ngrid">' + related.map(function (a) { return newsCard(a, base); }).join('') + '</div></section>';
    c += '<p class="back"><a class="btn btn--ghost" href="' + H + '#latest">' + t('backGames') + '</a></p></div>';
    var desc = (g.short && g.short.en) || String((g.full && g.full.en) || '').replace(/\s+/g, ' ').slice(0, 155) || (g.title.en + ' \u2014 ' + NAME);
    var path = 'games/' + g.slug + '/index.html';
    return layout({
      title: g.title.en + ' | ' + NAME, desc: desc, base: base, content: c, bodyClass: 'page-game',
      canonical: absUrl(ctx.siteUrl, path), ogImage: ctx.siteUrl && (g.banner || g.cover) ? absUrl(ctx.siteUrl, g.banner || g.cover) : ''
    });
  }

  /* ---------- Article + news pages ---------- */
  function articlePage(a, pub, ctx) {
    var base = ctx.base || '', H = homeBase(base), md = ctx.md || plainMd, res = ctx.res || function (x) { return x; };
    function body(s) { return md(String(s || '').replace(/media:([\w-]+)/g, function (m, id) { return U(res('media:' + id), base); })); }
    var en = a.body && (a.body.en || a.body.ar) || '', ar = a.body && (a.body.ar || a.body.en) || '';
    var cov = U(a.cover, base);
    var more = (pub.articles || []).filter(function (x) { return x.slug !== a.slug; })
      .sort(function (x, y) { return (y.gameSlug === a.gameSlug && a.gameSlug ? 1 : 0) - (x.gameSlug === a.gameSlug && a.gameSlug ? 1 : 0); }).slice(0, 3);
    var c = '<article class="wrap page article"><a class="crumb" href="' + base + 'news/index.html">' + t('backNews') + '</a>' +
      (a.category ? '<p class="cat">' + esc(a.category) + '</p>' : '') + '<h1>' + bi(a.title) + '</h1><p class="meta">' + biDate(a.date) + '</p>' +
      (cov ? '<img class="a-cover" src="' + esc(cov) + '" alt="' + esc(a.title.en) + '">' : '') +
      (a.excerpt && (a.excerpt.en || a.excerpt.ar) ? '<p class="lede">' + bi(a.excerpt) + '</p>' : '') +
      '<div class="prose en">' + body(en) + '</div><div class="prose ar">' + body(ar) + '</div></article>';
    if (more.length) c += '<section class="wrap page block"><h2>' + t('moreNews') + '</h2><div class="ngrid">' + more.map(function (x) { return newsCard(x, base); }).join('') + '</div></section>';
    c += '<p class="wrap back"><a class="btn btn--ghost" href="' + base + 'news/index.html">' + t('backNews') + '</a></p>';
    var desc = (a.excerpt && a.excerpt.en) || String(en).replace(/[#*_>`!\[\]()\-]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 155) || a.title.en;
    return layout({
      title: a.title.en + ' | ' + NAME, desc: desc, base: base, content: c, bodyClass: 'page-article', ogType: 'article',
      canonical: absUrl(ctx.siteUrl, 'news/' + a.slug + '/index.html'), ogImage: ctx.siteUrl && a.cover ? absUrl(ctx.siteUrl, a.cover) : ''
    });
  }
  function newsPage(pub, ctx) {
    var base = ctx.base || '';
    var c = '<section class="wrap page"><h1 class="page-title">' + t('newsTitle') + '</h1>' +
      (pub.articles.length ? '<div class="ngrid">' + pub.articles.map(function (a) { return newsCard(a, base); }).join('') + '</div>' : '<p class="empty">' + t('noNews') + '</p>') + '</section>';
    return layout({
      title: 'News & Articles | ' + NAME, desc: 'News and articles from ' + NAME + ', an independent Algerian game studio.', base: base, content: c, bodyClass: 'page-news',
      canonical: absUrl(ctx.siteUrl, 'news/index.html')
    });
  }

  function catalogPage(pub, ctx, kind) {
    var base = ctx.base || '', isMobile = kind === 'mobile';
    var games = (pub.games || []).filter(function (g) {
      return isMobile ? g.platform === 'Mobile' || g.platform === 'PC & Mobile' : g.platform === 'PC' || g.platform === 'PC & Mobile';
    });
    var title = isMobile ? ['Mobile Games', 'ألعاب الهاتف'] : ['PC Games', 'ألعاب الكمبيوتر'];
    var desc = isMobile ? ['Discover EONIX GAMES on mobile.', 'اكتشف ألعاب EONIX GAMES على الهاتف.'] : ['Discover EONIX GAMES on PC.', 'اكتشف ألعاب EONIX GAMES على الكمبيوتر.'];
    var empty = isMobile ? ['More Mobile Games Coming Soon', 'المزيد من ألعاب الهاتف قريبًا'] : ['More PC Games Coming Soon', 'المزيد من ألعاب الكمبيوتر قريبًا'];
    var content = '<section class="wrap page"><h1 class="page-title">' + pair(title) + '</h1><p class="sub">' + pair(desc) + '</p>' +
      (games.length ? '<div class="ggrid">' + games.map(function (g) { return gameCard(g, base); }).join('') + '</div>' : '<p class="empty">' + pair(empty) + '</p>') + '</section>';
    return layout({ title: title[0] + ' | ' + NAME, desc: desc[0], base: base, content: content, bodyClass: 'page-news', canonical: absUrl(ctx.siteUrl, (isMobile ? 'mobile-games' : 'pc-games') + '/index.html') });
  }
  function aboutPage(ctx) {
    var base = ctx.base || '';
    var content = '<section class="wrap page"><h1 class="page-title">' + pair(['About EONIX GAMES', 'من نحن']) + '</h1><div class="about-grid"><div><h2>' + pair(['Who We Are', 'من نحن']) + '</h2><p>' + pair(['EONIX GAMES is an independent Algerian game studio focused on creating engaging video games and memorable experiences for players worldwide.', 'إيونيكس غيمز استوديو ألعاب جزائري مستقل يركز على صناعة ألعاب ممتعة وتجارب لا تُنسى للاعبين حول العالم.']) + '</p></div><div class="values"><div><h3>' + pair(['Our Vision', 'رؤيتنا']) + '</h3><p>' + pair(['Algerian games for players everywhere.', 'ألعاب جزائرية للاعبين في كل مكان.']) + '</p></div><div><h3>' + pair(['Our Mission', 'مهمتنا']) + '</h3><p>' + pair(['Create engaging games and memorable experiences.', 'صناعة ألعاب ممتعة وتجارب لا تُنسى.']) + '</p></div></div></div></section>';
    return layout({ title: 'About | ' + NAME, desc: 'An independent Algerian game studio.', base: base, content: content, canonical: absUrl(ctx.siteUrl, 'about/index.html') });
  }

  /* ---------- Whole-site build (used by the admin export) ---------- */
  function normSiteUrl(u) { u = String(u || '').trim().replace(/\/+$/, ''); return /^https?:\/\//i.test(u) ? u : ''; }
  function buildFiles(state, opts) {
    var res = opts.res, siteUrl = normSiteUrl(opts.siteUrl), md = opts.md, files = [], warnings = [];
    var pub = buildPublicData(state, res);
    var listing = JSON.parse(JSON.stringify(pub));
    listing.articles.forEach(function (a) { delete a.body; });
    var json = JSON.stringify(listing, null, 2);
    files.push({ path: 'data/site-data.json', text: json });
    files.push({ path: 'data/site-data.js', text: 'window.EONIX_DATA = ' + json + ';\n' });
    var urls = [''];
    files.push({ path: 'news/index.html', text: newsPage(pub, { base: '../', siteUrl: siteUrl }) });
    urls.push('news/index.html');
    files.push({ path: 'mobile-games/index.html', text: catalogPage(pub, { base: '../', siteUrl: siteUrl }, 'mobile') });
    files.push({ path: 'pc-games/index.html', text: catalogPage(pub, { base: '../', siteUrl: siteUrl }, 'pc') });
    files.push({ path: 'about/index.html', text: aboutPage({ base: '../', siteUrl: siteUrl }) });
    urls.push('mobile-games/index.html', 'pc-games/index.html', 'about/index.html');
    pub.games.forEach(function (g) {
      files.push({ path: 'games/' + g.slug + '/index.html', text: gamePage(g, pub, { base: '../../', siteUrl: siteUrl }) });
      urls.push('games/' + g.slug + '/index.html');
    });
    pub.articles.forEach(function (a) {
      files.push({ path: 'news/' + a.slug + '/index.html', text: articlePage(a, pub, { base: '../../', siteUrl: siteUrl, md: md, res: res }) });
      urls.push('news/' + a.slug + '/index.html');
    });
    if (siteUrl) {
      files.push({ path: 'sitemap.xml', text: '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
        urls.map(function (u) { return '  <url><loc>' + esc(siteUrl + '/' + u) + '</loc></url>'; }).join('\n') + '\n</urlset>\n' });
    } else {
      warnings.push('No site URL set: sitemap.xml, canonical links and absolute social-image links were skipped.');
    }
    files.push({ path: 'robots.txt', text: 'User-agent: *\nAllow: /\n' + (siteUrl ? 'Sitemap: ' + siteUrl + '/sitemap.xml\n' : '') });
    files.push({ path: 'README.md', text: '# EONIX GAMES — Public Website\n\nUpload the contents of this folder to your static host. Keep the folder structure. This package contains published games and articles only.\n' });
    if (state.launch && state.launch.enabled && !pub.launch.enabled) warnings.push('Game Launch Mode is on but the selected game is unpublished or has no banner, so the standard Hero was exported.');
    return { files: files, warnings: warnings, pub: pub };
  }

  var api = {
    NAME: NAME, SLOGAN: SLOGAN, esc: esc, slugify: slugify, safeUrl: safeUrl, U: U, bi: bi, t: t,
    latestCard: latestCard, gameCard: gameCard, newsCard: newsCard, launchHero: launchHero, coverImg: coverImg,
    gamePage: gamePage, articlePage: articlePage, newsPage: newsPage, catalogPage: catalogPage, aboutPage: aboutPage, layout: layout, buildPublicData: buildPublicData,
    buildFiles: buildFiles, plainMd: plainMd, ytEmbed: ytEmbed, STATUS: STATUS, PLATFORM: PLATFORM
  };
  root.EonixGen = api;
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
})(typeof window !== 'undefined' ? window : globalThis);
