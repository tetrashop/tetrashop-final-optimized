const fs = require('fs');
const path = require('path');

class AntiFragmentationMonitor {
    constructor() {
        this.repoPath = path.join(__dirname, '..');
        this.components = {
            'chess-system': 'completed-systems/chess-system.html',
            'cms-system': 'completed-systems/cms-system.html', 
            'project-system': 'completed-systems/project-management.html',
            'main-store': 'index.html',
            'demo-systems': 'demo-systems/',
            'backend': 'backend/'
        };
    }

    // تحلیل ارتباط بین کامپوننت‌ها
    analyzeConnections() {
        console.log('🔍 تحلیل ارتباط بین کامپوننت‌های تتراشاپ...\n');
        
        const connections = {};
        
        Object.keys(this.components).forEach(component => {
            connections[component] = this.findDependencies(component);
        });

        return connections;
    }

    // یافتن وابستگی‌ها
    findDependencies(componentName) {
        const componentPath = this.components[componentName];
        if (!fs.existsSync(componentPath)) return [];

        const dependencies = [];
        const content = fs.readFileSync(componentPath, 'utf8');

        // تحلیل لینک‌ها و ارجاعات
        Object.keys(this.components).forEach(otherComponent => {
            if (otherComponent !== componentName) {
                const otherPath = this.components[otherComponent];
                if (content.includes(otherPath) || content.includes(otherComponent)) {
                    dependencies.push({
                        target: otherComponent,
                        type: 'reference',
                        strength: this.calculateConnectionStrength(content, otherComponent)
                    });
                }
            }
        });

        return dependencies;
    }

    // محاسبه قدرت ارتباط
    calculateConnectionStrength(content, targetComponent) {
        const regex = new RegExp(targetComponent, 'gi');
        const matches = content.match(regex);
        return matches ? matches.length : 0;
    }

    // تولید گزارش سلامت
    generateHealthReport() {
        const connections = this.analyzeConnections();
        
        console.log('📊 گزارش سلامت یکپارچگی تتراشاپ:\n');
        
        Object.keys(connections).forEach(component => {
            const deps = connections[component];
            console.log(`🎯 ${component}:`);
            console.log(`   📍 وضعیت: ${deps.length > 0 ? '✅ متصل' : '⚠️  ایزوله'}`);
            
            deps.forEach(dep => {
                console.log(`   🔗 → ${dep.target} (قدرت: ${dep.strength})`);
            });
            
            if (deps.length === 0) {
                console.log('   💡 پیشنهاد: ایجاد ارتباط با سایر کامپوننت‌ها');
            }
            console.log('');
        });

        return this.calculateCohesionScore(connections);
    }

    // محاسبه امتیاز انسجام
    calculateCohesionScore(connections) {
        let totalConnections = 0;
        let totalComponents = Object.keys(connections).length;

        Object.values(connections).forEach(deps => {
            totalConnections += deps.length;
        });

        const maxPossibleConnections = totalComponents * (totalComponents - 1);
        const cohesionScore = (totalConnections / maxPossibleConnections) * 100;

        console.log(`🏆 امتیاز انسجام سیستم: ${cohesionScore.toFixed(2)}%`);
        return cohesionScore;
    }
}

// اجرای سیستم مانیتورینگ
const monitor = new AntiFragmentationMonitor();
monitor.generateHealthReport();

module.exports = AntiFragmentationMonitor;
