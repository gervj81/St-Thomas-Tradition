import os
import re

content = open('chapters/chapter-09.html', 'r', encoding='utf-8').read()
footnotes = re.findall(r'<div id="fn-[^"]+"[^>]*>(.*?)</div>', content, re.DOTALL)
print(f"Total footnotes: {len(footnotes)}")
for idx, fn in enumerate(footnotes[:40]):
    cleaned = re.sub(r'\s+', ' ', fn.strip())
    print(f"{idx+1}: {cleaned[:120]}...")
