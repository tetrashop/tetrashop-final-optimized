const http = require('http');
const url = require('url');

const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;
    
    // تنظیم هدرهای CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }
    
    // Route سلامت
    if (pathname === '/api/health') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
            status: '✅ سرور فعال است',
            message: 'Tetrashop Backend - Simple Server',
            timestamp: new Date().toISOString(),
            version: '2.0.0'
        }));
        return;
    }
    
    // Route محصولات
    if (pathname === '/api/products') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify([
            {
                id: 1,
                name: "دوره محصول تستی",
                price: 80000,
                description: "این یک محصول تستی است",
                category: "آموزشی"
            },
            {
                id: 2,
                name: "دوره پیشرفته",
                price: 120000,
                description: "محصول پیشرفته تست",
                category: "آموزشی"
            }
        ]));
        return;
    }
    
    // Route پیش‌فرض
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
        message: 'خوش آمدید به Tetrashop API',
        endpoints: ['/api/health', '/api/products']
    }));
});

const PORT = 5000;
server.listen(PORT, '0.0.0.0', () => {
    console.log('🚀 ========================================');
    console.log('✅ سرور Backend راه‌اندازی شد!');
    console.log('📍 آدرس: http://localhost:5000');
    console.log('📍 سلامت: http://localhost:5000/api/health');
    console.log('📍 محصولات: http://localhost:5000/api/products');
    console.log('🚀 ========================================');
});

// مدیریت خطا
server.on('error', (error) => {
    if (error.code === 'EADDRINUSE') {
        console.log('❌ پورت 5000 مشغول است!');
        console.log('💡 لطفاً برنامه‌ای که از پورت 5000 استفاده می‌کند را ببندید');
    } else {
        console.log('❌ خطای سرور:', error.message);
    }
});
