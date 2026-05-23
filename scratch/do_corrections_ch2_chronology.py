import os

ch2_path = 'd:/Anti book/St-Thomas-Tradition/chapters/chapter-02.html'
if not os.path.exists(ch2_path):
    print(f"Error: {ch2_path} not found.")
    exit(1)

print("Reading chapter-02.html...")
with open(ch2_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Target paragraph around line 664
# We will replace it with the new chronologically-correct, evocative paragraph.
old_paragraph_part = "<p>Let us return briefly to 636 CE Spain. The Western Roman Empire had collapsed over a century and a half earlier, leaving the Latin West fractured into Germanic kingdoms. Yet, while Isidore of Seville sits"

# Let's find the exact bounds of the paragraph starting with "<p>Let us return briefly to" and ending with "Portuguese maritime expansion.</p>"
import re
match = re.search(r'<p>Let us return briefly to 636 CE Spain\..*?Portuguese maritime expansion\.</p>', content, re.DOTALL)
if match:
    old_full_paragraph = match.group(0)
    new_full_paragraph = """<p>Let us return briefly to the watershed year of 636 CE. In the spring of that year, in Visigothic Spain, Isidore of Seville passed away, leaving behind a monumental legacy of Latin reference works that anchored the memory of Thomas’s Indian mission within Western literature. Yet, even as these final compilations were beginning to circulate in a fractured West, the geopolitical map of the East was being violently redrawn. Months later, in the late summer of that same year, at the Battle of Yarmouk, the forces of the first Islamic caliphate shattered Byzantine control in Syria, opening the Levant to a new dispensation. Within a generation, this expanding power would swallow the Sasanian Empire whole, and within a century it would reach the shores of Spain. Through these upheavals we will travel in the next chapter, following the tomb tradition as it passes through centuries of Islamic rule, Mongol disruption, and Portuguese maritime expansion.</p>"""
    content = content.replace(old_full_paragraph, new_full_paragraph)
    print("Successfully replaced paragraph with the chronologically corrected version.")
else:
    print("Error: Could not locate the target paragraph in chapter-02.html using regex.")

# Save changes
with open(ch2_path, 'w', encoding='utf-8') as f:
    f.write(content)
print("Saved chapter-02.html successfully.")
