/* ============================================================
   ELITE AUTO DETAILING — PREMIUM JAVASCRIPT
   ============================================================ */

'use strict';

/* ——— Loader: only first visit per session ——— */
(function initLoader() {
  const loader = document.getElementById('loader');
  if (!loader) return;

  const visited = sessionStorage.getItem('elite_visited');
  if (visited) {
    // Already visited — hide instantly, no animation
    loader.style.display = 'none';
    document.body.classList.remove('is-loading');
    initReveal();
    return;
  }

  // First visit — show loader then reveal
  sessionStorage.setItem('elite_visited', '1');
  window.addEventListener('load', () => {
    setTimeout(() => {
      loader.classList.add('hidden');
      document.body.classList.remove('is-loading');
      initReveal();
    }, 2200);
  });

  // Fallback if load already fired
  if (document.readyState === 'complete') {
    setTimeout(() => {
      loader.classList.add('hidden');
      document.body.classList.remove('is-loading');
      initReveal();
    }, 2200);
  }
})();

/* ——— Scroll Progress ——— */
const scrollBar = document.querySelector('.scroll-prog-bar');
window.addEventListener('scroll', () => {
  if (!scrollBar) return;
  const pct = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
  scrollBar.style.width = Math.min(pct, 100) + '%';
}, { passive: true });

/* ——— Navigation ——— */
const nav = document.querySelector('.nav');
const hamburger = document.querySelector('.nav-hamburger');
const mobileMenu = document.querySelector('.mobile-menu');
const mobileOverlay = document.querySelector('.mobile-overlay');

if (nav) {
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 50);
  }, { passive: true });
}

if (hamburger && mobileMenu) {
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    mobileMenu.classList.toggle('open');
    mobileOverlay && mobileOverlay.classList.toggle('show');
  });
  mobileOverlay && mobileOverlay.addEventListener('click', () => {
    hamburger.classList.remove('open');
    mobileMenu.classList.remove('open');
    mobileOverlay.classList.remove('show');
  });
}

document.querySelectorAll('.mobile-menu .nav-link').forEach(link => {
  link.addEventListener('click', () => {
    hamburger && hamburger.classList.remove('open');
    mobileMenu && mobileMenu.classList.remove('open');
    mobileOverlay && mobileOverlay.classList.remove('show');
  });
});

/* ——— Active Nav Link ——— */
(function setActiveNav() {
  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(link => {
    const href = link.getAttribute('href') || '';
    if (href === path || (path === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
})();

/* ——— Custom Cursor ——— */
(function initCursor() {
  const dot  = document.querySelector('.cursor-dot');
  const ring = document.querySelector('.cursor-ring');
  if (!dot || !ring) return;
  if (window.matchMedia('(hover: none)').matches) {
    dot.style.display = 'none'; ring.style.display = 'none'; return;
  }
  document.addEventListener('mousemove', e => {
    dot.style.left  = e.clientX + 'px'; dot.style.top  = e.clientY + 'px';
    ring.style.left = e.clientX + 'px'; ring.style.top = e.clientY + 'px';
  });
  document.querySelectorAll('a, button, .service-card, .vehicle-card, .testi-card, .masonry-item, .comparison').forEach(el => {
    el.addEventListener('mouseenter', () => { dot.classList.add('hover'); ring.classList.add('hover'); });
    el.addEventListener('mouseleave', () => { dot.classList.remove('hover'); ring.classList.remove('hover'); });
  });
})();

/* ——— Scroll Reveal ——— */
function initReveal() {
  const els = document.querySelectorAll('.reveal, .reveal-fade, .reveal-left, .reveal-right');
  if (!els.length) return;
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); obs.unobserve(e.target); } });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
  els.forEach(el => obs.observe(el));
}
// Also run on DOMContentLoaded for non-first-visit pages
document.addEventListener('DOMContentLoaded', () => {
  const visited = sessionStorage.getItem('elite_visited');
  if (visited) initReveal();
});

/* ——— Animated Counters ——— */
function animateCounter(el) {
  const target = parseFloat(el.dataset.target);
  const suffix = el.dataset.suffix || '';
  const decimals = target % 1 !== 0 ? 1 : 0;
  const duration = 2000;
  let start = null;
  function step(ts) {
    if (!start) start = ts;
    const ease = 1 - Math.pow(1 - Math.min((ts - start) / duration, 1), 4);
    el.textContent = (decimals ? (ease * target).toFixed(1) : Math.floor(ease * target)) + suffix;
    if (ease < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}
const counterObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting && !e.target.dataset.counted) {
      e.target.dataset.counted = '1';
      animateCounter(e.target);
      counterObs.unobserve(e.target);
    }
  });
}, { threshold: 0.5 });
document.querySelectorAll('[data-target]').forEach(el => counterObs.observe(el));

/* ——— Before / After Comparison Slider ——— */
(function initComparison() {
  const comp = document.querySelector('.comparison');
  if (!comp) return;
  const afterImg = comp.querySelector('.comp-after');
  const handle   = comp.querySelector('.comp-handle');
  let dragging = false;

  function setPos(x) {
    const rect = comp.getBoundingClientRect();
    const pct  = Math.max(5, Math.min(95, ((x - rect.left) / rect.width) * 100));
    afterImg.style.clipPath = `inset(0 ${100 - pct}% 0 0)`;
    handle.style.left = pct + '%';
  }

  comp.addEventListener('mousedown',  e => { dragging = true; setPos(e.clientX); });
  comp.addEventListener('touchstart', e => { dragging = true; setPos(e.touches[0].clientX); }, { passive: true });
  window.addEventListener('mousemove', e => { if (dragging) setPos(e.clientX); });
  window.addEventListener('touchmove', e => { if (dragging) setPos(e.touches[0].clientX); }, { passive: true });
  window.addEventListener('mouseup',  () => dragging = false);
  window.addEventListener('touchend', () => dragging = false);

  // Init at 50%
  const rect = comp.getBoundingClientRect();
  setPos(rect.left + rect.width * 0.5);
})();

