/* RoApp info site. Everything is simulated in the browser. There is no network code, no accounts and no storage. */
(() => {
  const $ = (s, r = document) => r.querySelector(s); const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  /* animated space background */
  const cv = $('#sky'); if (cv) {
    const c = cv.getContext('2d'); let W; let H; let stars = []; let shoot = null;
    const size = () => { W = cv.width = innerWidth; H = cv.height = innerHeight; stars = Array.from({ length: Math.round(W * H / 9000) }, () => ({ x: Math.random() * W, y: Math.random() * H, z: Math.random() * 1.6 + .3, p: Math.random() * 6 })); };
    size(); addEventListener('resize', size);
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const frame = (t) => {
      c.clearRect(0, 0, W, H);
      const g1 = c.createRadialGradient(W * .2, H * .1, 0, W * .2, H * .1, W * .6); g1.addColorStop(0, 'rgba(255,122,89,.16)'); g1.addColorStop(1, 'transparent'); c.fillStyle = g1; c.fillRect(0, 0, W, H);
      const g2 = c.createRadialGradient(W * .85, H * .7, 0, W * .85, H * .7, W * .6); g2.addColorStop(0, 'rgba(193,53,132,.16)'); g2.addColorStop(1, 'transparent'); c.fillStyle = g2; c.fillRect(0, 0, W, H);
      stars.forEach((s) => { const a = .35 + .55 * Math.abs(Math.sin(t / 1100 + s.p)); c.fillStyle = `rgba(255,255,255,${a})`; c.beginPath(); c.arc(s.x, (s.y + (reduce ? 0 : t * .004 * s.z)) % H, s.z * .7, 0, 7); c.fill(); });
      if (!reduce) { if (!shoot && Math.random() < .004) shoot = { x: Math.random() * W, y: Math.random() * H * .4, l: 0 }; if (shoot) { shoot.l += 9; shoot.x += 9; shoot.y += 5; c.strokeStyle = 'rgba(255,200,170,.8)'; c.lineWidth = 2; c.beginPath(); c.moveTo(shoot.x, shoot.y); c.lineTo(shoot.x - 70, shoot.y - 38); c.stroke(); if (shoot.l > 260) shoot = null; } requestAnimationFrame(frame); }
    };
    requestAnimationFrame(frame);
  }
  /* reveal on scroll */
  const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: .12 });
  $$('.reveal').forEach((el) => io.observe(el));
  const root = document.documentElement;
  const setAccent = (a, b) => { const rgb = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16)).join(','); root.style.setProperty('--g1', a); root.style.setProperty('--g2', b); root.style.setProperty('--g1rgb', rgb(a)); root.style.setProperty('--g2rgb', rgb(b)); };

  /* 1. Look studio simulation (nothing is saved, a reload resets it) */
  const look = $('#simLook'); if (look) {
    const SW = [['#ff7a59', '#c13584'], ['#4facfe', '#00f2fe'], ['#a18cd1', '#fbc2eb'], ['#43e97b', '#38f9d7'], ['#f6d365', '#fda085']];
    $('#swatches').innerHTML = SW.map((p, i) => `<button class="sw ${i ? '' : 'on'}" style="background:linear-gradient(135deg,${p[0]},${p[1]})" data-i="${i}" aria-label="Accent ${i + 1}"></button>`).join('');
    $$('#swatches .sw').forEach((b) => b.onclick = () => { $$('#swatches .sw').forEach((x) => x.classList.remove('on')); b.classList.add('on'); setAccent(...SW[+b.dataset.i]); });
    const pv = $('#lookPrev'); const glow = $('#glowR'); glow.oninput = () => { const v = glow.value / 100; pv.style.boxShadow = `0 0 ${10 + v * 50}px rgba(var(--g1rgb),${.15 + v * .6})`; pv.querySelector('h4').style.textShadow = `0 0 ${v * 24}px rgba(var(--g1rgb),${v})`; }; glow.oninput();
    $$('[data-bgm]').forEach((b) => b.onclick = () => { $$('[data-bgm]').forEach((x) => x.classList.remove('on')); b.classList.add('on'); pv.dataset.bg = b.dataset.bgm; pv.style.background = { aurora: 'linear-gradient(120deg,rgba(var(--g1rgb),.5),rgba(var(--g2rgb),.5),rgba(80,200,255,.35))', space: 'radial-gradient(circle at 30% 20%,rgba(var(--g2rgb),.45),#05060b 70%)', solid: 'var(--panel2)' }[b.dataset.bgm]; pv.style.backgroundSize = '200% 200%'; pv.style.animation = b.dataset.bgm === 'solid' ? 'none' : 'drift 8s ease-in-out infinite alternate'; });
    $$('[data-fill]').forEach((b) => b.onclick = () => { $$('[data-fill]').forEach((x) => x.classList.remove('on')); b.classList.add('on'); $$('#lookPrev .btn').forEach((x) => { x.style.background = b.dataset.fill === 'grad' ? '' : b.dataset.fill === 'glass' ? 'rgba(255,255,255,.12)' : 'transparent'; x.style.border = b.dataset.fill === 'outline' ? '2px solid var(--g1)' : '0'; }); });
    $('#lookReset').onclick = () => { setAccent('#ff7a59', '#c13584'); $$('#swatches .sw').forEach((x, i) => x.classList.toggle('on', !i)); glow.value = 60; glow.oninput(); };
    const st = document.createElement('style'); st.textContent = '@keyframes drift{to{background-position:100% 100%}}'; document.head.append(st);
  }

  /* 2. Editor preview */
  const ed = $('#simEdit'); if (ed) {
    const tl = $('#tl'); tl.innerHTML = Array.from({ length: 24 }, () => '<i></i>').join('') + '<div class="dim" data-a></div><div class="dim" data-b></div><div class="ph"></div>';
    const ph = $('.ph', tl); const dA = $('[data-a]', tl); const dB = $('[data-b]', tl); const tm = $('#tTime'); let pos = .1; let a = 0; let b = 1; let play = false; const LEN = 24;
    const draw = () => { ph.style.left = pos * 100 + '%'; dA.style.cssText = `left:0;width:${a * 100}%`; dB.style.cssText = `right:0;width:${(1 - b) * 100}%`; const s = Math.round(pos * LEN); tm.textContent = `0:${String(s).padStart(2, '0')} / 0:${LEN}`; };
    const seek = (e) => { const r = tl.getBoundingClientRect(); pos = Math.max(0, Math.min(1, (e.clientX - r.left) / r.width)); draw(); };
    let drag = false; tl.onpointerdown = (e) => { drag = true; seek(e); }; addEventListener('pointermove', (e) => { if (drag) seek(e); }); addEventListener('pointerup', () => { drag = false; });
    $('#trimA').oninput = (e) => { a = Math.min(+e.target.value / 100, b - .1); draw(); }; $('#trimB').oninput = (e) => { b = Math.max(+e.target.value / 100, a + .1); draw(); };
    setInterval(() => { if (!play) return; pos += .01; if (pos > b) pos = a; if (pos < a) pos = a; draw(); }, 100);
    $('#tPlay').onclick = (e) => { play = !play; e.target.textContent = play ? '⏸ Pause' : '▶ Play'; };
    const vid = $('#vidPrev'); const FX = { none: '', warm: 'sepia(.5) saturate(1.5)', cool: 'hue-rotate(160deg) saturate(1.2)', mono: 'grayscale(1) contrast(1.1)', pop: 'saturate(2.2) contrast(1.15)' };
    $$('[data-fx]').forEach((x) => x.onclick = () => { $$('[data-fx]').forEach((y) => y.classList.remove('on')); x.classList.add('on'); vid.style.filter = FX[x.dataset.fx]; });
    const mb = (res) => { const w = Math.round(res * 16 / 9); return (w * res * 30 * .07 / 8 / 1e6 * ((b - a) * LEN)).toFixed(1); };
    let res = 720; const showMb = () => { $('#mb').textContent = `${res}p · about ${mb(res)} MB`; }; $$('[data-res]').forEach((x) => x.onclick = () => { $$('[data-res]').forEach((y) => y.classList.remove('on')); x.classList.add('on'); res = +x.dataset.res; showMb(); }); $$('#trimA,#trimB').forEach((x) => x.addEventListener('input', showMb)); showMb();
    $('#capT').onchange = (e) => { $('.cap', vid).style.display = e.target.checked ? '' : 'none'; };
    draw();
  }

  /* 3. Channel */
  const ch = $('#simCh'); if (ch) {
    let subs = 1204; const sb = $('#subBtn'); let on = false;
    sb.onclick = () => { on = !on; subs += on ? 1 : -1; sb.textContent = on ? '✓ Subscribed' : 'Subscribe'; sb.classList.toggle('ghost', on); $('#subN').textContent = subs.toLocaleString() + ' subscribers'; };
    const TABS = { Videos: '🎬 Sunset timelapse · 🎬 Studio tour · 🎬 Drawing speedrun', Shorts: '📱 5 tips in 15s · 📱 Quick recipe · 📱 Cat vs box', About: 'Hi! I make chill videos about art and tech. New uploads every week.' };
    const show = (k) => { $$('[data-tab]').forEach((x) => x.classList.toggle('on', x.dataset.tab === k)); $('#tabBody').textContent = TABS[k]; }; $$('[data-tab]').forEach((x) => x.onclick = () => show(x.dataset.tab)); show('Videos');
  }

  /* 4. Chat + groups */
  const chat = $('#simChat'); if (chat) {
    const box = $('#msgs'); const add = (who, txt, me) => { const d = document.createElement('div'); d.className = 'm' + (me ? ' me' : ''); d.innerHTML = `<small>${who}</small>`; const p = document.createElement('span'); p.textContent = txt; p.innerHTML = p.innerHTML.replace(/@(\w+)/g, '<span class="mn">@$1</span>'); d.append(p); box.append(d); box.scrollTop = box.scrollHeight; };
    add('Mia 👑', 'Welcome to the group! Say hi 👋'); add('Leo', 'Hey everyone. New video tonight?');
    const REPL = ['Nice one! 🔥', 'Haha same 😂', 'Count me in!', 'Love it ✨']; let n = 0;
    const send = () => { const i = $('#cmsg'); const v = i.value.trim(); if (!v) return; i.value = ''; add('You', v, true); setTimeout(() => add(n % 2 ? 'Leo' : 'Mia 👑', (/@you/i.test(v) ? '' : '') + REPL[n++ % REPL.length]), 700); };
    $('#csend').onclick = send; $('#cmsg').onkeydown = (e) => { if (e.key === 'Enter') send(); };
    $$('[data-ins]').forEach((x) => x.onclick = () => { $('#cmsg').value += x.dataset.ins; $('#cmsg').focus(); });
  }

  /* 5. Pop it */
  const pop = $('#simPop'); if (pop) {
    pop.innerHTML = Array.from({ length: 36 }, () => '<button class="pb" aria-label="bubble"></button>').join(''); let n = 0; let ac;
    const snd = (f) => { try { ac = ac || new (window.AudioContext || window.webkitAudioContext)(); const o = ac.createOscillator(); const g = ac.createGain(); o.frequency.value = f; g.gain.setValueAtTime(.15, ac.currentTime); g.gain.exponentialRampToValueAtTime(.001, ac.currentTime + .12); o.connect(g); g.connect(ac.destination); o.start(); o.stop(ac.currentTime + .13); } catch { /* ignore */ } };
    $$('.pb', pop).forEach((b, i) => b.onpointerdown = () => { if (b.classList.contains('in')) return; b.classList.add('in'); n++; $('#popN').textContent = n; snd(380 + (i % 6) * 70); if (n === 36) $('#popN').textContent = '36 🎉'; });
    $('#popReset').onclick = () => { n = 0; $('#popN').textContent = 0; $$('.pb', pop).forEach((b) => b.classList.remove('in')); };
  }
})();
