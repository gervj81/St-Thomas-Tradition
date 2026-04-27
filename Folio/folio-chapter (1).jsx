/* global React */
const { useState: useStateFC, useEffect: useEffectFC, useMemo: useMemoFC, useRef: useRefFC } = React;

// ─── Folio chapter renderer: parses real chapter HTML and renders in Folio voice ───
//
// The original chapter HTML uses semantic markers we re-skin:
//   <h1>           — chapter title (we already show it on chapcover, so suppress in body)
//   <p.chapter-subtitle>  — eyebrow line under H1 (also suppress in body)
//   <blockquote>   — epigraph (Pliny etc)
//   <div.infographic> with .timeline > .timeline-item — "Story so far"
//   <div.interactive-feature-card> — map link
//   <div.callout.callout-info|warning|success|danger> — callouts
//   <a.footnote-ref data-footnote="fn-N"> — popover refs
//   <h2>/<h3>/<h4>/<hr>/<p>  — body structure

// Cache parsed chapters
const chapterCache = {};

async function loadChapter(slug) {
  if (chapterCache[slug]) return chapterCache[slug];
  const res = await fetch(`${slug}.html`);
  const html = await res.text();
  // The chapter files are HTML fragments, not full documents
  const doc = new DOMParser().parseFromString(`<div id="root">${html}</div>`, "text/html");
  const root = doc.getElementById("root");
  // Extract footnotes section if present (usually at end as <ol class="footnotes">)
  const footnotes = {};
  // Some chapters use <li id="fn-1">, others have <div class="footnote" id="fn-1">
  root.querySelectorAll('[id^="fn-"]').forEach(el => {
    footnotes[el.id] = el.innerHTML;
  });
  // Remove the footnote container itself from the body so we don't render it inline
  root.querySelectorAll('.footnotes, ol.footnotes, .footnote-section').forEach(el => el.remove());
  chapterCache[slug] = { root, footnotes };
  return chapterCache[slug];
}

// Convert a DOM NodeList of inline content (text + <em>/<strong>/<a>/<a.footnote-ref>) into React children.
function renderInline(nodes, openFn, key = "i") {
  const out = [];
  nodes.forEach((n, i) => {
    if (n.nodeType === 3) {
      out.push(n.nodeValue);
    } else if (n.nodeType === 1) {
      const tag = n.tagName.toLowerCase();
      const k = `${key}-${i}`;
      if (tag === "a" && n.classList.contains("footnote-ref")) {
        const fn = n.getAttribute("data-footnote");
        out.push(
          <span key={k} className="folio-fnref" onClick={() => openFn(fn)}>{n.textContent}</span>
        );
      } else if (tag === "a") {
        out.push(<a key={k} href={n.getAttribute("href")} target="_blank" rel="noopener">{renderInline(n.childNodes, openFn, k)}</a>);
      } else if (tag === "em" || tag === "i") {
        out.push(<em key={k}>{renderInline(n.childNodes, openFn, k)}</em>);
      } else if (tag === "strong" || tag === "b") {
        out.push(<strong key={k}>{renderInline(n.childNodes, openFn, k)}</strong>);
      } else if (tag === "br") {
        out.push(<br key={k}/>);
      } else {
        // unknown inline — render its inner content
        out.push(<span key={k}>{renderInline(n.childNodes, openFn, k)}</span>);
      }
    }
  });
  return out;
}

