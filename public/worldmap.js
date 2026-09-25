// worldmap.js — Punkt-Weltkarte mit Reiserouten ab Köln-Zollstock (ohne externe Kacheln)
(function () {
  var MASK = { cols: 240, rows: 89, step: 1.5, lat0: 78, b64: 'AAAAAAA3kPsP/////w8AAM4AAAAwAAD4AAAAAAAAAAAAAMD/f/8HjP///w8AAAAAAMAfAPj/DwD4BQAAAAAAAOA3YP8HAPz//wcAAAAAAPAAAP//DwBgAAAAAAAAAPD/8/c/APj//wMAAAAAADjA/f///z/gAwAA/v//////////////////////////////////////APj/z//838//B/j//wEAAPA/AID3//////////99/gMAAAD4/2H++D8A/P///w8A/r8gCwAAAAAAAAAA+B8AAAAAAID/yB8A/v///wPA+ADAAQAAAAAAAAAA9/////////////////////////////////////9/QPD//////9+TH+AfAB4A4P////////////////9/AP7//////wf1HsAPAAAA+M//////////////////AP7//////wHwAwAPAAAA+M////////////////gHAPAL+P///wHwMwAAAAAA+J//////////////fzwAAMAH4P///wfwfwAAAAB40Nf///////////8/AB8AAHAAwP///z/g/wAAAABw4Mf///////////8PAB8AAAwAgP/////5/wMAAAD84Pn///////////8PAA8AAAAAgP7////7/wcAAADu+f//////////////AAcAAAAAAPz//////wcAAADm/f//////////////AAMAAAAAAPj//////wYAAABg//////////////+/AAAAAAAAAPD/////Hx4AAADg////////////////AAAAAAAAAOD/////HxwAAADA///////////////fAAAAAAAAAOD//////wAAAACA///v//n///////9PAAAAAAAAAOD/////NwAAAACA//1H/vz////////HAQAAAAAAAOD/////AQAAAAD8w/sH+Pz////////jAQAAAAAAAOD/////AQAAAAD8Y+////n//////38gAAAAAAAAAOD///9/AAAAAAD8YOz+//n//////z5gAAAAAAAAAMD///8/AAAAAAD8AMf///H/////fzgwAAAAAAAAAMD///8/AAAAAAB8fsL8/////////3M4AAAAAAAAAID///8/AAAAAADw/wBB/////////zA/AAAAAAAAAAD///8PAAAAAAD4/wCA/////////8EHAAAAAAAAAAD8//8HAAAAAAD8/+OB/////////8EAAAAAAAAAAAD8//8DAAAAAAD+/////////////wEAAAAAAAAAAAD4/x0DAAAAAAD+//////z//////wMAAAAAAAAAAADY/wAGAAAAAID///////3//////wEAAAAAAAAAAACgfwAGAAAAAMD///9///P//////wAAAAAAAAAAAABgfwAAAAAAAMD//////jfw////fwEAAAAAAAAAAABAfgAHAAAAAOD//////P/g////PwEAAAAAAAAAAAAAfiAdAAAAAOD//////f/A////DwAAAAAAAAABAAAA/jiwAAAAAOD//////X8A/8N/AgAAAAAAAAAAAAAA/D2QCwAAAOD/////+T8A/8F/AwEAAAAAAAAAAAAA8B8AAAAAAOD/////8x8AfoD/AAMAAAAAAAAAAAAAgP8AAAAAAOD/////9wcAPoD+AQEAAAAAAAAAAAAAAPwBAAAAAPD//////wEAPgD+AQcAAAAAAAAAAAAAAOABAAAAAOD/////PwAAPAD+AQcAAAAAAAAAAAAAAMDABwAAAOD/////nwMAHAD2AQ4AAAAAAAAAAAAAAIDp/wAAAID//////wMAOABGAA4AAAAAAAAAAAAAAAD//wEAAID//////wMAaAAGABwAAAAAAAAAAAAAAADw/wMAAAD//////wEAYAAMYAwAAAAAAAAAAAAAAADw/x8AAAD++P///wEAAIAZcAAAAAAAAAAAAAAAAADw/z8AAAAAwP///wAAAAAbeAAAAAAAAAAAAAAAAAD4/38AAAAAwP//fwAAAAA+fCAAAAAAAAAAAAAAAAD4/38AAAAAwP//HwAAAAA8fycAAAAAAAAAAAAAAAj8//8BAAAAwP//DwAAAAA8voMBAAAAAAAAAAAAAAD8//8PAAAAwP//DwAAAAB4vgM/AAAAAAAAAAAAAAD8//9/AAAAgP//BwAAAABwsHP/IQAAAAAAAAAAAAD8////AQAAAP//AwAAAABggAL4OwAAAAAAAAAAAAD8////AQAAAP//AwAAAADADwDwhwAAAAAAAAAAAAD4////AQAAAP7/BwAAAAAA/hvwBgEAAAAAAAAAAADw////AAAAAP7/BwAAAAAAAAwAHAwAAAAAAAAAAADw//9/AAAAAP7/BwAAAAAAAIBBAAAAAAAAAAAAAADg//9/AAAAAP//BwEAAAAAAIDHAAAAAAAAAAAAAADg//8/AAAAAP//BwMAAAAAAPDHAQAAAAAAAAAAAADA//8/AAAAAP//xwMAAAAAAPjPAYAAAAAAAAAAAAAA//8/AAAAgP//4wEAAAAAAP7/AwDAAAAAAAAAAAAA/v8/AAAAAP//4AEAAAAAAP7/AwAAAAAAAAAAAAAA/v8fAAAAAP//4AEAAAAAwP//BwAAAAAAAAAAAAAA/v8fAAAAAP7/4AAAAAAA8P//D0AAAAAAAAAAAAAA/v8PAAAAAP7/4AAAAAAA8P//HwAAAAAAAAAAAAAA/v8BAAAAAPz/4AAAAAAA+P//PwAAAAAAAAAAAAAA/v8AAAAAAPw/AAAAAAAA+P//PwAAAAAAAAAAAAAA//8AAAAAAPw/AAAAAAAA8P//fwAAAAAAAAAAAAAA/38AAAAAAPgfAAAAAAAA8P//fwAAAAAAAAAAAAAA/38AAAAAAPgfAAAAAAAA4P//PwAAAAAAAAAAAAAA/z8AAAAAAPAPAAAAAAAA4D//PwAAAAAAAAAAAAAA/x8AAAAAAPADAAAAAAAA4Af8HwAAAAAAAAAAAACA/wMAAAAAAAAAAAAAAAAAQAD4HwAIAAAAAAAAAACA/wMAAAAAAAAAAAAAAAAAAADgDwAQAAAAAAAAAACA/wMAAAAAAAAAAAAAAAAAAADABwBwAAAAAAAAAACAfwAAAAAAAAAAAAAAAAAAAAAAAAAwAAAAAAAAAADAPwAAAAAAAAAAAAAAAAAAAAAABwA8AAAAAAAAAADAPwAAAAAAAAAAAAAAAAAAAAAABgAMAAAAAAAAAADAHwAAAAAAAAAAAAAAAAAAAAAAAAAHAAAAAAAAAADABwAAAAAAAAAAAAAAAAAAAAAAAIADAAAAAAAAAADADwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADgDwAAAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAADABwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADAgwEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADABwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADwCAAAAAAAAAAAAAAAAAAAAAAAAA' };
  var bits = null;
  function land(c, r) {
    if (!bits) { var s = atob(MASK.b64); bits = new Uint8Array(s.length); for (var i = 0; i < s.length; i++) bits[i] = s.charCodeAt(i); }
    var k = r * MASK.cols + c; return (bits[k >> 3] >> (k & 7)) & 1;
  }

  // opts: { home:{lat,lng}, color, dot, arc, bbox:[lngMin, latMax, lngMax, latMin], animate, onClick }
  function drawWorld(canvas, points, opts) {
    opts = opts || {};
    var home = opts.home || (window.K && K.HOME) || { lat: 50.9053, lng: 6.9374 };
    var bb = opts.bbox || [-180, MASK.lat0, 180, MASK.lat0 - MASK.rows * MASK.step];
    var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
    var dpr = Math.min(2, window.devicePixelRatio || 1);
    var ctx = canvas.getContext('2d');
    var W, H, raf, t0 = null, hover = -1;

    function X(lng) { return (lng - bb[0]) / (bb[2] - bb[0]) * W; }
    function Y(lat) { return (bb[1] - lat) / (bb[1] - bb[3]) * H; }

    // Ziele zu Regionen zusammenfassen (~1 Grad), damit es nicht zu viele Linien werden
    var grid = opts.cluster || 1.2, maxLines = opts.maxLines || 10;
    var dest = [], seen = {};
    points.forEach(function (p) {
      if (typeof p.lat !== 'number' || typeof p.lng !== 'number') return;
      var km = window.K ? K.distKm(p.lat, p.lng) : 999;
      if (km < (opts.minKm == null ? 60 : opts.minKm)) return; // Köln selbst: keine Linie
      var key = Math.round(p.lat / grid) + ',' + Math.round(p.lng / grid);
      if (seen[key]) { seen[key].n++; return; }
      var name = window.K ? K.prettyLoc(p.locationText).split(',')[0] : '';
      if (window.K && /Thailand|Deutschland/.test(name) && K.prettyLoc(p.locationText).indexOf(',') === -1) name = '';
      seen[key] = { lat: p.lat, lng: p.lng, n: 1, post: p, km: km, name: name };
      dest.push(seen[key]);
    });
    // wichtigste Ziele behalten (viele Funde, weite Reise), dann weiteste zuletzt zeichnen
    dest.sort(function (a, b) { return (b.n * 2 + b.km / 2000) - (a.n * 2 + a.km / 2000); });
    dest = dest.slice(0, maxLines);
    dest.sort(function (a, b) { return a.km - b.km; });

    var bg = null;
    // Kartenausschnitt automatisch auf die Reise zuschneiden (Seitenverhältnis des Canvas)
    function fitBox() {
      var lngs = [home.lng], lats = [home.lat];
      dest.forEach(function (d) { lngs.push(d.lng); lats.push(d.lat); });
      var x0 = Math.min.apply(null, lngs), x1 = Math.max.apply(null, lngs);
      var y0 = Math.min.apply(null, lats), y1 = Math.max.apply(null, lats);
      var w = Math.max(50, (x1 - x0) * 1.35), h = Math.max(20, (y1 - y0) * 1.5);
      var ar = W / H;
      if (w / h > ar) h = w / ar; else w = h * ar;
      if (w > 360) { w = 360; h = w / ar; }
      var cx = (x0 + x1) / 2, cy = (y0 + y1) / 2 + h * 0.08;
      cx = Math.max(-180 + w / 2, Math.min(180 - w / 2, cx));
      bb = [cx - w / 2, cy + h / 2, cx + w / 2, cy - h / 2];
    }
    function size() {
      var rect = canvas.getBoundingClientRect();
      W = rect.width; H = rect.height;
      if (!W || !H) { bg = null; return; }
      if (opts.fit && dest.length) fitBox();
      canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      // Land-Punkte einmal vorrendern
      bg = document.createElement('canvas');
      bg.width = canvas.width; bg.height = canvas.height;
      var g = bg.getContext('2d'); g.setTransform(dpr, 0, 0, dpr, 0, 0);
      var cell = W / ((bb[2] - bb[0]) / MASK.step);
      var r = Math.min(2.4, Math.max(0.6, cell * 0.26));
      g.fillStyle = opts.dot || 'rgba(255,255,255,0.22)';
      var c0 = Math.max(0, Math.floor((bb[0] + 180) / MASK.step)), c1 = Math.min(MASK.cols, Math.ceil((bb[2] + 180) / MASK.step));
      var r0 = Math.max(0, Math.floor((MASK.lat0 - bb[1]) / MASK.step)), r1 = Math.min(MASK.rows, Math.ceil((MASK.lat0 - bb[3]) / MASK.step));
      for (var row = r0; row < r1; row++) for (var col = c0; col < c1; col++) {
        if (!land(col, row)) continue;
        var lng = -180 + (col + 0.5) * MASK.step, lat = MASK.lat0 - (row + 0.5) * MASK.step;
        g.beginPath(); g.arc(X(lng), Y(lat), r, 0, 6.2832); g.fill();
      }
    }

    function ctrl(a, b) {
      var mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2;
      var dx = b.x - a.x, dy = b.y - a.y, len = Math.sqrt(dx * dx + dy * dy);
      var lift = Math.min(len * 0.35, H * 0.45);
      return { x: mx + (dy / (len || 1)) * lift * 0.2, y: my - lift };
    }

    function frame(ts) {
      if (!canvas.isConnected) { cancelAnimationFrame(raf); if (ro) ro.disconnect(); return; }
      if (!W || !H) return;
      if (t0 === null) t0 = ts;
      var t = reduce || !opts.animate ? 1e9 : ts - t0;
      ctx.clearRect(0, 0, W, H);

      if (bg && bg.width && bg.height) ctx.drawImage(bg, 0, 0, W, H);

      var hx = X(home.lng), hy = Y(home.lat);
      var color = opts.arc || '#e1141c';
      dest.forEach(function (d, i) {
        var a = { x: hx, y: hy }, b = { x: X(d.lng), y: Y(d.lat) }, c = ctrl(a, b);
        var start = i * 140, dur = 1100;
        var k = Math.max(0, Math.min(1, (t - start) / dur));
        if (k <= 0) return;
        var e = 1 - Math.pow(1 - k, 3);
        // Bogen bis e zeichnen
        ctx.beginPath(); ctx.moveTo(a.x, a.y);
        var steps = 40, n = Math.max(1, Math.round(steps * e));
        for (var s = 1; s <= n; s++) {
          var u = s / steps, iu = 1 - u;
          ctx.lineTo(iu * iu * a.x + 2 * iu * u * c.x + u * u * b.x, iu * iu * a.y + 2 * iu * u * c.y + u * u * b.y);
        }
        ctx.strokeStyle = color; ctx.globalAlpha = i === hover ? 1 : 0.75; ctx.lineWidth = i === hover ? 2 : 1.3;
        ctx.stroke(); ctx.globalAlpha = 1;
        if (k >= 1) {
          var pulse = reduce ? 0 : ((t - start - dur) / 1600) % 1;
          ctx.beginPath(); ctx.arc(b.x, b.y, 3 + pulse * 10, 0, 6.2832);
          ctx.strokeStyle = 'rgba(225,20,28,' + (0.6 * (1 - pulse)) + ')'; ctx.lineWidth = 1.5; ctx.stroke();
          ctx.beginPath(); ctx.arc(b.x, b.y, i === hover ? 5 : 3.2, 0, 6.2832); ctx.fillStyle = '#fff'; ctx.fill();
          ctx.beginPath(); ctx.arc(b.x, b.y, i === hover ? 3 : 1.8, 0, 6.2832); ctx.fillStyle = color; ctx.fill();
        }
      });
      // Ortsnamen an den wichtigsten Zielen
      if (opts.labels) {
        ctx.font = '600 11px "Archivo", sans-serif'; ctx.textAlign = 'left';
        var placed = [];
        dest.slice().sort(function (a, b) { return b.n - a.n || b.km - a.km; }).slice(0, opts.labels).forEach(function (d) {
          var i = dest.indexOf(d), start = i * 140 + 1100;
          if (t < start || !d.name) return;
          if (Math.abs(X(d.lng) - X(home.lng)) < 60 && Math.abs(Y(d.lat) - Y(home.lat)) < 24) return;
          var x = X(d.lng) + 8, y = Y(d.lat) + 4, w = ctx.measureText(d.name).width + 10;
          if (x + w > W) x = X(d.lng) - w - 6;
          if (placed.some(function (q) { return Math.abs(q.x - x) < w && Math.abs(q.y - y) < 16; })) return;
          placed.push({ x: x, y: y });
          ctx.fillStyle = 'rgba(22,19,15,0.75)';
          ctx.fillRect(x - 4, y - 11, w, 16);
          ctx.fillStyle = '#fff'; ctx.fillText(d.name + (d.n > 1 ? ' ×' + d.n : ''), x + 1, y + 1);
        });
      }

      // Heimat Zollstock
      ctx.beginPath(); ctx.arc(hx, hy, 5.5, 0, 6.2832); ctx.fillStyle = color; ctx.fill();
      ctx.beginPath(); ctx.arc(hx, hy, 2.2, 0, 6.2832); ctx.fillStyle = '#fff'; ctx.fill();
      if (opts.homeLabel !== false) {
        ctx.font = '700 10px "JetBrains Mono", monospace'; ctx.fillStyle = '#fff';
        ctx.textAlign = 'left'; ctx.fillText('50969', hx + 8, hy - 7);
      }
      if (!reduce && (opts.animate || opts.pulse)) raf = requestAnimationFrame(frame);
    }

    var ro = null;
    function start() { cancelAnimationFrame(raf); size(); raf = requestAnimationFrame(frame); }
    start();
    ro = window.ResizeObserver ? new ResizeObserver(function () { start(); }) : null;
    if (ro) ro.observe(canvas); else window.addEventListener('resize', start);

    // Pause, wenn nicht sichtbar (Akku schonen)
    if ('IntersectionObserver' in window && !reduce) {
      new IntersectionObserver(function (en) {
        if (en[0].isIntersecting) raf = requestAnimationFrame(frame); else cancelAnimationFrame(raf);
      }).observe(canvas);
    }

    if (opts.onClick) {
      function hit(ev) {
        var rect = canvas.getBoundingClientRect(), x = ev.clientX - rect.left, y = ev.clientY - rect.top, best = -1, bd = 18 * 18;
        dest.forEach(function (d, i) { var dx = X(d.lng) - x, dy = Y(d.lat) - y, dd = dx * dx + dy * dy; if (dd < bd) { bd = dd; best = i; } });
        return best;
      }
      canvas.addEventListener('mousemove', function (ev) { hover = hit(ev); canvas.style.cursor = hover >= 0 ? 'pointer' : ''; });
      canvas.addEventListener('mouseleave', function () { hover = -1; });
      canvas.addEventListener('click', function (ev) { var i = hit(ev); if (i >= 0) opts.onClick(dest[i].post); });
    }
  }

  window.drawWorld = drawWorld;
})();
