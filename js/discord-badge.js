const dlg=document.querySelector('.dlogo');
if(dlg)new IntersectionObserver((es,o)=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');o.unobserve(e.target)}}),{threshold:.3}).observe(dlg);
