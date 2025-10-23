#!/usr/bin/env node

const AntiFragmentationMonitor = require('./unified-monitor.js');
const SmartSynchronizer = require('./smart-sync.js');

console.log('🎯 شروع پروژه ضد چندپارگی تتراشاپ\n');
console.log('=' .repeat(50));

// اجرای مانیتورینگ
const monitor = new AntiFragmentationMonitor();
const cohesionScore = monitor.generateHealthReport();

console.log('=' .repeat(50));

// اجرای همگام‌سازی
const sync = new SmartSynchronizer();
const issues = sync.checkConsistency();

console.log('=' .repeat(50));

// خلاصه نهایی
console.log('📋 خلاصه نتایج:\n');

if (cohesionScore > 80 && issues.length === 0) {
    console.log('🏆 وضعیت: عالی! سیستم کاملاً یکپارچه است');
    console.log('💡 اقدام: ادامه نگهداری منظم');
} else if (cohesionScore > 60 && issues.length <= 2) {
    console.log('✅ وضعیت: خوب - نیاز به بهبود جزئی');
    console.log('💡 اقدام: تصحیح ناسازگاری‌های شناسایی شده');
} else {
    console.log('⚠️ وضعیت: نیاز به توجه فوری');
    console.log('💡 اقدام: بازبینی اساسی ساختار سیستم');
}

console.log('\n🌐 داشبورد مدیریت: integration-dashboard.html');
console.log('🔧 برای تصحیح خودکار: node smart-sync.js');
