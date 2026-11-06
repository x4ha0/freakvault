function wireDrop(){
  const dz=document.getElementById('drop');if(!dz)return;
  const f=document.getElementById('dropF'),t=document.getElementById('dropT'),sm=document.getElementById('dropS');
  const take=file=>{
    if(!file)return;
    t.textContent='BEAT RECEIVED';
    sm.textContent=file.name+' · Opening the UNTITLED project. Upload it there.';
    dz.classList.add('over');
    /* open in a NEW tab (fallback to same tab only if the browser blocks pop-ups) */
    const w=window.open(S.untitled,'_blank','noopener,noreferrer');
    if(!w)setTimeout(()=>{location.href=S.untitled},1500);
  };
  dz.onclick=()=>f.click();
  dz.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();f.click()}};
  f.onchange=()=>take(f.files[0]);
  ['dragenter','dragover'].forEach(v=>dz.addEventListener(v,e=>{e.preventDefault();dz.classList.add('over')}));
  dz.addEventListener('dragleave',()=>dz.classList.remove('over'));
  dz.addEventListener('drop',e=>{e.preventDefault();take(e.dataTransfer.files&&e.dataTransfer.files[0]||{name:'your beat'})});
}

let io;
function wire(){
  io&&io.disconnect();
  io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.15});
  document.querySelectorAll('.pagehead h1,.card,.three>div,.why h2,.about-intro>div,.detail>div,.edit h2,.edit p,.edit .btn,.contact>*,.soonbig,.drop,.cta2').forEach((el,i)=>{el.classList.add('rv');el.style.transitionDelay=(i%4*.09)+'s'});
  document.querySelectorAll('.reveal,.rv').forEach(el=>RM?el.classList.add('in'):io.observe(el));
  const hr=document.querySelector('.hero.lt');
  if(hr&&!RM&&!matchMedia('(pointer:coarse)').matches)hr.onmousemove=e=>{const r=hr.getBoundingClientRect();hr.style.setProperty('--mx',((e.clientX-r.left)/r.width-.5).toFixed(3));hr.style.setProperty('--my',((e.clientY-r.top)/r.height-.5).toFixed(3))};
  const bg=document.querySelector('.edit .bg');
  if(bg&&!RM)window.onscroll=()=>{const r=bg.parentNode.getBoundingClientRect();if(r.bottom>0&&r.top<innerHeight)bg.style.transform=`translateY(${(-r.top*.12).toFixed(1)}px)`};
  else window.onscroll=null;
}
