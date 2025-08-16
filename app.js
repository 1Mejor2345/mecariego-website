
// app.js - Mejorado (interactividad y accesibilidad)
// - Menú hamburguesa responsivo
// - Tabs accesibles
// - Modal para video con carga lazy de iframe
// - Smooth-scroll para anclas
// - Reveal on scroll (IntersectionObserver)
// - Contadores animados
document.addEventListener('DOMContentLoaded', function(){
  // Elements
  const navToggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.nav');
  const header = document.querySelector('header');

  // Sticky header shrink effect
  window.addEventListener('scroll', () => {
    if(window.scrollY > 20) header.classList.add('scrolled');
    else header.classList.remove('scrolled');
  });

  // Nav toggle
  if(navToggle){
    navToggle.addEventListener('click', () => nav.classList.toggle('open'));
  }

  // Smooth scroll for internal links
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', function(e){
      const target = document.querySelector(this.getAttribute('href'));
      if(target){
        e.preventDefault();
        target.scrollIntoView({behavior:'smooth', block:'start'});
        // close mobile nav if open
        if(nav.classList.contains('open')) nav.classList.remove('open');
      }
    });
  });

  // Tabs behavior (keyboard accessible)
  const tabButtons = document.querySelectorAll('.tab-buttons li');
  const tabPanels = document.querySelectorAll('.tab-content');
  tabButtons.forEach((btn, idx) => {
    btn.setAttribute('role','tab');
    btn.setAttribute('tabindex', idx === 0 ? '0' : '-1');
    btn.addEventListener('click', activateTab);
    btn.addEventListener('keydown', (e) => {
      if(e.key === 'ArrowRight') {
        const next = btn.nextElementSibling || tabButtons[0];
        next.focus(); next.click();
      } else if(e.key === 'ArrowLeft') {
        const prev = btn.previousElementSibling || tabButtons[tabButtons.length-1];
        prev.focus(); prev.click();
      }
    });
  });
  function activateTab(e){
    const btn = e.currentTarget;
    const id = btn.dataset.tab;
    tabButtons.forEach(b => { b.classList.remove('active'); b.setAttribute('aria-selected','false'); b.setAttribute('tabindex','-1');});
    tabPanels.forEach(p => p.classList.remove('active'));
    btn.classList.add('active'); btn.setAttribute('aria-selected','true'); btn.setAttribute('tabindex','0');
    const panel = document.getElementById(id);
    if(panel) panel.classList.add('active');
  }

  // Modal for video embed
  const videoButtons = document.querySelectorAll('.js-video-btn');
  const modal = document.getElementById('video-modal');
  const modalContent = modal ? modal.querySelector('.modal-content') : null;
  const modalClose = modal ? modal.querySelector('.btn-close-modal') : null;
  let activeTrigger = null;

  videoButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const url = btn.dataset.videoUrl;
      if(!modal) {
        // fallback: open in new tab
        window.open(url, '_blank', 'noopener');
        return;
      }
      activeTrigger = btn;
      // build iframe lazily
      const iframe = document.createElement('iframe');
      iframe.setAttribute('allowfullscreen','');
      iframe.setAttribute('referrerpolicy','no-referrer');
      // Convert youtube watch?v= to embed
      let embedUrl = url;
      if(url.includes('youtube.com/watch')) {
        const v = new URL(url).searchParams.get('v');
        embedUrl = 'https://www.youtube.com/embed/' + v + '?rel=0&autoplay=1';
      } else if(url.includes('youtu.be/')) {
        const v = url.split('youtu.be/')[1];
        embedUrl = 'https://www.youtube.com/embed/' + v + '?rel=0&autoplay=1';
      }
      iframe.src = embedUrl;
      iframe.setAttribute('loading','lazy');
      // clear and append
      const frameWrap = modalContent.querySelector('.video-wrap');
      frameWrap.innerHTML = '';
      frameWrap.appendChild(iframe);
      modal.setAttribute('aria-hidden','false');
      // trap focus
      modalClose.focus();
    });
  });

  if(modalClose){
    modalClose.addEventListener('click', closeModal);
  }
  // close on ESC
  document.addEventListener('keydown', (e) => {
    if(e.key === 'Escape' && modal && modal.getAttribute('aria-hidden') === 'false') closeModal();
  });
  function closeModal(){
    if(!modal) return;
    modal.setAttribute('aria-hidden','true');
    const frameWrap = modal.querySelector('.video-wrap');
    if(frameWrap) frameWrap.innerHTML = '';
    if(activeTrigger) activeTrigger.focus();
  }

  // Reveal on scroll (IntersectionObserver)
  const reveals = document.querySelectorAll('.reveal');
  const io = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        entry.target.classList.add('visible');
        obs.unobserve(entry.target);
      }
    });
  }, {threshold:0.12});
  reveals.forEach(r => io.observe(r));

  // Counters
  document.querySelectorAll('.counter').forEach(el => {
    const target = parseInt(el.getAttribute('data-target') || '40', 10);
    let current = 0;
    const step = Math.max(1, Math.round(target / 40));
    const tick = () => {
      current += step;
      if(current < target){
        el.textContent = current + '%';
        requestAnimationFrame(tick);
      } else {
        el.textContent = target + '%';
      }
    };
    // start when visible
    const obs = new IntersectionObserver((entries, o) => {
      entries.forEach(en => {
        if(en.isIntersecting) { tick(); o.unobserve(en.target); }
      });
    }, {threshold: 0.3});
    obs.observe(el);
  });

  // Form submission (simulated) - show confirmation modal
  const form = document.getElementById('formulario');
  const confirmModal = document.getElementById('confirmacion');
  const confirmClose = confirmModal ? confirmModal.querySelector('.btn-close') : null;
  if(form){
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if(form.checkValidity()){
        if(confirmModal) confirmModal.setAttribute('aria-hidden','false');
        // If using mailto form action, allow default after animation? Here we simulate only.
      } else {
        alert('Por favor completa los campos requeridos.');
      }
    });
  }
  if(confirmClose) confirmClose.addEventListener('click', () => confirmModal.setAttribute('aria-hidden','true'));
});



