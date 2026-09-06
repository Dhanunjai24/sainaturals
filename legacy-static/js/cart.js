/**
 * cart.js — Sri Sai Natural Foods
 * Shopping cart: localStorage persistence, CRUD, WhatsApp checkout
 */

const cart = (() => {
  const STORAGE_KEY = 'sai_naturals_cart';

  function getItems() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; }
    catch { return []; }
  }

  function saveItems(items) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    updateCartUI();
  }

  function addItem(item) {
    const items = getItems();
    const existing = items.find(i => i.id === item.id);
    if (existing) {
      existing.qty = (existing.qty || 1) + 1;
    } else {
      items.push({ ...item, qty: 1 });
    }
    saveItems(items);
  }

  function removeItem(itemId) {
    const items = getItems().filter(i => i.id !== itemId);
    saveItems(items);
    renderCartPage(); // refresh if on cart page
  }

  function updateQty(itemId, qty) {
    const items = getItems();
    const item = items.find(i => i.id === itemId);
    if (item) {
      item.qty = Math.max(1, qty);
      saveItems(items);
    }
    renderCartPage();
  }

  function clearCart() {
    saveItems([]);
    renderCartPage();
  }

  function getTotal() {
    return getItems().reduce((sum, i) => sum + i.price * (i.qty || 1), 0);
  }

  function getCount() {
    return getItems().reduce((sum, i) => sum + (i.qty || 1), 0);
  }

  function updateCartUI() {
    const badge = document.getElementById('cart-badge');
    const count = getCount();
    if (badge) {
      badge.textContent = count;
      badge.classList.toggle('visible', count > 0);
    }
  }

  /* WhatsApp message builder */
  function buildWhatsAppMessage() {
    const items = getItems();
    if (!items.length) return null;

    let msg = `Hello Sri Sai Natural Foods! 🌿\n\nI'd like to place the following order:\n\n`;
    items.forEach((item, idx) => {
      msg += `${idx + 1}. ${item.name} (${item.variant}) × ${item.qty} — ₹${(item.price * item.qty).toLocaleString('en-IN')}\n`;
    });
    msg += `\n─────────────────\n`;
    msg += `Total: ₹${getTotal().toLocaleString('en-IN')}\n\n`;
    msg += `Please confirm availability and pickup/delivery details. Thank you! 🙏`;
    return encodeURIComponent(msg);
  }

  function checkoutWhatsApp() {
    const msg = buildWhatsAppMessage();
    if (!msg) { alert('Your cart is empty!'); return; }
    window.open(`https://wa.me/917799549977?text=${msg}`, '_blank');
  }

  return { addItem, removeItem, updateQty, clearCart, getItems, getTotal, getCount, updateCartUI, checkoutWhatsApp };
})();

/* ---- Cart Page Renderer ---- */
function renderCartPage() {
  const items = cart.getItems();
  const container = document.getElementById('cart-items-container');
  const summary = document.getElementById('cart-summary-section');
  const empty = document.getElementById('cart-empty-state');
  if (!container) return;

  if (items.length === 0) {
    container.innerHTML = '';
    if (summary) summary.style.display = 'none';
    if (empty) empty.style.display = 'flex';
    return;
  }

  if (empty) empty.style.display = 'none';
  if (summary) summary.style.display = 'block';

  container.innerHTML = `
    <div class="cart-items">
      <div class="cart-items__header">
        <h2 style="font-size:1.4rem">Your Cart <span style="font-size:1rem;font-family:var(--font-body);font-weight:500;color:var(--brown-400)">(${cart.getCount()} items)</span></h2>
        <button class="btn btn-sm" style="border:1.5px solid var(--brown-100);color:var(--brown-400);font-size:0.8rem" onclick="cart.clearCart()">Clear all</button>
      </div>
      ${items.map(item => renderCartItem(item)).join('')}
    </div>
  `;

  // Update summary
  const subtotalEl = document.getElementById('cart-subtotal');
  const totalEl = document.getElementById('cart-total');
  const totalStr = formatRupee ? formatRupee(cart.getTotal()) : '₹' + cart.getTotal().toLocaleString('en-IN');
  if (subtotalEl) subtotalEl.textContent = totalStr;
  if (totalEl) totalEl.textContent = totalStr;
}

function renderCartItem(item) {
  const fmt = n => '₹' + n.toLocaleString('en-IN');
  return `
    <div class="cart-item" id="ci-${item.id.replace(/[^a-zA-Z0-9]/g,'_')}">
      <div class="cart-item__img-wrap">
        <img class="cart-item__img" src="${item.image}" alt="${item.name}">
      </div>
      <div>
        <div class="cart-item__name">${item.name}</div>
        <div class="cart-item__variant">${item.variant}</div>
        <div class="cart-item__controls">
          <div class="qty-control">
            <button onclick="cart.updateQty('${item.id}', ${item.qty - 1})">−</button>
            <span class="qty-control__num">${item.qty}</span>
            <button onclick="cart.updateQty('${item.id}', ${item.qty + 1})">+</button>
          </div>
          <button class="cart-item__remove" onclick="cart.removeItem('${item.id}')">Remove</button>
        </div>
      </div>
      <div class="cart-item__price">
        ${fmt(item.price * item.qty)}
        ${item.qty > 1 ? `<br><span style="font-size:0.75rem;color:var(--brown-400);font-family:var(--font-body)">${fmt(item.price)} each</span>` : ''}
      </div>
    </div>
  `;
}

window.cart = cart;
window.renderCartPage = renderCartPage;
