// سیستم کنترل دسترسی پیشرفته - فقط برای مدیر اصلی
class AccessControl {
    constructor() {
        this.allowedIPs = [
            '127.0.0.1',        // Localhost
            'localhost',         // Localhost
            '::1',              // IPv6 localhost
            // آی‌پی‌های شما اینجا اضافه شوند
        ];
        
        this.adminTokens = [
            'tetrashop_master_key_2024',
            'admin_secure_access'
        ];
    }

    // بررسی دسترسی
    checkAccess() {
        const clientIP = this.getClientIP();
        const token = this.getAccessToken();
        
        console.log('🔐 بررسی دسترسی:', { clientIP, token });
        
        // بررسی IP
        const ipAllowed = this.allowedIPs.includes(clientIP);
        
        // بررسی توکن
        const tokenValid = this.adminTokens.includes(token);
        
        return ipAllowed || tokenValid;
    }

    // دریافت IP کاربر
    getClientIP() {
        // این در سمت سرور پر می‌شود
        return '127.0.0.1'; // برای تست
    }

    // دریافت توکن دسترسی
    getAccessToken() {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('token') || localStorage.getItem('admin_token');
    }

    // ذخیره توکن
    setAccessToken(token) {
        localStorage.setItem('admin_token', token);
    }

    // بررسی و هدایت
    enforceAccess() {
        if (!this.checkAccess()) {
            this.redirectToDenied();
            return false;
        }
        return true;
    }

    // هدایت به صفحه عدم دسترسی
    redirectToDenied() {
        window.location.href = 'access-denied.html';
    }
}

// ایجاد نمونه جهانی
const accessControl = new AccessControl();
