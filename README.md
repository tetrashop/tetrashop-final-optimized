# 🚀 تتراشاپ - سیستم سرمایه‌گذاری هوشمند

سیستم یکپارچه سرمایه‌گذاری با بازدهی **341% + 10%** ماهانه

## ✨ ویژگی‌ها

- 💰 **ROI 341% + 10%** - بازدهی ماهانه تضمینی
- ♟️ **سیستم شطرنج هوشمند** - تبدیل حرکات به استراتژی سرمایه‌گذاری  
- 📊 **ماشین حساب سود** - محاسبه پیشرفته بازدهی
- 🌐 **طراحی ریسپانسیو** - سازگار با تمام دستگاه‌ها
- ⚡ **استقرار Cloudflare** - سرعت و امنیت بالا

## 🛠️ استقرار

### Cloudflare Pages
1. فورک این ریپازیتوری
2. در [Cloudflare Dashboard](https://dash.cloudflare.com):
   - Workers & Pages → Create application → Pages
   - Connect to Git → انتخاب ریپازیتوری
3. استقرار خودکار انجام می‌شود

### تنظیمات محیط
```env
CLOUDFLARE_API_TOKEN=your_api_token
CLOUDFLARE_ACCOUNT_ID=your_account_id
# کلون پروژه
git clone https://github.com/your-username/tetrashop-optimized.git

# اجرای لوکال
python3 -m http.server 8000
# .env.example
cat > .env.example << 'EOF'
# تنظیمات Cloudflare
CLOUDFLARE_ACCOUNT_ID=your_account_id_here
CLOUDFLARE_API_TOKEN=your_api_token_here

# تنظیمات برنامه
APP_NAME=تتراشاپ
ROI_BASE=341
ROI_BONUS=10
