/* =============================================
   main.js – Handwerksbetrieb Website-Vorlage
   MIT BUCHUNGS-BLOCK
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
    'mit Präzision und Erfahrung.',
    'für Industrie und Gewerbe.',
    'Schaltgerätebau auf höchstem Niveau.',
    'Kabelkonfektion aus Leidenschaft.',
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
    '.booking-card',
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

/* -----------------------------------------------
   10. BUCHUNGS-WIZARD
   ----------------------------------------------- */
(function initBookingWizard() {

  /* ── Elemente ── */
  const panels   = document.querySelectorAll('.booking-panel');
  const steps    = document.querySelectorAll('.booking-step');
  const lines    = document.querySelectorAll('.booking-progress__line');

  if (!panels.length) return;

  /* ── Zustand ── */
  const state = { step: 1, service: null, serviceLabel: null, date: null, time: null };

  /* ── Schritt wechseln ── */
  function goToStep(n) {
    panels.forEach(p => p.hidden = true);
    const target = document.getElementById('booking-panel-' + n);
    if (target) target.hidden = false;

    steps.forEach((s, i) => {
      s.classList.remove('is-active', 'is-done');
      if (i + 1 === n)      s.classList.add('is-active');
      else if (i + 1 < n)   s.classList.add('is-done');
    });

    lines.forEach((l, i) => {
      l.classList.toggle('is-done', i + 1 < n);
    });

    state.step = n;

    if (n === 3) updateSummary();

    /* Zum Wizard scrollen wenn nicht sichtbar */
    const wizard = document.querySelector('.booking-card');
    if (wizard) {
      const rect = wizard.getBoundingClientRect();
      if (rect.top < 0 || rect.top > window.innerHeight * 0.5) {
        wizard.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  }

  /* ── Fehlermeldung ── */
  function showError(id, msg) {
    const el = document.getElementById(id);
    if (!el) return;
    el.textContent = msg;
    el.hidden = false;
  }

  function clearError(id) {
    const el = document.getElementById(id);
    if (el) el.hidden = true;
  }

  /* ── Schritt 1: Leistungsauswahl ── */
  const serviceOptions = document.querySelectorAll('.service-option');

  serviceOptions.forEach(btn => {
    btn.addEventListener('click', () => {
      serviceOptions.forEach(b => b.classList.remove('is-selected'));
      btn.classList.add('is-selected');
      state.service      = btn.dataset.service;
      state.serviceLabel = btn.dataset.label;
      clearError('error-step1');
    });
  });

  document.getElementById('step1-next')?.addEventListener('click', () => {
    if (!state.service) {
      showError('error-step1', 'Bitte wählen Sie eine Leistung aus.');
      return;
    }
    clearError('error-step1');
    goToStep(2);
  });

  /* ── Schritt 2: Datum & Uhrzeit ── */
  const dateInput = document.getElementById('booking-date');

  /* Datum-Minimum auf heute setzen */
  if (dateInput) {
    const today = new Date();
    const yyyy  = today.getFullYear();
    const mm    = String(today.getMonth() + 1).padStart(2, '0');
    const dd    = String(today.getDate()).padStart(2, '0');
    dateInput.min = `${yyyy}-${mm}-${dd}`;

    dateInput.addEventListener('change', () => {
      state.date = dateInput.value;

      /*
       * BACKEND-INTEGRATION HIER:
       * Beim Datumswechsel könnten per fetch() verfügbare Slots
       * vom Server geladen und die .time-slot Buttons dynamisch
       * aktualisiert werden:
       *
       * fetch(`/api/slots?date=${state.date}&service=${state.service}`)
       *   .then(r => r.json())
       *   .then(data => renderTimeSlots(data));
       */

      /* Aktuelle Slot-Auswahl zurücksetzen */
      document.querySelectorAll('.time-slot.is-selected').forEach(s => s.classList.remove('is-selected'));
      state.time = null;
      clearError('error-step2');
    });
  }

  /* Zeit-Slots */
  const timeSlots = document.querySelectorAll('.time-slot');

  timeSlots.forEach(btn => {
    if (btn.disabled) return;
    btn.addEventListener('click', () => {
      timeSlots.forEach(b => b.classList.remove('is-selected'));
      btn.classList.add('is-selected');
      state.time = btn.dataset.time;
      clearError('error-step2');
    });
  });

  document.getElementById('step2-back')?.addEventListener('click', () => goToStep(1));

  document.getElementById('step2-next')?.addEventListener('click', () => {
    if (!state.date) {
      showError('error-step2', 'Bitte wählen Sie ein Datum aus.');
      return;
    }
    if (!state.time) {
      showError('error-step2', 'Bitte wählen Sie eine Uhrzeit aus.');
      return;
    }
    clearError('error-step2');
    goToStep(3);
  });

  /* ── Schritt 3: Buchungsübersicht befüllen ── */
  function updateSummary() {
    const setEl = (id, val) => {
      const el = document.getElementById(id);
      if (el) el.textContent = val || '–';
    };

    /* Datum für Anzeige formatieren */
    let dateFormatted = state.date || '–';
    if (state.date) {
      try {
        dateFormatted = new Date(state.date + 'T00:00:00').toLocaleDateString('de-DE', {
          weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
        });
      } catch {}
    }

    setEl('summary-service', state.serviceLabel);
    setEl('summary-date',    dateFormatted);
    setEl('summary-time',    state.time ? state.time + ' Uhr' : '–');
  }

  document.getElementById('step3-back')?.addEventListener('click', () => goToStep(2));

  /* ── Formular absenden ── */
  const form = document.getElementById('buchungsformular');

  form?.addEventListener('submit', e => {
    e.preventDefault();
    clearError('error-step3');

    const name  = form.querySelector('#b-name')?.value.trim()  || '';
    const email = form.querySelector('#b-email')?.value.trim() || '';
    const tel   = form.querySelector('#b-tel')?.value.trim()   || '';

    if (!name || !email || !tel) {
      showError('error-step3', 'Bitte füllen Sie alle Pflichtfelder (Name, E-Mail, Telefon) aus.');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showError('error-step3', 'Bitte geben Sie eine gültige E-Mail-Adresse ein.');
      return;
    }

    /*
     * FORMULAR-VERSAND HIER EINBAUEN:
     *
     * Option A – Formspree:
     *   fetch('https://formspree.io/f/DEIN_CODE', {
     *     method: 'POST',
     *     body: JSON.stringify({
     *       leistung: state.serviceLabel,
     *       datum:    state.date,
     *       uhrzeit:  state.time,
     *       name, email, tel,
     *       nachricht: form.querySelector('#b-nachricht')?.value
     *     }),
     *     headers: { 'Content-Type': 'application/json' }
     *   });
     *
     * Option B – eigene API:
     *   fetch('/api/buchung', { method: 'POST', body: new FormData(form) })
     */

    /* Bestätigungsanzeige */
    showConfirmation(name);
  });

  function showConfirmation(name) {
    panels.forEach(p => p.hidden = true);
    const confirm = document.getElementById('booking-panel-confirm');
    if (confirm) confirm.hidden = false;

    /* Fortschritt: alle Schritte als abgeschlossen markieren */
    steps.forEach(s => { s.classList.remove('is-active'); s.classList.add('is-done'); });
    lines.forEach(l => l.classList.add('is-done'));

    /* Bestätigungsdaten befüllen */
    const nameEl = document.getElementById('confirm-name');
    if (nameEl) nameEl.textContent = name;

    let dateFormatted = state.date || '–';
    if (state.date) {
      try {
        dateFormatted = new Date(state.date + 'T00:00:00').toLocaleDateString('de-DE', {
          weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
        });
      } catch {}
    }

    const setEl = (id, val) => {
      const el = document.getElementById(id);
      if (el) el.textContent = val || '–';
    };

    setEl('confirm-service', state.serviceLabel);
    setEl('confirm-date',    dateFormatted);
    setEl('confirm-time',    state.time ? state.time + ' Uhr' : '–');

    const wizard = document.querySelector('.booking-card');
    wizard?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  /* Wizard zurücksetzen */
  document.getElementById('booking-reset')?.addEventListener('click', () => {
    state.step = 1;
    state.service = state.serviceLabel = state.date = state.time = null;

    serviceOptions.forEach(b => b.classList.remove('is-selected'));
    timeSlots.forEach(b => b.classList.remove('is-selected'));
    if (dateInput) dateInput.value = '';
    form?.reset();
    ['error-step1', 'error-step2', 'error-step3'].forEach(id => clearError(id));

    goToStep(1);
  });

  /* ── Leistungskarte → Buchungs-Block (deep-link via data-preselectservice) ── */
  document.querySelectorAll('[data-preselectservice]').forEach(link => {
    link.addEventListener('click', () => {
      const key = link.dataset.preselectservice;

      /* Warte bis nach dem Scroll, dann Leistung vorauswählen */
      setTimeout(() => {
        const match = document.querySelector(`.service-option[data-service="${key}"]`);
        if (match) {
          serviceOptions.forEach(b => b.classList.remove('is-selected'));
          match.classList.add('is-selected');
          state.service      = match.dataset.service;
          state.serviceLabel = match.dataset.label;
        }
        goToStep(1);
      }, 600);
    });
  });

})();
