/* global React */
const { useState: useStateFolio, useMemo: useMemoFolio, useEffect: useEffectFolio, useRef: useRefFolio } = React;

// ─── Folio Variation: editorial / magazine ───
function FolioProto() {
  const BOOK = window.BOOK;
  const all = useMemoFolio(() => {
    const list = [];
    BOOK.parts.forEach(p => p.chapters.forEach(id => list.push({ id, partId: p.id, partLabel: p.label, ...BOOK.chapters[id] })));
    return list;
  }, []);

  const [view, setView] = useStateFolio("home"); // home | reader
  const [currentId, setCurrentId] = useStateFolio("chapter-01");
  const [drawerOpen, setDrawerOpen] = useStateFolio(false);
  const [readerOpen, setReaderOpen] = useStateFolio(false);
  const [theme, setTheme] = useStateFolio("paper"); // paper | sepia | night
  const [fontSize, setFontSize] = useStateFolio(18);

  useEffectFolio(() => {
    const root = document.querySelector(".folio-root");
    if (root) {
      root.setAttribute("data-theme", theme);
      root.style.setProperty("--reader-fs", fontSize + "px");
    }
  }, [theme, fontSize]);

  const idx = all.findIndex(c => c.id === currentId);
  const cur = all[idx];

  const open = (id) => { setCurrentId(id); setView("reader"); setDrawerOpen(false); };

  // Numeric label for chapter cover
  const coverNumber = cur && cur.number != null ? String(cur.number).padStart(2,"0") : "—";

  return (
    <div className="folio-root">
      <header className="folio-top">
        <button className="folio-iconbtn" onClick={() => setDrawerOpen(true)} aria-label="Issue">
          <svg width="20" height="14" viewBox="0 0 20 14"><rect y="1" width="20" height="2"/><rect y="6" width="20" height="2"/><rect y="11" width="20" height="2"/></svg>
        </button>
        <div className="folio-masthead" onClick={() => setView("home")}>
          <span className="folio-masthead-w">St. Thomas</span>
          <span className="folio-masthead-i">Tradition</span>
        </div>
        <button className="folio-iconbtn folio-reader-btn" onClick={() => setReaderOpen(o => !o)} aria-label="Reading settings">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><text x="4" y="12" fontFamily="serif" fontSize="10" fill="currentColor" stroke="none">A</text><text x="12" y="17" fontFamily="serif" fontSize="15" fill="currentColor" stroke="none">A</text></svg>
        </button>
      </header>

      {view === "home" ? (
        <main className="folio-home">
          <section className="folio-cover">
            <div className="folio-cover-bg" aria-hidden="true">
              <div className="folio-cover-stripes"/>
            </div>
            <div className="folio-cover-content">
              <div className="folio-eyebrow">A historical investigation in two parts</div>
              <h1 className="folio-cover-title">
                <span>St.</span>
                <span>Thomas</span>
                <span className="folio-cover-amp">&amp;</span>
                <span>the route</span>
                <span>to India.</span>
              </h1>
              <p className="folio-cover-deck">Trade winds, language zones, and the fifteen quiet centuries before Vasco da Gama. A step-by-step reconstruction by Gerald Johnson.</p>
              <div className="folio-cover-cta">
                <button onClick={() => open("preface")}>Begin reading</button>
                <button className="ghost" onClick={() => open("chapter-01")}>Skip to Chapter 01 →</button>
              </div>
            </div>
          </section>

          <section className="folio-feature">
            <div className="folio-feature-label">In this issue</div>
            <h2>Two parts. One thesis.</h2>
            <div className="folio-parts">
              {BOOK.parts.filter(p => p.id !== "front").map(p => (
                <div key={p.id} className="folio-part">
                  <div className="folio-part-no">{p.label}</div>
                  <h3>{p.title}</h3>
                  <p>{p.subtitle}</p>
                  <ul>
                    {p.chapters.filter(id => BOOK.chapters[id].number != null).map(id => {
                      const c = BOOK.chapters[id];
                      return (
                        <li key={id}>
                          <button onClick={() => open(id)}>
                            <span className="folio-li-no">{String(c.number).padStart(2,"0")}</span>
                            <span className="folio-li-title">{c.title}</span>
                            <span className="folio-li-arrow">→</span>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          <section className="folio-pull">
            <div className="folio-pull-mark">"</div>
            <blockquote>Before asking <em>if</em> Thomas went to India, we must first establish <em>how</em> anyone could have gone to India.</blockquote>
            <cite>— from the Preface</cite>
          </section>
        </main>
      ) : (
        <main className="folio-reader">
          <div className="folio-chapcover">
            <div className="folio-chapcover-no">{coverNumber}</div>
            <div className="folio-chapcover-meta">{cur.partLabel} · {cur.subtitle || "Chapter"}</div>
            <h1>{cur.title}</h1>
            {cur.excerpt && <p className="folio-chapcover-deck">{cur.excerpt}</p>}
            {cur.keywords && (
              <div className="folio-tags">{cur.keywords.map(k => <span key={k}>{k}</span>)}</div>
            )}
            {cur.htmlFile && <FolioEpigraph slug={cur.htmlFile}/>}
          </div>
          <article className="folio-article">
            {cur.htmlFile ? (
              <FolioChapter slug={cur.htmlFile} openMap={(url, title) => console.log("open map:", url, title)}/>
            ) : (
              <>
                {cur.paragraphs && cur.paragraphs.map((p, i) => (
                  i === 0 ? (
                    <p key={i} className="folio-lead"><span className="folio-dropcap">{p[0]}</span><span dangerouslySetInnerHTML={{__html: p.slice(1)}}/></p>
                  ) : (
                    <p key={i} dangerouslySetInnerHTML={{__html:p}}/>
                  )
                ))}
                {cur.hasMap && (
                  <figure className="folio-figure">
                    <div className="folio-figure-img" aria-hidden="true">
                      <span className="folio-figure-placeholder">[ interactive map of {cur.title.toLowerCase()} ]</span>
                    </div>
                    <figcaption>Fig. {cur.number}.1 — Tap to explore the {cur.title.toLowerCase()}.</figcaption>
                  </figure>
                )}
              </>
            )}
          </article>
          <nav className="folio-nav">
            <button onClick={() => idx > 0 && setCurrentId(all[idx-1].id)} disabled={idx === 0}>
              <span className="folio-nav-eyebrow">Previous</span>
              <span className="folio-nav-title">{idx > 0 ? all[idx-1].title : "—"}</span>
            </button>
            <button onClick={() => idx < all.length-1 && setCurrentId(all[idx+1].id)} disabled={idx === all.length-1}>
              <span className="folio-nav-eyebrow">Next</span>
              <span className="folio-nav-title">{idx < all.length-1 ? all[idx+1].title : "—"}</span>
            </button>
          </nav>
        </main>
      )}

      {readerOpen && (
        <div className="folio-reader-popover">
          <div className="folio-rp-section">
            <div className="folio-rp-label">Theme</div>
            <div className="folio-rp-themes">
              {[["paper","Paper"],["sepia","Sepia"],["night","Night"]].map(([id, name]) => (
                <button key={id} className={`folio-rp-theme ${theme===id?"active":""} folio-rp-theme-${id}`} onClick={() => setTheme(id)}>
                  <span className="folio-rp-swatch"/>
                  <span>{name}</span>
                </button>
              ))}
            </div>
          </div>
          <div className="folio-rp-section">
            <div className="folio-rp-label">Text size</div>
            <div className="folio-rp-fs">
              <button onClick={() => setFontSize(s => Math.max(14, s-1))} disabled={fontSize<=14}>A<sub>−</sub></button>
              <div className="folio-rp-fs-val">{fontSize}px</div>
              <button onClick={() => setFontSize(s => Math.min(24, s+1))} disabled={fontSize>=24}>A<sup>+</sup></button>
            </div>
          </div>
        </div>
      )}
      {readerOpen && <div className="folio-rp-bg" onClick={() => setReaderOpen(false)}/>}
      {drawerOpen && <div className="folio-drawer-bg" onClick={() => setDrawerOpen(false)}/>}
      <aside className={`folio-drawer ${drawerOpen ? "open" : ""}`}>
        <div className="folio-drawer-head">
          <span>Issue contents</span>
          <button onClick={() => setDrawerOpen(false)}>✕</button>
        </div>
        <div className="folio-drawer-body">
          {BOOK.parts.map(p => (
            <div key={p.id} className="folio-drawer-part">
              <div className="folio-drawer-partlabel">{p.label}{p.title ? ` · ${p.title}` : ""}</div>
              {p.chapters.map(id => {
                const c = BOOK.chapters[id];
                return (
                  <button key={id} className={`folio-drawer-item ${id === currentId && view==='reader' ? "active" : ""}`} onClick={() => open(id)}>
                    <span className="folio-drawer-no">{c.number != null ? String(c.number).padStart(2,"0") : "·"}</span>
                    <span>{c.title}</span>
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </aside>
    </div>
  );
}

window.FolioProto = FolioProto;
