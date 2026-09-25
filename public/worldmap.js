// worldmap.js — Punkt-Weltkarte mit Reiserouten ab Köln-Zollstock (ohne externe Kacheln)
(function () {
  var MASK = { cols: 480, rows: 179, step: 0.75, lat0: 78, b64: 'AAAAAAAAAAAAALAeCI3P+P8A//////////8/AAAAAAD88QEAAAAAAAAAAAAAAAAfAAAAAAAAAAAAAAAAAAAAAAAAAAAAgL9AAJKv//8A/v//////////AAAAAABwAAAAAAAAAAAPAAAAAMF/HwAAAAAAAAAAAAAAAAAAAAAAAAAA8P/n5z/+QXEA8P////////8/AAAAAAAAAAAAAAAAgP8HAAAA8P///wAAAIAzAAAAAAAAAAAAAAAAAAAAAPr/t7/n/z8AAAD8//////+/AAAAAAAAAAAAAAAA+A8AAADw/////wAAAID/+wAAAAAAAAAAAAAAAAAAeAA/AADn/z8AAADw//////8/AAAAAAAAAAAAAAAA/AAAAAD4////fwAAAAAL4AAAAAAAAAAAAAAAAAAA/D8ADH5+ePYAAADg//////8fAAAAAAAAAAAAAAAAPwAAAOD/////fwxgAAB4AAAAAAAAAAAAAAAAAAAA/v8in38//v8DAADg//////8HAAAAAAAAAAAAAADADwDgCPr/////////DwBwAAAAAAAAAAAAAAAAAAAA////D/8G3/8PAADg//////8HAAAAAAAAAAAAAADAAwD4kf//////////HwD8fwAAAAAA/P/////////////////3//9//v/////////////////////////////7/////////////4/8//////9//P////////////////////////////////////////////////////////////////////////////9/AACA////AwBuAvD//4E/+P//PwCA//////8DAAAAAAAA/v8BAAAAwAH+/f////////////////8fADsEAADA//////j///P///H9wqf+fwCA9/////8AAAAAAADA////AAAHAH/+/f////////////////////t//v8HAAAAAEgAAID///+Pffw/8P//DwAAAP//////////AAAA/P//3wEOzgAAAAAAAAAAAAAAAABAAAQA8P8fAAAAAAAAAMD/4b8DHPxzgP//DwAA8P////////8fAAAA4PcHAAAAjgAAAAAAAAAAAAAAAAAAAAAAwP//AAAAAAAAAACAAYABCPj/APj/AwAA+P////////8PAAAIgPcAAACABwAAAAAAAAAAAAAAAAAAAAAAgvD/AwAAAAAAAAAAAAAA8P8/wPD/AQAg//////////8DAADw4wcAAADwAQAAAAAAAAAAAAAAAAAAAAAAH/wDAAAAAAAAAAAAAAAA9/8/4Pn/BwD4//8f8P////8B4APAPwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//////////////////////////v/////////////////////////////////////////////////////AAAA/v//////////////9x/D/wMA+P8DAAD8DwAAAOD/j/////////////////////////////////8/AHig//////////////9/4IgD/wMA+P8DAADgAAAAAPz/4/////////////////////////////////9/AADw//////////////8/AAcjfgIA4P8AAAAAAAAAAP//8P////////////////////////////////9/AAD8//////////////8PACD/wAIAwP8AAAAAAEAAwP//8P////////////////////////////////8DAAD4//////////////8HAAD/BwAAgH8AAAAAAAAAwP9/8P/////////////////////////////h/H8AAAD2/9////////////8DAAD/BwIAAHgAAAAAAABAwP//9f///////////////////////////38A/w8AAAAg/+8A8P////////8DAAD/DwcAAAAAAAAAAAAAgP//Af///////////////////////////3/AAwAAAAAA/w8AgP////////8PAID/nw8AAAAAAAAAAAAIgL//wP////////////////////////8/AAzwDQAAAAAAwB8AAP7///////8PAAD//x8AAAAAAAAAAMAOAId/YP////////////////////////8PAAD8AQAAAAAA4BwAAPz///////9fAAD+/z8AAAAAAAAAAMA/ADB/cf////////////////////////8HAAD+AwAAAAAAOAQAAPD/////////B2D8/z8AAAAAAAAAAIAfAHh+8P////////////////////////8BAAD/AwAAAAAAHwAAAOD/////////H2D+//8AAAAAAAAAAIA/APgP8P///////////////////////38AAID/AAAAAADgBgAAAMD//////////4P///8DAAAAAAAAAOA/APgB+P///////////////////////78AAID/IAAAAAAQAAAAAAD8/////////8f///8PAAAAAAAAAPj5APjn//////////////////////////9GAID/AAAAAIADAAAAAMD8/////////8f///8fAAAAAAAAAPz4AP////////////////////////////9vAAA/AAAAAAAAAAAAAID5/////////4////8/AAAAAAAAAPj8w/////////////////////////////9/AAAPAEAAgAAAAAAAAADg/////////4////8/AAAAAAAAAPz+4/////////////////////////////9/AAAHAAAAAAAAAAAAAADg//////////////8/AAAAAAAAAAj88//////////////////////////////vAAADAAAAAAAAAAAAAADg//////////////85AAAAAAAAAAD+/f/////////////////////////////vAIAAAAAAAAAAAAAAAADA////////////fww4AAAAAAAAAAAA///////////////////////////////vAAAAAAAAAAAAAAAAAAAA/////////////zP8AQAAAAAAAADg///////////////////////////////nAQAAAAAAAAAAAAAAAAAA/v///////////wP+AQAAAAAAAAD8//////////////////////////////9nAAAAAAAAAAAAAAAAAAAA/P///////////wP+AwAAAAAAAAD8//////////////////////////////9jAAAAAAAAAAAAAAAAAAAA/P///////////4dAAwAAAAAAAADg//////////////////////////////9hAAAAAAAAAAAAAAAAAAAA/P///////////98AAAAAAAAAAADA//////99/P/D//////////////////8gAAEAAAAAAAAAAAAAAAAA/P///////////38AAAAAAAAAAADA///9///4///w/////////////////38gIAAAAAAAAAAAAAAAAAAA/P//////////fx8AAAAAAAAAAADA///5/39w/H/4/////////////////z9gEAAAAAAAAAAAAAAAAAAA/P//////////DwMAAAAAAAAAACDA/+fz/z8A8P/w/////////////////x/wBwAAAAAAAAAAAAAAAAAA/P//////////AwAAAAAAAAAAAPD/n8HH/z8A4P/w/////////////////w/4AwAAAAAAAAAAAAAAAAAA/P//////////AwAAAAAAAAAAAPD/H5gP/x8AgP/A////////////////fwD8AAAAAAAAAAAAAAAAAAAA/P//////////BwAAAAAAAAAAAPD/Dxg//D/8gP9B////////////////HwAIAAAAAAAAAAAAAAAAAAAA/P//////////AAAAAAAAAAAAAPD/Axj8/P/////D////////////////HwAYAAAAAAAAAAAAAAAAAAAA/P////////8/AAAAAAAAAAAAAPD/IRjw/fz////H///////////////9DwAcAAAAAAAAAAAAAAAAAAAA+P////////8fAAAAAAAAAAAAAPj/GBhgfPz///+D/////////////3+MAwA8AAAAAAAAAAAAAAAAAAAA+P////////8PAAAAAAAAAAQAAPj/AABg+Pn///+B/////////////x+ABwAcAAAAAAAAAAAAAAAAAAAA8P////////8PAAAAAAAAAAAAAPB/AAA/+Pn///+D/////////////3/DDwAPAAAAAAAAAAAAAAAAAAAA4P////////8HAAAAAAAAAAAAAPA/IH8cYPD///+P//////////////8PH8APAAAAAAAAAAAAAAAAAAAA4P////////8HAAAAAAAAAAAAAIAD/38AQKC9//////////////////8BH+APAAAAAAAAAAAAAAAAAAAAwP////////8HAAAAAAAAAAAAAADB/38AgAEg//////////////////8AH/4PAAAAAAAAAAAAAAAAAAAAgP////////8DAAAAAAAAAAAAAID//38AAAYY/////////////////38AD/8HAAAAAAAAAAAAAAAAAAAAAP////////8BAAAAAAAAAAAAAID//z8AAACA//////////////////8BwD8AAAAAAAAAAAAAAAAAAAAAAPj//////38AAAAAAAAAAAAAAOD//38AAACA//////////////////8B4QcAAAAAAAAAAAAAAAAAAAAAAPj//////z8AAAAAAAAAAAAAAPD///8PeADA//////////////////8D4AAAAAAAAAAAAAAAAAAAAAAAAPD//////w8AAAAAAAAAAAAAAPj///8f/APA//////////////////8H4AAAAAAAAAAAAAAAAAAAAAAAAGD+/////w8AAAAAAAAAAAAAAPj//////L////////////////////8HQAAAAAAAAAAAAAAAAAAAAAAAAGD+/////w8AAAAAAAAAAAAAAPj///////////////////////////8DAAAAAAAAAAAAAAAAAAAAAAAAAMD9////QQ8AAAAAAAAAAAAAAPz////////////5//////////////8HAAAAAAAAAAAAAAAAAAAAAAAAAID9//8BAB4AAAAAAAAAAAAAIP7////////////x//////////////8HAAAAAAAAAAAAAAAAAAAAAAAAAID7/38AAB4AAAAAAAAAAAAAiv/////////////x//////////////8DEAAAAAAAAAAAAAAAAAAAAAAAAID3/38AABwAAAAAAAAAAAAAwP////////+f///D//////////////8BAAAAAAAAAAAAAAAAAAAAAAAAAADP/38AALwAAAAAAAAAAAAA4P////////8///+H9/////////////8ABAAAAAAAAAAAAAAAAAAAAAAAAADM/38AABgAAAAAAAAAAAAA8P////////8///8f9P////////////8AAAAAAAAAAAAAAAAAAAAAAAAAAACc/z8AABAAAAAAAAAAAAAA8P////////9//v8fBn///////////38GAAAAAAAAAAAAAAAAAAAAAAAAAAAY/z8AAIABAAAAAAAAAAAA+P////////9//P/fDwD+/////////z8HAAAAAAAAAAAAAAAAAAAAAAAAAAAw/j8AAAAAAAAAAAAAAAAA/P//////////+P//fwD8/////////x8DAAAAAAAAAAAAAAAAAAAAAAAAAAAg/D8AAD8AAAAAAAAAAAAA/P//////////8P//fwDw/////////wcDAAAAAAAAAAAAAAAACAAAAAAAAAAA+D8AgPkBAAAAAAAAAAAA/v//////////8f///wDw/////////wAAAAAAAAAAAAAAAAAAIAAAAAAAAAAA+D8AH8JHAAAAAAAAAAAA/v//////////8///fwDg//8f/P//HgAAAAAAAAAAAAAAAAAAgAAAAAAAAAAA+H+ADwAfAAAAAAAAAAAA/P//////////8///fwBA/v8P+P9/BAAAAAAAAAAAAAAAAAAAAAMAAAAAAAAA+P+ADwDfBwAAAAAAAAAA/P//////////w///HwAA/v8H8P8/DgAAAAAAAAAAAAAAAAAAAAEAAAAAAAAA8P/ADwDADwAAAAAAAAAA/P//////////w///HwAA/v8B4P8fDgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAwP//BwDj3wEAAAAAAAAA/P//////////h///DwAA/v8B4P8/BgAGAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP//BwAAAQAAAAAAAAAA/P//////////D///AwAA/n8AwP8/AAAHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAPz/BwAAAAAAAAAAAEAA/P//////////D///AQAA/j8AwP9/AAAHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOD/YwAAACAAAAAAAAAA/P//////////H/4/AAAA/B8A4Pz/AQAHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD4/wEAAAAAAAAAAAAA/v//////////P/4fAAAA/AcAAPz/AQADAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADg/wEAAEAAAAAAAAAA/v//////////f/4HAAAA+AcAAPz/AwAHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADA/wEAAAAAAAAAAAAA/v////////////4BAAAA+AcAAPj/AwA/AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA/gEAAAAAAAAAAAAA/v///////////x8AAAAA+AcACPj/AwAyAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA8AEAAQAAAAAAAAAA/v///////////wOAAQAA8AcACDj/AwB2AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA4AHADQAAAAAAAAAA/P///////////wMMAAAA8AcACBj+AwDsAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA4AH4H1wAAAAAAAAA8P////////////cPAAAA4AcAABj+AYB8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA4AH4/38AAAAAAAAA4P////////////8PAAAA4AMAABh4AED4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgOf8/38AAAAAAAAAwP////////////8PAAAAwA8AABg4ACCYAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAL////8AAAAAAAAAwP////////////8HAAAAwBwAADgAABDQAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAJj///8DAAAAAAAAwP////////////8HAAAAABwAADgAAAD4AQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABD///8DAAAAAAAAgP////////////8DAAAAABwAAHAAAADkAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD///8PAAAAAAAAAP7///////////8DAAAAABwAAOAAABjkAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD+////AQAAAAAAAPj/gf////////8BAAAAAAAAgOABAHwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD+////BwAAAAAAAPAxgP////////8BAAAAAAAAgMcDAH8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD+////DwAAAAAAAAAAAPH///////8AAAAAAAAAAM8DgT8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD/////DwAAAAAAAAAAAOj//////38AAAAAAAAAAJ4DwB8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAID/////HwAAAAAAAAAAAOD//////z8AAAAAAAAAAL0H8B8ACAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAID/////HwAAAAAAAAAAAOD//////x8AAAAAAAAAAPgH9j8ABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMD/////PwAAAAAAAAAAAPD//////wcAAAAAAAAAAPYP/n9+DAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOD/////PwAAAAAAAAAAAPD//////wMAAAAAAAAAAPAD/h8/DAAAAAAAAAAAAAAAAAAAAAAAAAAAAADAAOD//////wAAAAAAAAAAAPD//////wEAAAAAAAAAAOAL/p8ARgMAAAAAAAAAAAAAAAAAAAAAAAAAAABAAPD//////wcAAAAAAAAAAPD//////wAAAAAAAAAAAMgH/I8fwCcAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAPD//////x8AAAAAAAAAAPD/////fwAAAAAAAAAAANA//I/HJOcDCAAAAAAAAAAAAAAAAAAAAAAAAAAAAPD///////8AAAAAAAAAAOD/////PwAAAAAAAAAAAKD/+M8HGO8fAAMAAAAAAAAAAAAAAAAAAAAAAAAAAPD///////8PAAAAAAAAAMD/////PwAAAAAAAAAAAIA/4McHf/7/AAQAAAAAAAAAAAAAAAAAAAAAAAAAAPD///////8/AAAAAAAAAID/////HwAAAAAAAAAAAAAfAIINAPr/AwwAAAAAAAAAAAAAAAAAAAAAAAAAAPj/////////AAAAAAAAAAD/////HwAAAAAAAAAAAAAcAIANAMD/BwwAAAAAAAAAAAAAAAAAAAAAAAAAAPD/////////AQAAAAAAAAD/////DwAAAAAAAAAAAAAYAIAJAAr/70cAAAAAAAAAAAAAAAAAAAAAAAAAAPD/////////AwAAAAAAAAD/////HwAAAAAAAAAAAADgAQAAAAz/n4EAAAAAAAAAAAAAAAAAAAAAAAAAAOD/////////AwAAAAAAAAD+////HwAAAAAAAAAAAADg/wAAgAD+DwACAAAAAAAAAAAAAAAAAAAAAAAAAMD/////////AwAAAAAAAAD+////HwAAAAAAAAAAAAAA/wEAAQD/HwAaAAAAAAAAAAAAAAAAAAAAAAAAAID/////////AwAAAAAAAAD+////HwAAAAAAAAAAAAAAgP//AwD4OABEAAAAAAAAAAAAAAAAAAAAAAAAAID/////////AQAAAAAAAAD+////HwAAAAAAAAAAAAAAAIDgAABw8AFgAAAAAAAAAAAAAAAAAAAAAAAAAAD/////////AAAAAAAAAAD8////PwAAAAAAAAAAAAAAAAAxAAAA4AOAAAAAAAAAAAAAAAAAAAAAAAAAAAD///////9/AAAAAAAAAAD8////PwAAAAAAAAAAAAAAAAAAAAAgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD+//////8/AAAAAAAAAAD8////PwIAAAAAAAAAAAAAAAAAYANgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD+//////8/AAAAAAAAAAD8////PwACAAAAAAAAAAAAAAAAwH9gAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD8//////8fAAAAAAAAAAD+////PwAGAAAAAAAAAAAAAAAA4D/gAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAD8//////8PAAAAAAAAAAD/////PwAHAAAAAAAAAAAAAAAA43/wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD8//////8PAAAAAAAAAAD/////f4AHAAAAAAAAAAAAAACA/x/wAwAAAAAAAAAAAAAAAAAAAAAAAAAAAADw//////8PAAAAAAAAAAD/////P8APAAAAAAAAAAAAAADA/z/wAwAAQAAAAAAAAAAAAAAAAAAAAAAAAADg//////8PAAAAAAAAAID/////P/gHAAAAAAAAAAAAAADg///wAwAAgACAAQAAAAAAAAAAAAAAAAAAAACA//////8PAAAAAAAAAID/////H/gHAAAAAAAAAAAAAAD4///zBwAAAAHAAAAAAAABAAAAAAAAAAAAAAAA/v////8PAAAAAAAAAID/////A/wDAAAAAAAAAAAAAAD4////BwAAAAAwAAAAAAAAAAAAAAAAAAAAAAAA/P////8HAAAAAAAAAAD/////AfgDAAAAAAAAAAAAAAD8////BwAAAAAgAAAAAAAAAAAAAAAAAAAAAAAA/P////8HAAAAAAAAAAD/////APgDAAAAAAAAAAAAAAD8////DwAAAAIAAAAAAAAAAAAAAAAAAAAAAAAA/P////8HAAAAAAAAAAD+//9/APgBAAAAAAAAAAAAAID/////PwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA/P////8DAAAAAAAAAAD+//9/APwBAAAAAAAAAAAAAPj/////fwAACAAAAAAAAAAAAAAAAAAAAAAAAAAA/P////8DAAAAAAAAAAD8//9/APwBAAAAAAAAAAAAAPz/////fwAAMAAAAAAAAAAAAAAAAAAAAAAAAAAA/P////8BAAAAAAAAAAD4////AP4AAAAAAAAAAAAAAP///////wEAYAAAAAAAAAAAAAAAAAAAAAAAAAAA/P////8AAAAAAAAAAAD4////APwAAAAAAAAAAAAAgP///////wEAAAAAAAAAAAAAAAAAAAAAAAAAAAAA/P///w8AAAAAAAAAAAD4////APwAAAAAAAAAAAAAgP///////wMAAAAAAAAAAAAAAAAAAAAAAAAAAAAA/P///wMAAAAAAAAAAAD4//9/AHwAAAAAAAAAAAAAgP///////wcAAAAAAAAAAAAAAAAAAAAAAAAAAAAA/P///wAAAAAAAAAAAAD4//8/AHgAAAAAAAAAAAAAgP///////x8AAAAAAAAAAAAAAAAAAAAAAAAAAAAA/v///wAAAAAAAAAAAADw//8PAAAAAAAAAAAAAAAAgP///////w8AAAAAAAAAAAAAAAAAAAAAAAAAAAAA/v//fwAAAAAAAAAAAADw//8PAAAAAAAAAAAAAAAAgP///////w8AAAAAAAAAAAAAAAAAAAAAAAAAAAAA/v///wAAAAAAAAAAAADw//8PAAAAAAAAAAAAAAAAAP///////x8AAAAAAAAAAAAAAAAAAAAAAAAAAAAA/v//fwAAAAAAAAAAAADg//8PAAAAAAAAAAAAAAAAAP///////x8AAAAAAAAAAAAAAAAAAAAAAAAAAAAA////fwAAAAAAAAAAAADA//8HAAAAAAAAAAAAAAAAAP7//////x8AAAAAAAAAAAAAAAAAAAAAAAAAAAAA/v//PwAAAAAAAAAAAADA//8DAAAAAAAAAAAAAAAAAP7//////x8AAAAAAAAAAAAAAAAAAAAAAAAAAAAA////HwAAAAAAAAAAAACA//8BAAAAAAAAAAAAAAAAAP7//////w8AAAAAAAAAAAAAAAAAAAAAAAAAAAAA////HwAAAAAAAAAAAACA//8AAAAAAAAAAAAAAAAAAPz//////w8AAAAAAAAAAAAAAAAAAAAAAAAAAAAA////BwAAAAAAAAAAAAAA/38AAAAAAAAAAAAAAAAAAPz/j////w8AAAAAAAAAAAAAAAAAAAAAAAAAAAAA////AwAAAAAAAAAAAAAA/z8AAAAAAAAAAAAAAAAAAPz/APz//wcAAAAAAAAAAAAAAAAAAAAAAAAAAAAA////AwAAAAAAAAAAAAAA/x8AAAAAAAAAAAAAAAAAAPw/APj//wMAAAAAAAAAAAAAAAAAAAAAAAAAAAAA////AQAAAAAAAAAAAAAA/wMAAAAAAAAAAAAAAAAAAP4ZALD//wMAAAAAAAAAAAAAAAAAAAAAAAAAAACA///3AAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAAAADwAAJD//wEAAIAAAAAAAAAAAAAAAAAAAAAAAACA//8PAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMD//wEAAIABAAAAAAAAAAAAAAAAAAAAAACA//8fAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD8/wAAAAADAAAAAAAAAAAAAAAAAAAAAADA//8PAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD8/wAAAAAHAAAAAAAAAAAAAAAAAAAAAADA//8PAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD4/wAAAAA+AAAAAAAAAAAAAAAAAAAAAADA//8HAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADADgAAAAA/AAAAAAAAAAAAAAAAAAAAAADA/z8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAPAAAAAAAAAAAAAAAAAAAAAADg/x8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIAAAAAAOAAAAAAAAAAAAAAAAAAAAAADg/x8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAANgAAAOAGAAAAAAAAAAAAAAAAAAAAAADg/wMAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAPgAAAOADAAAAAAAAAAAAAAAAAAAAAACg/wcAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAPgAAAPAAAAAAAAAAAAAAAAAAAAAAAADg/wMAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHAAAAHgAEAAAAAAAAAAAAAAAAAAAAADA/wEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAH8AAAAAAAAAAAAAAAAAAAAAAADg/wEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgB8AAAAAAAAAAAAAAAAAAAAAAADwfwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAwA8AAAAAAAAAAAAAAAAAAAAAAADwPwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAwAcAAAAAAAAAAAAAAAAAAAAAAAD4/wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgAAAAAAAAAAAAAAAAAAAAAAAAADw/wEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD4/wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD4PwAAAAAAAAAAAAAAAAAAAAAAAAAAAAA4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD4PwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD4DwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADwD4AHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADwH4ADAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADgHwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADAPwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA/wAAAADAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA/gEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA' };
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
      var full = window.K ? K.prettyLoc(p.locationText) : '';
      var parts = full.split(',').map(function (x) { return x.trim(); });
      // Stadt bevorzugen (zweiter Teil), sonst erster Teil; reine Ländernamen weglassen
      var name = parts.length > 1 && !/^(Thailand|Deutschland)$/.test(parts[1]) ? parts[1] : parts[0];
      if (/^(Thailand|Deutschland)$/.test(name)) name = '';
      if (!seen[key]) { seen[key] = { lat: p.lat, lng: p.lng, n: 0, post: p, km: km, names: {} }; dest.push(seen[key]); }
      var d = seen[key]; d.n++;
      if (name) d.names[name] = (d.names[name] || 0) + 1;
    });
    dest.forEach(function (d) { d.name = Object.keys(d.names).sort(function (a, b) { return d.names[b] - d.names[a]; })[0] || ''; });
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
      var r = Math.min(2.1, Math.max(0.55, cell * 0.3));
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
