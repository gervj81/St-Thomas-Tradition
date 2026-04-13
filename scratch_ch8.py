import re

html_path = r'd:\Anti book\St-Thomas-Tradition\chapters\chapter-08.html'
with open(html_path, 'r', encoding='utf-8') as f:
    html = f.read()

new_block = '''<details class="infographic-container" open>
<summary>
<svg class="toggle-icon" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>
<span style="font-weight:700; color:var(--text-primary); letter-spacing:-0.01em;">The Tomb at Mylapore: Claim, Record, and Historical Reckoning</span>
</summary>
<div class="infographic-content">
  <div class="infographic-grid">
    
    <div class="infographic-card gold-border">
      <h4>The Portuguese Claim & Its Record</h4>
      <ul class="infographic-list">
        <li><strong>Royal Initiative (1523):</strong> Under King João III, the Crown Factor Manuel de Frias arrives at Mylapore to assert Portuguese control over the apostolic shrine.</li>
        <li><strong>The Excavation Narrative:</strong> Portuguese accounts describe the opening of the tomb and the discovery of bones, a skull identified with the Apostle, and a lance head said to bear traces of blood. These findings are presented as material confirmation of the martyrdom of the Apostle Thomas.</li>
        <li><strong>Who Records It?</strong> The narrative is preserved in later chronicles, especially <strong>Gaspar Correia's Lendas da Índia</strong> (anecdotal, detail-rich, incorporating local traditions) and <strong>João de Barros's Décadas da Ásia</strong> (structured imperial history with a legitimizing tone). Together, they frame the event as a rediscovery validating Portuguese custodianship.</li>
        <li><strong>Relic Resolution:</strong> By locating relics at Mylapore, these accounts implicitly affirm that the Apostle’s remains still lay at the site, reinforcing its authority within the Portuguese Padroado.</li>
      </ul>
    </div>

    <div class="infographic-card slate-border">
      <h4>Historical Reckoning</h4>
      <ul class="infographic-list">
        <li><strong>Pre-Portuguese Sacred Geography:</strong> The Mylapore shrine was already a long-standing pilgrimage centre. Local Christian memory and wider travel traditions had identified it as the site of martyrdom well before Portuguese intervention.</li>
        <li><strong>Nature of the Sources:</strong> The accounts of the excavation are not neutral records but later narrative constructions. <strong>Correia</strong> preserves layered, sometimes embellished traditions, while <strong>Barros</strong> systematizes events within an imperial framework. Neither provides a strictly contemporary, eyewitness report in the modern critical sense.</li>
        <li><strong>The Edessa Tradition:</strong> From the 4th century, Syriac Christianity—associated with the Church of the East—maintained that the relics of the Apostle had been translated out of India, creating a long-standing geographical tension.</li>
        <li><strong>Mechanism of Circumvention:</strong> Portuguese narratives avoid direct contradiction by implicitly adopting a model of partial translation: some relics transferred to Edessa, others remaining at the original tomb, authority anchored in the place of martyrdom. This reconciles competing traditions without explicit dispute.</li>
        <li><strong>Interpretive Conclusion:</strong> The Portuguese did not discover an unknown site. Through excavation narratives and selective historiography, they reinterpreted an existing sacred landscape—effectively appropriating apostolic memory while aligning it with Latin ecclesiastical and imperial claims.</li>
      </ul>
    </div>

  </div>
</div>
</details>'''

new_html = re.sub(r'<details class="infographic-block">.*?</details>', new_block, html, flags=re.DOTALL)

with open(html_path, 'w', encoding='utf-8') as f:
    f.write(new_html)

print('Done')
