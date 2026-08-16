(function () {
  var ICONS = {
    home: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 11l9-8 9 8"/><path d="M5 10v10h14V10"/></svg>',
    map: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11z"/><circle cx="12" cy="10" r="2.5"/></svg>',
    chart: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="20" x2="5" y2="12"/><line x1="12" y1="20" x2="12" y2="6"/><line x1="19" y1="20" x2="19" y2="15"/></svg>',
    help: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M9.5 9.2a2.5 2.5 0 1 1 3.5 2.3c-.9.5-1.5 1-1.5 2"/><circle cx="12" cy="16.6" r=".4" fill="currentColor" stroke="none"/></svg>',
    mail: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/></svg>'
  };

  function item(href, icon, label) {
    return '<a href="' + href + '"><span class="menu-icon">' + icon + '</span>' + label + '</a>';
  }

  document.addEventListener('DOMContentLoaded', function () {
    var panel = document.createElement('div');
    panel.className = 'menu-panel';
    panel.id = 'menuPanel';
    panel.innerHTML =
      '<div class="menu-sheet">' +
        '<button class="menu-close" id="menuCloseBtn" aria-label="Schließen">×</button>' +
        '<h2>Kategorien</h2>' +
        '<nav>' +
          item('/', ICONS.home, 'Galerie') +
          item('/karte.html', ICONS.map, 'Karte') +
          item('/statistik.html', ICONS.chart, 'Statistik') +
          item('/faq.html', ICONS.help, 'FAQ') +
          item('/kontakt.html', ICONS.mail, 'Kontakt') +
          '<a href="/impressum.html">Impressum</a>' +
          '<a href="/datenschutz.html">Datenschutz</a>' +
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
