(function () {
  var ICONS = {
    home: '<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="9" rx="1.5"/><rect x="14" y="3" width="7" height="5" rx="1.5"/><rect x="14" y="12" width="7" height="9" rx="1.5"/><rect x="3" y="16" width="7" height="5" rx="1.5"/></svg>',
    map:  '<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11z"/><circle cx="12" cy="10" r="2.5"/></svg>',
    chart:'<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="20" x2="5" y2="12"/><line x1="12" y1="20" x2="12" y2="6"/><line x1="19" y1="20" x2="19" y2="15"/></svg>',
    help: '<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M9.5 9.2a2.5 2.5 0 1 1 3.5 2.3c-.9.5-1.5 1-1.5 2"/><circle cx="12" cy="16.6" r=".4" fill="currentColor" stroke="none"/></svg>',
    mail: '<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/></svg>',
    upload:'<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>'
  };

  function lang() { try { return localStorage.getItem('koeln50969_lang') || 'de'; } catch (e) { return 'de'; } }
  function t(de, en) { return lang() === 'en' ? en : de; }

  function item(href, icon, label, extra) {
    var path = location.pathname.replace(/index\.html$/, '');
    var cur = (href === path) ? ' current' : '';
    return '<a class="' + (extra || '') + cur + '" href="' + href + '"><span class="menu-icon">' + icon + '</span>' + label + '</a>';
  }

  function build(panel) {
    panel.innerHTML =
      '<div class="menu-sheet" role="dialog" aria-modal="true" aria-label="Navigation">' +
        '<div class="menu-top"><a class="brand" href="/">KÖLN <b>50969</b></a>' +
        '<button class="menu-close" id="menuCloseBtn" aria-label="' + t('Menü schließen', 'Close menu') + '">×</button></div>' +
        '<nav>' +
          item('/', ICONS.home, t('Galerie', 'Gallery')) +
          item('/karte.html', ICONS.map, t('Karte', 'Map')) +
          item('/statistik.html', ICONS.chart, t('Statistik', 'Stats')) +
          item('/faq.html', ICONS.help, 'FAQ') +
          item('/kontakt.html', ICONS.mail, t('Kontakt', 'Contact')) +
          item('/hochladen.html', ICONS.upload, t('Fund melden', 'Report a find'), 'menu-cta') +
        '</nav>' +
        '<h2>' + t('Rechtliches', 'Legal') + '</h2>' +
        '<nav class="menu-legal">' +
          '<a href="/impressum.html">Impressum</a>' +
          '<a href="/datenschutz.html">' + t('Datenschutz', 'Privacy') + '</a>' +
        '</nav>' +
        '<div class="menu-foot"><em>Zollywood überall.</em><br>Ein Sticker aus 50969 Köln-Zollstock.</div>' +
      '</div>';
    panel.querySelector('#menuCloseBtn').addEventListener('click', close);
  }

  var panel, lastFocus;
  function open() {
    lastFocus = document.activeElement;
    panel.classList.add('open');
    document.body.style.overflow = 'hidden';
    setTimeout(function () { var c = panel.querySelector('#menuCloseBtn'); if (c) c.focus(); }, 50);
  }
  function close() {
    panel.classList.remove('open');
    document.body.style.overflow = '';
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  document.addEventListener('DOMContentLoaded', function () {
    panel = document.createElement('div');
    panel.className = 'menu-panel';
    panel.id = 'menuPanel';
    build(panel);
    document.body.appendChild(panel);

    var openBtn = document.getElementById('menuOpenBtn');
    if (openBtn) openBtn.addEventListener('click', open);
    panel.addEventListener('click', function (e) { if (e.target === panel) close(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && panel.classList.contains('open')) close(); });
    document.addEventListener('langchange', function () { build(panel); });

    // FAB beim Runterscrollen ausblenden, beim Hochscrollen zeigen
    var fab = document.querySelector('.fab-float');
    if (fab) {
      var lastY = window.scrollY;
      window.addEventListener('scroll', function () {
        var y = window.scrollY;
        if (y > lastY + 8 && y > 300) fab.classList.add('hide');
        else if (y < lastY - 8) fab.classList.remove('hide');
        lastY = y;
      }, { passive: true });
    }
  });
})();
