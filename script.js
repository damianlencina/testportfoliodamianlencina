// ============================================================
// PORTFOLIO DAMI — Interacciones
// ============================================================

// Helper
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

// ============================================================
// NAV — clase scrolled al hacer scroll
// ============================================================
(function setupNavScroll() {
  const nav = document.getElementById('nav');
  if (!nav) return;
  let ticking = false;
  function onScroll() {
    if (!ticking) {
      requestAnimationFrame(() => {
        nav.classList.toggle('scrolled', window.scrollY > 20);
        ticking = false;
      });
      ticking = true;
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();

// ============================================================
// 1. CARRUSELES
// ============================================================
$$('[data-carousel]').forEach(wrap => {
  const carousel = $('.carousel', wrap);
  const items = $$('.carousel-item', wrap);
  const prev = $('.prev', wrap);
  const next = $('.next', wrap);
  const counter = $('.current', wrap);
  const progress = $('.carousel-progress-bar', wrap);
  const total = items.length;

  function update() {
    const itemWidth = items[0].offsetWidth + 16;
    const current = Math.round(carousel.scrollLeft / itemWidth);
    const visible = Math.ceil(carousel.clientWidth / itemWidth);
    const maxIndex = Math.max(0, total - visible);

    if (counter) counter.textContent = String(current + 1).padStart(2, '0');
    if (progress) {
      const pct = maxIndex > 0 ? (current / maxIndex) * 100 : 100;
      progress.style.width = Math.min(100, pct) + '%';
    }
    if (prev) prev.disabled = current <= 0;
    if (next) next.disabled = current >= maxIndex;
  }

  function scrollByOne(dir) {
    const itemWidth = items[0].offsetWidth + 16;
    carousel.scrollBy({ left: dir * itemWidth, behavior: 'smooth' });
  }

  if (prev) prev.addEventListener('click', () => scrollByOne(-1));
  if (next) next.addEventListener('click', () => scrollByOne(1));
  carousel.addEventListener('scroll', () => {
    cancelAnimationFrame(carousel._raf);
    carousel._raf = requestAnimationFrame(update);
  });
  window.addEventListener('resize', update);
  update();
});

// ============================================================
// 2. TABS
// ============================================================
$$('[data-tabs]').forEach(wrap => {
  const buttons = $$('.tab-btn', wrap);
  const panels = $$('.tab-panel', wrap);

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.tab;
      buttons.forEach(b => b.classList.toggle('active', b === btn));
      panels.forEach(p => p.classList.toggle('active', p.dataset.panel === target));
    });
  });
});

// ============================================================
// 3. COUNTERS animados
// ============================================================
function animateCounter(el) {
  const target = parseInt(el.dataset.target, 10);
  const format = el.dataset.format;
  const pad = parseInt(el.dataset.pad || '0', 10);
  const duration = 1400;
  const start = performance.now();

  function tick(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.round(target * eased);
    let display;
    if (format === 'thousand') {
      display = current.toLocaleString('es-AR');
    } else if (pad > 0) {
      display = String(current).padStart(pad, '0');
    } else {
      display = String(current);
    }
    el.textContent = display;
    if (progress < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

// ============================================================
// 4. REVEAL ON SCROLL
// ============================================================
const revealObs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      $$('.counter:not(.counted)', entry.target).forEach(c => {
        c.classList.add('counted');
        animateCounter(c);
      });
      revealObs.unobserve(entry.target);
    }
  });
}, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });

$$('.reveal, .reveal-stagger').forEach(el => revealObs.observe(el));

// Counters fuera de reveal
const counterObs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
      entry.target.classList.add('counted');
      animateCounter(entry.target);
      counterObs.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });
$$('.counter:not(.counted)').forEach(c => counterObs.observe(c));

