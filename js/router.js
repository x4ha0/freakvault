let cur=null;
function render(h){
  const [a,b]=(h||'').replace(/^#\/?/,'').split('/');
  const prod=a==='kit'&&P.find(p=>p.slug===b&&!soon(p));
  const page=a==='c'&&TYPES[b]?'c/'+b:prod?'kit/'+b:(a==='about'||a==='contact'||a==='collection')?a:'home';
  const sc=null;
  if(page===cur){sc?document.getElementById(sc)?.scrollIntoView():scrollTo(0,0);closeMenu();return}
  cur=page;
  const html=page==='home'?home():page==='about'?aboutSec():page==='contact'?contactSec():page==='collection'?collSec():page.startsWith('c/')?cat(b):detail(prod);
  app.style.opacity=0;
  setTimeout(()=>{
    app.innerHTML=html;document.title=prod?`${pname(prod)} — FREAK`:'FREAK — Drum Kits, Sound Packs & Presets for Producers';
    app.style.opacity=1;
    sc?document.getElementById(sc)?.scrollIntoView():scrollTo(0,0);
    wire();closeMenu();wireDrop();
    document.querySelectorAll('.links a').forEach(l=>l.classList.toggle('on',l.getAttribute('href')===(page==='home'?'#/':'#/'+page)));
  },RM?0:220);
}
document.addEventListener('click',e=>{
  const l=e.target.closest('a[href^="#/"]');if(!l||e.metaKey||e.ctrlKey||e.shiftKey)return;
  e.preventDefault();const h=l.getAttribute('href');
  try{history.pushState(null,'',h)}catch(_){try{location.hash=h}catch(_2){}}
  render(h);
});
document.addEventListener('click',e=>{
  const b=e.target.closest('[data-copy]');if(!b)return;const t=b.dataset.copy,o=b.textContent;
  const done=()=>{b.textContent='COPIED';setTimeout(()=>{b.textContent=o},1800)};
  const fb=()=>{const x=document.createElement('textarea');x.value=t;document.body.appendChild(x);x.select();try{document.execCommand('copy');done()}catch(_){}x.remove()};
  if(navigator.clipboard&&navigator.clipboard.writeText)navigator.clipboard.writeText(t).then(done,fb);else fb();
});
addEventListener('popstate',()=>render(location.hash));
addEventListener('hashchange',()=>render(location.hash));
app.style.transition=RM?'none':'opacity .25s';
