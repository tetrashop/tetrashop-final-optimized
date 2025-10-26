// داده‌های نمونه محصولات
const products = [
    {
        id: 1,
        name: "گوشی موبایل هوشمند",
        price: "۱۲,۹۰۰,۰۰۰",
        category: "موبایل",
        image: "📱",
        description: "گوشی هوشمند با آخرین تکنولوژی"
    },
    {
        id: 2,
        name: "لپ‌تاپ گیمینگ",
        price: "۴۵,۰۰۰,۰۰۰",
        category: "لپ‌تاپ",
        image: "💻",
        description: "لپ‌تاپ قدرتمند برای بازی و کار"
    },
    {
        id: 3,
        name: "هدفون بی‌سیم",
        price: "۲,۵۰۰,۰۰۰",
        category: "هدفون",
        image: "🎧",
        description: "هدفون با کیفیت صدای عالی"
    },
    {
        id: 4,
        name: "ساعت هوشمند",
        price: "۸,۹۰۰,۰۰۰",
        category: "ساعت",
        image: "⌚",
        description: "مانیتورینگ سلامت و تناسب اندام"
    },
    {
        id: 5,
        name: "تبلت اندروید",
        price: "۶,۵۰۰,۰۰۰",
        category: "موبایل",
        image: "📱",
        description: "تبلت با صفحه نمایش بزرگ"
    },
    {
        id: 6,
        name: "ماوس گیمینگ",
        price: "۱,۲۰۰,۰۰۰",
        category: "لپ‌تاپ",
        image: "🖱️",
        description: "ماوس حرفه‌ای برای بازی"
    }
];

// سیستم مدیریت وضعیت
const state = {
    currentCategory: 'all',
    cart: [],
    user: null
};

// وقتی DOM لود شد
document.addEventListener('DOMContentLoaded', function() {
    loadProducts();
    setupEventListeners();
    checkAuth();
});

// لود محصولات
function loadProducts() {
    const productsGrid = document.getElementById('productsGrid');
    if (!productsGrid) return;

    const filteredProducts = state.currentCategory === 'all' 
        ? products 
        : products.filter(p => p.category === state.currentCategory);

    productsGrid.innerHTML = filteredProducts.map(product => `
        <div class="product-card" data-id="${product.id}">
            <div class="product-image">${product.image}</div>
            <h3 class="product-title">${product.name}</h3>
            <p class="product-description">${product.description}</p>
            <div class="product-price">${product.price} تومان</div>
            <button class="btn-primary" onclick="addToCart(${product.id})" style="width: 100%">
                افزودن به سبد خرید
            </button>
        </div>
    `).join('');
}

// فیلتر محصولات
function filterProducts(category) {
    state.currentCategory = category;
    loadProducts();
    
    // آپدیت لینک‌های فعال
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.classList.remove('active');
    });
}

// اسکرول به محصولات
function scrollToProducts() {
    document.getElementById('products').scrollIntoView({ 
        behavior: 'smooth' 
    });
}

// مدیریت سبد خرید
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (product) {
        state.cart.push(product);
        showNotification('محصول به سبد خرید اضافه شد! 🛒');
        updateCartCounter();
    }
}

function updateCartCounter() {
    const counter = document.getElementById('cartCounter');
    if (counter) {
        counter.textContent = state.cart.length;
    }
}

function showNotification(message) {
    // ایجاد نوتیفیکیشن
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: var(--success);
        color: white;
        padding: 1rem 2rem;
        border-radius: 5px;
        box-shadow: var(--shadow);
        z-index: 3000;
        animation: slideIn 0.3s ease;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// مدیریت مودال‌ها
function openLoginModal() {
    document.getElementById('loginModal').style.display = 'block';
}

function closeLoginModal() {
    document.getElementById('loginModal').style.display = 'none';
}

function openRegisterModal() {
    closeLoginModal();
    // بعداً پیاده‌سازی می‌شود
    showNotification('سیستم ثبت‌نام به زودی فعال می‌شود!');
}

// سیستم احراز هویت
function checkAuth() {
    const token = localStorage.getItem('tetrashop_token');
    if (token) {
        state.user = JSON.parse(atob(token));
        updateAuthUI();
    }
}

function updateAuthUI() {
    const loginBtn = document.querySelector('.btn-login');
    if (state.user && loginBtn) {
        loginBtn.textContent = `👋 ${state.user.name}`;
        loginBtn.onclick = () => showUserMenu();
    }
}

function showUserMenu() {
    // منوی کاربر - بعداً پیاده‌سازی می‌شود
    showNotification(`خوش آمدید ${state.user.name}!`);
}

// تنظیم event listeners
function setupEventListeners() {
    // بستن مودال با کلیک خارج
    window.addEventListener('click', function(event) {
        const modal = document.getElementById('loginModal');
        if (event.target === modal) {
            closeLoginModal();
        }
    });
    
    // مدیریت فرم ورود
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleLogin();
        });
    }
}

// هندل کردن ورود
function handleLogin() {
    const formData = new FormData(document.getElementById('loginForm'));
    const email = formData.get('email');
    const password = formData.get('password');
    
    // شبیه‌سازی ورود
    if (email && password) {
        const user = {
            id: 1,
            name: 'کاربر تست',
            email: email
        };
        
        const token = btoa(JSON.stringify(user));
        localStorage.setItem('tetrashop_token', token);
        state.user = user;
        
        closeLoginModal();
        updateAuthUI();
        showNotification('ورود موفقیت‌آمیز! 🎉');
    }
}

// سیستم گزارش خطا
window.addEventListener('error', function(e) {
    console.error('خطا در سیستم:', e.error);
});

// اکسپورت برای استفاده global
window.addToCart = addToCart;
window.filterProducts = filterProducts;
window.scrollToProducts = scrollToProducts;
window.openLoginModal = openLoginModal;
window.closeLoginModal = closeLoginModal;
window.openRegisterModal = openRegisterModal;

console.log('🚀 سیستم تتراشاپ با موفقیت لود شد!');
