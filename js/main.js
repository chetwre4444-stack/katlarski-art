/* ============================================
   KOTLYARSKY STUDIO — Main JS
   ============================================ */

/* --- Mobile Navigation --- */
const navToggle = document.querySelector('.nav-toggle');
const navLinks  = document.querySelector('.nav-links');

if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => {
    const open = navLinks.classList.toggle('open');
    navToggle.classList.toggle('open', open);
    navToggle.setAttribute('aria-expanded', open);
    document.body.style.overflow = open ? 'hidden' : '';
  });

  // Close on link click
  navLinks.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      navLinks.classList.remove('open');
      navToggle.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
}

/* --- Active nav link --- */
const currentPage = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-links a').forEach(a => {
  const href = a.getAttribute('href');
  if (href === currentPage || (currentPage === '' && href === 'index.html')) {
    a.classList.add('active');
  }
});

/* --- Lightbox --- */
(function initLightbox() {
  const lightbox    = document.getElementById('lightbox');
  if (!lightbox) return;

  const lbImg       = lightbox.querySelector('.lightbox-img');
  const lbCaption   = lightbox.querySelector('.lightbox-caption');
  const lbClose     = lightbox.querySelector('.lightbox-close');
  const lbPrev      = lightbox.querySelector('.lightbox-prev');
  const lbNext      = lightbox.querySelector('.lightbox-next');

  let images = [];
  let current = 0;

  function collectImages() {
    images = [];
    document.querySelectorAll('.gallery-item').forEach((item, idx) => {
      const img = item.querySelector('img');
      const title = item.querySelector('.gallery-info h3')?.textContent || '';
      const meta  = item.querySelector('.gallery-meta')?.textContent || '';
      if (img) {
        images.push({ src: img.src, alt: img.alt, title, meta });
        item.dataset.index = idx;
      }
      item.addEventListener('click', () => open(idx));
    });
  }

  function open(idx) {
    current = idx;
    show();
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function close() {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
  }

  function show() {
    const d = images[current];
    if (!d) return;
    lbImg.src = d.src;
    lbImg.alt = d.alt || d.title;
    if (lbCaption) {
      lbCaption.textContent = [d.title, d.meta].filter(Boolean).join('  ·  ');
    }
    lbPrev.style.visibility = current > 0 ? 'visible' : 'hidden';
    lbNext.style.visibility = current < images.length - 1 ? 'visible' : 'hidden';
  }

  function prev() { if (current > 0) { current--; show(); } }
  function next() { if (current < images.length - 1) { current++; show(); } }

  lbClose.addEventListener('click', close);
  lbPrev.addEventListener('click', prev);
  lbNext.addEventListener('click', next);

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) close();
  });

  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowLeft') prev();
    if (e.key === 'ArrowRight') next();
  });

  collectImages();
})();

/* --- Hero Carousel dots --- */
(function initCarousel() {
  const slides = Array.from(document.querySelectorAll('.hero-slide'));
  const dots   = Array.from(document.querySelectorAll('.hero-dot'));
  if (!slides.length) return;

  dots.forEach(function(dot, i) {
    dot.addEventListener('click', function() {
      slides.forEach(function(s) { s.classList.remove('active'); });
      dots.forEach(function(d) { d.classList.remove('active'); });
      slides[i].classList.add('active');
      dot.classList.add('active');
    });
  });
})();

/* --- Scroll reveal (subtle fade-in) --- */
(function initReveal() {
  const items = document.querySelectorAll(
    '.gallery-item, .section-card, .review-card, .press-item, .stat-item'
  );

  if (!('IntersectionObserver' in window)) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.style.opacity = '1';
        e.target.style.transform = 'translateY(0)';
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.08 });

  items.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(18px)';
    el.style.transition = 'opacity 0.55s ease, transform 0.55s ease';
    observer.observe(el);
  });
})();
