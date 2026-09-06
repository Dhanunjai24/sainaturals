/**
 * products.js — Sri Sai Natural Foods
 * Product catalogue data + rendering + filter/sort logic
 */

const PRODUCTS = [
  /* ---- WOOD-PRESSED OILS ---- */
  {
    id: 'wp-mustard-oil',
    name: 'Wood-Pressed Mustard Oil',
    category: 'oils',
    subcategory: 'Wood-Pressed',
    description: 'Traditional kachi ghani mustard oil pressed on clean wooden machines. Watch your tin being pressed fresh — pungent, aromatic, and full of natural goodness.',
    benefits: ['Rich in Omega-3 & Omega-6 fatty acids', 'Antibacterial & antifungal properties', 'Stimulates digestion', 'Enhances heart health'],
    image: 'images/mustard-oil.jpg',
    badge: 'Bestseller',
    featured: true,
    variants: [
      { label: '500 ml', price: 95 },
      { label: '1 Litre', price: 180 },
      { label: '5 Litres', price: 850 }
    ]
  },
  {
    id: 'wp-groundnut-oil',
    name: 'Wood-Pressed Groundnut Oil',
    category: 'oils',
    subcategory: 'Wood-Pressed',
    description: 'Cold-pressed from the finest groundnuts using traditional wooden presses. Nutty, flavourful and naturally preservative-free.',
    benefits: ['High in monounsaturated fats', 'Rich in Vitamin E', 'Boosts immunity', 'Good for skin and hair'],
    image: 'images/oils-collection.jpg',
    badge: 'Popular',
    featured: true,
    variants: [
      { label: '500 ml', price: 110 },
      { label: '1 Litre', price: 210 },
      { label: '5 Litres', price: 980 }
    ]
  },
  {
    id: 'wp-coconut-oil',
    name: 'Wood-Pressed Coconut Oil',
    category: 'oils',
    subcategory: 'Wood-Pressed',
    description: 'Pure cold-pressed coconut oil with an authentic tropical aroma. Retains all natural nutrients and medium-chain fatty acids.',
    benefits: ['Rich in MCTs for energy', 'Supports brain function', 'Antimicrobial properties', 'Excellent for skin & hair'],
    image: 'images/oils-collection.jpg',
    badge: '',
    featured: true,
    variants: [
      { label: '250 ml', price: 130 },
      { label: '500 ml', price: 240 },
      { label: '1 Litre', price: 460 }
    ]
  },
  {
    id: 'wp-sesame-oil',
    name: 'Wood-Pressed Sesame Oil',
    category: 'oils',
    subcategory: 'Wood-Pressed',
    description: 'Traditional gingelly oil pressed from the finest sesame seeds. Aromatic, deep-flavoured, and loaded with antioxidants.',
    benefits: ['High in lignans & antioxidants', 'Supports bone health', 'Anti-inflammatory', 'Promotes heart health'],
    image: 'images/oils-collection.jpg',
    badge: '',
    featured: false,
    variants: [
      { label: '250 ml', price: 150 },
      { label: '500 ml', price: 280 },
      { label: '1 Litre', price: 540 }
    ]
  },
  {
    id: 'wp-sunflower-oil',
    name: 'Wood-Pressed Sunflower Oil',
    category: 'oils',
    subcategory: 'Wood-Pressed',
    description: 'Light and mild wood-pressed sunflower oil. A great everyday cooking oil with a high smoke point.',
    benefits: ['Rich in Vitamin E', 'Light and neutral flavour', 'Good source of polyunsaturated fats', 'Supports cardiovascular health'],
    image: 'images/oils-collection.jpg',
    badge: '',
    featured: false,
    variants: [
      { label: '500 ml', price: 90 },
      { label: '1 Litre', price: 170 },
      { label: '5 Litres', price: 790 }
    ]
  },
  /* ---- COLD-PRESSED OILS ---- */
  {
    id: 'cp-flaxseed-oil',
    name: 'Cold-Pressed Flaxseed Oil',
    category: 'oils',
    subcategory: 'Cold-Pressed',
    description: 'Premium cold-pressed flaxseed oil — one of nature\'s best plant sources of Omega-3 ALA. Ideal for salads and smoothies.',
    benefits: ['Highest plant source of Omega-3 ALA', 'Reduces inflammation', 'Supports digestive health', 'Great for skin elasticity'],
    image: 'images/oils-collection.jpg',
    badge: 'Rare Find',
    featured: false,
    variants: [
      { label: '250 ml', price: 195 },
      { label: '500 ml', price: 360 }
    ]
  },
  /* ---- GHEE ---- */
  {
    id: 'pure-cow-ghee',
    name: 'Pure Cow Ghee',
    category: 'ghee',
    subcategory: 'Ghee',
    description: 'Rich, aromatic bilona-style pure cow ghee. Slow-churned from cultured butter to preserve its golden colour and deep flavour.',
    benefits: ['Lactose and casein free', 'Rich in butyric acid', 'High smoke point for cooking', 'Supports gut health'],
    image: 'images/ghee.jpg',
    badge: 'Premium',
    featured: true,
    variants: [
      { label: '250 g', price: 340 },
      { label: '500 g', price: 650 },
      { label: '1 kg', price: 1200 }
    ]
  },
  {
    id: 'buffalo-ghee',
    name: 'Buffalo Ghee',
    category: 'ghee',
    subcategory: 'Ghee',
    description: 'Traditional pure buffalo ghee, made from fresh milk. Whiter in colour and richer in fat — perfect for South Indian recipes.',
    benefits: ['High in healthy saturated fats', 'Rich in fat-soluble vitamins', 'Strengthens bones', 'Slow-digesting energy source'],
    image: 'images/ghee.jpg',
    badge: '',
    featured: false,
    variants: [
      { label: '250 g', price: 260 },
      { label: '500 g', price: 500 },
      { label: '1 kg', price: 950 }
    ]
  },
  /* ---- PULSES & DALS ---- */
  {
    id: 'toor-dal',
    name: 'Toor Dal (Split Pigeon Pea)',
    category: 'pulses',
    subcategory: 'Dals',
    description: 'Fresh, clean toor dal — the backbone of Indian cooking. Stocked fresh in store with a quality you can taste.',
    benefits: ['High in plant protein', 'Rich in dietary fibre', 'Folate for cell growth', 'Low glycaemic index'],
    image: 'images/pulses.jpg',
    badge: '',
    featured: true,
    variants: [
      { label: '500 g', price: 80 },
      { label: '1 kg', price: 155 },
      { label: '5 kg', price: 740 }
    ]
  },
  {
    id: 'moong-dal',
    name: 'Moong Dal (Split Green Gram)',
    category: 'pulses',
    subcategory: 'Dals',
    description: 'Light and easy-to-digest yellow moong dal. A staple for everyday dal, khichdi and soups.',
    benefits: ['Easiest dal to digest', 'High in antioxidants', 'Supports weight management', 'Good source of iron & magnesium'],
    image: 'images/pulses.jpg',
    badge: '',
    featured: false,
    variants: [
      { label: '500 g', price: 75 },
      { label: '1 kg', price: 145 },
      { label: '5 kg', price: 690 }
    ]
  },
  {
    id: 'chana-dal',
    name: 'Chana Dal (Bengal Gram)',
    category: 'pulses',
    subcategory: 'Dals',
    description: 'Hearty split chickpea dal with a mildly sweet, nutty flavour. Perfect for dal tadka, sweets and curries.',
    benefits: ['High in fibre for gut health', 'Manages blood sugar levels', 'Rich in plant protein', 'Excellent source of manganese'],
    image: 'images/pulses.jpg',
    badge: '',
    featured: false,
    variants: [
      { label: '500 g', price: 65 },
      { label: '1 kg', price: 125 },
      { label: '5 kg', price: 590 }
    ]
  },
  {
    id: 'urad-dal',
    name: 'Urad Dal (Black Gram)',
    category: 'pulses',
    subcategory: 'Dals',
    description: 'Black gram dal — essential for idli batter, dal makhani and South Indian cooking. High protein, high flavour.',
    benefits: ['Highest protein among dals', 'Supports bone & joint health', 'Rich in potassium', 'Good for lactating mothers'],
    image: 'images/pulses.jpg',
    badge: '',
    featured: false,
    variants: [
      { label: '500 g', price: 85 },
      { label: '1 kg', price: 165 }
    ]
  },
  {
    id: 'masoor-dal',
    name: 'Masoor Dal (Red Lentil)',
    category: 'pulses',
    subcategory: 'Dals',
    description: 'Quick-cooking red lentils with a mild earthy flavour. Ready in minutes, packed with nutrition.',
    benefits: ['Cooks in under 15 minutes', 'Rich in iron and folate', 'Supports heart health', 'Good source of plant protein'],
    image: 'images/pulses.jpg',
    badge: '',
    featured: false,
    variants: [
      { label: '500 g', price: 70 },
      { label: '1 kg', price: 135 }
    ]
  },
  /* ---- SPICES ---- */
  {
    id: 'turmeric-powder',
    name: 'Turmeric Powder (Haldi)',
    category: 'spices',
    subcategory: 'Spices',
    description: 'Pure, vibrant turmeric powder sourced from quality farms. Freshly ground with high curcumin content.',
    benefits: ['Powerful anti-inflammatory', 'Rich in curcumin antioxidants', 'Boosts immunity', 'Supports liver health'],
    image: 'images/spices.jpg',
    badge: '',
    featured: false,
    variants: [
      { label: '100 g', price: 55 },
      { label: '250 g', price: 130 },
      { label: '500 g', price: 240 }
    ]
  },
  {
    id: 'red-chilli-powder',
    name: 'Red Chilli Powder (Lal Mirch)',
    category: 'spices',
    subcategory: 'Spices',
    description: 'Bright, fiery red chilli powder from select red chillies. Freshly ground for maximum colour and heat.',
    benefits: ['Rich in Vitamin C', 'Boosts metabolism', 'Contains capsaicin for pain relief', 'Natural food colouring'],
    image: 'images/spices.jpg',
    badge: '',
    featured: false,
    variants: [
      { label: '100 g', price: 50 },
      { label: '250 g', price: 120 },
      { label: '500 g', price: 220 }
    ]
  },
  {
    id: 'coriander-powder',
    name: 'Coriander Powder (Dhania)',
    category: 'spices',
    subcategory: 'Spices',
    description: 'Freshly ground coriander powder with a warm, citrusy flavour — a must in every Indian kitchen.',
    benefits: ['Aids digestion', 'Rich in antioxidants', 'Supports blood sugar control', 'Anti-inflammatory properties'],
    image: 'images/spices.jpg',
    badge: '',
    featured: false,
    variants: [
      { label: '100 g', price: 45 },
      { label: '250 g', price: 110 }
    ]
  },
  /* ---- RAW FOODS ---- */
  {
    id: 'raw-honey',
    name: 'Raw Forest Honey',
    category: 'raw',
    subcategory: 'Raw Foods',
    description: 'Unprocessed, unheated wild forest honey. Thick, aromatic and loaded with enzymes, pollen and antioxidants.',
    benefits: ['Unprocessed — retains enzymes', 'Natural cough & sore throat remedy', 'Rich in antioxidants', 'Healthier sweetener alternative'],
    image: 'images/honey.jpg',
    badge: '100% Natural',
    featured: true,
    variants: [
      { label: '250 g', price: 220 },
      { label: '500 g', price: 420 },
      { label: '1 kg', price: 800 }
    ]
  },
  {
    id: 'jaggery',
    name: 'Pure Cane Jaggery',
    category: 'raw',
    subcategory: 'Raw Foods',
    description: 'Traditional unrefined jaggery made from pure sugarcane juice. A wholesome, natural sweetener with deep molasses flavour.',
    benefits: ['Unrefined natural sweetener', 'Rich in iron & magnesium', 'Aids digestion after meals', 'Loaded with minerals'],
    image: 'images/pulses.jpg',
    badge: '',
    featured: false,
    variants: [
      { label: '500 g', price: 75 },
      { label: '1 kg', price: 145 },
      { label: '5 kg', price: 680 }
    ]
  }
];