// Render a single block-level element from the chapter into JSX.
function renderBlock(el, openFn, ctx, key) {
  const tag = el.tagName?.toLowerCase();
  if (!tag) return null;

  // skip the chapter <h1> + .chapter-subtitle — already on chapter cover
  if (tag === "h1") return null;
  if (tag === "p" && el.classList.contains("chapter-subtitle")) return null;

  if (tag === "h2") return <h2 key={key}>{renderInline(el.childNodes, openFn, key)}</h2>;
  if (tag === "h3") return <h3 key={key}>{renderInline(el.childNodes, openFn, key)}</h3>;
  if (tag === "h4") return <h4 key={key}>{renderInline(el.childNodes, openFn, key)}</h4>;
  if (tag === "hr") return <hr key={key}/>;

  if (tag === "p") {
    // first paragraph in body gets dropcap treatment via ctx counter
    if (ctx.firstP) {
      ctx.firstP = false;
      const inline = renderInline(el.childNodes, openFn, key);
      // Pull leading character for dropcap
      const first = inline[0];
      if (typeof first === "string" && first.length) {
        return (
          <p key={key} className="folio-lead">
            <span className="folio-dropcap">{first[0]}</span>
            {first.slice(1)}
            {inline.slice(1)}
          </p>
        );
      }
      return <p key={key} className="folio-lead">{inline}</p>;
    }
    return <p key={key}>{renderInline(el.childNodes, openFn, key)}</p>;
  }

  if (tag === "blockquote") {
    return (
      <div key={key} className="folio-epigraph">
        {Array.from(el.children).map((c, i) =>
          c.tagName.toLowerCase() === "p"
            ? <p key={i}>{renderInline(c.childNodes, openFn, `${key}-${i}`)}</p>
            : null
        )}
      </div>
    );
  }

  if (tag === "div" && el.classList.contains("infographic")) {
    const titleEl = el.querySelector(".infographic-title");
    const items = el.querySelectorAll(".timeline-item");
    const linkEl = el.querySelector("a[href]");
    return (
      <div key={key} className="folio-storyso">
        <div className="folio-storyso-eyebrow">Chronology</div>
        <h5>{titleEl ? cleanInfographicTitle(titleEl.textContent) : "The Story So Far"}</h5>
        {items.length > 0 && (
          <div className="folio-tl">
            {Array.from(items).map((it, i) => {
              const date = it.querySelector(".timeline-date")?.textContent || "";
              const title = it.querySelector(".timeline-title")?.textContent || "";
              const desc = it.querySelector(".timeline-desc")?.textContent || "";
              return (
                <div key={i} className="folio-tl-item">
                  <div className="folio-tl-date">{date}</div>
                  <div className="folio-tl-title">{title}</div>
                  <p className="folio-tl-desc">{desc}</p>
                </div>
              );
            })}
          </div>
        )}
        {linkEl && (
          <div className="folio-storyso-link">
            <a href="#" onClick={(e) => e.preventDefault()}>{linkEl.textContent.trim()}</a>
          </div>
        )}
      </div>
    );
  }

  if (tag === "div" && el.classList.contains("interactive-feature-card")) {
    const title = el.querySelector(".interactive-feature-text h4")?.textContent || el.dataset.title || "Map";
    const desc = el.querySelector(".interactive-feature-text p")?.textContent || "";
    const eyebrow = title.toLowerCase().includes("map") ? "Interactive map" : "Feature";
    const cleanTitle = title.replace(/^Interactive Map:\s*/i, "");
    return (
      <button key={key} className="folio-mapcard" onClick={() => openFn.openMap?.(el.dataset.url, title)} type="button">
        <div className="folio-mapcard-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"/>
            <line x1="9" y1="3" x2="9" y2="18"/>
            <line x1="15" y1="6" x2="15" y2="21"/>
          </svg>
        </div>
        <div className="folio-mapcard-text">
          <div className="folio-mapcard-eyebrow">{eyebrow}</div>
          <div className="folio-mapcard-title">{cleanTitle}</div>
          {desc && <div className="folio-mapcard-desc">{desc}</div>}
        </div>
        <div className="folio-mapcard-arrow">→</div>
      </button>
    );
  }

  if (tag === "div" && el.classList.contains("callout")) {
    let kind = "info";
    if (el.classList.contains("callout-warning")) kind = "warning";
    else if (el.classList.contains("callout-success")) kind = "success";
    else if (el.classList.contains("callout-danger")) kind = "danger";
    const titleEl = el.querySelector(".callout-title");
    const titleText = titleEl ? titleEl.textContent.replace(/^[\s✦✧★●◆]+/, "").trim() : "Note";
    return (
      <aside key={key} className={`folio-callout folio-callout-${kind}`}>
        <div className="folio-callout-title">{titleText}</div>
        {Array.from(el.children).filter(c => !c.classList.contains("callout-title")).map((c, i) => {
          const t = c.tagName.toLowerCase();
          if (t === "p") return <p key={i}>{renderInline(c.childNodes, openFn, `${key}-${i}`)}</p>;
          if (t === "ul") return <ul key={i}>{Array.from(c.children).map((li, j) => <li key={j}>{renderInline(li.childNodes, openFn, `${key}-${i}-${j}`)}</li>)}</ul>;
          return null;
        })}
      </aside>
    );
  }

  // Fallback: skip unknown blocks silently rather than dumping raw HTML
  return null;
}

