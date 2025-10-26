// سیستم کش پایه
class SimpleCache {
    constructor() {
        this.cache = new Map();
    }

    set(key, value, ttl = 300000) {
        this.cache.set(key, {
            value,
            expiry: Date.now() + ttl
        });
    }

    get(key) {
        const item = this.cache.get(key);
        if (!item) return null;
        
        if (Date.now() > item.expiry) {
            this.cache.delete(key);
            return null;
        }
        
        return item.value;
    }
}

module.exports = SimpleCache;
