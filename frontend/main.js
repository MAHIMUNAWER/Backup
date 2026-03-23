let a=10;
vector<int>v(a);
for(let i=1; i<a; i++)
{
    for(let j=i; j<a; j+=i)
    {
        v[j]++;
    }
}
vector<let>primes;
for(let i=1; i<a; i++)
{
    if(v[i]==2)
    {
        primes.push_back(i);
    }
}
cout<<primes.size()<<" ";

for(let i=0; i<primes.size(); i++) cout<<primes[i]<<" ";

// =============================================
//  AgriShop - Main JavaScript
// =============================================

// ─── 1. SIDEBAR TOGGLE ────────────────────────
function toggleMenu(btn) {
    const content = btn.nextElementSibling;
    const icon = btn.querySelector('i');
    const isOpen = content.style.maxHeight;

    // Close all other open menus
    document.querySelectorAll('.submenu-content').forEach(el => {
        el.style.maxHeight = null;
        el.previousElementSibling.querySelector('i').classList.replace('fa-minus', 'fa-plus');
    });

    // Toggle clicked one
    if (!isOpen) {
        content.style.maxHeight = content.scrollHeight + 'px';
        icon.classList.replace('fa-plus', 'fa-minus');
    }
}

// ─── 2. SEARCH BAR ────────────────────────────
(function initSearch() {
    const input  = document.querySelector('.search-bar input');
    const button = document.querySelector('.search-bar button');

    function doSearch() {
        const query = input.value.trim();
        if (!query) {
            showToast('Please enter a search term.', 'warning');
            return;
        }
        showToast(`Searching for "${query}"…`, 'info');
        // TODO: replace with real search/fetch logic
    }

    button.addEventListener('click', doSearch);
    input.addEventListener('keydown', e => { if (e.key === 'Enter') doSearch(); });

    // Live suggestions (stub)
    input.addEventListener('input', () => {
        const suggestions = [
            'Rice Seeds', 'Wheat Seeds', 'Fresh Milk',
            'Organic Fertilizer', 'Jute Bags', 'Mango'
        ];
        const val = input.value.toLowerCase();
        clearSuggestions();
        if (!val) return;
        const matched = suggestions.filter(s => s.toLowerCase().includes(val));
        if (matched.length) renderSuggestions(matched);
    });

    function renderSuggestions(list) {
        const box = document.createElement('div');
        box.id = 'suggestion-box';
        box.style.cssText = `
            position:absolute; background:#1a1a1a; border:1px solid #333;
            width:${input.offsetWidth}px; z-index:999; border-radius:0 0 4px 4px;
        `;
        list.forEach(item => {
            const d = document.createElement('div');
            d.textContent = item;
            d.style.cssText = 'padding:8px 12px; cursor:pointer; color:#fff; font-size:13px;';
            d.addEventListener('mouseenter', () => d.style.background = '#333');
            d.addEventListener('mouseleave', () => d.style.background = 'transparent');
            d.addEventListener('click', () => { input.value = item; clearSuggestions(); });
            box.appendChild(d);
        });
        input.parentElement.style.position = 'relative';
        input.parentElement.appendChild(box);
    }

    function clearSuggestions() {
        const box = document.getElementById('suggestion-box');
        if (box) box.remove();
    }

    document.addEventListener('click', e => {
        if (!input.parentElement.contains(e.target)) clearSuggestions();
    });
})();


// ─── 3. PRICE RANGE FILTER ───────────────────
(function initPriceFilter() {
    const slider = document.querySelector('.slider');
    const inputs = document.querySelectorAll('.price-inputs input');
    if (!slider || inputs.length < 2) return;

    slider.addEventListener('input', () => {
        inputs[1].value = slider.value;
        filterProductsByPrice(+inputs[0].value, +slider.value);
    });

    inputs[0].addEventListener('change', () => {
        filterProductsByPrice(+inputs[0].value, +inputs[1].value);
    });
    inputs[1].addEventListener('change', () => {
        slider.value = inputs[1].value;
        filterProductsByPrice(+inputs[0].value, +inputs[1].value);
    });
})();

function filterProductsByPrice(min, max) {
    document.querySelectorAll('.product-card').forEach(card => {
        const priceEl = card.querySelector('.price');
        if (!priceEl) return;
        const price = parseFloat(priceEl.textContent.replace(/[^0-9.]/g, ''));
        card.style.display = (price >= min && price <= max) ? '' : 'none';
    });
}


