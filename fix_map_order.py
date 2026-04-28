# -*- coding: utf-8 -*-
import os
import re

dir_path = r'd:\St Thomas Tradition\St-Thomas-Tradition\chapters'
files = [f for f in os.listdir(dir_path) if f.startswith('chapter-') and f.endswith('.html')]

# The card ends with the arrow div and then the closing div for the card itself.
pattern = re.compile(r'(<h[234][^>]*>.*?</h[234]>)\s*(<div class="interactive-feature-card".*?<div class="interactive-feature-arrow">.*?</div>\s*</div>)\s*(<p.*?>.*?</p>)', re.DOTALL | re.IGNORECASE)
replacement = r'\1\n\n\3\n\n\2\n'

for f in files:
    path = os.path.join(dir_path, f)
    with open(path, 'r', encoding='utf-8') as file:
        content = file.read()
    
    # 1. Elevate The Persian-Arab Axis
    if f == 'chapter-01.html':
        content = content.replace('<h4>The Persian-Arab Axis</h4>', '<h3>The Persian-Arab Axis</h3>')
    
    # Keep replacing until no more matches (if multiple cards in a row, etc, though unlikely)
    new_content = pattern.sub(replacement, content)
    
    if content != new_content:
        with open(path, 'w', encoding='utf-8') as file:
            file.write(new_content)
        print(f"Fixed map order in {f}")
    elif f == 'chapter-01.html':
        # Write anyway to save the Persian-Arab Axis elevation
        with open(path, 'w', encoding='utf-8') as file:
            file.write(new_content)

print("Done.")
