import os

ch2_path = 'd:/Anti book/St-Thomas-Tradition/chapters/chapter-02.html'
if not os.path.exists(ch2_path):
    print(f"Error: {ch2_path} not found.")
    exit(1)

print("Reading chapter-02.html...")
with open(ch2_path, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Synthesis/Calamina in "The Convergence"
old_convergence = 'Isidore of Seville (c. 636) synthesises the Parthian and Indian itineraries into a sequential narrative, consolidating "Calaminia, a city of India" within Latin reference literature.'
new_convergence = 'Isidore of Seville (c. 636) synthesises the Parthian and Indian itineraries into a sequential narrative in his dedicated apostolic biographical catalog, <em>De Ortu et Obitu Patrum</em> (On the Birth and Death of the Fathers, § 73), consolidating "Calaminia, a city of India" within Latin reference literature.'

if old_convergence in content:
    content = content.replace(old_convergence, new_convergence)
    print("Successfully replaced Isidore convergence text.")
else:
    print("Warning: Isidore convergence text pattern not found or already replaced.")

# 2. Table attestation
old_table = '        <td data-label="First Secure Attestation">Isidore of Seville, c. 636 CE</td>'
new_table = '        <td data-label="First Secure Attestation">Isidore of Seville (<em>De Ortu et Obitu Patrum</em>), c. 636 CE</td>'

if old_table in content:
    content = content.replace(old_table, new_table)
    print("Successfully replaced table attestation text.")
else:
    print("Warning: Table attestation text pattern not found or already replaced.")

# 3. Etymologiae reference at the end of chapter 2
old_etymologiae = 'compiling his <em>Etymologiae</em>\u2014and recording Thomas\u2019s martyrdom in India\u2014the geopolitical map'
new_etymologiae = 'compiling his encyclopedic <em>Etymologiae</em>\u2014having recently recorded Thomas\u2019s martyrdom in India in his biographical <em>De Ortu et Obitu Patrum</em>\u2014the geopolitical map'

if old_etymologiae in content:
    content = content.replace(old_etymologiae, new_etymologiae)
    print("Successfully replaced Etymologiae text.")
else:
    # Try with raw string representation if there are slight character mismatches
    print("Trying alternative string match for Etymologiae...")
    alt_old = 'compiling his <em>Etymologiae</em>—and recording Thomas’s martyrdom in India—the geopolitical map'
    alt_new = 'compiling his encyclopedic <em>Etymologiae</em>—having recently recorded Thomas’s martyrdom in India in his biographical <em>De Ortu et Obitu Patrum</em>—the geopolitical map'
    if alt_old in content:
        content = content.replace(alt_old, alt_new)
        print("Successfully replaced Etymologiae text using alternative pattern.")
    else:
        print("Error: Etymologiae text pattern not found.")

# Save changes
with open(ch2_path, 'w', encoding='utf-8') as f:
    f.write(content)
print("Saved chapter-02.html successfully.")
