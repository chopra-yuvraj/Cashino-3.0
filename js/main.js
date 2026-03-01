/* ============================================
   CASHINO 3.0 - Ultra-Premium JavaScript
   Slot Machine · Golden Embers · Mobile-First
   ============================================ */

const isMobile = /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initAccordion();
  initReveal();
  initGoldenEmbers();
  initHeroReveal();
  initSlotMachine();
});

/* ---------- Navbar ---------- */
function initNavbar() {
  const navbar = document.querySelector('.navbar');
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');

  if (navbar) {
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          navbar.classList.toggle('scrolled', window.scrollY > 40);
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

  if (hamburger && navLinks) {
    hamburger.addEventListener('click', (e) => {
      e.stopPropagation();
      hamburger.classList.toggle('active');
      navLinks.classList.toggle('open');
      // Prevent background scroll when menu is open
      document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
    });

    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navLinks.classList.remove('open');
        document.body.style.overflow = '';
      });
    });

    // Close menu on outside tap
    document.addEventListener('click', (e) => {
      if (navLinks.classList.contains('open') &&
        !navLinks.contains(e.target) &&
        !hamburger.contains(e.target)) {
        hamburger.classList.remove('active');
        navLinks.classList.remove('open');
        document.body.style.overflow = '';
      }
    });
  }
}

/* ---------- Accordion ---------- */
function initAccordion() {
  document.querySelectorAll('.accordion-header').forEach(header => {
    header.addEventListener('click', () => {
      const item = header.parentElement;
      const isOpen = item.classList.contains('active');
      document.querySelectorAll('.accordion-item').forEach(i => i.classList.remove('active'));
      if (!isOpen) item.classList.add('active');
    });
  });
}

/* ---------- Scroll Reveal ---------- */
function initReveal() {
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const d = entry.target.dataset.delay || 0;
        // On mobile, reduce stagger delays for snappier feel
        const delay = isMobile ? Math.min(parseInt(d), 150) : parseInt(d);
        setTimeout(() => entry.target.classList.add('visible'), delay);
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.06, rootMargin: '0px 0px -20px 0px' });

  document.querySelectorAll('.reveal, .fade-in').forEach(el => obs.observe(el));
}

/* ---------- Hero Title Character Reveal ---------- */
function initHeroReveal() {
  const title = document.querySelector('.hero-title');
  if (!title || title.dataset.revealed) return;
  title.dataset.revealed = 'true';

  const text = title.textContent.trim();
  title.innerHTML = '';
  let idx = 0;

  // On mobile, use slightly faster character delays
  const charDelay = isMobile ? 0.05 : 0.07;

  text.split('').forEach(char => {
    if (char === ' ') {
      const sp = document.createElement('span');
      sp.className = 'space';
      sp.innerHTML = '&nbsp;';
      title.appendChild(sp);
    } else {
      const s = document.createElement('span');
      s.className = 'char';
      s.textContent = char;
      s.style.animationDelay = `${0.3 + idx * charDelay}s`;
      title.appendChild(s);
      idx++;
    }
  });
}

/* ---------- Slot Machine ---------- */
function initSlotMachine() {
  const spinBtn = document.querySelector('.spin-btn');
  const reel = document.querySelector('.slot-reel');
  const result = document.querySelector('.slot-result');
  if (!spinBtn || !reel) return;

  const games = [
    { name: 'Minefield', href: 'pages/minefield.html' },
    { name: 'Colour Wheel', href: 'pages/colour-wheel.html' },
    { name: 'Liar Dice', href: 'pages/liar-dice.html' },
    { name: 'TileTango', href: 'pages/tiletango.html' },
    { name: 'LuckExchange', href: 'pages/luck-exchange.html' },
    { name: '7 Up & Down', href: 'pages/7-up-down.html' },
    { name: 'Plinko', href: 'pages/plinko.html' },
    { name: 'Tangram', href: 'pages/tangram.html' },
    { name: 'Board Basketball', href: 'pages/board-basketball.html' },
    { name: 'Snake Pit', href: 'pages/snake-pit.html' },
    { name: 'Dicejack', href: 'pages/dicejack.html' },
    { name: 'Order Can Guessing', href: 'pages/order-can-guessing.html' },
    { name: 'Luck Ladder', href: 'pages/luck-ladder.html' },
  ];

  // Responsive item height: match CSS slot-window height
  function getItemHeight() {
    const w = window.innerWidth;
    if (w <= 480) return 80;
    if (w <= 768) return 100;
    return 120;
  }

  // Build reel: fewer cycles on mobile for performance
  const CYCLES = isMobile ? 4 : 6;

  function buildReel() {
    reel.innerHTML = '';
    for (let cycle = 0; cycle < CYCLES; cycle++) {
      games.forEach(g => {
        const div = document.createElement('div');
        div.className = 'slot-item';
        div.textContent = g.name;
        reel.appendChild(div);
      });
    }
  }
  buildReel();

  // Rebuild reel on resize to match new item heights
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => buildReel(), 200);
  });

  let spinning = false;

  spinBtn.addEventListener('click', () => {
    if (spinning) return;
    spinning = true;
    spinBtn.classList.add('spinning');
    spinBtn.textContent = 'SPINNING...';

    if (result) {
      result.classList.remove('show');
      result.innerHTML = '';
    }

    const ITEM_HEIGHT = getItemHeight();
    const winIndex = Math.floor(Math.random() * games.length);
    const winner = games[winIndex];

    // Target: land on cycle (CYCLES - 2) + winIndex
    const targetCycle = Math.max(CYCLES - 2, 2);
    const targetIndex = (targetCycle * games.length) + winIndex;
    const targetOffset = -(targetIndex * ITEM_HEIGHT);

    // Shorter spin on mobile for performance
    const spinDuration = isMobile ? 3 : 4;
    const blurMax = isMobile ? '1px' : '2px';

    // Reset position
    reel.style.transition = 'none';
    reel.style.transform = 'translateY(0)';
    reel.style.filter = 'blur(0)';
    reel.offsetHeight; // force reflow

    // Animate
    reel.style.transition = `transform ${spinDuration}s cubic-bezier(0.15, 0.85, 0.25, 1)`;
    reel.style.transform = `translateY(${targetOffset}px)`;

    // Apply blur during spin (lighter on mobile)
    if (!prefersReducedMotion) {
      reel.style.filter = `blur(${blurMax})`;
      setTimeout(() => { reel.style.filter = 'blur(0.5px)'; }, spinDuration * 625);
      setTimeout(() => { reel.style.filter = 'blur(0)'; }, spinDuration * 900);
    }

    // Highlight winner + show result
    const revealTime = (spinDuration * 1000) + 200;
    setTimeout(() => {
      spinning = false;
      spinBtn.classList.remove('spinning');
      spinBtn.textContent = 'SPIN';

      document.querySelectorAll('.slot-item').forEach(item => item.classList.remove('active'));
      const allItems = reel.querySelectorAll('.slot-item');
      if (allItems[targetIndex]) {
        allItems[targetIndex].classList.add('active');
      }

      if (result) {
        result.innerHTML = `Play <a href="${winner.href}">${winner.name} &rarr;</a>`;
        setTimeout(() => result.classList.add('show'), 50);
      }
    }, revealTime);
  });
}

