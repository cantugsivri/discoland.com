/* ============================================
   DISCOLAND — Main JavaScript
   Smooth scroll, reveal, sparkles, interactivity
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  // --- Side Menu Toggle ---
  const hamburger = document.getElementById('hamburger');
  const sideMenu = document.getElementById('sideMenu');
  const sideMenuOverlay = document.getElementById('sideMenuOverlay');

  function toggleMenu() {
    hamburger.classList.toggle('active');
    sideMenu.classList.toggle('active');
    sideMenuOverlay.classList.toggle('active');
    document.body.style.overflow = sideMenu.classList.contains('active') ? 'hidden' : '';
  }

  function closeMenu() {
    hamburger.classList.remove('active');
    sideMenu.classList.remove('active');
    sideMenuOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (hamburger) {
    hamburger.addEventListener('click', toggleMenu);
  }
  if (sideMenuOverlay) {
    sideMenuOverlay.addEventListener('click', closeMenu);
  }

  // Close menu on link click
  document.querySelectorAll('.side-menu-links a').forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  // --- Smooth Scroll for anchor links ---
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      e.preventDefault();
      const href = anchor.getAttribute('href');
      const target = document.querySelector(href);
      if (target) {
        const offsetTop = href === '#hero' ? 0 : Math.max(0, target.offsetTop - 80);
        window.scrollTo({
          top: offsetTop,
          behavior: 'smooth',
        });
      }
    });
  });

  // --- Scroll Reveal (Intersection Observer) ---
  const revealElements = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px',
  });

  revealElements.forEach(el => revealObserver.observe(el));

  // --- Active Nav Link on Scroll ---
  const sections = document.querySelectorAll('.section[id]');

  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        document.querySelectorAll('.nav-links a').forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }, {
    threshold: 0.3,
  });

  sections.forEach(section => navObserver.observe(section));

  // --- Parallax on Scroll (subtle) ---
  const parallaxElements = document.querySelectorAll('[data-parallax]');

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;

    parallaxElements.forEach(el => {
      const speed = parseFloat(el.dataset.parallax) || 0.1;
      const rect = el.getBoundingClientRect();
      const offset = (rect.top + scrollY) * speed;
      el.style.transform = `translateY(${-offset + scrollY * speed}px)`;
    });
  });

  // --- Gold shimmer on hover for cards ---
  document.querySelectorAll('.performer-card, .contact-link').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      card.style.setProperty('--mouse-x', x + '%');
      card.style.setProperty('--mouse-y', y + '%');
    });
  });

  // --- Counter Animation (for future stats section) ---
  function animateCounter(element, target, duration = 2000) {
    let start = 0;
    const startTime = performance.now();

    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(eased * target);

      element.textContent = current;

      if (progress < 1) {
        requestAnimationFrame(update);
      }
    }

    requestAnimationFrame(update);
  }

  // --- Preloader (optional - fade out) ---
  const preloader = document.querySelector('.preloader');
  if (preloader) {
    window.addEventListener('load', () => {
      preloader.style.opacity = '0';
      preloader.style.pointerEvents = 'none';
      setTimeout(() => preloader.remove(), 500);
    });
  }

  // --- Mobile Face Card Expand Toggle ---
  const faceCards = document.querySelectorAll('.face-card');
  faceCards.forEach(card => {
    card.addEventListener('click', (e) => {
      if (window.innerWidth <= 768) {
        const wasOpen = card.classList.contains('is-open');
        faceCards.forEach(c => {
          c.classList.remove('is-open');
          const lbl = c.querySelector('.hint-label');
          if (lbl) lbl.textContent = 'Biyografi';
        });
        if (!wasOpen) {
          card.classList.add('is-open');
          const lbl = card.querySelector('.hint-label');
          if (lbl) lbl.textContent = 'Kapat';
        }
      }
    });
  });

  // Close when clicking outside face card on mobile
  document.addEventListener('click', (e) => {
    if (window.innerWidth <= 768 && !e.target.closest('.face-card')) {
      faceCards.forEach(c => {
        c.classList.remove('is-open');
        const lbl = c.querySelector('.hint-label');
        if (lbl) lbl.textContent = 'Biyografi';
      });
    }
  });

  // --- Easter egg: Konami Code plays disco ---
  let konamiSequence = [];
  const konamiCode = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65];

  document.addEventListener('keydown', (e) => {
    konamiSequence.push(e.keyCode);
    konamiSequence = konamiSequence.slice(-10);

    if (konamiSequence.join(',') === konamiCode.join(',')) {
      document.body.style.animation = 'discoMode 0.5s ease infinite';
      setTimeout(() => {
        document.body.style.animation = '';
      }, 5000);
    }
  });

  // Inject disco mode keyframe
  const discoStyle = document.createElement('style');
  discoStyle.textContent = `
    @keyframes discoMode {
      0% { filter: hue-rotate(0deg); }
      25% { filter: hue-rotate(90deg); }
      50% { filter: hue-rotate(180deg); }
      75% { filter: hue-rotate(270deg); }
      100% { filter: hue-rotate(360deg); }
    }
  `;
  document.head.appendChild(discoStyle);

});