// ============================================================
// 5. CATEGORÍAS EXPANDIBLES
// ============================================================
const categoriesGrid = $('[data-categories]');
const categoriesToggle = $('[data-categories-toggle]');
if (categoriesGrid && categoriesToggle) {
  categoriesToggle.addEventListener('click', () => {
    const isCollapsed = categoriesGrid.classList.contains('collapsed');
    if (isCollapsed) {
      categoriesGrid.classList.remove('collapsed');
      categoriesGrid.classList.add('expanded');
      categoriesToggle.classList.add('expanded');
      $('.text', categoriesToggle).textContent = 'Ver menos';
      $('.count', categoriesToggle).textContent = '−10';
    } else {
      categoriesGrid.classList.remove('expanded');
      categoriesGrid.classList.add('collapsed');
      categoriesToggle.classList.remove('expanded');
      $('.text', categoriesToggle).textContent = 'Ver todas las áreas';
      $('.count', categoriesToggle).textContent = '+10';
      // Scroll suave al toggle si está fuera del viewport
      const rect = categoriesToggle.getBoundingClientRect();
      if (rect.top < 100) {
        categoriesToggle.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  });
}

// ============================================================
// 6. TILT CARDS
// ============================================================
const supportsHover = window.matchMedia('(hover: hover)').matches;
if (supportsHover) {
  $$('.tilt-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      const tiltX = y * -4;
      const tiltY = x * 4;
      card.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateY(-4px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
}

// ============================================================
// 7. LIGHTBOX
// ============================================================
const lightbox = document.createElement('div');
lightbox.id = 'lightbox';
lightbox.innerHTML = `
  <button class="lightbox-close" aria-label="Cerrar">×</button>
  <img alt="">
  <div class="lightbox-caption"></div>
`;
document.body.appendChild(lightbox);

const lightboxImg = $('img', lightbox);
const lightboxCaption = $('.lightbox-caption', lightbox);
const lightboxClose = $('.lightbox-close', lightbox);

function openLightbox(src, alt, caption) {
  lightboxImg.src = src;
  lightboxImg.alt = alt || '';
  lightboxCaption.textContent = caption || alt || '';
  lightbox.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  lightbox.classList.remove('active');
  document.body.style.overflow = '';
  // Limpiar src después de la animación
  setTimeout(() => { lightboxImg.src = ''; }, 300);
}

$$('.lightbox-trigger').forEach(trigger => {
  trigger.addEventListener('click', (e) => {
    // No abrir si el click fue en un link interno (ej: caption)
    if (e.target.closest('a, button')) return;
    const img = $('img', trigger);
    if (!img) return;
    const caption = $('.img-caption', trigger);
    let captionText = '';
    if (caption) {
      captionText = $$('span', caption).map(s => s.textContent.trim()).join(' · ');
    }
    openLightbox(img.src, img.alt, captionText);
  });
});

lightboxClose.addEventListener('click', closeLightbox);
lightbox.addEventListener('click', (e) => {
  if (e.target === lightbox || e.target === lightboxImg) closeLightbox();
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && lightbox.classList.contains('active')) closeLightbox();
});

// ============================================================
// 8. PARALLAX SUTIL en imágenes hero
// ============================================================
const heroPortrait = $('.hero-portrait img');
if (heroPortrait && supportsHover) {
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const scrollY = window.scrollY;
        if (scrollY < 800) {
          heroPortrait.style.transform = `translateY(${scrollY * 0.08}px)`;
        }
        ticking = false;
      });
      ticking = true;
    }
  });
}

// ============================================================
// MAGIA VISIBLE — TANDA 5 EFECTOS
// ============================================================

