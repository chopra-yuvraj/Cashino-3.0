/* ============================================
   CASHINO 3.0 — Ultra-Premium JavaScript
   Slot Machine · Golden Embers · Magnetic FX
   ============================================ */

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
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 40);
    }, { passive: true });
  }

  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      navLinks.classList.toggle('open');
    });
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navLinks.classList.remove('open');
      });
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
        setTimeout(() => entry.target.classList.add('visible'), parseInt(d));
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
      s.style.animationDelay = `${0.3 + idx * 0.07}s`;
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

  const ITEM_HEIGHT = 120;

  // Build reel: repeat games 6 times for long scrolling
  function buildReel() {
    reel.innerHTML = '';
    for (let cycle = 0; cycle < 6; cycle++) {
      games.forEach(g => {
        const div = document.createElement('div');
        div.className = 'slot-item';
        div.textContent = g.name;
        reel.appendChild(div);
      });
    }
  }
  buildReel();

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

    // Pick random winner
    const winIndex = Math.floor(Math.random() * games.length);
    const winner = games[winIndex];

    // Target position: land on cycle 4 + winIndex
    const targetIndex = (4 * games.length) + winIndex;
    const targetOffset = -(targetIndex * ITEM_HEIGHT) + (0); // center in window

    // Reset position
    reel.style.transition = 'none';
    reel.style.transform = 'translateY(0)';
    reel.offsetHeight; // force reflow

    // Animate with CSS
    reel.style.transition = `transform 4s cubic-bezier(0.15, 0.85, 0.25, 1)`;
    reel.style.transform = `translateY(${targetOffset}px)`;

    // Apply blur during spin
    reel.style.filter = 'blur(2px)';
    setTimeout(() => {
      reel.style.filter = 'blur(1px)';
    }, 2500);
    setTimeout(() => {
      reel.style.filter = 'blur(0)';
    }, 3600);

    // Highlight winner + show result
    setTimeout(() => {
      spinning = false;
      spinBtn.classList.remove('spinning');
      spinBtn.textContent = 'SPIN';

      // Highlight active item
      document.querySelectorAll('.slot-item').forEach(item => item.classList.remove('active'));
      const allItems = reel.querySelectorAll('.slot-item');
      if (allItems[targetIndex]) {
        allItems[targetIndex].classList.add('active');
      }

      // Show result link
      if (result) {
        result.innerHTML = `Play <a href="${winner.href}">${winner.name} &rarr;</a>`;
        setTimeout(() => result.classList.add('show'), 50);
      }
    }, 4200);
  });
}

/* ---------- Golden Embers Canvas ---------- */
function initGoldenEmbers() {
  const canvas = document.getElementById('particle-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let embers = [];
  const COUNT = 35;

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  class Ember {
    constructor(init) {
      this.reset(init);
    }
    reset(init = false) {
      this.x = Math.random() * canvas.width;
      this.y = init ? Math.random() * canvas.height : canvas.height + 10;
      this.size = Math.random() * 2.5 + 0.8;
      this.vy = -(Math.random() * 0.5 + 0.1);
      this.vx = (Math.random() - 0.5) * 0.15;
      this.wobble = Math.random() * 0.015 + 0.003;
      this.wobbleAmp = Math.random() * 20 + 8;
      this.wobbleOff = Math.random() * Math.PI * 2;
      this.life = 0;
      this.maxLife = Math.random() * 700 + 400;
      this.blur = Math.random() * 3 + 2;
      const golds = [
        { r: 201, g: 168, b: 76 },
        { r: 223, g: 192, b: 110 },
        { r: 240, g: 216, b: 142 },
      ];
      const idx = Math.random() < 0.92 ? Math.floor(Math.random() * 3) : 0;
      this.color = golds[idx];
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

      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size * this.blur, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${r},${g},${b},${a * 0.06})`;
      ctx.fill();

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

  (function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    embers.forEach(e => { e.update(); e.draw(); });
    requestAnimationFrame(animate);
  })();
}
