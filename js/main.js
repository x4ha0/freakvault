/* start */
render(location.hash);
const loader=document.getElementById('loader');
function go(){loader.classList.add('done');document.body.classList.add('ready');setTimeout(()=>loader.remove(),1000)}
if(!me){loader.remove();openGate(false)}
else if(RM)go();else addEventListener('load',()=>setTimeout(go,700));