// === 1. PAGE TRANSITIONS ===
(function setupPageTransitions() {
  // Crear el overlay de transición
  const transition = document.createElement('div');
  transition.className = 'page-transition';
  transition.innerHTML = '<div class="page-transition-mark">DL <span>·</span> 2026</div>';
  document.body.appendChild(transition);

  // Marcar que la página cargó
  requestAnimationFrame(() => {
    document.body.classList.add('page-loaded');
  });

  // Reset al volver atrás (cache del browser)
  window.addEventListener('pageshow', (e) => {
    if (e.persisted || performance.getEntriesByType('navigation')[0]?.type === 'back_forward') {
      transition.classList.remove('entering', 'exiting');
    }
  });

  // Interceptar clicks en links internos (mismo dominio, no anchors)
  document.addEventListener('click', (e) => {
    const link = e.target.closest('a');
    if (!link) return;

    const href = link.getAttribute('href');
    if (!href) return;

    // Skip: anchors (#), externos (http), mailto, tel, target=_blank
    if (href.startsWith('#') ||
        href.startsWith('http') ||
        href.startsWith('mailto:') ||
        href.startsWith('tel:') ||
        link.target === '_blank') {
      return;
    }

    // Solo páginas .html del mismo sitio
    if (!href.endsWith('.html')) return;

    e.preventDefault();
    transition.classList.add('entering');

    setTimeout(() => {
      window.location.href = href;
    }, 500);
  });
})();

// === 2. CURSOR CUSTOM ===
(function setupCustomCursor() {
  // Solo en desktop con hover real
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
  // No en pantallas táctiles
  if ('ontouchstart' in window) return;

  document.body.classList.add('has-custom-cursor');

  const cursor = document.createElement('div');
  cursor.className = 'custom-cursor';
  document.body.appendChild(cursor);

  const ring = document.createElement('div');
  ring.className = 'custom-cursor-ring';
  document.body.appendChild(ring);

  let mouseX = 0, mouseY = 0;
  let ringX = 0, ringY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.left = mouseX + 'px';
    cursor.style.top = mouseY + 'px';
  });

  // Ring sigue con delay (suave)
  function animateRing() {
    ringX += (mouseX - ringX) * 0.18;
    ringY += (mouseY - ringY) * 0.18;
    ring.style.left = ringX + 'px';
    ring.style.top = ringY + 'px';
    requestAnimationFrame(animateRing);
  }
  animateRing();

  // Cambiar estado según el elemento
  function updateState() {
    const el = document.elementFromPoint(mouseX, mouseY);
    if (!el) return;

    cursor.classList.remove('hover-link', 'hover-zoom', 'on-dark');
    ring.classList.remove('hover-link', 'hover-zoom', 'on-dark');

    // Detectar si está sobre fondo oscuro
    let onDark = false;
    let parent = el;
    while (parent && parent !== document.body) {
      if (parent.classList && (
          parent.classList.contains('bg-dark') ||
          parent.classList.contains('manifesto') ||
          parent.classList.contains('closing') ||
          parent.classList.contains('footer-cta') ||
          parent.classList.contains('video-section') ||
          parent.classList.contains('videos-section'))) {
        onDark = true;
        break;
      }
      parent = parent.parentElement;
    }
    if (onDark) {
      cursor.classList.add('on-dark');
      ring.classList.add('on-dark');
    }

    // Detectar tipo de elemento
    if (el.closest('.lightbox-trigger')) {
      cursor.classList.add('hover-zoom');
      ring.classList.add('hover-zoom');
    } else if (el.closest('a, button, [role="button"], .tab-btn, .carousel-btn, .categories-toggle')) {
      cursor.classList.add('hover-link');
      ring.classList.add('hover-link');
    }
  }

  // Update con throttle
  let updateScheduled = false;
  document.addEventListener('mousemove', () => {
    if (!updateScheduled) {
      updateScheduled = true;
      requestAnimationFrame(() => {
        updateState();
        updateScheduled = false;
      });
    }
  });

  // Ocultar cursor cuando sale de la ventana
  document.addEventListener('mouseleave', () => {
    cursor.style.opacity = '0';
    ring.style.opacity = '0';
  });
  document.addEventListener('mouseenter', () => {
    cursor.style.opacity = '1';
    ring.style.opacity = '0.5';
  });
})();