// ─── 4. IN-STOCK FILTER ──────────────────────
(function initStockFilter() {
    const checkbox = document.querySelector('.filter-group input[type="checkbox"]');
    if (!checkbox) return;
    checkbox.addEventListener('change', () => {
        document.querySelectorAll('.product-card').forEach(card => {
            const outOfStock = card.dataset.stock === 'false';
            if (checkbox.checked && outOfStock) card.style.display = 'none';
            else card.style.display = '';
        });
    });
})();


// ─── 5. ADD TO CART ──────────────────────────
const cart = [];

function initCartButtons() {
    document.querySelectorAll('.buy-btn').forEach(btn => {
        btn.addEventListener('click', function () {
            const card   = this.closest('.product-card');
            const name   = card.querySelector('h3')?.textContent || 'Product';
            const price  = card.querySelector('.price')?.textContent || '$0';
            const tag    = card.querySelector('.tag')?.textContent || '';

            const existing = cart.find(i => i.name === name);
            if (existing) {
                existing.qty++;
            } else {
                cart.push({ name, price, tag, qty: 1 });
            }

            updateCartBadge();
            showToast(`${name} added to cart!`, 'success');
            animateCartIcon();
        });
    });
}

function updateCartBadge() {
    let badge = document.getElementById('cart-badge');
    const cartLink = document.querySelector('.user-nav a[href="#"]:last-child');
    if (!cartLink) return;

    if (!badge) {
        badge = document.createElement('span');
        badge.id = 'cart-badge';
        badge.style.cssText = `
            background:#febd69; color:#000; border-radius:50%;
            padding:1px 6px; font-size:11px; font-weight:bold; margin-left:4px;
        `;
        cartLink.appendChild(badge);
    }
    const total = cart.reduce((s, i) => s + i.qty, 0);
    badge.textContent = total;
    badge.style.display = total ? 'inline' : 'none';
}

function animateCartIcon() {
    const cartLink = document.querySelector('.user-nav a[href="#"]:last-child');
    if (!cartLink) return;
    cartLink.style.transform = 'scale(1.3)';
    cartLink.style.transition = 'transform 0.2s';
    setTimeout(() => cartLink.style.transform = 'scale(1)', 300);
}

// Simple cart modal
(function initCartModal() {
    const cartLink = document.querySelector('.user-nav a[href="#"]:last-child');
    if (!cartLink) return;
    cartLink.addEventListener('click', e => {
        e.preventDefault();
        if (!cart.length) { showToast('Your cart is empty.', 'info'); return; }

        let existing = document.getElementById('cart-modal');
        if (existing) { existing.remove(); return; }

        const modal = document.createElement('div');
        modal.id = 'cart-modal';
        modal.style.cssText = `
            position:fixed; top:70px; right:5%; background:#1a1a1a;
            border:1px solid #febd69; border-radius:6px; z-index:1000;
            width:300px; padding:15px; box-shadow:0 8px 30px rgba(0,0,0,.6);
        `;

        let html = '<h3 style="color:#febd69;margin-top:0">🛒 Your Cart</h3>';
        let grandTotal = 0;
        cart.forEach(item => {
            const val = parseFloat(item.price.replace(/[^0-9.]/g, ''));
            grandTotal += val * item.qty;
            html += `
                <div style="display:flex;justify-content:space-between;padding:6px 0;border-bottom:1px solid #333;font-size:13px">
                    <span>${item.name} × ${item.qty}</span>
                    <span style="color:#febd69">$${(val * item.qty).toFixed(2)}</span>
                </div>`;
        });
        html += `
            <p style="text-align:right;font-weight:bold;color:#febd69">Total: $${grandTotal.toFixed(2)}</p>
            <button onclick="checkoutCart()" style="width:100%;background:#febd69;border:none;padding:10px;font-weight:bold;border-radius:4px;cursor:pointer">Proceed to Checkout</button>
        `;
        modal.innerHTML = html;

        const closeBtn = document.createElement('button');
        closeBtn.textContent = '✕';
        closeBtn.style.cssText = 'position:absolute;top:8px;right:10px;background:none;border:none;color:#fff;font-size:16px;cursor:pointer';
        closeBtn.onclick = () => modal.remove();
        modal.appendChild(closeBtn);

        document.body.appendChild(modal);
    });
})();

function checkoutCart() {
    showToast('Redirecting to checkout…', 'success');
    const modal = document.getElementById('cart-modal');
    if (modal) modal.remove();
    // TODO: redirect to checkout page
}


