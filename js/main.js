/**
 * Dr. Parth Chaudhari — Portfolio 2.0 Interactions
 * Best-in-class animations and micro-interactions
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

  // ============================================
  // Loader
  // ============================================
  function hideLoader() {
    if (loader) {
      setTimeout(() => {
        loader.classList.add('is-hidden');
        // Trigger initial animations after loader
        setTimeout(initTextAnimations, 100);
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
      cursorX += (mouseX - cursorX) * 0.12;
      cursorY += (mouseY - cursorY) * 0.12;
      cursor.style.left = cursorX + 'px';
      cursor.style.top = cursorY + 'px';
      requestAnimationFrame(animateCursor);
    }
    animateCursor();

    const interactives = document.querySelectorAll(
      'a, button, .faq-question, .project-card, .experience-card, .highlight-card, ' +
      '.focus-card, .credential-card, .opento-card, .feature-card, .about-card, .contact-method'
    );
    interactives.forEach((el) => {
      el.addEventListener('mouseenter', () => cursor.classList.add('is-hovering'));
      el.addEventListener('mouseleave', () => cursor.classList.remove('is-hovering'));
    });
  }

  // ============================================
  // Text Split Animation
  // ============================================
  function splitText(element) {
    const text = element.textContent;
    const words = text.split(/\s+/);
    element.innerHTML = '';
    element.style.overflow = 'hidden';

    words.forEach((word, i) => {
      const span = document.createElement('span');
      span.className = 'split-word';
      span.textContent = word + '\u00A0';
      span.style.transitionDelay = (i * 0.04) + 's';
      element.appendChild(span);
    });
  }

  function initTextAnimations() {
    const textElements = document.querySelectorAll('[data-animate="text"]');
    textElements.forEach((el) => splitText(el));

    const textObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const words = entry.target.querySelectorAll('.split-word');
            words.forEach((word, i) => {
              setTimeout(() => word.classList.add('is-visible'), i * 40);
            });
            textObserver.unobserve(entry.target);
          }
        });
      },
      { root: null, rootMargin: '0px 0px -100px 0px', threshold: 0.1 }
    );

    textElements.forEach((el) => textObserver.observe(el));
  }

  // ============================================
  // 3D Card Tilt
  // ============================================
  function initTiltCards() {
    const cards = document.querySelectorAll('.tilt-card');

    cards.forEach((card) => {
      const inner = card.querySelector('.tilt-card-inner') || card;

      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * -8;
        const rotateY = ((x - centerX) / centerX) * 8;

        inner.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
      });

      card.addEventListener('mouseleave', () => {
        inner.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
      });
    });
  }

  // ============================================
  // Counter Animation
  // ============================================
  function animateCounter(el, target, duration = 2000) {
    const start = 0;
    const startTime = performance.now();
    const suffix = el.getAttribute('data-suffix') || '';
    const prefix = el.getAttribute('data-prefix') || '';

    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
      const current = Math.floor(eased * target);
      el.textContent = prefix + current + suffix;

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        el.textContent = prefix + target + suffix;
      }
    }

    requestAnimationFrame(update);
  }

  function initCounters() {
    const counters = document.querySelectorAll('[data-count]');

    const counterObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const target = parseInt(entry.target.getAttribute('data-count'), 10);
            animateCounter(entry.target, target);
            counterObserver.unobserve(entry.target);
          }
        });
      },
      { root: null, threshold: 0.5 }
    );

    counters.forEach((counter) => counterObserver.observe(counter));
  }

  // ============================================
  // Magnetic Buttons
  // ============================================
  function initMagneticButtons() {
    const buttons = document.querySelectorAll('.btn--primary, .btn--secondary');

    buttons.forEach((btn) => {
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
      });

      btn.addEventListener('mouseleave', () => {
        btn.style.transform = '';
      });
    });
  }

  // ============================================
  // Clip-Path Reveal
  // ============================================
  function initClipReveals() {
    const reveals = document.querySelectorAll('.clip-reveal, .clip-reveal-diagonal');

    const clipObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            clipObserver.unobserve(entry.target);
          }
        });
      },
      { root: null, threshold: 0.2 }
    );

    reveals.forEach((el) => clipObserver.observe(el));
  }

  // ============================================
  // Header: Smart Hide/Show
  // ============================================
  let lastScrollY = 0;
  let headerTicking = false;

  function updateHeader() {
    const scrollY = window.scrollY;
    if (scrollY > 10) {
      header.classList.add('is-scrolled');
    } else {
      header.classList.remove('is-scrolled');
    }
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
  // Smooth Scroll
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
  // Active Nav Link
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
        faqItems.forEach((other) => {
          other.classList.remove('is-open');
          other.querySelector('.faq-question')?.setAttribute('aria-expanded', 'false');
        });
        if (!isOpen) {
          item.classList.add('is-open');
          question.setAttribute('aria-expanded', 'true');
        }
      });
    }
  });

  // ============================================
  // Scroll Reveal
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

    const autoRevealSelectors = [
      '.section-header', '.about-grid', '.experience-card', '.timeline-item',
      '.feature-card', '.project-card', '.focus-card', '.credential-card',
      '.mission-content', '.contact-grid', '.about-stats', '.dvmready-intro',
      '.dvmready-cta', '.contact-visual', '.highlights-grid', '.opento-grid',
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

    document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale, .reveal-stagger')
      .forEach((el) => revealObserver.observe(el));
  }

  // ============================================
  // Parallax
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

  // ============================================
  // Initialize Everything After Load
  // ============================================
  window.addEventListener('load', () => {
    initTiltCards();
    initCounters();
    initMagneticButtons();
    initClipReveals();
  });
})();
