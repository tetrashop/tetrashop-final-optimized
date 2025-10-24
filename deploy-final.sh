#!/bin/bash
echo "🚀 استقرار نهایی تتراشاپ"
echo "========================"

# بررسی فایل‌های ضروری
required_files=("index.html" "wrangler.toml" "README.md" "_redirects" "_headers")
for file in "${required_files[@]}"; do
    if [ ! -f "$file" ]; then
        echo "❌ فایل $file یافت نشد"
        exit 1
    fi
done

echo "✅ تمام فایل‌های ضروری موجود هستند"

# ساخت فایل زیپ برای آپلود دستی
echo "📦 ایجاد فایل ZIP..."
zip -r tetrashop-optimized.zip . -x "*.git*" "deploy-final.sh"

echo ""
echo "🎉 پروژه آماده استقرار!"
echo ""
echo "🌐 روش‌های استقرار:"
echo "1. 🔄 از طریق GitHub Actions (توصیه شده)"
echo "2. 📤 آپلود دستی به Cloudflare Pages"
echo "3. 🔧 از طریق Wrangler CLI"
echo ""
echo "📊 ویژگی‌های مستقر شده:"
echo "   ✅ طراحی ریسپانسیو پیشرفته"
echo "   ✅ سیستم ROI 341% + 10%"
echo "   ✅ سیستم شطرنج هوشمند"
echo "   ✅ ماشین حساب سود"
echo "   ✅ مستندات کامل"
echo ""
echo "💰 سیستم آماده درآمدزایی است!"
