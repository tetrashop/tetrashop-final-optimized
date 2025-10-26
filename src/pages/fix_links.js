const fs = require('fs');
let content = fs.readFileSync('index.html', 'utf8');
content = content.replace(/\.\.\/admin\/login\.html/g, 'admin/login.html');
fs.writeFileSync('index.html', content);
console.log('لینک‌های مدیریت اصلاح شدند');
