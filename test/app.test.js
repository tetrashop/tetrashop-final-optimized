// test/app.test.js
const fs = require('fs');
const path = require('path');

test('فایل index.html باید وجود داشته باشد', () => {
    const filePath = path.join(__dirname, '..', 'public', 'index.html');
    expect(fs.existsSync(filePath)).toBe(true);
});

test('فایل app.js نباید خالی باشد', () => {
    const filePath = path.join(__dirname, '..', 'public', 'js', 'app.js');
    const content = fs.readFileSync(filePath, 'utf-8');
    expect(content.length).toBeGreaterThan(50);
});

test('CSS باید حاوی استایل‌های ریسپانسیو باشد', () => {
    const filePath = path.join(__dirname, '..', 'public', 'css', 'style.css');
    const content = fs.readFileSync(filePath, 'utf-8');
    expect(content).toContain('@media');
});
