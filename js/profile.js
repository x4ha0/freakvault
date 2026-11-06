const KEY='freak_vault_profile';
/* Durable profile storage. Layers (first that works wins):
   1) localStorage  2) sessionStorage  3) cookie (small copy, no photo, 1 year)
   Saved on "ENTER THE VAULT"; the visitor stays logged in until LOG OUT. */
const okP=o=>o&&typeof o==='object'&&o.name&&o.aka?o:null;
const ck={
  get(){try{const m=document.cookie.match(new RegExp('(?:^|; )'+KEY+'=([^;]*)'));return m?JSON.parse(decodeURIComponent(m[1])):null}catch(_){return null}},
  set(p){try{const s=encodeURIComponent(JSON.stringify({name:p.name,aka:p.aka,role:p.role,spot:p.spot}));if(s.length<3500)document.cookie=KEY+'='+s+'; max-age=31536000; path=/; SameSite=Lax'}catch(_){}},
  del(){try{document.cookie=KEY+'=; max-age=0; path=/; SameSite=Lax'}catch(_){}}
};
const getP=()=>{
  for(const st of ['localStorage','sessionStorage']){
    try{const v=okP(JSON.parse(window[st].getItem(KEY)||'null'));if(v)return v}catch(_){}
  }
  return okP(ck.get());
};
const setP=p=>{
  if(!p){
    for(const st of ['localStorage','sessionStorage']){try{window[st].removeItem(KEY)}catch(_){}}
    ck.del();return true;
  }
  const s=JSON.stringify(p);
  try{localStorage.setItem(KEY,s)}catch(_){
    /* quota: retry without the photo so the rest of the profile is still kept */
    try{localStorage.setItem(KEY,JSON.stringify({...p,photo:''}))}catch(_2){}
  }
  try{sessionStorage.setItem(KEY,s)}catch(_){}
  ck.set(p);
  return !!getP();
};
try{navigator.storage&&navigator.storage.persist&&navigator.storage.persist()}catch(_){}
let me=getP();
function posFix(){
  const fx=document.getElementById('pfFix'),ph=document.querySelector('.nav .pf');
  if(!fx||!ph)return;
  const r=ph.getBoundingClientRect();
  if(!me||!r.width){fx.hidden=true;return}
  fx.hidden=false;fx.style.left=r.left+'px';fx.style.top=(r.top+(r.height-34)/2)+'px';
  const ini=(me.aka||me.name||'?').trim().charAt(0).toUpperCase();
  if(me.photo){fx.textContent='';fx.style.backgroundImage='url("'+me.photo+'")'}else{fx.textContent=ini;fx.style.backgroundImage=''}
}
function paintProfile(){
  document.querySelectorAll('.nav .pf').forEach(p=>p.classList.toggle('ghost',!!me));
  document.querySelectorAll('.pfn').forEach(n=>n.textContent=me?'':'Profile');
  document.querySelectorAll('.pf-m').forEach(n=>n.textContent='Profile');
  posFix();
}
addEventListener('resize',posFix);addEventListener('load',posFix);
if(document.fonts&&document.fonts.ready)document.fonts.ready.then(posFix);
function openProf(e){
  e&&e.preventDefault();closeMenu();
  if(!me){openGate(true);return}
  const av=document.getElementById('pAvatar');av.textContent='';
  if(me.photo){const im=new Image();im.src=me.photo;im.alt='';av.appendChild(im)}else av.textContent=(me.aka||me.name).trim().charAt(0).toUpperCase();
  document.getElementById('pName').textContent=me.name;
  document.getElementById('pAka').textContent='A.K.A '+me.aka;
  document.getElementById('pRole').textContent=me.role;
  document.getElementById('pSpot').textContent=me.spot;
  prof.hidden=false;lockB();
}
function closeProf(){prof.hidden=true;unlockB()}
document.querySelectorAll('[data-profile]').forEach(b=>b.onclick=openProf);
prof.querySelector('[data-pclose]').onclick=closeProf;
prof.addEventListener('click',e=>{if(e.target===prof)closeProf()});
document.getElementById('pOut').onclick=()=>{setP(null);me=null;resetGateForm();paintProfile();closeProf();openGate(true)};
paintProfile();