// === 3. SCROLL PROGRESS BAR ===
(function setupScrollProgress() {
  const bar = document.createElement('div');
  bar.className = 'scroll-progress';
  bar.innerHTML = '<div class="scroll-progress-fill"></div>';
  document.body.appendChild(bar);

  const fill = bar.querySelector('.scroll-progress-fill');
  let ticking = false;

  function updateProgress() {
    const scrolled = window.scrollY;
    const total = document.documentElement.scrollHeight - window.innerHeight;
    const pct = total > 0 ? (scrolled / total) * 100 : 0;
    fill.style.width = pct + '%';
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        updateProgress();
        ticking = false;
      });
      ticking = true;
    }
  });
  updateProgress();
})();

// === 4. SCROLL HINT (flecha indicadora) ===
(function setupScrollHint() {
  // Detectar primer hero en la página
  const hero = document.querySelector('.hero, .case-hero');
  if (!hero) return;

  // No mostrar si la página es muy corta
  if (document.documentElement.scrollHeight - window.innerHeight < 500) return;

  const hint = document.createElement('div');
  hint.className = 'scroll-hint';
  hint.innerHTML = `
    <span>Scroll</span>
    <div class="scroll-hint-arrow"></div>
  `;
  hero.appendChild(hint);

  // Ocultar al primer scroll
  let hidden = false;
  function checkScroll() {
    if (!hidden && window.scrollY > 50) {
      hint.classList.add('hidden');
      hidden = true;
      window.removeEventListener('scroll', checkScroll);
    }
  }
  window.addEventListener('scroll', checkScroll);
})();

// === 5. BOTÓN VOLVER ARRIBA ===
(function setupBackToTop() {
  const btn = document.createElement('button');
  btn.className = 'back-to-top';
  btn.setAttribute('aria-label', 'Volver arriba');
  document.body.appendChild(btn);

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  let ticking = false;
  function checkVisibility() {
    const scrolled = window.scrollY;
    const total = document.documentElement.scrollHeight - window.innerHeight;
    const pct = total > 0 ? (scrolled / total) * 100 : 0;
    if (pct > 30) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        checkVisibility();
        ticking = false;
      });
      ticking = true;
    }
  });
})();

// ============================================================
// CALIDAD DEL PRODUCTO
// ============================================================

// === SKELETON LOADERS + LAZY LOAD ===
(function setupImageLoading() {
  const containerSelectors = [
    '.img-card', '.work-thumb', '.case-img', '.video-thumb',
    '.frame', '.about-portrait', '.proof-img', '.tab-panel-img',
    '.step-img'
  ];

  // Marcar contenedores como "loading" hasta que cargue su imagen
  document.querySelectorAll('img').forEach(img => {
    // Saltear imágenes de YouTube thumbnails (ya externas)
    if (img.src && img.src.includes('ytimg.com')) {
      img.classList.add('loaded');
      return;
    }

    // Buscar contenedor más cercano
    let container = null;
    for (const sel of containerSelectors) {
      container = img.closest(sel);
      if (container) break;
    }
    // Para course-imgs y other-course-imgs los contenedores son los > div
    if (!container) {
      container = img.parentElement;
      if (container && (
        container.parentElement?.classList.contains('course-imgs') ||
        container.parentElement?.classList.contains('other-course-imgs')
      )) {
        // OK, el div directo padre es el contenedor
      } else {
        return;
      }
    }

    // Si ya cargó (cache), marcar como loaded
    if (img.complete && img.naturalHeight !== 0) {
      img.classList.add('loaded');
      if (container) container.classList.add('loaded');
    } else {
      if (container) container.classList.add('loading');
      img.addEventListener('load', () => {
        img.classList.add('loaded');
        if (container) {
          container.classList.remove('loading');
          container.classList.add('loaded');
        }
      });
      img.addEventListener('error', () => {
        if (container) container.classList.remove('loading');
      });
    }
  });
})();

// === AÑO DINÁMICO ===
(function setupDynamicYear() {
  const year = new Date().getFullYear();
  // Reemplazar el "© 2026" o similar en footers
  document.querySelectorAll('.footer-foot, .nav-mark, .page-transition-mark').forEach(el => {
    el.innerHTML = el.innerHTML.replace(/2026/g, String(year));
  });
})();

