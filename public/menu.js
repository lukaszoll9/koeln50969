(function () {
  var ICONS = {
    home: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 11l9-8 9 8"/><path d="M5 10v10h14V10"/></svg>',
    map:  '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11z"/><circle cx="12" cy="10" r="2.5"/></svg>',
    chart:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="20" x2="5" y2="12"/><line x1="12" y1="20" x2="12" y2="6"/><line x1="19" y1="20" x2="19" y2="15"/></svg>',
    help: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M9.5 9.2a2.5 2.5 0 1 1 3.5 2.3c-.9.5-1.5 1-1.5 2"/><circle cx="12" cy="16.6" r=".4" fill="currentColor" stroke="none"/></svg>',
    mail: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/></svg>',
    upload:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>'
  };

  function item(href, icon, label) {
    return '<a href="' + href + '"><span class="menu-icon">' + icon + '</span>' + label + '</a>';
  }

  function labelDE(de, en) {
    var lang = localStorage.getItem('koeln50969_lang') || 'de';
    return lang === 'en' ? en : de;
  }

  document.addEventListener('DOMContentLoaded', function () {
    var panel = document.createElement('div');
    panel.className = 'menu-panel';
    panel.id = 'menuPanel';
    panel.innerHTML =
      '<div class="menu-sheet">' +
        '<button class="menu-close" id="menuCloseBtn" aria-label="Schließen">×</button>' +
        '<h2>' + labelDE('Navigation','Navigation') + '</h2>' +
        '<nav>' +
          item('/', ICONS.home, labelDE('Galerie','Gallery')) +
          item('/karte.html', ICONS.map, labelDE('Karte','Map')) +
          item('/statistik.html', ICONS.chart, labelDE('Statistik','Stats')) +
          item('/faq.html', ICONS.help, 'FAQ') +
          item('/kontakt.html', ICONS.mail, labelDE('Kontakt','Contact')) +
        '</nav>' +
        '<h2>' + labelDE('Mitmachen','Participate') + '</h2>' +
        '<nav>' +
          item('/hochladen.html', ICONS.upload, labelDE('Sticker hochladen','Upload sticker')) +
        '</nav>' +
        '<h2>' + labelDE('Rechtliches','Legal') + '</h2>' +
        '<nav>' +
          '<a href="/impressum.html">Impressum</a>' +
          '<a href="/datenschutz.html">' + labelDE('Datenschutz','Privacy') + '</a>' +
        '</nav>' +
      '</div>';
    document.body.appendChild(panel);

    var openBtn = document.getElementById('menuOpenBtn');
    var closeBtn = document.getElementById('menuCloseBtn');
    if (openBtn) openBtn.addEventListener('click', function () { panel.classList.add('open'); });
    closeBtn.addEventListener('click', function () { panel.classList.remove('open'); });
    panel.addEventListener('click', function (e) { if (e.target === panel) panel.classList.remove('open'); });
  });
})();
