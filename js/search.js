/* search */
const sr=document.getElementById('search'),q=document.getElementById('q'),res=document.getElementById('results');
function openS(e){e&&e.preventDefault();closeMenu();sr.hidden=false;q.value='';draw('');q.focus()}
function closeS(){sr.hidden=true}
function draw(v){v=v.trim().toLowerCase();
  const m=P.filter(p=>!v||[p.name,p.category,p.description,p.includes.join(' '),'vol '+p.volume].join(' ').toLowerCase().includes(v));
  res.innerHTML=m.length?m.map(p=>soon(p)?`<li><a style="opacity:.45;pointer-events:none">${esc(pname(p))}<span>COMING SOON</span></a></li>`:`<li><a href="#/kit/${p.slug}">${esc(pname(p))}<span>${esc(p.category)} · ${esc(p.price)}</span></a></li>`).join(''):'<li class="empty">No results. Try "808", "trap" or "vol 2".</li>';}
document.querySelectorAll('[data-search]').forEach(b=>b.onclick=openS);
q.oninput=()=>draw(q.value);
sr.querySelector('[data-close]').onclick=closeS;
res.onclick=e=>{if(e.target.closest('a'))closeS()};
addEventListener('keydown',e=>{if(e.key==='Escape'){if(!document.getElementById('gate').hidden)return;closeS();closeLic();closeProf();closeMenu()}});
