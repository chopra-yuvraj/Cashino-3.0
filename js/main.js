/* ============================================
   CASHINO 3.0 — Premium Casino JavaScript
   Golden Embers · 3D Tilt · Hero Reveal
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initAccordion();
  initFadeIn();
  initGoldenEmbers();
  initCardTilt();
  initHeroReveal();
});

/* ---------- Sticky Navbar + Hamburger ---------- */
function initNavbar() {
  const navbar = document.querySelector('.navbar');
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');

  if (navbar) {
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 50);
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
  const headers = document.querySelectorAll('.accordion-header');
  headers.forEach(header => {
    header.addEventListener('click', () => {
      const item = header.parentElement;
      const isOpen = item.classList.contains('active');

      document.querySelectorAll('.accordion-item').forEach(i => i.classList.remove('active'));

      if (!isOpen) item.classList.add('active');
    });
  });
}

/* ---------- Staggered Fade-in on Scroll ---------- */
function initFadeIn() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = entry.target.dataset.delay || 0;
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, parseInt(delay));
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });

  document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));
}

/* ---------- Hero Typographic Reveal ---------- */
function initHeroReveal() {
  const heroTitle = document.querySelector('.hero-title');
  if (!heroTitle || heroTitle.dataset.revealed) return;

  heroTitle.dataset.revealed = 'true';
  const text = heroTitle.textContent.trim();
  heroTitle.innerHTML = '';

  let charIndex = 0;
  text.split('').forEach((char) => {
    if (char === ' ') {
      const space = document.createElement('span');
      space.className = 'space';
      space.innerHTML = '&nbsp;';
      heroTitle.appendChild(space);
    } else {
      const span = document.createElement('span');
      span.className = 'char';
      span.textContent = char;
      span.style.animationDelay = `${0.4 + charIndex * 0.06}s`;
      heroTitle.appendChild(span);
      charIndex++;
    }
  });
}

/* ---------- 3D Tilt on Game Cards ---------- */
function initCardTilt() {
  const cards = document.querySelectorAll('.game-card');

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -8;
      const rotateY = ((x - centerX) / centerX) * 8;

      card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(800px) rotateX(0) rotateY(0) scale(1)';
      card.style.transition = 'transform 0.5s cubic-bezier(0.22, 1, 0.36, 1)';
      setTimeout(() => { card.style.transition = ''; }, 500);
    });

    card.addEventListener('mouseenter', () => {
      card.style.transition = 'none';
    });
  });
}

/* ---------- Golden Embers Canvas ---------- */
function initGoldenEmbers() {
  const canvas = document.getElementById('particle-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let embers = [];
  const EMBER_COUNT = 45;

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  class Ember {
    constructor() {
      this.reset(true);
    }

    reset(initial = false) {
      this.x = Math.random() * canvas.width;
      this.y = initial ? Math.random() * canvas.height : canvas.height + 20;
      this.size = Math.random() * 3 + 1;
      this.speedY = -(Math.random() * 0.6 + 0.15);
      this.speedX = (Math.random() - 0.5) * 0.25;
      this.wobbleSpeed = Math.random() * 0.02 + 0.005;
      this.wobbleAmp = Math.random() * 30 + 10;
      this.wobbleOffset = Math.random() * Math.PI * 2;
      this.life = 0;
      this.maxLife = Math.random() * 600 + 300;
      this.blur = Math.random() * 4 + 2;

      // Gold tones
      const golds = [
        { r: 212, g: 168, b: 67 },  // --gold
        { r: 232, g: 197, b: 104 }, // --gold-light
        { r: 240, g: 214, b: 138 }, // --gold-bright
        { r: 201, g: 36, b: 63 },   // --crimson (rare)
      ];
      const colorIdx = Math.random() < 0.88 ? Math.floor(Math.random() * 3) : 3;
      this.color = golds[colorIdx];
    }

    update() {
      this.life++;
      this.y += this.speedY;
      this.x += this.speedX + Math.sin(this.life * this.wobbleSpeed + this.wobbleOffset) * 0.3;

      if (this.life > this.maxLife || this.y < -20) {
        this.reset();
      }
    }

    draw() {
      const fadeIn = Math.min(this.life / 60, 1);
      const fadeOut = Math.max(1 - (this.life / this.maxLife), 0);
      const alpha = fadeIn * fadeOut * 0.6;

      if (alpha <= 0) return;

      const { r, g, b } = this.color;

      // Outer glow (bokeh)
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size * this.blur, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${r},${g},${b},${alpha * 0.08})`;
      ctx.fill();

      // Mid glow
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size * 2, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${r},${g},${b},${alpha * 0.2})`;
      ctx.fill();

      // Core
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${r},${g},${b},${alpha * 0.7})`;
      ctx.fill();
    }
  }

  for (let i = 0; i < EMBER_COUNT; i++) {
    embers.push(new Ember());
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    embers.forEach(e => { e.update(); e.draw(); });
    requestAnimationFrame(animate);
  }
  animate();
}
