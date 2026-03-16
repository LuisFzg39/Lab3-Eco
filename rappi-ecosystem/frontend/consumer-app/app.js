import { API_BASE } from '../api.js';

let currentUser = null;
let currentStoreViewing = null;
let cart = [];

const loginView = document.getElementById('loginView');
const dashboardView = document.getElementById('dashboardView');
const logoutBtn = document.getElementById('logoutBtn');
const loginForm = document.getElementById('loginForm');

const storesSection = document.getElementById('storesSection');
const storesList = document.getElementById('storesList');

const storeDetailsSection = document.getElementById('storeDetailsSection');
const currentStoreName = document.getElementById('currentStoreName');
const productsList = document.getElementById('productsList');
const backToStoresBtn = document.getElementById('backToStoresBtn');

const cartList = document.getElementById('cartList');
const checkoutBtn = document.getElementById('checkoutBtn');
const ordersHistoryList = document.getElementById('ordersHistoryList');

// ─── LOGIN & AUTH ─────────────────────────────────────────────────────────────

loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const res = await fetch(`${API_BASE}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        if (data.user.role !== 'consumer') throw new Error('Not a consumer account');

        currentUser = data.user;
        showDashboard();
    } catch (err) {
        document.getElementById('loginError').textContent = err.message;
    }
});

logoutBtn.addEventListener('click', () => location.reload());

async function showDashboard() {
    loginView.classList.add('hidden');
    dashboardView.classList.remove('hidden');
    logoutBtn.classList.remove('hidden');
    document.getElementById('userStatus').textContent = `Logged in as ${currentUser.name}`;

    await loadOpenStores();
    await loadMyOrders();
}

// ─── STORES ───────────────────────────────────────────────────────────────────

async function loadOpenStores() {
    const res = await fetch(`${API_BASE}/stores`);
    const data = await res.json();

    if (data.stores.length === 0) {
        storesList.innerHTML = '<p>No open stores right now. Come back later.</p>';
        return;
    }

    storesList.innerHTML = data.stores.map(store => `
    <div class="store-card" onclick="viewStore('${store.id}', '${store.name}')">
      <strong>${store.name}</strong>
      <p style="color:#666; font-size:0.9em; margin-top:0.5rem">Click to view products</p>
    </div>
  `).join('');
}

window.viewStore = async (storeId, storeName) => {
    currentStoreViewing = storeId;
    storesSection.classList.add('hidden');
    storeDetailsSection.classList.remove('hidden');
    currentStoreName.textContent = storeName;

    productsList.innerHTML = 'Loading...';

    const res = await fetch(`${API_BASE}/stores/${storeId}/products`);
    const data = await res.json();

    if (data.products.length === 0) {
        productsList.innerHTML = '<p>This store has no products yet.</p>';
        return;
    }

    productsList.innerHTML = data.products.map(p => `
    <div class="item-card">
      <div>
        <strong>${p.name}</strong><br>
        <small>$${p.price}</small>
      </div>
      <button onclick="addToCart('${p.id}', '${p.name}', ${p.price}, '${storeId}')">Add to Cart</button>
    </div>
  `).join('');
};

backToStoresBtn.addEventListener('click', () => {
    storeDetailsSection.classList.add('hidden');
    storesSection.classList.remove('hidden');
    currentStoreViewing = null;
});

// ─── CART ─────────────────────────────────────────────────────────────────────

window.addToCart = (productId, name, price, storeId) => {
    if (cart.length > 0 && cart[0].storeId !== storeId) {
        alert('You can only order from one store at a time! Clear cart first.');
        return;
    }

    const existing = cart.find(i => i.productId === productId);
    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push({ productId, name, price, quantity: 1, storeId });
    }

    renderCart();
};

function renderCart() {
    if (cart.length === 0) {
        cartList.innerHTML = 'Cart is empty.';
        checkoutBtn.classList.add('hidden');
        return;
    }

    let total = 0;
    cartList.innerHTML = cart.map((item, idx) => {
        total += item.price * item.quantity;
        return `
      <div style="display:flex; justify-content:space-between; margin-bottom:0.5rem">
        <span>${item.quantity}x ${item.name}</span>
        <span>$${item.price * item.quantity}</span>
      </div>
    `;
    }).join('');

    cartList.innerHTML += `<hr style="margin:1rem 0;"><strong style="display:block; text-align:right">Total: $${total}</strong>`;

    checkoutBtn.classList.remove('hidden');
    checkoutBtn.textContent = `Place Order ($${total})`;
}

// ─── CHECKOUT ─────────────────────────────────────────────────────────────────

checkoutBtn.addEventListener('click', async () => {
    const storeId = cart[0].storeId;
    const items = cart.map(i => ({ productId: i.productId, quantity: i.quantity }));

    checkoutBtn.disabled = true;
    checkoutBtn.textContent = 'Processing...';

    try {
        const res = await fetch(`${API_BASE}/orders`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-user-id': currentUser.id
            },
            body: JSON.stringify({ storeId, items })
        });

        if (!res.ok) throw new Error((await res.json()).error);

        alert('Order placed successfully!');
        cart = [];
        renderCart();
        await loadMyOrders();
        backToStoresBtn.click();
    } catch (err) {
        alert(err.message);
    } finally {
        checkoutBtn.disabled = false;
    }
});

// ─── ORDERS HISTORY ──────────────────────────────────────────────────────────

async function loadMyOrders() {
    const res = await fetch(`${API_BASE}/orders/my-orders`, {
        headers: { 'x-user-id': currentUser.id }
    });
    const data = await res.json();

    if (data.orders.length === 0) {
        ordersHistoryList.innerHTML = '<p>No past orders.</p>';
        return;
    }

    ordersHistoryList.innerHTML = data.orders.map(o => `
    <div class="item-card" style="display:block; line-height:1.6">
      <strong>Order #${o.id.split('-')[0]}...</strong>
      <span style="float:right; text-transform:uppercase; font-size:0.8em; font-weight:bold">${o.status}</span>
      <br>
      <small style="color:#666">${new Date(o.created_at).toLocaleString()}</small>
    </div>
  `).join('');
}
