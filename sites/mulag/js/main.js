/* main.js – MULAG Fahrzeugwerk */
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
  window.addEventListener('scroll', () => h.classList.toggle('scrolled', window.scrollY>20), { passive:true });
})();

(function initScrollSpy() {
  const sections = document.querySelectorAll('main > section[id]');
  const navLinks = document.querySelectorAll('.main-nav__item a');
  if (!sections.length || !navLinks.length) return;
  new IntersectionObserver(entries => entries.forEach(e => { if (e.isIntersecting) navLinks.forEach(l => l.classList.toggle('active', l.getAttribute('href')==='#'+e.target.id)); }), { rootMargin:'-20% 0px -70% 0px' }).observe && sections.forEach(s => new IntersectionObserver(entries => entries.forEach(e => { if (e.isIntersecting) navLinks.forEach(l => l.classList.toggle('active', l.getAttribute('href')==='#'+e.target.id)); }), { rootMargin:'-20% 0px -70% 0px' }).observe(s));
})();

(function initScrollProgress() {
  const bar = document.querySelector('.scroll-progress'); if (!bar) return;
  window.addEventListener('scroll', () => { const max=document.documentElement.scrollHeight-window.innerHeight; bar.style.transform=`scaleX(${max>0?window.scrollY/max:0})`; }, { passive:true });
})();

(function initTypewriter() {
  const el = document.querySelector('.hero__typed'); if (!el) return;
  const phrases = ['Technik die bewegt.', 'Zuverlässig auf jeder Strecke.', 'Made in Schwarzwald.', 'Qualität seit Jahrzehnten.'];
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
  new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting)animate(e.target);else reset(e.target);}),{threshold:0.6}).observe && items.forEach(el=>new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting)animate(e.target);else reset(e.target);}),{threshold:0.6}).observe(el));
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
  const targets = document.querySelectorAll('.service-detail-card,.stat-item,.team-card,.project-item,.contact-info-card,.about-content__text,.about-content__title');
  if (!targets.length) return;
  const obs=new IntersectionObserver(entries=>entries.forEach(e=>{if(!e.isIntersecting)return;e.target.style.opacity='1';e.target.style.transform='translateY(0) scale(1)';obs.unobserve(e.target);}),{threshold:0.08,rootMargin:'0px 0px -32px 0px'});
  targets.forEach((el,i)=>{el.style.opacity='0';el.style.transform='translateY(28px) scale(0.98)';el.style.transition=`opacity 0.6s ease ${Math.min(i*55,380)}ms, transform 0.6s ease ${Math.min(i*55,380)}ms`;obs.observe(el);});
})();

