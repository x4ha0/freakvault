const steps=[...gate.querySelectorAll('.gs')];
let gStep=-1;
function showStep(n){steps.forEach(s=>s.classList.toggle('show',+s.dataset.step===n));gStep=n}
function openGate(skipWelcome){
  gate.hidden=false;lockB();gate.classList.remove('out');
  const focusCode=()=>setTimeout(()=>{try{document.getElementById('gCodeIn').focus({preventScroll:true})}catch(_){}},1700);
  if(skipWelcome||RM){setTimeout(()=>{showStep(1);focusCode()},60);return}
  setTimeout(()=>showStep(0),120);
  setTimeout(()=>showStep(-1),2900);
  setTimeout(()=>{showStep(1);focusCode()},3300);
}
function checkCode(e){
  e&&e.preventDefault();
  const clean=x=>String(x||'').toUpperCase().replace(/[^A-Z0-9]/g,'');
  const inp=document.getElementById('gCodeIn'),err=document.getElementById('gErr'),f=document.getElementById('gCode');
  if(gStep!==1)return;
  if(clean(inp.value)===clean(S.vaultCode||'UNLOCKSAUCE')){
    gStep=1.5;inp.blur();err.classList.remove('bad');err.classList.add('ok');err.textContent='ACCESS GRANTED';
    f.classList.add('granted');
    setTimeout(()=>showStep(-1),1100);
    setTimeout(()=>{showStep(2);setTimeout(()=>{try{document.getElementById('gName').focus({preventScroll:true})}catch(_){}},1700)},1500);
  }else{
    err.classList.remove('ok');err.textContent='WRONG CODE. TRY AGAIN.';
    f.classList.remove('shake');void f.offsetWidth;f.classList.add('shake');
  }
}
document.getElementById('gCode').onsubmit=checkCode;
document.getElementById('gUnlock').onclick=checkCode;
let role='',spot='';
const optSpot=document.getElementById('optSpot'),gGo=document.getElementById('gGo'),gSpot=document.getElementById('gSpot');
if(gSpot)gSpot.href=S.spotifyProfile||'https://open.spotify.com/search/FREAK';
const syncSpot=()=>{if(gSpot)gSpot.classList.toggle('hid',spot!=='No Spotify access')};
gate.querySelectorAll('[data-role]').forEach(b=>b.onclick=()=>{
  role=b.dataset.role;{const m=document.getElementById('gErr2');if(m.classList.contains('ok')){m.textContent='';m.classList.remove('ok')}}gate.querySelectorAll('[data-role]').forEach(x=>x.classList.toggle('sel',x===b));
  optSpot.classList.remove('hid');
});
gate.querySelectorAll('[data-spot]').forEach(b=>b.onclick=()=>{
  spot=b.dataset.spot;gate.querySelectorAll('[data-spot]').forEach(x=>x.classList.toggle('sel',x===b));
  gGo.classList.remove('hid');syncSpot();
});
let photo='';
const loadScript=u=>new Promise((ok,no)=>{const x=document.createElement('script');x.src=u;x.onload=ok;x.onerror=no;document.head.appendChild(x)});
const readURL=f=>new Promise((ok,no)=>{const r=new FileReader();r.onload=()=>ok(r.result);r.onerror=no;r.readAsDataURL(f)});
const imgFrom=src=>new Promise((ok,no)=>{const i=new Image();i.onload=()=>ok(i);i.onerror=no;i.src=src});
async function decodeImage(f){
  try{return await createImageBitmap(f,{imageOrientation:'from-image'})}catch(_){}
  try{return await createImageBitmap(f)}catch(_){}
  const u=URL.createObjectURL(f);
  try{return await imgFrom(u)}catch(_){}finally{URL.revokeObjectURL(u)}
  try{return await imgFrom(await readURL(f))}catch(_){}
  if(/heic|heif/i.test((f.type||'')+' '+f.name)){
    if(!window.heic2any)await loadScript('https://cdn.jsdelivr.net/npm/heic2any@0.0.4/dist/heic2any.min.js');
    let out=await window.heic2any({blob:f,toType:'image/jpeg',quality:.85});
    out=Array.isArray(out)?out[0]:out;
    return await createImageBitmap(out);
  }
  throw new Error('undecodable');
}
document.getElementById('gPhoto').onchange=async function(){
  const inp=this,f=inp.files&&inp.files[0],err=document.getElementById('gErr2'),av=document.getElementById('gAv');
  if(!f)return;
  err.textContent='';av.classList.add('wait');
  try{
    const im=await decodeImage(f);
    const w=im.width||im.naturalWidth||300,h=im.height||im.naturalHeight||300;
    const N=256,c=document.createElement('canvas');c.width=c.height=N;
    const side=Math.min(w,h),sx=(w-side)/2,sy=(h-side)/2;
    const x=c.getContext('2d');x.fillStyle='#151515';x.fillRect(0,0,N,N);x.drawImage(im,sx,sy,side,side,0,0,N,N);
    if(im.close)im.close();
    photo=c.toDataURL('image/jpeg',.82);
    av.style.backgroundImage='url("'+photo+'")';av.classList.add('has');av.innerHTML='';
  }catch(_){
    err.textContent='THIS PHOTO CANNOT BE READ. TRY ANOTHER ONE, OR CONTINUE WITHOUT A PHOTO.';
  }
  av.classList.remove('wait');inp.value='';
};
/* Firebase: the module in index.html defines window.fbSaveMember (saves the member in Firestore) */
function saveMember(m){
  const go=()=>{
    window.fbSaveMember(m)
      .then(()=>console.log('FREAK: member saved in Firebase'))
      .catch(e=>console.error('FREAK: Firebase did NOT save the member:',e&&e.code,e&&e.message));
  };
  try{
    if(window.fbSaveMember){go();return}
    /* Firebase module may still be loading: wait up to 10s for it */
    let done=false;
    const on=()=>{if(done)return;done=true;go()};
    addEventListener('fb-ready',on,{once:true});
    setTimeout(()=>{if(!done){done=true;console.error('FREAK: Firebase is not loaded, member NOT saved. Reason:',window.__fbError&&(window.__fbError.message||window.__fbError))}},10000);
  }catch(e){console.error('FREAK: save error',e)}
}
function enterVault(e){
  e&&e.preventDefault();
  if(gate.classList.contains('out'))return;
  const name=document.getElementById('gName').value.trim(),aka=document.getElementById('gAka').value.trim(),err=document.getElementById('gErr2');err.classList.remove('ok');
  if(!name||!aka){err.textContent='FILL YOUR NAME AND A.K.A.';return}
  if(!role){err.textContent='CHOOSE PRODUCER OR ARTIST.';return}
  if(!spot){err.textContent='CHOOSE YOUR SPOTIFY OPTION.';return}
  err.textContent='';
  me={name,aka,role,spot,photo};
  const saved=setP(me);saveMember(me);paintProfile();
  if(!saved)console.warn('FREAK: this browser blocks storage, the profile will not be remembered after closing the tab.');
  try{document.activeElement&&document.activeElement.blur()}catch(_){}
  showStep(-1);
  setTimeout(()=>{gate.classList.add('out');document.body.classList.add('ready')},RM?0:700);
  setTimeout(()=>{gate.hidden=true;unlockB();scrollTo(0,0);if(window.showScheduleNotice)window.showScheduleNotice()},RM?50:2100);
}
/* ENTER WITH GOOGLE: fills the name, A.K.A and photo from the Google account */
const gGoogle=document.getElementById('gGoogle');
function googlePhoto(url){return new Promise(res=>{
  const im=new Image();im.crossOrigin='anonymous';
  im.onload=()=>{try{const N=256,c=document.createElement('canvas');c.width=c.height=N;const s=Math.min(im.width,im.height);c.getContext('2d').drawImage(im,(im.width-s)/2,(im.height-s)/2,s,s,0,0,N,N);res(c.toDataURL('image/jpeg',.82))}catch(_){res(url)}};
  im.onerror=()=>res(url);im.src=url.replace(/=s\d+-c/,'=s256-c');
})}
if(gGoogle)gGoogle.onclick=async()=>{
  const err=document.getElementById('gErr2');err.textContent='';err.classList.remove('ok');
  if(!window.fbGoogleSignIn){err.textContent='GOOGLE SIGN-IN IS NOT AVAILABLE RIGHT NOW. FILL IN YOUR INFO BELOW.';return}
  gGoogle.disabled=true;
  try{
    const u=await window.fbGoogleSignIn();
    const nm=(u.name||'').trim().slice(0,40);
    if(nm){document.getElementById('gName').value=nm;const ak=document.getElementById('gAka');if(!ak.value.trim())ak.value=nm}
    if(u.photo){
      photo=await googlePhoto(u.photo);
      const av=document.getElementById('gAv');av.style.backgroundImage='url("'+photo+'")';av.classList.add('has');av.innerHTML=''
    }
    /* quick entry: Google gives name + photo, so skip the form and save the member right away */
    const gname=nm||'Guest';
    me={name:gname,aka:gname,role:'Member',spot:'Google account',photo};
    setP(me);saveMember(me);paintProfile();
    try{document.activeElement&&document.activeElement.blur()}catch(_){}
    showStep(-1);
    setTimeout(()=>{gate.classList.add('out');document.body.classList.add('ready')},RM?0:700);
    setTimeout(()=>{gate.hidden=true;unlockB();scrollTo(0,0);if(window.showScheduleNotice)window.showScheduleNotice()},RM?50:2100);
  }catch(e){
    const c=(e&&e.code)||'';
    if(c==='auth/popup-closed-by-user'||c==='auth/cancelled-popup-request'){err.textContent=''}
    else if(c==='auth/popup-blocked'){err.textContent='YOUR BROWSER BLOCKED THE GOOGLE POPUP. ALLOW POPUPS AND TRY AGAIN.'}
    else{err.textContent='GOOGLE SIGN-IN FAILED. FILL IN YOUR INFO BELOW.'}
  }
  gGoogle.disabled=false;
};
document.getElementById('gForm').onsubmit=enterVault;
gGo.onclick=enterVault;
/* LOG OUT: wipe the form so the next visitor starts from zero */
const gAvHTML=document.getElementById('gAv').innerHTML;
function resetGateForm(){
  ['gName','gAka','gCodeIn'].forEach(id=>{const i=document.getElementById(id);if(i)i.value=''});
  role='';spot='';photo='';
  gate.querySelectorAll('[data-role],[data-spot]').forEach(x=>x.classList.remove('sel'));
  optSpot.classList.add('hid');gGo.classList.add('hid');syncSpot();
  const av=document.getElementById('gAv');
  if(av){av.style.backgroundImage='';av.classList.remove('has','wait');av.innerHTML=gAvHTML}
  ['gErr','gErr2'].forEach(id=>{const e=document.getElementById(id);if(e)e.textContent=''});
  const f=document.getElementById('gCode');if(f)f.classList.remove('granted','shake');
}
