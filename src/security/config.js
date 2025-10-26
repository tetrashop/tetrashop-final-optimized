// سیستم امنیتی پایه
class SecurityConfig {
    static getSettings() {
        return {
            encryption: 'AES-256-GCM',
            jwtExpiry: '15m',
            maxLoginAttempts: 5,
            corsOrigins: ['https://tetrashop.cloud']
        };
    }
}

module.exports = SecurityConfig;
