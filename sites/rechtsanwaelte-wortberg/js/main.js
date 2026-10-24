/* main.js – Rechtsanwälte Wortberg, Bongarth & Hug */
'use strict';

(function initMobileNav() {
  const toggle = document.querySelector('.nav-toggle'), nav = document.querySelector('.main-nav');
  if (!toggle || !nav) return;
  const open  = () => { nav.classList.add('is-open'); toggle.classList.add('is-active'); toggle.setAttribute('aria-expanded','true'); toggle.setAttribute('aria-label','Menü schließen'); document.body.style.overflow='hidden'; };
  const close = () => { nav.classList.remove('is-open'); toggle.classList.remove('is-active'); toggle.setAttribute('aria-expanded','false'); toggle.setAttribute('aria-label','Menü öffnen'); document.body.style.overflow=''; };
  toggle.addEventListener('click', () => nav.classList.contains('is-open') ? close() : open());
  nav.querySelectorAll('a').forEach(l => l.addEventListener('click', close));
  document.addEventListener('click', e => { if (!toggle.contains(e.target) && !nav.contains(e.target)) close(); });
  document.addEventListener('keydown', e => { if (e.key==='Escape' && nav.classList.contains('is-open')) close(); });
})();

(function initHeaderScroll() {
  const h = document.querySelector('.site-header'); if (!h) return;
  const update = () => h.classList.toggle('scrolled', window.scrollY>20);
  window.addEventListener('scroll', update, { passive:true }); update();
})();

(function initScrollSpy() {
  const sections = document.querySelectorAll('main > section[id]');
  const navLinks = document.querySelectorAll('.main-nav__item a');
  if (!sections.length || !navLinks.length) return;
  const obs = new IntersectionObserver(entries => entries.forEach(e => { if (e.isIntersecting) navLinks.forEach(l => l.classList.toggle('active', l.getAttribute('href')==='#'+e.target.id)); }), { rootMargin:'-20% 0px -70% 0px' });
  sections.forEach(s => obs.observe(s));
})();

(function initScrollProgress() {
  const bar = document.querySelector('.scroll-progress'); if (!bar) return;
  window.addEventListener('scroll', () => { const max=document.documentElement.scrollHeight-window.innerHeight; bar.style.transform=`scaleX(${max>0?window.scrollY/max:0})`; }, { passive:true });
})();

(function initTypewriter() {
  const el = document.querySelector('.hero__typed'); if (!el) return;
  const phrases = ['klar & kompetent.', 'Ihr Recht in guten Händen.', 'Termin online vereinbaren.', 'Für Sie im Einsatz.'];
  let pi=0, ci=0, del=false;
  const tick = () => {
    const p=phrases[pi];
    el.textContent = del ? p.slice(0,--ci) : p.slice(0,++ci);
    let d = del ? 32 : 68;
    if (!del && ci===p.length) { d=2400; del=true; } else if (del && ci===0) { del=false; pi=(pi+1)%phrases.length; d=500; }
    setTimeout(tick, d);
  };
  setTimeout(tick, 600);
})();

(function initCounters() {
  const items = document.querySelectorAll('.stat-item__number[data-target]');
  if (!items.length || !('IntersectionObserver' in window)) return;
  const easeOut = t => 1-Math.pow(1-t,5);
  const animate = el => {
    if (el._raf) cancelAnimationFrame(el._raf);
    const from=parseInt(el.dataset.from??'0',10), target=parseInt(el.dataset.target,10), prefix=el.dataset.prefix??'', suffix=el.dataset.suffix??'';
    const dur=el._seen?1200:1800; el._seen=true; const start=performance.now();
    const step=now=>{ const p=Math.min((now-start)/dur,1); el.textContent=prefix+Math.round(from+(target-from)*easeOut(p))+suffix; if(p<1) el._raf=requestAnimationFrame(step); };
    el._raf=requestAnimationFrame(step);
  };
  const reset=el=>{ if(el._raf){cancelAnimationFrame(el._raf);el._raf=null;} el.textContent=(el.dataset.prefix??'')+(el.dataset.from??'0')+(el.dataset.suffix??''); };
  const obs=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting)animate(e.target);else reset(e.target);}),{threshold:0.6});
  items.forEach(el=>obs.observe(el));
})();

