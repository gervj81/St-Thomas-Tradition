import re

# 1. Update CSS
css_path = r'd:\Anti book\St-Thomas-Tradition\css\reader.css'
with open(css_path, 'r', encoding='utf-8') as f:
    css = f.read()

# Strip any existing direct quote CSS block
css = re.sub(r'/\*.*?Direct Quotations.*?\*/.*?(?=\Z|/\*|$)', '', css, flags=re.DOTALL | re.IGNORECASE)

# Append new clean CSS
new_css = """
/* ── Direct Quotations (In-text citations) ── */
#chapter-content blockquote.direct-quote {
  position: relative;
  font-family: var(--font-heading);
  font-size: 1.15rem;
  margin: 2.5em 0;
  padding: 10px 45px;
  border: none !important;
  background: transparent !important;
  color: var(--text-primary);
  font-style: italic;
  border-radius: 0;
}

#chapter-content blockquote.direct-quote::before {
  content: '“';
  position: absolute;
  left: 0;
  top: -15px;
  font-family: var(--font-heading);
  font-size: 4.5rem;
  color: var(--accent);
  opacity: 0.35;
  line-height: 1;
}

#chapter-content blockquote.direct-quote::after {
  content: '”';
  position: absolute;
  right: 0;
  bottom: -40px;
  font-family: var(--font-heading);
  font-size: 4.5rem;
  color: var(--accent);
  opacity: 0.35;
  line-height: 1;
}

[data-theme="dark"] #chapter-content blockquote.direct-quote::before,
[data-theme="dark"] #chapter-content blockquote.direct-quote::after {
  color: var(--text-muted);
}
"""

with open(css_path, 'w', encoding='utf-8') as f:
    f.write(css.strip() + '\n\n' + new_css.strip() + '\n')

# 2. Strip single quotes from HTML
html_path = r'd:\Anti book\St-Thomas-Tradition\chapters\chapter-08.html'
with open(html_path, 'r', encoding='utf-8') as f:
    html = f.read()

def clean_quote(m):
    inner = m.group(1).strip()
    # Strip single quotes at start
    inner = re.sub(r"^'", '', inner)
    # Strip single quote at end, even before a footnote anchor
    inner = re.sub(r"'(?=\s*<a)|'$", '', inner)
    return f'<blockquote class="direct-quote"><p>{inner}</p></blockquote>'

html = re.sub(r'<blockquote class="direct-quote">\s*<p>(.*?)</p>\s*</blockquote>', clean_quote, html, flags=re.DOTALL)

with open(html_path, 'w', encoding='utf-8') as f:
    f.write(html)

print("Done")
