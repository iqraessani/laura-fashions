// ===== PROMO BAR =====
const promoBar = document.getElementById('promoBar');
const promoClose = document.getElementById('promoClose');

if (localStorage.getItem('lauraPromoClosed') === '1') {
  document.body.classList.add('promo-hidden');
}

promoClose?.addEventListener('click', () => {
  document.body.classList.add('promo-hidden');
  localStorage.setItem('lauraPromoClosed', '1');
});

// ===== LOADER =====
window.addEventListener('load', () => {
  setTimeout(() => {
    document.getElementById('loader')?.classList.add('hidden');
  }, 2200);
});

// ===== SEARCH MODAL =====
const searchModal = document.getElementById('searchModal');
const searchBtn = document.getElementById('searchBtn');
const searchClose = document.getElementById('searchClose');
const searchBackdrop = document.getElementById('searchBackdrop');
const searchInput = document.getElementById('searchInput');

function openSearch() {
  searchModal?.classList.add('open');
  searchModal?.setAttribute('aria-hidden', 'false');
  setTimeout(() => searchInput?.focus(), 200);
}

function closeSearch() {
  searchModal?.classList.remove('open');
  searchModal?.setAttribute('aria-hidden', 'true');
}

searchBtn?.addEventListener('click', openSearch);
searchClose?.addEventListener('click', closeSearch);
searchBackdrop?.addEventListener('click', closeSearch);

document.querySelectorAll('.search-chip').forEach((chip) => {
  chip.addEventListener('click', () => {
    const term = chip.dataset.term;
    if (searchInput) searchInput.value = term;
    closeSearch();
    const featured = document.getElementById('featured');
    if (featured) {
      const top = featured.getBoundingClientRect().top + window.pageYOffset - 90;
      window.scrollTo({ top, behavior: 'smooth' });
    }
    showToast(`Showing results for "${term}"`, 'info');
  });
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeSearch();
});

// ===== NAVBAR =====
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar?.classList.toggle('scrolled', window.scrollY > 50);
});

// ===== MOBILE MENU =====
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

hamburger?.addEventListener('click', () => {
  mobileMenu?.classList.toggle('open');
  const spans = hamburger.querySelectorAll('span');
  const open = mobileMenu?.classList.contains('open');
  spans[0].style.transform = open ? 'rotate(45deg) translate(5px, 5px)' : '';
  spans[1].style.opacity = open ? '0' : '';
  spans[2].style.transform = open ? 'rotate(-45deg) translate(5px, -5px)' : '';
});

function closeMenu() {
  mobileMenu?.classList.remove('open');
  const spans = hamburger?.querySelectorAll('span');
  if (spans) {
    spans[0].style.transform = '';
    spans[1].style.opacity = '';
    spans[2].style.transform = '';
  }
}

// ===== SCROLL REVEAL =====
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add('visible');
    });
  },
  { threshold: 0.1 }
);
document.querySelectorAll('.reveal').forEach((el) => revealObserver.observe(el));

// ===== SMOOTH SCROLL =====
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    if (!href || href === '#') return;
    const target = document.querySelector(href);
    if (!target) return;
    e.preventDefault();
    const offset = document.body.classList.contains('promo-hidden') ? 80 : 120;
    const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

// ===== ACTIVE NAV =====
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
  let current = 'home';
  sections.forEach((section) => {
    if (window.pageYOffset >= section.offsetTop - 140) {
      current = section.id;
    }
  });
  navLinks.forEach((link) => {
    link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
  });
});

// ===== PRODUCT FILTER =====
document.querySelectorAll('.filter-btn').forEach((btn) => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-btn').forEach((b) => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;
    document.querySelectorAll('.product-card').forEach((card) => {
      const match = filter === 'all' || card.dataset.category === filter;
      card.classList.toggle('hidden', !match);
    });
  });
});