(function initParallax() {
  const img = document.querySelector('.hero__image img');
  if (!img || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  window.addEventListener('scroll', () => { img.style.transform=`translateY(${window.scrollY*0.12}px)`; }, { passive:true });
})();

(function initSectionHeaders() {
  if (!('IntersectionObserver' in window)) { document.querySelectorAll('.section__header').forEach(el=>el.classList.add('is-visible')); return; }
  const obs=new IntersectionObserver(entries=>entries.forEach(e=>{if(!e.isIntersecting)return;e.target.classList.add('is-visible');obs.unobserve(e.target);}),{threshold:0.2});
  document.querySelectorAll('.section__header').forEach(el=>obs.observe(el));
})();

(function initFadeIn() {
  if (!('IntersectionObserver' in window)) return;
  const targets = document.querySelectorAll('.service-detail-card,.stat-item,.team-card,.project-item,.contact-info-card,.review-card,.about-content__text,.about-content__title,.booking-card');
  if (!targets.length) return;
  const obs=new IntersectionObserver(entries=>entries.forEach(e=>{if(!e.isIntersecting)return;e.target.style.opacity='1';e.target.style.transform='translateY(0) scale(1)';obs.unobserve(e.target);}),{threshold:0.08,rootMargin:'0px 0px -32px 0px'});
  targets.forEach((el,i)=>{el.style.opacity='0';el.style.transform='translateY(28px) scale(0.98)';el.style.transition=`opacity 0.6s ease ${Math.min(i*55,380)}ms, transform 0.6s ease ${Math.min(i*55,380)}ms`;obs.observe(el);});
})();

(function initBookingWizard() {
  const panels = document.querySelectorAll('.booking-panel');
  const steps  = document.querySelectorAll('.booking-step');
  const lines  = document.querySelectorAll('.booking-progress__line');
  if (!panels.length) return;
  const state = { step:1, service:null, serviceLabel:null, date:null, time:null };

  function goToStep(n) {
    panels.forEach(p=>p.hidden=true);
    const target=document.getElementById('booking-panel-'+n); if(target) target.hidden=false;
    steps.forEach((s,i)=>{s.classList.remove('is-active','is-done');if(i+1===n)s.classList.add('is-active');else if(i+1<n)s.classList.add('is-done');});
    lines.forEach((l,i)=>l.classList.toggle('is-done',i+1<n));
    state.step=n; if(n===3)updateSummary();
    const wiz=document.querySelector('.booking-card');
    if(wiz){const r=wiz.getBoundingClientRect();if(r.top<0||r.top>window.innerHeight*0.5)wiz.scrollIntoView({behavior:'smooth',block:'start'});}
  }

  const showError=(id,msg)=>{const el=document.getElementById(id);if(!el)return;el.textContent=msg;el.hidden=false;};
  const clearError=id=>{const el=document.getElementById(id);if(el)el.hidden=true;};

  const serviceOptions=document.querySelectorAll('.service-option');
  serviceOptions.forEach(btn=>btn.addEventListener('click',()=>{serviceOptions.forEach(b=>b.classList.remove('is-selected'));btn.classList.add('is-selected');state.service=btn.dataset.service;state.serviceLabel=btn.dataset.label;clearError('error-step1');}));
  document.getElementById('step1-next')?.addEventListener('click',()=>{if(!state.service){showError('error-step1','Bitte wählen Sie ein Rechtsgebiet aus.');return;}clearError('error-step1');goToStep(2);});

  const dateInput=document.getElementById('booking-date');
  if(dateInput){
    const today=new Date(),yyyy=today.getFullYear(),mm=String(today.getMonth()+1).padStart(2,'0'),dd=String(today.getDate()).padStart(2,'0');
    dateInput.min=`${yyyy}-${mm}-${dd}`;
    dateInput.addEventListener('change',()=>{state.date=dateInput.value;document.querySelectorAll('.time-slot.is-selected').forEach(s=>s.classList.remove('is-selected'));state.time=null;clearError('error-step2');});
  }

  const timeSlots=document.querySelectorAll('.time-slot');
  timeSlots.forEach(btn=>{if(btn.disabled)return;btn.addEventListener('click',()=>{timeSlots.forEach(b=>b.classList.remove('is-selected'));btn.classList.add('is-selected');state.time=btn.dataset.time;clearError('error-step2');});});
  document.getElementById('step2-back')?.addEventListener('click',()=>goToStep(1));
  document.getElementById('step2-next')?.addEventListener('click',()=>{if(!state.date){showError('error-step2','Bitte wählen Sie ein Datum aus.');return;}if(!state.time){showError('error-step2','Bitte wählen Sie eine Uhrzeit aus.');return;}clearError('error-step2');goToStep(3);});

  function updateSummary() {
    const setEl=(id,val)=>{const el=document.getElementById(id);if(el)el.textContent=val||'–';};
    let df=state.date||'–'; if(state.date){try{df=new Date(state.date+'T00:00:00').toLocaleDateString('de-DE',{weekday:'long',day:'numeric',month:'long',year:'numeric'});}catch{}}
    setEl('summary-service',state.serviceLabel); setEl('summary-date',df); setEl('summary-time',state.time?state.time+' Uhr':'–');
  }

  document.getElementById('step3-back')?.addEventListener('click',()=>goToStep(2));

  const form=document.getElementById('buchungsformular');
  form?.addEventListener('submit',e=>{
    e.preventDefault();clearError('error-step3');
    const name=form.querySelector('#b-name')?.value.trim()||'',email=form.querySelector('#b-email')?.value.trim()||'',tel=form.querySelector('#b-tel')?.value.trim()||'';
    if(!name||!email||!tel){showError('error-step3','Bitte füllen Sie alle Pflichtfelder (Name, E-Mail, Telefon) aus.');return;}
    if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){showError('error-step3','Bitte geben Sie eine gültige E-Mail-Adresse ein.');return;}
    panels.forEach(p=>p.hidden=true);
    const confirm=document.getElementById('booking-panel-confirm');if(confirm)confirm.hidden=false;
    steps.forEach(s=>{s.classList.remove('is-active');s.classList.add('is-done');});
    lines.forEach(l=>l.classList.add('is-done'));
    const nameEl=document.getElementById('confirm-name');if(nameEl)nameEl.textContent=name;
    let df=state.date||'–';if(state.date){try{df=new Date(state.date+'T00:00:00').toLocaleDateString('de-DE',{weekday:'long',day:'numeric',month:'long',year:'numeric'});}catch{}}
    const setEl=(id,val)=>{const el=document.getElementById(id);if(el)el.textContent=val||'–';};
    setEl('confirm-service',state.serviceLabel);setEl('confirm-date',df);setEl('confirm-time',state.time?state.time+' Uhr':'–');
    document.querySelector('.booking-card')?.scrollIntoView({behavior:'smooth',block:'start'});
  });

  document.getElementById('booking-reset')?.addEventListener('click',()=>{
    state.step=1;state.service=state.serviceLabel=state.date=state.time=null;
    serviceOptions.forEach(b=>b.classList.remove('is-selected'));timeSlots.forEach(b=>b.classList.remove('is-selected'));
    if(dateInput)dateInput.value='';form?.reset();
    ['error-step1','error-step2','error-step3'].forEach(id=>clearError(id));
    goToStep(1);
  });

  document.querySelectorAll('[data-preselectservice]').forEach(link=>{
    link.addEventListener('click',()=>{
      const key=link.dataset.preselectservice;
      setTimeout(()=>{const match=document.querySelector(`.service-option[data-service="${key}"]`);if(match){serviceOptions.forEach(b=>b.classList.remove('is-selected'));match.classList.add('is-selected');state.service=match.dataset.service;state.serviceLabel=match.dataset.label;}goToStep(1);},600);
    });
  });
})();
