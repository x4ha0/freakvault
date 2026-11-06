/* static links */
document.querySelectorAll('[data-discord]').forEach(a=>a.href=S.discord);
document.querySelectorAll('[data-mail]').forEach(a=>{a.href=gmail;a.target='_blank';a.rel='noopener'});
/* social links: logo for known networks, plain text for the others */
const ICONS={
  youtube:'<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>'
};
document.getElementById('social').innerHTML=Object.entries(S.social).map(([n,u])=>{
  const ic=ICONS[n.toLowerCase()];
  return `<a href="${esc(u)}" target="_blank" rel="noopener" aria-label="${esc(n)}" title="${esc(n)}"${ic?' class="soc"':''}>${ic||esc(n)}</a>`;
}).join('');
document.getElementById('year').textContent=new Date().getFullYear();
document.querySelectorAll('[data-mailto]').forEach(a=>{a.href=gmail;a.target='_blank';a.rel='noopener'});
