#!/bin/bash
echo "🚀 راه‌اندازی فوری Tetrashop..."

# راه‌اندازی Backend
echo "🔧 شروع Backend..."
cd backend
node -e "
const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// Route سلامت
app.get('/api/health', (req, res) => {
    res.json({ 
        status: '✅ سرور فعال است',
        message: 'Tetrashop Backend Running - Direct Launch',
        timestamp: new Date().toISOString(),
        version: '2.0.0'
    });
});

// Route محصولات
app.get('/api/products', (req, res) => {
    res.json([
        {
            id: 1,
            name: 'دوره محصول تستی',
            price: 80000,
            description: 'این یک محصول تستی است',
            category: 'آموزشی'
        },
        {
            id: 2,
            name: 'دوره پیشرفته',
            price: 120000,
            description: 'محصول پیشرفته تست',
            category: 'آموزشی'
        }
    ]);
});

// Route اصلی
app.get('/', (req, res) => {
    res.json({ message: 'خوش آمدید به Tetrashop API' });
});

console.log('🚀 شروع سرور Backend...');
app.listen(5000, '0.0.0.0', () => {
    console.log('✅ Backend فعال: http://localhost:5000');
    console.log('📍 سلامت: http://localhost:5000/api/health');
});
" &
BACKEND_PID=$!
cd ..

# صبر کردن برای راه‌اندازی Backend
echo "⏳ منتظر راه‌اندازی Backend..."
sleep 3

# راه‌اندازی Frontend
echo "🎨 شروع Frontend..."
cd frontend

# ایجاد دایرکتوری public اگر وجود ندارد
mkdir -p public

# ایجاد فایل HTML ساده برای تست
cat > public/index.html << 'HTMLEND'
<!DOCTYPE html>
<html lang="fa" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Tetrashop - تست فوری</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: system-ui, -apple-system, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white; 
            min-height: 100vh; 
            padding: 2rem;
            line-height: 1.6;
        }
        .container { 
            max-width: 800px; 
            margin: 0 auto; 
            text-align: center; 
        }
        .logo { 
            font-size: 4rem; 
            margin-bottom: 1rem; 
        }
        .status-card { 
            background: rgba(255,255,255,0.1); 
            padding: 2rem; 
            border-radius: 15px; 
            margin: 2rem 0; 
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255,255,255,0.2);
        }
        .btn { 
            background: white; 
            color: #667eea; 
            padding: 1rem 2rem; 
            border: none; 
            border-radius: 8px; 
            margin: 0.5rem; 
            cursor: pointer; 
            font-weight: bold;
            text-decoration: none;
            display: inline-block;
            transition: transform 0.2s;
        }
        .btn:hover {
            transform: translateY(-2px);
        }
        .test-result {
            margin-top: 2rem;
            padding: 1rem;
            border-radius: 8px;
            text-align: right;
        }
        .success {
            background: rgba(76, 175, 80, 0.2);
            border-right: 4px solid #4CAF50;
        }
        .error {
            background: rgba(244, 67, 54, 0.2);
            border-right: 4px solid #f44336;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="logo">🛒</div>
        <h1>Tetrashop - تست فوری</h1>
        <p>نسخه ۲.۰.۰ - راه‌اندازی مستقیم</p>
        
        <div class="status-card">
            <h2>🧪 تست سیستم</h2>
            <p>برای بررسی وضعیت سیستم از دکمه‌های زیر استفاده کنید</p>
            
            <div style="margin-top: 1.5rem;">
                <button class="btn" onclick="testBackend()">تست Backend</button>
                <button class="btn" onclick="testProducts()">تست محصولات</button>
                <a href="http://localhost:5000/api/health" class="btn" target="_blank">بررسی سلامت</a>
            </div>
        </div>

        <div id="result" class="test-result"></div>

        <div class="status-card">
            <h3>📊 وضعیت سرویس‌ها</h3>
            <div id="services-status">
                <p>⏳ در حال بررسی...</p>
            </div>
        </div>
    </div>

    <script>
        async function testBackend() {
            const resultDiv = document.getElementById('result');
            try {
                resultDiv.innerHTML = '<p>🔍 در حال اتصال به Backend...</p>';
                const response = await fetch('http://localhost:5000/api/health');
                const data = await response.json();
                
                resultDiv.className = 'test-result success';
                resultDiv.innerHTML = `
                    <h3>✅ Backend فعال است</h3>
                    <p><strong>وضعیت:</strong> ${data.status}</p>
                    <p><strong>پیام:</strong> ${data.message}</p>
                    <p><strong>زمان:</strong> ${new Date(data.timestamp).toLocaleString('fa-IR')}</p>
                    <p><strong>ورژن:</strong> ${data.version}</p>
                `;
                
                updateServicesStatus('backend', true);
            } catch (error) {
                resultDiv.className = 'test-result error';
                resultDiv.innerHTML = `
                    <h3>❌ خطا در اتصال به Backend</h3>
                    <p><strong>مشکل:</strong> سرور Backend در دسترس نیست</p>
                    <p><strong>راه‌حل:</strong> مطمئن شوید سرور روی پورت 5000 اجرا شده است</p>
                    <p><strong>خطا:</strong> ${error.message}</p>
                `;
                
                updateServicesStatus('backend', false);
            }
        }

        async function testProducts() {
            const resultDiv = document.getElementById('result');
            try {
                resultDiv.innerHTML = '<p>🔍 در حال دریافت محصولات...</p>';
                const response = await fetch('http://localhost:5000/api/products');
                const products = await response.json();
                
                resultDiv.className = 'test-result success';
                resultDiv.innerHTML = `
                    <h3>✅ محصولات دریافت شد</h3>
                    <p><strong>تعداد محصولات:</strong> ${products.length}</p>
                    <div style="text-align: right; margin-top: 1rem;">
                        ${products.map(product => `
                            <div style="background: rgba(255,255,255,0.1); padding: 1rem; margin: 0.5rem 0; border-radius: 8px;">
                                <strong>${product.name}</strong><br>
                                قیمت: ${product.price.toLocaleString('fa-IR')} تومان
                            </div>
                        `).join('')}
                    </div>
                `;
                
                updateServicesStatus('products', true);
            } catch (error) {
                resultDiv.className = 'test-result error';
                resultDiv.innerHTML = `
                    <h3>❌ خطا در دریافت محصولات</h3>
                    <p>${error.message}</p>
                `;
                
                updateServicesStatus('products', false);
            }
        }

        function updateServicesStatus(service, status) {
            const statusDiv = document.getElementById('services-status');
            // این تابع می‌تواند وضعیت سرویس‌های مختلف را به روز کند
        }

        // تست خودکار هنگام بارگذاری صفحه
        window.onload = function() {
            setTimeout(testBackend, 1000);
        };
    </script>
</body>
</html>
HTMLEND

# راه‌اندازی سرور Frontend
echo "🌐 شروع سرور Frontend..."
npx http-server public -p 3000 -c-1 &
FRONTEND_PID=$!
cd ..

echo ""
echo "🚀 ========================================"
echo "✅ راه‌اندازی کامل شد!"
echo "🚀 ========================================"
echo "📍 Frontend: http://localhost:3000"
echo "📍 Backend:  http://localhost:5000"
echo "📍 سلامت:    http://localhost:5000/api/health"
echo "🚀 ========================================"
echo ""
echo "📝 برای متوقف کردن:"
echo "   pkill -f 'node.*5000'"
echo "   pkill -f 'http-server.*3000'"
echo ""

# نگه داشتن اسکریپت
wait
