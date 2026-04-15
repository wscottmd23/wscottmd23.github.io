import fs from 'fs';

let content = fs.readFileSync('src/App.tsx', 'utf8');

content = content.replace(/mb-4">\{item\.institution\}/g, 'mb-2">{item.institution}');
content = content.replace(/mb-3">\{item\.institution\}/g, 'mb-1.5">{item.institution}');
content = content.replace(/mb-3">\{item\.location\}/g, 'mb-1.5">{item.location}');

fs.writeFileSync('src/App.tsx', content);
