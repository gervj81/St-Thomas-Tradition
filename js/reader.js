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
      const res = await fetch('book.json');
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


  // ══════════════════════════════════════
  //  TABLE OF CONTENTS
  // ══════════════════════════════════════

  function buildTOC() {
    dom.tocList.innerHTML = '';

    let chapterCounter = 1;
    state.chapters.forEach((ch, i) => {
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
  }

  function updateTOCActive() {
    const items = dom.tocList.querySelectorAll('li');
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
    const elements = $$('.stat-card, .timeline-item, .comparison-side');
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

    document.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
      touchStartTarget = e.target;
    }, { passive: true });

    document.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
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