// ============================================================
// CARRUSEL TIPO B — amplio con dots
// ============================================================
document.querySelectorAll('[data-carousel-b]').forEach(wrap => {
  const carousel = wrap.querySelector('.carousel-b');
  const items = Array.from(wrap.querySelectorAll('.carousel-b-item'));
  const dots = Array.from(wrap.querySelectorAll('.carousel-b-dot'));
  const counter = wrap.querySelector('.carousel-b-counter span');
  const total = items.length;

  function getCurrentIndex() {
    const itemWidth = items[0].offsetWidth + 12;
    return Math.round(carousel.scrollLeft / itemWidth);
  }

  function update() {
    const idx = getCurrentIndex();
    dots.forEach((d, i) => d.classList.toggle('active', i === idx));
    if (counter) counter.textContent = String(idx + 1).padStart(2, '0');
  }

  // Click en dots
  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => {
      const itemWidth = items[0].offsetWidth + 12;
      carousel.scrollTo({ left: i * itemWidth, behavior: 'smooth' });
    });
  });

  carousel.addEventListener('scroll', () => {
    cancelAnimationFrame(carousel._rafB);
    carousel._rafB = requestAnimationFrame(update);
  });
  window.addEventListener('resize', update);
  update();
});

// ============================================================
// FILMSTRIP — igual que carrusel normal, sin controles extra
// ============================================================
// Los filmstrips son scroll libre, no necesitan JS adicional
// Solo el swipe nativo del browser ya funciona

// ============================================================
// SCROLL HINT — desaparece al hacer scroll
// ============================================================
(function setupScrollHint() {
  const hint = document.getElementById('scrollHint');
  if (!hint) return;
  let hidden = false;
  window.addEventListener('scroll', () => {
    if (!hidden && window.scrollY > 80) {
      hint.classList.add('hidden');
      hidden = true;
    }
  }, { passive: true });
})();

// ============================================================
// COMPARE SLIDER — antes/después interactivo (múltiples instancias)
// ============================================================
(function setupCompareSliders() {
  const sliders = document.querySelectorAll('.compare-slider');
  if (!sliders.length) return;

  sliders.forEach(slider => {
    const frame = slider.querySelector('.compare-slider-frame');
    const clip = slider.querySelector('.compare-slider-clip');
    const handle = slider.querySelector('.compare-slider-handle');
    const knob = slider.querySelector('.compare-slider-knob');
    if (!frame || !clip || !handle) return;

    let dragging = false;

    function setPosition(pct) {
      pct = Math.max(0, Math.min(100, pct));
      clip.style.width = pct + '%';
      handle.style.left = pct + '%';
      const ratio = pct === 0 ? 100 : 100 / (pct / 100);
      const img = clip.querySelector('.compare-slider-img');
      if (img) {
        img.style.width = ratio + '%';
      }
    }

    function pctFromEvent(e) {
      const rect = frame.getBoundingClientRect();
      const x = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left;
      return (x / rect.width) * 100;
    }

    function onStart(e) {
      dragging = true;
      frame.style.cursor = 'ew-resize';
      setPosition(pctFromEvent(e));
      e.preventDefault();
    }

    function onMove(e) {
      if (!dragging) return;
      setPosition(pctFromEvent(e));
    }

    function onEnd() {
      dragging = false;
    }

    frame.addEventListener('mousedown', onStart);
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onEnd);

    frame.addEventListener('touchstart', onStart, { passive: false });
    window.addEventListener('touchmove', onMove, { passive: true });
    window.addEventListener('touchend', onEnd);

    if (knob) {
      knob.addEventListener('keydown', (e) => {
        const current = parseFloat(handle.style.left) || 50;
        if (e.key === 'ArrowLeft') {
          setPosition(current - 5);
          e.preventDefault();
        } else if (e.key === 'ArrowRight') {
          setPosition(current + 5);
          e.preventDefault();
        }
      });
    }

    setPosition(50);

    // Animación de entrada
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setTimeout(() => setPosition(40), 300);
          setTimeout(() => setPosition(60), 700);
          setTimeout(() => setPosition(50), 1100);
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    io.observe(slider);
  });
})();

