import fs from 'fs';

let content = fs.readFileSync('src/App.tsx', 'utf8');

// Font sizes
content = content.replace(/text-\[1\.125rem\]/g, 'text-base');
content = content.replace(/text-\[0\.9375rem\]/g, 'text-sm');
content = content.replace(/text-\[0\.875rem\]/g, 'text-[0.8125rem]');

// Spacing for bullets
content = content.replace(/mb-4\}\{item\.institution\}/g, 'mb-2}{item.institution}');
content = content.replace(/mb-3\}\{item\.institution\}/g, 'mb-1.5}{item.institution}');
content = content.replace(/mb-3\}\{item\.location\}/g, 'mb-1.5}{item.location}');
content = content.replace(/<ul className="space-y-2">/g, '<ul className="space-y-1">');
content = content.replace(/<ol className="space-y-4">/g, '<ol className="space-y-2">');
content = content.replace(/<ol className="space-y-6">/g, '<ol className="space-y-3">');

// Grants text size
content = content.replace(/text-lg font-bold/g, 'text-base font-bold');

fs.writeFileSync('src/App.tsx', content);
