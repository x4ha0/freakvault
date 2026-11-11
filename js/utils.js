const S=window.SITE,P=window.PRODUCTS,app=document.getElementById('app');
const gmail='https://mail.google.com/mail/?view=cm&fs=1&to='+S.email+'&su='+encodeURIComponent('FREAK inquiry');
const RM=matchMedia('(prefers-reduced-motion:reduce)').matches;
const TYPES={drumkit:'Drum Kits',soundpack:'Sound Packs',nejma:'NEJMA',preset:'Presets'};
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const pname=p=>p.volume?`${p.name} VOL.${p.volume}`:p.name;
const cnt=p=>p.sounds?`${p.sounds} ${p.unit||'sounds'}`:'Full kit';
const dl=p=>/FREE/i.test(p.price)?'DOWNLOAD':'GET THE KIT';
const soon=p=>p.status==='soon';
const live=u=>u&&!String(u).startsWith('#');
let STOCK_READY=false; /* true once the database has answered */
const STOCK={}; /* slug -> pieces already taken (filled from the database) */
const left=p=>p.stock?Math.max(0,p.stock-(STOCK[p.slug]||0)):null;
const out=p=>!!p.stock&&STOCK_READY&&left(p)===0;
const stockTxt=p=>!STOCK_READY?`${p.stock} PIECES`:left(p)===1?'1 PIECE AVAILABLE':left(p)+' PIECES AVAILABLE';
const dlBtn=(p,c='btn solid')=>out(p)?`<span class="${c} off" aria-disabled="true">OUT OF STOCK</span>`:live(p.url)?`<a class="${c}" ${ext(p.url)}${p.stock?` data-claim="${esc(p.slug)}"`:''}>${dl(p)}</a>`:`<span class="${c} off" aria-disabled="true">COMING SOON</span>`;
const ext=u=>`href="${esc(u)}" target="_blank" rel="noopener noreferrer"`;
