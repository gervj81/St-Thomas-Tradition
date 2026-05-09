import re

css_path = r"d:\Anti book\St-Thomas-Tradition\css\reader.css"

with open(css_path, "r", encoding="utf-8") as f:
    css = f.read()

# 1. Dial back texture opacity slightly
css = re.sub(
    r"(--bg-image:\s*url\('\.\./images/textures/Part1a background\.png'\);\s*\n\s*--texture-opacity:\s*)0\.15;",
    r"\g<1>0.08;",
    css
)

css = re.sub(
    r"(--bg-image:\s*url\('\.\./images/textures/Part1a background\.png'\);\s*\n\s*--texture-opacity:\s*)0\.10;",
    r"\g<1>0.06;",
    css
)

# 2. Make the mask fade much longer for a softer blend
# Old mask: mask-image: linear-gradient(to bottom, transparent 0%, black 10%, black 90%, transparent 100%);
new_mask = """  -webkit-mask-image: linear-gradient(to bottom, transparent 0%, black 15%, black 65%, transparent 100%);
  mask-image: linear-gradient(to bottom, transparent 0%, black 15%, black 65%, transparent 100%);"""

css = re.sub(
    r"-webkit-mask-image:\s*linear-gradient\(to bottom,\s*transparent 0%,\s*black 10%,\s*black 90%,\s*transparent 100%\);\s*\n\s*mask-image:\s*linear-gradient\(to bottom,\s*transparent 0%,\s*black 10%,\s*black 90%,\s*transparent 100%\);",
    new_mask,
    css
)

# 3. Update the sunlit gradient to match the longer fade
# From: background: linear-gradient(to bottom, rgba(10, 5, 0, 0.25) 0%, transparent 50%, rgba(10, 5, 0, 0.25) 100%);
# To: background: linear-gradient(to bottom, rgba(10, 5, 0, 0.15) 0%, transparent 30%, transparent 65%, rgba(10, 5, 0, 0.15) 100%);
# This ensures the dark overlay is also very soft.
new_sunlit = "background: linear-gradient(to bottom, rgba(10, 5, 0, 0.15) 0%, transparent 20%, transparent 65%, rgba(10, 5, 0, 0.15) 100%);"
css = re.sub(
    r"background:\s*linear-gradient\(to bottom,\s*rgba\(10, 5, 0, 0\.25\)\s*0%,\s*transparent 50%,\s*rgba\(10, 5, 0, 0\.25\)\s*100%\);",
    new_sunlit,
    css
)


with open(css_path, "w", encoding="utf-8") as f:
    f.write(css)

print("Hero blend and opacity fixed!")
