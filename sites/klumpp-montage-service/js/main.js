/* main.js – Klumpp Montage Service */
'use strict';

(function initMobileNav() {
  const toggle = document.querySelector('.nav-toggle');
  const nav    = document.querySelector('.main-nav');
  if (!toggle || !nav) return;
  const open  = () => { nav.classList.add('is-open'); toggle.classList.add('is-active'); toggle.setAttribute('aria-expanded', 'true'); toggle.setAttribute('aria-label', 'Menü schließen'); document.body.style.overflow = 'hidden'; };
  const close = () => { nav.classList.remove('is-open'); toggle.classList.remove('is-active'); toggle.setAttribute('aria-expanded', 'false'); toggle.setAttribute('aria-label', 'Menü öffnen'); document.body.style.overflow = ''; };
  toggle.addEventListener('click', () => nav.classList.contains('is-open') ? close() : open());
  nav.querySelectorAll('a').forEach(link => link.addEventListener('click', close));
  document.addEventListener('click', e => { if (!toggle.contains(e.target) && !nav.contains(e.target)) close(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && nav.classList.contains('is-open')) close(); });
})();

(function initHeaderScroll() {
  const header = document.querySelector('.site-header');
  if (!header) return;
  const update = () => header.classList.toggle('scrolled', window.scrollY > 20);
  window.addEventListener('scroll', update, { passive: true });
  update();
})();

(function initScrollSpy() {
  const sections = document.querySelectorAll('main > section[id], main > div[id]');
  const navLinks = document.querySelectorAll('.main-nav__item a');
  if (!sections.length || !navLinks.length) return;
  const activate = id => navLinks.forEach(link => link.classList.toggle('active', link.getAttribute('href') === '#' + id));
  const observer = new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting) activate(entry.target.id); }), { rootMargin: '-20% 0px -70% 0px' });
  sections.forEach(s => observer.observe(s));
})();

(function initScrollProgress() {
  const bar = document.querySelector('.scroll-progress');
  if (!bar) return;
  const update = () => { const max = document.documentElement.scrollHeight - window.innerHeight; bar.style.transform = `scaleX(${max > 0 ? window.scrollY / max : 0})`; };
  window.addEventListener('scroll', update, { passive: true });
  update();
})();

(function initTypewriter() {
  const el = document.querySelector('.hero__typed');
  if (!el) return;
  const phrases = ['Kompetent. Schnell. Zuverlässig.', 'Sondermaschinenbau seit 2004.', 'Ihr Partner für die Papiersackindustrie.', 'Termin einfach online buchen.'];
  let phraseIdx = 0, charIdx = 0, deleting = false;
  const tick = () => {
    const phrase = phrases[phraseIdx];
    if (deleting) { el.textContent = phrase.slice(0, --charIdx); } else { el.textContent = phrase.slice(0, ++charIdx); }
    let delay = deleting ? 32 : 68;
    if (!deleting && charIdx === phrase.length) { delay = 2400; deleting = true; }
    else if (deleting && charIdx === 0) { deleting = false; phraseIdx = (phraseIdx + 1) % phrases.length; delay = 500; }
    setTimeout(tick, delay);
  };
  setTimeout(tick, 600);
})();

(function initCounters() {
  const items = document.querySelectorAll('.stat-item__number[data-target]');
  if (!items.length || !('IntersectionObserver' in window)) return;
  const easeOut = t => 1 - Math.pow(1 - t, 5);
  const animate = el => {
    if (el._rafId) cancelAnimationFrame(el._rafId);
    const from = parseInt(el.dataset.from ?? '0', 10), target = parseInt(el.dataset.target, 10);
    const prefix = el.dataset.prefix ?? '', suffix = el.dataset.suffix ?? '';
    const duration = el._seen ? 1200 : 1800; el._seen = true;
    const start = performance.now();
    const step = now => { const p = Math.min((now - start) / duration, 1); el.textContent = prefix + Math.round(from + (target - from) * easeOut(p)) + suffix; if (p < 1) el._rafId = requestAnimationFrame(step); };
    el._rafId = requestAnimationFrame(step);
  };
  const reset = el => { if (el._rafId) { cancelAnimationFrame(el._rafId); el._rafId = null; } el.textContent = (el.dataset.prefix ?? '') + (el.dataset.from ?? '0') + (el.dataset.suffix ?? ''); };
  const observer = new IntersectionObserver(entries => entries.forEach(e => { if (e.isIntersecting) animate(e.target); else reset(e.target); }), { threshold: 0.6 });
  items.forEach(el => observer.observe(el));
})();

