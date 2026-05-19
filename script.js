/* ========================================================================
   DAMIÁN LENCINA — VERSIÓN Z · script.js
   Interacciones limpias estilo studio moderno
   ======================================================================== */

(function() {
  'use strict';

  /* ============================ Theme toggle ============================ */
  const THEME_KEY = 'dl-theme';
  const root = document.documentElement;

  function getInitialTheme() {
    const saved = localStorage.getItem(THEME_KEY);
    if (saved === 'light' || saved === 'dark') return saved;
    // Respetar prefers-color-scheme
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  function applyTheme(theme, animated = false) {
    if (animated) {
      root.classList.add('theme-transitioning');
      setTimeout(() => root.classList.remove('theme-transitioning'), 500);
    }
    if (theme === 'dark') {
      root.setAttribute('data-theme', 'dark');
    } else {
      root.removeAttribute('data-theme');
    }
    // Actualizar theme-color del navegador
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', theme === 'dark' ? '#0a0a0a' : '#ffffff');
  }

  // Aplicar tema inicial (sin animación)
  applyTheme(getInitialTheme(), false);

  // Wireup del botón
  const themeToggle = document.getElementById('themeToggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const current = root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
      const next = current === 'dark' ? 'light' : 'dark';
      localStorage.setItem(THEME_KEY, next);
      applyTheme(next, true);
    });
  }

  /* ============================ NAV scroll state ============================ */
  const nav = document.getElementById('nav');
  const scrollProgress = document.getElementById('scrollProgress');
  const backToTop = document.getElementById('backToTop');

  function onScroll() {
    const y = window.scrollY;
    const h = document.documentElement.scrollHeight - window.innerHeight;
    const pct = h > 0 ? (y / h) * 100 : 0;

    if (nav) nav.classList.toggle('scrolled', y > 24);
    if (scrollProgress) scrollProgress.style.width = pct + '%';
    if (backToTop) backToTop.classList.toggle('show', y > 600);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  if (backToTop) {
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ============================ Mobile nav ============================ */
  const hamburger = document.getElementById('navHamburger');
  const navLinks = document.getElementById('navLinks');
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      const open = navLinks.classList.toggle('open');
      hamburger.setAttribute('aria-expanded', open);
    });
    // Cerrar al clickear un link
    navLinks.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        navLinks.classList.remove('open');
        hamburger.setAttribute('aria-expanded', false);
      });
    });
  }

  /* ============================ Reveal on scroll ============================ */
  const revealTargets = document.querySelectorAll('.reveal, .reveal-stagger');
  if ('IntersectionObserver' in window && revealTargets.length) {
    // Activar las animaciones agregando la clase al <html>
    document.documentElement.classList.add('js-reveal-init');
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -8% 0px' });
    revealTargets.forEach(el => io.observe(el));
  }
  /* Si no hay IntersectionObserver, los elementos quedan visibles por default (no se aplica .js-reveal-init) */

  /* ============================ Counter animation ============================ */
  const counters = document.querySelectorAll('.counter');
  if ('IntersectionObserver' in window && counters.length) {
    const counterIO = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterIO.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    counters.forEach(c => counterIO.observe(c));
  }

  function animateCounter(el) {
    const target = parseInt(el.dataset.target, 10) || 0;
    const format = el.dataset.format;
    const duration = 1600;
    const start = performance.now();

    function tick(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = Math.floor(eased * target);
      el.textContent = format === 'thousand'
        ? value.toLocaleString('es-AR')
        : value.toString();
      if (progress < 1) requestAnimationFrame(tick);
      else el.textContent = format === 'thousand' ? target.toLocaleString('es-AR') : target.toString();
    }
    requestAnimationFrame(tick);
  }

  /* ============================ Smooth scroll to anchors ============================ */
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href === '#' || href === '#!') return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const offset = 80;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  /* ============================ Lightbox para imágenes de casos ============================ */
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxClose = document.getElementById('lightboxClose');

  function openLightbox(src, alt) {
    if (!lightbox || !lightboxImg) return;
    lightboxImg.src = src;
    lightboxImg.alt = alt || '';
    lightbox.classList.add('show');
    document.body.style.overflow = 'hidden';
  }
  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove('show');
    document.body.style.overflow = '';
  }

  // Hacer clickeables las imágenes dentro de casos
  document.querySelectorAll('.case-image img, .case-image-pair img').forEach(img => {
    img.style.cursor = 'zoom-in';
    img.addEventListener('click', () => openLightbox(img.src, img.alt));
  });

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightbox) {
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });
  }
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeLightbox();
      closeVideoModal();
    }
  });

  /* ============================ Video modal (avatar player) ============================ */
  const avatarPlayer = document.getElementById('avatarPlayer');
  const videoModal = document.getElementById('videoModal');
  const videoModalClose = document.getElementById('videoModalClose');
  const videoModalBackdrop = document.getElementById('videoModalBackdrop');
  let ytPlayer = null;
  let ytReady = false;

  // Cargar YouTube API
  function loadYouTubeAPI() {
    if (window.YT && window.YT.Player) {
      ytReady = true;
      return;
    }
    if (document.getElementById('yt-api-script')) return;
    const tag = document.createElement('script');
    tag.id = 'yt-api-script';
    tag.src = 'https://www.youtube.com/iframe_api';
    document.body.appendChild(tag);
    window.onYouTubeIframeAPIReady = () => { ytReady = true; };
  }

  function openVideoModal() {
    if (!videoModal) return;
    videoModal.classList.add('show');
    document.body.style.overflow = 'hidden';
    loadYouTubeAPI();

    const tryInitPlayer = () => {
      if (!ytReady) {
        setTimeout(tryInitPlayer, 100);
        return;
      }
      if (ytPlayer) {
        ytPlayer.playVideo();
        return;
      }
      ytPlayer = new YT.Player('ytPlayer', {
        videoId: 'hGl_LCcCFkk', // La Jetée placeholder
        playerVars: { autoplay: 1, rel: 0, modestbranding: 1 }
      });
    };
    tryInitPlayer();
  }
  function closeVideoModal() {
    if (!videoModal) return;
    videoModal.classList.remove('show');
    document.body.style.overflow = '';
    if (ytPlayer && ytPlayer.pauseVideo) ytPlayer.pauseVideo();
  }

  if (avatarPlayer) avatarPlayer.addEventListener('click', openVideoModal);
  if (videoModalClose) videoModalClose.addEventListener('click', closeVideoModal);
  if (videoModalBackdrop) videoModalBackdrop.addEventListener('click', closeVideoModal);

  /* ============================ Año dinámico en footer ============================ */
  document.querySelectorAll('.footer-year').forEach(el => {
    el.textContent = new Date().getFullYear();
  });

  /* ============================ Magnetic hover en CTAs ============================ */
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!prefersReducedMotion) {
    const magneticBtns = document.querySelectorAll('.btn-primary, .btn-light, .btn-magnetic');
    magneticBtns.forEach(b => b.classList.add('btn-magnetic'));
    const STRENGTH = 0.30;   // qué tanto sigue el cursor (0–1)
    const RADIUS   = 80;     // px desde el centro donde empieza a atraer

    magneticBtns.forEach(btn => {
      let rect = null;
      const onEnter = () => { rect = btn.getBoundingClientRect(); };
      const onMove = (e) => {
        if (!rect) rect = btn.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = e.clientX - cx;
        const dy = e.clientY - cy;
        const dist = Math.hypot(dx, dy);
        const factor = Math.max(0, 1 - dist / (rect.width + RADIUS));
        btn.style.setProperty('--mx', (dx * STRENGTH * factor) + 'px');
        btn.style.setProperty('--my', (dy * STRENGTH * factor) + 'px');
      };
      const onLeave = () => {
        btn.style.setProperty('--mx', '0px');
        btn.style.setProperty('--my', '0px');
        rect = null;
      };
      btn.addEventListener('mouseenter', onEnter);
      btn.addEventListener('mousemove', onMove);
      btn.addEventListener('mouseleave', onLeave);
    });
  }

  /* ============================ Parallax sutil en imágenes de caso ============================ */
  if (!prefersReducedMotion && 'IntersectionObserver' in window) {
    const parallaxImgs = document.querySelectorAll('.case-image img, .case-image-pair img, .featured-case-body img');
    if (parallaxImgs.length) {
      const active = new Set();
      const onScroll = () => {
        active.forEach(img => {
          const r = img.getBoundingClientRect();
          const vh = window.innerHeight;
          // Progreso de -1 (entrando por abajo) a 1 (saliendo por arriba)
          const progress = (r.top + r.height / 2 - vh / 2) / (vh / 2 + r.height / 2);
          const shift = Math.max(-20, Math.min(20, -progress * 18));
          img.style.transform = `translate3d(0, ${shift}px, 0) scale(1.06)`;
        });
      };
      const io = new IntersectionObserver((entries) => {
        entries.forEach(e => {
          if (e.isIntersecting) active.add(e.target);
          else active.delete(e.target);
        });
        onScroll();
      });
      parallaxImgs.forEach(img => {
        img.style.willChange = 'transform';
        io.observe(img);
      });
      window.addEventListener('scroll', onScroll, { passive: true });
    }
  }

})();
