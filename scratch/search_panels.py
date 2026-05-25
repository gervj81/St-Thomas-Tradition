import os
import re

classes = ['documentary-panel', 'archival-panel', 'archival-letter']
for root, dirs, files in os.walk('chapters'):
    for f in sorted(files):
        if f.endswith('.html'):
            path = os.path.join(root, f)
            with open(path, 'r', encoding='utf-8') as file:
                lines = file.readlines()
            for idx, line in enumerate(lines):
                for cls in classes:
                    if cls in line:
                        print(f"{f}:{idx+1}: {line.strip()}")
