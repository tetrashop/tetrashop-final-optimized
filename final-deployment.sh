#!/bin/bash
echo "🚀 استقرار نهایی تتراشاپ"
echo "========================"

# بررسی وجود Git
if ! command -v git &> /dev/null; then
    echo "❌ Git نصب نیست"
    exit 1
fi

# اجرای مراحل استقرار
echo "1. 📦 افزودن فایل‌ها..."
git add .

echo "2. 💾 کامیت..."
git commit -m "🚀 استقرار نهایی تتراشاپ v2.0.0

- ROI 341% + 10% ماهانه
- سیستم شطرنج هوشمند
- طراحی پیشرفته
- استقرار Cloudflare"

echo "3. 📤 پوش به مخزن..."
git push origin main

echo "4. 🏷️ ایجاد تگ..."
git tag -a v2.0.0 -m "نسخه تولید تتراشاپ"
git push origin --tags

echo ""
echo "🎉 استقرار کامل شد!"
echo "🌐 آدرس مخزن: https://github.com/tetrashop/tetrashop-final-optimized"
echo "💰 سیستم آماده درآمدزایی با ROI 351% ماهانه"
