/* After the vault form: the team icon rises from the bottom, stops, then floats gently up and down.
   Under it: the OFFICIAL UPDATE SCHEDULE. At the end of the text: READ TERMS.
   Then the Terms of Use. At the end: ACCEPT TERMS -> the site opens. */
(function () {
  const TEAM = 'assets/images/icon-team.png';
  const RISE_MS = 2200, BTN_MIN_MS = 3000;

  const css = `
#sch{position:fixed;inset:0;z-index:2147482000;background:#080808;color:#f0efeb;display:flex;padding:24px;overflow:hidden;font-family:"Archivo",Helvetica,Arial,sans-serif;opacity:0;transition:opacity .5s}
#sch.in{opacity:1}
#sch.scroll{overflow-y:auto}
#sch .box{width:100%;max-width:560px;margin:auto;text-align:center}
#sch .rise{animation:schrise ${RISE_MS}ms cubic-bezier(.16,.84,.3,1) both}
#sch .float{display:inline-block;animation:schfloat 3.4s ease-in-out ${RISE_MS}ms infinite}
#sch .icon{display:block;width:clamp(84px,20vw,112px);height:auto;margin:0 auto;user-select:none}
@keyframes schrise{from{transform:translateY(110vh)}to{transform:translateY(0)}}
@keyframes schfloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-14px)}}
#sch .txt{opacity:0;transform:translateY(14px);transition:opacity .9s,transform .9s;text-align:left;margin-top:38px}
#sch .txt.on{opacity:1;transform:none}
#sch h2{font-size:clamp(26px,6vw,38px);line-height:1;font-weight:900;letter-spacing:-.01em;text-transform:uppercase;margin:0 0 22px;text-align:center;max-width:none}
#sch h3{font-size:12px;font-weight:800;letter-spacing:.22em;text-transform:uppercase;margin:28px 0 12px;color:#f0efeb;max-width:none}
#sch p{font-size:14px;line-height:1.7;color:rgba(240,239,235,.74);margin:0 0 16px;max-width:none;text-align:left}
#sch p b{color:#fff;font-weight:800}
#sch .sig{margin-top:24px;font-weight:700;color:#f0efeb}
#sch pre{white-space:pre-wrap;word-break:break-word;font:inherit;font-size:13px;line-height:1.7;color:rgba(240,239,235,.74);margin:0;text-align:left}
#sch .terms{border-top:1px solid rgba(240,239,235,.16);padding-top:6px}
#sch .go{margin-top:30px;text-align:center;visibility:hidden;opacity:0;transition:opacity .5s}
#sch .go.on{visibility:visible;opacity:1}
#sch .hint{font-size:11px;font-weight:800;letter-spacing:.28em;text-transform:uppercase;color:rgba(240,239,235,.45);text-align:center;margin-top:26px}
#sch button{appearance:none;border:0;cursor:pointer;background:#f0efeb;color:#080808;font:inherit;font-size:12px;font-weight:800;letter-spacing:.22em;text-transform:uppercase;padding:18px 40px;width:100%;transition:background .2s}
#sch button:hover{background:#fff}
@media (prefers-reduced-motion:reduce){#sch .rise,#sch .float{animation:none}}`;

  const esc = s => String(s).replace(/[&<>]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));

  /* the site's own Terms of Use */
  function termsHtml() {
    let mail = 'freaksteammanaging@gmail.com';
    try { if (typeof S !== 'undefined' && S.email) mail = S.email; } catch (_) {}
    const sec = (t, ...ps) => `<h3>${t}</h3>` + ps.map(x => `<p>${x}</p>`).join('');
    return `<h2>Terms of Use</h2>
      <p>Please read these terms before using FREAKS VAULT. By pressing <b>Accept terms</b> you confirm that you have read them and agree to them.</p>
      <div class="terms">
        ${sec('1. Using the website', 'You may browse and use FREAKS VAULT for personal and educational purposes. You agree to use it in a lawful way and not to disrupt it, attack it, or try to access parts of it that are not meant for you.')}
        ${sec('2. Your vault information', 'To enter the vault you give your name, A.K.A, your role (producer or artist), your Spotify option and, if you want, a profile photo. We use this information to run the vault and to know who is using the website. Give only information that is true and that you are allowed to share.')}
        ${sec('3. Downloads and sounds', 'The drum kits, sound packs and presets are made by FREAK. You may use the sounds inside your own music. You may not resell, share, upload or redistribute the original sound files, alone or inside another pack, and you may not claim them as your own.')}
        ${sec('4. What is not allowed', 'You may not copy or redistribute the website design without permission, pretend to be FREAKS VAULT or its team, use the brand in a misleading way, or use the website for fraud or any harmful activity.')}
        ${sec('5. Updates and maintenance', 'The website is updated automatically every Thursday. During an update the website can be under maintenance and you may need to download and install the update before you can use it again. We recommend installing each update as soon as it is released.')}
        ${sec('6. Availability', 'The website is provided as it is. We work to keep it stable, but we cannot promise that it will always be available or free of errors, and we are not responsible for third-party services or links.')}
        ${sec('7. Changes to these terms', 'We can change these terms at any time. Continuing to use the website after a change means that you accept the new terms.')}
        ${sec('8. Contact', `For any question or to report a problem or a bug, write to <b>${esc(mail)}</b>.`)}
      </div>`;
  }

  window.showScheduleNotice = function () {
    if (document.getElementById('sch')) return;
    const st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);
    const ov = document.createElement('div');
    ov.id = 'sch'; ov.setAttribute('role', 'dialog'); ov.setAttribute('aria-modal', 'true');
    ov.innerHTML = `<div class="box">
      <div class="rise"><div class="float"><img class="icon" src="${TEAM}" alt="Team" draggable="false"></div></div>
      <div class="txt" id="schTxt">
        <h2>Official Update Schedule</h2>
        <p>Dear users,</p>
        <p>Our team would like to let you know that the website will be <b>updated automatically every Thursday</b> to bring in new features, improvements, bug fixes, and other enhancements.</p>
        <p>We strongly encourage all users to download and install each new update as soon as it is released. This is needed to make sure you always have access to the latest features and improvements.</p>
        <p>Thank you for your cooperation and your continued support.</p>
        <p class="sig">\u2014 Devs. Team</p>
      </div>
      <div class="hint" id="schHint">Scroll down \u2193</div>
      <div class="go" id="schGo"><button type="button" id="schBtn">Read terms</button></div></div>`;
    document.documentElement.appendChild(ov);
    try { document.body.inert = true; } catch (_) {}
    document.documentElement.style.overflow = 'hidden';
    requestAnimationFrame(() => ov.classList.add('in'));

    const txt = ov.querySelector('#schTxt'), go = ov.querySelector('#schGo'), btn = ov.querySelector('#schBtn'), hint = ov.querySelector('#schHint');
    let step = 1, ready = false, shown = false;

    /* the button shows up only when the visitor reached the end of what is on screen */
    function check() {
      if (shown || !ready) return;
      if (ov.scrollTop + ov.clientHeight >= ov.scrollHeight - 8) { shown = true; go.classList.add('on'); hint.style.visibility = 'hidden'; }
    }
    function arm(delay) { shown = false; ready = false; go.classList.remove('on'); hint.style.visibility = 'visible'; setTimeout(() => { ready = true; check(); }, delay); }
    ov.addEventListener('scroll', check, { passive: true });
    addEventListener('resize', check);

    setTimeout(() => ov.classList.add('scroll'), RISE_MS + 100);          /* scrolling only once the logo has landed */
    setTimeout(() => txt.classList.add('on'), RISE_MS - 600);
    arm(BTN_MIN_MS);

    btn.addEventListener('click', () => {
      if (step === 1) {                                                   /* READ TERMS */
        step = 2;
        txt.innerHTML = termsHtml();
        btn.textContent = 'Accept terms';
        ov.scrollTo(0, 0);
        arm(600);
        return;
      }
      /* ACCEPT TERMS */
      try { localStorage.setItem('freak_terms_accepted', new Date().toISOString()); } catch (_) {}
      ov.classList.remove('in');
      setTimeout(() => {
        ov.remove(); st.remove();
        document.documentElement.style.overflow = '';
        try { document.body.inert = !!document.getElementById('upd'); } catch (_) {}
        if (document.getElementById('upd')) document.documentElement.style.overflow = 'hidden';
        scrollTo(0, 0);
      }, 500);
    });
  };
})();
