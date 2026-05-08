/**
 * Dr. Parth Chaudhari — Portfolio Interactions
 * Minimal, accessible, performance-focused
 */

(function () {
  'use strict';

  // ============================================
  // Elements
  // ============================================
  const header = document.getElementById('header');
  const mobileToggle = document.querySelector('.mobile-menu-toggle');
  const mobileNav = document.getElementById('mobile-nav');
  const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');
  const sections = document.querySelectorAll('section[id]');
  const revealElements = document.querySelectorAll('.reveal, .reveal-stagger');

  // ============================================
  // Header shadow on scroll
  // ============================================
  function updateHeader() {
    if (window.scrollY > 10) {
      header.classList.add('is-scrolled');
    } else {
      header.classList.remove('is-scrolled');
    }
  }

  window.addEventListener('scroll', updateHeader, { passive: true });
  updateHeader();

  // ============================================
  // Mobile navigation
  // ============================================
  function toggleMobileMenu() {
    const isOpen = mobileToggle.getAttribute('aria-expanded') === 'true';
    mobileToggle.setAttribute('aria-expanded', String(!isOpen));
    mobileNav.hidden = isOpen;
    document.body.style.overflow = isOpen ? '' : 'hidden';
  }

  function closeMobileMenu() {
    mobileToggle.setAttribute('aria-expanded', 'false');
    mobileNav.hidden = true;
    document.body.style.overflow = '';
  }

  if (mobileToggle && mobileNav) {
    mobileToggle.addEventListener('click', toggleMobileMenu);

    // Close on nav link click
    mobileNav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', closeMobileMenu);
    });

    // Close on Escape key
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && mobileToggle.getAttribute('aria-expanded') === 'true') {
        closeMobileMenu();
        mobileToggle.focus();
      }
    });

    // Close on click outside
    document.addEventListener('click', function (e) {
      if (
        mobileToggle.getAttribute('aria-expanded') === 'true' &&
        !mobileNav.contains(e.target) &&
        !mobileToggle.contains(e.target)
      ) {
        closeMobileMenu();
      }
    });
  }

  // ============================================
  // Smooth scroll for anchor links
  // ============================================
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#') return;

      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const headerHeight = header ? header.offsetHeight : 0;
        const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight - 16;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });

        // Update focus for accessibility
        target.setAttribute('tabindex', '-1');
        target.focus({ preventScroll: true });
      }
    });
  });

  // ============================================
  // Active nav link on scroll
  // ============================================
  let scrollTicking = false;

  function updateActiveNav() {
    const scrollPos = window.scrollY + (header ? header.offsetHeight + 32 : 100);

    sections.forEach(function (section) {
      const top = section.offsetTop;
      const bottom = top + section.offsetHeight;
      const id = section.getAttribute('id');

      if (scrollPos >= top && scrollPos < bottom) {
        navLinks.forEach(function (link) {
          link.classList.remove('is-active');
          if (link.getAttribute('href') === '#' + id) {
            link.classList.add('is-active');
          }
        });
      }
    });

    scrollTicking = false;
  }

  window.addEventListener('scroll', function () {
    if (!scrollTicking) {
      window.requestAnimationFrame(updateActiveNav);
      scrollTicking = true;
    }
  }, { passive: true });

  // ============================================
  // Scroll reveal with IntersectionObserver
  // ============================================
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      {
        root: null,
        rootMargin: '0px 0px -60px 0px',
        threshold: 0.1
      }
    );

    // Auto-add reveal classes to major elements if not already present
    const autoRevealSelectors = [
      '.section-header',
      '.about-grid',
      '.experience-card',
      '.timeline-item',
      '.feature-card',
      '.project-card',
      '.skill-group',
      '.credential-card',
      '.mission-content',
      '.contact-grid',
      '.about-stats',
      '.dvmready-intro',
      '.dvmready-cta',
      '.contact-visual'
    ];

    autoRevealSelectors.forEach(function (selector) {
      document.querySelectorAll(selector).forEach(function (el) {
        if (!el.classList.contains('reveal') && !el.classList.contains('reveal-stagger')) {
          el.classList.add('reveal');
        }
        revealObserver.observe(el);
      });
    });

    // Also observe any manually marked elements
    revealElements.forEach(function (el) {
      revealObserver.observe(el);
    });
  }

  // ============================================
  // Current year in footer
  // ============================================
  const yearSpans = document.querySelectorAll('.footer-year');
  if (yearSpans.length) {
    yearSpans.forEach(function (span) {
      span.textContent = new Date().getFullYear();
    });
  }
})();