// ─── 6. TOAST NOTIFICATIONS ──────────────────
function showToast(message, type = 'info') {
    const colors = { success: '#2ecc71', warning: '#f39c12', info: '#3498db', error: '#e74c3c' };
    const icons  = { success: '✔', warning: '⚠', info: 'ℹ', error: '✖' };

    const toast = document.createElement('div');
    toast.style.cssText = `
        position:fixed; bottom:20px; right:20px; background:${colors[type]};
        color:#fff; padding:12px 20px; border-radius:6px; font-size:14px;
        box-shadow:0 4px 15px rgba(0,0,0,.4); z-index:9999;
        display:flex; align-items:center; gap:8px;
        animation: slideIn .3s ease;
    `;
    toast.innerHTML = `<span>${icons[type]}</span><span>${message}</span>`;
    document.body.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transition = 'opacity .4s';
        setTimeout(() => toast.remove(), 400);
    }, 3000);
}

// CSS for toast animation
const style = document.createElement('style');
style.textContent = `@keyframes slideIn { from { transform:translateX(100%); opacity:0; } to { transform:translateX(0); opacity:1; } }`;
document.head.appendChild(style);


// ─── 7. PRODUCT CARDS (dynamic rendering) ────
const PRODUCTS = [
    { name: 'Premium Rice Seeds',    price: 45,  tag: 'Cereals',   stock: true  },
    { name: 'Fresh Farm Milk (1L)',   price: 12,  tag: 'Dairy',     stock: true  },
    { name: 'Organic Wheat Flour',    price: 28,  tag: 'Processed', stock: true  },
    { name: 'Tomato Seeds (50g)',     price: 8,   tag: 'Vegetables',stock: true  },
    { name: 'Sunflower Oilseeds',    price: 55,  tag: 'Oilseeds',  stock: false },
    { name: 'Free-Range Eggs (12)',   price: 15,  tag: 'Eggs',      stock: true  },
    { name: 'Jute Bags (Pack of 10)', price: 22,  tag: 'Processed', stock: true  },
    { name: 'Mango Jam (500g)',       price: 18,  tag: 'Fruits',    stock: false },
];

function renderProducts(list = PRODUCTS) {
    const section = document.querySelector('.content');
    if (!section) return;

    let container = document.querySelector('.product-container');
    if (!container) {
        container = document.createElement('div');
        container.className = 'product-container';
        section.appendChild(container);
    }
    container.innerHTML = '';

    list.forEach(product => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.dataset.stock = product.stock;
        card.innerHTML = `
            <div class="product-image" style="display:flex;align-items:center;justify-content:center;font-size:40px">
                ${tagEmoji(product.tag)}
            </div>
            <div class="tag">${product.tag}</div>
            <h3 style="font-size:14px;margin:10px 0 5px">${product.name}</h3>
            <p class="price">$${product.price.toFixed(2)}</p>
            ${product.stock
                ? `<button class="buy-btn">Add to Cart</button>`
                : `<button class="buy-btn" disabled style="opacity:.5;cursor:not-allowed">Out of Stock</button>`
            }
        `;
        container.appendChild(card);
    });

    initCartButtons();
}

function tagEmoji(tag) {
    const map = {
        'Cereals': '🌾', 'Dairy': '🥛', 'Processed': '🏭',
        'Vegetables': '🥦', 'Oilseeds': '🌻', 'Eggs': '🥚',
        'Fruits': '🍋', 'Meat': '🥩',
    };
    return map[tag] || '🌿';
}


// ─── 8. FLASH SALE COUNTDOWN ─────────────────
(function initCountdown() {
    const hero = document.querySelector('.hero');
    if (!hero) return;

    const end = new Date();
    end.setHours(end.getHours() + 6); // 6-hour flash sale

    const timer = document.createElement('p');
    timer.style.cssText = 'color:#febd69;font-size:14px;margin:0';
    hero.appendChild(timer);

    function update() {
        const diff = end - Date.now();
        if (diff <= 0) { timer.textContent = 'Sale Ended!'; return; }
        const h = String(Math.floor(diff / 3600000)).padStart(2, '0');
        const m = String(Math.floor((diff % 3600000) / 60000)).padStart(2, '0');
        const s = String(Math.floor((diff % 60000) / 1000)).padStart(2, '0');
        timer.textContent = `⏰ Ends in: ${h}:${m}:${s}`;
    }
    update();
    setInterval(update, 1000);
})();


// ─── 9. CATEGORY BAR ACTIVE STATE ────────────
(function initCategoryBar() {
    document.querySelectorAll('.category-bar a').forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelectorAll('.category-bar a').forEach(a => a.style.color = '#fff');
            this.style.color = '#febd69';
        });
    });
})();


// ─── 10. NAVBAR SCROLL EFFECT ────────────────
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;
    navbar.style.boxShadow = window.scrollY > 10
        ? '0 4px 20px rgba(254,189,105,0.15)'
        : 'none';
});


// ─── INIT ─────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    renderProducts();
    showToast('Welcome to AgriShop! 🌾', 'success');
});