// ============================================================
// TIMELINE INTERACTIVO HORIZONTAL
// ============================================================
(function setupTimeline() {
  const items = document.querySelectorAll('.timeline-item');
  if (!items.length) return;
  // Solo en desktop (>700px)
  function isDesktop() { return window.innerWidth > 700; }

  items.forEach(item => {
    item.addEventListener('click', () => {
      if (!isDesktop()) return;
      const isActive = item.classList.contains('active');
      // Cerrar todos
      items.forEach(i => i.classList.remove('active'));
      // Abrir este si no estaba abierto
      if (!isActive) item.classList.add('active');
    });
    item.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        item.click();
      }
    });
  });

  // Click fuera cierra
  document.addEventListener('click', e => {
    if (!e.target.closest('.timeline-item')) {
      items.forEach(i => i.classList.remove('active'));
    }
  });
})();

// ============================================================
// CURSOR PERSONALIZADO
// ============================================================
(function setupCursor() {
  if (window.matchMedia('(pointer: coarse)').matches) return; // no en touch
  const cursor = document.createElement('div');
  cursor.className = 'custom-cursor';
  document.body.appendChild(cursor);

  let mx = -100, my = -100;
  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    cursor.style.left = mx + 'px';
    cursor.style.top = my + 'px';
  });

  // Hover en links y botones
  document.addEventListener('mouseover', e => {
    if (e.target.closest('a, button, [role="button"], .tilt-card, .quiz-btn')) {
      cursor.classList.add('cursor-hover');
    }
  });
  document.addEventListener('mouseout', e => {
    if (e.target.closest('a, button, [role="button"], .tilt-card, .quiz-btn')) {
      cursor.classList.remove('cursor-hover');
    }
  });

  document.addEventListener('mousedown', () => cursor.classList.add('cursor-click'));
  document.addEventListener('mouseup', () => cursor.classList.remove('cursor-click'));
})();

// ============================================================
// QUIZ DE ENTRADA
// ============================================================
(function setupQuiz() {
  const btns = document.querySelectorAll('.quiz-btn');
  if (!btns.length) return;

  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.target;
      const msg = btn.dataset.msg;

      // Feedback visual
      btns.forEach(b => b.style.opacity = '0.4');
      btn.style.opacity = '1';
      btn.style.borderColor = 'rgba(212,160,168,0.7)';

      // Toast con el mensaje
      const toast = document.createElement('div');
      toast.style.cssText = `
        position:fixed; bottom:32px; left:50%; transform:translateX(-50%);
        background:var(--burgundy); color:white; padding:12px 24px;
        border-radius:100px; font-size:14px; font-weight:500;
        z-index:9999; box-shadow:0 4px 20px rgba(0,0,0,0.3);
        animation: fadeInUp 0.3s ease both;
      `;
      toast.textContent = msg;
      document.body.appendChild(toast);

      // Scroll al target
      setTimeout(() => {
        const el = document.querySelector(target);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        setTimeout(() => toast.remove(), 2500);
      }, 400);
    });
  });
})();

// ============================================================
// MODO OSCURO TOGGLE
// ============================================================
(function setupDarkMode() {
  const toggle = document.createElement('button');
  toggle.className = 'dark-mode-toggle';
  toggle.setAttribute('aria-label', 'Alternar modo oscuro');
  toggle.setAttribute('title', 'Modo oscuro');
  toggle.innerHTML = '🌙';
  document.body.appendChild(toggle);

  const saved = localStorage.getItem('dl-dark-mode');
  if (saved === 'true') {
    document.body.classList.add('dark-mode');
    toggle.innerHTML = '☀️';
  }

  toggle.addEventListener('click', () => {
    const isDark = document.body.classList.toggle('dark-mode');
    toggle.innerHTML = isDark ? '☀️' : '🌙';
    localStorage.setItem('dl-dark-mode', isDark);
  });
})();

