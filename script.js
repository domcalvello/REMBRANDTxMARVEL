(() => {
  const nav = document.querySelector('[data-nav]');
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');
  const heroVideo = document.querySelector('.hero__media');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const qaMode = new URLSearchParams(window.location.search).has('qa');

  if (qaMode) {
    document.documentElement.classList.add('qa-mode');
    document.querySelectorAll('img[loading="lazy"]').forEach((image) => {
      image.loading = 'eager';
    });
  }

  const closeMenu = () => {
    if (!toggle || !links) return;
    toggle.setAttribute('aria-expanded', 'false');
    links.classList.remove('is-open');
    document.body.classList.remove('nav-open');
  };

  toggle?.addEventListener('click', () => {
    const opening = toggle.getAttribute('aria-expanded') !== 'true';
    toggle.setAttribute('aria-expanded', String(opening));
    links?.classList.toggle('is-open', opening);
    document.body.classList.toggle('nav-open', opening);
  });

  links?.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', closeMenu);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      closeMenu();
      toggle?.focus();
    }
  });

  const updateNav = () => {
    nav?.classList.toggle('is-scrolled', window.scrollY > 32);
  };

  updateNav();
  window.addEventListener('scroll', updateNav, { passive: true });

  const reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !reducedMotion.matches && !qaMode) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.12 });

    reveals.forEach((element) => revealObserver.observe(element));
  } else {
    reveals.forEach((element) => element.classList.add('is-visible'));
  }

  const rooms = document.querySelectorAll('[data-room]');
  if ('IntersectionObserver' in window && nav) {
    const roomObserver = new IntersectionObserver((entries) => {
      const current = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

      if (!current) return;
      const tone = current.target.dataset.room;
      nav.classList.toggle('nav--light', tone === 'light');
      nav.classList.toggle('nav--rupture', tone === 'rupture');
    }, { rootMargin: '-42% 0px -42% 0px', threshold: 0 });

    rooms.forEach((room) => roomObserver.observe(room));
  }

  const usePosterOnly = () => {
    if (!heroVideo || heroVideo.tagName !== 'VIDEO') return;
    heroVideo.removeAttribute('autoplay');
    heroVideo.pause();
    heroVideo.currentTime = 0;
  };

  if (reducedMotion.matches || qaMode) usePosterOnly();
  reducedMotion.addEventListener?.('change', (event) => {
    if (event.matches) {
      usePosterOnly();
    } else {
      heroVideo?.play?.().catch(() => {});
    }
  });

  heroVideo?.addEventListener('error', () => {
    if (heroVideo.tagName !== 'VIDEO') return;
    const fallback = document.createElement('img');
    fallback.className = 'hero__media';
    fallback.src = 'assets/media/remxmarvel-hero.webp';
    fallback.width = 1916;
    fallback.height = 821;
    fallback.alt = 'Rembrandt × Marvel exhibition title beside a portrait of Rembrandt';
    heroVideo.replaceWith(fallback);
  });
})();
