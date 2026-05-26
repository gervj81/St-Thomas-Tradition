content = open('chapters/chapter-09.html', 'r', encoding='utf-8').read()
import re
divs = re.findall(r'<div id="(fn-[^"]+)"[^>]*>(.*?)</div>', content, re.DOTALL)
print(f"Footnote divs found: {len(divs)}")
for d_id, d_content in divs:
    print(f"ID: {d_id} -> {d_content.strip()[:100]}...")
