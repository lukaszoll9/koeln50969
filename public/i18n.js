// i18n.js — Sprachumschalter DE/EN
(function () {
  var STORAGE_KEY = 'koeln50969_lang';
  window._lang = localStorage.getItem(STORAGE_KEY) || 'de';

  function applyLang(lang) {
    window._lang = lang;
    localStorage.setItem(STORAGE_KEY, lang);

    // Alle Elemente mit data-de / data-en
    document.querySelectorAll('[data-de]').forEach(function (el) {
      el.textContent = lang === 'en' ? (el.dataset.en || el.dataset.de) : el.dataset.de;
    });

    // html lang-Attribut
    document.getElementById('html-root') && (document.getElementById('html-root').lang = lang);

    // Lang-Button aktualisieren
    var btn = document.getElementById('langBtn');
    if (btn) btn.textContent = lang === 'de' ? 'EN' : 'DE';

    // Aktiver Zustand im Popup
    document.querySelectorAll('.lang-option').forEach(function (b) {
      b.classList.toggle('active', b.dataset.lang === lang);
    });

    // Event für andere Skripte
    document.dispatchEvent(new CustomEvent('langchange', { detail: lang }));
  }

  document.addEventListener('DOMContentLoaded', function () {
    applyLang(window._lang);

    var langBtn = document.getElementById('langBtn');
    var langPopup = document.getElementById('langPopup');
    if (langBtn && langPopup) {
      langBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        langPopup.hidden = !langPopup.hidden;
      });
      document.addEventListener('click', function () { langPopup.hidden = true; });
      langPopup.querySelectorAll('.lang-option').forEach(function (b) {
        b.addEventListener('click', function () {
          applyLang(b.dataset.lang);
          langPopup.hidden = true;
        });
      });
    }
  });
})();