// ============================================================
// EASTER EGG — Claqueta de cine al llegar al final del scroll
// ============================================================
(function setupClapperboard() {
  let triggered = false;

  // Crear el audio con Web Audio API (claqueta sintética, sin archivo externo)
  function playClap() {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();

      // Golpe seco de claqueta
      const buf = ctx.createBuffer(1, ctx.sampleRate * 0.15, ctx.sampleRate);
      const data = buf.getChannelData(0);
      for (let i = 0; i < data.length; i++) {
        const t = i / ctx.sampleRate;
        data[i] = Math.random() * 2 - 1;
        data[i] *= Math.exp(-t * 60); // decay rápido
      }
      const src = ctx.createBufferSource();
      src.buffer = buf;
      const gain = ctx.createGain();
      gain.gain.value = 0.4;
      src.connect(gain);
      gain.connect(ctx.destination);
      src.start();
    } catch(e) {}
  }

  // Detectar over-scroll (efecto rebote en el footer)
  const footer = document.querySelector('.footer-cta');
  if (!footer) return;

  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting && !triggered) {
        triggered = true;

        // Toast de claqueta
        setTimeout(() => {
          playClap();
          const toast = document.createElement('div');
          toast.style.cssText = `
            position:fixed; bottom:80px; left:50%; transform:translateX(-50%);
            background:#1a1a24; color:#e8e4de; padding:10px 20px;
            border-radius:100px; font-size:13px; font-family:'JetBrains Mono',monospace;
            letter-spacing:0.12em; z-index:9999;
            border:1px solid rgba(232,228,222,0.15);
            animation:fadeInUp 0.3s ease both;
            pointer-events:none;
          `;
          toast.textContent = '🎬  ¡Fin del portfolio! · DL · 2026';
          document.body.appendChild(toast);
          setTimeout(() => {
            toast.style.transition = 'opacity 0.5s';
            toast.style.opacity = '0';
            setTimeout(() => toast.remove(), 500);
          }, 2800);
        }, 300);
      }
    });
  }, { threshold: 0.85 });

  obs.observe(footer);
})();

// ============================================================
// FADE IN UP (keyframe para toasts)
// ============================================================
(function injectToastKeyframe() {
  if (document.getElementById('dl-toast-kf')) return;
  const s = document.createElement('style');
  s.id = 'dl-toast-kf';
  s.textContent = `@keyframes fadeInUp { from { opacity:0; transform:translate(-50%,12px); } to { opacity:1; transform:translate(-50%,0); } }`;
  document.head.appendChild(s);
})();

// ============================================================
// HERO PILLS — navegación con scroll suave y toast
// ============================================================
(function setupHeroPills() {
  const pills = document.querySelectorAll('.hero-pill-nav');
  if (!pills.length) return;

  pills.forEach(pill => {
    pill.addEventListener('click', () => {
      const targetSel = pill.dataset.target;
      const msg = pill.dataset.msg;

      // Toast
      const toast = document.createElement('div');
      toast.style.cssText = `
        position:fixed; bottom:32px; left:50%; transform:translateX(-50%);
        background:var(--burgundy); color:white; padding:12px 24px;
        border-radius:100px; font-size:14px; font-weight:500;
        z-index:9999; box-shadow:0 4px 20px rgba(0,0,0,0.3);
        animation: fadeInUp 0.3s ease both; white-space:nowrap;
      `;
      toast.textContent = msg;
      document.body.appendChild(toast);

      // Scroll
      setTimeout(() => {
        const el = document.querySelector(targetSel);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        setTimeout(() => toast.remove(), 2500);
      }, 200);
    });
  });
})();

