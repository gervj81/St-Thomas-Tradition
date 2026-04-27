import os
import re

directory = r"d:\St Thomas Tradition\St-Thomas-Tradition\chapters"

def title_case(s):
    # Words to not capitalize
    exceptions = ['a', 'an', 'the', 'and', 'but', 'or', 'for', 'nor', 'on', 'at', 'to', 'from', 'by', 'of']
    words = s.split()
    if not words: return s
    
    res = [words[0].capitalize()]
    for word in words[1:]:
        word_lower = word.lower()
        if word_lower in exceptions:
            res.append(word_lower)
        else:
            res.append(word.capitalize())
    return " ".join(res)

for filename in os.listdir(directory):
    if not filename.endswith(".html") or filename in ["title.html", "Test.html"]:
        continue
        
    filepath = os.path.join(directory, filename)
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
        
    # Find the header and epigraph
    header_pattern = r'(<header class="chapter-header">[\s\S]*?</header>)'
    epigraph_pattern = r'(<div class="folio-epigraph">[\s\S]*?</div>)'
    
    # We want to wrap them in <div class="chapter-opening-unit">
    # And convert the <h1> inside header to Title Case
    
    header_match = re.search(header_pattern, content)
    epigraph_match = re.search(epigraph_pattern, content)
    
    if header_match:
        header_text = header_match.group(1)
        
        # Replace h1 with Title Case
        h1_match = re.search(r'<h1>([\s\S]*?)</h1>', header_text)
        if h1_match:
            original_h1 = h1_match.group(1)
            new_h1 = title_case(original_h1.lower())
            header_text = header_text.replace(f'<h1>{original_h1}</h1>', f'<h1>{new_h1}</h1>')
            
        new_header_text = header_text
        
        if epigraph_match:
            epigraph_text = epigraph_match.group(1)
            combined = f'<div class="chapter-opening-unit">\n{new_header_text}\n{epigraph_text}\n</div>'
            
            # Replace old header and epigraph
            content = content.replace(header_match.group(1), "")
            content = content.replace(epigraph_match.group(1), combined)
        else:
            combined = f'<div class="chapter-opening-unit">\n{new_header_text}\n</div>'
            content = content.replace(header_match.group(1), combined)
            
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)

print(f"Processed HTML files for Title Case and wrapper.")
