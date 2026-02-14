/* ============================================================
   EMBER & ROAST — Scroll Animations & Interactivity
   ============================================================ */

(function () {
  'use strict';

  // ---- Preloader ----
  const preloader = document.getElementById('preloader');
  window.addEventListener('load', () => {
    setTimeout(() => {
      preloader.classList.add('hidden');
      // Start hero animations after preloader
      document.body.classList.add('loaded');
    }, 1800);
  });

  // ---- Reduced motion check ----
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---- Navbar scroll ----
  const navbar = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  function updateNavbar() {
    const scrollY = window.scrollY;
    navbar.classList.toggle('scrolled', scrollY > 50);

    // Active section highlight
    let current = '';
    sections.forEach(section => {
      const top = section.offsetTop - 150;
      if (scrollY >= top) current = section.id;
    });
    navLinks.forEach(link => {
      link.classList.toggle('active', link.dataset.section === current);
    });
  }

  // ---- Mobile menu ----
  const navToggle = document.getElementById('navToggle');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileLinks = document.querySelectorAll('.mobile-link');

  navToggle.addEventListener('click', () => {
    const isOpen = navToggle.classList.toggle('open');
    mobileMenu.classList.toggle('open', isOpen);
    mobileMenu.setAttribute('aria-hidden', !isOpen);
    navToggle.setAttribute('aria-expanded', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      navToggle.classList.remove('open');
      mobileMenu.classList.remove('open');
      mobileMenu.setAttribute('aria-hidden', 'true');
      navToggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });

  // ---- Scroll Reveal (IntersectionObserver) ----
  const revealElements = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');

  if (!prefersReducedMotion) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.15,
      rootMargin: '0px 0px -60px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    revealElements.forEach(el => el.classList.add('visible'));
  }

  // ---- Timeline fill on scroll ----
  const timelineFill = document.querySelector('.timeline-line-fill');
  const storySection = document.querySelector('.story-section');

  function updateTimeline() {
    if (!storySection || !timelineFill) return;
    const rect = storySection.getBoundingClientRect();
    const sectionHeight = storySection.offsetHeight;
    const viewH = window.innerHeight;
    const scrolled = Math.max(0, Math.min(1, (viewH - rect.top) / (sectionHeight + viewH)));
    timelineFill.style.height = (scrolled * 100) + '%';
  }

  // ---- Bean card hover glow effect ----
  const beanCards = document.querySelectorAll('.bean-card');
  beanCards.forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      card.style.setProperty('--mx', x + '%');
      card.style.setProperty('--my', y + '%');
    });
  });

  // ---- Menu Tabs ----
  const menuTabs = document.querySelectorAll('.menu-tab');
  const menuItems = document.querySelectorAll('.menu-item');

  menuTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const cat = tab.dataset.cat;

      // Update tabs
      menuTabs.forEach(t => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');

      // Filter items with animation
      menuItems.forEach(item => {
        if (item.dataset.cat === cat) {
          item.style.display = 'flex';
          // Re-trigger animation
          item.style.opacity = '0';
          item.style.transform = 'translateY(20px)';
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              item.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
              item.style.opacity = '1';
              item.style.transform = 'translateY(0)';
            });
          });
        } else {
          item.style.display = 'none';
        }
      });
    });
  });

  // ---- Cursor glow ----
  const cursorGlow = document.getElementById('cursorGlow');
  if (!prefersReducedMotion && cursorGlow && window.innerWidth > 768) {
    let mouseX = 0, mouseY = 0, glowX = 0, glowY = 0;

    document.addEventListener('mousemove', e => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursorGlow.classList.add('visible');
    });

    document.addEventListener('mouseleave', () => {
      cursorGlow.classList.remove('visible');
    });

    function animateGlow() {
      glowX += (mouseX - glowX) * 0.08;
      glowY += (mouseY - glowY) * 0.08;
      cursorGlow.style.left = glowX + 'px';
      cursorGlow.style.top = glowY + 'px';
      requestAnimationFrame(animateGlow);
    }
    animateGlow();
  }

  // ---- Parallax on scroll (lightweight) ----
  const interiorParallax = document.querySelector('.interior-parallax');
  const beansBgParallax = document.querySelector('.beans-bg-parallax');
  const heroBg = document.querySelector('.hero-bg');

  function updateParallax() {
    if (prefersReducedMotion) return;
    const scrollY = window.scrollY;
    const vh = window.innerHeight;

    // Hero background subtle parallax
    if (heroBg && scrollY < vh) {
      heroBg.style.transform = `scale(1.05) translateY(${scrollY * 0.15}px)`;
    }

    // Interior parallax
    if (interiorParallax) {
      const rect = interiorParallax.parentElement.getBoundingClientRect();
      if (rect.bottom > 0 && rect.top < vh) {
        const progress = (vh - rect.top) / (vh + rect.height);
        interiorParallax.style.transform = `translateY(${(progress - 0.5) * 60}px)`;
      }
    }

    // Beans background parallax
    if (beansBgParallax) {
      const rect = beansBgParallax.parentElement.getBoundingClientRect();
      if (rect.bottom > 0 && rect.top < vh) {
        const progress = (vh - rect.top) / (vh + rect.height);
        beansBgParallax.style.transform = `translateY(${(progress - 0.5) * 40}px)`;
      }
    }
  }

  // ---- Intensity bar animation on reveal ----
  const intensityBars = document.querySelectorAll('.intensity-fill');
  const intensityObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.width = entry.target.style.getPropertyValue('--w');
        intensityObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  intensityBars.forEach(bar => {
    bar.style.width = '0%';
    intensityObserver.observe(bar);
  });

  // ---- Smooth scroll for anchor links ----
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const hash = link.getAttribute('href');
      if (!hash || hash.length < 2) return;
      const target = document.querySelector(hash);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // ---- Scroll handler (throttled) ----
  let ticking = false;
  function onScroll() {
    if (!ticking) {
      requestAnimationFrame(() => {
        updateNavbar();
        updateTimeline();
        updateParallax();
        ticking = false;
      });
      ticking = true;
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });

  // Initial call
  updateNavbar();

  // ---- Counter animation for float badges ----
  function animateCounter(el, target, suffix = '') {
    const duration = 2000;
    const start = performance.now();

    function update(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
      el.textContent = Math.round(eased * target) + suffix;
      if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
  }

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const strong = entry.target.querySelector('strong');
        if (strong) {
          const text = strong.textContent.trim();
          const num = parseInt(text);
          const suffix = text.replace(/\d+/, '');
          if (!isNaN(num)) {
            animateCounter(strong, num, suffix);
          }
        }
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('.float-badge').forEach(badge => {
    counterObserver.observe(badge);
  });

})();
