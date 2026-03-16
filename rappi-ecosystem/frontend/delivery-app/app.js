const API_BASE = 'http://localhost:3000';

let currentUser = null;

const loginView = document.getElementById('loginView');
const dashboardView = document.getElementById('dashboardView');
const logoutBtn = document.getElementById('logoutBtn');
const loginForm = document.getElementById('loginForm');

const myDeliveriesList = document.getElementById('myDeliveriesList');
const availableList = document.getElementById('availableList');
const refreshAvailableBtn = document.getElementById('refreshAvailableBtn');

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
        if (data.user.role !== 'delivery') throw new Error('Not a delivery rider account');

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

    await refreshAll();
}

async function refreshAll() {
    await Promise.all([
        loadMyDeliveries(),
        loadAvailableOrders()
    ]);
}

refreshAvailableBtn.addEventListener('click', loadAvailableOrders);

// ─── AVAILABLE ORDERS POOL ────────────────────────────────────────────────────

async function loadAvailableOrders() {
    availableList.innerHTML = 'Loading...';
    const res = await fetch(`${API_BASE}/orders/available`, {
        headers: { 'x-user-id': currentUser.id }
    });
    const data = await res.json();

    if (data.orders.length === 0) {
        availableList.innerHTML = '<p>No pending orders available.</p>';
        return;
    }

    availableList.innerHTML = data.orders.map(o => `
    <div class="item-card">
      <div>
        <strong>Order #${o.id.split('-')[0]}...</strong><br>
        <small style="color:#666">${new Date(o.created_at).toLocaleString()}</small>
      </div>
      <button onclick="acceptOrder('${o.id}')" style="margin:0">Accept Delivery</button>
    </div>
  `).join('');
}

// ─── ACCEPT ORDER ─────────────────────────────────────────────────────────────

window.acceptOrder = async (orderId) => {
    try {
        const res = await fetch(`${API_BASE}/orders/${orderId}/accept`, {
            method: 'PATCH',
            headers: { 'x-user-id': currentUser.id }
        });

        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.error);
        }

        await refreshAll();
    } catch (err) {
        alert(err.message);
        await refreshAll();
    }
};

// ─── MY DELIVERIES ────────────────────────────────────────────────────────────

async function loadMyDeliveries() {
    myDeliveriesList.innerHTML = 'Loading...';
    const res = await fetch(`${API_BASE}/orders/my-deliveries`, {
        headers: { 'x-user-id': currentUser.id }
    });
    const data = await res.json();

    if (data.orders.length === 0) {
        myDeliveriesList.innerHTML = '<p>You have no active deliveries.</p>';
        return;
    }

    myDeliveriesList.innerHTML = data.orders.map(o => `
    <div class="item-card" style="display:block; border-left: 4px solid #457b9d;">
      <div style="display:flex; justify-content:space-between">
        <strong>Order #${o.id.split('-')[0]}...</strong>
        <span class="status-badge">${o.status.replace('_', ' ')}</span>
      </div>
      <small style="color:#666">${new Date(o.created_at).toLocaleString()}</small>
    </div>
  `).join('');
}
