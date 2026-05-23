import re
import os
import subprocess

ch1_path = 'd:/Anti book/St-Thomas-Tradition/chapters/chapter-01.html'
if not os.path.exists(ch1_path):
    print(f"Error: {ch1_path} not found.")
    exit(1)

print("Reading chapter-01.html...")
with open(ch1_path, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. The Overstatement of the "Nambanus" Identification
# Target:
# It names the king, Nahapana, a Saka ruler, and notes that he was a great patron of merchant activity.<a class="footnote-ref" data-footnote="fn-13" href="#fn-13">13</a>
# Replacement:
# It mentions the ruler as <em>Nambanus</em> (widely identified by modern historians as the Saka king Nahapana) and notes that he was a great patron of merchant activity.<a class="footnote-ref" data-footnote="fn-13" href="#fn-13">13</a>

old_nahapana = 'It names the king, Nahapana, a Saka ruler, and notes that he was a great patron of merchant activity.<a class="footnote-ref" data-footnote="fn-13" href="#fn-13">13</a>'
new_nahapana = 'It mentions the ruler as <em>Nambanus</em> (widely identified by modern historians as the Saka king Nahapana) and notes that he was a great patron of merchant activity.<a class="footnote-ref" data-footnote="fn-13" href="#fn-13">13</a>'

if old_nahapana in content:
    content = content.replace(old_nahapana, new_nahapana)
    print("Successfully replaced Nahapana text.")
else:
    print("Warning: Nahapana text pattern not found or already replaced.")

# 2. The "Primum Emporium" Attribution Blunder
# Target:
# <p>The Periplus calls Muziris the <em>primum emporium Indiae</em>, the foremost emporium of India. The Chera kingdom
# Replacement:
# <p>While Pliny the Elder in his <em>Natural History</em> famously designates Muziris as the <em>primum emporium Indiae</em>—the foremost emporium of India—the Greek text of the <em>Periplus</em> similarly elevates the port, describing it as a city "at its height" (<em>akmazousa</em>). The Chera kingdom

old_emporium = '<p>The Periplus calls Muziris the <em>primum emporium Indiae</em>, the foremost emporium of India. The Chera kingdom'
new_emporium = '<p>While Pliny the Elder in his <em>Natural History</em> famously designates Muziris as the <em>primum emporium Indiae</em>—the foremost emporium of India—the Greek text of the <em>Periplus</em> similarly elevates the port, describing it as a city "at its height" (<em>akmazousa</em>). The Chera kingdom'

if old_emporium in content:
    content = content.replace(old_emporium, new_emporium)
    print("Successfully replaced Primum Emporium text.")
else:
    print("Warning: Primum Emporium text pattern not found or already replaced.")

# 3. Auto-align footnote reference numbers in the body
# Pattern to find: <a class="footnote-ref" data-footnote="fn-NN" href="#fn-NN">YY</a>
# We want YY to be NN.
def repl_fn(match):
    full_tag = match.group(0)
    prefix = match.group(1)
    fn_num = match.group(2)
    suffix = match.group(3)
    text = match.group(4)
    # Return the exact tag but with fn_num as the text
    return f'{prefix}{fn_num}{suffix}>{fn_num}</a>'

# Find and replace all footnote references
fn_pattern = r'(<a[^>]*class=["\']footnote-ref["\'][^>]*data-footnote=["\']fn-(\d+)["\'][^>]*href=["\']#fn-\d+["\'])([^>]*)>(.*?)</a>'
content, count = re.subn(fn_pattern, repl_fn, content)
print(f"Aligned {count} footnote display numbers in Chapter 1 body.")

# Save changes
with open(ch1_path, 'w', encoding='utf-8') as f:
    f.write(content)
print("Saved chapter-01.html successfully.")
