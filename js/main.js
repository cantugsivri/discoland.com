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
    if (!sideMenu || !hamburger) return;
    const isOpen = sideMenu.classList.toggle('active');
    hamburger.classList.toggle('active');
    if (sideMenuOverlay) sideMenuOverlay.classList.toggle('active');
    hamburger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    document.body.style.overflow = isOpen ? 'hidden' : '';
  }

  function closeMenu() {
    if (!sideMenu || !hamburger) return;
    hamburger.classList.remove('active');
    sideMenu.classList.remove('active');
    if (sideMenuOverlay) sideMenuOverlay.classList.remove('active');
    hamburger.setAttribute('aria-expanded', 'false');
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

  // Close menu on ESC key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && sideMenu && sideMenu.classList.contains('active')) {
      closeMenu();
      if (hamburger) hamburger.focus();
    }
  });

  // --- Smooth Scroll for anchor links (Safe selector check) ---
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const href = anchor.getAttribute('href');
      if (!href || href === '#' || href.length <= 1) {
        return;
      }
      try {
        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          const offsetTop = href === '#hero' ? 0 : Math.max(0, target.offsetTop - 80);
          window.scrollTo({
            top: offsetTop,
            behavior: 'smooth',
          });
        }
      } catch (err) {
        // Silently catch invalid selectors
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
        document.querySelectorAll('.side-menu-links a').forEach(link => {
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

  // --- Parallax on Scroll (Optimized with requestAnimationFrame) ---
  const parallaxElements = document.querySelectorAll('[data-parallax]');
  if (parallaxElements.length > 0) {
    let ticking = false;

    function updateParallax() {
      const scrollY = window.scrollY;
      parallaxElements.forEach(el => {
        const speed = parseFloat(el.dataset.parallax) || 0.1;
        const rect = el.getBoundingClientRect();
        const offset = (rect.top + scrollY) * speed;
        el.style.transform = `translate3d(0, ${-offset + scrollY * speed}px, 0)`;
      });
      ticking = false;
    }

    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(updateParallax);
        ticking = true;
      }
    }, { passive: true });
  }

  // --- Gold shimmer on hover for cards (Correct selector: .face-card) ---
  document.querySelectorAll('.face-card, .contact-link').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      card.style.setProperty('--mouse-x', x + '%');
      card.style.setProperty('--mouse-y', y + '%');
    });
  });

  // --- Anti-Spam Email Protection ---
  document.querySelectorAll('.js-mail-protect').forEach(el => {
    const user = el.getAttribute('data-user');
    const domain = el.getAttribute('data-domain');
    if (user && domain) {
      el.setAttribute('href', `mailto:${user}@${domain}`);
    }
  });

  // --- Multi-Language (i18n) Engine ---
  let currentLang = 'tr';

  function getTranslation(key, lang) {
    if (typeof translations === 'undefined' || !translations[lang]) return null;
    const keys = key.split('.');
    let val = translations[lang];
    for (const k of keys) {
      if (!val || val[k] === undefined) return null;
      val = val[k];
    }
    return val;
  }

  function applyLanguage(lang) {
    if (typeof translations === 'undefined' || !translations[lang]) return;
    currentLang = lang;
    document.documentElement.lang = lang;

    // Update text content
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      const val = getTranslation(key, lang);
      if (val !== null) {
        el.textContent = val;
      }
    });

    // Helper to sanitize allowed HTML tags in translations (XSS defense)
    function sanitizeTranslationHtml(dirty) {
      if (!dirty) return '';
      const parser = new DOMParser();
      const doc = parser.parseFromString(dirty, 'text/html');
      const allowedTags = ['SPAN', 'B', 'STRONG', 'BR', 'EM', 'I'];

      function clean(node) {
        for (let i = node.childNodes.length - 1; i >= 0; i--) {
          const child = node.childNodes[i];
          if (child.nodeType === Node.ELEMENT_NODE) {
            if (!allowedTags.includes(child.nodeName.toUpperCase())) {
              node.replaceChild(document.createTextNode(child.textContent), child);
            } else {
              Array.from(child.attributes).forEach(attr => {
                if (attr.name.toLowerCase() !== 'class') {
                  child.removeAttribute(attr.name);
                }
              });
              clean(child);
            }
          }
        }
      }
      clean(doc.body);
      return doc.body.innerHTML;
    }

    // Update HTML content (safely sanitized)
    document.querySelectorAll('[data-i18n-html]').forEach(el => {
      const key = el.getAttribute('data-i18n-html');
      const val = getTranslation(key, lang);
      if (val !== null) {
        el.innerHTML = sanitizeTranslationHtml(val);
      }
    });

    // Update Meta Tags & Page Title
    if (translations[lang].meta) {
      if (translations[lang].meta.title) {
        document.title = translations[lang].meta.title;
      }
      const metaDesc = document.getElementById('metaDescription');
      if (metaDesc && translations[lang].meta.description) {
        metaDesc.setAttribute('content', translations[lang].meta.description);
      }
      const ogDesc = document.getElementById('ogDescription');
      if (ogDesc && translations[lang].meta.description) {
        ogDesc.setAttribute('content', translations[lang].meta.description);
      }
    }

    // Update active state on language buttons
    document.querySelectorAll('.lang-btn, .side-lang-btn').forEach(btn => {
      if (btn.getAttribute('data-lang') === lang) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    // Update face card toggle button text
    document.querySelectorAll('.face-card').forEach(c => {
      const lbl = c.querySelector('.hint-label');
      if (lbl) {
        const isOpened = c.classList.contains('is-open');
        lbl.textContent = isOpened
          ? (translations[lang].faces?.hintClose || 'Kapat')
          : (translations[lang].faces?.hintBio || 'Biyografi');
      }
    });

    // Save preference to localStorage
    try {
      localStorage.setItem('discoland_lang', lang);
    } catch (e) {}
  }

  // Language button event listeners
  document.querySelectorAll('.lang-btn, .side-lang-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const targetLang = btn.getAttribute('data-lang');
      if (targetLang && targetLang !== currentLang) {
        applyLanguage(targetLang);
      }
    });
  });

  // Determine initial language:
  // 1. URL search param (?lang=en) or hash (#en)
  // 2. localStorage saved preference
  // 3. Browser language (auto-detect foreign visitors)
  function getInitialLanguage() {
    const urlParams = new URLSearchParams(window.location.search);
    const paramLang = urlParams.get('lang');
    if (paramLang && (paramLang === 'en' || paramLang === 'tr')) {
      return paramLang;
    }

    const hash = window.location.hash.toLowerCase();
    if (hash === '#en') return 'en';
    if (hash === '#tr') return 'tr';

    try {
      const savedLang = localStorage.getItem('discoland_lang');
      if (savedLang && (savedLang === 'en' || savedLang === 'tr')) {
        return savedLang;
      }
    } catch (e) {}

    // Auto-detect: if browser language is not Turkish, default to English
    const browserLang = (navigator.language || navigator.userLanguage || '').toLowerCase();
    if (browserLang && !browserLang.startsWith('tr')) {
      return 'en';
    }

    return 'tr';
  }

  // Initialize language
  applyLanguage(getInitialLanguage());

  // --- Mobile Face Card Expand Toggle ---
  const faceCards = document.querySelectorAll('.face-card');
  faceCards.forEach(card => {
    card.addEventListener('click', (e) => {
      if (window.innerWidth <= 768) {
        const wasOpen = card.classList.contains('is-open');
        const hintBio = (translations[currentLang]?.faces?.hintBio) || 'Biyografi';
        const hintClose = (translations[currentLang]?.faces?.hintClose) || 'Kapat';

        faceCards.forEach(c => {
          c.classList.remove('is-open');
          const lbl = c.querySelector('.hint-label');
          if (lbl) lbl.textContent = hintBio;
        });
        if (!wasOpen) {
          card.classList.add('is-open');
          const lbl = card.querySelector('.hint-label');
          if (lbl) lbl.textContent = hintClose;
        }
      }
    });
  });

  // Close when clicking outside face card on mobile
  document.addEventListener('click', (e) => {
    if (window.innerWidth <= 768 && !e.target.closest('.face-card')) {
      const hintBio = (translations[currentLang]?.faces?.hintBio) || 'Biyografi';
      faceCards.forEach(c => {
        c.classList.remove('is-open');
        const lbl = c.querySelector('.hint-label');
        if (lbl) lbl.textContent = hintBio;
      });
    }
  });

  // --- Easter egg: Konami Code plays disco (Modern e.code standard) ---
  let konamiSequence = [];
  const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'KeyB', 'KeyA'];

  document.addEventListener('keydown', (e) => {
    konamiSequence.push(e.code);
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
