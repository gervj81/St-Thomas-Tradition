// Light-paper-friendly palette
window.EDITORIAL_C = {
  rome:'#a83232', parthian:'#2f5fa8', indoparth:'#2f7a4d',
  india:'#a85f1c', chera:'#b8702a', arabia:'#8a6028', hinge:'#7a3aa8',
  blue:'#3a6ba8', pink:'#a8408a', green:'#2fa86a', olive:'#6e8a30',
  gold:'#a8782a', red:'#a82a2a', chinese:'#5a8a2a',
  orange:'#a85020', purple:'#7a30a8', papal:'#7a30a8'
};

window.POLY_OPTS = (c, op) => ({ color: c, fillColor: c, fillOpacity: op == null ? 0.22 : op, weight: 1.4 });

window.popup = function(name, stage, body) {
  return `<div class="popup-name">${name}</div>${stage?`<div class="popup-stage">${stage}</div>`:''}<div class="popup-body">${body}</div>`;
};

window.cityMark = function(map, lat, lng, name, stage, desc, color, r) {
  r = r || 6;
  return L.circleMarker([lat, lng], {
    radius: r, color: '#1a1612', weight: 1,
    fillColor: color, fillOpacity: 1
  }).bindPopup(window.popup(name, stage, desc), { maxWidth: 280, autoPan: true }).addTo(map);
};

// Region & ocean labels with cream-on-dark halo (works on satellite tiles)
window.regionLabels = function(map, regions, oceans) {
  if (!map.getPane('regionLabels')) {
    map.createPane('regionLabels');
    map.getPane('regionLabels').style.zIndex = 350;
    map.getPane('regionLabels').style.pointerEvents = 'none';
  }
  const rs = "font-family:'Source Serif 4',Georgia,serif;font-weight:700;letter-spacing:2.5px;text-transform:uppercase;color:#fbf6ec;text-shadow:0 0 3px #1a1612,0 0 3px #1a1612,0 0 6px rgba(26,22,18,0.85),0 1px 0 #1a1612;pointer-events:none;white-space:nowrap;-webkit-font-smoothing:antialiased;";
  const ss = "font-family:'IBM Plex Sans',sans-serif;font-size:10px;color:#e8d9b8;letter-spacing:0.6px;display:block;margin-top:2px;text-transform:none;font-weight:500;text-shadow:0 0 3px #1a1612,0 0 3px #1a1612,0 1px 0 #1a1612;";
  const os = "font-family:'Source Serif 4',Georgia,serif;font-style:italic;font-weight:500;letter-spacing:3px;color:#cfe3ff;text-shadow:0 0 3px #0d2440,0 0 3px #0d2440,0 0 6px rgba(13,36,64,0.9);pointer-events:none;white-space:nowrap;text-transform:uppercase;";

  const layerGroup = L.layerGroup().addTo(map);
  const render = () => {
    layerGroup.clearLayers();
    const zoom = map.getZoom();
    const sub = zoom >= 4;
    (regions || []).forEach(([lat,lng,name,modern,size]) => {
      const fs = Math.max(9, size - (zoom < 4 ? 2 : 0));
      const subHtml = sub && modern ? `<span style="${ss}">${modern}</span>` : '';
      L.marker([lat,lng], { pane:'regionLabels', icon: L.divIcon({ html: `<div style="${rs}font-size:${fs}px;">${name}${subHtml}</div>`, className:'', iconAnchor:[0,0] }), interactive:false }).addTo(layerGroup);
    });
    (oceans || []).forEach(([lat,lng,name,modern,size]) => {
      const fs = Math.max(9, Math.round(size * 0.55));
      L.marker([lat,lng], { pane:'regionLabels', icon: L.divIcon({ html: `<div style="${os}font-size:${fs}px;">${name}</div>`, className:'', iconAnchor:[0,0] }), interactive:false }).addTo(layerGroup);
    });
  };
  render();
  map.on('zoomend', render);
};

window.makeMap = function(paneId, center, zoom){
  const map = L.map(paneId, { center, zoom, zoomControl: false, preferCanvas: true });
  L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', { attribution: '', maxZoom: 12 }).addTo(map);
  L.control.zoom({ position: 'bottomright' }).addTo(map);
  return map;
};

// Standard layer-switching wiring
window.wireLayerNav = function(layers) {
  const setCaption = (key) => {
    const l = layers[key];
    document.getElementById('cap-num').textContent = l.figNum;
    document.getElementById('cap-ttl').textContent = l.figTtl;
  };
  const setStory = (key) => {
    document.getElementById('rail-body').innerHTML = layers[key].story;
  };
  const switchTo = (key) => {
    document.querySelectorAll('.map-pane').forEach(p => p.classList.remove('active'));
    document.getElementById('pane-' + key).classList.add('active');
    document.querySelectorAll('.layer-row').forEach(r => r.classList.toggle('active', r.dataset.tab === key));
    document.querySelectorAll('.mobile-tabs button').forEach(b => b.classList.toggle('active', b.dataset.tab === key));
    setCaption(key);
    setStory(key);
    if (layers[key].map) setTimeout(() => layers[key].map.invalidateSize(), 100);
  };
  document.querySelectorAll('.layer-row, .mobile-tabs button').forEach(el => {
    el.addEventListener('click', () => switchTo(el.dataset.tab));
  });
  // initial
  const first = Object.keys(layers)[0];
  switchTo(first);
};