// Robust tab activation handler (ensures single active panel and proper ARIA)
function initTabs() {
  const tabButtons = Array.from(document.querySelectorAll('.tab-buttons li'));
  const tabPanels = Array.from(document.querySelectorAll('.tab-content'));
  if(tabButtons.length === 0 || tabPanels.length === 0) return;
  tabButtons.forEach((btn, idx) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      // deactivate all
      tabButtons.forEach(b => { b.classList.remove('active'); b.setAttribute('aria-selected','false'); b.setAttribute('tabindex','-1'); });
      tabPanels.forEach(p => { p.classList.remove('active'); p.setAttribute('aria-hidden','true'); });
      // activate clicked
      btn.classList.add('active');
      btn.setAttribute('aria-selected','true');
      btn.setAttribute('tabindex','0');
      const id = btn.getAttribute('data-tab');
      const panel = document.getElementById(id);
      if(panel){
        panel.classList.add('active');
        panel.setAttribute('aria-hidden','false');
      }
    });
    // keyboard support
    btn.addEventListener('keydown', (ev) => {
      if(ev.key === 'ArrowRight' || ev.key === 'ArrowLeft'){
        ev.preventDefault();
        const dir = ev.key === 'ArrowRight' ? 1 : -1;
        const newIndex = (idx + dir + tabButtons.length) % tabButtons.length;
        tabButtons[newIndex].focus();
        tabButtons[newIndex].click();
      }
    });
  });
  // Ensure initial state
  let anyActive = tabPanels.some(p => p.classList.contains('active'));
  if(!anyActive){
    tabButtons[0].classList.add('active');
    tabButtons[0].setAttribute('aria-selected','true');
    tabButtons[0].setAttribute('tabindex','0');
    const id0 = tabButtons[0].getAttribute('data-tab');
    const p0 = document.getElementById(id0);
    if(p0){ p0.classList.add('active'); p0.setAttribute('aria-hidden','false'); }
  }
}
document.addEventListener('DOMContentLoaded', initTabs);