/* ---------- Golden Embers Canvas ---------- */
function initGoldenEmbers() {
  const canvas = document.getElementById('particle-canvas');
  if (!canvas) return;

  // Skip on extreme low-power / reduced motion
  if (prefersReducedMotion) {
    canvas.style.display = 'none';
    return;
  }

  const ctx = canvas.getContext('2d');
  let embers = [];

  // Fewer particles on mobile for performance
  const COUNT = isMobile ? 15 : 35;

  let animId;
  let isVisible = true;

  function resize() {
    // Use devicePixelRatio for crisp rendering but cap at 2x for perf
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    canvas.style.width = window.innerWidth + 'px';
    canvas.style.height = window.innerHeight + 'px';
    ctx.scale(dpr, dpr);
  }
  resize();

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(resize, 150);
  });

  // Pause canvas when tab not visible (save battery)
  document.addEventListener('visibilitychange', () => {
    isVisible = !document.hidden;
    if (isVisible && !animId) animate();
  });

  class Ember {
    constructor(init) {
      this.reset(init);
    }
    reset(init = false) {
      const w = window.innerWidth;
      const h = window.innerHeight;
      this.x = Math.random() * w;
      this.y = init ? Math.random() * h : h + 10;
      this.size = Math.random() * 2.5 + 0.8;
      this.vy = -(Math.random() * 0.5 + 0.1);
      this.vx = (Math.random() - 0.5) * 0.15;
      this.wobble = Math.random() * 0.015 + 0.003;
      this.wobbleOff = Math.random() * Math.PI * 2;
      this.life = 0;
      this.maxLife = Math.random() * 700 + 400;
      this.blur = isMobile ? Math.random() * 2 + 1.5 : Math.random() * 3 + 2;
      const golds = [
        { r: 201, g: 168, b: 76 },
        { r: 223, g: 192, b: 110 },
        { r: 240, g: 216, b: 142 },
      ];
      this.color = golds[Math.floor(Math.random() * 3)];
    }
    update() {
      this.life++;
      this.y += this.vy;
      this.x += this.vx + Math.sin(this.life * this.wobble + this.wobbleOff) * 0.2;
      if (this.life > this.maxLife || this.y < -10) this.reset();
    }
    draw() {
      const fi = Math.min(this.life / 80, 1);
      const fo = Math.max(1 - this.life / this.maxLife, 0);
      const a = fi * fo * 0.5;
      if (a <= 0) return;
      const { r, g, b } = this.color;

      // On mobile, skip the outermost (largest) glow ring for perf
      if (!isMobile) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size * this.blur, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${r},${g},${b},${a * 0.06})`;
        ctx.fill();
      }

      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size * 1.5, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${r},${g},${b},${a * 0.18})`;
      ctx.fill();

      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${r},${g},${b},${a * 0.6})`;
      ctx.fill();
    }
  }

  for (let i = 0; i < COUNT; i++) embers.push(new Ember(true));

  function animate() {
    if (!isVisible) { animId = null; return; }
    const w = window.innerWidth;
    const h = window.innerHeight;
    ctx.clearRect(0, 0, w, h);
    embers.forEach(e => { e.update(); e.draw(); });
    animId = requestAnimationFrame(animate);
  }
  animate();
}