(function initParallax() {
  const img = document.querySelector('.hero__image img');
  if (!img || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  window.addEventListener('scroll', () => { img.style.transform = `translateY(${window.scrollY * 0.12}px)`; }, { passive: true });
})();

(function initSectionHeaders() {
  if (!('IntersectionObserver' in window)) { document.querySelectorAll('.section__header').forEach(el => el.classList.add('is-visible')); return; }
  const observer = new IntersectionObserver(entries => entries.forEach(entry => { if (!entry.isIntersecting) return; entry.target.classList.add('is-visible'); observer.unobserve(entry.target); }), { threshold: 0.2 });
  document.querySelectorAll('.section__header').forEach(el => observer.observe(el));
})();

(function initFadeIn() {
  if (!('IntersectionObserver' in window)) return;
  const selector = ['.service-detail-card','.stat-item','.team-card','.project-item','.contact-info-card','.review-card','.about-content__text','.about-content__title','.booking-card'].join(', ');
  const targets = document.querySelectorAll(selector);
  if (!targets.length) return;
  const observer = new IntersectionObserver(entries => entries.forEach(entry => { if (!entry.isIntersecting) return; entry.target.style.opacity = '1'; entry.target.style.transform = 'translateY(0) scale(1)'; observer.unobserve(entry.target); }), { threshold: 0.08, rootMargin: '0px 0px -32px 0px' });
  targets.forEach((el, i) => { el.style.opacity = '0'; el.style.transform = 'translateY(28px) scale(0.98)'; el.style.transition = `opacity 0.6s ease ${Math.min(i * 55, 380)}ms, transform 0.6s ease ${Math.min(i * 55, 380)}ms`; observer.observe(el); });
})();

(function initBookingWizard() {
  const panels = document.querySelectorAll('.booking-panel');
  const steps  = document.querySelectorAll('.booking-step');
  const lines  = document.querySelectorAll('.booking-progress__line');
  if (!panels.length) return;
  const state = { step: 1, service: null, serviceLabel: null, date: null, time: null };

  function goToStep(n) {
    panels.forEach(p => p.hidden = true);
    const target = document.getElementById('booking-panel-' + n);
    if (target) target.hidden = false;
    steps.forEach((s, i) => { s.classList.remove('is-active', 'is-done'); if (i + 1 === n) s.classList.add('is-active'); else if (i + 1 < n) s.classList.add('is-done'); });
    lines.forEach((l, i) => l.classList.toggle('is-done', i + 1 < n));
    state.step = n;
    if (n === 3) updateSummary();
    const wizard = document.querySelector('.booking-card');
    if (wizard) { const rect = wizard.getBoundingClientRect(); if (rect.top < 0 || rect.top > window.innerHeight * 0.5) wizard.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
  }

  function showError(id, msg) { const el = document.getElementById(id); if (!el) return; el.textContent = msg; el.hidden = false; }
  function clearError(id) { const el = document.getElementById(id); if (el) el.hidden = true; }

  const serviceOptions = document.querySelectorAll('.service-option');
  serviceOptions.forEach(btn => btn.addEventListener('click', () => { serviceOptions.forEach(b => b.classList.remove('is-selected')); btn.classList.add('is-selected'); state.service = btn.dataset.service; state.serviceLabel = btn.dataset.label; clearError('error-step1'); }));
  document.getElementById('step1-next')?.addEventListener('click', () => { if (!state.service) { showError('error-step1', 'Bitte wählen Sie eine Leistung aus.'); return; } clearError('error-step1'); goToStep(2); });

  const dateInput = document.getElementById('booking-date');
  if (dateInput) {
    const today = new Date(), yyyy = today.getFullYear(), mm = String(today.getMonth() + 1).padStart(2, '0'), dd = String(today.getDate()).padStart(2, '0');
    dateInput.min = `${yyyy}-${mm}-${dd}`;
    dateInput.addEventListener('change', () => { state.date = dateInput.value; document.querySelectorAll('.time-slot.is-selected').forEach(s => s.classList.remove('is-selected')); state.time = null; clearError('error-step2'); });
  }

  const timeSlots = document.querySelectorAll('.time-slot');
  timeSlots.forEach(btn => { if (btn.disabled) return; btn.addEventListener('click', () => { timeSlots.forEach(b => b.classList.remove('is-selected')); btn.classList.add('is-selected'); state.time = btn.dataset.time; clearError('error-step2'); }); });
  document.getElementById('step2-back')?.addEventListener('click', () => goToStep(1));
  document.getElementById('step2-next')?.addEventListener('click', () => { if (!state.date) { showError('error-step2', 'Bitte wählen Sie ein Datum aus.'); return; } if (!state.time) { showError('error-step2', 'Bitte wählen Sie eine Uhrzeit aus.'); return; } clearError('error-step2'); goToStep(3); });

  function updateSummary() {
    const setEl = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val || '–'; };
    let dateFormatted = state.date || '–';
    if (state.date) { try { dateFormatted = new Date(state.date + 'T00:00:00').toLocaleDateString('de-DE', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }); } catch {} }
    setEl('summary-service', state.serviceLabel);
    setEl('summary-date', dateFormatted);
    setEl('summary-time', state.time ? state.time + ' Uhr' : '–');
  }

  document.getElementById('step3-back')?.addEventListener('click', () => goToStep(2));

  const form = document.getElementById('buchungsformular');
  form?.addEventListener('submit', e => {
    e.preventDefault(); clearError('error-step3');
    const name = form.querySelector('#b-name')?.value.trim() || '', email = form.querySelector('#b-email')?.value.trim() || '', tel = form.querySelector('#b-tel')?.value.trim() || '';
    if (!name || !email || !tel) { showError('error-step3', 'Bitte füllen Sie alle Pflichtfelder (Name, E-Mail, Telefon) aus.'); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { showError('error-step3', 'Bitte geben Sie eine gültige E-Mail-Adresse ein.'); return; }
    showConfirmation(name);
  });

  function showConfirmation(name) {
    panels.forEach(p => p.hidden = true);
    const confirm = document.getElementById('booking-panel-confirm');
    if (confirm) confirm.hidden = false;
    steps.forEach(s => { s.classList.remove('is-active'); s.classList.add('is-done'); });
    lines.forEach(l => l.classList.add('is-done'));
    const nameEl = document.getElementById('confirm-name'); if (nameEl) nameEl.textContent = name;
    let dateFormatted = state.date || '–';
    if (state.date) { try { dateFormatted = new Date(state.date + 'T00:00:00').toLocaleDateString('de-DE', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }); } catch {} }
    const setEl = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val || '–'; };
    setEl('confirm-service', state.serviceLabel); setEl('confirm-date', dateFormatted); setEl('confirm-time', state.time ? state.time + ' Uhr' : '–');
    document.querySelector('.booking-card')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  document.getElementById('booking-reset')?.addEventListener('click', () => {
    state.step = 1; state.service = state.serviceLabel = state.date = state.time = null;
    serviceOptions.forEach(b => b.classList.remove('is-selected')); timeSlots.forEach(b => b.classList.remove('is-selected'));
    if (dateInput) dateInput.value = ''; form?.reset();
    ['error-step1', 'error-step2', 'error-step3'].forEach(id => clearError(id));
    goToStep(1);
  });

  document.querySelectorAll('[data-preselectservice]').forEach(link => {
    link.addEventListener('click', () => {
      const key = link.dataset.preselectservice;
      setTimeout(() => { const match = document.querySelector(`.service-option[data-service="${key}"]`); if (match) { serviceOptions.forEach(b => b.classList.remove('is-selected')); match.classList.add('is-selected'); state.service = match.dataset.service; state.serviceLabel = match.dataset.label; } goToStep(1); }, 600);
    });
  });
})();
