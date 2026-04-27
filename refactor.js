const fs = require('fs');
const path = require('path');

const dir = 'd:\\St Thomas Tradition\\St-Thomas-Tradition\\chapters';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html') && f !== 'title.html' && f !== 'Test.html');

for (const file of files) {
  let content = fs.readFileSync(path.join(dir, file), 'utf8');
  
  // Extract number from filename (e.g. chapter-01 -> 01)
  let numMatch = file.match(/chapter-(\d+)/);
  let num = numMatch ? numMatch[1] : '';

  // Extract h1 and subtitle
  let title = '';
  let sub = '';
  
  content = content.replace(/<h1>([\\s\\S]*?)<\\/h1>/i, (m, p1) => {
    title = p1.trim();
    return '';
  });
  content = content.replace(/<p class="chapter-subtitle">([\\s\\S]*?)<\\/p>/i, (m, p1) => {
    sub = p1.trim();
    return '';
  });

  // Construct header
  if (title || sub) {
    let header = '<header class="chapter-header">\\n';
    if (num) {
      header += '  <div class="chapter-number">' + num + '</div>\\n';
    }
    if (sub) {
      header += '  <p class="chapter-subtitle">' + sub + '</p>\\n';
    }
    if (title) {
      header += '  <h1>' + title + '</h1>\\n';
    }
    header += '</header>\\n';
    
    content = content.replace(/^(<!--.*?-->\\s*)?/i, '' + header);
  }

  // Refactor blockquote
  const bqRegex = /(<header class="chapter-header">[\\s\\S]*?)(<blockquote>[\\s\\S]*?<\\/blockquote>)/i;
  content = content.replace(bqRegex, '<div class="folio-epigraph">\\n\\n</div>');

  // Add drop-cap to first paragraph of body text
  let parts = content.split('<h2>');
  if (parts.length > 1) {
    parts[1] = parts[1].replace(/<p>/, '<p class="drop-cap">');
    content = parts.join('<h2>');
  }

  fs.writeFileSync(path.join(dir, file), content, 'utf8');
}
console.log('Processed ' + files.length + ' files');
