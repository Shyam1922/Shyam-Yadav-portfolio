(() => {
  const root = document.documentElement;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const css = (name) => getComputedStyle(root).getPropertyValue(name).trim();

  /* ---------- Year ---------- */
  document.getElementById('year').textContent = new Date().getFullYear();

  /* ---------- Theme toggle ---------- */
  document.getElementById('themeBtn').addEventListener('click', () => {
    const next = root.dataset.theme === 'light' ? 'dark' : 'light';
    root.dataset.theme = next;
    try { localStorage.setItem('theme', next); } catch (e) {}
    sphere.recolor();
  });

  /* ---------- Mobile menu ---------- */
  const nav = document.getElementById('nav');
  const menuBtn = document.getElementById('menuBtn');
  const setMenu = (open) => {
    nav.classList.toggle('open', open);
    menuBtn.setAttribute('aria-expanded', String(open));
    menuBtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    document.body.style.overflow = open ? 'hidden' : '';
  };
  menuBtn.addEventListener('click', () => setMenu(!nav.classList.contains('open')));
  document.querySelectorAll('[data-link]').forEach((a) => a.addEventListener('click', () => setMenu(false)));
  window.addEventListener('keydown', (e) => { if (e.key === 'Escape') setMenu(false); });

  /* ---------- Reveal on scroll ---------- */
  const revealObs = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      entry.target.querySelectorAll('[data-count]').forEach(countUp);
      if (entry.target.matches('[data-count]')) countUp(entry.target);
      revealObs.unobserve(entry.target);
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
  document.querySelectorAll('.reveal').forEach((el) => revealObs.observe(el));

  /* ---------- Count-up numbers ---------- */
  function countUp(el) {
    const target = parseFloat(el.dataset.count);
    const decimals = parseInt(el.dataset.decimals || '0', 10);
    const suffix = el.dataset.suffix || '';
    if (reduceMotion || Number.isNaN(target)) return;
    const start = performance.now();
    const dur = 1600;
    const tick = (now) => {
      const p = Math.min((now - start) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 4);
      el.textContent = (target * eased).toFixed(decimals) + (p === 1 ? suffix : '');
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }

  /* ---------- Active nav link ---------- */
  const links = [...document.querySelectorAll('.nav__links a')];
  const sections = links.map((a) => document.querySelector(a.getAttribute('href')));
  const navObs = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      links.forEach((a) => a.classList.toggle('active', a.getAttribute('href') === '#' + entry.target.id));
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  sections.forEach((s) => s && navObs.observe(s));

  /* ---------- Scrambling role word ---------- */
  const roleEl = document.getElementById('roleWord');
  const roles = ['Developer', 'Data Modeller', 'Builder', 'Designer'];
  const glyphs = 'アイウエオカキクケコ01ABXYZ#%&*+<>/';
  let roleIndex = 0;

  function scrambleTo(word) {
    const from = roleEl.textContent;
    const len = Math.max(from.length, word.length);
    const queue = [];
    for (let i = 0; i < len; i++) {
      const start = Math.floor(Math.random() * 12);
      queue.push({ from: from[i] || '', to: word[i] || '', start, end: start + 10 + Math.floor(Math.random() * 14) });
    }
    let frame = 0;
    const step = () => {
      let out = '';
      let done = 0;
      queue.forEach((q) => {
        if (frame >= q.end) { done++; out += q.to; }
        else if (frame >= q.start) { out += `<span class="ch">${glyphs[Math.floor(Math.random() * glyphs.length)]}</span>`; }
        else out += q.from;
      });
      roleEl.innerHTML = out;
      frame++;
      if (done < queue.length) requestAnimationFrame(step);
      else roleEl.setAttribute('aria-label', word);
    };
    step();
  }
  if (!reduceMotion) {
    setInterval(() => {
      if (document.hidden) return;
      roleIndex = (roleIndex + 1) % roles.length;
      scrambleTo(roles[roleIndex]);
    }, 3200);
  }

  /* ---------- Hero sphere (dot cloud, mouse reactive) ---------- */
  const sphere = (() => {
    const canvas = document.getElementById('sphere');
    const ctx = canvas.getContext('2d');
    const COUNT = 900;
    let w = 0, h = 0, dpr = 1, r = 0, cx = 0, cy = 0;
    let rotY = 0, rotX = 0.35, targetTiltX = 0.35, targetTiltY = 0, tiltY = 0;
    let colA = '#5ef0c3', colB = '#3bc8f2', faint = '#5c6570';
    let visible = true;

    // Fibonacci sphere for an even spread of points
    const pts = [];
    const golden = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < COUNT; i++) {
      const y = 1 - (i / (COUNT - 1)) * 2;
      const rad = Math.sqrt(1 - y * y);
      const t = golden * i;
      pts.push({ x: Math.cos(t) * rad, y, z: Math.sin(t) * rad, seed: Math.random() * Math.PI * 2 });
    }

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth; h = canvas.clientHeight;
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const mobile = w < 720;
      r = mobile ? Math.min(w, h) * 0.42 : Math.min(w * 0.3, h * 0.42);
      cx = mobile ? w * 0.5 : w * 0.7;
      cy = mobile ? h * 0.32 : h * 0.5;
    }

    function recolor() {
      colA = css('--accent'); colB = css('--accent-2'); faint = css('--faint');
      if (reduceMotion) draw(0);
    }

    function draw(time) {
      ctx.clearRect(0, 0, w, h);
      const sinY = Math.sin(rotY + tiltY), cosY = Math.cos(rotY + tiltY);
      const sinX = Math.sin(rotX), cosX = Math.cos(rotX);
      const wobble = time * 0.0012;

      for (const p of pts) {
        // gentle breathing displacement
        const k = 1 + Math.sin(wobble + p.seed + p.y * 3) * 0.035;
        let x = p.x * k, y = p.y * k, z = p.z * k;
        const x1 = x * cosY - z * sinY;
        const z1 = x * sinY + z * cosY;
        const y1 = y * cosX - z1 * sinX;
        const z2 = y * sinX + z1 * cosX;
        const depth = (z2 + 1) / 2; // 0 back → 1 front
        const scale = 0.75 + depth * 0.35;
        const sx = cx + x1 * r * scale;
        const sy = cy + y1 * r * scale;
        ctx.globalAlpha = 0.08 + depth * 0.8;
        ctx.fillStyle = depth > 0.55 ? (p.y > 0 ? colA : colB) : faint;
        const size = 0.6 + depth * 1.6;
        ctx.fillRect(sx - size / 2, sy - size / 2, size, size);
      }
      ctx.globalAlpha = 1;
    }

    function loop(time) {
      if (visible) {
        rotY += 0.0018;
        rotX += (targetTiltX - rotX) * 0.04;
        tiltY += (targetTiltY - tiltY) * 0.04;
        draw(time);
      }
      requestAnimationFrame(loop);
    }

    window.addEventListener('pointermove', (e) => {
      targetTiltX = 0.35 + (e.clientY / window.innerHeight - 0.5) * 0.5;
      targetTiltY = (e.clientX / window.innerWidth - 0.5) * 0.8;
    }, { passive: true });
    window.addEventListener('resize', () => { resize(); if (reduceMotion) draw(0); });
    new IntersectionObserver(([e]) => { visible = e.isIntersecting; }).observe(canvas);

    resize();
    recolor();
    if (reduceMotion) draw(0); else requestAnimationFrame(loop);
    return { recolor };
  })();

  /* ---------- Contact form → opens the visitor's email app ---------- */
  document.getElementById('contactForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const f = e.target;
    const to = document.getElementById('emailLink').getAttribute('href').replace('mailto:', '');
    const subject = encodeURIComponent(`Portfolio enquiry from ${f.name.value}`);
    const body = encodeURIComponent(`${f.message.value}\n\n— ${f.name.value} (${f.email.value})`);
    window.location.href = `mailto:${to}?subject=${subject}&body=${body}`;
  });
})();
