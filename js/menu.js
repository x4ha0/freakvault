/* menu */
const burger=document.getElementById('burger'),links=document.getElementById('links');
function closeMenu(){links.classList.remove('open');burger.setAttribute('aria-expanded','false');if(!document.querySelector('.gate:not([hidden]),.lic:not([hidden]),.prof:not([hidden])'))document.body.style.overflow=''}
burger.onclick=()=>{const o=!links.classList.contains('open');links.classList.toggle('open',o);burger.setAttribute('aria-expanded',o);document.body.style.overflow=o?'hidden':''};
