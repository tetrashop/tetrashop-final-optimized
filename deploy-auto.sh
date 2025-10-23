#!/bin/bash
echo "🚀 شروع استقرار خودکار تتراشاپ..."

cd ~/tetrashop-final-optimized

# بررسی تغییرات
if git diff-index --quiet HEAD --; then
    echo "📝 هیچ تغییر جدیدی وجود ندارد."
    exit 0
fi

# اضافه کردن تغییرات
git add .

# کامیت خودکار
commit_msg="🔄 استقرار خودکار - $(date '+%Y-%m-%d %H:%M:%S')"
git commit -m "$commit_msg"

# همگام‌سازی
git pull --rebase
git push

if [ $? -eq 0 ]; then
    echo "✅ استقرار خودکار با موفقیت انجام شد"
    
    # تست سلامت
    echo "🔍 تست سلامت استقرار..."
    sleep 10
    curl -s "https://003fbb3e.tetrashop-final-optimized.pages.dev" > /dev/null && \
        echo "✅ استقرار Cloudflare موفقیت‌آمیز" || \
        echo "⚠️  استقرار در حال پردازش"
    
    # لاگ
    echo "$(date): استقرار خودکار انجام شد" >> deploy-log.txt
else
    echo "❌ خطا در استقرار خودکار"
    exit 1
fi
