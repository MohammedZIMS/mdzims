/* ==========================================================================
   MohammedZIMS Portfolio — script.js
   Theme · motion · laser · floating menu · nav · filters + show-more · reveal · cursor glow · form
   ========================================================================== */
(function () {
  'use strict';

  /* -------------------------------------------------------------------------
     CONFIG — edit these
     ------------------------------------------------------------------------- */
  var CONFIG = {
    email: 'zimss75656@gmail.com',
    timeZone: 'Asia/Dhaka',
    // Optional: paste a Formspree / Getform / Web3Forms endpoint to send the
    // contact form directly. Leave empty to open the visitor's email client.
    formEndpoint: ''
  };

  var root = document.documentElement;
  var $  = function (sel, ctx) { return (ctx || document).querySelector(sel); };
  var $$ = function (sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); };

  function store(key, value) {
    try {
      if (value === undefined) return localStorage.getItem(key);
      localStorage.setItem(key, value);
    } catch (e) { /* storage blocked — ignore */ }
    return null;
  }

  /* =========================================================================
     TOAST
     ========================================================================= */
  var toastEl = $('#toast');
  var toastTimer;
  function toast(message) {
    if (!toastEl) return;
    toastEl.textContent = message;
    toastEl.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toastEl.classList.remove('show'); }, 2200);
  }

  /* =========================================================================
     1. LIVE BANGLADESH CLOCK
     ========================================================================= */
  var clockEl = $('#bd-clock');
  var timeFormatter = new Intl.DateTimeFormat('en-US', {
    timeZone: CONFIG.timeZone,
    hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true
  });
  function tickClock() {
    if (clockEl) clockEl.textContent = timeFormatter.format(new Date());
  }
  tickClock();
  setInterval(tickClock, 1000);

  /* =========================================================================
     2. THEME (dark / light, persisted)
     ========================================================================= */
  var themeIcon = $('#theme-icon');
  var settingsThemeLabel = $('#settings-theme-label');
  var fabThemeIcon = $('#fab-theme-icon');
  var fabThemeLabel = $('#fab-theme-label');

  function applyTheme(theme, persist) {
    var isLight = theme === 'light';
    root.classList.toggle('light', isLight);
    root.classList.toggle('dark', !isLight);
    if (themeIcon) themeIcon.textContent = isLight ? 'dark_mode' : 'light_mode';
    if (fabThemeIcon) fabThemeIcon.textContent = isLight ? 'dark_mode' : 'light_mode';
    if (fabThemeLabel) fabThemeLabel.textContent = isLight ? 'Dark mode' : 'Light mode';
    if (settingsThemeLabel) settingsThemeLabel.textContent = isLight ? 'Light' : 'Dark';
    syncThemeColor();
    if (persist) store('mzims-theme', theme);
  }
  function animateTheme() {
    root.classList.add('theme-anim');
    clearTimeout(animateTheme._t);
    animateTheme._t = setTimeout(function () { root.classList.remove('theme-anim'); }, 650);
  }

  // keep the browser UI colour in sync with the active style + mode
  function syncThemeColor() {
    var meta = $('meta[name="theme-color"]');
    if (!meta) return;
    var v = getComputedStyle(root).getPropertyValue('--c-surface-base').trim().split(/\s+/);
    if (v.length === 3) meta.setAttribute('content', 'rgb(' + v.join(',') + ')');
  }

  function toggleTheme() {
    animateTheme();
    applyTheme(root.classList.contains('light') ? 'dark' : 'light', true);
  }
  applyTheme(root.classList.contains('light') ? 'light' : 'dark', false);

  [$('#theme-toggle'), $('#settings-theme')].forEach(function (btn) {
    if (btn) btn.addEventListener('click', toggleTheme);
  });

  /* =========================================================================
     2b. PORTFOLIO STYLE  (normal · royal luxury · premier)  — works in dark + light
     ========================================================================= */
  var STYLE_NAMES = { normal: 'Normal', royal: 'Royal Luxury', premier: 'Premier' };
  var styleBtn = $('#style-toggle');
  var styleMenu = $('#style-menu');
  var styleOpts = $$('.style-opt');

  function applyStyle(name, persist, animate) {
    if (!STYLE_NAMES[name]) name = 'normal';
    if (animate) animateTheme();
    if (window.mzLoadFonts) window.mzLoadFonts(name);
    root.setAttribute('data-style', name);
    styleOpts.forEach(function (o) {
      o.setAttribute('aria-checked', String(o.getAttribute('data-style') === name));
    });
    syncThemeColor();
    if (persist) store('mzims-style', name);
  }

  function isStyleMenuOpen() { return !!styleMenu && styleMenu.classList.contains('open'); }

  function setStyleMenu(open, returnFocus) {
    if (!styleMenu || !styleBtn) return;
    styleMenu.classList.toggle('open', open);
    styleBtn.setAttribute('aria-expanded', String(open));
    if (open) {
      if (window.mzLoadFonts) { window.mzLoadFonts('royal'); window.mzLoadFonts('premier'); } // preload for a smooth switch
      var checked = $('.style-opt[aria-checked="true"]', styleMenu) || styleOpts[0];
      if (checked) setTimeout(function () { checked.focus(); }, 30);
    } else if (returnFocus) {
      styleBtn.focus();
    }
  }

  if (styleBtn) {
    styleBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      setStyleMenu(!isStyleMenuOpen(), false);
    });
  }

  styleOpts.forEach(function (opt) {
    opt.addEventListener('click', function () {
      var name = opt.getAttribute('data-style');
      applyStyle(name, true, true);
      toast('Style: ' + STYLE_NAMES[name]);
      setStyleMenu(false, true);
    });
  });

  if (styleMenu) {
    styleMenu.addEventListener('keydown', function (e) {
      var i = styleOpts.indexOf(document.activeElement);
      if (e.key === 'ArrowDown') i = (i + 1) % styleOpts.length;
      else if (e.key === 'ArrowUp') i = (i - 1 + styleOpts.length) % styleOpts.length;
      else if (e.key === 'Home') i = 0;
      else if (e.key === 'End') i = styleOpts.length - 1;
      else return;
      e.preventDefault();
      styleOpts[i].focus();
    });
  }

  document.addEventListener('click', function (e) {
    if (isStyleMenuOpen() && !styleMenu.contains(e.target) && !(styleBtn && styleBtn.contains(e.target))) {
      setStyleMenu(false, false);
    }
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && isStyleMenuOpen()) setStyleMenu(false, true);
  });

  applyStyle(root.getAttribute('data-style') || 'normal', false, false);


  /* =========================================================================
     3. REDUCED MOTION (manual toggle; also honours the OS setting)
     ========================================================================= */
  var motionLabel = $('#settings-motion-label');
  function applyMotion(mode, persist) {
    var reduced = mode === 'reduced';
    root.classList.toggle('reduce-motion', reduced);
    if (motionLabel) motionLabel.textContent = reduced ? 'Reduced' : 'On';
    if (persist) store('mzims-motion', mode);
  }
  applyMotion(root.classList.contains('reduce-motion') ? 'reduced' : 'full', false);

  var motionBtn = $('#settings-motion');
  if (motionBtn) {
    motionBtn.addEventListener('click', function () {
      applyMotion(root.classList.contains('reduce-motion') ? 'full' : 'reduced', true);
    });
  }

  /* =========================================================================
     4. LASER SCANNER ON / OFF
     ========================================================================= */
  var laserLabel = $('#settings-laser-label');
  var fabLaserBtn = $('#fab-laser');
  var fabLaserIcon = $('#fab-laser-icon');

  function applyLaser(on, persist) {
    root.classList.toggle('no-laser', !on);
    if (laserLabel) laserLabel.textContent = on ? 'On' : 'Off';
    if (fabLaserBtn) fabLaserBtn.setAttribute('aria-pressed', String(on));
    if (fabLaserIcon) fabLaserIcon.textContent = on ? 'sensors' : 'sensors_off';
    if (persist) store('mzims-laser', on ? 'on' : 'off');
  }
  function toggleLaser() {
    applyLaser(root.classList.contains('no-laser'), true);
  }
  applyLaser(store('mzims-laser') !== 'off', false);

  var laserBtn = $('#settings-laser');
  if (laserBtn) laserBtn.addEventListener('click', toggleLaser);

  /* =========================================================================
     5. COPY EMAIL
     ========================================================================= */
  var copyLabel = $('#settings-copy-label');

  function copyEmail() {
    function done() {
      toast('Email copied to clipboard');
      if (copyLabel) {
        copyLabel.textContent = 'Copied!';
        setTimeout(function () { copyLabel.textContent = 'Copy'; }, 1600);
      }
    }
    function fallback() {
      var tmp = document.createElement('textarea');
      tmp.value = CONFIG.email;
      tmp.setAttribute('readonly', '');
      tmp.style.position = 'fixed';
      tmp.style.opacity = '0';
      document.body.appendChild(tmp);
      tmp.select();
      var ok = false;
      try { ok = document.execCommand('copy'); } catch (e) {}
      document.body.removeChild(tmp);
      if (ok) done(); else toast(CONFIG.email);
    }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(CONFIG.email).then(done).catch(fallback);
    } else {
      fallback();
    }
  }
  var copyBtn = $('#settings-copy');
  if (copyBtn) copyBtn.addEventListener('click', copyEmail);

  /* =========================================================================
     6. MOBILE MENU + SETTINGS POPOVER
     ========================================================================= */
  var menuBtn = $('#menu-toggle');
  var menuIcon = $('#menu-icon');
  var mobileMenu = $('#mobile-menu');

  function setMenu(open) {
    if (!mobileMenu || !menuBtn) return;
    mobileMenu.classList.toggle('is-hidden', !open);
    menuBtn.setAttribute('aria-expanded', String(open));
    menuBtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    if (menuIcon) menuIcon.textContent = open ? 'close' : 'menu';
  }
  if (menuBtn) {
    menuBtn.addEventListener('click', function () {
      setMenu(mobileMenu.classList.contains('is-hidden'));
    });
  }

  var settingsBtn = $('#settings-toggle');
  var settingsPanel = $('#settings-panel');

  function setSettings(open) {
    if (!settingsPanel || !settingsBtn) return;
    settingsPanel.classList.toggle('is-hidden', !open);
    settingsBtn.setAttribute('aria-expanded', String(open));
  }
  if (settingsBtn) {
    settingsBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      setSettings(settingsPanel.classList.contains('is-hidden'));
    });
  }

  /* =========================================================================
     7. FLOATING MENU — Contact flyout · Laser toggle · Back to top
     ========================================================================= */
  var fab = $('#fab');
  var contactBtn = $('#fab-contact');
  var contactIcon = $('#fab-contact-icon');
  var topBtn = $('#fab-top');
  var topWrap = $('#fab-top-wrap');

  function isReduced() { return root.classList.contains('reduce-motion'); }

  function setContact(open, returnFocus) {
    if (!fab || !contactBtn) return;
    fab.classList.toggle('contact-open', open);
    contactBtn.setAttribute('aria-expanded', String(open));
    contactBtn.setAttribute('aria-label', open ? 'Close contact links' : 'Open contact links');
    if (contactIcon) contactIcon.textContent = open ? 'close' : 'forum';
    if (!open && returnFocus) contactBtn.focus();
  }

  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: isReduced() ? 'auto' : 'smooth' });
  }

  if (contactBtn) {
    contactBtn.addEventListener('click', function () {
      setContact(!fab.classList.contains('contact-open'), false);
    });
  }
  $$('.fab-social a').forEach(function (a) {
    a.addEventListener('click', function () { setContact(false, false); });
  });

  if (fabLaserBtn) {
    fabLaserBtn.addEventListener('click', function () {
      toggleLaser();
      toast(root.classList.contains('no-laser') ? 'Laser scan off' : 'Laser scan on');
    });
  }
  if (topBtn) topBtn.addEventListener('click', scrollToTop);

  document.addEventListener('click', function (e) {
    if (settingsPanel && !settingsPanel.classList.contains('is-hidden')) {
      if (!settingsPanel.contains(e.target) && !(settingsBtn && settingsBtn.contains(e.target))) {
        setSettings(false);
      }
    }
    if (fab && fab.classList.contains('contact-open') && !fab.contains(e.target)) setContact(false, false);
  });

  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    var wasOpen = !!fab && fab.classList.contains('contact-open');
    setSettings(false);
    setMenu(false);
    if (wasOpen) setContact(false, true);
  });

  /* =========================================================================
     8. SCROLL: spy + laser progress beam + FAB progress ring
     ========================================================================= */
  var navLinks = $$('[data-nav]');
  var sections = $$('main section[id]');
  var beam = $('#scroll-laser-beam');
  var ringBar = $('#fab-ring-bar');
  var ringLen = 0;

  if (ringBar) {
    ringLen = 2 * Math.PI * parseFloat(ringBar.getAttribute('r'));
    ringBar.style.strokeDasharray = String(ringLen);
    ringBar.style.strokeDashoffset = String(ringLen);
  }

  function setActiveLink(id) {
    navLinks.forEach(function (link) {
      link.classList.toggle('nav-active', link.getAttribute('href') === '#' + id);
    });
  }

  function updateScrollUI() {
    var max = document.documentElement.scrollHeight - window.innerHeight;
    var progress = max > 0 ? Math.min(Math.max(window.scrollY / max, 0), 1) : 0;

    if (beam) {
      beam.style.width = (progress * 100).toFixed(2) + '%';
      beam.style.opacity = window.scrollY > 4 ? '1' : '0';
    }
    if (ringBar) ringBar.style.strokeDashoffset = String(ringLen * (1 - progress));
    if (topWrap && topBtn) {
      var showTop = window.scrollY > 400;
      topWrap.classList.toggle('show', showTop);
      topBtn.tabIndex = showTop ? 0 : -1;
    }

    // scroll spy
    if (sections.length) {
      var probe = window.scrollY + (window.innerWidth < 768 ? 110 : 140);
      var current = sections[0].id;
      sections.forEach(function (s) { if (s.offsetTop <= probe) current = s.id; });
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 8) {
        current = sections[sections.length - 1].id;
      }
      setActiveLink(current);
    }
  }

  var ticking = false;
  window.addEventListener('scroll', function () {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(function () { updateScrollUI(); ticking = false; });
  }, { passive: true });
  window.addEventListener('resize', updateScrollUI);
  updateScrollUI();

  navLinks.forEach(function (link) {
    link.addEventListener('click', function () { setMenu(false); });
  });

  /* =========================================================================
     9. PROJECT FILTERING + "SHOW MORE"
     ========================================================================= */
  var PROJECT_LIMIT = 6;
  var filterButtons = $$('[data-filter]');
  var projectCards = $$('.project-card');
  var emptyState = $('#projects-empty');
  var moreWrap = $('#projects-more-wrap');
  var moreBtn = $('#projects-more');
  var moreLabel = $('#projects-more-label');
  var countEl = $('#projects-count');
  var activeFilter = 'all';
  var expanded = false;

  function renderProjects() {
    var grid = $('#project-grid');
    var h0 = grid ? grid.offsetHeight : 0;
    var matches = projectCards.filter(function (c) {
      return activeFilter === 'all' || c.getAttribute('data-category') === activeFilter;
    });
    var shown = expanded ? matches.length : Math.min(PROJECT_LIMIT, matches.length);
    var fresh = 0;

    projectCards.forEach(function (card) {
      var idx = matches.indexOf(card);
      var visible = idx !== -1 && idx < shown;
      var wasHidden = card.classList.contains('is-hidden');
      card.classList.toggle('is-hidden', !visible);
      if (visible && wasHidden) {
        card.style.setProperty('--d', (fresh++ * 80) + 'ms');
        card.classList.remove('card-enter');
        void card.offsetWidth;               // restart the entrance animation
        card.classList.add('card-enter');
      }
    });

    // smoothly animate the grid between its old and new height
    if (grid && h0 && !isReduced()) {
      var h1 = grid.offsetHeight;
      if (h0 !== h1) {
        grid.style.height = h0 + 'px';
        grid.style.overflow = 'hidden';
        void grid.offsetHeight;
        grid.style.transition = 'height 0.6s cubic-bezier(0.22, 1, 0.36, 1)';
        grid.style.height = h1 + 'px';
        clearTimeout(renderProjects._t);
        renderProjects._t = setTimeout(function () {
          grid.style.height = grid.style.overflow = grid.style.transition = '';
        }, 650);
      }
    }

    if (emptyState) emptyState.classList.toggle('is-hidden', matches.length !== 0);
    if (moreWrap) moreWrap.classList.toggle('is-hidden', matches.length <= PROJECT_LIMIT);
    if (countEl) countEl.textContent = 'Showing ' + shown + ' of ' + matches.length + ' project' + (matches.length === 1 ? '' : 's');
    if (moreBtn) moreBtn.setAttribute('aria-expanded', String(expanded));
    if (moreLabel) {
      moreLabel.textContent = expanded
        ? 'Show Less'
        : 'Show More Projects (+' + (matches.length - shown) + ')';
    }
  }

  if (moreBtn) {
    moreBtn.addEventListener('click', function () {
      expanded = !expanded;
      renderProjects();
      if (!expanded) {
        var sec = $('#projects');
        if (sec) sec.scrollIntoView({ behavior: isReduced() ? 'auto' : 'smooth', block: 'start' });
      }
    });
  }

  filterButtons.forEach(function (btn) {
    btn.setAttribute('aria-pressed', btn.classList.contains('filter-active') ? 'true' : 'false');
    btn.addEventListener('click', function () {
      filterButtons.forEach(function (b) {
        b.classList.remove('filter-active');
        b.setAttribute('aria-pressed', 'false');
      });
      btn.classList.add('filter-active');
      btn.setAttribute('aria-pressed', 'true');
      activeFilter = btn.getAttribute('data-filter');
      expanded = false;
      renderProjects();
    });
  });

  renderProjects();

  /* =========================================================================
     10. SCROLL-REVEAL (grid children stagger in)
     ========================================================================= */
  var revealTargets = [];
  $$('main > section:not(#home) > *').forEach(function (el) {
    if (el.classList.contains('grid') && el.id !== 'project-grid') {
      Array.prototype.forEach.call(el.children, function (child, i) {
        child.style.setProperty('--d', (i * 90) + 'ms');
        revealTargets.push(child);
      });
    } else {
      revealTargets.push(el);
    }
  });
  revealTargets.forEach(function (el) { el.classList.add('reveal'); });

  function revealNow(el) {
    var delay = parseInt(el.style.getPropertyValue('--d'), 10) || 0;
    el.classList.add('in');
    // drop the stagger delay afterwards so hover transitions stay instant
    setTimeout(function () {
      el.classList.remove('reveal', 'in');
      el.style.removeProperty('--d');
    }, delay + 1000);
  }

  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          revealNow(entry.target);
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -6% 0px' });
    revealTargets.forEach(function (el) { io.observe(el); });
  } else {
    revealTargets.forEach(function (el) { el.classList.add('in'); });
  }

  /* =========================================================================
     10b. CURSOR GLOW + CARD SPOTLIGHT (fine pointers only)
     ========================================================================= */
  $$('.project-card, #skills .grid > div').forEach(function (el) { el.classList.add('spot'); });

  var glow = $('#cursor-glow');
  var finePointer = window.matchMedia && window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  if (glow && finePointer) {
    var tx = window.innerWidth / 2, ty = window.innerHeight / 3, ts = 1;
    var gx = tx, gy = ty, gs = 1, raf = 0;

    var tick = function () {
      var k = isReduced() ? 1 : 0.16;
      gx += (tx - gx) * k;
      gy += (ty - gy) * k;
      gs += (ts - gs) * k;
      glow.style.transform = 'translate3d(' + gx.toFixed(1) + 'px,' + gy.toFixed(1) + 'px,0) scale(' + gs.toFixed(3) + ')';
      raf = (Math.abs(tx - gx) + Math.abs(ty - gy) + Math.abs(ts - gs) > 0.05) ? requestAnimationFrame(tick) : 0;
    };

    document.addEventListener('mousemove', function (e) {
      tx = e.clientX;
      ty = e.clientY;
      var t = e.target;
      ts = (t.closest && t.closest('a, button, .spot')) ? 1.3 : 1;
      glow.classList.add('on');
      var card = t.closest && t.closest('.spot');
      if (card) {
        var r = card.getBoundingClientRect();
        card.style.setProperty('--mx', (e.clientX - r.left) + 'px');
        card.style.setProperty('--my', (e.clientY - r.top) + 'px');
      }
      if (!raf) raf = requestAnimationFrame(tick);
    }, { passive: true });

    document.documentElement.addEventListener('mouseleave', function () { glow.classList.remove('on'); });
    document.documentElement.addEventListener('mouseenter', function () { glow.classList.add('on'); });
  }

  /* =========================================================================
     11. IMAGES — local file first, remote fallback, then hide
     ========================================================================= */
  $$('img[data-remote]').forEach(function (img) {
    var stage = 0;
    function fail() {
      if (stage === 0 && img.getAttribute('data-remote')) {
        stage = 1;
        img.src = img.getAttribute('data-remote');
      } else {
        img.style.display = 'none';
      }
    }
    img.addEventListener('error', fail);
    if (img.complete && img.naturalWidth === 0 && img.getAttribute('src')) fail();
  });

  /* =========================================================================
     12. CONTACT FORM  (endpoint if configured, otherwise mailto)
     ========================================================================= */
  var form = $('#contact-form');
  var formStatus = $('#form-status');

  function say(text, ms) {
    if (!formStatus) return;
    formStatus.textContent = text;
    if (ms) setTimeout(function () { formStatus.textContent = ''; }, ms);
  }

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var trap = form.elements.namedItem('_gotcha');
      if (trap && trap.value) return;                       // honeypot → bot

      if (!form.checkValidity()) {
        form.reportValidity();
        say('Please fill every field.');
        return;
      }

      var name = form.elements.namedItem('name').value.trim();
      var email = form.elements.namedItem('email').value.trim();
      var message = form.elements.namedItem('message').value.trim();

      if (CONFIG.formEndpoint) {
        say('Sending…');
        fetch(CONFIG.formEndpoint, {
          method: 'POST',
          headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: name, email: email, message: message })
        }).then(function (res) {
          if (!res.ok) throw new Error('Request failed');
          form.reset();
          say('Message sent — thank you!', 5000);
          toast('Message sent');
        }).catch(function () {
          say('Could not send. Please email me directly.', 6000);
        });
        return;
      }

      var subject = encodeURIComponent('Portfolio contact from ' + name);
      var body = encodeURIComponent(message + '\n\n— ' + name + ' <' + email + '>');
      window.location.href = 'mailto:' + CONFIG.email + '?subject=' + subject + '&body=' + body;
      say('Opening your email client…', 4000);
      form.reset();
    });
  }

  /* =========================================================================
     13. FOOTER YEAR
     ========================================================================= */
  var yearEl = $('#year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

})();
