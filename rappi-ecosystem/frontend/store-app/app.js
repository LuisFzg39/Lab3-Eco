const API_BASE = 'http://localhost:3000';

let currentUser = null;
let currentStore = null;

const loginView = document.getElementById('loginView');
const dashboardView = document.getElementById('dashboardView');
const logoutBtn = document.getElementById('logoutBtn');
const loginForm = document.getElementById('loginForm');
const storeInfo = document.getElementById('storeInfo');
const toggleStoreBtn = document.getElementById('toggleStoreBtn');
const productForm = document.getElementById('productForm');
const productsList = document.getElementById('productsList');

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
        if (data.user.role !== 'store') throw new Error('Not a store account');

        currentUser = data.user;

        showDashboard();
    } catch (err) {
        document.getElementById('loginError').textContent = err.message;
    }
});

logoutBtn.addEventListener('click', () => {
    currentUser = null;
    currentStore = null;
    loginView.classList.remove('hidden');
    dashboardView.classList.add('hidden');
    logoutBtn.classList.add('hidden');
});

async function showDashboard() {
    loginView.classList.add('hidden');
    dashboardView.classList.remove('hidden');
    logoutBtn.classList.remove('hidden');
    document.getElementById('storeStatus').textContent = `Logged in as ${currentUser.name}`;

    await fetchMyStore();
    await loadProducts();
}

// ─── STORE CONTROLS ───────────────────────────────────────────────────────────

async function fetchMyStore() {
    const res = await fetch(`${API_BASE}/stores/my-store`, {
        headers: { 'x-user-id': currentUser.id }
    });
    const data = await res.json();
    currentStore = data.store;
    renderStoreInfo();
}

function renderStoreInfo() {
    const badgeClass = currentStore.is_open ? 'open' : 'closed';
    const statusText = currentStore.is_open ? 'OPEN' : 'CLOSED';

    storeInfo.innerHTML = `
    <div style="display:flex; align-items:center; gap:10px;">
      <h3>${currentStore.name}</h3>
      <span class="badge ${badgeClass}">${statusText}</span>
    </div>
  `;

    toggleStoreBtn.textContent = currentStore.is_open ? 'Close Store' : 'Open Store';
}

toggleStoreBtn.addEventListener('click', async () => {
    const action = currentStore.is_open ? 'close' : 'open';
    await fetch(`${API_BASE}/stores/${currentStore.id}/${action}`, {
        method: 'PATCH',
        headers: { 'x-user-id': currentUser.id }
    });
    await fetchMyStore();
});

// ─── PRODUCTS ─────────────────────────────────────────────────────────────────

productForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('prodName').value;
    const price = parseInt(document.getElementById('prodPrice').value, 10);

    await fetch(`${API_BASE}/products`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-user-id': currentUser.id
        },
        body: JSON.stringify({ name, price, store_id: currentStore.id })
    });

    productForm.reset();
    await loadProducts();
});

async function loadProducts() {
    const res = await fetch(`${API_BASE}/stores/${currentStore.id}/products`);
    const data = await res.json();

    if (data.products.length === 0) {
        productsList.innerHTML = '<p>No products yet.</p>';
        return;
    }

    productsList.innerHTML = data.products.map(p => `
    <div class="item-card">
      <div>
        <strong>${p.name}</strong><br>
        <small>$${p.price}</small>
      </div>
      <button onclick="deleteProduct('${p.id}')" style="background:#e63946;">Delete</button>
    </div>
  `).join('');
}

window.deleteProduct = async (id) => {
    if (!confirm('Are you sure?')) return;
    await fetch(`${API_BASE}/products/${id}`, {
        method: 'DELETE',
        headers: { 'x-user-id': currentUser.id }
    });
    await loadProducts();
};
