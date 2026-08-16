(function () {
  document.addEventListener('DOMContentLoaded', function () {
    var panel = document.createElement('div');
    panel.className = 'menu-panel';
    panel.id = 'menuPanel';
    panel.innerHTML =
      '<div class="menu-sheet">' +
        '<button class="menu-close" id="menuCloseBtn" aria-label="Schließen">×</button>' +
        '<h2>Kategorien</h2>' +
        '<nav>' +
          '<a href="/">🏠 Galerie</a>' +
          '<a href="/karte.html">🗺️ Karte</a>' +
          '<a href="/statistik.html">📊 Statistik</a>' +
          '<a href="/faq.html">❓ FAQ</a>' +
          '<a href="/kontakt.html">✉️ Kontakt</a>' +
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
