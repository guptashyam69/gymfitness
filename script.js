/* ===== SHARED SCRIPT — Fitness Club Management System ===== */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initHeroSlider();
  initScrollAnimations();
  initCounters();
  setActiveNavLink();
});

/* ===== NAVBAR ===== */
function initNavbar() {
  const navbar    = document.querySelector('.navbar');
  const hamburger = document.querySelector('.hamburger');
  const navLinks  = document.querySelector('.nav-links');

  // Scroll effect
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) navbar?.classList.add('scrolled');
    else navbar?.classList.remove('scrolled');
  });

  // Hamburger toggle
  hamburger?.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navLinks?.classList.toggle('open');
  });

  // Close menu on link click
  navLinks?.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      hamburger?.classList.remove('open');
      navLinks.classList.remove('open');
    });
  });
}

/* ===== SET ACTIVE NAV LINK ===== */
function setActiveNavLink() {
  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === path) a.classList.add('active');
  });
}

/* ===== HERO SLIDER ===== */
function initHeroSlider() {
  const slides  = document.querySelectorAll('.slide');
  const dots    = document.querySelectorAll('.dot');
  const prev    = document.querySelector('.slide-arrow.prev');
  const next    = document.querySelector('.slide-arrow.next');

  if (!slides.length) return;

  let current = 0;
  let timer;

  const goTo = (idx) => {
    slides[current].classList.remove('active');
    dots[current]?.classList.remove('active');
    current = (idx + slides.length) % slides.length;
    slides[current].classList.add('active');
    dots[current]?.classList.add('active');
  };

  const autoPlay = () => { timer = setInterval(() => goTo(current + 1), 5000); };
  const resetTimer = () => { clearInterval(timer); autoPlay(); };

  prev?.addEventListener('click', () => { goTo(current - 1); resetTimer(); });
  next?.addEventListener('click', () => { goTo(current + 1); resetTimer(); });
  dots.forEach((d, i) => d.addEventListener('click', () => { goTo(i); resetTimer(); }));

  // Keyboard
  document.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft')  { goTo(current - 1); resetTimer(); }
    if (e.key === 'ArrowRight') { goTo(current + 1); resetTimer(); }
  });

  autoPlay();
}

/* ===== SCROLL ANIMATIONS ===== */
function initScrollAnimations() {
  const targets = document.querySelectorAll('[data-anim]');
  if (!targets.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('anim-in');
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.15 });

  targets.forEach(t => observer.observe(t));
}

/* ===== COUNTER ANIMATION ===== */
function initCounters() {
  const counters = document.querySelectorAll('.count-up');
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        animateCounter(e.target);
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(c => observer.observe(c));
}

function animateCounter(el) {
  const target = parseInt(el.dataset.target, 10);
  const suffix = el.dataset.suffix || '';
  const duration = 1800;
  const step = target / (duration / 16);
  let current = 0;

  const tick = () => {
    current += step;
    if (current >= target) {
      el.textContent = target + suffix;
    } else {
      el.textContent = Math.floor(current) + suffix;
      requestAnimationFrame(tick);
    }
  };
  requestAnimationFrame(tick);
}

