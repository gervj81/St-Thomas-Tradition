// d3 chrome helper for Light Editorial atlas
// Provides: projection setup, country basemap, region/ocean labels, story rail wiring

window.D3Chrome = (function() {
  const TERRITORY_FILLS = {
    spanish: '#e0c98a',
    portuguese: '#b8c8a8',
    roman: '#d6b8a8',
    parthian: '#a8b8c8',
    maurya: '#b8c8a8',
    achaemenid: '#d8c8a8',
    babylonian: '#c8a8c8',
    seleucid: '#a8c0c8',
    ptolemaic: '#c8b8d8',
    alexander: '#d8b0a8'
  };

  function init({ stageSel, center, scale }) {
    const stage = document.querySelector(stageSel);
    const W = () => stage.clientWidth;
    const H = () => stage.clientHeight;

    const projection = d3.geoMercator()
      .scale(Math.max(W(), 900) / (scale || 6.5))
      .center(center || [0, 20])
      .translate([W() / 2, H() / 1.6]);
    const path = d3.geoPath().projection(projection);

    const svg = d3.select(stageSel).select('.d3-map').append('svg')
      .attr('width', W()).attr('height', H());

    const mapGroup = svg.append('g').attr('class', 'g-map');
    const polyGroup = svg.append('g').attr('class', 'g-poly');
    const linkGroup = svg.append('g').attr('class', 'g-link');
    const labelGroup = svg.append('g').attr('class', 'g-label');
    const nodeGroup = svg.append('g').attr('class', 'g-node');

    return { svg, mapGroup, polyGroup, linkGroup, labelGroup, nodeGroup, projection, path, W, H, stage };
  }

  function drawCountries(ctx, { fills } = {}) {
    return d3.json('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json').then(world => {
      const countries = topojson.feature(world, world.objects.countries).features;
      ctx.mapGroup.selectAll('path.country')
        .data(countries).enter().append('path')
        .attr('class', d => {
          if (!fills) return 'country';
          for (const [key, names] of Object.entries(fills)) {
            if (names.includes(d.properties.name)) return 'country fill-' + key;
          }
          return 'country';
        })
        .attr('d', ctx.path)
        .append('title').text(d => d.properties.name);
    });
  }

  function drawRegionLabels(ctx, regions, oceans) {
    const rs = "font-family:'Source Serif 4',Georgia,serif;font-weight:700;letter-spacing:2.5px;text-transform:uppercase;fill:#1a1612;paint-order:stroke fill;stroke:rgba(244,237,224,0.92);stroke-width:3px;stroke-linejoin:round;pointer-events:none;";
    const os = "font-family:'Source Serif 4',Georgia,serif;font-style:italic;font-weight:500;letter-spacing:3px;fill:#3a5a8a;paint-order:stroke fill;stroke:rgba(244,237,224,0.92);stroke-width:3px;stroke-linejoin:round;text-transform:uppercase;pointer-events:none;";
    (regions || []).forEach(([lng, lat, name, modern, size]) => {
      const [x, y] = ctx.projection([lng, lat]);
      const t = ctx.labelGroup.append('text')
        .attr('x', x).attr('y', y)
        .attr('text-anchor', 'middle')
        .attr('style', rs + `font-size:${size || 11}px;`)
        .text(name);
      if (modern) {
        ctx.labelGroup.append('text')
          .attr('x', x).attr('y', y + (size || 11) + 1)
          .attr('text-anchor', 'middle')
          .attr('style', `font-family:'IBM Plex Sans',sans-serif;font-size:9px;fill:#6e6151;letter-spacing:0.4px;paint-order:stroke fill;stroke:rgba(244,237,224,0.92);stroke-width:3px;stroke-linejoin:round;pointer-events:none;`)
          .text(modern);
      }
    });
    (oceans || []).forEach(([lng, lat, name, modern, size]) => {
      ctx.labelGroup.append('text')
        .attr('x', ctx.projection([lng, lat])[0])
        .attr('y', ctx.projection([lng, lat])[1])
        .attr('text-anchor', 'middle')
        .attr('style', os + `font-size:${Math.max(10, Math.round((size || 16) * 0.7))}px;`)
        .text(name);
    });
  }

  function attachZoom(ctx) {
    const z = d3.zoom().scaleExtent([0.5, 8]).on('zoom', e => {
      ['g-map','g-poly','g-link','g-label','g-node'].forEach(cls => {
        ctx.svg.select('.' + cls).attr('transform', e.transform);
      });
      ctx.linkGroup.selectAll('path').style('stroke-width', function() {
        const base = +d3.select(this).attr('data-w') || 1.6;
        return (base / e.transform.k) + 'px';
      });
      ctx.nodeGroup.selectAll('g.node').attr('transform', d => `translate(${d.x},${d.y}) scale(${1/e.transform.k})`);
      ctx.labelGroup.selectAll('text').style('font-size', function() {
        const base = +d3.select(this).attr('data-fs') || +this.style.fontSize.replace('px','') || 11;
        return (base / Math.max(0.6, e.transform.k * 0.85)) + 'px';
      });
    });
    ctx.svg.call(z);
    return z;
  }

  return { init, drawCountries, drawRegionLabels, attachZoom, TERRITORY_FILLS };
})();
