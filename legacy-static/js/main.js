/**
 * main.js — Sri Sai Natural Foods
 * Navigation, scroll effects, toast, IntersectionObserver animations
 */

/* ---- Toast ---- */
function showToast(message, duration = 3000) {
  let toast = document.getElementById('global-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'global-toast';
    toast.className = 'toast';
    toast.innerHTML = `<span class="toast__icon">🌿</span><span class="toast__msg"></span>`;
    document.body.appendChild(toast);
  }
  toast.querySelector('.toast__msg').textContent = message;
  toast.classList.add('show');
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => toast.classList.remove('show'), duration);
}
window.showToast = showToast;

/* ---- Navigation ---- */
function initNav() {
  const nav = document.querySelector('.nav');
  if (!nav) return;

  // Scroll class
  const handleScroll = () => nav.classList.toggle('scrolled', window.scrollY > 40);
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // Active link
  const links = nav.querySelectorAll('.nav__link');
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  links.forEach(link => {
    const href = link.getAttribute('href').split('/').pop();
    if (href === currentPath || (currentPath === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  // Hamburger
  const hamburger = document.getElementById('nav-hamburger');
  const mobileNav  = document.getElementById('nav-mobile');
  hamburger?.addEventListener('click', () => {
    const open = mobileNav.classList.toggle('open');
    hamburger.setAttribute('aria-expanded', open);
    hamburger.querySelectorAll('span')[0].style.transform = open ? 'rotate(45deg) translate(5px,5px)' : '';
    hamburger.querySelectorAll('span')[1].style.opacity  = open ? '0' : '1';
    hamburger.querySelectorAll('span')[2].style.transform = open ? 'rotate(-45deg) translate(5px,-5px)' : '';
    document.body.style.overflow = open ? 'hidden' : '';
  });

  const closeMobileNav = () => {
    mobileNav.classList.remove('open');
    if (hamburger) {
      hamburger.setAttribute('aria-expanded', 'false');
      hamburger.querySelectorAll('span')[0].style.transform = '';
      hamburger.querySelectorAll('span')[1].style.opacity  = '1';
      hamburger.querySelectorAll('span')[2].style.transform = '';
    }
    document.body.style.overflow = '';
  };

  mobileNav?.addEventListener('click', (e) => {
    if (e.target.tagName === 'A' || e.target.closest('a') || e.target === mobileNav) {
      closeMobileNav();
    }
  });
}

/* ---- Scroll animations ---- */
function initScrollAnimations() {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));
}

/* ---- Hero parallax/load ---- */
function initHero() {
  const hero = document.querySelector('.hero');
  if (!hero) return;
  setTimeout(() => hero.classList.add('loaded'), 100);
}

/* ---- Smooth number counter ---- */
function animateCounter(el, target, duration = 1500) {
  let start = 0;
  const step = timestamp => {
    if (!start) start = timestamp;
    const progress = Math.min((timestamp - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(eased * target);
    if (progress < 1) requestAnimationFrame(step);
    else el.textContent = target;
  };
  requestAnimationFrame(step);
}

function initCounters() {
  const counters = document.querySelectorAll('[data-counter]');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        animateCounter(e.target, parseInt(e.target.dataset.counter));
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.5 });
  counters.forEach(el => observer.observe(el));
}

/* ---- Cart badge init ---- */
function initCartBadge() {
  if (window.cart) cart.updateCartUI();
}

/* ---- Bootstrap ---- */
document.addEventListener('DOMContentLoaded', () => {
  initNav();
  initHero();
  initScrollAnimations();
  initCounters();
  initCartBadge();

  // Page-specific init
  if (document.getElementById('featured-products'))  initFeaturedProducts?.();
  if (document.getElementById('products-grid'))      initProductsPage?.();
  if (document.getElementById('pd-name'))            initProductPage?.();
  if (document.getElementById('cart-items-container')) renderCartPage?.();
});
