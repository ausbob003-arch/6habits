/* ============================================================
   つづける — 習慣の果実  Main JS
   ============================================================ */

/* ── Magical Particles Canvas ── */
(function () {
  const canvas = document.getElementById('magic-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W, H, particles = [];

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const COLORS = [
    'rgba(29,185,84,',   // emerald
    'rgba(212,160,23,',  // gold
    'rgba(124,58,237,',  // purple
    'rgba(236,72,153,',  // pink
    'rgba(45,200,120,',  // light green
    'rgba(251,191,36,',  // amber
  ];

  class Particle {
    constructor() { this.reset(true); }

    reset(init) {
      this.x   = Math.random() * W;
      this.y   = init ? Math.random() * H : H + 10;
      this.r   = Math.random() * 2.5 + 0.5;
      this.vx  = (Math.random() - 0.5) * 0.4;
      this.vy  = -(Math.random() * 0.8 + 0.2);
      this.col = COLORS[Math.floor(Math.random() * COLORS.length)];
      this.a   = Math.random() * 0.5 + 0.1;
      this.life = 0;
      this.maxLife = Math.random() * 300 + 200;
      // Some particles twinkle
      this.twinkle = Math.random() < 0.3;
      this.phase   = Math.random() * Math.PI * 2;
    }

    update() {
      this.x   += this.vx;
      this.y   += this.vy;
      this.life++;
      if (this.life > this.maxLife || this.y < -20) this.reset(false);
    }

    draw() {
      const progress = this.life / this.maxLife;
      let alpha = this.a;
      if (progress < 0.1)       alpha *= progress / 0.1;
      else if (progress > 0.7)  alpha *= (1 - progress) / 0.3;
      if (this.twinkle) alpha *= 0.5 + 0.5 * Math.sin(this.phase + this.life * 0.08);

      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = this.col + alpha + ')';
      ctx.fill();

      // glow
      const g = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.r * 4);
      g.addColorStop(0, this.col + alpha * 0.3 + ')');
      g.addColorStop(1, this.col + '0)');
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r * 4, 0, Math.PI * 2);
      ctx.fillStyle = g;
      ctx.fill();
    }
  }

  // 静的な星（奥行き感）
  class Star {
    constructor() {
      this.x = Math.random() * W;
      this.y = Math.random() * H;
      this.r = Math.random() * 1.2 + 0.2;
      this.a = Math.random() * 0.4 + 0.05;
      this.phase = Math.random() * Math.PI * 2;
      this.speed = Math.random() * 0.02 + 0.005;
    }
    draw(t) {
      const a = this.a * (0.6 + 0.4 * Math.sin(this.phase + t * this.speed));
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(200,230,210,${a})`;
      ctx.fill();
    }
  }

  for (let i = 0; i < 80; i++)  particles.push(new Particle());
  const stars = Array.from({ length: 120 }, () => new Star());

  let t = 0;
  function loop() {
    ctx.clearRect(0, 0, W, H);
    t++;

    stars.forEach(s => s.draw(t));

    // Spawn new particles randomly
    if (Math.random() < 0.5) {
      const p = particles.find(p => p.life === 0);
      if (p) { p.reset(false); p.y = H; }
    }

    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(loop);
  }
  loop();
})();


/* ── Navigation scroll effect ── */
(function () {
  const nav = document.querySelector('.nav');
  if (!nav) return;
  function onScroll() {
    if (window.scrollY > 60) nav.classList.add('scrolled');
    else nav.classList.remove('scrolled');
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();


/* ── Hamburger menu ── */
(function () {
  const btn   = document.querySelector('.hamburger');
  const links = document.querySelector('.nav-links');
  if (!btn || !links) return;

  btn.addEventListener('click', () => {
    btn.classList.toggle('open');
    links.classList.toggle('open');
    document.body.style.overflow = links.classList.contains('open') ? 'hidden' : '';
  });

  links.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      btn.classList.remove('open');
      links.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
})();


/* ── Scroll reveal ── */
(function () {
  const els = document.querySelectorAll('.reveal');
  if (!els.length) return;

  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  els.forEach(el => obs.observe(el));
})();


/* ── Smooth phone floating ── */
(function () {
  const phones = document.querySelectorAll('.phone-main, .feature-phone, .book-phone');
  phones.forEach((el, i) => {
    el.style.animation = `float ${3.5 + i * 0.4}s ease-in-out ${i * 0.6}s infinite`;
  });
})();


/* ── Magical cursor trail ── */
(function () {
  if (window.matchMedia('(hover: none)').matches) return; // skip touch

  const TRAIL_COUNT = 12;
  const dots = Array.from({ length: TRAIL_COUNT }, () => {
    const d = document.createElement('div');
    d.style.cssText = `
      position: fixed; pointer-events: none; z-index: 9999;
      width: 6px; height: 6px; border-radius: 50%;
      background: radial-gradient(circle, rgba(212,160,23,0.8), transparent);
      transform: translate(-50%,-50%);
      transition: opacity 0.3s;
      filter: blur(1px);
    `;
    document.body.appendChild(d);
    return { el: d, x: 0, y: 0 };
  });

  let mx = 0, my = 0;
  window.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });

  function animTrail() {
    dots[0].x += (mx - dots[0].x) * 0.3;
    dots[0].y += (my - dots[0].y) * 0.3;

    for (let i = 1; i < TRAIL_COUNT; i++) {
      dots[i].x += (dots[i-1].x - dots[i].x) * 0.35;
      dots[i].y += (dots[i-1].y - dots[i].y) * 0.35;
    }

    dots.forEach((d, i) => {
      const scale = 1 - i / TRAIL_COUNT;
      const alpha = (1 - i / TRAIL_COUNT) * 0.6;
      d.el.style.left    = d.x + 'px';
      d.el.style.top     = d.y + 'px';
      d.el.style.width   = (scale * 8) + 'px';
      d.el.style.height  = (scale * 8) + 'px';
      d.el.style.opacity = alpha;
    });

    requestAnimationFrame(animTrail);
  }
  animTrail();
})();
