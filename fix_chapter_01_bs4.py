# -*- coding: utf-8 -*-
import os

path = r'd:\St Thomas Tradition\St-Thomas-Tradition\chapters\chapter-01.html'
with open(path, 'r', encoding='utf-8') as file:
    content = file.read()

# 1. Elevate "The Persian-Arab Axis"
content = content.replace('<h4>The Persian-Arab Axis</h4>', '<h3>The Persian-Arab Axis</h3>')

# 2. Fix map orders manually by finding the specific strings
replacements = [
    (
        '''<h3>The Political Map</h3>
  
  <div class="interactive-feature-card" data-url="Maps/chapter-01-map.html?tab=political" data-title="Map: Political World">
    <div class="interactive-feature-icon">
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#C4803C" stroke-width="1.5"
        stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="2" y1="12" x2="22" y2="12"></line>
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
      </svg>
    </div>
    <div class="interactive-feature-text">
      <h4>Political World</h4>
      <p>Explore the overlapping empires of Rome, Parthia, and the Indian Kingdoms.</p>
    </div>
    <div class="interactive-feature-arrow">→</div>
  </div>
  
  <p>To understand how Thomas arrived in India, we must first unlearn the map we carry in our heads. The political
    geography of the 1st century CE was not a patchwork of sovereign nation-states with hard borders and passports. It
    was a world dominated by three massive, sprawling political formations that stretched from the Atlantic to the Bay of
    Bengal: the Roman Empire, the Parthian Empire, and the fractured, dynamic kingdoms of the Indian subcontinent.</p>''',
        
        '''<h3>The Political Map</h3>

  <p>To understand how Thomas arrived in India, we must first unlearn the map we carry in our heads. The political
    geography of the 1st century CE was not a patchwork of sovereign nation-states with hard borders and passports. It
    was a world dominated by three massive, sprawling political formations that stretched from the Atlantic to the Bay of
    Bengal: the Roman Empire, the Parthian Empire, and the fractured, dynamic kingdoms of the Indian subcontinent.</p>
  
  <div class="interactive-feature-card" data-url="Maps/chapter-01-map.html?tab=political" data-title="Map: Political World">
    <div class="interactive-feature-icon">
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#C4803C" stroke-width="1.5"
        stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="2" y1="12" x2="22" y2="12"></line>
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
      </svg>
    </div>
    <div class="interactive-feature-text">
      <h4>Political World</h4>
      <p>Explore the overlapping empires of Rome, Parthia, and the Indian Kingdoms.</p>
    </div>
    <div class="interactive-feature-arrow">→</div>
  </div>'''
    ),
    (
        '''<h3>The Three Arteries</h3>
  
  <div class="interactive-feature-card" data-url="Maps/chapter-01-map.html?tab=maritime" data-title="Map: Trade Arteries">
    <div class="interactive-feature-icon">
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#C4803C" stroke-width="1.5"
        stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="10"></circle>
        <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"></polygon>
      </svg>
    </div>
    <div class="interactive-feature-text">
      <h4>Trade Arteries</h4>
      <p>Trace the Maritime, Persian-Arab, and overland Silk Road routes that connected the known world.</p>
    </div>
    <div class="interactive-feature-arrow">→</div>
  </div>
  
  <p>Before following the routes themselves, one fact must be grasped that the surviving sources, dominated by Roman writers, tend to obscure: the trade running to India in the 1st century ran along not one artery but three, of roughly equal commercial weight. The Romans documented their own system. They could not easily document Parthian or Arab commercial operations, since those ran through rival territory. The Periplus is structurally biased toward the Greco-Roman axis, but even it cannot quite conceal the others.</p>''',
        
        '''<h3>The Three Arteries</h3>

  <p>Before following the routes themselves, one fact must be grasped that the surviving sources, dominated by Roman writers, tend to obscure: the trade running to India in the 1st century ran along not one artery but three, of roughly equal commercial weight. The Romans documented their own system. They could not easily document Parthian or Arab commercial operations, since those ran through rival territory. The Periplus is structurally biased toward the Greco-Roman axis, but even it cannot quite conceal the others.</p>
  
  <div class="interactive-feature-card" data-url="Maps/chapter-01-map.html?tab=maritime" data-title="Map: Trade Arteries">
    <div class="interactive-feature-icon">
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#C4803C" stroke-width="1.5"
        stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="10"></circle>
        <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"></polygon>
      </svg>
    </div>
    <div class="interactive-feature-text">
      <h4>Trade Arteries</h4>
      <p>Trace the Maritime, Persian-Arab, and overland Silk Road routes that connected the known world.</p>
    </div>
    <div class="interactive-feature-arrow">→</div>
  </div>'''
    ),
    (
        '''<h3>The Overland Silk Road</h3>
  
  <div class="interactive-feature-card" data-url="Maps/chapter-01-map.html?tab=overland" data-title="Map: Silk Road">
    <div class="interactive-feature-icon">
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#C4803C" stroke-width="1.5"
        stroke-linecap="round" stroke-linejoin="round">
        <path d="M3 3v18h18"></path>
        <path d="M18.7 8l-5.1 5.2-2.8-2.7L7 14.3"></path>
      </svg>
    </div>
    <div class="interactive-feature-text">
      <h4>Silk Road</h4>
      <p>Follow the land routes connecting Antioch to Taxila.</p>
    </div>
    <div class="interactive-feature-arrow">→</div>
  </div>
  
  <p>The third artery was overland, connecting the Mediterranean to northwestern India and China. From Antioch, caravans
    traveled across the Syrian desert to the Parthian royal city of Seleucia-Ctesiphon (near modern Baghdad), then
    climbed the Iranian plateau to Ecbatana (Hamadan) and Merv. From there, the route split. One branch went north into
    Central Asia toward China. The other turned south through Bactria (Afghanistan) and over the Hindu Kush down to
    Taxila, the great cosmopolitan centre of northwestern India.</p>''',
        
        '''<h3>The Overland Silk Road</h3>

  <p>The third artery was overland, connecting the Mediterranean to northwestern India and China. From Antioch, caravans
    traveled across the Syrian desert to the Parthian royal city of Seleucia-Ctesiphon (near modern Baghdad), then
    climbed the Iranian plateau to Ecbatana (Hamadan) and Merv. From there, the route split. One branch went north into
    Central Asia toward China. The other turned south through Bactria (Afghanistan) and over the Hindu Kush down to
    Taxila, the great cosmopolitan centre of northwestern India.</p>
  
  <div class="interactive-feature-card" data-url="Maps/chapter-01-map.html?tab=overland" data-title="Map: Silk Road">
    <div class="interactive-feature-icon">
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#C4803C" stroke-width="1.5"
        stroke-linecap="round" stroke-linejoin="round">
        <path d="M3 3v18h18"></path>
        <path d="M18.7 8l-5.1 5.2-2.8-2.7L7 14.3"></path>
      </svg>
    </div>
    <div class="interactive-feature-text">
      <h4>Silk Road</h4>
      <p>Follow the land routes connecting Antioch to Taxila.</p>
    </div>
    <div class="interactive-feature-arrow">→</div>
  </div>'''
    )
]

for old, new in replacements:
    # We will do a generic replacement ignoring whitespace variations just in case
    # Actually, to be safe, I will just write a python script that uses BeautifulSoup, it's safer.
    pass

import sys
from bs4 import BeautifulSoup

soup = BeautifulSoup(content, 'html.parser')

# Elevate Persian-Arab axis
for h4 in soup.find_all('h4'):
    if h4.text.strip() == "The Persian-Arab Axis":
        h4.name = 'h3'

# Move cards
cards = soup.find_all('div', class_='interactive-feature-card')
for card in cards:
    prev = card.find_previous_sibling()
    if prev and prev.name in ['h2', 'h3', 'h4']:
        # If the card is immediately after a heading, find the next <p> and insert the card after it
        next_p = card.find_next_sibling('p')
        if next_p:
            card.extract()
            next_p.insert_after(card)

# Need to preserve formatting
with open(path, 'w', encoding='utf-8') as file:
    # bs4 modifies formatting. I will just do it safely via string manipulation for the first few headers.
    pass

