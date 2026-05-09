/**
 * Dr. Parth Chaudhari — Portfolio 2.0 Interactions
 * Premium, accessible, performance-focused
 */

(function () {
  'use strict';

  // ============================================
  // Elements
  // ============================================
  const loader = document.getElementById('loader');
  const cursor = document.getElementById('cursor');
  const header = document.getElementById('header');
  const mobileToggle = document.querySelector('.mobile-menu-toggle');
  const mobileNav = document.getElementById('mobile-nav');
  const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');
  const sections = document.querySelectorAll('section[id]');
  const faqItems = document.querySelectorAll('.faq-item');
  const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale, .reveal-stagger');

  // ============================================
  // Loader
  // ============================================
  function hideLoader() {
    if (loader) {
      setTimeout(() => {
        loader.classList.add('is-hidden');
      }, 1200);
    }
  }

  if (document.readyState === 'complete') {
    hideLoader();
  } else {
    window.addEventListener('load', hideLoader);
  }

  // ============================================
  // Custom Cursor
  // ============================================
  let mouseX = 0, mouseY = 0;
  let cursorX = 0, cursorY = 0;

  if (cursor && window.matchMedia('(pointer: fine)').matches) {
    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    function animateCursor() {
      cursorX += (mouseX - cursorX) * 0.15;
      cursorY += (mouseY - cursorY) * 0.15;
      cursor.style.left = cursorX + 'px';
      cursor.style.top = cursorY + 'px';
      requestAnimationFrame(animateCursor);
    }
    animateCursor();

    // Expand cursor on interactive elements
    const interactives = document.querySelectorAll('a, button, .faq-question, .project-card, .experience-card, .highlight-card, .focus-card, .credential-card, .opento-card, .feature-card');
    interactives.forEach((el) => {
      el.addEventListener('mouseenter', () => cursor.classList.add('is-hovering'));
      el.addEventListener('mouseleave', () => cursor.classList.remove('is-hovering'));
    });
  }

  // ============================================
  // Header: Smart Hide/Show on Scroll
  // ============================================
  let lastScrollY = 0;
  let headerTicking = false;

  function updateHeader() {
    const scrollY = window.scrollY;

    // Add/remove scrolled class
    if (scrollY > 10) {
      header.classList.add('is-scrolled');
    } else {
      header.classList.remove('is-scrolled');
    }

    // Hide/show on scroll direction
    if (scrollY > lastScrollY && scrollY > 200) {
      header.classList.add('is-hidden');
    } else {
      header.classList.remove('is-hidden');
    }

    lastScrollY = scrollY;
    headerTicking = false;
  }

  window.addEventListener('scroll', () => {
    if (!headerTicking) {
      requestAnimationFrame(updateHeader);
      headerTicking = true;
    }
  }, { passive: true });

  // ============================================
  // Mobile Navigation
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
    mobileNav.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', closeMobileMenu);
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileToggle.getAttribute('aria-expanded') === 'true') {
        closeMobileMenu();
        mobileToggle.focus();
      }
    });
    document.addEventListener('click', (e) => {
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
  // Smooth Scroll for Anchor Links
  // ============================================
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const headerHeight = header ? header.offsetHeight : 0;
        const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight - 24;
        window.scrollTo({ top: targetPosition, behavior: 'smooth' });
        target.setAttribute('tabindex', '-1');
        target.focus({ preventScroll: true });
      }
    });
  });

  // ============================================
  // Active Nav Link on Scroll
  // ============================================
  let navTicking = false;

  function updateActiveNav() {
    const scrollPos = window.scrollY + (header ? header.offsetHeight + 40 : 120);
    sections.forEach((section) => {
      const top = section.offsetTop;
      const bottom = top + section.offsetHeight;
      const id = section.getAttribute('id');
      if (scrollPos >= top && scrollPos < bottom) {
        navLinks.forEach((link) => {
          link.classList.remove('is-active');
          if (link.getAttribute('href') === '#' + id) {
            link.classList.add('is-active');
          }
        });
      }
    });
    navTicking = false;
  }

  window.addEventListener('scroll', () => {
    if (!navTicking) {
      requestAnimationFrame(updateActiveNav);
      navTicking = true;
    }
  }, { passive: true });

  // ============================================
  // FAQ Accordion
  // ============================================
  faqItems.forEach((item) => {
    const question = item.querySelector('.faq-question');
    if (question) {
      question.addEventListener('click', () => {
        const isOpen = item.classList.contains('is-open');
        // Close all others
        faqItems.forEach((other) => {
          other.classList.remove('is-open');
          other.querySelector('.faq-question')?.setAttribute('aria-expanded', 'false');
        });
        // Toggle current
        if (!isOpen) {
          item.classList.add('is-open');
          question.setAttribute('aria-expanded', 'true');
        }
      });
    }
  });

  // ============================================
  // Scroll Reveal with IntersectionObserver
  // ============================================
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { root: null, rootMargin: '0px 0px -80px 0px', threshold: 0.08 }
    );

    // Auto-add reveal classes to major elements
    const autoRevealSelectors = [
      '.section-header',
      '.about-grid',
      '.experience-card',
      '.timeline-item',
      '.feature-card',
      '.project-card',
      '.focus-card',
      '.credential-card',
      '.mission-content',
      '.contact-grid',
      '.about-stats',
      '.dvmready-intro',
      '.dvmready-cta',
      '.contact-visual',
      '.highlights-grid',
      '.opento-grid',
      '.faq-list'
    ];

    autoRevealSelectors.forEach((selector) => {
      document.querySelectorAll(selector).forEach((el) => {
        if (!el.classList.contains('reveal') && !el.classList.contains('reveal-stagger')) {
          el.classList.add('reveal');
        }
        revealObserver.observe(el);
      });
    });

    revealElements.forEach((el) => revealObserver.observe(el));
  }

  // ============================================
  // Parallax Effect for Decorative Elements
  // ============================================
  const parallaxElements = document.querySelectorAll('.hero-orb--1, .hero-orb--2');
  let parallaxTicking = false;

  function updateParallax() {
    const scrollY = window.scrollY;
    parallaxElements.forEach((el, index) => {
      const speed = index === 0 ? 0.15 : 0.1;
      el.style.transform = `translateY(${scrollY * speed}px)`;
    });
    parallaxTicking = false;
  }

  window.addEventListener('scroll', () => {
    if (!parallaxTicking) {
      requestAnimationFrame(updateParallax);
      parallaxTicking = true;
    }
  }, { passive: true });
})();
