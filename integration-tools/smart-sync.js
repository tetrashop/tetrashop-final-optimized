const fs = require('fs');
const path = require('path');

class SmartSynchronizer {
    constructor() {
        this.config = {
            syncPatterns: {
                pricing: ['۱۹۰,۰۰۰', '۲۵۰,۰۰۰', '۴۹۰,۰۰۰', '۱,۲۰۰,۰۰۰'],
                features: ['ROI', 'سیستم بونوس', 'مدیریت محتوا', 'آنالیتیکس'],
                branding: ['تتراشاپ', 'Tetrashop']
            }
        };
    }

    // بررسی سازگاری بین کامپوننت‌ها
    checkConsistency() {
        console.log('🔄 بررسی سازگاری بین کامپوننت‌ها...\n');
        
        const inconsistencies = [];
        
        Object.keys(this.config.syncPatterns).forEach(patternType => {
            const patterns = this.config.syncPatterns[patternType];
            const results = this.scanForPatterns(patterns);
            
            if (results.inconsistent.length > 0) {
                inconsistencies.push({
                    type: patternType,
                    inconsistent: results.inconsistent
                });
            }
        });

        return inconsistencies;
    }

    // اسکن الگوها در تمام فایل‌ها
    scanForPatterns(patterns) {
        const results = {
            consistent: [],
            inconsistent: []
        };

        patterns.forEach(pattern => {
            const occurrences = this.findPatternInFiles(pattern);
            
            if (occurrences.length > 0) {
                const uniqueValues = [...new Set(occurrences.map(o => o.value))];
                
                if (uniqueValues.length === 1) {
                    results.consistent.push({
                        pattern: pattern,
                        value: uniqueValues[0],
                        files: occurrences.length
                    });
                } else {
                    results.inconsistent.push({
                        pattern: pattern,
                        values: uniqueValues,
                        files: occurrences.map(o => ({
                            file: o.file,
                            value: o.value
                        }))
                    });
                }
            }
        });

        return results;
    }

    // یافتن الگو در فایل‌ها
    findPatternInFiles(pattern) {
        const occurrences = [];
        
        function scanDirectory(dir) {
            const files = fs.readdirSync(dir);
            
            files.forEach(file => {
                const fullPath = path.join(dir, file);
                const stat = fs.statSync(fullPath);
                
                if (stat.isDirectory()) {
                    scanDirectory(fullPath);
                } else if (stat.isFile() && fullPath.endsWith('.html')) {
                    const content = fs.readFileSync(fullPath, 'utf8');
                    
                    if (content.includes(pattern)) {
                        // استخراج مقدار واقعی
                        const lines = content.split('\n');
                        lines.forEach(line => {
                            if (line.includes(pattern)) {
                                occurrences.push({
                                    file: fullPath,
                                    value: line.trim(),
                                    pattern: pattern
                                });
                            }
                        });
                    }
                }
            });
        }
        
        scanDirectory(path.join(__dirname, '..'));
        return occurrences;
    }

    // پیشنهاد تصحیح
    suggestFixes(inconsistencies) {
        console.log('💡 پیشنهادات تصحیح:\n');
        
        inconsistencies.forEach(issue => {
            console.log(`🔧 ${issue.type}:`);
            
            issue.inconsistent.forEach(inc => {
                console.log(`   الگو: "${inc.pattern}"`);
                console.log('   مقادیر مختلف:');
                
                inc.values.forEach(val => {
                    console.log(`     - ${val}`);
                });
                
                // پیشنهاد مقدار یکسان
                const suggestedValue = this.suggestUniformValue(inc.values);
                console.log(`   💎 پیشنهاد مقدار یکسان: ${suggestedValue}`);
            });
            console.log('');
        });
    }

    // پیشنهاد مقدار یکسان
    suggestUniformValue(values) {
        // منطق انتخاب بهترین مقدار
        if (values.some(v => v.includes('۱۹۰,۰۰۰'))) return '۱۹۰,۰۰۰ تومان';
        if (values.some(v => v.includes('۲۴۱٪'))) return 'ROI ماهانه: ۲۴۱٪';
        if (values.some(v => v.includes('تتراشاپ'))) return 'تتراشاپ';
        
        return values[0]; // Fallback
    }
}

// اجرای همگام‌ساز
const sync = new SmartSynchronizer();
const issues = sync.checkConsistency();

if (issues.length > 0) {
    sync.suggestFixes(issues);
} else {
    console.log('🎉 هیچ ناسازگاری یافت نشد! سیستم کاملاً یکپارچه است.');
}
