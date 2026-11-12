(function () {
  'use strict';
  var G = window.EonixGen, D = window.EONIX_DATA || { games: [], articles: [], launch: {} };
  var root = document.documentElement;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  /* language */
  function setLang(l) {
    root.lang = l; root.dir = l === 'ar' ? 'rtl' : 'ltr';
    try { localStorage.setItem('eonix-lang', l); } catch (e) { }
  }
  var lb = $('#langBtn');
  if (lb) lb.addEventListener('click', function () { setLang(root.lang === 'ar' ? 'en' : 'ar'); });

  /* menu + header */
  var nav = $('#nav'), burger = $('#burger'), header = $('.site-header');
  if (burger) burger.addEventListener('click', function () {
    var o = nav.classList.toggle('open'); burger.setAttribute('aria-expanded', o);
  });
  if (nav) nav.addEventListener('click', function (e) { if (e.target.closest('a')) { nav.classList.remove('open'); burger.setAttribute('aria-expanded', 'false'); } });
  function onScroll() { if (header) header.classList.toggle('solid', window.scrollY > 40); }
  window.addEventListener('scroll', onScroll, { passive: true }); onScroll();

  /* home rendering */
  var latest = $('#latest-covers');
  if (latest && G) {
    var games = D.games || [];
    var feat = games.filter(function (g) { return g.published !== false && g.featured; }).slice(0, 3);
    latest.innerHTML = feat.length ? feat.map(function (g) { return G.latestCard(g, ''); }).join('') : '<p class="empty">' + G.t('tba') + '</p>';

    function fill(sel, list, opts) {
      var el = $(sel);
      el.innerHTML = list.length ? list.map(function (g) { return G.gameCard(g, '', opts); }).join('') :
        '<p class="empty">' + G.t('tba') + '</p>';
    }
    fill('#pc-grid', games.filter(function (g) { return g.platform === 'PC' || g.platform === 'PC & Mobile'; }));
    fill('#mobile-grid', games.filter(function (g) { return g.platform === 'Mobile' || g.platform === 'PC & Mobile'; }), { mobileStores: true });

    var arts = (D.articles || []).slice(0, 3);
    $('#news-grid').innerHTML = arts.length ? arts.map(function (a) { return G.newsCard(a, ''); }).join('') : '<p class="empty">' + G.t('noNews') + '</p>';

    var shots = [];
    games.forEach(function (g) { (g.shots || []).forEach(function (s) { shots.push({ src: s, alt: g.title.en }); }); });
    var gal = $('#gallery');
    gal.innerHTML = shots.length ? shots.map(function (s, i) {
      return '<img data-lightbox src="' + G.esc(s.src) + '" alt="' + G.esc(s.alt) + ' screenshot ' + (i + 1) + '" loading="lazy">';
    }).join('') : '<p class="empty">' + G.t('tba') + '</p>';

    /* launch hero */
    var L = D.launch || {}, lh = $('#launch-hero');
    var game = games.filter(function (g) { return g.slug === L.gameSlug; })[0];
    if (L.enabled && game && L.image && lh) { lh.innerHTML = G.launchHero(L, ''); root.classList.add('launch-on'); }
    else root.classList.remove('launch-on');
  }

  /* scroll reveal */
  var rv = $$('.rv');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }); }, { threshold: .12 });
    rv.forEach(function (n) { io.observe(n); });
  } else rv.forEach(function (n) { n.classList.add('in'); });

  /* active section indicator */
  var map = {};
  $$('#nav a[data-nav]').forEach(function (a) { map[a.getAttribute('data-nav')] = a; });
  if (document.body.classList.contains('page-news') && map.news) map.news.classList.add('active');
  if (location.pathname.indexOf('/mobile-games/') >= 0 && map.mobile) map.mobile.classList.add('active');
  if (location.pathname.indexOf('/pc-games/') >= 0 && map.pc) map.pc.classList.add('active');
  if (location.pathname.indexOf('/about/') >= 0 && map.about) map.about.classList.add('active');
  var secs = $$('section[data-section]');
  if (secs.length && 'IntersectionObserver' in window) {
    var so = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (e.isIntersecting) {
          var k = e.target.getAttribute('data-section');
          Object.keys(map).forEach(function (x) { map[x].classList.toggle('active', x === k); });
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    secs.forEach(function (s) { so.observe(s); });
  }

  /* lightbox */
  document.addEventListener('click', function (e) {
    var img = e.target.closest && e.target.closest('img[data-lightbox]');
    if (!img) return;
    var all = $$('img[data-lightbox]', img.parentNode), i = all.indexOf(img);
    var box = document.createElement('div'); box.className = 'lightbox'; box.setAttribute('role', 'dialog'); box.setAttribute('aria-modal', 'true');
    box.innerHTML = '<img alt=""><button class="x" aria-label="Close">\u2715</button>' + (all.length > 1 ? '<button class="p" aria-label="Previous">\u2039</button><button class="n" aria-label="Next">\u203A</button>' : '');
    function show() { var im = $('img', box); im.src = all[i].src; im.alt = all[i].alt; }
    function close() { box.remove(); document.removeEventListener('keydown', key); }
    function key(ev) { if (ev.key === 'Escape') close(); if (ev.key === 'ArrowRight') { i = (i + 1) % all.length; show(); } if (ev.key === 'ArrowLeft') { i = (i - 1 + all.length) % all.length; show(); } }
    box.addEventListener('click', function (ev) {
      var c = ev.target.className;
      if (ev.target === box || c === 'x') close();
      if (c === 'n') { i = (i + 1) % all.length; show(); }
      if (c === 'p') { i = (i - 1 + all.length) % all.length; show(); }
    });
    document.addEventListener('keydown', key); document.body.appendChild(box); show(); $('.x', box).focus();
  });
})();
