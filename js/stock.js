/* limited stock: a kit with `stock: N` can be downloaded N times, then it shows OUT OF STOCK.
   The counter lives in Firestore (collection "stock", doc = kit slug) so it is shared by every visitor. */
(function(){
  const limited=P.filter(p=>p.stock);
  if(!limited.length)return;
  const GUARD='freak_claimed_';                       /* the same browser only uses up one piece */
  const mine=slug=>{try{return localStorage.getItem(GUARD+slug)==='1'}catch(_){return false}};
  const mark=slug=>{try{localStorage.setItem(GUARD+slug,'1')}catch(_){}};
  let loaded=false;
  async function load(){
    if(loaded||!window.fbStockGet)return;loaded=true;
    try{
      let changed=false;
      for(const p of limited){const n=await window.fbStockGet(p.slug);if(STOCK[p.slug]!==n){STOCK[p.slug]=n;changed=true}}
      STOCK_READY=true;refreshView();
    }catch(_){loaded=false}
  }
  window.addEventListener('fb-ready',load);load();
  /* the click itself is a plain link opening a new tab (nothing is intercepted), the piece is counted in the background */
  document.addEventListener('click',async e=>{
    const a=e.target.closest('[data-claim]');if(!a||!window.fbStockClaim)return;
    const slug=a.dataset.claim,p=P.find(x=>x.slug===slug);if(!p)return;
    if(mine(slug)&&!window.STOCK_DEMO)return;                 /* this browser already took its piece */
    try{
      const r=await window.fbStockClaim(slug,p.stock);
      STOCK[slug]=r.sold;if(r.ok)mark(slug);
      refreshView();
    }catch(_){}                                               /* database unreachable: the download still works */
  });
})();
