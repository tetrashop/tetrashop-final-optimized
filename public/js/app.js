document.addEventListener('DOMContentLoaded', () => {
    // محصولات فروشگاه
    const products = [
        { id: 1, title: '🎮 کنسول بازی', price: 8500000, emoji: '🎮' },
        { id: 2, title: '🎧 هدفون حرفه‌ای', price: 1200000, emoji: '🎧' },
        { id: 3, title: '⌨️ کیبورد مکانیکی', price: 900000, emoji: '⌨️' }
    ];

    const cart = JSON.parse(localStorage.getItem('tetrashop_cart')) || [];
    let score = parseInt(localStorage.getItem('tetrashop_score')) || 0;

    const cartItemsEl = document.getElementById('cart-items');
    const cartTotalEl = document.getElementById('cart-total-price');
    const checkoutBtn = document.getElementById('checkout-btn');
    const scoreEl = document.getElementById('score');
    const container = document.getElementById('products-container');

    function formatPrice(price) {
        return price.toLocaleString('fa-IR') + ' تومان';
    }

    function updateScore(points) {
        score += points;
        localStorage.setItem('tetrashop_score', score);
        scoreEl.textContent = score.toLocaleString('fa-IR');
    }

    function saveCart() {
        localStorage.setItem('tetrashop_cart', JSON.stringify(cart));
    }

    function renderCart() {
        cartItemsEl.innerHTML = '';
        let total = 0;

        cart.forEach((item, index) => {
            total += item.price * item.qty;
            const div = document.createElement('div');
            div.className = 'cart-item';
            div.innerHTML = `
                <span>${item.title} (${item.qty})</span>
                <span>${formatPrice(item.price * item.qty)}</span>
                <button class="remove-item" data-index="${index}">✕</button>
            `;
            cartItemsEl.appendChild(div);
        });

        cartTotalEl.textContent = formatPrice(total);
        checkoutBtn.disabled = cart.length === 0;

        // اضافه کردن event listener برای دکمه‌های حذف
        document.querySelectorAll('.remove-item').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const idx = parseInt(e.target.dataset.index);
                cart.splice(idx, 1);
                saveCart();
                renderCart();
                updateScore(-5); // کاهش امتیاز به دلیل حذف
            });
        });
    }

    function addToCart(product) {
        const existing = cart.find(item => item.id === product.id);
        if (existing) {
            existing.qty += 1;
        } else {
            cart.push({ ...product, qty: 1 });
        }
        saveCart();
        renderCart();
        updateScore(10); // افزایش امتیاز به ازای افزودن
    }

    function renderProducts() {
        container.innerHTML = '';
        products.forEach(product => {
            const card = document.createElement('div');
            card.className = 'product-card';
            card.innerHTML = `
                <div class="product-emoji">${product.emoji}</div>
                <h3 class="product-title">${product.title}</h3>
                <p class="product-price">${formatPrice(product.price)}</p>
                <button class="add-to-cart-btn" data-id="${product.id}">
                    افزودن به سبد خرید
                </button>
            `;
            container.appendChild(card);
        });

        document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = parseInt(e.target.dataset.id);
                const product = products.find(p => p.id === id);
                if (product) {
                    addToCart(product);
                    // افکت کوچک
                    e.target.textContent = '✓ افزوده شد';
                    setTimeout(() => {
                        e.target.textContent = 'افزودن به سبد خرید';
                    }, 800);
                }
            });
        });
    }

    // رویداد دکمه نهایی کردن خرید
    checkoutBtn.addEventListener('click', () => {
        if (cart.length === 0) return;
        alert('خرید شما با موفقیت انجام شد! 🎉');
        cart.length = 0;
        saveCart();
        renderCart();
        updateScore(50); // امتیاز bonus
    });

    // مقداردهی اولیه
    scoreEl.textContent = score.toLocaleString('fa-IR');
    renderProducts();
    renderCart();
});
