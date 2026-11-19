/* UPDATE NOTICES
   1) First visit: UPDATE REQUIRED (announcement) -> UPDATE NOW -> loading -> done.
   2) EVERY WEEK the vault is closed from Wednesday 22:00 to Thursday 04:00 (Morocco time):
        - during the night the visitor sees "Site under repairs" with UPDATE NOW, installs the update,
          then sees "THE VAULT IS CLOSED UNTIL 04:00";
        - at 04:00 the page opens the site by itself (no second update is needed);
        - a visitor who did NOT update at night gets UPDATE NOW when the vault opens.
   Change the numbers just below to change the days / hours / loading time. */
(function () {
  try { console.info('FREAK build night3: vault closed Wed 22:00 -> Thu 04:00 (Morocco time)'); } catch (_) {}
  /* EVERY NEW MANUAL UPDATE: change UPDATE_VERSION (e.g. '1.1.3'); everybody sees the first notice again. */
  const UPDATE_VERSION = '1.1.2';
  const UPDATE_MINUTES = 2;
  const CLOSE_DAY = 3, CLOSE_HOUR = 22;   /* 0=Sun 1=Mon 2=Tue 3=Wed 4=Thu 5=Fri 6=Sat -> closes Wednesday 22:00 */
  const OPEN_DAY = 4, OPEN_HOUR = 4;      /* -> opens Thursday 04:00 */
  const TZ = 'Africa/Casablanca';
  const DURATION = UPDATE_MINUTES * 60 * 1000;
  const K_START = 'freak_update_start_' + UPDATE_VERSION, K_DONE = 'freak_update_done_' + UPDATE_VERSION, K_COMPLETE = 'freak_update_complete_' + UPDATE_VERSION;
  const K_CYCLE = 'freak_update_cycle';          /* the weekly cycle this browser has already updated for */
  const K_WSTART = 'freak_wupdate_start_';       /* + cycle id */

  /* localStorage can be blocked (private mode, some browsers): keep an in-memory copy so the timer still runs */
  const mem = {};
  const store = {
    get(k) { try { const v = localStorage.getItem(k); if (v !== null) return v; } catch (_) {} return k in mem ? mem[k] : null; },
    set(k, v) { mem[k] = v; try { localStorage.setItem(k, v); } catch (_) {} }
  };

  /* day of week / hour / date in Morocco time */
  function partsOf(ms) {
    try {
      const parts = new Intl.DateTimeFormat('en-US', { timeZone: TZ, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', hourCycle: 'h23', weekday: 'short' }).formatToParts(new Date(ms));
      const g = t => parts.find(x => x.type === t).value;
      return { dow: { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 }[g('weekday')], hour: +g('hour'), y: +g('year'), m: +g('month'), d: +g('day') };
    } catch (_) {
      const d = new Date(ms);
      return { dow: d.getDay(), hour: d.getHours(), y: d.getFullYear(), m: d.getMonth() + 1, d: d.getDate() };
    }
  }
  /* minutes since Sunday 00:00 (Morocco time), to compare moments inside the week */
  const slot = (dow, hour) => dow * 24 + hour;
  /* is the site closed right now? (Wednesday 22:00 -> Thursday 04:00) */
  function isClosed(ms) {
    const t = partsOf(ms), n = slot(t.dow, t.hour);
    return n >= slot(CLOSE_DAY, CLOSE_HOUR) && n < slot(OPEN_DAY, OPEN_HOUR);
  }
  /* id of the latest "Thursday 04:00" that has already passed (e.g. "2026-11-19") */
  function cycleId(ms) {
    const t = partsOf(ms);
    let since = (t.dow - OPEN_DAY + 7) % 7;
    if (since === 0 && t.hour < OPEN_HOUR) since = 7;
    return new Date(Date.UTC(t.y, t.m - 1, t.d - since)).toISOString().slice(0, 10);
  }

  /* id of the NEXT "Thursday 04:00" (the one that ends the current closed night) */
  function upcomingCycle(ms) {
    const t = partsOf(ms);
    const add = t.dow === OPEN_DAY && t.hour < OPEN_HOUR ? 0 : (OPEN_DAY - t.dow + 7) % 7 || 7;
    return new Date(Date.UTC(t.y, t.m - 1, t.d + add)).toISOString().slice(0, 10);
  }

  /* License page: after the update the version line becomes just "Version: 1.1.2" */
  function applyVersion() {
    /* hide every "(DEMO)" label (loader + welcome screen) once the update is complete */
    if (!document.getElementById('updHideDemo')) {
      const h = document.createElement('style'); h.id = 'updHideDemo';
      h.textContent = '#loader em,.demo-tag{display:none!important}';
      document.head.appendChild(h);
    }
    const pre = document.querySelector('#license pre');
    if (pre) pre.textContent = pre.textContent.replace(/Version:[^\n]*/, 'Version: ' + UPDATE_VERSION);
  }
  if (store.get(K_COMPLETE) === '1') applyVersion();

  const css = `
#upd{position:fixed;inset:0;z-index:2147483000;background:#080808;color:#f0efeb;display:flex;padding:24px;font-family:"Archivo",Helvetica,Arial,sans-serif;text-align:center;overflow:auto}
#upd .box{width:100%;max-width:560px;margin:auto}
#upd .picon{width:clamp(84px,20vw,112px);height:auto;display:block;margin:0 auto 30px}
#upd .tag{display:inline-block;border:1px solid rgba(240,239,235,.35);padding:6px 14px;font-size:11px;font-weight:700;letter-spacing:.28em;text-transform:uppercase;margin-bottom:28px}
#upd h1{font-size:clamp(34px,8vw,58px);line-height:.95;font-weight:900;letter-spacing:-.01em;text-transform:uppercase;margin:0 0 18px}
#upd p{font-size:14px;line-height:1.6;color:rgba(240,239,235,.68);margin:0 0 32px}
#upd button{appearance:none;border:0;cursor:pointer;background:#f0efeb;color:#080808;font:inherit;font-size:12px;font-weight:800;letter-spacing:.22em;text-transform:uppercase;padding:18px 40px;width:100%;transition:background .2s,transform .2s}
#upd button:hover{background:#fff;transform:translateY(-1px)}
#upd .bar{height:6px;background:rgba(240,239,235,.14);overflow:hidden;margin:6px 0 14px}
#upd .fill{height:100%;width:100%;background:#f0efeb;transform:scaleX(0);transform-origin:left center;will-change:transform;position:relative}
#upd .fill::after{content:"";position:absolute;inset:0;background:linear-gradient(90deg,transparent,rgba(110,110,110,.45),transparent);transform:translateX(-100%);animation:updsheen 1.7s ease-in-out infinite}
@keyframes updsheen{to{transform:translateX(100%)}}
#upd .bar.done .fill::after{animation:none;opacity:0}
#upd{animation:updfade .45s ease both}
@keyframes updfade{from{opacity:0}to{opacity:1}}
#upd.out{opacity:0;transition:opacity .35s ease;pointer-events:none}
#upd .box{animation:updin .65s cubic-bezier(.2,.8,.2,1) both}
@keyframes updin{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:none}}
#upd h1,#upd p{transition:opacity .25s ease}
#upd .fadein{animation:updin .6s cubic-bezier(.2,.8,.2,1) both}
#upd .ok{width:46px;height:46px;margin:0 auto 24px;display:block}
#upd .ok circle,#upd .ok path{fill:none;stroke:#f0efeb;stroke-width:3;stroke-linecap:round;stroke-linejoin:round}
#upd .ok circle{stroke-dasharray:145;stroke-dashoffset:145;animation:updd .7s ease forwards}
#upd .ok path{stroke-dasharray:42;stroke-dashoffset:42;animation:updd .45s .5s ease forwards}
@keyframes updd{to{stroke-dashoffset:0}}
#upd .row{display:flex;justify-content:space-between;font-size:12px;font-weight:700;letter-spacing:.18em;text-transform:uppercase;color:rgba(240,239,235,.75)}
#upd p b{color:#fff;font-weight:800}
#upd .sig{margin-top:6px;font-weight:700;color:#f0efeb}
#upd .warn{margin-top:26px;font-size:11px;letter-spacing:.16em;text-transform:uppercase;color:rgba(240,239,235,.45)}
#upd .spin{width:34px;height:34px;border:3px solid rgba(240,239,235,.2);border-top-color:#f0efeb;border-radius:50%;margin:0 auto 26px;animation:updspin 1s linear infinite}
@keyframes updspin{to{transform:rotate(360deg)}}
#upd .hint{font-size:11px;font-weight:800;letter-spacing:.28em;text-transform:uppercase;color:rgba(240,239,235,.5);margin:-14px 0 26px;animation:updbob 1.4s ease-in-out infinite}
@keyframes updbob{50%{transform:translateY(5px)}}
#upd .go{margin-top:34px;visibility:hidden;opacity:0;transition:opacity .5s}
#upd .go.on{visibility:visible;opacity:1}
#upd .why{margin-top:40px;padding-top:30px;border-top:1px solid rgba(240,239,235,.16);text-align:left}
#upd .why .k{font-size:11px;font-weight:800;letter-spacing:.28em;text-transform:uppercase;color:rgba(240,239,235,.5);margin:0 0 14px}
#upd .why h2,#upd .why h3,#upd .why p{max-width:none!important;width:100%}
#upd .why h3{text-transform:none!important;letter-spacing:0!important}
#upd .why h2{font-size:clamp(22px,5vw,30px);line-height:1.05;font-weight:900;text-transform:uppercase;margin:0 0 8px}
#upd .why h3{font-size:13px;font-weight:800;letter-spacing:.06em;margin:0 0 20px;color:#f0efeb}
#upd .why p{font-size:14px;line-height:1.7;color:rgba(240,239,235,.72);margin:0 0 16px;text-align:left}
#upd .why p b{color:#f0efeb;font-weight:700}
#upd .why .sig{margin-top:22px;font-weight:700;color:#f0efeb}
@media (prefers-reduced-motion:reduce){#upd,#upd .box,#upd .fadein,#upd .fill::after,#upd .spin{animation:none}}`;
  let st = null;
  function addStyle() {
    if (st) return;
    st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);
  }

  const WHY = `      <div class="why">
        <div class="k">Why updating?</div>
        <h2>Official Website Update, Version ${UPDATE_VERSION}</h2>
        <h3>An Important Announcement from the Website Owner</h3>
        <p>First, we want to explain why updating the website matters.</p>
        <p>The previous version was just a <b>DEMO version</b>, not the official release. It had technical problems, bugs, glitches, and unexpected errors that harmed the overall user experience.</p>
        <p>Our development team worked for about <b>16 hours</b> to restore and rewrite several CSS codes that had been accidentally deleted. This took a lot of effort to bring the website back to a stable state.</p>
        <p>Today, we are officially introducing <b>Version ${UPDATE_VERSION}</b>, which gives users access to the latest official version of our website.</p>
        <p>Our team now has the official release, and we have made the needed changes to improve website stability, fix current issues, and create a smoother experience.</p>
        <p><b>Our main goal is simple:</b> We want every user who visits our website to have a clean, stable, and reliable experience without disruptions, visual glitches, or unexpected errors.</p>
        <p>Thank you for your patience and support during this process.</p>
        <p class="sig">— Website Owner &amp; Development Team</p>
      </div>`;

  let ov = null, timer = null, raf = 0;
  const stopLoop = () => { clearInterval(timer); cancelAnimationFrame(raf); };
  const lock = on => {
    const keep = !on && document.getElementById('sch');       /* the terms screen is still open: keep the page locked */
    try { document.body.inert = on || !!keep; } catch (_) {}
    document.documentElement.style.overflow = (on || keep) ? 'hidden' : '';
  };
  function open() {
    addStyle();
    ov = document.createElement('div');
    ov.id = 'upd'; ov.setAttribute('role', 'dialog'); ov.setAttribute('aria-modal', 'true');
    document.documentElement.appendChild(ov);
    lock(true);
  }
  function close() {
    stopLoop();
    const o = ov; ov = null; lock(false);
    if (o) { o.classList.add('out'); setTimeout(() => o.remove(), 380); }   /* fades out instead of disappearing */
  }
  /* shows the button only when the visitor reached the end of the text */
  function revealAtEnd(wrap, hint) {
    let shown = false;
    function check() {
      if (shown || !ov) return;
      if (ov.scrollTop + ov.clientHeight >= ov.scrollHeight - 8) { shown = true; wrap.classList.add('on'); if (hint) hint.style.visibility = 'hidden'; }
    }
    ov.addEventListener('scroll', check, { passive: true });
    addEventListener('resize', check);
    setTimeout(check, 50);   /* short text / big screens: nothing to scroll, show the button right away */
  }

  /* ---------- 1) first visit ---------- */
  function showNotice() {
    ov.innerHTML = `<div class="box">
      <span class="tag">Demo version</span>
      <h1>Update required</h1>
      <p>This website is currently a DEMO. Read the announcement below, then scroll to the end to continue.</p>
      <div class="hint" id="updHint">Scroll down &darr;</div>
      ${WHY}
      <div class="go" id="updGoWrap"><button type="button" id="updGo">Update now</button></div></div>`;
    revealAtEnd(ov.querySelector('#updGoWrap'), ov.querySelector('#updHint'));
    ov.querySelector('#updGo').addEventListener('click', () => {
      store.set(K_START, String(Date.now()));
      showLoading(K_START, 'Installing the official version. Please keep this page open.', 'The official version is ready.', () => {
        store.set(K_COMPLETE, '1'); applyVersion();
      }, () => { store.set(K_DONE, '1'); store.set(K_CYCLE, cycleId(Date.now())); close(); });
    });
  }

  /* ---------- 2) every week: closed Wed 22:00 -> Thu 04:00 ---------- */
  const ON_FIRST_DONE = () => { store.set(K_COMPLETE, '1'); applyVersion(); };
  /* night, update not installed yet: "Site under repairs" + UPDATE NOW */
  function showClosed(up) {
    stopLoop();
    const key = K_WSTART + up;
    const run = () => {
      ov.dataset.mode = 'updating-window';
      showLoading(key, 'Installing the update. Please keep this page open.', 'The update is installed.', ON_FIRST_DONE, () => {
        store.set(K_DONE, '1'); store.set(K_CYCLE, up);
        if (isClosed(Date.now())) showVaultClosed(); else close();
      });
    };
    if (store.get(key)) { run(); return; }            /* update already running (page reloaded): resume */
    ov.dataset.mode = 'closed';
    ov.innerHTML = `<div class="box">
      <img class="picon" src="assets/images/icon-repair.png" alt="Repairs" draggable="false">
      <span class="tag">Maintenance</span>
      <h1>Site under repairs</h1>
      <p>The website is closed for repairs and the weekly update. Install the update now, and the vault opens again on Thursday at 4:00 AM (Morocco time).</p>
      <button type="button" id="updGo">Update now</button></div>`;
    ov.querySelector('#updGo').addEventListener('click', () => { store.set(key, String(Date.now())); run(); });
  }
  /* night, update installed: the vault stays closed until 04:00 */
  function showVaultClosed() {
    stopLoop();
    ov.dataset.mode = 'vaultclosed';
    ov.innerHTML = `<div class="box">
      <img class="picon" src="assets/images/icon-repair.png" alt="Repairs" draggable="false">
      <span class="tag">Update installed</span>
      <h1>The vault is closed until 04:00</h1>
      <p>Your update is installed and ready. While you wait, our team is finishing the repairs and the last checks behind the scenes, so that everything is clean and stable when the vault opens.</p>
      <p>There is nothing else to do on your side. Come back at <b>4:00 AM (Morocco time)</b> and the vault will be open. If you leave this page open, it opens by itself at 04:00.</p>
      <p class="sig">Thank you for your patience. See you soon.<br>\u2014 Devs. Team</p></div>`;
  }
  function showWeekly(cycle) {
    ov.dataset.mode = 'weekly';
    const key = K_WSTART + cycle;
    const after = () => { store.set(K_CYCLE, cycle); close(); };
    const load = () => showLoading(key, 'Installing the weekly update. Please keep this page open.', 'The site is ready.', null, after);
    if (store.get(key)) { load(); return; }        /* update already running (page reloaded): resume */
    ov.innerHTML = `<div class="box">
      <span class="tag">Update available</span>
      <h1>Update now</h1>
      <p>The website is open again. A new update is ready: install it to continue.</p>
      <button type="button" id="updGo">Update now</button></div>`;
    ov.querySelector('#updGo').addEventListener('click', () => { store.set(key, String(Date.now())); load(); });
  }

  /* ---------- loading screen (shared) ---------- */
  /* the bar moves a little, stops for a moment, moves again... (no time, no percentage), and ends at 100% */
  const STEPS = [[0, 0], [.07, .11], [.15, .11], [.28, .36], [.37, .36], [.5, .57], [.6, .57], [.74, .8], [.84, .8], [.93, .96], [.97, .96], [1, 1]];
  function curve(p) {
    for (let i = 1; i < STEPS.length; i++) {
      if (p <= STEPS[i][0]) {
        const a = STEPS[i - 1], b = STEPS[i];
        const t = (p - a[0]) / (b[0] - a[0] || 1), e = t * t * (3 - 2 * t);      /* smoothstep: soft start, soft stop */
        return a[1] + (b[1] - a[1]) * e;
      }
    }
    return 1;
  }
  function showLoading(startKey, txt, doneTxt, onComplete, onContinue) {
    ov.innerHTML = `<div class="box">
      <div class="spin" id="updSpin"></div>
      <h1 id="updTitle">Updating…</h1>
      <p id="updTxt">${txt}</p>
      <div class="bar"><div class="fill" id="updFill"></div></div>
      <div class="warn" id="updWarn">Do not close or refresh this page</div>
    </div>`;
    const fill = ov.querySelector('#updFill');
    const CHECK = '<svg class="ok" viewBox="0 0 52 52" aria-hidden="true"><circle cx="26" cy="26" r="23"/><path d="M15 27l8 8 14-16"/></svg>';
    const swapText = (el, text) => { el.style.opacity = 0; setTimeout(() => { el.textContent = text; el.style.opacity = 1; }, 250); };
    function frame() {                                  /* runs on every screen refresh -> smooth bar */
      cancelAnimationFrame(raf);
      if (!ov || finished) return;
      const start = parseInt(store.get(startKey) || '0', 10) || Date.now();
      const p = Math.min(1, (Date.now() - start) / DURATION);
      fill.style.transform = 'scaleX(' + curve(p).toFixed(4) + ')';
      if (p >= 1) { finish(); return; }
      raf = requestAnimationFrame(frame);
    }
    let finished = false;
    function finish() {
      if (finished) return; finished = true;
      if (onComplete) onComplete();
      ov.querySelector('.bar').classList.add('done');
      ov.querySelector('#updSpin').outerHTML = CHECK;
      swapText(ov.querySelector('#updTitle'), 'Update complete');
      swapText(ov.querySelector('#updTxt'), doneTxt);
      ov.querySelector('#updWarn').outerHTML = '<button type="button" id="updOk" class="fadein" style="margin-top:26px">Continue</button>';
      ov.querySelector('#updOk').addEventListener('click', onContinue);
    }
    stopLoop();
    /* a hidden tab does not draw frames: this slow timer makes sure the update still finishes */
    timer = setInterval(() => { if (!document.hidden) return; frame(); }, 1000);
    frame();
  }

  /* ---------- decide what to show ---------- */
  function check() {
    const now = Date.now();
    if (isClosed(now)) {                              /* Wednesday 22:00 -> Thursday 04:00 */
      if (ov && ov.dataset.mode === 'updating-window') return;   /* the visitor is installing the update: do not interrupt */
      const up = upcomingCycle(now);
      const updated = store.get(K_DONE) === '1' && store.get(K_CYCLE) === up;
      const want = updated ? 'vaultclosed' : 'closed';
      if (!ov) open();
      if (ov.dataset.mode !== want) { if (updated) showVaultClosed(); else showClosed(up); }
      return;
    }
    if (ov && (ov.dataset.mode === 'closed' || ov.dataset.mode === 'vaultclosed')) close();   /* 04:00 arrived while the page was open */
    if (ov) return;                                   /* another notice is already open */
    const cur = cycleId(now);
    if (store.get(K_DONE) !== '1') {                  /* first visit */
      open(); ov.dataset.mode = 'first';
      if (store.get(K_START)) showLoading(K_START, 'Installing the official version. Please keep this page open.', 'The official version is ready.', ON_FIRST_DONE, () => { store.set(K_DONE, '1'); store.set(K_CYCLE, cycleId(Date.now())); close(); });
      else showNotice();
      return;
    }
    const mine = store.get(K_CYCLE);
    if (!mine) { store.set(K_CYCLE, cur); return; }   /* visitor from before the weekly updates existed */
    if (mine !== cur) { open(); showWeekly(cur); }    /* did not update during the night: UPDATE NOW */
  }
  check();
  setInterval(check, 15000);                          /* closing / opening time can arrive while the page is open */
})();