// ===== SIZE SELECTOR =====
document.querySelectorAll('.size-row').forEach((row) => {
  row.querySelectorAll('.size-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      row.querySelectorAll('.size-btn').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });
});

// ===== WISHLIST =====
const WISHLIST_KEY = 'lauraWishlist';
let wishlist = JSON.parse(localStorage.getItem(WISHLIST_KEY) || '[]');

function saveWishlist() {
  localStorage.setItem(WISHLIST_KEY, JSON.stringify(wishlist));
  updateWishlistUI();
}

function updateWishlistUI() {
  const countEl = document.getElementById('wishlistCount');
  const listEl = document.getElementById('wishlistList');
  const emptyEl = document.getElementById('wishlistEmpty');

  if (countEl) {
    countEl.textContent = wishlist.length;
    countEl.classList.toggle('show', wishlist.length > 0);
  }

  if (!listEl || !emptyEl) return;

  if (wishlist.length === 0) {
    emptyEl.hidden = false;
    listEl.hidden = true;
    listEl.innerHTML = '';
    return;
  }

  emptyEl.hidden = true;
  listEl.hidden = false;
  listEl.innerHTML = wishlist
    .map(
      (name) => `
      <li>
        <span>${name}</span>
        <button type="button" data-remove="${name}">Remove</button>
      </li>`
    )
    .join('');

  listEl.querySelectorAll('[data-remove]').forEach((btn) => {
    btn.addEventListener('click', () => {
      wishlist = wishlist.filter((item) => item !== btn.dataset.remove);
      saveWishlist();
      syncWishlistButtons();
      showToast('Product removed from saved list', 'info');
    });
  });
}

function syncWishlistButtons() {
  document.querySelectorAll('.wishlist-btn').forEach((btn) => {
    const name = btn.dataset.product;
    const active = wishlist.includes(name);
    btn.classList.toggle('active', active);
    const icon = btn.querySelector('i');
    if (icon) icon.className = active ? 'fas fa-heart' : 'far fa-heart';
  });
}

document.querySelectorAll('.wishlist-btn').forEach((btn) => {
  btn.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    const name = btn.dataset.product;
    if (wishlist.includes(name)) {
      wishlist = wishlist.filter((item) => item !== name);
      showToast('Product removed from saved list', 'info');
    } else {
      wishlist.push(name);
      showToast('Product saved successfully', 'success');
    }
    saveWishlist();
    syncWishlistButtons();
  });
});

updateWishlistUI();
syncWishlistButtons();

// ===== TESTIMONIAL SLIDER (mobile) =====
const testiDots = document.querySelectorAll('.testi-dot');
const testiCards = document.querySelectorAll('.testi-card');

testiDots.forEach((dot) => {
  dot.addEventListener('click', () => {
    const index = Number(dot.dataset.index);
    testiDots.forEach((d) => d.classList.remove('active'));
    dot.classList.add('active');
    testiCards.forEach((card, i) => {
      card.style.display = window.innerWidth <= 1024 ? (i === index ? 'block' : 'none') : '';
    });
  });
});

// ===== BACK TO TOP =====
const backToTop = document.getElementById('backToTop');
window.addEventListener('scroll', () => {
  backToTop?.classList.toggle('visible', window.scrollY > 500);
});
backToTop?.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ===== NEWSLETTER =====
function submitNewsletter(e) {
  e.preventDefault();
  const email = document.getElementById('newsletterEmail')?.value.trim();
  if (!email) return;
  showToast('Thank you for subscribing.', 'success');
  document.getElementById('newsletterForm')?.reset();
}

// ===== WHATSAPP ORDER =====
function submitOrder(e) {
  e.preventDefault();
  const name = document.getElementById('name')?.value.trim();
  const phone = document.getElementById('phone')?.value.trim();
  const email = document.getElementById('email')?.value.trim();
  const category = document.getElementById('category')?.value;
  const message = document.getElementById('message')?.value.trim();

  if (!name || !phone || !category) {
    showToast('Please fill all required fields', 'error');
    return;
  }

  const wishlistNote = wishlist.length ? `\n*Saved Products:* ${wishlist.join(', ')}` : '';

  const text = `Hello Laura Fashion,\n\n*New Order Request*\n\n*Name:* ${name}\n*Phone:* ${phone}\n*Email:* ${email || 'Not provided'}\n*Category:* ${category}\n*Message:* ${message || 'None'}${wishlistNote}\n\nPlease confirm availability and delivery details. Thank you.`;

  window.open(`https://wa.me/917506507833?text=${encodeURIComponent(text)}`, '_blank');
  showToast('Opening WhatsApp…', 'success');
  document.getElementById('orderForm')?.reset();
}

// ===== TOAST =====
function showToast(msg, type = 'info') {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.textContent = msg;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(20px)';
    toast.style.transition = '0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3200);
}
