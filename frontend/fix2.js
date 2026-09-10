const fs = require('fs');
const path = require('path');

const dir = 'D:/sih-legal-metrology/frontend';

// Task 3: GoI Logo in TopNav
const topNavPath = path.join(dir, 'components/TopNav.jsx');
if (fs.existsSync(topNavPath)) {
  let content = fs.readFileSync(topNavPath, 'utf-8');
  content = content.replace(
    /\{\/\*\s*Government Emblem\s*\*\/\}\s*<img src="\/emblem\.svg"[\s\S]*?<\/div>/,
    `<img src="/gov-india-logo.svg" alt="Government of India" className="h-12 object-contain filter drop-shadow-sm"/>`
  );
  fs.writeFileSync(topNavPath, content);
}

// Task 3: GoI Logo in Login
const loginPath = path.join(dir, 'app/login/page.jsx');
if (fs.existsSync(loginPath)) {
  let content = fs.readFileSync(loginPath, 'utf-8');
  content = content.replace(
    /<img src="\/emblem\.svg" alt="Emblem" className="w-12 h-14 object-contain mb-3"\/>\s*<h1 className="text-\[16px\] font-black text-\[#10264A\] text-center leading-tight">[^<]*<br\/>Government of India<\/h1>\s*<p className="text-\[9px\] font-bold text-\[#64748B\] text-center mt-1">Ministry of Consumer Affairs, Food &amp; Public Distribution<\/p>/,
    `<img src="/gov-india-logo.svg" alt="Government of India" className="h-16 object-contain mb-3"/>`
  );
  content = content.replace(
    /<img src="\/emblem\.svg" alt="" className="w-12 h-16 object-contain filter drop-shadow-md brightness-0 invert opacity-90"\/>\s*<div>\s*<p className="text-\[14px\] font-black text-white leading-tight">Department of Consumer Affairs<\/p>\s*<p className="text-\[11px\] font-bold text-white\/70">Government of India<\/p>\s*<\/div>/,
    `<img src="/gov-india-logo.svg" alt="Government of India" className="h-12 object-contain filter drop-shadow-md brightness-0 invert opacity-90"/>`
  );
  fs.writeFileSync(loginPath, content);
}

// Task 4: Sidebar Menu Item
const sidebarPath = path.join(dir, 'components/Sidebar.jsx');
if (fs.existsSync(sidebarPath)) {
  let content = fs.readFileSync(sidebarPath, 'utf-8');
  if (!content.includes('"/laws"')) {
    content = content.replace(
      /\{ name: "Reports", href: "\/reports", icon: ".*?" \},/,
      `{ name: "Reports", href: "/reports", icon: "📄" },\n  { name: "Laws & Rules", href: "/laws", icon: "📜" },`
    );
    fs.writeFileSync(sidebarPath, content);
  }
}

// Task 5: Register Page
const registerPath = path.join(dir, 'app/register/page.jsx');
if (fs.existsSync(registerPath)) {
  let content = fs.readFileSync(registerPath, 'utf-8');
  content = content.replace(
    /"http:\/\/localhost:8000\/api\/v1\/auth\/otp\/request"/g,
    '`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/v1/auth/otp/request`'
  );
  content = content.replace(
    /"http:\/\/localhost:8000\/api\/v1\/auth\/register"/g,
    '`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/v1/auth/register`'
  );
  content = content.replace(
    /"http:\/\/localhost:8000\/api\/v1\/auth\/register-direct"/g,
    '`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/v1/auth/register-direct`'
  );

  // Add Govt branding to register
  if (content.includes('Join<br/>LegalLens')) {
    content = content.replace(
      /<div className="w-16 h-16 bg-white\/20 backdrop-blur rounded-2xl flex items-center justify-center text-3xl mb-4">.*?<\/div>\s*<h1 className="text-5xl font-black text-white leading-tight">Join<br\/>LegalLens<\/h1>/,
      `<div className="mb-6 flex flex-col items-start"><img src="/gov-india-logo.svg" alt="Government of India" className="h-16 object-contain filter brightness-0 invert opacity-90 mb-4"/></div>\n        <h1 className="text-5xl font-black text-white leading-tight">Join<br/>LegalLens</h1>`
    );
  }
  fs.writeFileSync(registerPath, content);
}

// Task 5: Admin Page Verify button
const adminPath = path.join(dir, 'app/admin/page.jsx');
if (fs.existsSync(adminPath)) {
  let content = fs.readFileSync(adminPath, 'utf-8');
  
  if (!content.includes('handleVerify')) {
    content = content.replace(
      /async function toggleActive\(user\) \{/,
      `async function handleVerify(username) {
    if (useDemo) { alert("Demo mode: Verify action ignored."); return; }
    try {
      const res = await fetch(\`\${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/v1/auth/verify-user/\${username}\`, { method: 'POST' });
      if(res.ok) alert("User verified successfully");
    } catch(e) { console.error(e); }
  }

  async function toggleActive(user) {`
    );
  }
  
  content = content.replace(
    /<td className="table-cell">\s*<button className="text-blue-600 text-xs font-semibold hover:underline mr-3">Edit<\/button>\s*<\/td>/g,
    `<td className="table-cell">\s*<button className="text-blue-600 text-xs font-semibold hover:underline mr-3">Edit</button>\s*<button onClick={() => handleVerify(u.username)} className="text-green-600 text-xs font-semibold hover:underline">Verify</button>\s*<\/td>`
  );
  
  fs.writeFileSync(adminPath, content);
}