const CATEGORIES = [
  { id: 'all',    label: 'All Products', emoji: '🌿' },
  { id: 'oils',   label: 'Oils',         emoji: '🫙' },
  { id: 'ghee',   label: 'Ghee',         emoji: '✨' },
  { id: 'pulses', label: 'Pulses & Dals',emoji: '🫘' },
  { id: 'spices', label: 'Spices',       emoji: '🌶️' },
  { id: 'raw',    label: 'Raw Foods',    emoji: '🍯' }
];

/* Counts per category */
function getCategoryCounts() {
  const counts = { all: PRODUCTS.length };
  PRODUCTS.forEach(p => { counts[p.category] = (counts[p.category] || 0) + 1; });
  return counts;
}

/* Get current variant price */
function getActivePrice(product, variantIndex = 0) {
  return product.variants[variantIndex]?.price ?? product.variants[0].price;
}

/* Format Indian Rupee */
function formatRupee(n) { return '₹' + n.toLocaleString('en-IN'); }

/* Render a product card */
function renderProductCard(product, variantIndex = 0) {
  const price = getActivePrice(product, variantIndex);
  const variantHTML = product.variants
    .map((v, i) => `<span class="variant-pill${i === variantIndex ? ' active' : ''}" data-idx="${i}" data-price="${v.price}" data-label="${v.label}">${v.label}</span>`)
    .join('');
  const badgeHTML = product.badge
    ? `<span class="product-card__badge">${product.badge}</span>` : '';

  return `
    <article class="product-card fade-up" data-product-id="${product.id}">
      <div class="product-card__img-wrap">
        <img class="product-card__img" src="${product.image}" alt="${product.name}" loading="lazy">
        ${badgeHTML}
      </div>
      <div class="product-card__body">
        <div class="product-card__category">${product.subcategory}</div>
        <h3 class="product-card__name">${product.name}</h3>
        <p class="product-card__desc">${product.description.substring(0, 90)}…</p>
        <div class="product-card__variants">${variantHTML}</div>
        <div class="product-card__footer">
          <div class="product-card__price" data-price-display>
            ${formatRupee(price)}
            <span>/ ${product.variants[variantIndex].label}</span>
          </div>
          <button class="btn-add-cart" onclick="handleAddToCart('${product.id}', this)">
            <span>🛒</span> Add
          </button>
        </div>
      </div>
    </article>
  `;
}