/* ——— Hero Mouse Parallax ——— */
(function initParallax() {
  const hero = document.querySelector('.hero');
  if (!hero || window.matchMedia('(hover: none)').matches) return;
  const carWrap = hero.querySelector('.hero-car-wrap');
  const bgWord  = hero.querySelector('.hero-bg-word');
  hero.addEventListener('mousemove', e => {
    const r = hero.getBoundingClientRect();
    const cx = (e.clientX - r.left) / r.width  - 0.5;
    const cy = (e.clientY - r.top)  / r.height - 0.5;
    if (carWrap) carWrap.style.transform = `translateY(${cy * -16}px) translateX(${cx * 10}px)`;
    if (bgWord)  bgWord.style.transform  = `translate(-50%,-50%) translateX(${cx * 28}px)`;
  });
  hero.addEventListener('mouseleave', () => {
    if (carWrap) carWrap.style.transform = '';
    if (bgWord)  bgWord.style.transform  = '';
  });
})();

/* ——— Track Sliders (Vehicles + Testimonials) ——— */
function initTrackSlider(trackSel, prevSel, nextSel) {
  const track = document.querySelector(trackSel);
  const prev  = document.querySelector(prevSel);
  const next  = document.querySelector(nextSel);
  if (!track) return;

  const scrollAmount = () => track.querySelector('[class$="-card"]')?.offsetWidth + 20 || 400;

  prev && prev.addEventListener('click', () => track.scrollBy({ left: -scrollAmount(), behavior: 'smooth' }));
  next && next.addEventListener('click', () => track.scrollBy({ left:  scrollAmount(), behavior: 'smooth' }));

  // Drag to scroll
  let isDown = false, startX, scrollLeft;
  track.addEventListener('mousedown', e => { isDown = true; track.style.cursor = 'grabbing'; startX = e.pageX - track.offsetLeft; scrollLeft = track.scrollLeft; });
  track.addEventListener('mouseleave',() => { isDown = false; track.style.cursor = ''; });
  track.addEventListener('mouseup',   () => { isDown = false; track.style.cursor = ''; });
  track.addEventListener('mousemove', e => {
    if (!isDown) return; e.preventDefault();
    track.scrollLeft = scrollLeft - (e.pageX - track.offsetLeft - startX) * 1.5;
  });
}

initTrackSlider('.vehicles-track',     '.vehicles-prev',     '.vehicles-next');
initTrackSlider('.testimonials-track', '.testimonials-prev', '.testimonials-next');

/* ——— Gallery Filter + Lightbox ——— */
(function initGallery() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const items = document.querySelectorAll('.masonry-item');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const cat = btn.dataset.filter;
      items.forEach(item => {
        const show = cat === 'all' || item.dataset.cat === cat;
        item.style.opacity = show ? '1' : '0';
        item.style.display = show ? '' : 'none';
      });
    });
  });

  // Lightbox
  const lb     = document.querySelector('.lightbox');
  if (!lb) return;
  const lbImg  = lb.querySelector('.lightbox-img');
  const lbClose= lb.querySelector('.lb-close');
  const lbPrev = lb.querySelector('.lb-prev');
  const lbNext = lb.querySelector('.lb-next');

  let idx = 0;
  const srcs = [];
  items.forEach((item, i) => {
    srcs.push(item.querySelector('img').src);
    item.addEventListener('click', () => { idx = i; lbImg.src = srcs[i]; lb.classList.add('open'); document.body.style.overflow = 'hidden'; });
  });

  function closeLb() { lb.classList.remove('open'); document.body.style.overflow = ''; }
  lbClose && lbClose.addEventListener('click', closeLb);
  lb.addEventListener('click', e => { if (e.target === lb) closeLb(); });
  lbPrev && lbPrev.addEventListener('click', () => { idx = (idx - 1 + srcs.length) % srcs.length; lbImg.src = srcs[idx]; });
  lbNext && lbNext.addEventListener('click', () => { idx = (idx + 1) % srcs.length; lbImg.src = srcs[idx]; });
  document.addEventListener('keydown', e => {
    if (!lb.classList.contains('open')) return;
    if (e.key === 'Escape') closeLb();
    if (e.key === 'ArrowLeft')  { idx = (idx - 1 + srcs.length) % srcs.length; lbImg.src = srcs[idx]; }
    if (e.key === 'ArrowRight') { idx = (idx + 1) % srcs.length; lbImg.src = srcs[idx]; }
  });
})();

/* ——— FAQ Accordion ——— */
document.querySelectorAll('.faq-q').forEach(btn => {
  btn.addEventListener('click', () => {
    const item = btn.closest('.faq-item');
    const isOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item.open').forEach(i => i.classList.remove('open'));
    if (!isOpen) item.classList.add('open');
  });
});

/* ——— Booking Form ——— */
(function initForm() {
  const form = document.querySelector('.booking-form form');
  if (!form) return;
  form.addEventListener('submit', e => {
    e.preventDefault();
    const btn = form.querySelector('.form-submit');
    const orig = btn.textContent;
    btn.textContent = 'Sending...'; btn.disabled = true;
    setTimeout(() => {
      btn.textContent = '✓ Booking Received!'; btn.style.background = '#16A34A';
      setTimeout(() => { btn.textContent = orig; btn.disabled = false; btn.style.background = ''; form.reset(); }, 3000);
    }, 1600);
  });
})();

/* ——— Smooth anchor scroll ——— */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
  });
});
