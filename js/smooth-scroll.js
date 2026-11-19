/* smooth scrolling (eased wheel scroll, desktop only) */
(function(){
  if(RM||matchMedia('(pointer:coarse)').matches)return;
  let target=scrollY,cur=scrollY,raf=0;
  const max=()=>document.documentElement.scrollHeight-innerHeight;
  const tick=()=>{
    if(Math.abs(scrollY-cur)>3){target=cur=scrollY;raf=0;return}
    cur+=(target-cur)*0.085;
    if(Math.abs(target-cur)<.4){cur=target;raf=0}else raf=requestAnimationFrame(tick);
    scrollTo({top:cur,behavior:'instant'});
  };
  addEventListener('wheel',e=>{
    if(e.ctrlKey||e.defaultPrevented||e.target.closest('#search,#license,#profile,#gate')||document.body.style.overflow==='hidden')return;
    e.preventDefault();
    if(!raf){target=cur=scrollY}
    target=Math.max(0,Math.min(max(),target+e.deltaY*(e.deltaMode===1?34:1)));
    if(!raf)raf=requestAnimationFrame(tick);
  },{passive:false});
})();
