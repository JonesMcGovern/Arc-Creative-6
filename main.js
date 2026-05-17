/* Arc Creative — main.js */

(function () {
  'use strict';

  const nav     = document.getElementById('nav');
  const navBook = document.getElementById('nav-book');
  const hero    = document.getElementById('home');

  // ── NAV SCROLL STATE ──────────────────────────────────────
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 20);
  }, { passive: true });

  // ── BOOK BUTTON — slides in once hero leaves viewport ─────
  if (hero && navBook) {
    new IntersectionObserver(([entry]) => {
      const past = !entry.isIntersecting;
      navBook.classList.toggle('is-visible', past);
      navBook.setAttribute('aria-hidden', String(!past));
    }, { threshold: 0 }).observe(hero);
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

  // ── FORMS ─────────────────────────────────────────────────
  const heroForm       = document.getElementById('hero-form');
  const meetingPanel   = document.getElementById('meeting-panel');
  const meetingForm    = document.getElementById('meeting-form');
  const meetingConfirm = document.getElementById('meeting-confirm');

  let submittedEmail = '';

  // Hero form — send inquiry email then reveal meeting panel
  if (heroForm && meetingPanel) {
    heroForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const project = heroForm.querySelector('[name="project"]').value;
      const email   = heroForm.querySelector('[name="email"]').value;
      submittedEmail = email;

      const btn = heroForm.querySelector('button[type="submit"]');
      btn.textContent = 'Sending…';
      btn.disabled = true;

      try {
        await fetch('/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ project, email }),
        });
      } catch (_) {
        // Fail silently — still show meeting panel
      }

      btn.textContent = 'Get Started →';
      btn.disabled = false;

      meetingPanel.hidden = false;
      meetingPanel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });
  }

  // Meeting form — send meeting request email then show confirmation
  if (meetingForm && meetingConfirm) {
    meetingForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const date = meetingForm.querySelector('[name="meeting-date"]').value;
      const time = meetingForm.querySelector('[name="meeting-time"]').value;

      const btn = meetingForm.querySelector('button[type="submit"]');
      btn.textContent = 'Sending…';
      btn.disabled = true;

      try {
        await fetch('/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: submittedEmail, date, time }),
        });
      } catch (_) {
        // Fail silently — still show confirmation
      }

      meetingForm.hidden = true;
      meetingConfirm.hidden = false;
    });
  }

  // ── SMOOTH ANCHOR SCROLL ──────────────────────────────────
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - nav.getBoundingClientRect().height - 16;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  // ── SCROLL FADE ANIMATIONS ────────────────────────────────
  const fadeEls = document.querySelectorAll(
    '.pain-card, .process-step, .who-item, .service-card, .section-header, .why-copy'
  );

  fadeEls.forEach(el => el.classList.add('fade-up'));

  const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const siblings = Array.from(entry.target.parentElement.children);
      setTimeout(() => entry.target.classList.add('visible'), siblings.indexOf(entry.target) * 80);
      fadeObserver.unobserve(entry.target);
    });
  }, { threshold: 0.12 });

  fadeEls.forEach(el => fadeObserver.observe(el));

})();
