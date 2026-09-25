// common.js — gemeinsame Helfer für alle Seiten von koeln50969.de
(function () {
  var HOME = { lat: 50.9053, lng: 6.9374 }; // Köln-Zollstock (Zollywood Tower)

  function escapeHtml(s) {
    var d = document.createElement('div');
    d.textContent = s == null ? '' : String(s);
    return d.innerHTML;
  }

  // Nicht-lateinische Teile (z. B. Thai) ausblenden: „เขตคลองเตย, Bangkok, Thailand“ -> „Bangkok, Thailand“
  var NON_LATIN = /[^\u0000-ɏḀ-ỿ -⁯\s]/;
  function prettyLoc(text) {
    if (!text) return '';
    var parts = String(text).split(',').map(function (s) { return s.trim(); }).filter(Boolean);
    var latin = parts.filter(function (p) { return !NON_LATIN.test(p); });
    var out = (latin.length ? latin : parts).join(', ');
    return out.charAt(0).toUpperCase() + out.slice(1);
  }

  function distKm(lat, lng) {
    if (typeof lat !== 'number' || typeof lng !== 'number') return null;
    var R = 6371, rad = Math.PI / 180;
    var dLat = (lat - HOME.lat) * rad, dLng = (lng - HOME.lng) * rad;
    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(HOME.lat * rad) * Math.cos(lat * rad) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
    return Math.round(R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
  }

  function fmtKm(km) {
    if (km == null) return '';
    return (km < 1 ? '< 1' : km.toLocaleString('de-DE')) + ' km';
  }

  // Land bestimmen: letzter Teil des Ortstexts (bei Funden außerhalb DE hängt der Upload das Land an),
  // sonst grob über Koordinaten.
  var COUNTRIES = ['Thailand','Österreich','Schweiz','Niederlande','Belgien','Frankreich','Spanien','Italien','Portugal','Dänemark','Schweden','Norwegen','Finnland','Polen','Tschechien','Ungarn','Kroatien','Griechenland','Türkei','Vereinigtes Königreich','Irland','Luxemburg','Vereinigte Staaten','USA','Kanada','Mexiko','Brasilien','Argentinien','Japan','China','Südkorea','Vietnam','Kambodscha','Laos','Malaysia','Singapur','Indonesien','Philippinen','Indien','Australien','Neuseeland','Südafrika','Ägypten','Marokko','Island','Slowenien','Slowakei','Rumänien','Bulgarien','Serbien','Albanien','Montenegro','Estland','Lettland','Litauen','Malta','Zypern','Israel','Vereinigte Arabische Emirate','Myanmar','Sri Lanka','Nepal'];
  function countryOf(p) {
    var t = p.locationText || '';
    var last = t.split(',').pop().trim();
    if (COUNTRIES.indexOf(last) !== -1) return last;
    if (typeof p.lat === 'number' && typeof p.lng === 'number') {
      if (p.lat > 47.2 && p.lat < 55.1 && p.lng > 5.8 && p.lng < 15.1) return 'Deutschland';
      return 'geo:' + Math.round(p.lat / 8) + '_' + Math.round(p.lng / 8);
    }
    return t ? 'Deutschland' : null;
  }
  function countCountries(posts) {
    var set = {};
    posts.forEach(function (p) { var c = countryOf(p); if (c) set[c] = 1; });
    return Math.max(1, Object.keys(set).length);
  }

  // Bilder über das Netlify Image CDN verkleinern (WebP). Fällt bei Fehler aufs Original zurück.
  function cdn(src, w) {
    if (!src) return '';
    if (location.hostname === 'localhost' || location.hostname === '127.0.0.1') return src;
    return '/.netlify/images?url=' + encodeURIComponent(src) + '&w=' + w + '&q=74&fm=webp';
  }
  function imgTag(im, opts) {
    opts = opts || {};
    var src = im.full || im.thumb;
    var w = opts.w || 480;
    var srcset = cdn(src, w) + ' ' + w + 'w, ' + cdn(src, w * 2) + ' ' + (w * 2) + 'w';
    if (location.hostname === 'localhost' || location.hostname === '127.0.0.1') srcset = '';
    return '<img src="' + cdn(src, w) + '"' + (srcset ? ' srcset="' + srcset + '" sizes="' + (opts.sizes || '(min-width:1000px) 280px, (min-width:640px) 33vw, 50vw') + '"' : '') +
      ' alt="' + escapeHtml(opts.alt || 'Sticker-Fund') + '" loading="' + (opts.eager ? 'eager' : 'lazy') + '" decoding="async"' +
      (opts.eager ? ' fetchpriority="high"' : '') +
      ' data-fallback="' + escapeHtml(im.thumb) + '" onload="this.classList.add(\'loaded\')" onerror="K.imgFail(this)">';
  }
  function imgFail(img) {
    var fb = img.getAttribute('data-fallback');
    if (fb && img.getAttribute('src') !== fb) { img.removeAttribute('srcset'); img.src = fb; }
    else img.classList.add('loaded');
  }

  function lang() { try { return localStorage.getItem('koeln50969_lang') || 'de'; } catch (e) { return 'de'; } }

  function fmtDate(iso) {
    return new Date(iso).toLocaleDateString(lang() === 'en' ? 'en-GB' : 'de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' });
  }
  function relTime(iso) {
    var en = lang() === 'en';
    var diff = Date.now() - new Date(iso).getTime();
    var h = Math.floor(diff / 3600000), d = Math.floor(h / 24);
    if (h < 1) return en ? 'just now' : 'gerade eben';
    if (h < 24) return en ? h + ' h ago' : 'vor ' + h + ' Std.';
    if (d === 1) return en ? 'yesterday' : 'gestern';
    if (d < 30) return en ? d + ' days ago' : 'vor ' + d + ' Tagen';
    return fmtDate(iso);
  }

  function countUp(el, to, ms) {
    if (!el) return;
    var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce || to < 5) { el.textContent = to.toLocaleString('de-DE'); return; }
    var t0 = performance.now();
    (function tick(t) {
      var k = Math.min(1, (t - t0) / (ms || 900));
      var e = 1 - Math.pow(1 - k, 3);
      el.textContent = Math.round(to * e).toLocaleString('de-DE');
      if (k < 1) requestAnimationFrame(tick);
    })(t0);
  }

  // Elemente beim Reinscrollen sanft einblenden
  var io = ('IntersectionObserver' in window) ? new IntersectionObserver(function (entries) {
    entries.forEach(function (en) { if (en.isIntersecting) { var n = en.target; n.classList.add('in'); io.unobserve(n); setTimeout(function () { n.classList.remove('reveal', 'in'); n.style.transitionDelay = ''; }, 900); } });
  }, { rootMargin: '0px 0px -8% 0px' }) : null;
  function reveal(nodes) {
    if (!io || (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches)) return;
    Array.prototype.forEach.call(nodes, function (n, i) {
      var r = n.getBoundingClientRect();
      if (r.top < innerHeight) return; // sichtbare Elemente nicht verstecken
      n.classList.add('reveal');
      n.style.transitionDelay = ((i % 4) * 50) + 'ms';
      io.observe(n);
    });
  }

  window.K = {
    HOME: HOME, escapeHtml: escapeHtml, prettyLoc: prettyLoc, distKm: distKm, fmtKm: fmtKm,
    countryOf: countryOf, countCountries: countCountries, cdn: cdn, imgTag: imgTag, imgFail: imgFail,
    fmtDate: fmtDate, relTime: relTime, countUp: countUp, reveal: reveal, lang: lang
  };
})();
