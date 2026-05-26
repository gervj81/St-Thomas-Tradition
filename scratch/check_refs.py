import re

content = open('chapters/chapter-09.html', 'r', encoding='utf-8').read()
refs = re.findall(r'data-footnote="([^"]+)"', content)
print(f"Footnote references in text: {len(refs)}")
print(refs)
