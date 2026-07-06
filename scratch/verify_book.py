import json
import os
import re

def verify_book():
    print("Checking book.json...")
    with open("book.json", encoding="utf-8") as f:
        book = json.load(f)
        
    print(f"Book Title: {book['title']}")
    print(f"Total entries: {len(book['chapters'])}")
    
    all_ok = True
    for entry in book['chapters']:
        file_path = entry['file']
        exists = os.path.exists(file_path)
        if not exists:
            print(f"ERROR: {file_path} does not exist.")
            all_ok = False
            continue
            
        # Verify HTML file syntax and footnotes
        with open(file_path, encoding="utf-8") as hf:
            html = hf.read()
            
        # Look for [TODO: or other markers
        todos = re.findall(r"\[TODO:?.*?\]", html)
        if todos:
            print(f"   WARNING: TODOs found in {file_path}: {todos}")
            all_ok = False
            
        # Verify footnote markers vs footnote content divs
        footnote_refs = re.findall(r'data-footnote="([^"]+)"', html)
        footnote_divs = re.findall(r'id="([^"]+)"\s+style="display:none;"', html)
        
        # Check duplicate divs
        if len(footnote_divs) != len(set(footnote_divs)):
            print(f"   ERROR: Duplicate footnote divs in {file_path}")
            all_ok = False
            
        # Check that every ref has a corresponding div
        div_set = set(footnote_divs)
        missing_divs = [r for r in footnote_refs if r not in div_set]
        if missing_divs:
            print(f"   ERROR: Footnote references missing definitions in {file_path}: {missing_divs}")
            all_ok = False
            
        # Verify Chapter 18 specifically
        if "chapter-18" in file_path:
            print(f"Checking {file_path} footnotes specifically:")
            print(f"   Refs found: {footnote_refs}")
            print(f"   Divs found: {footnote_divs}")
            if len(footnote_refs) != 13 or len(footnote_divs) != 13:
                print(f"   ERROR: Chapter 18 should have exactly 13 footnotes. Found refs: {len(footnote_refs)}, divs: {len(footnote_divs)}")
                all_ok = False
            else:
                print("   Chapter 18 footnote counts are correct (13).")
                
    if all_ok:
        print("VERIFICATION SUCCESSFUL: Book configuration and HTML assets are sound.")
    else:
        print("VERIFICATION FAILED: Resolve the errors listed above.")

if __name__ == '__main__':
    verify_book()
