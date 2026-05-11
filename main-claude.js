/* Arc Creative — main-claude.js */

(function () {
  'use strict';

  // ── NAV SCROLL STATE ──────────────────────────────────────
  const nav     = document.getElementById('nav');
  const navBook = document.getElementById('nav-book');
  const hero    = document.getElementById('home');

  const onScroll = () => {
    nav.classList.toggle('scrolled', window.scrollY > 20);
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // ── BOOK BUTTON — appears once hero scrolls off screen ────
  if (hero && navBook) {
    const heroObserver = new IntersectionObserver(
      ([entry]) => {
        const pastHero = !entry.isIntersecting;
        navBook.classList.toggle('is-visible', pastHero);
        navBook.setAttribute('aria-hidden', String(!pastHero));
      },
      { threshold: 0 }
    );
    heroObserver.observe(hero);
  }

  // ── MOBILE NAV TOGGLE ─────────────────────────────────────
  const navToggle = document.getElementById('nav-toggle');
  const navMobile = document.getElementById('nav-mobile');

  navToggle.addEventListener('click', () => {
    const isOpen = navToggle.getAttribute('aria-expanded') === 'true';
    navToggle.setAttribute('aria-expanded', String(!isOpen));
    navMobile.hidden = isOpen;
  });

  navMobile.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navToggle.setAttribute('aria-expanded', 'false');
      navMobile.hidden = true;
    });
  });

  // ── HERO FORM → MEETING PANEL ─────────────────────────────
  const heroForm       = document.getElementById('hero-form');
  const meetingPanel   = document.getElementById('meeting-panel');
  const meetingForm    = document.getElementById('meeting-form');
  const meetingConfirm = document.getElementById('meeting-confirm');

  if (heroForm && meetingPanel) {
    heroForm.addEventListener('submit', (e) => {
      e.preventDefault();
      meetingPanel.hidden = false;
      meetingPanel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });
  }

  if (meetingForm && meetingConfirm) {
    meetingForm.addEventListener('submit', (e) => {
      e.preventDefault();
      meetingForm.hidden = true;
      meetingConfirm.hidden = false;
    });
  }

  // ── SMOOTH ANCHOR SCROLL ──────────────────────────────────
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const navHeight = nav.getBoundingClientRect().height;
      const top = target.getBoundingClientRect().top + window.scrollY - navHeight - 16;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  // ── SCROLL FADE ANIMATIONS ────────────────────────────────
  const fadeEls = document.querySelectorAll(
    '.pain-card, .process-step, .who-item, .service-card, .section-header, .why-copy'
  );

  fadeEls.forEach(el => el.classList.add('fade-up'));

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const siblings = Array.from(entry.target.parentElement.children);
          const delay = siblings.indexOf(entry.target) * 80;
          setTimeout(() => entry.target.classList.add('visible'), delay);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  fadeEls.forEach(el => observer.observe(el));

})();
