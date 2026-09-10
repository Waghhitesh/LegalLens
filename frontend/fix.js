const fs = require('fs');
const path = require('path');

const dir = 'D:/sih-legal-metrology/frontend';

// 1. Remove TopNav from pages
const pagesToRemoveTopNav = [
  'app/inspections/page.jsx',
  'app/violations/page.jsx',
  'app/products/page.jsx',
  'app/manufacturers/page.jsx',
  'app/analytics/page.jsx',
  'app/reports/page.jsx'
];

for (const p of pagesToRemoveTopNav) {
  const filePath = path.join(dir, p);
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf-8');
    content = content.replace(/import TopNav from "\.\.\/\.\.\/components\/TopNav";\r?\n?/g, '');
    content = content.replace(/<TopNav[^>]*>\s*<\/TopNav>|<TopNav[^>]*\/>/g, '');
    fs.writeFileSync(filePath, content);
  }
}

// 2. Fix Layout Margin
const layoutClientPath = path.join(dir, 'components/LayoutClient.jsx');
if (fs.existsSync(layoutClientPath)) {
  let content = fs.readFileSync(layoutClientPath, 'utf-8');
  content = content.replace(/ml-\[220px\]/g, 'ml-[240px]');
  fs.writeFileSync(layoutClientPath, content);
}
