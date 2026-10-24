/* =============================================
   main.js – Handwerksbetrieb Website-Vorlage
   ============================================= */

'use strict';

/* -----------------------------------------------
   1. HAMBURGER-NAVIGATION
   ----------------------------------------------- */
(function initMobileNav() {
  const toggle = document.querySelector('.nav-toggle');
  const nav    = document.querySelector('.main-nav');
  if (!toggle || !nav) return;

  const open = () => {
    nav.classList.add('is-open');
    toggle.classList.add('is-active');
    toggle.setAttribute('aria-expanded', 'true');
    toggle.setAttribute('aria-label', 'Menü schließen');
    document.body.style.overflow = 'hidden';
  };

  const close = () => {
    nav.classList.remove('is-open');
    toggle.classList.remove('is-active');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Menü öffnen');
    document.body.style.overflow = '';
  };

  toggle.addEventListener('click', () => nav.classList.contains('is-open') ? close() : open());
  nav.querySelectorAll('a').forEach(link => link.addEventListener('click', close));
  document.addEventListener('click', e => {
    if (!toggle.contains(e.target) && !nav.contains(e.target)) close();
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && nav.classList.contains('is-open')) close();
  });
})();

/* -----------------------------------------------
   2. HEADER-SCHATTEN BEI SCROLL
   ----------------------------------------------- */
(function initHeaderScroll() {
  const header = document.querySelector('.site-header');
  if (!header) return;
  const update = () => header.classList.toggle('scrolled', window.scrollY > 20);
  window.addEventListener('scroll', update, { passive: true });
  update();
})();

/* -----------------------------------------------
   3. SCROLL-SPY – aktiven Abschnitt markieren
   ----------------------------------------------- */
(function initScrollSpy() {
  const sections = document.querySelectorAll('main > section[id], main > div[id]');
  const navLinks = document.querySelectorAll('.main-nav__item a');
  if (!sections.length || !navLinks.length) return;

  const activate = id => {
    navLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === '#' + id);
    });
  };

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => { if (entry.isIntersecting) activate(entry.target.id); });
  }, { rootMargin: '-20% 0px -70% 0px' });

  sections.forEach(s => observer.observe(s));
})();

/* -----------------------------------------------
   4. SCROLL-FORTSCHRITTSBALKEN
   ----------------------------------------------- */
(function initScrollProgress() {
  const bar = document.querySelector('.scroll-progress');
  if (!bar) return;

  const update = () => {
    const max      = document.documentElement.scrollHeight - window.innerHeight;
    const progress = max > 0 ? window.scrollY / max : 0;
    bar.style.transform = `scaleX(${progress})`;
  };

  window.addEventListener('scroll', update, { passive: true });
  update();
})();

/* -----------------------------------------------
   5. TYPEWRITER-EFFEKT im Hero
   PHRASEN HIER ANPASSEN:
   ----------------------------------------------- */
(function initTypewriter() {
  const el = document.querySelector('.hero__typed');
  if (!el) return;

  /* PHRASEN HIER ANPASSEN */
  const phrases = [
    'für jeden besonderen Moment.',
    'Floristik mit Herzblut.',
    'Hochzeit, Trauer, Dekoration.',
    'Ihr Florist in Achern.',
  ];

  let phraseIdx = 0;
  let charIdx   = 0;
  let deleting  = false;

  const tick = () => {
    const phrase = phrases[phraseIdx];

    if (deleting) {
      el.textContent = phrase.slice(0, --charIdx);
    } else {
      el.textContent = phrase.slice(0, ++charIdx);
    }

    let delay = deleting ? 32 : 68;

    if (!deleting && charIdx === phrase.length) {
      delay    = 2400;
      deleting = true;
    } else if (deleting && charIdx === 0) {
      deleting  = false;
      phraseIdx = (phraseIdx + 1) % phrases.length;
      delay     = 500;
    }

    setTimeout(tick, delay);
  };

  setTimeout(tick, 600);
})();

/* -----------------------------------------------
   6. ZÄHLER-ANIMATION (Kennzahlen)
   ----------------------------------------------- */
(function initCounters() {
  const items = document.querySelectorAll('.stat-item__number[data-target]');
  if (!items.length || !('IntersectionObserver' in window)) return;

  const easeOut = t => 1 - Math.pow(1 - t, 5);

  const animate = el => {
    if (el._rafId) cancelAnimationFrame(el._rafId);
    const from     = parseInt(el.dataset.from   ?? '0', 10);
    const target   = parseInt(el.dataset.target,         10);
    const prefix   = el.dataset.prefix   ?? '';
    const suffix   = el.dataset.suffix   ?? '';
    const duration = el._seen ? 1200 : 1800;
    el._seen = true;
    const start    = performance.now();

    const step = now => {
      const progress = Math.min((now - start) / duration, 1);
      const value    = Math.round(from + (target - from) * easeOut(progress));
      el.textContent = prefix + value + suffix;
      if (progress < 1) el._rafId = requestAnimationFrame(step);
    };

    el._rafId = requestAnimationFrame(step);
  };

  const reset = el => {
    if (el._rafId) { cancelAnimationFrame(el._rafId); el._rafId = null; }
    const from   = parseInt(el.dataset.from ?? '0', 10);
    el.textContent = (el.dataset.prefix ?? '') + from + (el.dataset.suffix ?? '');
  };

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) animate(entry.target);
      else reset(entry.target);
    });
  }, { threshold: 0.6 });

  items.forEach(el => observer.observe(el));
})();

/* -----------------------------------------------
   7. PARALLAX auf dem Hero-Bild
   ----------------------------------------------- */
(function initParallax() {
  const img = document.querySelector('.hero__image img');
  if (!img || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const update = () => {
    img.style.transform = `translateY(${window.scrollY * 0.12}px)`;
  };

  window.addEventListener('scroll', update, { passive: true });
})();

/* -----------------------------------------------
   8. SECTION-HEADER SLIDE-IN
   ----------------------------------------------- */
(function initSectionHeaders() {
  if (!('IntersectionObserver' in window)) {
    document.querySelectorAll('.section__header').forEach(el => el.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.2 });

  document.querySelectorAll('.section__header').forEach(el => observer.observe(el));
})();

/* -----------------------------------------------
   9. KARTEN FADE-IN (gestaffelt)
   ----------------------------------------------- */
(function initFadeIn() {
  if (!('IntersectionObserver' in window)) return;

  const selector = [
    '.service-detail-card',
    '.stat-item',
    '.team-card',
    '.project-item',
    '.contact-info-card',
    '.review-card',
    '.about-content__text',
    '.about-content__title',
  ].join(', ');

  const targets = document.querySelectorAll(selector);
  if (!targets.length) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.style.opacity   = '1';
      entry.target.style.transform = 'translateY(0) scale(1)';
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -32px 0px' });

  targets.forEach((el, i) => {
    el.style.opacity    = '0';
    el.style.transform  = 'translateY(28px) scale(0.98)';
    el.style.transition = `opacity 0.6s ease ${Math.min(i * 55, 380)}ms, transform 0.6s ease ${Math.min(i * 55, 380)}ms`;
    observer.observe(el);
  });
})();

