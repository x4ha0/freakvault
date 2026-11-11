/* static links */
document.querySelectorAll('[data-discord]').forEach(a=>a.href=S.discord);
document.querySelectorAll('[data-report]').forEach(a=>{a.href=S.discord;a.target='_blank';a.rel='noopener noreferrer'});
/* social links: logo for known networks, plain text for the others */
const ICONS={
  discord:'<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M5 5.5C7 4 9 3.4 9.6 3.3L10.2 4.5C11.4 4.3 12.6 4.3 13.8 4.5L14.4 3.3C15 3.4 17 4 19 5.5C21 8.5 21.8 12 21.4 16.5C19.8 17.8 18.2 18.6 16.6 19.1L15.6 17.6C16.2 17.4 16.8 17.1 17.3 16.8L16.7 16.3C13.8 17.7 10.2 17.7 7.3 16.3L6.7 16.8C7.2 17.1 7.8 17.4 8.4 17.6L7.4 19.1C5.8 18.6 4.2 17.8 2.6 16.5C2.2 12 3 8.5 5 5.5Z"/><ellipse cx="9" cy="12.2" rx="1.7" ry="1.9" style="fill:var(--bk)"/><ellipse cx="15" cy="12.2" rx="1.7" ry="1.9" style="fill:var(--bk)"/></svg>',
  instagram:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4.1"/><circle cx="17.4" cy="6.6" r="1.1" fill="currentColor" stroke="none"/></svg>',
  youtube:'<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>'
};
document.getElementById('social').innerHTML=Object.entries(S.social).map(([n,u])=>{
  const ic=ICONS[n.toLowerCase()];
  return `<a href="${esc(u)}" target="_blank" rel="noopener" aria-label="${esc(n)}" title="${esc(n)}"${ic?' class="soc"':''}>${ic||esc(n)}</a>`;
}).join('');
document.getElementById('year').textContent=new Date().getFullYear();
document.querySelectorAll('[data-mailto]').forEach(a=>{a.href=gmail;a.target='_blank';a.rel='noopener'});
