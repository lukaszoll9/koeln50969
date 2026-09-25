// i18n.js — Sprachumschalter DE/EN (Button schaltet direkt um)
(function () {
  var STORAGE_KEY = 'koeln50969_lang';
  var stored = 'de';
  try { stored = localStorage.getItem(STORAGE_KEY) || 'de'; } catch (e) {}
  window._lang = stored;

  function applyLang(lang) {
    window._lang = lang;
    try { localStorage.setItem(STORAGE_KEY, lang); } catch (e) {}

    document.querySelectorAll('[data-de]').forEach(function (el) {
      el.textContent = lang === 'en' ? (el.dataset.en || el.dataset.de) : el.dataset.de;
    });
    document.documentElement.lang = lang;

    var btn = document.getElementById('langBtn');
    if (btn) {
      btn.textContent = lang === 'de' ? 'EN' : 'DE';
      btn.setAttribute('aria-label', lang === 'de' ? 'Switch to English' : 'Auf Deutsch umschalten');
    }
    document.dispatchEvent(new CustomEvent('langchange', { detail: lang }));
  }

  document.addEventListener('DOMContentLoaded', function () {
    applyLang(window._lang);
    var langBtn = document.getElementById('langBtn');
    if (langBtn) {
      langBtn.addEventListener('click', function () {
        applyLang(window._lang === 'de' ? 'en' : 'de');
      });
    }
  });
})();