/* ===== TOAST NOTIFICATION ===== */
function showToast(message, icon = '✅') {
  let toast = document.querySelector('.toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.innerHTML = `<span class="toast-icon">${icon}</span><span>${message}</span>`;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 4000);
}

/* ===== FORM VALIDATION HELPER ===== */
function validateForm(form) {
  let valid = true;
  form.querySelectorAll('[required]').forEach(field => {
    if (!field.value.trim()) {
      field.style.borderColor = '#e63946';
      valid = false;
      field.addEventListener('input', () => field.style.borderColor = '', { once: true });
    }
  });
  return valid;
}

/* ===== Q&A TOGGLE ===== */
function toggleAnswer(btn) {
  const card = btn.closest('.qa-card');
  const answer = card.querySelector('.qa-answer');
  const isOpen = answer.classList.toggle('open');
  btn.textContent = isOpen ? '▲ Hide Answer' : '▼ Show Answer';
}

/* ===== Q&A LIKE ===== */
function likeQA(btn) {
  const count = btn.querySelector('.like-count');
  let n = parseInt(count.textContent, 10) || 0;
  count.textContent = n + 1;
  btn.style.color = '#e63946';
  btn.style.borderColor = '#e63946';
}

/* ===== SEARCH FILTER (Q&A page) ===== */
function initQASearch() {
  const input = document.querySelector('.search-input');
  const cards = document.querySelectorAll('.qa-card');
  if (!input) return;

  input.addEventListener('input', () => {
    const q = input.value.toLowerCase().trim();
    cards.forEach(card => {
      const text = card.textContent.toLowerCase();
      card.style.display = text.includes(q) ? '' : 'none';
    });
  });
}

/* ===== GALLERY LIGHTBOX ===== */
function initLightbox() {
  const items = document.querySelectorAll('.gallery-item');
  if (!items.length) return;

  const overlay = document.createElement('div');
  overlay.id = 'lightbox';
  overlay.style.cssText = `
    position:fixed;inset:0;background:rgba(0,0,0,0.92);
    display:none;z-index:9999;align-items:center;justify-content:center;
    padding:2rem;
  `;
  overlay.innerHTML = `
    <button id="lb-close" style="position:absolute;top:1rem;right:1.5rem;background:none;border:none;color:#fff;font-size:2rem;cursor:pointer;">✕</button>
    <img id="lb-img" src="" alt="" style="max-height:80vh;max-width:90vw;border-radius:12px;box-shadow:0 8px 40px rgba(0,0,0,0.8);">
    <p id="lb-caption" style="position:absolute;bottom:2rem;color:#ccc;font-size:0.95rem;"></p>
  `;
  document.body.appendChild(overlay);

  items.forEach(item => {
    item.addEventListener('click', () => {
      const img = item.querySelector('img');
      const cap = item.querySelector('.gallery-overlay span');
      document.getElementById('lb-img').src = img.src;
      document.getElementById('lb-caption').textContent = cap?.textContent || '';
      overlay.style.display = 'flex';
    });
  });

  overlay.addEventListener('click', e => {
    if (e.target === overlay || e.target.id === 'lb-close') overlay.style.display = 'none';
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') overlay.style.display = 'none';
  });
}

/* ===== REGISTER FORM SUBMISSION ===== */
function handleRegisterForm(e) {
  e.preventDefault();
  const form = e.target;
  if (!validateForm(form)) {
    showToast('Please fill in all required fields.', '⚠️');
    return;
  }
  const data = new FormData(form);
  const name = data.get('firstName') + ' ' + data.get('lastName');
  showToast(`Welcome, ${name}! Your registration is complete. 🎉`, '🏋️');
  form.reset();
}

/* ===== ASK QUESTION FORM ===== */
function handleAskForm(e) {
  e.preventDefault();
  const form = e.target;
  if (!validateForm(form)) {
    showToast('Please fill in all required fields.', '⚠️');
    return;
  }
  const question = form.querySelector('[name="question"]').value;
  const author   = form.querySelector('[name="name"]').value;
  const tag      = form.querySelector('[name="tag"]').value;

  const qaList = document.querySelector('.qa-list');
  const card = document.createElement('div');
  card.className = 'qa-card';
  card.innerHTML = `
    <div class="qa-meta">
      <span class="author">👤 ${author}</span>
      <span class="date">Just now</span>
      <span class="tag">${tag}</span>
    </div>
    <h4>${question}</h4>
    <p>Awaiting answers from community members...</p>
    <div class="qa-actions">
      <button class="qa-action-btn" onclick="likeQA(this)">👍 Like <span class="like-count">0</span></button>
      <button class="qa-action-btn" onclick="toggleAnswer(this)">▼ Show Answer</button>
    </div>
    <div class="qa-answer">
      <p>Be the first to answer this question!</p>
    </div>
  `;
  qaList?.prepend(card);
  form.reset();
  showToast('Your question has been posted!', '💬');
}
