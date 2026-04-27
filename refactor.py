import os
import re

directory = r"d:\St Thomas Tradition\St-Thomas-Tradition\chapters"

for filename in os.listdir(directory):
    if not filename.endswith(".html") or filename in ["title.html", "Test.html"]:
        continue
        
    filepath = os.path.join(directory, filename)
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
        
    # Extract chapter number
    num_match = re.search(r'chapter-(\d+)', filename)
    num = num_match.group(1) if num_match else ""
    
    # Extract h1 and subtitle
    h1_match = re.search(r'<h1>([\s\S]*?)</h1>', content, re.IGNORECASE)
    sub_match = re.search(r'<p class="chapter-subtitle">([\s\S]*?)</p>', content, re.IGNORECASE)
    
    title = h1_match.group(1).strip() if h1_match else ""
    sub = sub_match.group(1).strip() if sub_match else ""
    
    if title or sub:
        # Remove old ones
        if h1_match:
            content = content.replace(h1_match.group(0), "")
        if sub_match:
            content = content.replace(sub_match.group(0), "")
            
        # Build new header
        header = '<header class="chapter-header">\n'
        if num:
            header += f'  <div class="chapter-number">{num}</div>\n'
        if sub:
            header += f'  <p class="chapter-subtitle">{sub}</p>\n'
        if title:
            header += f'  <h1>{title}</h1>\n'
        header += '</header>\n'
        
        # Insert at top (after any leading HTML comment)
        content = re.sub(r'^(<!--.*?-->\s*)?', r'\g<1>' + header, content, count=1, flags=re.IGNORECASE)
        
    # Blockquote wrap
    bq_pattern = r'(<header class="chapter-header">[\s\S]*?)(<blockquote>[\s\S]*?</blockquote>)'
    content = re.sub(bq_pattern, r'\1<div class="folio-epigraph">\n\2\n</div>', content, count=1, flags=re.IGNORECASE)
    
    # Drop-cap logic: split by <h2>, replace first <p> in the second part
    parts = content.split('<h2>')
    if len(parts) > 1:
        parts[1] = parts[1].replace('<p>', '<p class="drop-cap">', 1)
        content = '<h2>'.join(parts)
        
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

print(f"Processed HTML files.")
