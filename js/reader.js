/* ╔══════════════════════════════════════════════╗
   ║  ANTI BOOK READER — Core Application Logic  ║
   ╚══════════════════════════════════════════════╝ */

(function () {
  'use strict';

  // ── State ──
  const state = {
    book: null,
    chapters: [],
    currentChapter: 0,
    fontSize: 18,
    theme: 'light',
    tocOpen: false,
    footnoteOpen: false,
    mediaOpen: false,
  };

  const FONT_MIN = 14;
  const FONT_MAX = 26;
  const FONT_STEP = 2;
  const STORAGE_KEY = 'antibook-reader';
  const THEMES = ['light', 'dark', 'sepia'];
  const GENERATED_ASSETS = {
    indianOceanAtlas: 'images/generated/indian_ocean_atlas_1778310739870.png',
    pahlaviCross: 'images/generated/pahlavi_cross_1778310755572.png',
    syriacTexture: 'images/generated/syriac_manuscript_texture_1778304748296.png',
    keralaPort: 'images/generated/atlas_kerala_port_1778214566825.png',
    portugueseArrival: 'images/generated/chapter_4_hero_1778310722502.png',
    commonwealthNetwork: 'images/generated/atlas_era6_pepper_1778213608113.png',
  };
  const CHAPTER_VISUAL_STATES = {
    'part-1-intro': {
      state: 'Connectivity',
      mode: 'Voyage',
      evidence: 'Atlas memory',
      image: GENERATED_ASSETS.indianOceanAtlas,
      caption: 'Indian Ocean corridor as the opening spatial grammar of Part I.',
    },
    'chapter-01': {
      state: 'Open oceanic system',
      mode: 'Cosmopolitan expansion',
      evidence: 'Maritime route',
      image: 'images/generated/chapter_1_hero_1778310655224.png',
      caption: 'Muziris imagined as a working node inside the Roman-Indian maritime system.',
    },
    'chapter-02': {
      state: 'Documentary consolidation',
      mode: 'Memory formation',
      evidence: 'Manuscript witness',
      image: 'images/generated/chapter_2_hero_1778310671655.png',
      caption: 'Apostolic memory, Syriac witness, and the documentary layer of the tradition.',
    },
    'chapter-03': {
      state: 'Network collapse',
      mode: 'Sparse continuity',
      evidence: 'Fragmented route',
      image: 'images/generated/chapter_3_hero_1778310695574.png',
      caption: 'Fading routes and isolated continuity after the old Mediterranean vectors fail.',
    },
    'chapter-04': {
      state: 'Atlantic intrusion',
      mode: 'Collision',
      evidence: 'Competing maps',
      image: GENERATED_ASSETS.portugueseArrival,
      caption: 'Portuguese arrival rendered as a collision of European and Malabar geographies.',
    },
    'part-1-synthesis': {
      state: 'Civilizational totality',
      mode: 'Synthesis',
      evidence: 'Network memory',
      image: GENERATED_ASSETS.commonwealthNetwork,
      caption: 'The Thomas Christian commonwealth as a restored Indian Ocean network.',
    },
    'part-2-intro': {
      state: 'Biased abundance',
      mode: 'Archive pressure',
      evidence: 'Documentary overload',
      pressure: 28,
      image: GENERATED_ASSETS.syriacTexture,
      caption: 'Part II shifts from sparse witness to an archive dense with institutional motive.',
    },
    'chapter-05': {
      state: 'Atlantic intrusion',
      mode: 'Encounter',
      evidence: 'Royal commission',
      pressure: 32,
      image: GENERATED_ASSETS.portugueseArrival,
      caption: 'The broad maritime world begins to narrow into Portuguese imperial paperwork.',
    },
    'chapter-06': {
      state: 'Misrecognition',
      mode: 'Absorption',
      evidence: 'Legendary layer',
      pressure: 40,
      image: GENERATED_ASSETS.keralaPort,
      caption: 'Kerala port power seen through the distorting frame of Portuguese expectation.',
    },
    'chapter-07': {
      state: 'Administrative conversion',
      mode: 'Standardization',
      evidence: 'Canon law',
      pressure: 50,
      image: GENERATED_ASSETS.syriacTexture,
      caption: 'The archive begins replacing open geography as the governing landscape.',
    },
    'chapter-08': {
      state: 'Shadow jurisdiction',
      mode: 'Surveillance',
      evidence: 'Institutional report',
      pressure: 58,
      image: GENERATED_ASSETS.syriacTexture,
      caption: 'Hidden reports and unstable authority lines thicken the documentary field.',
    },
    'chapter-09': {
      state: 'Institution building',
      mode: 'New instrument',
      evidence: 'Jesuit letter',
      pressure: 66,
      image: GENERATED_ASSETS.keralaPort,
      caption: 'Missionary movement becomes institutional machinery across the Malabar coast.',
    },
    'chapter-10': {
      state: 'Imperial compression',
      mode: 'Collapsed sword',
      evidence: 'Synodal decree',
      pressure: 78,
      image: GENERATED_ASSETS.portugueseArrival,
      caption: 'The open atlas contracts into decrees, seals, garrisons, and jurisdiction.',
    },
    'chapter-11': {
      state: 'Palimpsest',
      mode: 'Dual text',
      evidence: 'Revised manuscript',
      pressure: 86,
      image: GENERATED_ASSETS.syriacTexture,
      caption: 'Syriac continuity survives as correction, translation, and revision layer.',
    },
    'chapter-12': {
      state: 'Fragmentation',
      mode: 'Competing authority',
      evidence: 'Broken settlement',
      pressure: 96,
      image: GENERATED_ASSETS.pahlaviCross,
      caption: 'The archive can no longer contain the community it was built to administer.',
    },
  };
  const GENERATED_SRC_REPLACEMENTS = new Map([
    ['images/generated/indian_ocean_atlas.png', GENERATED_ASSETS.indianOceanAtlas],
    ['images/generated/pahlavi_cross.png', GENERATED_ASSETS.pahlaviCross],
  ]);

  // ── DOM References ──
  const $ = (sel) => document.querySelector(sel);
  const $$ = (sel) => document.querySelectorAll(sel);

  const dom = {
    progressFill: $('#progress-fill'),
    progressBar: $('#progress-bar'),
    toolbar: $('#toolbar'),
    bookTitle: $('#book-title'),
    chapterTitleBar: $('#chapter-title-bar'),
    tocToggle: $('#toc-toggle'),
    tocSidebar: $('#toc-sidebar'),
    tocOverlay: $('#toc-overlay'),
    tocClose: $('#toc-close'),
    tocList: $('#toc-list'),
    tocScrollIndicator: $('#toc-scroll-indicator'),
    chapterContent: $('#chapter-content'),
    prevBtn: $('#prev-chapter'),
    nextBtn: $('#next-chapter'),
    chapterIndicator: $('#chapter-indicator'),
    fontDecrease: $('#font-decrease'),
    fontIncrease: $('#font-increase'),
    themeToggle: $('#theme-toggle'),
    themeIconMoon: $('#theme-icon-moon'),
    themeIconSun: $('#theme-icon-sun'),
    footnotePopover: $('#footnote-popover'),
    footnoteBackdrop: $('#footnote-backdrop'),
    footnoteBody: $('#footnote-body'),
    footnoteClose: $('#footnote-close'),
    footnoteLabel: $('#footnote-label'),
    loader: $('#loader'),
    mediaModal: $('#media-modal'),
    mediaModalIframe: $('#media-modal-iframe'),
    mediaModalClose: $('#media-modal-close'),
    mediaModalTitle: $('#media-modal-title'),
  };


  // ══════════════════════════════════════
  //  INITIALIZATION
  // ══════════════════════════════════════

  async function init() {
    loadPreferences();
    applyTheme();
    applyFontSize();
    bindEvents();

    try {
      const res = await fetch(`book.json?v=${new Date().getTime()}`);
      if (!res.ok) throw new Error('Could not load book.json');
      state.book = await res.json();
      state.chapters = state.book.chapters || [];

      dom.bookTitle.textContent = state.book.title || 'Untitled';
      document.title = state.book.title || 'Book Reader';

      buildTOC();

      // Restore last read chapter
      const saved = loadPreferences();
      if (saved.chapter >= 0 && saved.chapter < state.chapters.length) {
        state.currentChapter = saved.chapter;
      }

      await loadChapter(state.currentChapter);
    } catch (err) {
      dom.chapterContent.innerHTML = `
        <h1>Welcome to the Book Reader</h1>
        <p style="color: var(--text-muted);">Could not load <code>book.json</code>. Make sure it exists in the root directory.</p>
        <p>Expected format:</p>
        <pre><code>{
  "title": "Your Book Title",
  "author": "Author Name",
  "chapters": [
    { "id": "ch-01", "title": "Chapter 1", "file": "chapters/chapter-01.html" }
  ]
}</code></pre>
      `;
      hideLoader();
    }
  }


  // ══════════════════════════════════════
  //  CHAPTER LOADING
  // ══════════════════════════════════════

  async function loadChapter(index) {
    if (index < 0 || index >= state.chapters.length) return;

    showLoader();
    state.currentChapter = index;

    const chapter = state.chapters[index];

    try {
      const res = await fetch(`${chapter.file}?v=${new Date().getTime()}`);
      if (!res.ok) throw new Error(`Failed to load ${chapter.file}`);
      const html = await res.text();

      dom.chapterContent.innerHTML = html;
      dom.chapterTitleBar.textContent = chapter.title;

      // Determine current Part based on section markers
      let currentPart = '1';
      for (let i = 0; i <= index; i++) {
        const marker = state.chapters[i].sectionMarker;
        if (marker) {
          if (marker.includes('PART I ')) currentPart = '1';
          if (marker.includes('PART II')) currentPart = '2';
          if (marker.includes('PART III')) currentPart = '3';
        }
      }
      document.body.setAttribute('data-part', currentPart);
      document.body.setAttribute('data-chapter', chapter.id || '');
      applyChapterVisualState(chapter, currentPart);
      repairGeneratedAssetReferences();
      enhanceChapterOpening(chapter, currentPart);

      // Process footnotes
      processFootnotes();
      makeTablesResponsive();

      // Animate progress bars if visible
      requestAnimationFrame(() => {
        animateProgressBars();
        animateOnScroll();
      });

      // Update navigation
      updateNavigation();
      updateTOCActive();
      savePreferences();

      // Scroll to top
      window.scrollTo({ top: 0, behavior: 'instant' });

      // Re-trigger entrance animation
      dom.chapterContent.style.animation = 'none';
      dom.chapterContent.offsetHeight; // force reflow
      dom.chapterContent.style.animation = '';

    } catch (err) {
      dom.chapterContent.innerHTML = `
        <h1>${chapter.title}</h1>
        <p style="color: var(--text-muted);">Could not load chapter file: <code>${chapter.file}</code></p>
        <p>Make sure the file exists in the correct path.</p>
      `;
    }

    hideLoader();
  }

  function showLoader() {
    dom.loader.classList.remove('hidden');
  }

  function hideLoader() {
    dom.loader.classList.add('hidden');
  }

  function getChapterVisualState(chapter, currentPart) {
    const fallback = currentPart === '2'
      ? {
          state: 'Documentary pressure',
          mode: 'Archive',
          evidence: 'Institutional record',
          pressure: 62,
          image: GENERATED_ASSETS.syriacTexture,
          caption: 'Documents, translations, and jurisdiction become the landscape of Part II.',
        }
      : {
          state: 'Historical corridor',
          mode: 'Atlas',
          evidence: 'Route memory',
          image: GENERATED_ASSETS.indianOceanAtlas,
          caption: 'The chapter is situated inside the wider historical atlas.',
        };

    return Object.assign({}, fallback, CHAPTER_VISUAL_STATES[chapter.id] || {});
  }

  function applyChapterVisualState(chapter, currentPart) {
    const visualState = getChapterVisualState(chapter, currentPart);
    document.body.style.setProperty('--chapter-hero-image', `url("${visualState.image}")`);
    document.body.style.setProperty('--chapter-pressure', `${visualState.pressure || 0}%`);
  }

  function repairGeneratedAssetReferences() {
    dom.chapterContent.querySelectorAll('img[src]').forEach((img) => {
      const replacement = GENERATED_SRC_REPLACEMENTS.get(img.getAttribute('src'));
      if (replacement) img.setAttribute('src', replacement);
    });
  }

  function enhanceChapterOpening(chapter, currentPart) {
    const opening = dom.chapterContent.querySelector('.chapter-opening-unit');
    if (!opening || opening.dataset.enhanced === 'true') return;

    const visualState = getChapterVisualState(chapter, currentPart);
    opening.dataset.enhanced = 'true';

    let anchor = opening;
    if (visualState.image) {
      const figure = document.createElement('figure');
      figure.className = 'chapter-visual-plate';
      figure.innerHTML = `
        <img src="${visualState.image}" alt="${visualState.caption || visualState.state}">
        <figcaption>${visualState.caption || visualState.state}</figcaption>
      `;
      anchor.insertAdjacentElement('afterend', figure);
      anchor = figure;
    }

    const statePanel = document.createElement('section');
    statePanel.className = 'chapter-state-panel';
    statePanel.setAttribute('aria-label', 'Chapter historical state');
    statePanel.innerHTML = `
      <div class="chapter-state-item">
        <span>Historical State</span>
        <strong>${visualState.state}</strong>
      </div>
      <div class="chapter-state-corridor" aria-hidden="true">
        <span style="width:${visualState.pressure || 42}%"></span>
      </div>
      <div class="chapter-state-item">
        <span>${currentPart === '2' ? 'Archive Mode' : 'Atlas Mode'}</span>
        <strong>${visualState.mode}</strong>
      </div>
      <div class="chapter-state-item">
        <span>Evidence Layer</span>
        <strong>${visualState.evidence}</strong>
      </div>
    `;
    anchor.insertAdjacentElement('afterend', statePanel);

    if (currentPart === '2') {
      const archiveStack = document.createElement('aside');
      archiveStack.className = 'part2-archive-stack';
      archiveStack.setAttribute('aria-hidden', 'true');
      archiveStack.innerHTML = '<span></span><span></span><span></span>';
      statePanel.insertAdjacentElement('afterend', archiveStack);
    }
  }


  // ══════════════════════════════════════
  //  TABLE OF CONTENTS
  // ══════════════════════════════════════

  function buildTOC() {
    dom.tocList.innerHTML = '';

    let chapterCounter = 1;
    state.chapters.forEach((ch, i) => {
      // If this chapter has a section marker, insert it before the chapter link
      if (ch.sectionMarker) {
        const markerLi = document.createElement('li');
        markerLi.className = 'toc-section-marker';
        markerLi.textContent = ch.sectionMarker;
        dom.tocList.appendChild(markerLi);
      }

      const li = document.createElement('li');
      const a = document.createElement('a');
      a.href = '#';

      const numSpan = document.createElement('span');
      numSpan.className = 'chapter-number';
      
      if (ch.id.startsWith('chapter-')) {
        numSpan.textContent = String(chapterCounter).padStart(2, '0');
        chapterCounter++;
      } else {
        numSpan.textContent = '';
      }

      const titleSpan = document.createElement('span');
      titleSpan.textContent = ch.title;

      a.appendChild(numSpan);
      a.appendChild(titleSpan);

      a.addEventListener('click', (e) => {
        e.preventDefault();
        loadChapter(i);
        closeTOC();
      });

      li.appendChild(a);
      dom.tocList.appendChild(li);
    });

    // Initial check for scroll indicator
    requestAnimationFrame(updateTocScrollIndicator);
  }

  function updateTocScrollIndicator() {
    if (!dom.tocScrollIndicator) return;
    const isScrollable = dom.tocList.scrollHeight > dom.tocList.clientHeight;
    // Use a larger threshold in case of padding/floating point issues
    const isAtBottom = dom.tocList.scrollHeight - Math.ceil(dom.tocList.scrollTop) - dom.tocList.clientHeight <= 20;
    
    if (isScrollable && !isAtBottom) {
      dom.tocScrollIndicator.style.opacity = '1';
    } else {
      dom.tocScrollIndicator.style.opacity = '0';
    }
  }

  function updateTOCActive() {
    const items = dom.tocList.querySelectorAll('li:not(.toc-section-marker)');
    items.forEach((li, i) => {
      li.classList.toggle('active', i === state.currentChapter);
    });
  }

  function openTOC() {
    state.tocOpen = true;
    dom.tocSidebar.classList.add('open');
    dom.tocOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    dom.tocToggle.setAttribute('aria-expanded', 'true');
    // Ensure dimensions are computed before checking scroll state
    setTimeout(updateTocScrollIndicator, 150);
  }

  function closeTOC() {
    state.tocOpen = false;
    dom.tocSidebar.classList.remove('open');
    dom.tocOverlay.classList.remove('active');
    document.body.style.overflow = '';
    dom.tocToggle.setAttribute('aria-expanded', 'false');
  }


  // ══════════════════════════════════════
  //  NAVIGATION
  // ══════════════════════════════════════

  function updateNavigation() {
    dom.prevBtn.disabled = state.currentChapter === 0;
    dom.nextBtn.disabled = state.currentChapter >= state.chapters.length - 1;
    dom.chapterIndicator.textContent = `${state.currentChapter + 1} / ${state.chapters.length}`;
  }


  // ══════════════════════════════════════
  //  SCROLL PROGRESS
  // ══════════════════════════════════════

  function updateScrollProgress() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;

    dom.progressFill.style.width = Math.min(100, Math.max(0, progress)) + '%';
    dom.progressBar.setAttribute('aria-valuenow', Math.round(progress));
  }


  // ══════════════════════════════════════
  //  FONT SIZE
  // ══════════════════════════════════════

  function applyFontSize() {
    document.documentElement.style.setProperty('--font-size-base', state.fontSize + 'px');
  }

  function changeFontSize(delta) {
    const newSize = state.fontSize + delta;
    if (newSize >= FONT_MIN && newSize <= FONT_MAX) {
      state.fontSize = newSize;
      applyFontSize();
      savePreferences();
    }
  }


  // ══════════════════════════════════════
  //  THEME
  // ══════════════════════════════════════

  function applyTheme() {
    document.documentElement.setAttribute('data-theme', state.theme);

    // Update theme icon
    if (state.theme === 'dark') {
      dom.themeIconMoon.style.display = 'none';
      dom.themeIconSun.style.display = 'block';
    } else {
      dom.themeIconMoon.style.display = 'block';
      dom.themeIconSun.style.display = 'none';
    }

    // Update meta theme-color
    const metaTheme = document.querySelector('meta[name="theme-color"]');
    if (metaTheme) {
      const colors = { light: '#FAF6F0', dark: '#141418', sepia: '#F4ECD8' };
      metaTheme.content = colors[state.theme] || colors.light;
    }
  }

  function cycleTheme() {
    const idx = THEMES.indexOf(state.theme);
    state.theme = THEMES[(idx + 1) % THEMES.length];
    applyTheme();
    savePreferences();
  }


  // ══════════════════════════════════════
  //  FOOTNOTES
  // ══════════════════════════════════════

  function processFootnotes() {
    // Find all footnote refs: <a class="footnote-ref" data-footnote="...">
    const refs = dom.chapterContent.querySelectorAll('.footnote-ref');

    refs.forEach((ref) => {
      ref.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        showFootnote(ref);
      });
    });
  }

  function showFootnote(ref) {
    const noteId = ref.getAttribute('data-footnote');
    const noteEl = document.getElementById(noteId);
    const noteContent = noteEl
      ? noteEl.innerHTML
      : ref.getAttribute('data-content') || 'Footnote content not found.';

    dom.footnoteLabel.textContent = 'Footnote ' + (ref.textContent || '');
    dom.footnoteBody.innerHTML = noteContent;

    dom.footnotePopover.classList.add('active');
    dom.footnotePopover.setAttribute('aria-hidden', 'false');
    dom.footnoteBackdrop.classList.add('active');

    // Position for desktop
    if (window.innerWidth >= 768) {
      const rect = ref.getBoundingClientRect();
      const popHeight = dom.footnotePopover.offsetHeight;

      let topPos = rect.bottom + 12;

      // If it overflows the viewport bottom, flip it to show above the footnote reference
      if (topPos + popHeight > window.innerHeight - 20) {
        topPos = rect.top - popHeight - 12;
      }

      // Safety clamp so it doesn't push off the top of the screen either
      if (topPos < 20) {
        topPos = 20;
      }

      dom.footnotePopover.style.top = topPos + 'px';
    } else {
      dom.footnotePopover.style.top = '';
    }

    state.footnoteOpen = true;
  }

  function closeFootnote() {
    dom.footnotePopover.classList.remove('active');
    dom.footnotePopover.setAttribute('aria-hidden', 'true');
    dom.footnoteBackdrop.classList.remove('active');
    dom.footnotePopover.style.top = '';
    dom.footnotePopover.style.bottom = '';
    state.footnoteOpen = false;
  }


  // ══════════════════════════════════════
  //  TABLES
  // ══════════════════════════════════════

  function makeTablesResponsive() {
    const tables = dom.chapterContent.querySelectorAll('.comparison-table');
    tables.forEach(table => {
      const headers = Array.from(table.querySelectorAll('th')).map(th => th.textContent.trim());
      const rows = table.querySelectorAll('tbody tr');
      rows.forEach(row => {
        const cells = row.querySelectorAll('td');
        cells.forEach((cell, i) => {
          if (headers[i]) {
            cell.setAttribute('data-label', headers[i]);
          }
        });
      });
    });
  }

  // ══════════════════════════════════════
  //  MEDIA MODAL
  // ══════════════════════════════════════

  function openMediaModal(url, title = 'Interactive Feature') {
    dom.mediaModalTitle.textContent = title;
    
    // Pass current theme to iframe via URL query parameter for file:// protocol support
    let finalUrl = url;
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    if (finalUrl.includes('?')) {
      finalUrl += `&theme=${currentTheme}`;
    } else {
      finalUrl += `?theme=${currentTheme}`;
    }
    
    dom.mediaModalIframe.src = finalUrl;
    dom.mediaModal.classList.add('active');
    dom.mediaModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    state.mediaOpen = true;
  }

  function closeMediaModal() {
    dom.mediaModal.classList.remove('active');
    dom.mediaModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    setTimeout(() => {
      if (!state.mediaOpen) dom.mediaModalIframe.src = '';
    }, 350); // clear iframe after animation completes
    state.mediaOpen = false;
  }


  // ══════════════════════════════════════
  //  INTERACTIVE MAP HOTSPOTS
  // ══════════════════════════════════════

  function bindMapHotspots() {
    document.addEventListener('click', (e) => {
      const hotspot = e.target.closest('.map-hotspot');
      if (!hotspot) {
        // Close any open tooltips
        $$('.map-tooltip.visible').forEach(t => t.classList.remove('visible'));
        return;
      }

      e.stopPropagation();
      const tooltipId = hotspot.getAttribute('data-tooltip');
      const tooltip = document.getElementById(tooltipId);
      if (tooltip) {
        // Close others first
        $$('.map-tooltip.visible').forEach(t => t.classList.remove('visible'));
        tooltip.classList.add('visible');
      }
    });
  }


  // ══════════════════════════════════════
  //  ANIMATED PROGRESS BARS (Infographics)
  // ══════════════════════════════════════

  function animateProgressBars() {
    const bars = $$('.progress-bar-fill');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const bar = entry.target;
          const target = bar.getAttribute('data-width') || '0';
          bar.style.width = target + '%';
          bar.classList.add('animated');
          observer.unobserve(bar);
        }
      });
    }, { threshold: 0.3 });

    bars.forEach(bar => {
      bar.style.width = '0%';
      observer.observe(bar);
    });
  }

  function animateOnScroll() {
    const elements = $$('.stat-card, .timeline-item, .comparison-side, .chapter-visual-plate, .chapter-state-panel, .part2-archive-stack, .coonan-rupture-panel');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    elements.forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(16px)';
      el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
      observer.observe(el);
    });

    // Cinematic reveals
    const cinematicElements = $$('.documentary-panel, .royal-decree-panel');
    const cinematicObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          cinematicObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    cinematicElements.forEach(el => {
      el.classList.add('cinematic-reveal');
      if (el.classList.contains('royal-decree-panel')) {
        el.classList.add('seal-stamp');
      } else {
        el.classList.add('ink-spread');
      }
      cinematicObserver.observe(el);
    });
  }

  // ══════════════════════════════════════
  //  PERSISTENCE
  // ══════════════════════════════════════

  function savePreferences() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        chapter: state.currentChapter,
        fontSize: state.fontSize,
        theme: state.theme,
      }));
    } catch (e) { /* localStorage unavailable */ }
  }

  function loadPreferences() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const saved = JSON.parse(raw);
        if (saved.fontSize >= FONT_MIN && saved.fontSize <= FONT_MAX) {
          state.fontSize = saved.fontSize;
        }
        if (THEMES.includes(saved.theme)) {
          state.theme = saved.theme;
        }
        return saved;
      }
    } catch (e) { /* ignore */ }
    return {};
  }


  // ══════════════════════════════════════
  //  EVENT BINDING
  // ══════════════════════════════════════

  function bindEvents() {
    // Scroll progress
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          updateScrollProgress();
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });

    // TOC
    dom.tocToggle.addEventListener('click', () => {
      state.tocOpen ? closeTOC() : openTOC();
    });
    dom.tocClose.addEventListener('click', closeTOC);
    dom.tocOverlay.addEventListener('click', closeTOC);
    dom.tocList.addEventListener('scroll', updateTocScrollIndicator, { passive: true });
    window.addEventListener('resize', () => {
      if (state.tocOpen) updateTocScrollIndicator();
    }, { passive: true });

    // Chapter navigation
    dom.prevBtn.addEventListener('click', () => {
      if (state.currentChapter > 0) loadChapter(state.currentChapter - 1);
    });
    dom.nextBtn.addEventListener('click', () => {
      if (state.currentChapter < state.chapters.length - 1) loadChapter(state.currentChapter + 1);
    });

    // Font size
    dom.fontDecrease.addEventListener('click', () => changeFontSize(-FONT_STEP));
    dom.fontIncrease.addEventListener('click', () => changeFontSize(FONT_STEP));

    // Theme
    dom.themeToggle.addEventListener('click', cycleTheme);

    // Footnote close
    dom.footnoteClose.addEventListener('click', closeFootnote);
    dom.footnoteBackdrop.addEventListener('click', closeFootnote);

    // Media modal
    dom.mediaModalClose.addEventListener('click', closeMediaModal);

    // Interactive Feature Cards (Event Delegation)
    document.addEventListener('click', (e) => {
      const card = e.target.closest('.interactive-feature-card');
      if (card) {
        const url = card.getAttribute('data-url');
        const title = card.getAttribute('data-title') || 'Interactive Feature';
        if (url) openMediaModal(url, title);
      }
    });

    // Map hotspots
    bindMapHotspots();

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
      // Escape closes popups
      if (e.key === 'Escape') {
        if (state.mediaOpen) closeMediaModal();
        if (state.footnoteOpen) closeFootnote();
        if (state.tocOpen) closeTOC();
      }

      // Arrow left/right for chapter navigation (only when not in input)
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

      if (e.key === 'ArrowLeft' && !e.ctrlKey && !e.metaKey) {
        if (state.currentChapter > 0) loadChapter(state.currentChapter - 1);
      }
      if (e.key === 'ArrowRight' && !e.ctrlKey && !e.metaKey) {
        if (state.currentChapter < state.chapters.length - 1) loadChapter(state.currentChapter + 1);
      }
    });

    // Touch swipe for chapter navigation
    let touchStartX = 0;
    let touchStartTarget = null;
    const minSwipe = 80;

    document.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
      touchStartTarget = e.target;
    }, { passive: true });

    document.addEventListener('touchend', (e) => {
      const touchEndX = e.changedTouches[0].screenX;
      const diff = touchStartX - touchEndX;

      if (Math.abs(diff) < minSwipe) return;
      if (state.tocOpen || state.footnoteOpen) return;

      // Prevent swiping if the touch started inside a table or scrollable element
      if (touchStartTarget && (touchStartTarget.closest('table') || touchStartTarget.closest('pre'))) {
        return;
      }

      if (diff > 0 && state.currentChapter < state.chapters.length - 1) {
        // Swipe left → next chapter
        loadChapter(state.currentChapter + 1);
      } else if (diff < 0 && state.currentChapter > 0) {
        // Swipe right → previous chapter
        loadChapter(state.currentChapter - 1);
      }
    }, { passive: true });
  }


  // ── Go ──
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