/* Attach variant pill click handlers */
function attachVariantHandlers(container) {
  container.querySelectorAll('.variant-pill').forEach(pill => {
    pill.addEventListener('click', function () {
      const card = this.closest('.product-card');
      card.querySelectorAll('.variant-pill').forEach(p => p.classList.remove('active'));
      this.classList.add('active');
      const priceEl = card.querySelector('[data-price-display]');
      const label = this.dataset.label;
      priceEl.innerHTML = `${formatRupee(parseInt(this.dataset.price))} <span>/ ${label}</span>`;
    });
  });
}

/* Handle Add to Cart from product card */
function handleAddToCart(productId, btn) {
  const product = PRODUCTS.find(p => p.id === productId);
  if (!product) return;
  const card = btn.closest('.product-card');
  const activeVariant = card.querySelector('.variant-pill.active');
  const variantLabel = activeVariant ? activeVariant.dataset.label : product.variants[0].label;
  const variantPrice = activeVariant ? parseInt(activeVariant.dataset.price) : product.variants[0].price;

  cart.addItem({
    id: `${productId}--${variantLabel.replace(/\s/g, '-')}`,
    productId,
    name: product.name,
    variant: variantLabel,
    price: variantPrice,
    image: product.image
  });

  btn.classList.add('added');
  btn.innerHTML = '<span>✓</span> Added!';
  setTimeout(() => {
    btn.classList.remove('added');
    btn.innerHTML = '<span>🛒</span> Add';
  }, 1800);

  showToast(`${product.name} (${variantLabel}) added to cart!`);
}

