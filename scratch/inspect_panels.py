import re

def inspect_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    print(f"=== {filepath} ===")
    matches = re.finditer(r'<div\s+class="([^"]*panel[^"]*)"[^>]*>(.*?)</div>', content, re.DOTALL)
    for m in matches:
        cls = m.group(1)
        inner = m.group(2).strip()
        print(f"Class: {cls}")
        print(f"Content snippet: {inner[:200]}")
        print("-" * 40)

inspect_file('chapters/chapter-08.html')
inspect_file('chapters/chapter-09.html')
