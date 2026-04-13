import re

html_path = r'd:\Anti book\St-Thomas-Tradition\chapters\chapter-08.html'
with open(html_path, 'r', encoding='utf-8') as f:
    html = f.read()

new_summary = '''<details class="infographic-container">
<summary>
<svg class="toggle-icon" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
<polyline points="9 18 15 12 9 6"></polyline>
</svg>
<svg width="22" height="22" style="margin-right:10px;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
<path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
</svg>
The Tomb at Mylapore: Claim, Record, and Historical Reckoning
</summary>'''

# The previous block looked like:
# <details class="infographic-container" open>
# <summary>
# <svg class="toggle-icon" ...
# <span style="...">...</span>
# </summary>

old_pattern = r'<details class="infographic-container"\s*open>\s*<summary>.*?<\/summary>'

html = re.sub(old_pattern, new_summary, html, flags=re.DOTALL)

with open(html_path, 'w', encoding='utf-8') as f:
    f.write(html)

print('Summary replaced.')
