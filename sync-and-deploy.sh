#!/bin/bash
echo "🚀 شروع فرآیند همگام‌سازی و استقرار خودکار..."

# تاریخ و زمان شروع
start_time=$(date)

# تغییر به دایرکتوری پروژه
cd ~/tetrashop-final-optimized

# بررسی تغییرات
if git diff-index --quiet HEAD --; then
    echo "📝 هیچ تغییر جدیدی وجود ندارد."
    exit 0
fi

# اضافه کردن تغییرات
echo "📁 اضافه کردن تغییرات..."
git add .

# ایجاد کامیت
commit_message="🔄 همگام‌سازی خودکار - $(date '+%Y-%m-%d %H:%M:%S')"
git commit -m "$commit_message"

# همگام‌سازی با سرور
echo "🔄 همگام‌سازی با ریپازیتوری اصلی..."
git pull --rebase
git push

if [ $? -eq 0 ]; then
    echo "✅ همگام‌سازی با موفقیت انجام شد"
    
    # بررسی استقرار
    echo "🔍 بررسی استقرار..."
    sleep 10
    curl -s https://003fbb3e.tetrashop-final-optimized.pages.dev > /dev/null && \
        echo "✅ استقرار Cloudflare موفقیت‌آمیز بود" || \
        echo "⚠️  استقرار در حال پردازش..."
    
    # لاگ کردن
    echo "📝 همگام‌سازی تکمیل شده در: $start_time" >> sync-log.txt
else
    echo "❌ خطا در همگام‌سازی"
    exit 1
fi
