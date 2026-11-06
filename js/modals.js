/* license + profile + vault gate */
const lic=document.getElementById('license'),prof=document.getElementById('profile'),gate=document.getElementById('gate');
const lockB=()=>{document.body.style.overflow='hidden'};
const unlockB=()=>{if(!document.querySelector('.gate:not([hidden]),.lic:not([hidden]),.prof:not([hidden])')&&!links.classList.contains('open'))document.body.style.overflow=''};
function openLic(e){e&&e.preventDefault();lic.hidden=false;lockB();lic.scrollTop=0}
function closeLic(){lic.hidden=true;unlockB()}
document.querySelectorAll('[data-license]').forEach(b=>b.onclick=openLic);
lic.querySelector('[data-lclose]').onclick=closeLic;
lic.addEventListener('click',e=>{if(e.target===lic)closeLic()});