/* Products page: filter + sort + search + render */
function initProductsPage() {
  const grid = document.getElementById('products-grid');
  const countEl = document.getElementById('products-count');
  const sortSel = document.getElementById('sort-select');
  const searchInput = document.getElementById('search-input');
  const filterBtns = document.querySelectorAll('.filter-btn');

  let activeCategory = 'all';
  let searchQuery = '';
  let sortMode = 'default';

  function getFiltered() {
    let list = [...PRODUCTS];
    if (activeCategory !== 'all') list = list.filter(p => p.category === activeCategory);
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      list = list.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.subcategory.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
      );
    }
    if (sortMode === 'price-asc')  list.sort((a,b) => a.variants[0].price - b.variants[0].price);
    if (sortMode === 'price-desc') list.sort((a,b) => b.variants[0].price - a.variants[0].price);
    if (sortMode === 'name')       list.sort((a,b) => a.name.localeCompare(b.name));
    return list;
  }

  function render() {
    const filtered = getFiltered();
    if (countEl) countEl.innerHTML = `Showing <strong>${filtered.length}</strong> products`;
    if (!grid) return;
    if (filtered.length === 0) {
      grid.innerHTML = `
        <div class="empty-state">
          <div class="empty-state__icon">🔍</div>
          <h3>No products found</h3>
          <p>Try a different filter or search term.</p>
        </div>`;
      return;
    }
    grid.innerHTML = filtered.map(p => renderProductCard(p)).join('');
    attachVariantHandlers(grid);
    observeFadeUps(grid);
  }

  filterBtns?.forEach(btn => {
    btn.addEventListener('click', function () {
      filterBtns.forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      activeCategory = this.dataset.category;
      render();
    });
  });

  sortSel?.addEventListener('change', () => { sortMode = sortSel.value; render(); });
  searchInput?.addEventListener('input', () => { searchQuery = searchInput.value.trim(); render(); });

  render();
}

