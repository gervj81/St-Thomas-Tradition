import re

for ch in range(5, 13):
    path = f'chapters/chapter-{ch:02d}.html'
    content = open(path, 'r', encoding='utf-8').read()
    
    # Find all documentary panels or archival letters
    # e.g., <div class="documentary-panel ..."> ... </div>
    # Let's find their content
    panels = re.findall(r'<div class=["\'][^"\']*(?:documentary-panel|archival-letter)[^"\']*["\'].*?>.*?</div>', content, re.DOTALL)
    for idx, panel in enumerate(panels):
        # Print the first 50 chars of text inside
        print(f"Ch {ch:02d} Panel {idx+1}: {panel[:100]} ... {panel[-100:]}")