// ============================================================
// HAMBURGER MENU
// ============================================================
(function setupHamburger() {
  const btn = document.getElementById('navHamburger');
  const links = document.getElementById('navLinks');
  if (!btn || !links) return;

  function openMenu() {
    btn.setAttribute('aria-expanded', 'true');
    links.classList.add('nav-open');
    document.body.style.overflow = 'hidden';
  }
  function closeMenu() {
    btn.setAttribute('aria-expanded', 'false');
    links.classList.remove('nav-open');
    document.body.style.overflow = '';
  }

  btn.addEventListener('click', () => {
    const isOpen = btn.getAttribute('aria-expanded') === 'true';
    isOpen ? closeMenu() : openMenu();
  });

  // Cerrar al clickear un link
  links.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', closeMenu);
  });

  // Cerrar con Escape
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeMenu();
  });

  // Cerrar si el viewport se agranda (orientación)
  window.addEventListener('resize', () => {
    if (window.innerWidth > 900) closeMenu();
  });
})();

// ============================================================
// AVATAR REPRODUCTOR — YouTube IFrame API
// ============================================================
(function setupAvatarPlayer() {
  const btn = document.getElementById('avatarPlayer');
  const modal = document.getElementById('videoModal');
  const backdrop = document.getElementById('videoModalBackdrop');
  const closeBtn = document.getElementById('videoModalClose');
  if (!btn || !modal) return;

  // ── ID del video de YouTube ──
  // Reemplazá 'TU_VIDEO_ID' con el ID real cuando tengas el video subido
  // El ID es la parte después de ?v= en la URL de YouTube
  // Ejemplo: https://youtu.be/dQw4w9WgXcQ → ID = dQw4w9WgXcQ
  const YT_VIDEO_ID = 'jO4W6TPkSD8'; // PLACEHOLDER: reemplazá con tu video cuando lo tengas

  let player = null;
  let ytReady = false;

  // Cargar la API de YouTube de forma diferida (solo cuando se necesita)
  function loadYTApi() {
    if (document.getElementById('yt-api-script')) return;
    const s = document.createElement('script');
    s.id = 'yt-api-script';
    s.src = 'https://www.youtube.com/iframe_api';
    document.head.appendChild(s);
  }

  // Callback global que llama YouTube cuando la API está lista
  window.onYouTubeIframeAPIReady = function() {
    ytReady = true;
  };

  function createPlayer() {
    player = new YT.Player('ytPlayer', {
      videoId: YT_VIDEO_ID,
      playerVars: {
        autoplay: 1,
        rel: 0,          // No mostrar videos relacionados al terminar
        modestbranding: 1,
        playsinline: 1,
        cc_load_policy: 0,
      },
      events: {
        onStateChange: function(e) {
          // YT.PlayerState.ENDED = 0
          if (e.data === 0) {
            closeModal();
          }
        }
      }
    });
  }

  function openModal() {
    modal.classList.add('modal-open');
    document.body.style.overflow = 'hidden';

    if (ytReady) {
      // API ya cargada — crear o reproducir
      if (player && player.playVideo) {
        player.seekTo(0);
        player.playVideo();
      } else {
        createPlayer();
      }
    } else {
      // API no cargada todavía — cargarla y esperar
      loadYTApi();
      const waitForYT = setInterval(() => {
        if (window.YT && window.YT.Player) {
          clearInterval(waitForYT);
          ytReady = true;
          createPlayer();
        }
      }, 100);
    }
  }

  function closeModal() {
    modal.classList.remove('modal-open');
    document.body.style.overflow = '';
    if (player && player.pauseVideo) {
      player.pauseVideo();
    }
  }

  // Abrir
  btn.addEventListener('click', () => {
    loadYTApi(); // Precarga apenas clickea
    openModal();
  });

  // Cerrar con botón X
  closeBtn.addEventListener('click', closeModal);

  // Cerrar con backdrop
  backdrop.addEventListener('click', closeModal);

  // Cerrar con Escape
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && modal.classList.contains('modal-open')) {
      closeModal();
    }
  });

  // Precarga la API al hacer hover sobre el avatar (optimización)
  btn.addEventListener('mouseenter', loadYTApi, { once: true });
})();