function cleanInfographicTitle(text) {
  // Strip leading whitespace and the inline SVG label artefacts
  return text.replace(/\s+/g, " ").trim();
}

// Render the chapter's leading epigraph (first <blockquote>) — placed by the host on the cover.
function FolioEpigraph({ slug }) {
  const [data, setData] = useStateFC(null);
  useEffectFC(() => { loadChapter(slug).then(setData).catch(() => {}); }, [slug]);
  if (!data) return null;
  const bq = data.root.querySelector(":scope > blockquote");
  if (!bq) return null;
  const ps = Array.from(bq.children).filter(c => c.tagName.toLowerCase() === "p");
  // Conventionally: first <p> = quote (em), second <p> = attribution (strong)
  const quoteP = ps[0];
  const attrP = ps[1];
  const quoteText = quoteP ? quoteP.textContent.trim().replace(/^[“"]|[”"]$/g, "") : "";
  const attrText = attrP ? attrP.textContent.replace(/^[—–-]\s*/, "").trim() : "";
  return (
    <div className="folio-cover-epigraph">
      <div className="folio-cover-epigraph-mark">“</div>
      <blockquote>{quoteText}</blockquote>
      {attrText && <cite>{attrText}</cite>}
    </div>
  );
}

// Main chapter component
function FolioChapter({ slug, openMap }) {
  const [data, setData] = useStateFC(null);
  const [error, setError] = useStateFC(null);
  const [openFn, setOpenFn] = useStateFC(null); // currently-open footnote id

  useEffectFC(() => {
    setData(null); setError(null); setOpenFn(null);
    loadChapter(slug).then(setData).catch(e => setError(String(e)));
  }, [slug]);

  // close on ESC
  useEffectFC(() => {
    const onKey = (e) => { if (e.key === "Escape") setOpenFn(null); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  if (error) return <p style={{color: "var(--accent)"}}>Could not load chapter: {error}</p>;
  if (!data) return <p style={{color: "var(--ink-2)", fontStyle: "italic"}}>Loading…</p>;

  const open = (fn) => setOpenFn(fn);
  open.openMap = openMap;

  const ctx = { firstP: true, skipFirstBlockquote: true };
  const blocks = Array.from(data.root.children);

  return (
    <>
      {blocks.map((el, i) => {
        // Skip the leading epigraph blockquote — host renders it on the cover
        if (ctx.skipFirstBlockquote && el.tagName?.toLowerCase() === "blockquote") {
          ctx.skipFirstBlockquote = false;
          return null;
        }
        // Once we've passed any non-h1/subtitle content, we're past the cover region.
        if (el.tagName?.toLowerCase() !== "h1"
            && !(el.tagName?.toLowerCase() === "p" && el.classList.contains("chapter-subtitle"))) {
          ctx.skipFirstBlockquote = false;
        }
        return renderBlock(el, open, ctx, `b${i}`);
      })}
      {openFn && data.footnotes[openFn] && (
        <>
          <div className="folio-fnpop-bg" onClick={() => setOpenFn(null)}/>
          <div className="folio-fnpop">
            <div className="folio-fnpop-head">
              <span className="folio-fnpop-label">Note {openFn.replace("fn-", "")}</span>
              <button className="folio-fnpop-close" onClick={() => setOpenFn(null)} aria-label="Close">✕</button>
            </div>
            <div className="folio-fnpop-body" dangerouslySetInnerHTML={{__html: data.footnotes[openFn]}}/>
          </div>
        </>
      )}
    </>
  );
}

window.FolioChapter = FolioChapter;
window.FolioEpigraph = FolioEpigraph;