/* Featured products on home page */
function initFeaturedProducts() {
  const grid = document.getElementById('featured-products');
  if (!grid) return;
  const featured = PRODUCTS.filter(p => p.featured).slice(0, 6);
  grid.innerHTML = featured.map(p => renderProductCard(p)).join('');
  attachVariantHandlers(grid);
  observeFadeUps(grid);
}

/* Single product page */
function initProductPage() {
  const params = new URLSearchParams(window.location.search);
  const productId = params.get('id');
  const product = PRODUCTS.find(p => p.id === productId) || PRODUCTS[0];

  // Name & category
  document.getElementById('pd-name') && (document.getElementById('pd-name').textContent = product.name);
  document.getElementById('pd-category') && (document.getElementById('pd-category').textContent = product.subcategory);
  document.getElementById('pd-desc') && (document.getElementById('pd-desc').textContent = product.description);

  // Image
  const img = document.getElementById('pd-img');
  if (img) { img.src = product.image; img.alt = product.name; }

  // Benefits
  const bEl = document.getElementById('pd-benefits');
  if (bEl) bEl.innerHTML = product.benefits.map(b => `<li>${b}</li>`).join('');

  // Variants
  const vGroup = document.getElementById('pd-variants');
  if (vGroup) {
    vGroup.innerHTML = product.variants.map((v, i) =>
      `<button class="variant-option${i===0?' active':''}" data-idx="${i}" data-price="${v.price}" data-label="${v.label}">${v.label}</button>`
    ).join('');
    vGroup.querySelectorAll('.variant-option').forEach(btn => {
      btn.addEventListener('click', function () {
        vGroup.querySelectorAll('.variant-option').forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        updatePdPrice();
      });
    });
  }

  // Price
  function updatePdPrice() {
    const active = vGroup?.querySelector('.variant-option.active');
    const price = active ? parseInt(active.dataset.price) : product.variants[0].price;
    const label = active ? active.dataset.label : product.variants[0].label;
    const priceEl = document.getElementById('pd-price');
    if (priceEl) priceEl.textContent = formatRupee(price);
    return { price, label };
  }
  updatePdPrice();

  // Quantity
  let qty = 1;
  const qtyEl = document.getElementById('pd-qty');
  document.getElementById('pd-qty-minus')?.addEventListener('click', () => { if (qty > 1) { qty--; if(qtyEl) qtyEl.value = qty; } });
  document.getElementById('pd-qty-plus')?.addEventListener('click', () => { qty++; if(qtyEl) qtyEl.value = qty; });

  // Add to Cart
  document.getElementById('pd-add-cart')?.addEventListener('click', () => {
    const { price, label } = updatePdPrice();
    for (let i = 0; i < qty; i++) {
      cart.addItem({
        id: `${product.id}--${label.replace(/\s/g,'-')}`,
        productId: product.id,
        name: product.name,
        variant: label,
        price,
        image: product.image
      });
    }
    showToast(`${product.name} (${label}) × ${qty} added to cart!`);
  });

  // WhatsApp
  document.getElementById('pd-whatsapp')?.addEventListener('click', () => {
    const { price, label } = updatePdPrice();
    const msg = encodeURIComponent(`Hello Sri Sai Natural Foods! 🌿\n\nI'd like to order:\n• ${product.name} (${label}) × ${qty} — ${formatRupee(price * qty)}\n\nPlease confirm availability. Thank you!`);
    window.open(`https://wa.me/917799549977?text=${msg}`, '_blank');
  });

  // Related products
  const relatedGrid = document.getElementById('related-products');
  if (relatedGrid) {
    const related = PRODUCTS.filter(p => p.category === product.category && p.id !== product.id).slice(0, 3);
    relatedGrid.innerHTML = related.map(p => renderProductCard(p)).join('');
    attachVariantHandlers(relatedGrid);
  }

  // Page title
  document.title = `${product.name} — Sri Sai Natural Foods`;
}

/* Utility: observe fade-ups */
function observeFadeUps(root) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target); } });
  }, { threshold: 0.1 });
  (root || document).querySelectorAll('.fade-up').forEach(el => observer.observe(el));
}

window.PRODUCTS = PRODUCTS;
window.renderProductCard = renderProductCard;
window.handleAddToCart = handleAddToCart;
window.initProductsPage = initProductsPage;
window.initFeaturedProducts = initFeaturedProducts;
window.initProductPage = initProductPage;
window.observeFadeUps = observeFadeUps;
window.formatRupee = formatRupee;
