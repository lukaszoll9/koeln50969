// mapkit.js — gemeinsamer Kartenstil (MapLibre + OpenFreeMap-Vektorkacheln, ohne API-Key)
(function () {
  var STYLE = 'https://tiles.openfreemap.org/styles/positron';
  var C = {
    bg: '#f4f3f1', water: '#cfd8de', park: '#e6e9df', road: '#ffffff', roadCase: '#e4e1dc',
    building: '#ebe8e3', border: '#b8b1a7', label: '#6b6660', labelStrong: '#16130f', halo: '#ffffff', red: '#e1141c'
  };
  var NAME = ['coalesce', ['get', 'name:de'], ['get', 'name_de'], ['get', 'name:en'], ['get', 'name_en'], ['get', 'name_int'], ['get', 'name:latin'], ['get', 'name']];

  function set(map, id, prop, val, layout) {
    try { layout ? map.setLayoutProperty(id, prop, val) : map.setPaintProperty(id, prop, val); } catch (e) {}
  }

  // Positron an das Rut-&-Wiess-Design anpassen: ruhiges Grau, deutsche Namen, klare Schrift
  function restyle(map) {
    (map.getStyle().layers || []).forEach(function (l) {
      var id = l.id;
      if (l.type === 'background') set(map, id, 'background-color', C.bg);
      else if (l.type === 'fill') {
        if (/water|ocean|lake|river/.test(id)) set(map, id, 'fill-color', C.water);
        else if (/park|wood|forest|grass|landcover/.test(id)) { set(map, id, 'fill-color', C.park); set(map, id, 'fill-opacity', 0.6); }
        else if (/building/.test(id)) set(map, id, 'fill-color', C.building);
        else if (/landuse|residential/.test(id)) set(map, id, 'fill-opacity', 0.25);
      } else if (l.type === 'line') {
        if (/water|river|stream|canal/.test(id)) set(map, id, 'line-color', C.water);
        else if (/boundary|admin/.test(id)) set(map, id, 'line-color', C.border);
        else if (/casing/.test(id)) set(map, id, 'line-color', C.roadCase);
        else if (/highway|road|street|path|bridge|tunnel|motorway|trunk|primary|secondary|tertiary|minor/.test(id)) set(map, id, 'line-color', C.road);
      } else if (l.type === 'symbol' && l.layout && l.layout['text-field']) {
        set(map, id, 'text-field', NAME, true);
        var strong = /country|city|capital|continent/.test(id);
        set(map, id, 'text-color', strong ? C.labelStrong : C.label);
        set(map, id, 'text-halo-color', C.halo);
        set(map, id, 'text-halo-width', 1.4);
        if (/poi/.test(id)) set(map, id, 'visibility', 'none', true);
      }
    });
  }

  function create(container, opts) {
    opts = opts || {};
    var map = new maplibregl.Map(Object.assign({
      container: container,
      style: STYLE,
      attributionControl: { compact: true },
      dragRotate: false,
      pitchWithRotate: false,
      maxPitch: 0,
      renderWorldCopies: true,
      fadeDuration: 150
    }, opts));
    map.touchZoomRotate && map.touchZoomRotate.disableRotation();
    map.on('style.load', function () { restyle(map); });
    // Falls der Kartenstil nicht lädt: schlichter Hintergrund, damit Funde trotzdem sichtbar sind
    var fellBack = false;
    map.on('error', function (e) {
      if (fellBack || map.isStyleLoaded()) return;
      if (!/style|Failed to fetch/i.test(String(e && e.error && e.error.message))) return;
      fellBack = true;
      map.setStyle({ version: 8, glyphs: 'https://tiles.openfreemap.org/fonts/{fontstack}/{range}.pbf', sources: {},
        layers: [{ id: 'bg', type: 'background', paint: { 'background-color': C.bg } }] });
    });
    return map;
  }

  // Großkreis-Bogen als Linie (für Routen ab Zollstock)
  function arc(a, b, n) {
    n = n || 64;
    var r = Math.PI / 180, lat1 = a[1] * r, lon1 = a[0] * r, lat2 = b[1] * r, lon2 = b[0] * r;
    var d = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin((lat2 - lat1) / 2), 2) + Math.cos(lat1) * Math.cos(lat2) * Math.pow(Math.sin((lon2 - lon1) / 2), 2)));
    if (d === 0) return [a, b];
    var pts = [];
    for (var i = 0; i <= n; i++) {
      var f = i / n, A = Math.sin((1 - f) * d) / Math.sin(d), B = Math.sin(f * d) / Math.sin(d);
      var x = A * Math.cos(lat1) * Math.cos(lon1) + B * Math.cos(lat2) * Math.cos(lon2);
      var y = A * Math.cos(lat1) * Math.sin(lon1) + B * Math.cos(lat2) * Math.sin(lon2);
      var z = A * Math.sin(lat1) + B * Math.sin(lat2);
      pts.push([Math.atan2(y, x) / r, Math.atan2(z, Math.sqrt(x * x + y * y)) / r]);
    }
    return pts;
  }

  function homeMarker() {
    var el = document.createElement('div');
    el.className = 'home-marker';
    el.innerHTML = '<span>50969</span>';
    el.title = 'Köln-Zollstock — hier startet der Sticker';
    return new maplibregl.Marker({ element: el, anchor: 'bottom-left', offset: [-6, 6] }).setLngLat([K.HOME.lng, K.HOME.lat]);
  }

  window.MapKit = { create: create, arc: arc, homeMarker: homeMarker, COLORS: C };
})();
