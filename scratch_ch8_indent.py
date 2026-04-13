import re

html_path = r'd:\Anti book\St-Thomas-Tradition\chapters\chapter-08.html'
with open(html_path, 'r', encoding='utf-8') as f:
    html = f.read()

new_summary = '''<summary>
      <svg class="toggle-icon" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="9 18 15 12 9 6"></polyline>
      </svg>
      <svg width="22" height="22" style="margin-right:10px;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
        <path d="M7 19v-8a5 5 0 0 1 10 0v8"></path>
        <path d="M5 19h14"></path>
        <path d="M12 9v5"></path>
        <path d="M10 11h4"></path>
      </svg>
      The Tomb at Mylapore: Claim, Record, and Historical Reckoning
    </summary>'''

old_pattern = r'<summary>\s*<svg.*?<\/summary>'

html = re.sub(old_pattern, new_summary, html, flags=re.DOTALL)

with open(html_path, 'w', encoding='utf-8') as f:
    f.write(html)

print('Updated nicely.')
