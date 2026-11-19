/* Every link that leaves the site opens in a NEW tab (so the visitor keeps FREAK open).
   Internal links (#/..., same site) are not touched. Works for links added later too. */
(function(){
  const isExt=a=>{
    const h=a.getAttribute('href');
    if(!h||h.charAt(0)==='#'||/^(mailto|tel|javascript):/i.test(h))return false;
    try{const u=new URL(a.href,location.href);return /^https?:$/.test(u.protocol)&&u.origin!==location.origin}catch(_){return false}
  };
  const fix=a=>{if(isExt(a)){a.target='_blank';a.rel='noopener noreferrer'}};
  const all=(root)=>(root||document).querySelectorAll('a[href]').forEach(fix);
  all();
  /* links injected later (pages, search results, social icons) */
  new MutationObserver(m=>m.forEach(r=>r.addedNodes.forEach(n=>{
    if(n.nodeType!==1)return;
    if(n.matches&&n.matches('a[href]'))fix(n);
    n.querySelectorAll&&all(n);
  }))).observe(document.documentElement,{childList:true,subtree:true});
  /* safety net: fix the link right before the click is handled */
  document.addEventListener('click',e=>{const a=e.target.closest&&e.target.closest('a[href]');if(a)fix(a)},true);
})();
